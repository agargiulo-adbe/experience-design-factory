# Scaffold prompt — Experience Design Factory

Use this prompt to scaffold the factory from scratch (or a new client instance).
It encodes the **real, verified stack** and the **immersive step-by-step model**.

---

## Goal
Build a monorepo where each client is a **skin** (design tokens + content + assets)
over a **shared engine**. The signature output is an **immersive, full-screen,
scroll-snapped experience** per page, where **animation explains the value** of each
journey phase (not decoration). First instance: "Generazioni" for Max Mara.

## Stack (use exactly this)
- **pnpm workspaces** monorepo: `packages/core` (engine) + `apps/<client>` (instance).
- **Astro 6**, static output, **View Transitions** enabled.
- **Tailwind CSS v4** via `@tailwindcss/vite` (NOT `@astrojs/tailwind`). In
  `global.css`: `@import "tailwindcss";` then a `@theme {}` block of CSS custom
  properties from tokens, then `@source` directives so Tailwind scans the
  symlinked engine:
  ```css
  @source "../../../../packages/core/src/**/*.{astro,ts,tsx,js,jsx,mjs}";
  @source "../**/*.{astro,ts,tsx,js,jsx,mjs}";
  ```
- **GSAP + ScrollTrigger** for animation (lazy-imported, reduced-motion safe).
- **TypeScript** strict; **zod** for config schemas.
- `astro.config.mjs`: `site`, `base: '/<repo>'`, `trailingSlash: 'always'`.
- **GitHub:** create the repo and push; then `git push` after every commit.
- Deploy via GitHub Actions → Pages (built-in `GITHUB_TOKEN`, no external secrets).

## Engine: immersive primitives (`packages/core/src/blocks/immersive/`)
- `StepContainer.astro` — `height:100dvh; overflow-y:auto; scroll-snap-type: y mandatory`; disable snap under `prefers-reduced-motion`. Exposes `data-step-container`.
- `Step.astro` — `min-h-[100dvh]`, `snap-start`; props `bg` (`primary|secondary|inverse|brand`), `align` (`center|left|bottom-left`).
- `animations.ts` — export `init*` functions + a master `initAllAnimations(container)`.
  Every primitive: read a `data-*` attribute, and if `prefers-reduced-motion` is set,
  paint the final static state and return early. ScrollTrigger `scroller` = the
  container element. Primitives to ship:
  `reveal`, `countUp`, `stagger`, `pulse`, `dataLake`, `personalize`, `converse`,
  `lifecycle`, `clienteling`, `thread`, `stackAssemble`.
- `utils/url.ts` — `href(base, path)` joining + trailing slash + slash dedupe.

## Page recipe (every phase page)
`StepContainer` + N × `Step`, plus one module script:
```astro
<script>
  import { initAllAnimations } from '@edf/core/blocks/immersive/animations';
  function setup(){ const c = document.querySelector('[data-step-container]'); if (c) initAllAnimations(c); }
  setup();
  document.addEventListener('astro:after-swap', setup); // re-init after View Transition
</script>
```
Sequence-type per page:
1. **Apertura** — phase number + title + one sentence + scroll hint.
2. **Value animation** — the metaphor that explains the phase.
3. **Front stage** — what the customer sees.
4. **Front→back impulse** — the "aha" (`pulse`).
5. **Back stage** — Adobe products revealed **one at a time** (`stagger`).
6. **Payoff** — metric (`countUp`) + CTA to the next phase via `href(base, …)`.

Rules: **little text per step**; animations must **explain value**; respect
`prefers-reduced-motion` everywhere; no hardcoded colors/spacing (use tokens).

## Pages (Generazioni)
Home, Acquisizione, Engagement, Conversione, Loyalty, Il Motore Adobe, Persona,
Chiusura. Per-phase value metaphors: Acquisizione/Home → `dataLake`; Home/Persona
→ `thread`; Engagement → `personalize`; Conversione → `converse`; Loyalty →
`lifecycle` + `clienteling`; **Il Motore Adobe → `stackAssemble` (full reveal of
the Adobe stack onto the AEP core — the culmination)**.

## Quality bar
WCAG 2.2 AA · Lighthouse ≥ 95 · responsive to 360px · reduced-motion respected ·
real copy (IT default) · Adobe revealed progressively, co-brand discrete ·
config-driven & reusable. Verify with `pnpm dev`, `pnpm build`, `pnpm typecheck`.

## Known gotchas (bake in from the start)
- Tailwind v4 won't scan pnpm symlinks → use `@source`.
- `trailingSlash:'always'` → always link via `href(base, path)`.
- `import.meta.env.BASE_URL` lacks a trailing slash → normalise before concatenation.
- GSAP `scroller` must be the StepContainer, not the window.
- Quote hyphenated TS object keys (`'grigio-100'`) — `tsc` rejects them unquoted.
- Use `color-mix()` for translucency in raw CSS, not Tailwind's `var()/N` slash syntax.
- On GSAP-animated nodes that are centered with `translate(-50%,-50%)`, set the
  transform inline (so GSAP composes `x/y` on top) and keep it in the reduced-motion branch.
