-- ─────────────────────────────────────────────────────────────────────
--  0004 · scenarios — persistent, shareable licensing/scoping scenarios
--  Mirrors media_configs (0003) conventions: anon read only for shared
--  rows, authenticated owner writes. Adds private/link/team visibility.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.scenarios (
  id           uuid primary key default gen_random_uuid(),
  project_slug text not null,
  title        text not null,
  payload      jsonb not null,
  created_by   uuid references public.profiles (id) on delete set null,
  visibility   text not null default 'private'
               check (visibility in ('private', 'link', 'team')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.scenarios enable row level security;

-- SELECT: shared-by-link rows are anon-readable; otherwise the owner,
-- team members with a role on the experience, or a super admin.
-- NOTE: user_experience_roles uses experience_slug (text PK on experiences),
-- not experience_id — no join to experiences is needed; match directly.
drop policy if exists scenarios_select on public.scenarios;
create policy scenarios_select on public.scenarios
  for select using (
    visibility = 'link'
    or created_by = auth.uid()
    or public.is_super_admin()
    or (
      visibility = 'team'
      and exists (
        select 1 from public.user_experience_roles r
        where r.user_id = auth.uid()
          and r.experience_slug = scenarios.project_slug
      )
    )
  );

-- INSERT: authenticated users, only as themselves.
drop policy if exists scenarios_insert on public.scenarios;
create policy scenarios_insert on public.scenarios
  for insert to authenticated
  with check (created_by = auth.uid());

-- UPDATE: owner or super admin.
drop policy if exists scenarios_update on public.scenarios;
create policy scenarios_update on public.scenarios
  for update to authenticated
  using (created_by = auth.uid() or public.is_super_admin())
  with check (created_by = auth.uid() or public.is_super_admin());

-- DELETE: owner or super admin.
drop policy if exists scenarios_delete on public.scenarios;
create policy scenarios_delete on public.scenarios
  for delete to authenticated
  using (created_by = auth.uid() or public.is_super_admin());
