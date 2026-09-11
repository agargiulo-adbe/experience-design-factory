# Experience Design Skill

Build branded, **immersive** experience-design sites where each client is a skin
(tokens + content + assets) over a shared engine. The signature format is a
**step-by-step immersive flow**: each page is a vertical sequence of full-screen
steps, scroll-snapped, where **animation explains the value** — not decoration.

## Method
1. **Brand Research** — values, audience, strategy, tone of voice.
2. **Design Tokens** — 3-level system (primitive → semantic → component) from brand guidelines.
3. **Journey Mapping** — split the experience into phases (e.g. Acquisizione → Engagement → Conversione → Loyalty), each its own immersive page.
4. **Storyboard each page** as a sequence of full-screen steps (see Sequence-type below).
5. **Front/Back-Stage Mapping** — for each phase, define what the customer experiences AND what Adobe does behind the scenes; reveal Adobe products **one at a time**.
6. **Content** — minimal copy per step, original, in the client's language (IT default), editorial tone.
7. **Quality Check** — one step per screen, no overlap, animations start on scroll, responsive to 360px, `prefers-reduced-motion` respected.

## The immersive model (reference: the Acquisizione page)
Each page = `StepContainer` wrapping N × `Step`, plus one `<script>` that calls
`initAllAnimations(container)` (re-run on `astro:after-swap` for View Transitions).

- `packages/core/src/blocks/immersive/StepContainer.astro` — scroll-snap wrapper (`height:100dvh; scroll-snap-type: y mandatory`). Disables snap under reduced-motion.
- `packages/core/src/blocks/immersive/Step.astro` — one full-screen step (`min-h-[100dvh]`, `snap-start`), `bg` = `primary|secondary|inverse|brand`, `align` = `center|left|bottom-left`.
- `packages/core/src/blocks/immersive/animations.ts` — GSAP + ScrollTrigger primitives, all reduced-motion safe (they paint the final static state and return early).

### Sequence-type (per phase page)
1. **Apertura** — phase number + title + one sentence + scroll hint.
2. **Value animation** — the metaphor that *explains* the phase (see primitives).
3. **Front stage** — what the customer sees (phone/screen mock, short copy).
4. **Front→Back impulse** — the "aha": a pulse line from customer action to platform.
5. **Back stage** — Adobe products revealed **one at a time** (stagger).
6. **Payoff** — a metric with count-up + CTA to the next phase.

Keep **little text per step**; let the animation carry the meaning.

### Animation primitives (`animations.ts`)
Each is driven by a `data-*` attribute on markup and degrades gracefully:
| Primitive | Attribute | Metaphor / use |
|-----------|-----------|----------------|
| `initReveal` | `data-reveal` (+`data-reveal-delay`,`data-reveal=up\|down\|left\|right`) | fade/slide content in on scroll |
| `initCountUp` | `data-count-up` (+`data-count-prefix`/`-suffix`) | animated metric in the payoff |
| `initStagger` | `data-stagger="0.2"` | children enter one by one (back-stage product list) |
| `initPulse` | `data-pulse-line` (`.pulse-path`,`.pulse-dot`) | front→back impulse (the aha) |
| `initDataLake` | `data-datalake` (`.data-dot`,`.profile-circle`) | scattered data → unified profiles |
| `initPersonalize` | `data-personalize` (`.perso-item`,`data-match`) | generic content resolves to a personalized match (Engagement) |
| `initConverse` | `data-converse` (`.chat-bubble`,`data-side=in\|out`) | conversational discovery / Brand Concierge (Conversione) |
| `initLifecycle` | `data-lifecycle` (`.cycle-track`,`.cycle-dot`,`.cycle-node`) | the relationship as a recurring loop (Loyalty) |
| `initClienteling` | `data-clienteling` (`.scan-line`,`.reveal-attr`) | recognition: a profile populates under a scan sweep (Loyalty/Persona) |
| `initThread` | `data-thread` (`.thread-node`,`.thread-path`) | the "Generazioni" filo linking two clients (Home/Persona) |
| `initStackAssemble` | `data-stack-assemble` (`.stack-core`,`.stack-product`+`data-from-x/y`) | full Adobe stack converging onto the AEP core (Il Motore — the culmination) |

