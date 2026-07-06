-- ════════════════════════════════════════════════════════════════════
--  Seed the Ferrari Racing experience into the Super Admin Console.
--  Run once in the Supabase SQL editor (after 0001_super_admin.sql).
--  Idempotent: does nothing if the row already exists.
-- ════════════════════════════════════════════════════════════════════
insert into public.experiences (slug, name, client, description, base_url, status)
values (
  'ferrari-racing',
  'Pole Position',
  'Ferrari Racing',
  'Come il dato trasforma ogni sponsorship in una partnership misurabile — Ferrari Racing e i suoi Partner Sponsor, con Adobe.',
  '/experience-design-factory/ferrari-racing/',
  'live'
)
on conflict (slug) do nothing;
