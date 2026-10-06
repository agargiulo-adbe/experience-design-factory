# 0021 · Intesa Sanpaolo Assicurazioni dossier seed — kept private (not in this public repo)

The seed that populates `restricted_docs` for the **Intesa Sanpaolo Assicurazioni** internal dossier
(`slug = 'intesa-dopo-la-firma'`, backing `apps/intesa-dopo-la-firma/src/pages/dossier.astro`) is
**not** committed here. The content is confidential — named executives of the client, a reading of
how one of them is likely to behave in the room, contract data and installed base — the same reason
`docs/Intesa Sanpaolo/` is git-ignored.

The SQL lives, git-ignored, at:

    docs/Intesa Sanpaolo/0021_seed_intesa_dopo_la_firma_dossier.sql

It depends on `0008_restricted_docs.sql` + `0009_restricted_doc_share.sql` and on
`0021_seed_intesa_dopo_la_firma.sql` (the `experiences` row it references by FK), both tracked here.

Apply out-of-band, once:

    supabase db query --linked -f supabase/migrations/0021_seed_intesa_dopo_la_firma.sql
    supabase db query --linked -f "docs/Intesa Sanpaolo/0021_seed_intesa_dopo_la_firma_dossier.sql"
    supabase db query --linked -o csv "select share_token from public.restricted_docs where slug='intesa-dopo-la-firma';"

→ open `…/intesa-dopo-la-firma/dossier/?t=<share_token>` (no login) or sign in via the Console.
Same pattern as MIM (0011), Isybank (0012) and `intesa-scala-umana` (0020).

## Why a second Intesa entity

`0020` prepares the 22 October meeting with the **Banca dei Territori** digital retail leadership;
this one prepares the 8 October meeting with the **COO of the insurance holding**. Different room,
different perimeter, different binding constraints — in particular: nothing about the bank's
channels, and nothing that touches the insurance core platform. Keeping them apart is what stops a
constraint from one meeting leaking into the other.

## Why this app has no home page

`apps/intesa-dopo-la-firma/` ships **one** page — the dossier. No deck, no tailwind, no `@edf/core`.
It is therefore **not** registered in the hub card list, the showcase registry or
`scripts/deck-audit.ts`, and `deploy.yml` verifies `…/intesa-dopo-la-firma/dossier/index.html`
rather than an `index.html` at the root.