**Adding a metaphor:** write one `init*` in `animations.ts`, drive it from a
`data-*` attribute, ALWAYS handle `REDUCED_MOTION` by setting the final static
state and returning, then register it in `initAllAnimations`.

> Centering gotcha: elements whose resting position uses `transform: translate(-50%,-50%)`
> (e.g. the assemble ring) must keep that transform in the reduced-motion branch —
> GSAP parses inline `translate(%)` into xPercent/yPercent and composes `x/y` on top,
> so set inline `transform`, not Tailwind `-translate-*`, on GSAP-animated nodes.

## Keynote deck mode (golden reference: the Acquisizione page)
Some pages are presented as a **projected keynote deck**, not a scrolled page:
full-screen slides, advanced one at a time with a horizontal slide transition
(~500ms, cross-fade under reduced-motion). Use this when the page must be *run live
in a room* as well as read.

- `packages/core/src/blocks/immersive/DeckContainer.astro` — deck wrapper (`fixed inset-0`,
  no scroll). Minimal auto-hiding chrome: progress `01 / NN`, prev/next, fullscreen.
  Projection type as global classes (`.slide-title`, `.slide-lead`, `.slide-eyebrow`).
  `nextHref` → advancing past the last slide goes to the next phase.
- `packages/core/src/blocks/immersive/Slide.astro` — one slide. **Absolute safe-area
  guarantee:** content sits inside the viewport minus ~8% margins, **vertically centred**,
  height-constrained (`max-h-full` + `min-h-0`) so it **never clips** (no title glued to the
  top, no text spilling off the bottom). A `backdrop` slot carries full-bleed layers
  (atmosphere image + scrim). `bg` = `primary|secondary|inverse|brand`, `align` =
  `center|left|split`.
- `packages/core/src/blocks/immersive/deck.ts` — presenter controller: ←/→/↑/↓, Space,
  PageUp/Down, Home/End, click halves, swipe, fullscreen (`F`). Fires `prepareSlide` +
  `playSlide` (from `animations.ts`) when a slide becomes active — animations **replay** on
  revisit. Re-inits/tears down across View Transitions.

**Safe-area rule (non-negotiable):** every slide must fit WHOLE at 1920×1080 with
breathing room above and below — verify there. If content doesn't fit, **SPLIT into two
slides; do not compress.** No site nav in presentation mode — only the deck chrome.

**Persona-led narrative spine:** the deck *follows one human face* through the journey
(for Generazioni: **Giulia, 29**, the new customer). The heritage client (**Francesca, 52**)
appears as the *thread* that grows in later phases. Each slide is a beat: clear title +
1–2 sentences that read in projection — more short beats, not dense slides.

**Products in context, never a catalogue:** name Adobe products as *light attributions*
while the platform acts (e.g. "the team creates with **GenStudio** and **Firefly**"), max
2–3 per slide. The full stack reveal belongs ONLY to "Il Motore Adobe".

- `packages/core/src/blocks/InstagramPost.astro` — a credible IG post inside a phone
  (header + `· Sponsorizzato`, image via `MediaSlot`, actions, likes, `caption` prop,
  comments), sized to fit whole within the safe area. Usage:
  `<InstagramPost {...mediaProps('id')} caption="…" />`.
- `packages/core/src/blocks/CoverSlide.astro` — cinematic, quiet-luxury **slide 0**:
  camel ground, a sartorial *filo* (curved stitch path + knot) that sews itself between
  the two wordmarks (`Max Mara` primary, `Adobe` discreet); tagline hero + co-brand eyebrow.
  Driven by `[data-cover]` in `animations.ts`; reduced-motion safe; plays on activation.
  Optional atmospheric backdrop via `bgMedia`/`bgSrc` (always under a brand scrim).
- `packages/core/src/blocks/MadeWith.astro` — the «made with» credit: the Adobe products
  that created the active slide's assets. One line in the BaseLayout, `data-made-with` per slide.
