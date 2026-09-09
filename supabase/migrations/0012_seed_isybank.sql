-- ════════════════════════════════════════════════════════════════════
--  0012 · seed «Il momento giusto» (Isybank) into the Console registry
--  Registers the experience so its card appears in the Super Admin Console
--  and so restricted_docs can reference isybank-momento (FK). The dossier
--  seed itself is confidential and lives OUT of this public repo — see
--  0012_isybank_dossier.README.md. Idempotent. Run once (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

insert into public.experiences (slug, name, client, description, base_url, status)
values (
  'isybank-momento',
  'Il momento giusto',
  'Isybank · Intesa Sanpaolo',
  'Quello che ti serve, quando ti serve: la relazione con un milione di clienti digitali, letta e orchestrata un momento alla volta.',
  '/experience-design-factory/isybank-momento/',
  'live'
)
on conflict (slug) do update
   set name        = excluded.name,
       client      = excluded.client,
       description = excluded.description,
       base_url    = excluded.base_url,
       status      = excluded.status,
       updated_at  = now();
