-- ════════════════════════════════════════════════════════════════════
--  Experience Design Factory — Super Admin Console schema
--  Multi-user, role-based access. Run once in the Supabase SQL editor
--  (or `supabase db push`). Safe to re-run: guarded with IF NOT EXISTS.
-- ════════════════════════════════════════════════════════════════════

-- ── profiles ─────────────────────────────────────────────────────────
-- One row per auth user. `is_super_admin` is the global super-user flag;
-- per-experience roles live in user_experience_roles.
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  full_name     text,
  is_super_admin boolean not null default false,
  status        text not null default 'active' check (status in ('active', 'suspended')),
  created_at    timestamptz not null default now()
);

-- ── experiences ──────────────────────────────────────────────────────
-- The registry of Experience Designs. `slug` matches the app folder.
create table if not exists public.experiences (
  slug         text primary key,
  name         text not null,
  client       text not null,
  description  text,
  base_url     text not null,
  status       text not null default 'draft' check (status in ('live', 'draft', 'archived')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── user_experience_roles ────────────────────────────────────────────
-- Which experiences a (non-super-admin) user can access, and how.
create table if not exists public.user_experience_roles (
  user_id       uuid not null references public.profiles (id) on delete cascade,
  experience_slug text not null references public.experiences (slug) on delete cascade,
  role          text not null default 'admin' check (role in ('admin', 'viewer')),
  created_at    timestamptz not null default now(),
  primary key (user_id, experience_slug)
);

-- ── helper: is the current caller a super admin? ─────────────────────
-- SECURITY DEFINER so RLS policies can call it without recursion.
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select is_super_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ── auto-create profile on signup ────────────────────────────────────
-- Bootstraps the owner as super admin on first signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, is_super_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    -- Bootstrap: the factory owner becomes super admin automatically.
    new.email = 'agargiulo@adobe.com'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ════════════════════════════════════════════════════════════════════
--  Row-Level Security
-- ════════════════════════════════════════════════════════════════════
alter table public.profiles                enable row level security;
alter table public.experiences             enable row level security;
alter table public.user_experience_roles   enable row level security;

-- profiles: read own, super admin reads/writes all
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_super_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_super_admin());

drop policy if exists profiles_super_write on public.profiles;
create policy profiles_super_write on public.profiles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- experiences: any authenticated user reads; super admin writes; assigned
-- experience-admins can update their experiences.
drop policy if exists experiences_select on public.experiences;
create policy experiences_select on public.experiences
  for select using (auth.uid() is not null);

drop policy if exists experiences_super_all on public.experiences;
create policy experiences_super_all on public.experiences
  for all using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists experiences_admin_update on public.experiences;
create policy experiences_admin_update on public.experiences
  for update using (
    exists (
      select 1 from public.user_experience_roles r
      where r.user_id = auth.uid()
        and r.experience_slug = experiences.slug
        and r.role = 'admin'
    )
  );

-- user_experience_roles: read own, super admin manages all
drop policy if exists uer_select on public.user_experience_roles;
create policy uer_select on public.user_experience_roles
  for select using (user_id = auth.uid() or public.is_super_admin());

drop policy if exists uer_super_all on public.user_experience_roles;
create policy uer_super_all on public.user_experience_roles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- ── seed the current experiences ─────────────────────────────────────
insert into public.experiences (slug, name, client, description, base_url, status)
values
  ('unicredit-engagement', 'Engagement Unlimited', 'UniCredit',
   'Come Adobe trasforma ogni interazione digitale in una relazione che crea valore.',
   '/experience-design-factory/unicredit-engagement/', 'live'),
  ('generazioni-maxmara', 'Generazioni', 'Max Mara',
   'L''eredità generazionale del guardaroba Max Mara, alimentata da Adobe Experience Cloud.',
   '/experience-design-factory/', 'draft')
on conflict (slug) do nothing;
