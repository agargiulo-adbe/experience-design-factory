# Super Admin Console — Supabase setup

One-time backend setup for the Experience Design Factory console
(auth, users, experiences). ~10 minutes.

## 1. Run the migrations

Open your Supabase project → **SQL Editor** → paste + **Run**, in order:
[`migrations/0001_super_admin.sql`](./migrations/0001_super_admin.sql) then
[`migrations/0002_seed_ferrari.sql`](./migrations/0002_seed_ferrari.sql).

`0001` creates `profiles`, `experiences`, `user_experience_roles`, the RLS
policies, the signup trigger, and seeds the maxmara + unicredit experiences.
`0002` seeds the Ferrari Racing experience.

> **Via CLI (alternative):** with the CLI logged into the owning account and the
> project linked (`supabase link --project-ref <ref>`), run any SQL against the
> remote DB with the Management API (no DB password):
> `supabase db query --linked -f supabase/migrations/0002_seed_ferrari.sql`

## 2. Enable email auth + redirect URLs

- **Authentication → Providers → Email**: enable. (Password + invite links.)
- **Authentication → URL Configuration → Redirect URLs**, add:
  - `https://agargiulo-adbe.github.io/experience-design-factory/console/**`
  - `http://localhost:4322/**` (local dev)

## 3. Deploy the invite Edge Function

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are injected
automatically into every Edge Function — **no secrets to set.**

**Option A — Dashboard (no CLI, easiest):**
1. Dashboard → **Edge Functions** → **Deploy a new function** (via editor).
2. Name it exactly `invite-user`.
3. Paste the full contents of
   [`functions/invite-user/index.ts`](./functions/invite-user/index.ts) → **Deploy**.

**Option B — CLI:**
```bash
supabase link --project-ref <your-project-ref>
supabase functions deploy invite-user
```

> The `service_role` key is used **only** inside this function (auto-injected),
> never in the client bundle. This is the one place it is allowed.

## 4. Become super admin

Sign up once with **agargiulo@adobe.com** on the console login page. The signup
trigger auto-promotes that email to `is_super_admin`. (To bootstrap a different
owner, change the email in the migration's `handle_new_user()` function, or run
`update public.profiles set is_super_admin = true where email = '…';`.)

## 5. Build-time env (already configured in CI)

The console reads `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
(GitHub Actions secrets, injected at build). No secrets in the repo.

---

Once done: **/console/** shows the login → the Super Admin dashboard
(experiences + users). Invited users land on their assigned experiences only.
