import type { Scenario } from './scenario';
import { serializeScenario, deserializeScenario } from './scenario';

export interface StoreCtx {
  supabaseUrl: string;
  supabaseAnonKey: string;
  projectSlug: string;
}

const SESSION_KEY = 'edf:sb-session';
interface Session { access_token: string; refresh_token?: string; expires_at?: number }

function readSession(): Session | null {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return s && (s.access_token || s.refresh_token) ? s : null;
  } catch {
    return null;
  }
}
function writeSession(s: Session): void {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
function accessToken(): string {
  return readSession()?.access_token || '';
}

export function isLoggedIn(): boolean {
  // A session with a refresh token still counts as logged-in even if the access
  // token is stale — we can refresh it transparently.
  const s = readSession();
  return !!(s && (s.access_token || s.refresh_token));
}

/** Exchange the refresh token for a fresh access token (mirrors the Console).
 *  Returns the new access token, or '' if the session cannot be refreshed. */
async function refreshToken(ctx: StoreCtx): Promise<string> {
  const s = readSession();
  if (!s?.refresh_token || !remoteEnabled(ctx)) return '';
  try {
    const res = await fetch(ctx.supabaseUrl + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: ctx.supabaseAnonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: s.refresh_token }),
    });
    if (!res.ok) { clearSession(); return ''; }
    const raw = await res.json();
    if (!raw?.access_token) { clearSession(); return ''; }
    writeSession({
      access_token: raw.access_token,
      refresh_token: raw.refresh_token ?? s.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + (raw.expires_in ?? 3600),
    });
    return raw.access_token;
  } catch {
    return ''; // network error — keep the session, let the caller degrade to local
  }
}

/** A currently-valid access token, refreshing proactively if it is near expiry. */
async function getValidToken(ctx: StoreCtx): Promise<string> {
  const s = readSession();
  if (!s) return '';
  const now = Math.floor(Date.now() / 1000);
  if (s.expires_at && s.expires_at - 60 < now && s.refresh_token) {
    return refreshToken(ctx);
  }
  return s.access_token || (s.refresh_token ? refreshToken(ctx) : '');
}

/** Remote persistence needs both the Supabase URL and anon key to be configured
 *  at build time. When they are missing (e.g. a preview without secrets) we must
 *  NOT fire a relative-URL fetch — it would hit the page origin and 404. */
export function remoteEnabled(ctx: StoreCtx): boolean {
  return !!ctx.supabaseUrl && !!ctx.supabaseAnonKey;
}

/** Clear a dead/expired Supabase session so the UI reflects logged-out state. */
export function clearSession(): void {
  try { localStorage.removeItem('edf:sb-session'); } catch { /* ignore */ }
}

/** Error thrown by the remote helpers, carrying the HTTP status for the UI. */
export class RemoteError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'RemoteError';
    this.status = status;
  }
}

const LOCAL_KEY = (slug: string) => `edf:scoping-local:${slug}`;

// ── Local (anonymous / ephemeral) scenarios ──────────────────────────
export function loadLocal(slug: string): Scenario[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY(slug)) || '[]');
  } catch {
    return [];
  }
}

export function saveLocal(slug: string, scenarios: Scenario[]): void {
  localStorage.setItem(LOCAL_KEY(slug), JSON.stringify(scenarios));
}

// ── Remote (persistent, account-linked) scenarios ────────────────────
async function postScenario(ctx: StoreCtx, s: Scenario, token: string): Promise<Response> {
  return fetch(ctx.supabaseUrl + '/rest/v1/scenarios', {
    method: 'POST',
    headers: {
      apikey: ctx.supabaseAnonKey,
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      project_slug: ctx.projectSlug,
      title: s.title,
      payload: serializeScenario(s),
      visibility: s.visibility,
    }),
  });
}

export async function saveRemote(ctx: StoreCtx, s: Scenario): Promise<string> {
  if (!remoteEnabled(ctx)) throw new RemoteError('not-configured', 0);
  let token = await getValidToken(ctx);
  if (!token) throw new RemoteError('not-logged-in', 401);
  let res: Response;
  try {
    res = await postScenario(ctx, s, token);
    // Reactive refresh: the token may have been revoked/expired server-side even
    // if it looked fresh. Refresh once and retry before giving up.
    if (res.status === 401 || res.status === 403) {
      token = await refreshToken(ctx);
      if (token) res = await postScenario(ctx, s, token);
    }
  } catch (e) {
    throw new RemoteError('network: ' + (e as Error).message, 0);
  }
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.text()).slice(0, 300); } catch { /* ignore */ }
    if (res.status === 401 || res.status === 403) clearSession(); // dead session
    throw new RemoteError(`http ${res.status}: ${detail}`, res.status);
  }
  const rows = await res.json().catch(() => null);
  const id = rows && rows[0] && rows[0].id;
  if (!id) throw new RemoteError('empty-response', res.status);
  return id;
}

export async function fetchRemoteById(ctx: StoreCtx, id: string): Promise<Scenario | null> {
  const token = accessToken();
  const res = await fetch(
    ctx.supabaseUrl + '/rest/v1/scenarios?id=eq.' + encodeURIComponent(id) + '&select=id,title,payload,visibility',
    { headers: { apikey: ctx.supabaseAnonKey, Authorization: 'Bearer ' + (token || ctx.supabaseAnonKey) } },
  );
  const rows = await res.json();
  if (!rows || !rows[0]) return null;
  const s = deserializeScenario(rows[0].payload, rows[0].id);
  s.visibility = rows[0].visibility;
  s.title = rows[0].title;
  return s;
}

export async function listMine(ctx: StoreCtx): Promise<Scenario[]> {
  const token = await getValidToken(ctx);
  if (!token) return [];
  const res = await fetch(
    ctx.supabaseUrl + '/rest/v1/scenarios?project_slug=eq.' + encodeURIComponent(ctx.projectSlug) +
      '&select=id,title,payload,visibility&order=created_at.desc',
    { headers: { apikey: ctx.supabaseAnonKey, Authorization: 'Bearer ' + token } },
  );
  const rows = await res.json();
  if (!Array.isArray(rows)) return [];
  return rows.map((r: any) => {
    const s = deserializeScenario(r.payload, r.id);
    s.visibility = r.visibility;
    s.title = r.title;
    return s;
  });
}
