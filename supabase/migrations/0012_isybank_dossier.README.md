# 0012 · Isybank dossier seed — kept private (not in this public repo)

The seed that populates `restricted_docs` for the **Isybank «Il momento giusto»** internal dossier
(`slug = 'isybank-valitutti'`, backing `apps/isybank-momento/src/pages/dossier.astro`) is **not**
committed here: the content is confidential (named executives, a regulator sanction, competitive
intelligence, qualitative view of the installed base), same reason `docs/Intesa Sanpaolo/` is git-ignored.

The SQL lives, git-ignored, at:

    docs/Intesa Sanpaolo/0012_seed_isybank_dossier.sql

It depends on `0008_restricted_docs.sql` + `0009_restricted_doc_share.sql` and on
`0012_seed_isybank.sql` (the `isybank-momento` `experiences` row it references by FK), all tracked here.

Apply out-of-band, once:

    supabase db query --linked -f supabase/migrations/0012_seed_isybank.sql
    supabase db query --linked -f "docs/Intesa Sanpaolo/0012_seed_isybank_dossier.sql"
    supabase db query --linked -o csv "select share_token from public.restricted_docs where slug='isybank-valitutti';"

→ open `…/isybank-momento/dossier/?t=<share_token>` (no login) or sign in via the Console.
Same pattern as the MIM dossier (0011).
