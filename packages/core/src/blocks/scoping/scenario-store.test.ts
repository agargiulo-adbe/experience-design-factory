import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveRemote, isLoggedIn, remoteEnabled, RemoteError, type StoreCtx } from './scenario-store';
import { DEFAULT_ASSUMPTIONS, DEFAULT_PRICES, type Scenario } from './scenario';

// ── Minimal in-memory localStorage + fetch mocks (node env) ──
const mem: Record<string, string> = {};
beforeEach(() => {
  for (const k of Object.keys(mem)) delete mem[k];
  (globalThis as any).localStorage = {
    getItem: (k: string) => (k in mem ? mem[k] : null),
    setItem: (k: string, v: string) => { mem[k] = String(v); },
    removeItem: (k: string) => { delete mem[k]; },
  };
  vi.restoreAllMocks();
});

const ctx: StoreCtx = { supabaseUrl: 'https://x.supabase.co', supabaseAnonKey: 'anon', projectSlug: 'ferrari-racing' };
const scenario: Scenario = { title: 'T', assumptions: { ...DEFAULT_ASSUMPTIONS }, prices: { ...DEFAULT_PRICES }, visibility: 'private' };
const now = () => Math.floor(Date.now() / 1000);
const setSession = (s: object) => { mem['edf:sb-session'] = JSON.stringify(s); };
const resp = (status: number, body: any) => ({
  ok: status >= 200 && status < 300, status,
  json: async () => body, text: async () => JSON.stringify(body),
});

describe('remoteEnabled / isLoggedIn', () => {
  it('remoteEnabled needs url + key', () => {
    expect(remoteEnabled(ctx)).toBe(true);
    expect(remoteEnabled({ ...ctx, supabaseUrl: '' })).toBe(false);
  });
  it('a session with only a refresh token still counts as logged in', () => {
    setSession({ refresh_token: 'r' });
    expect(isLoggedIn()).toBe(true);
  });
});

describe('saveRemote — token lifecycle', () => {
  it('saves with a fresh token (no refresh)', async () => {
    setSession({ access_token: 'good', refresh_token: 'r', expires_at: now() + 3600 });
    const fetchMock = vi.fn(async () => resp(201, [{ id: 'ID1' }]));
    (globalThis as any).fetch = fetchMock;
    expect(await saveRemote(ctx, scenario)).toBe('ID1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((fetchMock.mock.calls[0] as any[])[0]).toContain('/rest/v1/scenarios');
  });

  it('PROACTIVELY refreshes an expired token before saving', async () => {
    setSession({ access_token: 'stale', refresh_token: 'r', expires_at: now() - 10 });
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('/auth/v1/token')) return resp(200, { access_token: 'fresh', refresh_token: 'r2', expires_in: 3600 });
      return resp(201, [{ id: 'ID2' }]);
    });
    (globalThis as any).fetch = fetchMock;
    expect(await saveRemote(ctx, scenario)).toBe('ID2');
    // token endpoint hit, then the POST used the refreshed token
    expect((fetchMock.mock.calls[0] as any[])[0]).toContain('grant_type=refresh_token');
    const postAuth = (fetchMock.mock.calls[1] as any[])[1].headers.Authorization;
    expect(postAuth).toBe('Bearer fresh');
    // session persisted with the new token
    expect(JSON.parse(mem['edf:sb-session']).access_token).toBe('fresh');
  });

  it('REACTIVELY refreshes on a 401 and retries once', async () => {
    setSession({ access_token: 'looksok', refresh_token: 'r', expires_at: now() + 3600 });
    let post = 0;
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('/auth/v1/token')) return resp(200, { access_token: 'fresh', expires_in: 3600 });
      post += 1;
      return post === 1 ? resp(401, { message: 'JWT expired' }) : resp(201, [{ id: 'ID3' }]);
    });
    (globalThis as any).fetch = fetchMock;
    expect(await saveRemote(ctx, scenario)).toBe('ID3');
    expect(post).toBe(2); // first 401, retry 201
  });

  it('clears the session and throws 401 when refresh also fails', async () => {
    setSession({ access_token: 'stale', refresh_token: 'r', expires_at: now() - 10 });
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('/auth/v1/token')) return resp(401, { error: 'invalid_grant' });
      return resp(201, [{ id: 'NOPE' }]);
    });
    (globalThis as any).fetch = fetchMock;
    await expect(saveRemote(ctx, scenario)).rejects.toMatchObject({ status: 401 });
    expect(mem['edf:sb-session']).toBeUndefined(); // session cleared
    expect(isLoggedIn()).toBe(false);
  });

  it('throws not-configured when the backend env is missing', async () => {
    setSession({ access_token: 'good', expires_at: now() + 3600 });
    await expect(saveRemote({ ...ctx, supabaseUrl: '' }, scenario))
      .rejects.toBeInstanceOf(RemoteError);
  });
});
