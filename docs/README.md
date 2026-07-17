# docs/ — start here (reading guide for a new Claude Code session)

This index tells a fresh CC session **what to read, in what order, and what to avoid**, so
you get up to speed without wasting context. Everything tracked here is small Markdown —
reading **every** doc below is ~15k tokens total, safely within limits. Read on demand;
you don't need all of it for most tasks.

## What loads automatically (don't re-read)
- **`/CLAUDE.md`** (~4k tok) — agent guide, Quality Bar, deck contract, **Type & legibility contract (BINDING for every deck slide)**, aesthetics. Auto-loaded every session.
- **memory `MEMORY.md`** (~0.6k tok) — index of auto-memories. Individual memory files load on recall (not all at once; ~9k total across 15 files).

## Read order (on demand, via the Read tool)
1. **`docs/HANDOVER.md`** — **read this first.** Dated current state (2026-07-17). **Splittato per dimensione** (contratto ≤48KB/≤1500 righe per file, via il comando `/handover`): `HANDOVER.md` è ora un **manifest** che instrada a **`docs/HANDOVER-01.md`** (§1–13: stato generale, architettura, comandi, stato per esperienza, UniCredit content model §5, feature runtime deck §6, Admin §7, **audit-vs-legibility §8**, deploy, **pending §10 incl. accesso VPN**, change log, puntatori, **Factory Showcase §13**), **`docs/HANDOVER-02.md`** (§14–20: **Ferrari /scoping §14** incl. **v2 §14.9** (SKU base/entitlement/istanze partner/refresh mode + sezione «Casi d'uso»), **Hub/parity/Connessioni-Trenitalia §15** incl. §15.4 mappa slide + vincoli LOCKED, **Agos §16**, **Adobe Brand Visibility + de-AI + comando /handover §17**, **Ferrari scoping Adobe-fedele/CI/Save §18**, **Ferrari /scoping v2 + «Casi d'uso» §19** commit `a3fc86a`, **v3 standalone-only/costo-per-istanza §20** commit `ff03a71`) e **`docs/HANDOVER-03.md`** (§21–22: **Experience Atelier** — primo deck trilingue EN/IT/FR, piano di crescita della Factory, gating d'audience, disciplina fatti; **modifiche core trasversali** i18n trilingue + fix gating SPA su tutte le esperienze). Leggi tutte e tre le parti (≈18k tok totali); ognuna sta in una singola `Read`.
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
