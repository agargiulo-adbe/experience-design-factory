-- ════════════════════════════════════════════════════════════════════
--  0029 · seed «Giustizia Tributaria» (MEF) into the Console registry
--
--  Registers the experience row so `restricted_docs` can reference it by FK.
--  There is no experience here: `apps/mef-giustizia-tributaria/` ships ONE
--  page, the internal dossier (orphan, gated, noindex). It is therefore seeded
--  as DRAFT and OFF the showcase, and it is deliberately absent from the hub
--  card list, the showcase registry and deck-audit's ROUTE_SETS — there is
--  nothing to show.
--
--  `base_url` is the path the app serves. Only `…/dossier/` exists; the base
--  path itself 404s, which is intended: a page carrying a client's name on a
--  guessable URL, before the meeting has even happened, can only do harm.
--
--  `type` is deliberately NOT set. The deliverable type (prospettiva · storia ·
--  blueprint · playbook) is a decision that follows the conversation with the
--  Department, not one to guess from a first meeting.
--
--  The dossier content is confidential — named public officials, our own
--  reading of their organisation, product-availability caveats, contract
--  context — and lives OUT of this public repo:
--  docs/MEF/0029_seed_mef_giustizia_tributaria_dossier.sql (git-ignored).
--
--  Idempotent. Run once (supabase db query --linked).
-- ════════════════════════════════════════════════════════════════════

insert into public.experiences (slug, name, client, description, base_url, status, show_in_showcase)
values (
  'mef-giustizia-tributaria',
  'Giustizia Tributaria',
  'MEF',
  'Accessibilità dei documenti pubblicati da un dipartimento che ne produce a decine di migliaia: misurarla prima di prometterla, e farla nascere nel flusso invece di correggerla a valle.',
  '/experience-design-factory/mef-giustizia-tributaria/',
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
