# Experience Design Factory — Agent Guide

## Project Overview
Monorepo for the **Experience Design Factory**: a reusable engine where each client
**Experience Design** is a *skin* (design tokens + content + assets + config) over the
shared core. On top sits a **Super Admin Console** to manage experiences and the users
who can configure them.

Experiences today:
- **Generazioni** — Max Mara (IT, quiet‑luxury). First instance.
- **Engagement Unlimited** — UniCredit (IT, 11 sections).
- **Pole Position** — Ferrari Racing × Adobe (EN/IT bilingual, motorsport, 7 sections).

Only public Adobe capabilities / demo material — **no reserved client IP**, and **no
wrong‑brand imagery** (see Quality Bar).

## Commands
- `pnpm dev` — run the default dev server · `pnpm build` — build **all** apps · `pnpm lint` · `pnpm typecheck`
- `pnpm --filter <app> dev|build|preview` — per app (`generazioni-maxmara`, `unicredit-engagement`, `ferrari-racing`, `console`)
- `pnpm --filter unicredit-engagement audit:deck` — deterministic deck layout audit (3 viewports)
- `pnpm --filter <app> assets:build` — fetch/grade **Pexels** assets → `src/assets/generated/` + `provenance.json`. Reads `PEXELS_API_KEY` from the app's `.env` (gitignored). Re‑fetches ALL slots; to regenerate a subset use `--manifest <tmp>` with only those slots.

## Apps & structure
- `packages/core` — shared engine (`@agargiulo-adbe/experience-core`, alias `@edf/core`): experience blocks, the **immersive deck** (`blocks/immersive/*`), the **shared Admin Console** (`blocks/admin/AdminConsole.astro`), **i18n** (`blocks/i18n/T.astro` + `LangToggle.astro`), design‑token contract, motion.
- `apps/generazioni-maxmara` · `apps/unicredit-engagement` · `apps/ferrari-racing` — client experiences (Astro static, per‑app `global.css` tokens + `assets.manifest.ts` + `BaseLayout.astro` + `/admin/` wrapper).
- `apps/console` — **Super Admin Console** (auth, users, experiences registry).
- `supabase/` — backend: `migrations/` (schema + seeds), `functions/invite-user/` (Edge Function), `README.md` (one‑time setup).

## Deployment
- Public repo `agargiulo-adbe/experience-design-factory`; GitHub Pages source = **GitHub Actions** (`.github/workflows/deploy.yml`, Node 22).
- Build merges every app's `dist` into one artifact: root = maxmara; `/unicredit-engagement/`, `/ferrari-racing/`, `/console/`. Each app: Astro `base = /experience-design-factory[/<app>]`, `trailingSlash: 'always'`.
- Live e.g. `https://agargiulo-adbe.github.io/experience-design-factory/ferrari-racing/`.
- Push to `main` auto‑deploys. The **deploy job retries** on transient GitHub Pages `syncing_files` failures (backend can be flaky) and skips stale commits.
- Build env: `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` from **GitHub Actions secrets** (never in repo).

## Super Admin Console (`apps/console`, `/console/`)
Multi‑user, real auth. Light "admin" theme.
- **Auth**: Supabase Auth (email/password + magic link), dependency‑free `fetch` client in `src/lib/supabase.ts`; client‑side guard `src/lib/guard.ts` (login redirect + super‑only gate).
- **Roles**: global `is_super_admin` flag + per‑experience `user_experience_roles` (`admin`|`viewer`).
- **Views**: `index` (experiences: status live/draft/archived, open Console), `users` (super‑only: invite by email, toggle super admin, suspend, per‑experience access). `[project]/` redirects to that experience's `/admin/`.
- **Backend** (run once, see `supabase/README.md`): `0001_super_admin.sql` (tables + RLS + signup trigger; bootstraps `agargiulo@adobe.com` as super admin) and `0002_seed_ferrari.sql`. Invites use the `invite-user` Edge Function (service_role lives ONLY there). `experiences` is the registry of record for the dashboard.
- Run remote SQL via `supabase db query --linked` (Management API, needs `supabase link` + the agargiulo‑adbe account login).

## Shared Admin Console engine (config‑driven — CR/evo propagate to ALL)
`@edf/core/blocks/admin/AdminConsole.astro` is ONE engine; each experience's
`src/pages/admin.astro` is a **thin wrapper** passing `projectSlug`, `projectName`,
`pages` (PAGE_REGISTRY), `solutionGroups`, `deckHref`, Supabase env. **Improve the engine
once → every experience gets it.** Three tabs:
1. **Sezioni dell'esperienza** — turn Adobe *solutions* on/off.
2. **Media demo per slide** — attach image/video to any slide + shareable link.
3. **Slide personalizzate** — author new deck‑coherent slides (see below).