- `packages/core/src/blocks/CoBrand.astro` — the «Adobe × Brand» signature (see the binding
  rule below): `chrome` on every slide, `hero` on the first and last. Per-app thin wrapper.
- `packages/core/src/blocks/immersive/LoopVideo.astro` — looping backdrop clip for the
  `backdrop` slot; its `src` must be a stitched `*.loop.mp4`.
- `packages/core/src/blocks/SlideBackdrop.astro` — atmospheric textile background for an
  otherwise-flat slide. Goes in Slide's `backdrop` slot (BEHIND content, **outside
  `.slide-inner` so the audit does not measure it**). ALWAYS under a `scrim` strong enough
  to keep text WCAG-AA (invariant h) — if text loses contrast, strengthen the scrim, never
  lighten the text. `[data-parallax]` over-scaled 1.06 so the drift never reveals an edge;
  reduced-motion = static. `<SlideBackdrop slot="backdrop" {...mediaProps('bg-linen')} scrim="…/78" />`.
- `packages/core/src/blocks/HowItWorks.astro` — optional **"Scopri come →"** disclosure that
  expands **INLINE, in place**, pushing the content below it down (GSAP height tween ~450ms,
  arrow rotates). NO overlay, NO scrim, NO `position:fixed` — content stays in normal flow,
  so the expanded state must still satisfy the deck invariants (clip, hidden-scroll, ≥16px
  rhythm, AA contrast). reduced-motion = instant toggle. On a dark slide pass on-dark colours
  to the body. The deck must read fine WITHOUT expanding it (self-sufficient for the live telling).
  Body content via the default slot.

### Co-brand signature «Adobe × Brand» (BINDING — every experience, present & future)
The co-brand is **one rule in the engine**, not a per-slide decision.
`@edf/core/blocks/CoBrand.astro` carries it; each app only has a **thin wrapper**
`src/components/CoBrand.astro` declaring the brand name and its mark.
- **The order is always Adobe × Brand**, never Brand × Adobe. There is no prop to flip it —
  the order is written into the shared component's markup, so it cannot be got wrong.
- **`variant="chrome"` on EVERY slide of EVERY chapter** — one line in `BaseLayout`, fixed
  bottom-left inside the safe area, outside the slide flow (so it never enters the slide
  count nor the audit's measurements). Hidden on phones.
- **`variant="hero"` on the FIRST and the LAST slide of the journey**: the two marks large
  and centred, **replacing the "Adobe × Brand" text eyebrow**. There the lockup is content,
  not chrome — it carries `role="img"` + `aria-label`.
- **Where a `hero` sits, the fixed signature switches itself off.** The runtime lives in
  `DeckContainer.astro`, watches `deck:change` and flags `html[data-cobrand-off]` — **no
  per-slide attribute, no per-app wiring**: every new deck inherits it.
- The client mark goes in the `brand` slot and must be the **official SVG the client
  distributes**, at `currentColor`. With no official asset, the component falls back to the
  brand name in the display font — **never** a hand-rebuilt or unofficially sourced logo
  (that is exactly the wrong-brand imagery the Quality Bar forbids).
- Ink flips with the surface via `data-on-dark`; a slide that *declares* light but renders
  dark is marked `class="edf-cobrand--on-dark"`.
- **Out of scope:** experiences with no client brand (the Factory's own Atelier deck,
  vendor-neutral research like Aperture) — there is no × to make.

### The «made with» credit — what built this slide (BINDING, every experience)
Every slide declares the **Adobe products used to create its assets** — the generated
backdrop, the clip, the retouch. Not the products the experience *pitches* to the client:
those live in the slide's content.
- `@edf/core/blocks/MadeWith.astro`, mounted **once** in the BaseLayout, sits bottom-right,
  mirroring the co-brand signature bottom-left. It is chrome: outside the slide flow, so
  outside the slide count and the audit's measurements.
- A slide declares `data-made-with="Firefly"` (+ `data-made-with-for="clip|sfondo"`). With
  no declaration the deck's `fallback` applies, so an experience whose backdrops all come
  from one tool says it in a single line. The runtime lives in `DeckContainer` (like the
  co-brand one): **every new deck inherits it with no wiring**.
- **A credit is a fact, not a decoration.** Declare only what was actually used, verifiable
  in the assets' `provenance.json`. An experience with mixed assets (UniCredit: Firefly +
  stock) sets **no fallback** and marks the individual slides. Putting "Adobe Firefly" on a
  slide carrying a stock photo is a false statement, not a graphic shortcut.
