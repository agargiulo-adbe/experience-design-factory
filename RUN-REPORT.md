# Run Report — Experience Design Factory

## Status: Phase A — Foundations
**Started:** 2026-06-15 ~22:45 CEST

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
- **Display:** Cormorant Garamond (self-hosted, OFL license) — high-fashion serif with Italian elegance
- **Body/UI:** Inter (self-hosted, OFL license) — clean grotesque, excellent readability
- Scale: fluid clamp-based (display 3rem→5rem, h1 2rem→3.5rem, body 1rem→1.125rem)

### Signature Elements
1. **Front/Back-Stage Split** — the "aha": synchronized view of customer experience ↔ Adobe platform powering it
2. **Generazioni motif** — thread connecting young customer to heritage client, visual through timeline
3. **Progressive Adobe reveal** — Adobe enters discreetly, builds through the journey, fully revealed on "Il Motore Adobe" page

### Architecture
- Astro 5 static site, View Transitions for page-to-page immersion
- CSS custom properties from design tokens → Tailwind utility classes
- 9 typed experience blocks in packages/core, config-driven assembly
- GitHub Pages deploy via Actions (GITHUB_TOKEN only, no external secrets)

---

## Checkpoints

### Checkpoint A — Foundations
- [x] Monorepo scaffolded (pnpm workspaces)
- [ ] Design tokens defined (3 levels)
- [ ] Core schemas + registries
- [ ] CI workflow ready
- [ ] First build passes

### Checkpoint B — Build
- [ ] All 9 blocks built
- [ ] All 8 pages assembled with IT content
- [ ] Site navigable with View Transitions
- [ ] Build passes, deploy-ready

### Checkpoint C — Hardening
- [ ] Lint + typecheck green
- [ ] Responsive verified (360px+)
- [ ] reduced-motion respected
- [ ] a11y basics verified

### Checkpoint D — Docs & Productization
- [ ] Design spec written
- [ ] SKILL.md created
- [ ] RUN-REPORT complete

---

## Errors & Recovery
(will be filled as needed)