### Solution gating
Each solution controls where it appears. State in `localStorage['edf-solutions-<slug>']`
(array of active ids) + shareable `?s=id1,id2`. In the deck: `data-solution` on gated
slides/chips, `data-nav-solution` on nav links; `pageSolutions` per page. The BaseLayout
runtime hides inactive ones, hides their nav entries, and **rewrites `data-deck-next` to
skip gated sections** (so arrow nav never lands on a hidden section). Multi‑solution
section = hidden only when ALL its solutions are off.

### Media demo slots
`MediaDemoSlot` inside a `data-demo-flex` slide. Config in
`localStorage['edf:media-slots:<slug>']`; shared via Supabase `media_configs` (`?cfg=<uuid>`).

### Custom slides authoring
Admin tab creates slides in any section (formatted text / image / video) with a live
preview using the real deck tokens. Stored in `localStorage['edf:custom-slides:<slug>']`;
runtime `window.__edfInjectCustomSlides` builds a `Slide.astro`‑shaped `<section data-slide
data-edf-custom>` (sanitized), injected before the deck counts slides. Rides shared links
inside the media config under `__customSlides`. Styling: `.cs-*` classes in each `global.css`.

## Bilingual (i18n)
`<T en="…" it="…" as="h2" class="…" />` renders BOTH languages; global CSS on
`html[data-lang]` shows the active one (instant, no reload). `LangToggle` sets + persists
`localStorage['edf:lang']`; anti‑flash init in `<head>`. Ferrari defaults EN with EN/IT
toggle; maxmara/unicredit are IT.

## Responsive & fullscreen (all experiences)
The immersive deck **auto‑optimises mobile → desktop → giant TV** from a single source:
`DeckContainer.astro` `<style is:global>` overrides the safe‑area tokens **scoped to
`[data-deck]`** by breakpoint (phone ≤640: tight insets + dense slides scroll with
`overflow-y:auto; justify-content: safe center`; tablet; phone‑landscape; giant TV ≥2200:
larger insets + controls). No per‑app edits needed. **Fullscreen** targets
`document.documentElement` and **persists across sections** because cross‑section nav uses
ClientRouter SPA navigation (`window.__edfNavigate`), not a full reload.

## Code Conventions
- TypeScript, strict. Astro for pages/layouts; islands only where interactive.
- Tailwind + CSS custom properties from tokens — **NO hardcoded color/spacing**.
- Each experience defines the token contract in its `global.css`: surfaces (`--surface-primary|secondary|inverse|brand`), ink, `--accent-primary|secondary`, `--font-display|body`, `--line-subtle`, `--slide-safe-inset`, `--deck-chrome-safe`. Keep the primary/secondary=light, inverse=dark, brand semantic so shared blocks work.
- Real copy — no lorem ipsum. Commit often (conventional commits). **NEVER commit secrets** (`.env`, tokens, service_role).

## File Ownership (for parallel work)
- `packages/core/**` — shared engine (changes propagate to all experiences: verify each).
- `apps/generazioni-maxmara/**` · `apps/unicredit-engagement/**` · `apps/ferrari-racing/**` — per experience.
- `apps/console/**` — Super Admin. `supabase/**` — backend. `**/*.test.ts`, `e2e/**` — QA.

## Quality Bar
- WCAG 2.2 AA, Lighthouse ≥ 95. **Auto‑responsive mobile → desktop → giant TV** (deck handles safe‑area + scroll); `prefers-reduced-motion` respected.
- Real copy (EN/IT where the experience is bilingual). Adobe revealed progressively; co‑brand discreet.
- **No wrong‑brand imagery**: Pexels stock has no client cars/logos; NEVER show a non‑client car (e.g. a competitor F1 car) or foreign logo. Use abstract/atmospheric imagery (carbon, asphalt, floodlight bokeh, crowd, podium, telemetry). If official client assets are provided, use those.
- Config‑driven: every page = ordered slides; solutions/media/custom‑slides toggle at runtime.

## Error Recovery
If you encounter errors, diagnose, fix, and continue. Do not stop.

## Deck visual contract
Some pages are **keynote decks** (full‑screen slides, projected at **1920×1080**, but now
also auto‑responsive down to mobile and up to giant TV). Claude can *see* its output: the
**playwright MCP** (browser_* tools) for interactive inspection, and `scripts/deck-audit.ts`
(`pnpm --filter unicredit-engagement audit:deck`) as the deterministic DOM gate at
projection sizes. Measure bounding boxes → pass/fail; screenshots only confirm failures.

