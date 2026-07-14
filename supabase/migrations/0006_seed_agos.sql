-- ════════════════════════════════════════════════════════════════════
--  0006 · seed Agos — registers the "Trait d'Union" experience (Agos ×
--  Adobe, consumer credit) in the Super Admin Console registry.
--  Idempotent: safe to re-run. Run once (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

insert into public.experiences (slug, name, client, description, base_url, status)
values (
  'agos-trait-dunion',
  'Trait d''Union',
  'Agos',
  'Due mondi — digitale e filiale, acquisition e customer base — connessi in un''unica intelligenza del cliente. Agos con Adobe.',
  '/experience-design-factory/agos-trait-dunion/',
  'live'
)
on conflict (slug) do update
   set base_url   = excluded.base_url,
       status     = excluded.status,
       updated_at = now();
