-- ════════════════════════════════════════════════════════════════════
--  0003 — Security hardening.
--  P0-1: close privilege escalation on profiles + experiences (RLS had no
--        WITH CHECK / column protection).
--  P0-2: create the media_configs table used by shareable ?cfg= links.
--  Idempotent: safe to re-run.
-- ════════════════════════════════════════════════════════════════════

-- ── P0-1a · profiles: block self privilege escalation ────────────────
-- RLS cannot restrict columns, so a BEFORE UPDATE trigger blocks changes to
-- is_super_admin / status unless the caller is already a super admin.
create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.is_super_admin is distinct from old.is_super_admin
      or new.status is distinct from old.status)
     and not public.is_super_admin() then
    raise exception 'Not allowed to change privilege fields (is_super_admin, status)';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_profile_privileges on public.profiles;
create trigger guard_profile_privileges
  before update on public.profiles
  for each row execute function public.guard_profile_privileges();

-- Recreate the self/super update policy WITH CHECK so a row can only be
-- updated to a state the caller is allowed to own.
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update
  using (id = auth.uid() or public.is_super_admin())
  with check (id = auth.uid() or public.is_super_admin());

-- ── P0-1b · experiences: experience-admins can't rewrite identity ────
-- Block slug / base_url changes unless super admin (they may edit name,
-- description, status only).
create or replace function public.guard_experience_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.slug is distinct from old.slug
      or new.base_url is distinct from old.base_url)
     and not public.is_super_admin() then
    raise exception 'Not allowed to change slug or base_url';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists guard_experience_columns on public.experiences;
create trigger guard_experience_columns
  before update on public.experiences
  for each row execute function public.guard_experience_columns();

drop policy if exists experiences_admin_update on public.experiences;
create policy experiences_admin_update on public.experiences
  for update
  using (
    exists (
      select 1 from public.user_experience_roles r
      where r.user_id = auth.uid()
        and r.experience_slug = experiences.slug
        and r.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.user_experience_roles r
      where r.user_id = auth.uid()
        and r.experience_slug = experiences.slug
        and r.role = 'admin'
    )
  );

-- ── P0-2 · media_configs (shareable ?cfg= media/custom-slide configs) ─
create table if not exists public.media_configs (
  id          uuid primary key default gen_random_uuid(),
  project_slug text not null,
  config      jsonb not null,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);
alter table public.media_configs enable row level security;

-- Anonymous read by id is required by ?cfg= links on the public decks.
drop policy if exists media_configs_select on public.media_configs;
create policy media_configs_select on public.media_configs
  for select using (true);

-- Writes require an authenticated console user.
drop policy if exists media_configs_insert on public.media_configs;
create policy media_configs_insert on public.media_configs
  for insert to authenticated with check (auth.uid() is not null);
