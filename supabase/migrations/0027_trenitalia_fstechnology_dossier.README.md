# 0027 · Dossier interno «FSTechnology · Adobe Day»

Il **contenuto** di questo dossier non sta in questo repo: è riservato (nome e ruolo del
referente del cliente, lettura competitiva su un fornitore concorrente) e il repo è pubblico.

> **Perché questa migrazione esiste.** Fino al 9 ottobre 2026 la pagina
> `apps/trenitalia-connessioni/src/pages/dossier.astro` aveva il renderer **copiato dentro
> l'app** e il contenuto **scritto nel file `.astro`**: compilato nel bundle statico e quindi
> pubblicato. Chi apriva `…/trenitalia-connessioni/dossier/` **leggeva tutto senza password**
> — il badge «Adobe internal · Riservato» era una scritta, non un lucchetto, e `noindex` tiene
> fuori i motori di ricerca, non chi ha il link. Da qui il contenuto vive dietro il gate e la
> pagina è un wrapper sottile sul motore condiviso. **L'URL non cambia.**

| Cosa | Dove |
|---|---|
| Seed del contenuto | `docs/Ferrovie/0027_seed_trenitalia_fstechnology_dossier.sql` (git-ignorato) |
| Master da cui si rigenera il seed | `docs/Ferrovie/dossier-fstechnology-adobe-day.json` (git-ignorato) |
| Pagina | `apps/trenitalia-connessioni/src/pages/dossier.astro` |
| Guscio e palette | `apps/trenitalia-connessioni/src/layouts/DocLayout.astro` |
| Renderer | `@edf/core/blocks/doc/DossierPage.astro` — motore condiviso, **mai copiato nell'app** |

`slug` in `restricted_docs`: **`trenitalia-fstechnology`**, agganciato all'experience
`trenitalia-connessioni` via chiave esterna. È una riga **distinta** da
`trenitalia-direzione-sales`: stessa experience nel registry, stanza diversa, vincoli diversi.

## Applicare

```
supabase db query --linked -f "docs/Ferrovie/0027_seed_trenitalia_fstechnology_dossier.sql"
```

Idempotente. Stampa in coda lo `share_token`, che serve a costruire il link senza login:
`…/trenitalia-connessioni/dossier/?t=<token>`. Senza token e senza sessione la pagina mostra
il gate. **Applicata al database remoto il 9 ottobre 2026.**

## Rigenerare

Si modifica il JSON e si riscrive il seed, non il contrario — il SQL è un involucro:

```
python3 -c "
j=open('docs/Ferrovie/dossier-fstechnology-adobe-day.json').read()
s=open('docs/Ferrovie/0027_seed_trenitalia_fstechnology_dossier.sql').read()
a=s.index('\$doc\$')+5; b=s.rindex('\$doc\$')
open('docs/Ferrovie/0027_seed_trenitalia_fstechnology_dossier.sql','w').write(s[:a]+'\n'+j.rstrip()+'\n'+s[b:])"
```

## Barra di qualità

```
DOSSIER_URLS="http://localhost:<porta>/experience-design-factory/trenitalia-connessioni/dossier/?t=<token>" \
  npx tsx scripts/dossier-audit.ts
```

Deve uscire a **0 rilievi** su cinque viewport (320 → 1280).
