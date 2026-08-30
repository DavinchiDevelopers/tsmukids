#!/usr/bin/env bash
# Минимальная заливка: только вакансии + JS/CSS. Без departments/doctors и без удаления.
# Старые страницы на сервере не трогаем (старые чанки остаются).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

: "${UZCLOUD_FTP_HOST:=89.126.223.196}"
: "${UZCLOUD_FTP_USER:=user1110}"
: "${UZCLOUD_FTP_REMOTE_DIR:=www/tsmukids.uz}"
: "${UZCLOUD_FTP_PASSWORD:?Set UZCLOUD_FTP_PASSWORD}"

if [[ ! -d out/ru/vacancies || ! -d out/_next ]]; then
  echo "Building..."
  NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://tsmukids.uz}" npm run build
  cat > out/.htaccess <<'HT'
RewriteEngine On
RewriteRule ^$ /ru/ [R=301,L]
ErrorDocument 404 /404.html
HT
fi

echo "Uploading ONLY: _next + vacancies + home (nav link). No delete."
export LFTP_PASSWORD="$UZCLOUD_FTP_PASSWORD"
lftp -u "$UZCLOUD_FTP_USER","$LFTP_PASSWORD" "ftp://${UZCLOUD_FTP_HOST}:21" -e "
set ftp:ssl-allow no
set net:timeout 120
set net:max-retries 8
set mirror:parallel-transfer-count 4
cd ${UZCLOUD_FTP_REMOTE_DIR}
# новые JS/CSS (старые чанки на сервере НЕ удаляем)
mirror -R --verbose --no-empty-dirs out/_next _next
# страница вакансий
mirror -R --verbose --no-empty-dirs out/ru/vacancies ru/vacancies
mirror -R --verbose --no-empty-dirs out/uz/vacancies uz/vacancies
# главные — чтобы в меню появилась ссылка «Вакансии»
put -O ru out/ru/index.html
put -O ru out/ru/index.txt
put -O uz out/uz/index.html
put -O uz out/uz/index.txt
# sitemap (если есть)
put -O . out/sitemap.xml
bye
"
echo "Done. https://tsmukids.uz/ru/vacancies/"
