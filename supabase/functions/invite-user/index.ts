// ════════════════════════════════════════════════════════════════════
//  Edge Function: invite-user
//  Creates a new admin user by email (Supabase Auth invite) and assigns
//  role + per-experience access. Only callable by a super admin.
//
//  Deploy:  supabase functions deploy invite-user
//  Secrets: SB_URL, SB_SERVICE_ROLE_KEY  (set via `supabase secrets set`)
//           — the service_role key lives ONLY here, never in the client.
// ════════════════════════════════════════════════════════════════════
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SB_URL = Deno.env.get('SB_URL')!;
const SERVICE_ROLE = Deno.env.get('SB_SERVICE_ROLE_KEY')!;
const ANON = Deno.env.get('SB_ANON_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  // 1) Identify the caller from their bearer token.
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return json({ error: 'Missing auth token' }, 401);

  const caller = createClient(SB_URL, ANON, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await caller.auth.getUser(token);
  if (userErr || !userData.user) return json({ error: 'Invalid session' }, 401);

  // 2) Verify the caller is a super admin.
  const admin = createClient(SB_URL, SERVICE_ROLE);
  const { data: profile } = await admin
    .from('profiles')
    .select('is_super_admin')
    .eq('id', userData.user.id)
    .single();
  if (!profile?.is_super_admin) return json({ error: 'Forbidden — super admin only' }, 403);

  // 3) Parse the payload.
  let payload: {
    email?: string;
    full_name?: string;
    is_super_admin?: boolean;
    access?: { experience_slug: string; role: 'admin' | 'viewer' }[];
    redirect_to?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }
  const email = (payload.email ?? '').trim().toLowerCase();
  if (!email) return json({ error: 'Email is required' }, 400);

  // 4) Invite the user (sends the Supabase invite email).
  const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: payload.redirect_to,
    data: { full_name: payload.full_name ?? '' },
  });
  if (inviteErr || !invited.user) {
    return json({ error: inviteErr?.message ?? 'Invite failed' }, 400);
  }
  const newId = invited.user.id;

  // 5) Ensure the profile exists with the requested role/name.
  await admin.from('profiles').upsert({
    id: newId,
    email,
    full_name: payload.full_name ?? '',
    is_super_admin: !!payload.is_super_admin,
  });

  // 6) Assign per-experience access.
  if (Array.isArray(payload.access) && payload.access.length > 0) {
    await admin.from('user_experience_roles').upsert(
      payload.access.map((a) => ({
        user_id: newId,
        experience_slug: a.experience_slug,
        role: a.role ?? 'admin',
      })),
    );
  }

  return json({ ok: true, user_id: newId, email });
});
