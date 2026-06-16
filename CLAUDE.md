# Experience Design Factory — Agent Guide

## Project Overview
Monorepo for the Experience Design Factory: a reusable system where each client is a skin (design tokens + content + assets) over a shared engine. First instance: "Generazioni" for Max Mara.

## Commands
- `pnpm dev` — run Generazioni dev server
- `pnpm build` — build all packages
- `pnpm lint` — lint all files
- `pnpm typecheck` — type-check all packages

## Architecture
- `packages/core` — shared engine (`@agargiulo-adbe/experience-core`): 9 experience blocks, design tokens, schema, theme, i18n, motion
- `apps/generazioni-maxmara` — first client instance (Astro static site, IT default)
- `apps/console` — Factory Console (local Node backend + SPA editor) [future phase]

## Code Conventions
- TypeScript everywhere, strict mode
- Astro components for pages/layouts; islands (React/Svelte) only where interactivity needed
- Tailwind CSS with CSS custom properties from design tokens — NO hardcoded color/spacing values
- i18n: Italian (IT) is default locale, English (EN) secondary
- Commit often with conventional commit messages (feat:, fix:, chore:, docs:)
- NEVER commit secrets (.env, tokens, PATs)

## File Ownership (for parallel work)
- `engine` agent → `packages/core/**`
- `site` agent → `apps/generazioni-maxmara/**`
- `console-fe` agent → `apps/console/src/**`
- `console-be` agent → `apps/console/server/**`
- `qa` agent → `**/*.test.ts`, `e2e/**`, test configs
- Do NOT modify files outside your ownership zone

## Quality Bar
- WCAG 2.2 AA, Lighthouse ≥ 95, responsive to 360px
- `prefers-reduced-motion` respected everywhere
- Real Italian copy — no lorem ipsum
- Adobe revealed progressively, co-brand Max Mara × Adobe discrete
- Config-driven: every page = ordered list of blocks with visibility flags

## Error Recovery
If you encounter errors, diagnose, fix, and continue. Do not stop.

## Deck visual contract
Some pages are **keynote decks** (full-screen slides, projected at **1920×1080**).
Claude can *see* its output: the **playwright MCP** (browser_* tools) for interactive
inspection, and `scripts/deck-audit.ts` (`pnpm --filter generazioni-maxmara audit:deck`)
as the deterministic DOM gate. Measure bounding boxes → pass/fail; screenshots only
confirm failures (saved to `audit/<deck>/<slide-id>.png`).

### Component API (deck)
- `immersive/DeckContainer.astro` — deck wrapper (`fixed inset-0`, no scroll). Chrome:
  progress `NN/NN`, prev/next, fullscreen (auto-hide; hidden while a panel is open via
  `data-deck-lock`). Prop `nextHref` → advancing past the last slide.
- `immersive/Slide.astro` — one slide. **Safe-area contract:** content lives inside the
  viewport minus token gutters, **vertically centred** (`justify-center`), height-bounded
  (`max-h/min-h-0`), **never clipping**; bottom reserves the chrome band. Slots: default
  (content) + `backdrop` (full-bleed). `bg` = primary|secondary|inverse|brand; `align` =
  center|left|split. If content doesn't fit → SPLIT into two slides.
- `immersive/deck.ts` — presenter controller (←/→/↑/↓, Space, PageUp/Down, Home/End,
  click halves, swipe, `F`). Fires `prepareSlide`/`playSlide` on activation (replay on
  revisit). Pauses when `data-deck-lock` is set.
- `CoverSlide.astro` — cinematic slide 0 (camel; sartorial *filo* draws between
  `Max Mara`/`Adobe` wordmarks; tagline). `[data-cover]` animation, reduced-motion safe.
- `HowItWorks.astro` — optional "Scopri come →" right slide-over (plain-language tech;
  Esc/×/click-outside, focus-trap; sets `data-deck-lock`). Deck reads fine without it.
