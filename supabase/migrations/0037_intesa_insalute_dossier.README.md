# 0037 · dossier interno su InSalute Servizi — dove sta il contenuto

Il dossier che prepara il primo incontro con **InSalute Servizi**, il gestore delle
prestazioni sanitarie della Divisione Insurance di Intesa Sanpaolo (24 novembre 2026),
è reso da `apps/intesa-dopo-la-firma/src/pages/dossier-insalute.astro`, un guscio sottile
sopra il motore unico `@edf/core/blocks/doc/DossierPage.astro`.

Sta nell'app di «Dopo la firma» perché ne condivide il perimetro (la Divisione Insurance)
e la pelle. Lo slug in `restricted_docs` è suo, **`intesa-insalute`**; la foreign key
punta all'experience `intesa-dopo-la-firma`, la cui riga esiste già.

**Il contenuto non sta qui e non sta nel repo.** Vive in Supabase, tabella
`restricted_docs` protetta da RLS: si legge dopo login (super admin, o chi ha un ruolo su
`intesa-dopo-la-firma`) oppure con un secret-link `?t=<share_token>`.

Il seed e il suo generatore sono **git-ignorati**, perché portano nomi di persone del
cliente, intelligence competitiva e dati contrattuali:

    docs/Intesa Sanpaolo/InSalute/build_dossier.py          # master del contenuto
    docs/Intesa Sanpaolo/InSalute/0037_seed_intesa_insalute_dossier.sql

Si rigenera e si applica così (idempotente, il token resta lo stesso):

    python3 -I "docs/Intesa Sanpaolo/InSalute/build_dossier.py"
    npx supabase db query --remote --yes -f "docs/Intesa Sanpaolo/InSalute/0037_seed_intesa_insalute_dossier.sql"
