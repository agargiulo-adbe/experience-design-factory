// Client-side auth guard + small routing helpers for console pages.
import {
  getSession, captureHashSession, getProfile, listMyAccess, isConfigured,
  type Session, type Profile, type AccessRow,
} from './supabase';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const loginHref = () => `${BASE}/login/`;
export const consoleHref = (path = '') => `${BASE}${path}`;

export interface AuthContext {
  session: Session;
  profile: Profile;
  access: AccessRow[];
}

/** Guards a page. Redirects to login (or dashboard) as needed.
 *  Returns the auth context when the user is allowed to stay. */
export async function requireAuth(opts: { superOnly?: boolean } = {}): Promise<AuthContext | null> {
  if (!isConfigured) {
    document.documentElement.setAttribute('data-backend', 'missing');
    return null;
  }
  captureHashSession();
  const session = await getSession();
  if (!session) {
    location.replace(loginHref());
    return null;
  }
  const profile = await getProfile(session);
  if (!profile || profile.status === 'suspended') {
    location.replace(loginHref());
    return null;
  }
  if (opts.superOnly && !profile.is_super_admin) {
    location.replace(consoleHref('/'));
    return null;
  }
  const access = await listMyAccess(session);
  return { session, profile, access };
}
