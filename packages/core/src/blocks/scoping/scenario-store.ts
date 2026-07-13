import type { Scenario } from './scenario';
import { serializeScenario, deserializeScenario } from './scenario';

export interface StoreCtx {
  supabaseUrl: string;
  supabaseAnonKey: string;
  projectSlug: string;
}

function accessToken(): string {
  try {
    return (JSON.parse(localStorage.getItem('edf:sb-session') || 'null') || {}).access_token || '';
  } catch {
    return '';
  }
}

export function isLoggedIn(): boolean {
  return accessToken() !== '';
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
export async function saveRemote(ctx: StoreCtx, s: Scenario): Promise<string> {
  const token = accessToken();
  if (!token) throw new Error('not-logged-in');
  const res = await fetch(ctx.supabaseUrl + '/rest/v1/scenarios', {
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
  const rows = await res.json();
  const id = rows && rows[0] && rows[0].id;
  if (!id) throw new Error('save-failed');
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
  const token = accessToken();
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
