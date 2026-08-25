/** Auth через PHP-сессию (замена Firebase Auth). */

function apiBase(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/index.php`;
  }
  return process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') || 'http://127.0.0.1/api/index.php';
}

export type AuthUser = { email: string } | null;

type AuthListener = (user: AuthUser) => void;

const listeners = new Set<AuthListener>();
let cachedUser: AuthUser | undefined;
let pendingMe: Promise<AuthUser> | null = null;

function emit(user: AuthUser) {
  cachedUser = user;
  listeners.forEach(fn => fn(user));
}

async function fetchMe(): Promise<AuthUser> {
  try {
    const url = new URL(apiBase());
    url.searchParams.set('r', 'auth/me');
    const res = await fetch(url.toString(), { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.ok && data.email ? { email: data.email } : null;
  } catch {
    return null;
  }
}

export function onAuthStateChanged(_auth: unknown, callback: AuthListener): () => void {
  listeners.add(callback);
  if (cachedUser !== undefined) {
    callback(cachedUser);
  } else {
    pendingMe ??= fetchMe().then(user => {
      emit(user);
      pendingMe = null;
      return user;
    });
    pendingMe.then(callback);
  }
  return () => {
    listeners.delete(callback);
  };
}

export async function signInWithEmailAndPassword(
  _auth: unknown,
  email: string,
  password: string,
): Promise<{ user: AuthUser }> {
  const url = new URL(apiBase());
  url.searchParams.set('r', 'auth/login');
  const res = await fetch(url.toString(), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error('auth/invalid-credential');
  }
  const data = await res.json();
  const user = { email: data.email as string };
  emit(user);
  return { user };
}

export async function signOut(_auth?: unknown): Promise<void> {
  const url = new URL(apiBase());
  url.searchParams.set('r', 'auth/logout');
  await fetch(url.toString(), { method: 'POST', credentials: 'include' });
  emit(null);
}

/** Совместимость с прежним `import { auth } from '@/lib/firebase'` */
export const auth = {};
