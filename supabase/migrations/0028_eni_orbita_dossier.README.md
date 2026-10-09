# 0028 · Dossier interno «Eni · Orbita»

Il **contenuto** di questo dossier non sta in questo repo: è riservato (nome, ruolo e lettura
del referente del cliente, mappa degli stakeholder, minutaggio e piano B dell'incontro) e il
repo è pubblico.

> **Perché questa migrazione esiste.** Fino al 9 ottobre 2026 la pagina
> `apps/eni-orbita/src/pages/dossier.astro` aveva il renderer **copiato dentro l'app** (49 KB)
> e il contenuto **scritto nel file `.astro`**: compilato nel bundle statico e quindi
> pubblicato su GitHub Pages. Chi apriva `…/eni-orbita/dossier/` **leggeva tutto senza
> password**. È la stessa esposizione del dossier FSTechnology (0027), trovata nello stesso
> giro del 9 ottobre. Da qui il contenuto vive dietro il gate e la pagina è un wrapper sottile
> sul motore condiviso. **L'URL non cambia.**

| Cosa | Dove |
|---|---|
| Seed del contenuto | `docs/Eni/0028_seed_eni_orbita_dossier.sql` (git-ignorato) |
| Master da cui si rigenera il seed | `docs/Eni/dossier-eni-orbita.json` (git-ignorato) |
| Pagina | `apps/eni-orbita/src/pages/dossier.astro` |
| Guscio e palette | `apps/eni-orbita/src/layouts/DocLayout.astro` (nuovo) |
| Renderer | `@edf/core/blocks/doc/DossierPage.astro` — motore condiviso, **mai copiato nell'app** |

`slug` in `restricted_docs`: **`eni-orbita`**, agganciato all'omonima experience via chiave
esterna.

## Trilingue, e il motore se ne accorge da sé

Questo dossier è **IT/EN/FR**, l'unico del gruppo. Il motore condiviso teneva due bottoni di
lingua fissi nel markup (`IT`/`EN`): migrarlo così avrebbe buttato via il francese. Dal 9
ottobre 2026 il motore **ricava l'elenco delle lingue dal contenuto** — una mappa di lingue è
un oggetto le cui chiavi sono tutte codici a due lettere e i cui valori sono tutti stringhe —
e scrive i bottoni di conseguenza. Con una lingua sola il selettore non compare. La modifica
vale per tutti i dossier, presenti e futuri.

## Applicare

```
supabase db query --linked -f "docs/Eni/0028_seed_eni_orbita_dossier.sql"
```

Idempotente. Stampa in coda lo `share_token`, che serve a costruire il link senza login:
`…/eni-orbita/dossier/?t=<token>`. Senza token e senza sessione la pagina mostra il gate.
**Applicata al database remoto il 9 ottobre 2026.**

## Rigenerare

Il JSON è stato prodotto **rimappando** i `const` del vecchio `.astro`, non riscrivendo le
stringhe a mano (`.tmpwork/eni-build.py` nel giro del 9 ott). Da qui in avanti si modifica il
JSON e si riscrive il seed — il SQL è un involucro:

```
python3 -c "
j=open('docs/Eni/dossier-eni-orbita.json').read()
s=open('docs/Eni/0028_seed_eni_orbita_dossier.sql').read()
a=s.index('\$doc\$')+5; b=s.rindex('\$doc\$')
open('docs/Eni/0028_seed_eni_orbita_dossier.sql','w').write(s[:a]+'\n'+j.rstrip()+'\n'+s[b:])"
```

## Barra di qualità

```
DOSSIER_URLS="http://localhost:<porta>/experience-design-factory/eni-orbita/dossier/?t=<token>" \
  npx tsx scripts/dossier-audit.ts
```

Deve uscire a **0 rilievi** su cinque viewport (320 → 1280).
