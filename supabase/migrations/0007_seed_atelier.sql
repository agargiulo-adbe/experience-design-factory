-- ════════════════════════════════════════════════════════════════════
--  0007 · seed Atelier — registers the "Experience Atelier" experience
--  (Adobe — internal: the Factory growth plan, trilingual EN/IT/FR)
--  in the Super Admin Console registry.
--  Idempotent: safe to re-run. Run once (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

insert into public.experiences (slug, name, client, description, base_url, status)
values (
  'atelier',
  'Experience Atelier',
  'Adobe — internal',
  'The Factory growth plan: three milestones to an enterprise-grade, workforce-wide capability. Trilingual EN/IT/FR.',
  '/experience-design-factory/atelier/',
  'live'
)
on conflict (slug) do update
   set base_url   = excluded.base_url,
       status     = excluded.status,
       updated_at = now();