- **Corporate Adobe mark + full product name** ("Adobe Firefly"), the way Adobe writes its
  own products. Individual product icons are **never** reconstructed — that is exactly the
  wrong-brand imagery the Quality Bar forbids.
- Shape: `▲ Adobe Firefly · sfondo`. **No verb**: a credit is not a sentence, and a verb
  drags agreement problems behind it in any inflected language.

### A credit belongs where the fact is, not in the nav (BINDING)
Navigation is for going somewhere: every entry is a destination. A credit parked there is
out of place, vague ("Visual · Adobe Firefly" — visual *what*?), and disappears at the
viewports where the nav tightens — a credit that hides is not a credit. Two right places:
the **cover note** (once, with Content Credentials) and the **per-slide credit** above,
which is precise because it knows which asset it is talking about.

### Flush-left blocks share the edge (BINDING — audit check `m`)
A **centred** composition is legitimate: blocks of different widths on one axis. But two
blocks that align their **text left** and start at different x are a defect that reads
instantly and that the eye misses while scanning.
- The classic trap: the base reset caps paragraph width inside a slide
  (`[data-slide] p { max-width: … }`); you free one block with `max-width: none` to let it
  breathe and it **spreads to the whole safe area** while its siblings stay in the column.
  Happened on isybank: the sources line started 197px left of the figures. "Freeing" is not
  "removing the limit" — put back **the same** `max-width` the column uses.
- Check **`m`** of `audit:deck` measures the left edge of every top-level block with
  `text-align: left|start` (skipping out-of-flow decoration and text-less blocks) and fails
  when they don't share the x (4px tolerance). It is a **HARD** check: not a matter of
  taste, it's a crooked line.

### Looping backdrop clips — the wrap must not show (BINDING)
A generated clip (Firefly or otherwise) ends on a frame that has nothing to do with frame 0:
the native `loop` rewinds it and **the cut is visible**. That is a **content** defect, not a
playback one — fix the asset, not with JavaScript.
- Every backdrop clip goes through **`pnpm loop:seamless <clip.mp4> --poster`**: it dissolves
  the 0.75 s tail onto the head (ffmpeg xfade), writes `<clip>.loop.mp4` **and the poster as
  the first frame of the stitched clip**, and prints the before/after measurement.
- The measurement is a number, not an impression: **PSNR last→first frame** against the PSNR
  of two adjacent frames. Within 6 dB of that reference = pass. `--check` verifies an existing
  clip and exits ≠0 when the wrap jumps.
- In the page use **`@edf/core/blocks/immersive/LoopVideo.astro`** in the `backdrop` slot
  (poster + `loop` + `preload="auto"` + brand scrim). `preload="auto"` matters: the clip is
  fully buffered before the wrap, so the loop never waits on the network.
- Known, accepted residue: the native `loop` costs **one compositor tick (~17 ms, one frame)**
  at the wrap — the decoder restart, not a content jump.

### Content rules (substance)
- **Persona-led, on-brand language** — name the theme from the brand's world, not jargon
  (e.g. "Una relazione che attraversa il tempo", never "ringiovanire il target").
- **One hero product, used consistently** (e.g. the Whitney Bag for Generazioni) — don't
  drift between products across slides.
- **Sources: never cross-attribute a number.** Each statistic carries its own correct,
  readable micro-source (e.g. 75% luxury-spend → Bain/Altagamma; +306% emotional-connection
  LTV → Motista 2018 — NOT Harvard/Bain). Verify before citing.
- **Products discreet & contextual** — light attributions while the platform *acts*, max
  2–3 per slide; the full stack reveal belongs ONLY to the "engine" page.