### Component API (deck)
- `immersive/DeckContainer.astro` — deck wrapper (`fixed inset-0`, no scroll). Chrome:
  progress `NN/NN`, prev/next, fullscreen (auto‑hide; hidden while a panel is open via
  `data-deck-lock`). Prop `nextHref` → advancing past the last slide (SPA nav, keeps fullscreen).
  Holds the responsive token overrides + exposes `__edfInitDeck` / `__edfNavigate`.
- `immersive/Slide.astro` — one slide. **Safe‑area contract:** content inside viewport minus
  token gutters, **vertically centred**, height‑bounded, **never clipping** at projection sizes
  (on phones it may scroll). Slots: default + `backdrop`. `bg` = primary|secondary|inverse|brand;
  `align` = center|left|split. If content doesn't fit at 1920×1080 → SPLIT.
- `immersive/deck.ts` — presenter controller (←/→/↑/↓, Space, PageUp/Down, Home/End, click
  halves, swipe, `F`). Fires `prepareSlide`/`playSlide` on activation. Pauses on `data-deck-lock`.
- `SlideBackdrop.astro` — atmospheric backdrop in the `backdrop` slot, under a scrim (WCAG‑AA). `imageClass` opacity, `scrim` class.
- `MediaSlot.astro` — `<Picture>` (WebP) or palette placeholder; `fill`, `noText="t,l,w,h"` (% face/subject zone).
- `MediaDemoSlot.astro` — admin‑fed media box inside a `data-demo-flex` slide.
- `blocks/i18n/T.astro`, `LangToggle.astro` — bilingual text + language switch.
- `blocks/admin/AdminConsole.astro` — the shared config‑driven Admin Console.

### The 12 checks every slide must pass — at 1920×1080, 1440×900 AND 1280×800 (`audit:deck`)
> `audit:deck` runs all three projection viewports (mobile is handled separately by the
> responsive tokens, where dense slides may scroll). A **display hero** (giant metric numeral)
> is tagged `data-display` and excluded from the prose band check (a).
1. **(a) text not too high** — significant text centre in the central band (30%–70%).
2. **(b) no chrome collision** — no content text intersects the deck controls.
3. **(c) margins / no overflow** — no box past `--slide-safe-inset`; no horizontal overflow.
4. **(d) no text over faces** — no text over an image's `[data-no-text]` zone; text over an image needs a `[data-scrim]`.
5. **(e) no text-on-text** — no two (non‑nested) text blocks overlap.
6. **(f) clean slide-over** — an OPEN slide‑over is a top‑level fixed dialog within the viewport, no scroll/clip, full‑viewport scrim, width ≤ min(720px,60vw).
7. **(g) vertical rhythm** — adjacent stacked text blocks (outside cards) have ≥ 16px gap.
8. **(h) button contrast** — every button/CTA meets WCAG AA (4.5:1; 3:1 large/icon).
9. **(i) space usage** — content covers ≥ 45% of usable height, centre of mass in the central band.
10. **(j) nothing clipped** — every significant element lies fully inside `[0,0,1920,1080]` (±1px).
11. **(k) no hidden scroll** — no container has `scrollHeight > clientHeight` at projection sizes (a keynote never scrolls there: shorten or split).
12. **(l) trigger not obstructed** — while a panel is open, interactive elements are EITHER fully under the scrim OR fully visible.

Contract details:
- **Safe‑area tokens** in `global.css` (px): `--slide-safe-inset`, `--deck-chrome-safe`. `Slide`
  centres on the VIEWPORT centre with a symmetric chrome reserve; `DeckContainer` overrides
  these per breakpoint scoped to `[data-deck]`.
- **Layering:** the base reset MUST be in `@layer base` — an unlayered `*{margin:0}` / `a{color}` beats Tailwind utilities.
- **Custom‑slide styling:** `.cs-*` classes in `global.css` are shared by the deck injection AND the admin live preview → keep them in sync per experience.
- **`data-no-text="t,l,w,h"`** (% face/subject zone), **`data-scrim`** behind text‑over‑image.

### Aesthetic per experience
- **Max Mara** quiet‑luxury: cammello `#C19A6B` / avorio / testa‑di‑moro; Cormorant Garamond + Inter.
- **UniCredit**: rosso `#BE2027` / crema / blu notte; Playfair Display + Inter.
- **Ferrari Racing**: Rosso Corsa `#FF2800` / carbonio `#0B0B0D` / giallo Modena `#FFF200`; Archivo + Inter; dark‑dominant, motorsport. Terms: Cavallino Rampante, Rosso Corsa, Maranello, Tifosi, Scuderia Ferrari HP.
