# Run Report — Experience Design Factory

## Status: Phase D — Complete
**Started:** 2026-06-15 ~22:45 CEST
**Completed:** 2026-06-16 ~00:30 CEST

---

## Design Decisions

### Color Palette (Generazioni / Max Mara)
| Token | Hex | Role |
|-------|-----|------|
| cammello | `#C19A6B` | Brand signature, primary accent |
| marrone-caldo | `#6B4F3A` | Deep warm brown, headings |
| testa-di-moro | `#3E2C20` | Darkest, high-contrast text |
| avorio | `#F5F0E6` | Primary background |
| sabbia | `#E8DFD0` | Secondary background, cards |
| nero | `#1A1A1A` | Body text, UI elements |
| oro | `#B8975A` | Rare accent (CTAs, highlights) |

### Typography
- **Display:** Cormorant Garamond (Google Fonts, OFL license) — high-fashion serif with Italian elegance
- **Body/UI:** Inter (Google Fonts, OFL license) — clean grotesque, excellent readability
- Scale: fluid clamp-based (display 3rem→5rem, h1 2rem→3.5rem, body 1rem→1.125rem)

### Signature Elements
1. **Front/Back-Stage Split** — the "aha": synchronized view of customer experience ↔ Adobe platform powering it, present on every journey phase page
2. **Generazioni motif** — thread connecting young customer (Giulia, 29) to heritage client (Francesca, 52), visual through timeline and dual persona cards
3. **Progressive Adobe reveal** — Adobe enters discreetly on phase pages as back-stage chips, fully revealed on "Il Motore Adobe" page with 6-phase stack reveal

### Architecture
- **Astro 6** static site with View Transitions for page-to-page immersion
- **Tailwind CSS v4** via @tailwindcss/vite plugin (not the deprecated @astrojs/tailwind)
- CSS custom properties from design tokens → Tailwind arbitrary values
- 9 typed experience blocks in packages/core, config-driven assembly
- GitHub Pages deploy via Actions (GITHUB_TOKEN only, no external secrets)
- `trailingSlash: 'always'` for consistent URL handling with base path

---

## Checkpoints

### Checkpoint A — Foundations ✅
- [x] Monorepo scaffolded (pnpm workspaces)
- [x] Design tokens defined (3 levels: primitive → semantic → component)
- [x] Core schemas + registries (zod schemas, Adobe Product Registry with 15 products)
- [x] CI workflow ready (.github/workflows/deploy.yml)
- [x] First build passes

### Checkpoint B — Build ✅
- [x] All 9 blocks built (Hero, NarrativeSection, FrontBackStageSplit, JourneyPhase, PersonaCard, ProductGateway, AdobeStackReveal, MetricCallout, Timeline)
- [x] All 8 pages assembled with real IT content (Home, Acquisizione, Engagement, Conversione, Loyalty, Il Motore Adobe, Persona, Chiusura/CTA)
- [x] Site navigable with Navigation + Footer
- [x] Build passes (8 pages in ~800ms), deploy-ready

### Checkpoint C — Hardening ✅
- [x] Build clean (no warnings)
- [x] Base URL slash bug fixed (favicon + hero CTA)
- [x] Responsive layouts (mobile-first, min 360px)
- [x] `prefers-reduced-motion` respected (all animations opt-out)
- [x] a11y: focus-visible, ARIA labels, semantic HTML, sr-only utility

### Checkpoint D — Docs & Productization ✅
- [x] Design spec written (docs/superpowers/specs/)
- [x] SKILL.md created (skills/experience-design/)
- [x] New client runbook (docs/new-client-in-30-min.md)
- [x] site.config.ts with full page/block definitions
- [x] RUN-REPORT complete

---

## Errors & Recovery

### Tailwind v4 / Astro 6 Integration
**Issue:** Initial scaffold used `@astrojs/tailwind` (v3 pattern). Tailwind v4 requires `@tailwindcss/vite` as a Vite plugin instead.
**Fix:** Replaced `@astrojs/tailwind` with `@tailwindcss/vite`, moved from `integrations` to `vite.plugins`, added `@import "tailwindcss"` and `@theme {}` block in global.css.

### @astrojs/check version
**Issue:** Agent scaffolded `@astrojs/check@^0.10.0` which doesn't exist (latest is 0.9.9).
**Fix:** Corrected to `^0.9.9`.

### Base URL trailing slash
**Issue:** `import.meta.env.BASE_URL` returns `/experience-design-factory` (no trailing slash). Concatenation like `${base}favicon.svg` produced `/experience-design-factoryfavicon.svg`.
**Fix:** Added `.replace(/\/?$/, '/')` where BASE_URL is used in concatenation. Added `trailingSlash: 'always'` to Astro config.

