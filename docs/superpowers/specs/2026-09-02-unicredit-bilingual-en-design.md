# UniCredit "Engagement Unlimited" — bilingual IT/EN

**Date:** 2026-09-02
**Status:** approved, in implementation
**App:** `apps/unicredit-engagement`

## Goal
Add an English version of the UniCredit "Engagement Unlimited" experience as a
runtime **IT/EN toggle** (Ferrari-parity), reusing the shared `@edf/core` i18n
primitives. **Italian stays the default**; EN is available via a LangToggle,
persisted to `localStorage['edf:lang']` (the same key the dossier already reads).

## Decisions (from brainstorming)
- **Delivery:** bilingual IT/EN toggle, IT default. (Not EN-primary, not a separate app.)
- **Scope:** the 13 deck sections + `UniNavigation` labels. **Out of scope:** the
  admin console (`admin.astro`, internal tool) and `dossier.astro` (already has its
  own self-contained EN/IT toggle on the same `edf:lang` key — left untouched).

## Infrastructure (4 touch-points)
1. **`BaseLayout.astro`** — `<html lang="it" data-lang="it">`; add the anti-flash
   `<head>` inline init that reads `edf:lang` (`'en'|'it'`) and sets `data-lang`
   before paint (Ferrari's pattern; default **it**, so no attribute change unless
   stored lang is `en`).
2. **`global.css`** — add the two display rules (core ships none):
   `html[data-lang="en"] [data-lang-it]{display:none!important}` and
   `html[data-lang="it"] [data-lang-en]{display:none!important}`.
3. **`UniNavigation.astro`** — `navItems` gain `en`/`it` labels rendered as
   `<span data-lang-en>…</span><span data-lang-it>…</span>` (desktop + mobile);
   add `<LangToggle />` to the right-side cluster (before the Console link),
   keeping the **single-line nav contract** (rail + right cluster, nowrap).
4. No new mechanism — `<T en it>` + CSS is exactly how Ferrari works.

## Content retrofit (13 sections)
`index, scenario, conosci, acquisisci, coinvolgi, contenuti, analizza, visibilita,
b2b, coworker, motore-adobe, risultati` (+ `UniNavigation`).

Every user-visible Italian string → `<T en="…" it="…" as=… class=… />`, with the
**existing Italian preserved verbatim** as `it` and an idiomatic human EN as `en`.

### Binding constraints
- **Copy-must-be-human** in EN: natural rhythm, no AI tells, EN idiomatic (not a
  literal echo of IT).
- **Never alter** product names, persona names (Marco/Sofia/Adriana), numbers,
  sources, or claims — identical in both languages.
- **±10% length** per string so the deck audit (height/legibility) holds.
- `<T>` always keeps BOTH languages in the DOM.
- Preserve every existing attribute (`data-solution`, `data-no-text`, `data-scrim`,
  `data-display`, ids, classes) — only the visible text becomes `<T>`.

## Execution strategy
Shared `dist/` → sections cannot build/preview concurrently in the main tree.
1. Land the 4 infra changes in the **main tree** first (foundation).
2. Fan out section retrofits across **isolated git worktrees** (subagents, grouped),
   each building + `audit:deck` in its own worktree.
3. Bring changed files into main; run **one final** `build` → `preview` →
   `audit:deck` and a 1920 screenshot read.

## Verification
- `audit:deck` = **0 HARD failures** at 1920/1440/1280 in **both** `data-lang`
  states (EN spans live in the DOM; must audit the EN view too, e.g. via a
  `localStorage['edf:lang']='en'` pre-set).
- Screenshot-read EN at 1920 for generous type + human copy.
- `pnpm --filter unicredit-engagement build`, `lint`, `typecheck` clean.

## Non-goals
- Translating the admin console or dossier.
- Changing the default language, layout, tokens, or any non-text markup.
