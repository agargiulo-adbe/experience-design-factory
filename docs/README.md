# docs/ — start here (reading guide for a new Claude Code session)

This index tells a fresh CC session **what to read, in what order, and what to avoid**, so
you get up to speed without wasting context. Everything tracked here is small Markdown —
reading **every** doc below is ~15k tokens total, safely within limits. Read on demand;
you don't need all of it for most tasks.

## What loads automatically (don't re-read)
- **`/CLAUDE.md`** (~4k tok) — agent guide, Quality Bar, deck contract, **Type & legibility contract (BINDING for every deck slide)**, aesthetics. Auto-loaded every session.
- **memory `MEMORY.md`** (~3k tok) — index of auto-memories, **70 al 9 ott 2026 (sera)**. I singoli file si caricano a richiamo, non tutti insieme.

## Read order (on demand, via the Read tool)
1. **`docs/HANDOVER.md`** — **read this first.** Dated current state (**2026-10-09**). **Splittato per dimensione** (contratto ≤48KB/≤1500 righe/≤1800 char per riga, via il comando `/handover`): `HANDOVER.md` è un **manifest** che instrada a **15 parti**, da leggere in ordine (≈30k tok totali; ognuna sta in una singola `Read`). La mappa sezione→parte sta nel manifest e non si duplica qui; tre cose vale la pena sapere prima di aprirlo:
   - **Se devi decidere cosa fare, la Parte 2 basta**: contiene il **backlog P0 e P1**. Al 9 ott sera conta **12 P0 e 34 P1** (Parte 2) più **44 P2** (Parte 10). In testa ci sono **tre P0 nuovi o riscritti il 9 ott**: un dossier interno **leggibile senza password su una pagina pubblica** (`trenitalia-connessioni/dossier/` — il badge «Riservato» è una scritta, non un lucchetto), il **panel mai lanciato** su un'app che l'8 ott è andata pubblica (`intesa-scala-umana`), e il **giro delta** su Intesa Assicurazioni ora che la stanza si è tenuta. Subito sotto, quello che non si chiude da solo: **nomi di referenti cliente dentro file tracciati** su repo pubblico. I **P2 e le note non azionabili** sono nella **Parte 10**.
   - **Il motore dei dossier interni sta nella Parte 11 (§34)**, non fra i core trasversali: ha regole di contenuto e di ricerca proprie, e una skill (`skills/dossier/`) con il suo gate `pnpm audit:dossier`. ⚠️ Due app **non** lo usano ancora (`eni-orbita`, e il dossier FSTechnology di `trenitalia-connessioni`): hanno il contenuto nel bundle statico, ed è il P0 qui sopra.
   - **Le parti sono ribilanciate quando una tocca il tetto**, quindi *la numerazione delle sezioni non segue sempre quella delle parti*: §15 è passata alla Parte 6, §23–25 alla Parte 9, §10.b alla Parte 10, e **§32 (Poste) è spezzata a sotto-livello su due parti** — 12 (§32.1–32.9) e **13** (§32.10–32.12); **§35 (Intesa Assicurazioni) è uscita dalla Parte 11 ed è la Parte 15**. Il change log §11 sta su **tre** parti: 3 (recente, dal **9 ott** al 3 ott) → 4 (seguito, dal 3 ott al 9 set) → **14** (coda dall'8 set all'indietro); l'ultimo ribilanciamento è del **9 ott sera**. ⚠️ Le Parti **1 e 7** sono a filo del tetto (47,5 e 47,8 KB su 49,1); quelle con più spazio sono la **11** (23,5 KB) e la **13** (24,0 KB). Il manifest è sempre aggiornato; fidati di quello, non della memoria.
   - **Lo stato corrente del deck Trenitalia sta in §36 (Parte 8), non in §26 (Parte 7)**: §26 è la storia della biforcazione, §36 è la riscrittura del 9 ott con il design system vero del cliente e il panel a due giri.

2. **New experience?** Start with the **`/experience-design`** skill (Step 0 = intake router → type **Prospettiva · Storia · Blueprint · Playbook**), then `pnpm brand:tokens`, the `experience-brief` skill, **`pnpm new:experience --slug … --type …`** (scaffold that builds and passes the audit, registered everywhere), content, `audit:deck`, **`/panel-review`**, `/handover`. **`docs/new-client-in-30-min.md`** (~0.9k tok) keeps the older manual steps + gotchas (still valid: Tailwind v4 + monorepo, trailing slash, base URL, GSAP scroller, reduced-motion, hyphenated TS keys, CSS translucency).
3. **`docs/AUDIT.md`** (~4.9k tok) — read **only if** working on **Max Mara / Acquisizione**. Phase‑1 diagnosis (dated 2026‑06‑16); proposals **not yet applied** — validate before acting.
4. **`docs/storyboard.md`** (~1.6k tok) — narrative storyboard; read if you need the story arc.
5. **`docs/superpowers/specs/2026-06-15-…-design.md`** — original design spec; background only.

For UniCredit specifics the freshest reference is the memory **`unicredit-personas-credibility`** (personas, copy/credibility rules, verified analytics naming) — HANDOVER §5 mirrors it.

## ⚠️ Do NOT read these wholesale (context / size hazard)
- **`docs/*.pptx`** (up to ~2.8 GB) and **`docs/*.mp4` / `*.mov`** — large binaries, **git-ignored (local‑only)**: they are **not in a fresh clone**. Never `Read` them (it will blow context / fail). They are Adobe source-of-truth decks (e.g. `Summit 2026 Analytics Track MEGA DECK.pptx`).
  - The facts already extracted from them are distilled in **HANDOVER §5.3** and the memory above — use those.
  - If you must re-verify and the file is present locally, extract slide text selectively:
    ```bash
    cd /tmp && unzip -q "<path>/<deck>.pptx" 'ppt/slides/*.xml'
    # then strip <a:t> runs per slide and grep for the term you need
    ```
- Generated assets under `apps/*/src/assets/generated/` — binary; don't read.

## Keeping this current
When state changes materially, update **HANDOVER.md** (it's the living state doc) and, if a
durable fact changes, the relevant memory file. This README only changes if the **set** of docs
or the reading order changes.
