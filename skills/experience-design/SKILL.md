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
