# docs/ — start here (reading guide for a new Claude Code session)

This index tells a fresh CC session **what to read, in what order, and what to avoid**, so
you get up to speed without wasting context. Everything tracked here is small Markdown —
reading **every** doc below is ~15k tokens total, safely within limits. Read on demand;
you don't need all of it for most tasks.

## What loads automatically (don't re-read)
- **`/CLAUDE.md`** (~4k tok) — agent guide, Quality Bar, deck contract, **Type & legibility contract (BINDING for every deck slide)**, aesthetics. Auto-loaded every session.
- **memory `MEMORY.md`** (~0.6k tok) — index of auto-memories. Individual memory files load on recall (not all at once; ~9k total across 15 files).

## Read order (on demand, via the Read tool)
1. **`docs/HANDOVER.md`** — **read this first.** Dated current state (2026-09-09). **Splittato per dimensione** (contratto ≤48KB/≤1500 righe per file, via il comando `/handover`): `HANDOVER.md` è un **manifest** che instrada a **6 parti**, da leggere in ordine (≈24k tok totali; ognuna sta in una singola `Read`):
   **`HANDOVER-01.md`** (§1–5: stato generale — **8 esperienze cliente** + Aperture —, architettura, comandi, stato per esperienza, **UniCredit content model §5** con **§5.6 workshop cut** e **§5.7 passata 9 set sera: storia di Marco a 6 momenti, cover uniformi, clip Firefly Video, chiusura**) ·
   **`HANDOVER-02.md`** (§6–10: feature runtime deck, Admin, **audit-vs-legibility §8**, deploy, **backlog prioritario §10** — P1 Isybank Valitutti 10 set / **dry-run UniCredit 14/09** / FSTechnology Adobe Day / Eni / VPN / Atelier / dossier UniCredit seed pubblico; poi P2) ·
   **`HANDOVER-03.md`** (§11: **change log datato**, dal più recente) ·
   **`HANDOVER-04.md`** (§12–17: puntatori, **Factory Showcase §13**, **Ferrari /scoping §14**, hub/parity/Connessioni §15 — vincoli LOCKED —, **Agos §16**, Brand Visibility + de-AI + /handover §17) ·
   **`HANDOVER-05.md`** (§18–26: Ferrari scoping §18–20, **Experience Atelier §21**, **core trasversali §22** incl. regole BINDING §22.4, redesign E2E §23, **Eni Orbita §24**, responsive/nav §25, **biforcazione FS Park × Trenitalia §26** + dossier FSTechnology §26.8) ·
   **`HANDOVER-06.md`** (§27–31: **UniCredit attribution + dossier §27**, **MIM «La voce del Ministero» §28**, **Firefly asset+video pipeline §29**, **Aperture §30**, **Isybank «Il momento giusto» §31**).
2. **`docs/new-client-in-30-min.md`** (~0.9k tok) — read **only if** creating a new experience (steps + gotchas: Tailwind v4 + monorepo, trailing slash, base URL, GSAP scroller, reduced-motion, hyphenated TS keys, CSS translucency).
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
