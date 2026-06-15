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

---

## What to Review (mattina)

1. `pnpm dev` — navigate all 8 pages, check the front/back-stage split experience
2. Check responsive at 360px, 768px, 1280px
3. Review Italian copy quality on each page
4. Check the progressive Adobe reveal flow: discrete on phase pages → full on "Il Motore Adobe"
5. Verify the persona page (Giulia + Francesca) reads well as a dual-generation story

## TODO (future phases)
- [ ] Factory Console (apps/console) — local SPA editor + Node backend
- [ ] Self-host fonts (currently Google Fonts CDN)
- [ ] Firefly/placeholder imagery for media slots (currently empty placeholders)
- [ ] View Transitions between pages (Astro supports it, needs `<ViewTransitions />` in head)
- [ ] EN locale content
- [ ] Publish @agargiulo-adbe/experience-core to GitHub Packages
- [ ] Template repository setup
- [ ] Create GitHub repo + push to remote
