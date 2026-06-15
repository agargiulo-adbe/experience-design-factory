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
