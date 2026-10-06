# docs/ — start here (reading guide for a new Claude Code session)

This index tells a fresh CC session **what to read, in what order, and what to avoid**, so
you get up to speed without wasting context. Everything tracked here is small Markdown —
reading **every** doc below is ~15k tokens total, safely within limits. Read on demand;
you don't need all of it for most tasks.

## What loads automatically (don't re-read)
- **`/CLAUDE.md`** (~4k tok) — agent guide, Quality Bar, deck contract, **Type & legibility contract (BINDING for every deck slide)**, aesthetics. Auto-loaded every session.
- **memory `MEMORY.md`** (~0.6k tok) — index of auto-memories. Individual memory files load on recall (not all at once; ~9k total across 15 files).

## Read order (on demand, via the Read tool)
1. **`docs/HANDOVER.md`** — **read this first.** Dated current state (**2026-10-06**). **Splittato per dimensione** (contratto ≤48KB/≤1500 righe/≤1800 char per riga, via il comando `/handover`): `HANDOVER.md` è un **manifest** che instrada a **11 parti**, da leggere in ordine (≈30k tok totali; ognuna sta in una singola `Read`). La mappa sezione→parte sta nel manifest e non si duplica qui; due cose vale la pena sapere prima di aprirlo:
   - **Se devi decidere cosa fare, la Parte 2 basta**: contiene il **backlog P0 e P1**. Al 6 ott i P0 aperti sono dieci: il primo non riguarda una pagina ma il **repository** (nomi di referenti cliente dentro file tracciati, su repo pubblico), e il più urgente in agenda è il **panel review mancante sulle quattro slide dell'8 ottobre**. I **P2 e le note non azionabili** sono nella **Parte 10**: la §10 da sola aveva superato i 48 KB ed è stata spezzata ai sotto-livelli.
   - **Il motore dei dossier interni sta nella Parte 11 (§34)**, non fra i core trasversali: ha regole di contenuto e di ricerca proprie, e una skill (`skills/dossier/`) con il suo gate `pnpm audit:dossier`.
   - **Le parti sono ribilanciate quando una tocca il tetto**, quindi *la numerazione delle sezioni non segue sempre quella delle parti*: §15 è passata alla Parte 6, §23–25 alla Parte 9, §10.b alla Parte 10. Il manifest è sempre aggiornato; fidati di quello, non della memoria.

2. **New experience?** Start with the **`/experience-design`** skill (Step 0 = intake router → type **Prospettiva · Storia · Blueprint · Playbook**), then `pnpm brand:tokens`, the `experience-brief` skill, **`pnpm new:experience --slug … --type …`** (scaffold that builds and passes the audit, registered everywhere), content, `audit:deck`, **`/panel-review`**, `/handover`. **`docs/new-client-in-30-min.md`** (~0.9k tok) keeps the older manual steps + gotchas (still valid: Tailwind v4 + monorepo, trailing slash, base URL, GSAP scroller, reduced-motion, hyphenated TS keys, CSS translucency).
3. **`docs/AUDIT.md`** (~4.9k tok) — read **only if** working on **Max Mara / Acquisizione**. Phase‑1 diagnosis (dated 2026‑06‑16); proposals **not yet applied** — validate before acting.
4. **`docs/storyboard.md`** (~1.6k tok) — narrative storyboard; read if you need the story arc.
5. **`docs/superpowers/specs/2026-06-15-…-design.md`** — original design spec; background only.

For UniCredit specifics the freshest reference is the memory **`unicredit-personas-credibility`** (personas, copy/credibility rules, verified analytics naming) — HANDOVER §5 mirrors it.

## ⚠️ Do NOT read these wholesale (context / size hazard)
- **`docs/*.pptx`** (up to ~2.8 GB) and **`docs/*.mp4`** — large binaries, **git-ignored (local‑only)**: they are **not in a fresh clone**. Never `Read` them (it will blow context / fail). They are Adobe source-of-truth decks (e.g. `Summit 2026 Analytics Track MEGA DECK.pptx`).
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
