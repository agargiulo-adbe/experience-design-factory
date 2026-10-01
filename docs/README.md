# docs/ — start here (reading guide for a new Claude Code session)

This index tells a fresh CC session **what to read, in what order, and what to avoid**, so
you get up to speed without wasting context. Everything tracked here is small Markdown —
reading **every** doc below is ~15k tokens total, safely within limits. Read on demand;
you don't need all of it for most tasks.

## What loads automatically (don't re-read)
- **`/CLAUDE.md`** (~4k tok) — agent guide, Quality Bar, deck contract, **Type & legibility contract (BINDING for every deck slide)**, aesthetics. Auto-loaded every session.
- **memory `MEMORY.md`** (~0.6k tok) — index of auto-memories. Individual memory files load on recall (not all at once; ~9k total across 15 files).

## Read order (on demand, via the Read tool)
1. **`docs/HANDOVER.md`** — **read this first.** Dated current state (**2026-10-02**). **Splittato per dimensione** (contratto ≤48KB/≤1500 righe per file, via il comando `/handover`): `HANDOVER.md` è un **manifest** che instrada a **9 parti**, da leggere in ordine (≈30k tok totali; ognuna sta in una singola `Read`):
   **`HANDOVER-01.md`** (§1–9: stato generale, architettura, **comandi** incl. `brand:tokens`/`new:experience`/`loop:seamless` e i comandi-skill `/experience-design`·`/panel-review`, **tipo per esperienza (§4)**, stato per esperienza, **UniCredit content model §5**, feature runtime §6, **Admin Console §7 a 4 tab**, **audit §8 — 12 check, nuovo `m`, la lezione sul gate che mentiva e quella sul connettore fuori dal box**; **la §9 Deploy è stata spostata nella parte 02** il 2 ott, per ribilanciare le dimensioni) ·
   **`HANDOVER-02.md`** (**§9 Deploy & segreti**, spostata qui dalla 01, poi §10: **backlog prioritario** — leggila per prima se devi decidere cosa fare; al 2 ott i P0 sono tre: panel Poste mancante per lo stato corrente, le due decisioni di hosting/Legal sullo showcase, sei fallimenti HARD aperti su Max Mara e UniCredit) ·
   **`HANDOVER-03.md`** + **`HANDOVER-04.md`** (§11: **change log datato**, dal più recente — spezzato in due per dimensione) ·
   **`HANDOVER-05.md`** (§12–15: puntatori, **Factory Showcase §13** incl. **§13.7 blocco API + catena di build** e **§13.8 tipo sulle card + primo panel review**, **Ferrari /scoping §14**, hub/parity/Connessioni §15 — vincoli LOCKED; **§13.9 panel giro 2 dello showcase**. **La §16 Agos è stata spostata nella parte 06** il 2 ott, per ribilanciare le dimensioni) ·
   **`HANDOVER-06.md`** (**§16 Agos**, spostata qui dalla 05, poi §17–20 e §22–25: Brand Visibility/de-AI/handover §17, Ferrari scoping §18–20, **core trasversali §22**, redesign E2E §23, **Eni Orbita §24**, responsive/nav §25 — **§21 non è più qui**) ·
   **`HANDOVER-07.md`** (§26–28: **biforcazione FS Park × Trenitalia §26**, **UniCredit attribution + dossier §27**, **MIM «La voce del Ministero» §28**) ·
   **`HANDOVER-08.md`** (§29–31: **Firefly asset+video pipeline §29** incl. **§29.3 regole BINDING** e **§29.4 API immagine Adobe**, **Aperture §30**, **Isybank «Il momento giusto» §31**, **Poste «Sei domande» §32** con il panel review §32.5, il tipo Playbook e i minimi tipografici §32.6, e **§32.7 le otto domande ad Adobe chiuse alla fonte il 1 ott**) ·
   **`HANDOVER-09.md`** (**§21 Experience Atelier**, spostata qui dalla parte 06 quando quella ha toccato il tetto dei 48 KB: la storia del deck trilingue e, in fondo, **§21.8 il redesign sulle tre mosse del 14 set** — 36 slide, `gap`/`moves`, telemetria del deck e MCP server `atelier`, calendario nov 2026 → giu 2027).

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
