-- ════════════════════════════════════════════════════════════════════
--  0015 · seed «Sei domande» (Poste Italiane) into the Console registry
--  Registers the experience (card in Super Admin, FK for restricted_docs)
--  and publishes it on /showcase/ (explicit request, 29 Sep 2026). The
--  internal dossier seed is confidential and lives OUT of this repo:
--  docs/Poste Italiane/0015_seed_poste_dossier.sql (git-ignored).
--  Idempotent. Run once (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

insert into public.experiences (slug, name, client, description, base_url, status, show_in_showcase)
values (
  'poste-sei-domande',
  'Sei domande',
  'Poste Italiane',
  'Le domande che il monitoraggio dei canali digitali riceve ogni settimana, risposte da oggi dentro Adobe Analytics con CX Enterprise Coworker.',
  '/experience-design-factory/poste-sei-domande/',
  'live',
  true
)
on conflict (slug) do update
   set name             = excluded.name,
       client           = excluded.client,
       description      = excluded.description,
       base_url         = excluded.base_url,
       status           = excluded.status,
       show_in_showcase = excluded.show_in_showcase,
       updated_at       = now();
