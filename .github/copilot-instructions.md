# Copilot instructions

## Repository shape

This is a pnpm workspace (`apps/*`, `packages/*`) for the Experience Design Factory:

- `packages/core` (`@edf/core`) is the shared Astro/TypeScript engine. It owns the immersive deck primitives (`DeckContainer`, `Slide`, media/backdrop blocks, navigation/runtime), i18n, co-brand and “made with” chrome, and the shared Admin Console.
- Most `apps/*` are independent Astro experiences. Each experience is a skin over the shared core: its own `global.css` design tokens, assets, pages, `BaseLayout.astro`, and thin `/admin/` wrapper.
- `apps/factory-hub` is the deployed root landing page. `apps/factory-showcase` is a separate scroll site, not a deck. `apps/console` is the Super Admin Console.
- `supabase/migrations` contains the backend schema/seeds/RLS. `scripts` contains asset, video, brand-token, content, registry, and deck-audit tooling.

The GitHub Pages deployment builds every app and merges the app `dist` directories into one `pages` artifact. App `astro.config.*` files use a `/experience-design-factory/<app>` base and `trailingSlash: 'always'`; preserve that convention when adding routes or links.

## Commands

Use Node 22 in CI, Node >=20 locally, and pnpm 11 (the workspace requires pnpm >=9).

```bash
pnpm install
pnpm dev                         # default Generazioni / Max Mara app
pnpm --filter <app> dev          # run one app
pnpm build                       # build every workspace app
pnpm --filter <app> build        # build one app
pnpm --filter <app> preview      # serve a static build for browser/audit checks
pnpm lint
pnpm typecheck
pnpm test                        # all workspace Vitest tests
pnpm test:scripts                # Vitest tests under scripts/
pnpm vitest run path/to/file.test.ts
pnpm vitest run path/to/file.test.ts -t "name"
```

Each Astro app also exposes `typecheck`, `build`, and `preview`; apps that are deck experiences expose `audit:deck`. For a single deck audit, build first, serve the static output, then pass the preview origin (not the app path):

```bash
pnpm --filter unicredit-engagement build
pnpm --filter unicredit-engagement preview --port 4399
DECK_URL=http://localhost:4399 pnpm --filter unicredit-engagement audit:deck
DECK_URL=http://localhost:4399 pnpm --filter unicredit-engagement audit:deck --only analizza
```

The audit covers 1920×1080, 1440×900, and 1280×800. It reports hard rendering checks separately from soft composition checks; do not reduce type size just to satisfy a soft check. Static preview is required because dev-server HMR can prevent the audit’s `networkidle` wait from completing.

For new client skins, run `pnpm brand:tokens <public-client-url>` before choosing tokens. For generated/stock assets use the relevant app’s `assets:build` (requires a gitignored `PEXELS_API_KEY` in that app’s `.env`). For generated looping video, run `pnpm loop:seamless <clip.mp4> --poster`; validate an existing result with `pnpm loop:seamless --check <clip.mp4>`.

## Change boundaries and architecture

Shared behavior belongs in `packages/core`, not in each app. In particular, `DeckContainer` owns the deck runtime and derives the project slug from the app base URL, so chapter/slide gating, solution gating, custom-slide injection, co-brand state, made-with credits, responsive safe areas, and cross-section navigation should not be reimplemented in app layouts.

Each deck page is composed from `BaseLayout` → `DeckContainer` → ordered `Slide` components. Every section must provide both `nextHref` and `prevHref` so navigation can cross section boundaries. Use the shared `href` helper for base-aware URLs. When adding or removing slides, update that experience’s `/admin/` `PAGE_REGISTRY` as well as the page itself; the registry drives chapter/slide configuration and admin previews.

The shared Admin Console is config-driven. App admin pages should remain thin wrappers that pass `projectSlug`, project metadata, `PAGE_REGISTRY`, solution groups/IDs, deck URL, and Supabase environment values to `AdminConsole.astro`. Improve the shared engine once rather than copying fixes into app consoles.

Runtime configuration is intentionally client-side and browser-scoped:

- solution toggles: `localStorage['edf-solutions-<slug>']` and share links using `?s=...`;
- chapter/slide toggles: `localStorage['edf:chapters:<slug>']`;
- media slots: `localStorage['edf:media-slots:<slug>']`, with Supabase-backed shared configs;
- custom slides: `localStorage['edf:custom-slides:<slug>']`;
- shared chapter previews use the `edf-console` `BroadcastChannel`;
- chapter share links use session storage, not persistent local storage.

The showcase reads `experiences.show_in_showcase` at runtime through the anonymous Supabase policy and fails closed to its checked-in default list when configuration/network data is unavailable. Do not expose restricted client material merely by adding it to showcase data.

## Project-specific conventions

- Keep experience styling token-based. Each `global.css` defines the semantic surface/ink/accent/font contract expected by shared blocks; do not hardcode colors or replace semantic ink tokens with raw brand colors in shared components.
- The immersive deck is designed for projection as well as mobile. Body text at projection size must remain at least `0.95rem` with readable ink and line-height at least `1.5`; if content does not fit, shorten or split the slide, never shrink it below the legibility contract.
- Treat deck audit hard checks (`b`, `c`, `d`, `e`, `h`, `j`, `k`, `m`, and expanded-state `exp`) as rendering bugs. Check `m` carefully: first-level left-aligned blocks must share the same left edge. Soft checks (`a`, `g`, `i`) are composition signals, not a reason to make text illegible.
- Slides with text over media need the appropriate scrim/no-text metadata. Background video must use `LoopVideo.astro` and a seam-processed `*.loop.mp4`; keep the original source and provenance.
- Every client experience uses the shared `CoBrand` chrome/hero contract and `MadeWith` chrome. Declare `data-made-with` only for products actually used to create that slide’s asset; do not use a false fallback for mixed assets. Client logos must be official SVG assets or the component’s automatic text fallback.
- Bilingual copy uses `<T en="..." it="..." />` with both languages present; `LangToggle` controls the active language without a reload. Keep copy human, concrete, and free of placeholder/lorem ipsum text.
- Product naming and client facts must be verified against the authoritative material in `docs/`; changes to shared product names or shared engine behavior propagate to every affected experience, its admin registry, and hub/showcase references.
- Home roadmaps made of cards use equal-height cards in a balanced grid (`auto-rows-fr`/`h-full`). Preserve the title guard in every `BaseLayout` so a home page does not render a duplicated `SiteName | SiteName`.
- Keep secrets out of the repository: `.env` files, Supabase `service_role`, API keys, and client-restricted source material are local/secret inputs. Public Supabase values are injected by GitHub Actions at build time.

## Reading project guidance

Read `docs/README.md` and then `docs/HANDOVER.md` for current state and the handover manifest before broad changes. `CLAUDE.md` is the detailed binding agent guide; follow its deck visual/legibility, brand calibration, co-brand, asset provenance, and deployment rules. Do not read large `.pptx`/`.mp4` files wholesale; use the distilled handover or selective extraction when a source fact must be verified.