- **Copy voice — 100% human, not AI (IT + EN).** No em‑dash used as a crutch (`X — non solo Y`),
  no staccato tricolons ("Ogni giorno. Ogni query."), no symmetrical `non solo X, ma Y`, no empty
  value‑speak ("crea valore", "un'unica visione"), no buzzword stacking or over‑parallel bullets.
  Natural, concrete sentences, varied rhythm. Bilingual: EN and IT each idiomatic (never a literal
  echo); `<T en it>` ALWAYS keeps both. Keep length ~±10% so the audit doesn't break. (CLAUDE.md → Working rules.)

## The 9 underlying blocks (library)
Hero, NarrativeSection, FrontBackStageSplit, JourneyPhase, PersonaCard,
ProductGateway, AdobeStackReveal, MetricCallout, Timeline. These remain available
for non-immersive layouts, but the immersive step model is the default format.

## Adobe Product Registry
Single source of truth in `registry/adobe-products.ts`. Products mapped by phase:
- **Core (trasversale):** AEP, RT-CDP, AI Assistant, Agent Orchestrator
- **Acquisizione:** GenStudio, Firefly, Express, CJA, Mix Modeler
- **Engagement:** AEM Sites, Target, Commerce
- **Conversione:** Journey Optimizer, Brand Concierge
- **Loyalty:** Journey Optimizer, RT-CDP, CJA
- **Operations:** Workfront, GenStudio

## Asset pipeline (programmatic imagery — reusable Factory capability)
Fill ALL images from a typed manifest with ONE command — no manual picking. Free,
IP-safe (Pexels License), reusable across clients. The **script is shared**; the
**manifest is per-client**.

- **`packages/core/src/assets/types.ts`** — `AssetSlot` type (`stock|aigen|code`,
  `aspect`, `width`, `grade`, `alt`) + geometry helpers. Shared by manifest, component, script.
- **`<client>/assets.manifest.ts`** — one entry per image slot. `stock` = photo to
  fetch; `aigen` = local FLUX prompt; `code` = visual already built in components.
- **`scripts/build-assets.ts`** (run via `tsx`, `pnpm assets:build`):
  - `stock` → Pexels search (orientation matched to aspect, highest resolution), download.
  - `aigen` → local FLUX via `mflux-generate` (skips with a warning if not installed).
  - `code` → no-op.
  - Brand color-grade with **sharp**: `editorial` (slight desat + warm balance toward
    the brand accent + soft S-contrast), `duotone` (luminance mapped between two brand
    colours), `none`. Crop to aspect, write a high-res `~2400px` `<id>.webp` to
    `src/assets/generated/`, plus `provenance.json` (source, author, license, query/prompt).
    Idempotent.
- **`<client>/assets.index.ts`** — `import.meta.glob` loader mapping `id → ImageMetadata`,
  with placeholder fallback. `mediaProps(id)` returns `{ media, src }`.
- **`MediaSlot.astro`** (engine) — optimized `<Picture>` (AVIF/WebP, responsive, lazy,
  `alt` from manifest) OR a refined palette placeholder when the asset isn't generated yet.
  Usage: `<MediaSlot {...mediaProps('id')} fill />`.

Gotchas: `slot` is a **reserved attribute** in Astro — the prop is named `media`, so
pass via `{...mediaProps('id')}` (never a literal `slot="…"`). sharp `duotone` must
use `modulate({saturation:0})` (keeps 3 bands) — `grayscale()` collapses to 1 band and
`linear()` can't expand it. The **API key is build-time only** (`.env`, gitignored, with
`.env.example`); it must never reach the static site or CI. **Commit the generated webp +
provenance.json** so the site builds without the key — generation is a deliberate local step.

## Visual self-audit (give the deck "eyes")
Don't trust the eye — **measure**. The **playwright MCP** gives interactive browser
tools (browser_resize to 1920×1080, browser_evaluate, screenshots); `scripts/deck-audit.ts`
is the deterministic gate run headless (`pnpm --filter <client> audit:deck`, dev server up).

