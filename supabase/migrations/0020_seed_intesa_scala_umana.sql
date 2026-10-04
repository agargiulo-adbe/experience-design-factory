-- ════════════════════════════════════════════════════════════════════
--  0020 · seed «Su scala umana» (Intesa Sanpaolo) into the Console registry
--
--  Registers the experience row so `restricted_docs` can reference it by FK.
--  The experience itself does NOT exist yet: today `apps/intesa-scala-umana/`
--  ships ONE page, the internal dossier (orphan, gated, noindex). It is
--  therefore seeded as DRAFT and OFF the showcase, and it is deliberately
--  absent from the hub card list, the showcase registry and deck-audit's
--  ROUTE_SETS until there is something to show.
--
--  `base_url` is the path the experience WILL have. Until it is built, that
--  path 404s and the only live page is `…/intesa-scala-umana/dossier/`.
--
--  The dossier content is confidential (named executives, competitive
--  intelligence, contract data) and lives OUT of this public repo:
--  docs/Intesa Sanpaolo/0020_seed_intesa_scala_umana_dossier.sql (git-ignored).
--  See 0020_intesa_scala_umana_dossier.README.md.
--
--  NOTE on `type`: deliberately not set here. The taxonomy column arrives with
--  0016, which may not be applied yet, and the deliverable type is a decision
--  that follows the 22 Oct meeting — not one to guess now. Set it afterwards.
--
--  Idempotent. Run once (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

insert into public.experiences (slug, name, client, description, base_url, status, show_in_showcase)
values (
  'intesa-scala-umana',
  'Su scala umana',
  'Intesa Sanpaolo',
  'Portare contenuto personalizzato e misura del viaggio alla scala della Banca dei Territori, senza perdere l''ascolto del singolo cliente.',
  '/experience-design-factory/intesa-scala-umana/',
  'draft',
  false
)
on conflict (slug) do update
   set name             = excluded.name,
       client           = excluded.client,
       description      = excluded.description,
       base_url         = excluded.base_url,
       status           = excluded.status,
       show_in_showcase = excluded.show_in_showcase,
       updated_at       = now();
