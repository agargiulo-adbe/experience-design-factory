// ════════════════════════════════════════════════════════════════════
//  Thin, dependency-free Supabase client (Auth + REST) for the console.
//  Mirrors the raw-fetch pattern already used for media_configs — keeps
//  the static bundle tiny and avoids the SDK. Runs client-side only.
// ════════════════════════════════════════════════════════════════════

export const SUPABASE_URL = (import.meta.env.PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
export const SUPABASE_ANON = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';
export const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON);

const SESSION_KEY = 'edf:sb-session';

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number; // epoch seconds
  user: { id: string; email: string };
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_super_admin: boolean;
  status: 'active' | 'suspended';
}

export interface Experience {
  slug: string;
  name: string;
  client: string;
  description: string | null;
  base_url: string;
  status: 'live' | 'draft' | 'archived';
  updated_at?: string;
}

export interface AccessRow {
  user_id: string;
  experience_slug: string;
  role: 'admin' | 'viewer';
}

// ── session storage ──────────────────────────────────────────────────
function readSession(): Session | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}
function writeSession(s: Session | null) {
  if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  else localStorage.removeItem(SESSION_KEY);
}

function toSession(raw: any): Session {
  return {
    access_token: raw.access_token,
    refresh_token: raw.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (raw.expires_in ?? 3600),
    user: { id: raw.user?.id, email: raw.user?.email },
  };
}

// ── auth endpoints ───────────────────────────────────────────────────
async function authFetch(path: string, body: unknown) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error_description || data.msg || data.error || 'Errore di autenticazione');
  return data;
}

export async function signInWithPassword(email: string, password: string): Promise<Session> {
  const raw = await authFetch('token?grant_type=password', { email, password });
  const s = toSession(raw);
  writeSession(s);
  return s;
}

export async function signInWithOtp(email: string, redirectTo: string): Promise<void> {
  await authFetch('otp', { email, options: { email_redirect_to: redirectTo } });
}

async function refresh(session: Session): Promise<Session | null> {
  try {
    const raw = await authFetch('token?grant_type=refresh_token', { refresh_token: session.refresh_token });
    const s = toSession(raw);
    writeSession(s);
    return s;
  } catch {
    writeSession(null);
    return null;
  }
}

/** Capture #access_token from a magic-link / invite redirect, if present. */
export function captureHashSession(): boolean {
  if (!location.hash.includes('access_token')) return false;
  const p = new URLSearchParams(location.hash.slice(1));
  const access_token = p.get('access_token');
  const refresh_token = p.get('refresh_token') ?? '';
  if (!access_token) return false;
  writeSession({
    access_token,
    refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + Number(p.get('expires_in') ?? 3600),
    user: { id: '', email: '' },
  });
  history.replaceState(null, '', location.pathname + location.search);
  return true;
}

/** Returns a valid session (refreshing if near expiry), or null. */
export async function getSession(): Promise<Session | null> {
  let s = readSession();
  if (!s) return null;
  if (s.expires_at - 60 < Math.floor(Date.now() / 1000)) {
    s = await refresh(s);
  }
  // Hydrate user id/email if we came from a hash link.
  if (s && !s.user.id) {
    try {
      const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${s.access_token}` },
      }).then((r) => r.json());
      s.user = { id: u.id, email: u.email };
      writeSession(s);
    } catch { /* ignore */ }
  }
  return s;
}

export function signOut() {
  const s = readSession();
  if (s) {
    fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${s.access_token}` },
    }).catch(() => {});
  }
  writeSession(null);
}

// ── REST helper (PostgREST) ──────────────────────────────────────────
export async function rest(path: string, init: RequestInit = {}, session?: Session | null): Promise<any> {
  const s = session ?? (await getSession());
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${s?.access_token ?? SUPABASE_ANON}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`REST ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

// ── domain helpers ───────────────────────────────────────────────────
export async function getProfile(session: Session): Promise<Profile | null> {
  const rows = await rest(`profiles?id=eq.${session.user.id}&select=*`, {}, session);
  return rows?.[0] ?? null;
}

export async function listExperiences(session: Session): Promise<Experience[]> {
  return rest(`experiences?select=*&order=status.asc,name.asc`, {}, session);
}

export async function listMyAccess(session: Session): Promise<AccessRow[]> {
  return rest(`user_experience_roles?user_id=eq.${session.user.id}&select=*`, {}, session);
}

export async function inviteUser(
  session: Session,
  payload: { email: string; full_name?: string; is_super_admin?: boolean; access?: { experience_slug: string; role: 'admin' | 'viewer' }[] },
) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/invite-user`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, redirect_to: `${location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}/` }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Invito fallito');
  return data;
}