It navigates the deck slide-by-slide at **three viewports (1920×1080, 1440×900, 1280×800)**
— a projected keynote must hold beyond exactly 1920×1080 — reduced-motion for stable layout;
a **display hero** numeral tagged `data-display` is excluded from the prose band check (a). It
measures bounding boxes, prints PASS/FAIL per slide+check, screenshots ONLY failing slides
to `audit/<deck>/<slide-id>.png`, and exits ≠0 on any fail (CI-ready). Runs at **3 viewports**
(1920×1080, 1440×900, 1280×800). **The checks (a–l, + exp):**
- **(a)** significant text (≥24px) centre in the band [30%,70%]; never anchored near the top.
- **(b)** no content text intersects the chrome controls (target `button[...]`, NOT the deck
  root which also carries `data-deck-next`).
- **(c)** no box past `--slide-safe-inset`; no `scrollWidth > clientWidth`.
- **(d)** no text over an image's `data-no-text` zone; text over an image needs a `[data-scrim]`.
- **(e)** no two non-nested text blocks overlap (text-on-text).
- **(f)** an OPEN slide-over is a top-level fixed dialog within the viewport — no scroll/clip, full-viewport scrim, width ≤ min(720px, 60vw).
- **(g)** adjacent stacked text blocks (outside cards) have ≥ 16px vertical gap.
- **(h)** every button/CTA meets WCAG AA (4.5:1; 3:1 large/icon) against its composited bg.
- **(i)** content covers ≥ 45% of usable height and its centre of mass is in the central band.
- **(j)** nothing clipped — every significant element fully inside `[0,0,W,H]`.
- **(k)** no hidden scroll — no container with `scrollHeight > clientHeight` (a keynote never scrolls).
- **(m)** alignment — top-level flush-left blocks share the same left edge (±4px). Centred compositions are exempt.
- **(l)** while a panel is open, interactive elements are EITHER fully under the scrim OR fully visible (trigger not obstructed).
- **(exp)** each `HowItWorks` is **expanded INLINE** and the slide is re-measured in the expanded
  state — it must still pass b, c, d, e, g, h, j, k. (a) band-position and (i) space-balance do NOT
  apply to a disclosure, which legitimately shifts the resting composition. A collapsed region
  (`[data-hiw-region][aria-hidden]`) is excluded from measurement; once expanded its content counts.

**Auto-correction loop:** run the audit → for each FAIL read the screenshot, fix the
**component/page source** (not inline patches), re-run → iterate until 0 FAIL.

**Hard vs soft — never shrink type to pass (BINDING).** Treat the checks in two tiers:
- **HARD (real rendering bugs → drive to 0 at all 3 viewports):** `b`, `c`, `d`, `e`, `f`, `h`, `j`, `k`, `m`.
- **SOFT (aspirational):** `a` (reading band), `i` (space usage), `g` (rhythm). Acceptable on intentionally
  airy/dense slides; it is **FORBIDDEN to make them pass by shrinking type** below the legibility minimums —
  **cut copy or split the slide** instead. A visual mock (terminal/image) beside a split slide is not counted
  as text mass → an `i`/`comX` imbalance there is a **known parser limit, not a defect**.
- **Recurring meaning‑preserving HARD fixes:** keep `absolute` decorations inside the box
  (`-right-2`→`right-1` + `overflow-hidden`); add `min-w-0` on flex/grid children; reduce gap/padding/density
  to fit at 1440/1280; wrap oversized display numerals (`break-words`, `leading-tight`).
- **Parallelising hard-fixes on ONE app:** don't run concurrent build/preview (they race on `dist/`). Use
  subagents in **isolated git worktrees**, then one final build + audit on the merged tree.

Conventions & hard-won lessons:
- **Layering is the #1 trap.** Keep the base reset in `@layer base`. An unlayered
  `* { margin:0 }` or `a { color }` BEATS Tailwind utilities (`mb-*`, `text-*`) and silently
  kills vertical rhythm and button colours — and the audit's (g)/(h) catch it.
