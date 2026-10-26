# 0031 · dossier interno di «Dove ci innestiamo» — dove sta il contenuto

Il dossier che prepara l'incontro del **5 novembre 2026** con la Divisione Banca dei
Territori di Intesa Sanpaolo è reso da `apps/intesa-innesto/src/pages/dossier.astro`,
che è un guscio sottile sopra il motore unico `@edf/core/blocks/doc/DossierPage.astro`.

**Il contenuto non sta qui e non sta nel repo.** Vive in Supabase, nella tabella
`restricted_docs` protetta da RLS, e si legge solo dopo login (super admin, o chi ha un
ruolo su `intesa-innesto`) oppure con un secret-link `?t=<share_token>`.

Il seed che lo scrive è **git-ignorato**, perché porta nomi di persone del cliente,
intelligence competitiva, dati contrattuali e un'offerta commerciale non confermata:

    docs/Intesa Sanpaolo/0031_seed_intesa_innesto_dossier.sql

Si applica una volta sola, e stampa il token da mettere nel link:

    supabase db query --linked -f "docs/Intesa Sanpaolo/0031_seed_intesa_innesto_dossier.sql"

La riga `experiences` che serve alla foreign key arriva dalla migrazione tracciata
`0030_seed_intesa_innesto.sql`: questo file non la duplica.
