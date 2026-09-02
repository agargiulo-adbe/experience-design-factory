-- ════════════════════════════════════════════════════════════════════
--  0010 · seed Alfabeti (MIM) + Orbita (Eni) into the Console registry
--  Registers the two experiences that shipped after the last seed
--  (0007_seed_atelier) so their cards appear in the Super Admin Console
--  and so restricted_docs can reference mim-alfabeti (FK).
--  Idempotent: safe to re-run. Run once (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

insert into public.experiences (slug, name, client, description, base_url, status)
values
  (
    'mim-alfabeti',
    'Alfabeti',
    'Ministero dell''Istruzione e del Merito',
    'La comunicazione al personale, le competenze e l''IA sicura del Ministero: un''esperienza istituzionale governata al centro.',
    '/experience-design-factory/mim-alfabeti/',
    'live'
  ),
  (
    'eni-orbita',
    'Orbita',
    'Eni',
    'Un gruppo, tante orbite: l''esperienza come servizio governato al centro e veloce nei satelliti.',
    '/experience-design-factory/eni-orbita/',
    'live'
  )
on conflict (slug) do update
   set name       = excluded.name,
       client     = excluded.client,
       description = excluded.description,
       base_url    = excluded.base_url,
       status      = excluded.status,
       updated_at  = now();
