# 0008b · Dossier interno «Attribution — UniCredit»

Il **contenuto** di questo dossier non sta in questo repo: è riservato e il repo è pubblico.

> **Perché questo file esiste.** Fino al 9 ottobre 2026 il seed stava **dentro
> `supabase/migrations/0008_restricted_docs.sql`**, che è tracciato. Quel file portava con sé
> tutto il dossier: **otto persone del cliente con nome, ruolo e URL del profilo LinkedIn**,
> la lettura interna di ognuna («possibile resistenza al cambio: gestire, non ignorare»), la
> tesi e le fonti — leggibili da chiunque su `raw.githubusercontent.com`, senza login. È la
> stessa esposizione dei dossier di `trenitalia-connessioni` e `eni-orbita` (0027, 0028),
> trovata nello stesso giro ma **per una via diversa**: l'inventario dei nomi guardava i
> documenti di handover, non le migrazioni. Lo schema e le policy restano nella 0008; il
> contenuto è uscito dal repo.

| Cosa | Dove |
|---|---|
| Schema, RLS e policy | `supabase/migrations/0008_restricted_docs.sql` (tracciato) |
| Seed del contenuto | `docs/UniCredit/0008b_seed_unicredit_attribution_dossier.sql` (git-ignorato) |
| Pagina | `apps/unicredit-engagement/src/pages/dossier.astro` |
| Renderer | `@edf/core/blocks/doc/DossierPage.astro` — motore condiviso |

`slug` in `restricted_docs`: **`unicredit-attribution`**, agganciato all'experience
`unicredit-engagement` via chiave esterna.

## Nulla da applicare

Il contenuto **era già nel database remoto**: ci è arrivato con la 0008, quando il seed stava
dentro di essa. Spostare il file non cambia lo stato del database. Il seed resta applicabile
(è idempotente) se serve ricreare la riga:

```
supabase db query --linked -f "docs/UniCredit/0008b_seed_unicredit_attribution_dossier.sql"
```

## La regola che ne esce

Una migrazione tracciata può portare **schema e policy**, mai il contenuto di un dossier. Il
contenuto vive in `docs/<Cliente>/` e nel database. Prima di committare una migrazione nuova:

```
grep -niE "linkedin\.com|@[a-z0-9.-]+\.(com|it)" supabase/migrations/*.sql
```

Vedi anche la memoria `client-names-public-repo`: in un file tracciato va il **ruolo**, mai il
nome.
