# New Client in 30 Minutes

## Prerequisites
- Node.js ≥ 20, pnpm ≥ 9
- GitHub account with access to agargiulo-adbe org

## Steps

### 1. Create from template (2 min)
Use the GitHub template repository to create a new repo for the client.
```bash
gh repo create agargiulo-adbe/[client-name] --template agargiulo-adbe/experience-design-factory --private
git clone [new-repo-url] && cd [client-name]
```

### 2. Define design tokens (10 min)
Edit `generazioni.tokens.json` → rename to `[client].tokens.json`:
- Update colors to match client brand palette
- Update font families
- Keep the structure — primitive tokens only

### 3. Configure the site (5 min)
Edit `site.config.ts`:
- Change `client` name
- Define pages and block composition
- Set visibility flags

Edit `astro.config.mjs`:
- Update `site` URL
- Update `base` path (usually `'/[repo-name]'`)
- Keep `trailingSlash: 'always'`

Edit `src/styles/global.css`:
- Update the `@source` directives if your monorepo paths differ (Tailwind v4
  does not auto-scan pnpm-symlinked packages — see Gotchas).

### 4. Build the immersive pages (10 min per page)
Each page is an **immersive step-by-step flow**, not a stack of brochure blocks.
Reuse `StepContainer` / `Step` / `animations.ts` from
`@edf/core/blocks/immersive/`. Follow the sequence-type:
1. Apertura (title + one line) 2. Value animation (the phase metaphor)
3. Front stage 4. Front→back impulse 5. Back stage (Adobe products one at a time)
6. Payoff metric (count-up) + CTA.

Keep little text per step. Build internal links with `href(base, path)`.
If a phase needs a new metaphor, add an `init*` primitive in `animations.ts`
(reduced-motion safe) and register it in `initAllAnimations`.
Map Adobe products to the client's journey phases in the back-stage steps.

### 5. Add assets (3 min)
- Logo in `src/assets/`
- Favicon in `public/`
- Brand images or Firefly-generated placeholders

### 6. Test and deploy (5 min)
```bash
pnpm install
pnpm dev        # verify locally — one step per screen, animations start, 360px, reduced-motion
pnpm build      # test production build (all pages)
pnpm typecheck  # tsc + astro check must be green
git push        # keep remote in sync; triggers GitHub Actions → GitHub Pages
```

## Gotchas (learned the hard way)
- **Tailwind v4 + monorepo:** Tailwind does not follow pnpm symlinks. Add
  `@source` directives in `global.css` pointing at `packages/core/src/**` and the
  app's `src/**`, or utility classes used in core components won't be generated.
- **Trailing slashes:** with `trailingSlash: 'always'`, hand-built links without a
  trailing slash 404. Always use `href(base, path)`.
- **Base URL:** `import.meta.env.BASE_URL` has no trailing slash — normalise before
  concatenating (`.replace(/\/?$/, '/')`).
- **GSAP scroller:** ScrollTrigger must use the `StepContainer` element as
  `scroller`, not the window, because scrolling happens inside it.
- **Reduced motion:** every primitive must paint the final static state and return
  early; never leave content at `opacity:0`.
- **Hyphenated TS keys** (`grigio-100`) must be quoted — esbuild tolerates them,
  `tsc` (so `pnpm typecheck`) does not.
- **Translucency in raw CSS:** use `color-mix(in srgb, var(--token) N%, transparent)`,
  not Tailwind's `var(--token)/N` slash syntax (invalid outside utility classes).

## Splitting a client into its own repo
When ready to share a client instance independently:
1. Create a new repo from the template
2. Copy the client's content, tokens, and config
3. Update `base` in `astro.config.mjs` to match the new repo name
4. Enable GitHub Pages in the new repo settings
5. The shared engine stays as a workspace dependency
