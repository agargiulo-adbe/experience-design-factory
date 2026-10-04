# 0020 · Intesa Sanpaolo dossier seed — kept private (not in this public repo)

The seed that populates `restricted_docs` for the **Intesa Sanpaolo** internal dossier
(`slug = 'intesa-scala-umana'`, backing `apps/intesa-scala-umana/src/pages/dossier.astro`) is **not**
committed here. The content is confidential — named executives of the client, competitive
intelligence, contract data, and the internal reading of who decides what — the same reason
`docs/Intesa Sanpaolo/` is git-ignored.

The SQL lives, git-ignored, at:

    docs/Intesa Sanpaolo/0020_seed_intesa_scala_umana_dossier.sql

It depends on `0008_restricted_docs.sql` + `0009_restricted_doc_share.sql` and on
`0020_seed_intesa_scala_umana.sql` (the `experiences` row it references by FK), both tracked here.

Apply out-of-band, once:

    supabase db query --linked -f supabase/migrations/0020_seed_intesa_scala_umana.sql
    supabase db query --linked -f "docs/Intesa Sanpaolo/0020_seed_intesa_scala_umana_dossier.sql"
    supabase db query --linked -o csv "select share_token from public.restricted_docs where slug='intesa-scala-umana';"

→ open `…/intesa-scala-umana/dossier/?t=<share_token>` (no login) or sign in via the Console.
Same pattern as the MIM dossier (0011) and the Isybank one (0012).

## Why this app has no home page

`apps/intesa-scala-umana/` currently ships **one** page — the dossier. There is no deck, no
tailwind and no `@edf/core`: the experience will be designed after the 22 October meeting, and
a half-empty page carrying the client's name on a public URL buys nothing before then. That is
also why the app is **not** registered in the hub card list, the showcase registry or
`scripts/deck-audit.ts`, and why `deploy.yml` verifies `…/intesa-scala-umana/dossier/index.html`
rather than an `index.html` at the root. All of that gets added when the experience is built.
