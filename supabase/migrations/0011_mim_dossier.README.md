# 0011 · MIM dossier seed — kept private (not in this public repo)

The seed that populates `restricted_docs` for the **Alfabeti (MIM)** internal dossier
(`slug = 'mim-adobe'`, backing `apps/mim-alfabeti/src/pages/dossier.astro`) is **not**
committed here. This repository is **public**, and the dossier content is confidential
(named officials with contacts, "do not say" refuted claims, competitive intelligence) —
the same reason `docs/Ministero dell'Istruzione/` is git-ignored.

The SQL lives, git-ignored, at:

    docs/Ministero dell'Istruzione/0011_seed_mim_dossier.sql

It depends on `0008_restricted_docs.sql` + `0009_restricted_doc_share.sql` (table, RLS,
`share_token`, `get_shared_doc` RPC) and `0010_seed_mim.sql` (the `mim-alfabeti`
`experiences` row it references by FK), all of which ARE tracked here.

Apply it out-of-band, once, from the private location:

    supabase db query --linked -f "docs/Ministero dell'Istruzione/0011_seed_mim_dossier.sql"

then read the minted token for the unlisted share link:

    supabase db query --linked -o csv "select share_token from public.restricted_docs where slug='mim-adobe';"

→ open `…/mim-alfabeti/dossier/?t=<share_token>` (no login) or sign in via the Console.

Same pattern as the UniCredit dossier, but with the seed kept out of the public repo.
