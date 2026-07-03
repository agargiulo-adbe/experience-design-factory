# Super Admin Console — Supabase setup

One-time backend setup for the Experience Design Factory console
(auth, users, experiences). ~10 minutes.

## 1. Run the migration

Open your Supabase project → **SQL Editor** → paste the contents of
[`migrations/0001_super_admin.sql`](./migrations/0001_super_admin.sql) → **Run**.

This creates `profiles`, `experiences`, `user_experience_roles`, the RLS
policies, the signup trigger, and seeds the two current experiences.

## 2. Enable email auth + redirect URLs

- **Authentication → Providers → Email**: enable. (Password + invite links.)
- **Authentication → URL Configuration → Redirect URLs**, add:
  - `https://agargiulo-adbe.github.io/experience-design-factory/console/**`
  - `http://localhost:4322/**` (local dev)

## 3. Deploy the invite Edge Function

Requires the [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
supabase link --project-ref <your-project-ref>
supabase functions deploy invite-user --no-verify-jwt
supabase secrets set \
  SB_URL="https://<ref>.supabase.co" \
  SB_ANON_KEY="<anon key>" \
  SB_SERVICE_ROLE_KEY="<service_role key>"
```

> The `service_role` key lives **only** in the function's secrets — never in
> the client bundle. This is the one place it is allowed.

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
