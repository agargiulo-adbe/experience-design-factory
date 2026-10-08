# 0026 · Dossier interno «Direzione Sales Trenitalia»

Il **contenuto** di questo dossier non sta in questo repo: è riservato (nomi di persone del
cliente, lettura della catena di riporto, intelligence su un fornitore concorrente) e il repo
è pubblico.

| Cosa | Dove |
|---|---|
| Seed del contenuto | `docs/Ferrovie/0026_seed_trenitalia_sales_dossier.sql` (git-ignorato) |
| Master da cui si rigenera il seed | `docs/Ferrovie/dossier-direzione-sales-trenitalia.json` (git-ignorato) |
| Copia per la lettura offline | `docs/Ferrovie/Dossier-Direzione-Sales-Trenitalia-2026-10-08.pdf` (git-ignorato) |
| Pagina | `apps/trenitalia-connessioni/src/pages/dossier-sales.astro` |
| Guscio e palette | `apps/trenitalia-connessioni/src/layouts/DocLayout.astro` |
| Renderer | `@edf/core/blocks/doc/DossierPage.astro` — motore condiviso, **mai copiato nell'app** |

`slug` in `restricted_docs`: **`trenitalia-direzione-sales`**, agganciato all'experience
`trenitalia-connessioni` via chiave esterna. È una riga **distinta** dal dossier
`trenitalia-connessioni`, che prepara il tavolo con la società ICT del Gruppo: stessa
experience nel registry, stanza diversa, vincoli diversi.

## Applicare

```
supabase db query --linked -f "docs/Ferrovie/0026_seed_trenitalia_sales_dossier.sql"
```

Idempotente. Stampa in coda lo `share_token`, che serve a costruire il link senza login:
`…/trenitalia-connessioni/dossier-sales/?t=<token>`. Senza token e senza sessione la pagina
mostra il gate.

## Rigenerare

Si modifica il JSON e si riscrive il seed, non il contrario — il SQL è un involucro:

```
python3 -c "
j=open('docs/Ferrovie/dossier-direzione-sales-trenitalia.json').read()
s=open('docs/Ferrovie/0026_seed_trenitalia_sales_dossier.sql').read()
a=s.index('\$doc\$')+5; b=s.rindex('\$doc\$')
open('docs/Ferrovie/0026_seed_trenitalia_sales_dossier.sql','w').write(s[:a]+'\n'+j.rstrip()+'\n'+s[b:])"
```

## Barra di qualità

`0 rilievi` su cinque viewport, verificato l'8 ottobre 2026:

```
DOSSIER_URLS="http://localhost:<porta>/experience-design-factory/trenitalia-connessioni/dossier-sales/?t=<token>" \
  npx tsx scripts/dossier-audit.ts
```
