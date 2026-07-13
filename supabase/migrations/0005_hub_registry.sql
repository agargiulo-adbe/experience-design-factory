-- ════════════════════════════════════════════════════════════════════
--  0005 · hub registry — root becomes the Factory hub; Max Mara moves to
--  its own /generazioni-maxmara/ subpath, and Connessioni Intelligenti
--  (FS Group) becomes administratively visible everywhere.
--  Idempotent: safe to re-run. Run once in the Supabase SQL editor.
-- ════════════════════════════════════════════════════════════════════

-- Max Mara no longer lives at the site root — point the registry at its
-- new subpath. (Also flip it live now that it has a dedicated URL.)
update public.experiences
   set base_url = '/experience-design-factory/generazioni-maxmara/',
       status   = 'live',
       updated_at = now()
 where slug = 'generazioni-maxmara';

-- Connessioni Intelligenti — may already exist (inserted manually on the
-- remote). Insert if missing, otherwise refresh base_url + status.
insert into public.experiences (slug, name, client, description, base_url, status)
values (
  'trenitalia-connessioni',
  'Connessioni Intelligenti',
  'FS Group',
  'Il dato che connette treni, viaggiatori e servizi in un unico journey misurabile — FS Group con Adobe.',
  '/experience-design-factory/trenitalia-connessioni/',
  'live'
)
on conflict (slug) do update
   set base_url   = excluded.base_url,
       status     = excluded.status,
       updated_at = now();