- **Centre on the viewport centre**, not the padded-box centre, with a symmetric chrome
  reserve — otherwise (a) band and (i) ≥45% fight each other. `Slide` uses inline-style
  padding/`max-height` (Tailwind doesn't reliably emit `max(var(...))`).
- **Safe-area tokens** in `global.css` (fixed px): `--slide-safe-inset`, `--deck-chrome-safe`.
- **"Scopri come" = inline disclosure**, NOT an overlay/side-panel/dialog (those were fragile —
  dense text couldn't fit, scroll/clipping). `HowItWorks` expands **in place** in normal flow
  (GSAP height tween), so the expanded content MUST fit the slide without clip/scroll: keep copy
  short and compact (smaller detail font on dense split slides), keep ≥16px rhythm, pass `tone="onDark"`
  for AA on dark slides. The audit's **(exp)** check expands it and re-measures.
- **`data-no-text="top,left,width,height"`** (% subject zone on `MediaSlot`/`InstagramPost`);
  **`data-scrim`** on the overlay behind text-over-image.

## Stack & conventions (must-know)
- **Astro 6** static site + **View Transitions** (multipage immersion). Re-init animations on `astro:after-swap`.
- **Tailwind v4** via `@tailwindcss/vite` (NOT `@astrojs/tailwind`). In a monorepo, Tailwind does NOT scan pnpm-symlinked packages — add `@source` directives in `global.css` pointing at `packages/core/src/**` and the app's own `src/**`.
- **GSAP + ScrollTrigger** for animation, lazy-imported; `scroller` must be the `StepContainer` element (not window).
- **GitHub:** keep local and remote in sync — `git push` after EVERY commit.
- **Trailing slashes:** `astro.config.mjs` uses `trailingSlash: 'always'` + a base path. Build internal links with the `href(base, path)` helper (`packages/core/src/utils/url.ts`) — never hand-concatenate `${base}${path}` (404s + double slashes).
- **No hardcoded color/spacing** — use CSS custom properties from tokens. For translucency in raw CSS (e.g. a gradient), use `color-mix(in srgb, var(--token) N%, transparent)`, not Tailwind's `var()/opacity` slash syntax.
- TS object keys with hyphens (`grigio-100`) MUST be quoted; esbuild tolerates unquoted, `tsc` does not.

## New Client Checklist
1. Create `*.tokens.json` with brand colors/fonts (primitive tokens).
2. Define pages as immersive sequences; reuse `StepContainer`/`Step`/`animations.ts`.
3. Add new metaphor primitives if the brand needs them (one per phase value).
4. Write minimal original copy per step (target language).
5. Source/create brand-appropriate imagery (or placeholders).
6. Update `astro.config.mjs` (`site`, `base`, `trailingSlash`) and `global.css` `@source`.
7. Verify: `pnpm dev`, `pnpm build`, `pnpm typecheck`; check 360px + reduced-motion; then deploy.
8. **Copy pass — human, not AI** (IT + EN): scrub the AI tells (see Content rules / CLAUDE.md → Copy voice); keep names/numbers/sources; `<T>` keeps both languages.
9. **Audit gate:** `audit:deck` HARD checks (`b/c/d/e/f/h/j/k`) = **0** at 1920/1440/1280; resolve SOFT (`a/i/g`) only by cutting copy or splitting slides, **never by shrinking type**. Then read a 1920 screenshot of every slide.
10. **Co-brand:** add the app's thin `CoBrand.astro` wrapper (brand name + official mark, or
    the wordmark fallback), one `<CoBrand />` in `BaseLayout`, and `<CoBrand variant="hero" />`
    on the first and last slide in place of the text eyebrow. Order is Adobe × Brand, always.
11. **Backdrop clips:** every clip through `pnpm loop:seamless … --poster`; render with `LoopVideo`.
    Mount `<MadeWith>` in the BaseLayout and declare `data-made-with` where an Adobe tool
    actually made the asset — check `provenance.json`, never assume.
12. **Register everywhere:** `admin.astro` (PAGE_REGISTRY + SOLUTIONS), `deploy.yml` (merge + verify), `factory-hub` card, showcase `src/data/experiences.ts` (+ `public/shots/<slug>.webp`), console registry / Supabase seed. A product/naming change propagates to **every** experience that cites it — verify each (build + audit).
13. **Handover:** run `/handover` to update the docs in detail, size-split, and verify a new session can read them.