- `InstagramPost.astro` — credible IG post in a phone (`{...mediaProps('id')} caption=…`).
- `MediaSlot.astro` — `<Picture>` (AVIF/WebP) or palette placeholder; `fill`,
  `noText="top,left,width,height"` (% face/subject zone — no text may overlap it).
- The 9 experience blocks (non-deck library): Hero, NarrativeSection, FrontBackStageSplit,
  JourneyPhase, PersonaCard, ProductGateway, AdobeStackReveal, MetricCallout, Timeline.

### Aesthetic brief (quiet-luxury)
Palette cammello `#C19A6B` / avorio `#F5F0E6` / testa-di-moro `#3E2C20` (+ sabbia, oro);
display serif **Cormorant Garamond** + grotesque **Inter**; editorial composition, generous
negative space; motion sober (~500ms ease, sartorial), `prefers-reduced-motion` respected;
Adobe discreet/in-context (full stack reveal only on "Il Motore Adobe").

### The 12 checks every slide must pass — at 1920×1080, 1440×900 AND 1280×800 (`audit:deck`)
> `audit:deck` runs all three viewports (a projected keynote must hold beyond exactly 1920×1080).
> A **display hero** (giant metric numeral, e.g. "tre quarti") is tagged `data-display` and
> excluded from the prose band check (a) — it's a display element, not prose.
1. **(a) text not too high** — significant text centre in the central band (30%–70%); never near the top.
2. **(b) no chrome collision** — no content text intersects the deck controls.
3. **(c) margins / no overflow** — no box past `--slide-safe-inset`; no horizontal overflow.
4. **(d) no text over faces** — no text over an image's `[data-no-text]` zone; text over an image needs a `[data-scrim]`.
5. **(e) no text-on-text** — no two (non-nested) text blocks overlap.
6. **(f) clean slide-over** — an OPEN `HowItWorks` is a top-level fixed dialog **within the viewport, no scroll, no clipping**, with a full-viewport scrim, width ≤ min(720px,60vw). The audit OPENS each panel and re-measures.
7. **(g) vertical rhythm** — adjacent stacked text blocks (outside cards) have ≥ 16px gap.
8. **(h) button contrast** — every button/CTA meets WCAG AA (4.5:1; 3:1 for large/icon).
9. **(i) space usage** — content covers ≥ 45% of the usable height and its centre of mass is in the central horizontal band.
10. **(j) nothing clipped** — every significant element (texts, media, panels, buttons; incl. the open panel + its text) lies fully inside `[0,0,1920,1080]` (±1px).
11. **(k) no hidden scroll** — no content/panel container has `scrollHeight > clientHeight`. A keynote never scrolls: if it doesn't fit, it's a design defect (shorten the copy or split).
12. **(l) trigger not obstructed** — while a panel is open, interactive elements are EITHER fully under the scrim OR fully visible — never half-covered/cut.

Contract details:
- **Safe-area tokens** in `global.css` (fixed px): `--slide-safe-inset`, `--deck-chrome-safe`.
  `Slide` centres content on the VIEWPORT centre with a symmetric chrome reserve, so (a) band and (i) ≥45% are compatible.
- **Layering:** the base reset MUST be in `@layer base` — an unlayered `* { margin:0 }` /
  `a { color }` beats Tailwind utilities (kills `mb-*`, `text-*` → no rhythm, wrong colours).
- **Slide-over contract:** `HowItWorks` opens a **centred, bounded dialog** (NOT a full-height
  side panel): `w=min(720px,60vw)`, `max-height: calc(100dvh - 2*--slide-safe-inset)`, content
  must fit WITHOUT scroll (keep the copy short), full-viewport scrim, panel+overlay moved to
  `<body>` (escapes the transformed slide). `tone="onDark"` for AA triggers on dark slides.
- **`data-no-text="t,l,w,h"`** (% face/subject zone), **`data-scrim`** on the overlay behind text-over-image.