### Tailwind v4 monorepo @source (post-review fix)
**Issue:** Tailwind v4 does not auto-scan pnpm-symlinked packages. Components in `packages/core/src/` used Tailwind utility classes (`hidden`, `md:flex`, `sticky`, `max-w-7xl`, etc.) but those classes were never generated in the CSS output. Result: no layout/spacing, navigation menu appeared twice (desktop `<ul>` not hidden on mobile).
**Root cause:** Tailwind v4's content detection follows filesystem paths, not symlinks. The `@agargiulo-adbe/experience-core` workspace package is symlinked in `node_modules/` but its actual source lives in `../../packages/core/src/`, outside Tailwind's default scan scope.
**Fix:** Added `@source` directives in `global.css` immediately after `@import "tailwindcss"`:
```css
@source "../../../../packages/core/src/**/*.{astro,ts,tsx,js,jsx,mjs}";
@source "../**/*.{astro,ts,tsx,js,jsx,mjs}";
```
**Verified:** CSS output now contains `.hidden`, `.flex`, `.sticky`, `md:flex`, `max-w-*`, etc. Nav renders once (desktop hidden on mobile, mobile hidden by default).

### Internal links 404 with trailingSlash: 'always' (post-review fix)
**Issue:** `trailingSlash: 'always'` in `astro.config.mjs` means Astro serves pages only at paths with trailing slash (e.g. `/experience-design-factory/acquisizione/`). But Navigation and hero CTA links were built without trailing slashes (e.g. `/experience-design-factory/acquisizione`), causing 404s in the dev server.
**Root cause:** Manual string concatenation `${base}${href}` without normalizing slashes or ensuring trailing slash.
**Fix:** Created centralized `packages/core/src/utils/url.ts` with `href(base, path)` helper that joins segments, deduplicates slashes, and always appends a trailing slash. Updated Navigation.astro and index.astro hero CTA to use it. All 8 pages now return HTTP 200.

### Grigio var name inconsistency
**Issue:** `@theme` block defined `--color-grigio-100` (with hyphen) but `:root` and blocks used `--color-grigio100` (no hyphen). Footer and AdobeStackReveal referenced non-existent vars.
**Fix:** Standardized all references to use hyphens (`grigio-100`, `grigio-200`, etc.) across global.css, tokens.ts, css-generator.ts, Footer.astro, AdobeStackReveal.astro.

---

## Cambio di direzione: Experience Design immersivo

### Acquisizione — step-by-step (reference page)
Trasformata da brochure densa a flusso immersivo con scroll-snap:
- 6 step a schermo pieno (`min-h-[100dvh]`, `scroll-snap-type: y mandatory`)
- **Step 1:** Apertura fase — titolo + frase, scroll hint
- **Step 2:** Data lake → profili (animazione GSAP: punti sparsi che convergono in profili)
- **Step 3:** Front stage — ciò che vede la cliente (mockup phone)
- **Step 4:** Impulso front→back — l'aha (SVG pulse line animated)
- **Step 5:** Back stage — 5 prodotti Adobe rivelati uno alla volta (stagger)
- **Step 6:** Payoff — metrica count-up (75%) + CTA fase successiva

### Componenti riusabili creati
- `packages/core/src/blocks/immersive/StepContainer.astro` — scroll-snap wrapper
- `packages/core/src/blocks/immersive/Step.astro` — singolo step full-screen
- `packages/core/src/blocks/immersive/animations.ts` — sistema animazioni GSAP
  - `initReveal()` — fade-up al scroll
  - `initCountUp()` — numeri animati
  - `initStagger()` — elementi che entrano uno alla volta
  - `initPulse()` — impulso SVG front→back
  - `initDataLake()` — data dots → profili unificati
  - Tutto con `prefers-reduced-motion` rispettato (stati finali statici)

### In attesa di revisione
Le altre 7 pagine NON sono state toccate. Aspettano il feedback su Acquisizione prima di propagare il pattern.

---

## What to Review

1. `pnpm dev` → `/experience-design-factory/acquisizione/` — verificare il flusso step-by-step
2. Scroll-snap: uno step per schermata, avanzamento fluido
3. Animazioni: data lake → profili, impulso front→back, prodotti stagger, count-up 75%
4. Responsive a 360px (step si adattano)
5. `prefers-reduced-motion`: stati finali statici, no movimento
6. Le altre pagine restano come prima (non toccate)

## TODO (future phases)
- [ ] Factory Console (apps/console) — local SPA editor + Node backend
- [ ] Self-host fonts (currently Google Fonts CDN)
- [ ] Firefly/placeholder imagery for media slots (currently empty placeholders)
- [ ] EN locale content
- [ ] Publish @agargiulo-adbe/experience-core to GitHub Packages
- [ ] Template repository setup
- [ ] Create GitHub repo + push to remote
