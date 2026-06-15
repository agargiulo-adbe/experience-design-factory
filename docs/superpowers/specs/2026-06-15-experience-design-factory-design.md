# Experience Design Factory — Design Specification

## Context
The Experience Design Factory is a reusable system for creating branded experience design websites. Each client is a "skin" (design tokens + content + assets) over a shared engine of 9 experience blocks. The first instance is "Generazioni" for Max Mara.

## Architecture

### Monorepo (pnpm workspaces)
- `packages/core` — Shared engine (`@agargiulo-adbe/experience-core`)
  - 9 typed experience blocks (Astro components)
  - Design token system (primitive → semantic → component)
  - Zod schemas for config-driven composition
  - Adobe Product Registry
  - Layout components (Navigation, Footer, PageLayout)
  - i18n utilities (IT default, EN secondary)
- `apps/generazioni-maxmara` — First client instance
  - Astro 6 static site for GitHub Pages
  - 8 pages with real Italian content
  - Client-specific design tokens
  - Site configuration (site.config.ts)

### Stack
- **Astro 6** — static site generation with View Transitions
- **Tailwind CSS v4** — via @tailwindcss/vite plugin
- **TypeScript** — strict mode, zod schemas
- **CSS Custom Properties** — design tokens as CSS variables
- **GitHub Actions** — CI + deploy to GitHub Pages

### Design Token System (3 levels)
1. **Primitive** — raw design scale (colors, typography, spacing, motion)
2. **Semantic** — design intent (surface, ink, accent, line, focus)
3. **Component** — per-block tokens (hero, narrative, frontBackStage, etc.)

New clients override primitive tokens via `*.tokens.json` files.

## The 9 Experience Blocks
1. **Hero** — Full-bleed manifesto with title, subtitle, CTA
2. **NarrativeSection** — Text + media storytelling
3. **FrontBackStageSplit** — THE SIGNATURE: customer view ↔ Adobe platform split
4. **JourneyPhase** — Numbered journey phase with description
5. **PersonaCard** — Persona profile with story
6. **ProductGateway** — Product entry point showcase
7. **AdobeStackReveal** — Progressive Adobe stack reveal by phase
8. **MetricCallout** — Impactful metric with context
9. **Timeline** — Chronological story

## Config-Driven Composition
Every page is defined in `site.config.ts` as an ordered list of blocks with visibility flags. This enables future console editing without code changes.

## Quality Bar
- WCAG 2.2 AA compliance
- Responsive to 360px
- `prefers-reduced-motion` respected
- Real Italian copy (no lorem ipsum)
- Lighthouse ≥ 95 target
- Adobe revealed progressively, co-brand discrete

## Deploy
GitHub Pages via GitHub Actions. No external secrets needed (uses built-in GITHUB_TOKEN).
Base path: `/experience-design-factory/`
