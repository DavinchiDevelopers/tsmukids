<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '' && (str_contains($origin, 'localhost') || str_contains($origin, $host) || str_contains($origin, 'tsmukids.uz'))) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$config = require __DIR__ . '/config.php';
session_name($config['session_name'] ?? 'tsmukids_admin');
session_set_cookie_params([
    'lifetime' => 60 * 60 * 12,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
]);
session_start();

const COLLECTIONS = ['doctors', 'services', 'departments', 'equipment', 'gallery'];

function data_dir(): string {
    return realpath(__DIR__ . '/../data') ?: (__DIR__ . '/../data');
}

function site_path(): string {
    return data_dir() . '/site.json';
}

function appointments_path(): string {
    return data_dir() . '/appointments.json';
}

function read_json(string $path, mixed $default = []) {
    if (!is_file($path)) {
        return $default;
    }
    $raw = file_get_contents($path);
    if ($raw === false || $raw === '') {
        return $default;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $default;
}

function write_json(string $path, mixed $data): void {
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) {
        throw new RuntimeException('JSON encode failed');
    }
    $tmp = $path . '.tmp';
    if (file_put_contents($tmp, $json . "\n", LOCK_EX) === false) {
        throw new RuntimeException('Write failed');
    }
    if (!rename($tmp, $path)) {
        throw new RuntimeException('Rename failed');
    }
}

function read_site(): array {
    $site = read_json(site_path(), []);
    foreach (COLLECTIONS as $c) {
        if (!isset($site[$c]) || !is_array($site[$c])) {
            $site[$c] = [];
        }
    }
    if (!isset($site['settings']) || !is_array($site['settings'])) {
        $site['settings'] = [];
    }
    return $site;
}

function write_site(array $site): void {
    write_json(site_path(), $site);
}

function json_body(): array {
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function respond(mixed $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function require_auth(): void {
    if (empty($_SESSION['admin'])) {
        respond(['error' => 'Unauthorized'], 401);
    }
}

function new_id(): string {
    try {
        return bin2hex(random_bytes(8));
    } catch (Throwable $e) {
        return uniqid('id_', true);
    }
}

function send_telegram(string $token, string $chatId, string $text): void {
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    $payload = json_encode(['chat_id' => $chatId, 'text' => $text, 'parse_mode' => 'HTML']);
    $ctx = stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\n",
            'content' => $payload,
            'timeout' => 5,
            'ignore_errors' => true,
        ],
    ]);
    @file_get_contents($url, false, $ctx);
}

function sort_by_order(array $items): array {
    usort($items, static function ($a, $b) {
        $ao = is_array($a) ? (int)($a['order'] ?? 0) : 0;
        $bo = is_array($b) ? (int)($b['order'] ?? 0) : 0;
        if ($ao === $bo) {
            return strcmp((string)($a['id'] ?? ''), (string)($b['id'] ?? ''));
        }
        return $ao <=> $bo;
    });
    return $items;
}

$route = $_GET['r'] ?? 'site';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    // ── Auth ──────────────────────────────────────────────────────────────
    if ($route === 'auth/login' && $method === 'POST') {
        $body = json_body();
        $email = trim((string)($body['email'] ?? ''));
        $password = (string)($body['password'] ?? '');
        if (
            strcasecmp($email, (string)$config['admin_email']) === 0
            && password_verify($password, (string)$config['admin_password_hash'])
        ) {
            $_SESSION['admin'] = $email;
            respond(['ok' => true, 'email' => $email]);
        }
        respond(['error' => 'Неверный email или пароль'], 401);
    }

    if ($route === 'auth/logout' && $method === 'POST') {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'] ?? '', (bool)$p['secure'], (bool)$p['httponly']);
        }
        session_destroy();
        respond(['ok' => true]);
    }

    if ($route === 'auth/me' && $method === 'GET') {
        if (!empty($_SESSION['admin'])) {
            respond(['ok' => true, 'email' => $_SESSION['admin']]);
        }
        respond(['ok' => false], 401);
    }

    // ── Public site dump ──────────────────────────────────────────────────
    if ($route === 'site' && $method === 'GET') {
        $site = read_site();
        foreach (COLLECTIONS as $c) {
            $site[$c] = sort_by_order($site[$c]);
        }
        respond($site);
    }

    if ($route === 'settings' && $method === 'GET') {
        respond(read_site()['settings'] ?? new stdClass());
    }

    if ($route === 'settings' && $method === 'PUT') {
        require_auth();
        $site = read_site();
        $site['settings'] = json_body();
        write_site($site);
        respond(['ok' => true]);
    }

    // ── Collections CRUD ──────────────────────────────────────────────────
    if ($route === 'collection') {
        $name = (string)($_GET['name'] ?? '');
        if (!in_array($name, COLLECTIONS, true)) {
            respond(['error' => 'Unknown collection'], 400);
        }

        if ($method === 'GET') {
            $items = sort_by_order(read_site()[$name] ?? []);
            respond($items);
        }

        require_auth();
        $site = read_site();
        $items = $site[$name] ?? [];

        if ($method === 'POST') {
            $body = json_body();
            unset($body['id']);
            $id = new_id();
            $item = array_merge($body, ['id' => $id]);
            $items[] = $item;
            $site[$name] = $items;
            write_site($site);
            respond(['id' => $id, 'item' => $item], 201);
        }

        $id = (string)($_GET['id'] ?? '');
        if ($id === '') {
            respond(['error' => 'id required'], 400);
        }

        if ($method === 'PUT') {
            $body = json_body();
            $found = false;
            foreach ($items as $i => $item) {
                if (($item['id'] ?? '') === $id) {
                    $body['id'] = $id;
                    $items[$i] = array_merge($item, $body);
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                respond(['error' => 'Not found'], 404);
            }
            $site[$name] = $items;
            write_site($site);
            respond(['ok' => true]);
        }

        if ($method === 'DELETE') {
            $before = count($items);
            $items = array_values(array_filter($items, static fn($it) => ($it['id'] ?? '') !== $id));
            if (count($items) === $before) {
                respond(['error' => 'Not found'], 404);
            }
            $site[$name] = $items;
            write_site($site);
            respond(['ok' => true]);
        }
    }

    // Bulk replace collection (services import)
    if ($route === 'collection/replace' && $method === 'POST') {
        require_auth();
        $name = (string)($_GET['name'] ?? '');
        if (!in_array($name, COLLECTIONS, true)) {
            respond(['error' => 'Unknown collection'], 400);
        }
        $body = json_body();
        $list = $body['items'] ?? $body;
        if (!is_array($list)) {
            respond(['error' => 'items array required'], 400);
        }
        $normalized = [];
        foreach ($list as $item) {
            if (!is_array($item)) {
                continue;
            }
            if (empty($item['id'])) {
                $item['id'] = new_id();
            }
            $normalized[] = $item;
        }
        $site = read_site();
        $site[$name] = $normalized;
        write_site($site);
        respond(['ok' => true, 'count' => count($normalized)]);
    }

    // ── Appointments ──────────────────────────────────────────────────────
    if ($route === 'appointments' && $method === 'GET') {
        require_auth();
        $list = read_json(appointments_path(), []);
        usort($list, static fn($a, $b) => strcmp((string)($b['createdAt'] ?? ''), (string)($a['createdAt'] ?? '')));
        respond($list);
    }

    if ($route === 'appointments' && $method === 'POST') {
        $body = json_body();
        $name = trim((string)($body['name'] ?? ''));
        $phone = trim((string)($body['phone'] ?? ''));
        if ($name === '' || $phone === '') {
            respond(['error' => 'name and phone required'], 400);
        }
        $item = [
            'id' => new_id(),
            'name' => $name,
            'phone' => $phone,
            'service' => $body['service'] ?? null,
            'doctor' => $body['doctor'] ?? null,
            'message' => $body['message'] ?? null,
            'lang' => (($body['lang'] ?? 'ru') === 'uz') ? 'uz' : 'ru',
            'consentGiven' => !empty($body['consentGiven']),
            'consentAt' => $body['consentAt'] ?? null,
            'createdAt' => $body['createdAt'] ?? gmdate('c'),
        ];
        $list = read_json(appointments_path(), []);
        $list[] = $item;
        write_json(appointments_path(), $list);

        $tgToken = $config['telegram_bot_token'] ?? '';
        $tgChat  = $config['telegram_chat_id'] ?? '';
        if ($tgToken !== '' && $tgChat !== '') {
            $doctorLine  = $item['doctor']  ? "\n👨‍⚕️ Врач: " . $item['doctor']   : '';
            $serviceLine = $item['service'] ? "\n🏥 Услуга: " . $item['service'] : '';
            $msgLine     = $item['message'] ? "\n💬 Сообщение: " . $item['message'] : '';
            $tgText = "📋 <b>Новая заявка на запись</b>\n\n"
                . "👤 Имя: " . htmlspecialchars($item['name'], ENT_XML1)
                . "\n📞 Телефон: " . htmlspecialchars($item['phone'], ENT_XML1)
                . $doctorLine . $serviceLine . $msgLine
                . "\n🕐 " . $item['createdAt'];
            send_telegram($tgToken, $tgChat, $tgText);
        }

        respond(['id' => $item['id']], 201);
    }

    if ($route === 'appointments' && $method === 'DELETE') {
        require_auth();
        $id = (string)($_GET['id'] ?? '');
        $list = read_json(appointments_path(), []);
        $before = count($list);
        $list = array_values(array_filter($list, static fn($it) => ($it['id'] ?? '') !== $id));
        if (count($list) === $before) {
            respond(['error' => 'Not found'], 404);
        }
        write_json(appointments_path(), $list);
        respond(['ok' => true]);
    }

    respond(['error' => 'Not found', 'route' => $route], 404);
} catch (Throwable $e) {
    respond(['error' => 'Server error', 'message' => $e->getMessage()], 500);
}
