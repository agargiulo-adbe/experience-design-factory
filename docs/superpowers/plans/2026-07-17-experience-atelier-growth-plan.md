# Experience Atelier — Growth-Plan Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `apps/atelier` — the trilingual (EN default / IT / FR) immersive deck that presents the Factory's 3-milestone enterprise growth plan under the new "Experience Atelier" name, per the approved spec `docs/superpowers/specs/2026-07-17-experience-atelier-growth-plan-design.md`.

**Architecture:** New Astro static app mirroring `apps/agos-trait-dunion` (the freshest reference), on the shared `@edf/core` deck engine. One backward-compatible core i18n extension (optional `fr` on `T`, prop-driven langs on `LangToggle`). Eight section pages chained with `nextHref`/`prevHref`; solution-gating repurposed as audience gating for the "asks" section; research-sourced facts feed sections 4–6.

**Tech Stack:** Astro 6 + Tailwind v4 tokens, `@edf/core` deck engine, Pexels asset pipeline, root `scripts/deck-audit.ts`, Supabase registry migration, GitHub Pages deploy.

**Read before starting (binding):** CLAUDE.md sections *Type & legibility contract*, *Copy voice — 100% human*, *Audit discipline*; spec §10 (confidentiality: public repo — no internal org context, no internal price lists, no absolute € figures on the asks page); memory `audit-deck-runs-against-preview` (audit against static preview, never dev) and `factory-showcase-site` (Astro scoped styles do NOT reach `T`'s inner spans — style `T` via global.css or `:global()`).

**Copy rule for every page task:** the plan gives EN anchor copy (structure + key lines). At execution, author final EN, then IT and FR as idiomatic rewrites (never literal echoes), each within ±10% of EN length, de-AI rubric applied (no em-dash crutches, no tricolons, no "not just X but Y"). FR runs long: prefer tighter FR phrasing over layout changes.

---

### Task 1: Research fact sheet (main session, deep-research harness)

**Files:**
- Create: `docs/superpowers/research/2026-07-17-atelier-comparables.md`

This task runs **inline in the main session** (the deep-research skill orchestrates a Workflow; do not delegate it to a task subagent).

- [ ] **Step 1: Run deep-research** with this question: "Sourced, dated, defensible facts for an executive deck: (a) the demo-experience-platform category — Reprise, Demostack, Walnut, Consensus (Consensus/SPI acquisition included): funding, adoption, published conversion/deal-cycle metrics; (b) vendor pre-sales serious games — SAP BTP Diamond Game, SAP S/4HANA Movement virtual board game: format, audience, published outcomes; (c) AI enablement of commercial workforce at scale — enterprise cases with published numbers (e.g. Moderna, Klarna, Accenture, Microsoft sales copilots): adoption %, hours saved, revenue-per-rep; (d) BDR/SDR + AI productivity and deal-size benchmarks from named analyst or vendor studies. Every claim needs source name, URL, and date; flag anything that is vendor-marketing-grade vs independently verified."
- [ ] **Step 2: Distill into the fact sheet** — one markdown file, four sections (a–d), each fact as `claim — source, date, URL, confidence (verified/vendor-claimed)`. Discard anything undated or unsourceable. Public sources only (public repo).
- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/research/2026-07-17-atelier-comparables.md
git commit -m "docs(research): sourced comparables fact sheet for atelier deck" && git push
```

---

### Task 2: Core i18n — optional FR (backward-compatible)

**Files:**
- Modify: `packages/core/src/blocks/i18n/T.astro`
- Modify: `packages/core/src/blocks/i18n/LangToggle.astro`

- [ ] **Step 1: Extend `T.astro`** — optional `fr`; the FR span renders only when provided:

```astro
---
/**
 * T — multilingual text. Renders ALL provided languages; CSS on <html data-lang>
 * shows the active one (instant toggle, no reload). `en`/`it`/`fr` accept inline HTML.
 * Usage:  <T en="Winning together" it="Vincere insieme" as="h2" class="slide-title" />
 *         <T en="…" it="…" fr="…" />   (fr optional — trilingual experiences only)
 */
interface Props {
  en: string;
  it: string;
  fr?: string;
  as?: keyof HTMLElementTagNameMap;
  class?: string;
  style?: string;
}
const { en, it, fr, as = 'span', class: className, style } = Astro.props;
const Tag = as as any;
---
<Tag class={className} style={style} data-i18n><span data-lang-en set:html={en} /><span data-lang-it set:html={it} />{fr !== undefined && <span data-lang-fr set:html={fr} />}</Tag>
```

- [ ] **Step 2: Extend `LangToggle.astro`** — prop-driven language list, default `['en','it']` (existing apps unchanged). Replace the static button block and highlight CSS:

```astro
---
/**
 * LangToggle — language switch. Sets <html data-lang> + persists to localStorage.
 * The anti-flash init lives in the layout <head>; this only wires the buttons.
 * `langs` defaults to ['en','it']; pass ['en','it','fr'] for trilingual experiences.
 */
interface Props { langs?: string[] }
const { langs = ['en', 'it'] } = Astro.props;
---
<div class="lang-toggle" role="group" aria-label="Language">
  {langs.map((l, i) => (
    <>
      {i > 0 && <span class="lang-sep" aria-hidden="true">/</span>}
      <button type="button" data-lang-btn={l} class="lang-btn">{l.toUpperCase()}</button>
    </>
  ))}
</div>
```

Keep the existing `<style>` and `<script is:inline>` blocks, adding one highlight rule:

```css
  html[data-lang="fr"] [data-lang-btn="fr"] { color: var(--accent-primary); }
```

- [ ] **Step 3: Verify propagation** — full build of every existing app must pass unchanged:

Run: `pnpm build`
Expected: all 8 workspace builds succeed (core change is additive).

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/blocks/i18n/
git commit -m "feat(core): optional FR in T + prop-driven LangToggle (backward-compatible)" && git push
```

---

### Task 3: Scaffold `apps/atelier`

**Files:**
- Create: `apps/atelier/package.json`, `apps/atelier/astro.config.mjs`, `apps/atelier/assets.manifest.ts`, `apps/atelier/assets.index.ts`, `apps/atelier/src/styles/global.css`, `apps/atelier/src/layouts/BaseLayout.astro`, `apps/atelier/src/components/AtelierNavigation.astro`, `apps/atelier/src/pages/index.astro` (placeholder cover, replaced in Task 6)
- Reference throughout: mirror `apps/agos-trait-dunion` file-for-file, then adapt.

- [ ] **Step 1: Copy the agos scaffold** (config + layout + nav + assets plumbing; NOT its pages/styles content):

```bash
cd "/Users/agargiulo/Documents/progetti/Experience Design Factory"
mkdir -p apps/atelier/src/{pages,layouts,components,styles,assets/generated}
cp apps/agos-trait-dunion/package.json apps/atelier/
cp apps/agos-trait-dunion/astro.config.mjs apps/atelier/
cp apps/agos-trait-dunion/assets.index.ts apps/atelier/
cp apps/agos-trait-dunion/src/layouts/BaseLayout.astro apps/atelier/src/layouts/
cp apps/agos-trait-dunion/src/components/AgosNavigation.astro apps/atelier/src/components/AtelierNavigation.astro
```

- [ ] **Step 2: Adapt `package.json`** — `"name": "atelier"`; keep scripts verbatim (`audit:deck`, `assets:build` point at root scripts).

- [ ] **Step 3: Adapt `astro.config.mjs`** — `base: '/experience-design-factory/atelier'`; everything else unchanged.

- [ ] **Step 4: Write `src/styles/global.css`** — same skeleton as agos (Tailwind v4 `@source` lines, `@layer base` reset, safe-area tokens, `.cs-*` classes, i18n visibility rules) with the Atelier theme. Token block:

```css
@theme {
  /* Atelier — dark editorial, warm carbon + champagne (spec §7) */
  --color-carbone: #12100C;        /* primary surface, warm near-black */
  --color-fuliggine: #1B1813;      /* elevated dark */
  --color-cenere: #26211A;         /* card dark */
  --color-avorio: #F4EFE4;         /* primary ink on dark / inverse surface */
  --color-platino: #E7DFCF;
  --color-champagne: #C9A96A;      /* accent primary */
  --color-bronzo: #9A7B45;         /* accent secondary, deeper */
  --color-sabbia-200: #D8D0BE;     /* readable secondary ink (body) */
  --color-sabbia-300: #B9AF99;     /* readable tertiary ink */
  --color-sabbia-400: #8E8570;     /* kickers/labels only, never body */

  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', 'Helvetica Neue', Arial, sans-serif;
}
```

Semantic mapping (dark-dominant like agos/ferrari): `--surface-primary: var(--color-carbone)`, `--surface-secondary: var(--color-fuliggine)`, `--surface-inverse: var(--color-avorio)`, `--surface-brand: var(--color-cenere)`; `--accent-primary: var(--color-champagne)`, `--accent-secondary: var(--color-bronzo)`; ink tiers avorio → sabbia-200 → sabbia-300. Buttons/chrome/tinted cards in **explicit `rgba()`** (audit contrast parser). Trilingual visibility rules:

```css
html[data-lang="en"] [data-lang-it], html[data-lang="en"] [data-lang-fr] { display: none !important; }
html[data-lang="it"] [data-lang-en], html[data-lang="it"] [data-lang-fr] { display: none !important; }
html[data-lang="fr"] [data-lang-en], html[data-lang="fr"] [data-lang-it] { display: none !important; }
```

(No `data-lang` attribute / `data-lang="en"` must behave as EN: author the html tag as `<html lang="en" data-lang="en">` in BaseLayout.)

- [ ] **Step 5: Adapt `BaseLayout.astro`** — swap fonts to Fraunces + Inter (same loading pattern agos uses for Montserrat+Inter); anti-flash init accepts three languages; default `data-lang="en"`:

```html
<script is:inline>
(function () {
  var l = localStorage.getItem('edf:lang');
  if (l === 'en' || l === 'it' || l === 'fr') document.documentElement.setAttribute('data-lang', l);
})();
</script>
```

Mount `<LangToggle langs={['en','it','fr']} />` where agos mounts its toggle (nav).

- [ ] **Step 6: Adapt `AtelierNavigation.astro`** — rename internals, section links per the 8 pages (Task 6–13 slugs), labels via `T` (en/it/fr).

- [ ] **Step 7: Write `assets.manifest.ts`** — abstract/atmospheric slots only (no people-as-protagonist, no brand imagery):

```typescript
import type { AssetSlot } from '@edf/core/assets/types';

export const assets: AssetSlot[] = [
  { id: 'bg-atelier',   type: 'stock', query: 'artisan workshop dark warm light craftsmanship hands detail atmosphere', aspect: '16:9', width: 2400, grade: 'duotone', alt: '' },
  { id: 'bg-loom',      type: 'stock', query: 'abstract golden threads weaving dark background macro texture',          aspect: '16:9', width: 2400, grade: 'duotone', alt: '' },
  { id: 'bg-blueprint', type: 'stock', query: 'architectural drawing dark table warm lamp light minimal',               aspect: '16:9', width: 2400, grade: 'duotone', alt: '' },
  { id: 'bg-horizon',   type: 'stock', query: 'dark landscape horizon first light golden minimal atmosphere',           aspect: '16:9', width: 2400, grade: 'duotone', alt: '' },
  { id: 'bg-stage',     type: 'stock', query: 'empty stage warm spotlight dark auditorium atmosphere',                  aspect: '16:9', width: 2400, grade: 'duotone', alt: '' },
];
```

- [ ] **Step 8: Placeholder `src/pages/index.astro`** — minimal DeckContainer + one cover Slide with `<T>` trilingual title, so the app builds end-to-end before real content.

- [ ] **Step 9: Install + build**

Run: `pnpm install && pnpm --filter atelier build`
Expected: build succeeds; `apps/atelier/dist/` produced (asset slots resolve to palette placeholders until Task 5).

- [ ] **Step 10: Commit**

```bash
git add apps/atelier pnpm-lock.yaml
git commit -m "feat(atelier): scaffold trilingual atelier app (tokens, layout, nav, assets plumbing)" && git push
```

---

### Task 4: Wire the monorepo (dev script, audit routes, deploy)

**Files:**
- Modify: `package.json` (root) — add `"dev:atelier": "pnpm --filter atelier dev"` and append `&& pnpm --filter atelier audit:deck` to `audit:deck:all`.
- Modify: `scripts/deck-audit.ts` — add the route set (final slugs from Tasks 6–13):

```typescript
atelier: [
  { name: 'home',           route: '/experience-design-factory/atelier/' },
  { name: 'method',         route: '/experience-design-factory/atelier/method/' },
  { name: 'capability',     route: '/experience-design-factory/atelier/capability/' },
  { name: 'multiplication', route: '/experience-design-factory/atelier/multiplication/' },
  { name: 'frontiers',      route: '/experience-design-factory/atelier/frontiers/' },
  { name: 'plan',           route: '/experience-design-factory/atelier/plan/' },
  { name: 'asks',           route: '/experience-design-factory/atelier/asks/' },
  { name: 'closing',        route: '/experience-design-factory/atelier/closing/' },
],
```

- Modify: `.github/workflows/deploy.yml` — in the merge step add:

```yaml
    mkdir -p pages/atelier
    cp -r apps/atelier/dist/. pages/atelier/
```

- [ ] **Step 1: Apply the three edits above.**
- [ ] **Step 2: Verify** — `pnpm build` passes; `git diff` shows only the three files.
- [ ] **Step 3: Commit**

```bash
git add package.json scripts/deck-audit.ts .github/workflows/deploy.yml
git commit -m "chore(atelier): wire dev script, deck-audit routes, Pages deploy merge" && git push
```

---

### Task 5: Generate assets (Pexels pipeline)

- [ ] **Step 1: Provide the key** — copy an existing app's key: `cp apps/agos-trait-dunion/.env apps/atelier/.env` (contains `PEXELS_API_KEY`; `.env` is gitignored). If absent there, check the other apps; if none has it, STOP and ask the owner for the key.
- [ ] **Step 2: Run** `pnpm --filter atelier assets:build`
Expected: `apps/atelier/src/assets/generated/*.webp` + `provenance.json` for all 5 slots.
- [ ] **Step 3: Eyeball each image** (Read the webp files) — reject anything with visible brands/faces contradicting the abstract brief; tune `query` and re-run with `--manifest` for rejected slots only.
- [ ] **Step 4: Commit** — `git add apps/atelier/src/assets/generated apps/atelier/assets.manifest.ts && git commit -m "feat(atelier): graded atmospheric asset set + provenance" && git push`

---

### Tasks 6–13: the eight section pages

Common contract for EVERY page task below: page skeleton identical to an agos page (BaseLayout → fixed nav → `DeckContainer` with both `nextHref` and `prevHref` → `Slide` list). All copy through `<T en it fr>`. Type & legibility minimums binding (body ≥ 0.95rem, readable sabbia-200 ink, content fills the central 55–70%). Every fact from Task 1's sheet cited inline (source, year) in a `≥0.75rem` footnote line. Per-page verification loop (repeat in each task):

```bash
pnpm --filter atelier build && pnpm --filter atelier preview --port 4330 &
DECK_URL=http://localhost:4330 pnpm --filter atelier audit:deck   # 0 hard failures on this page's routes
# then: screenshot every slide of the page at 1920 (Playwright MCP) and READ each one
```

Commit per page: `git add apps/atelier && git commit -m "feat(atelier): <page> section" && git push`

### Task 6: `index.astro` — Overture + live experience wall

Slides (ids for PAGE_REGISTRY):
- `slide-cover` — backdrop `bg-atelier` (opacity ~0.18, carbon scrim). Eyebrow: `Experience Atelier`. Display title (EN anchor): "Six experiences. Five brands. One person, paired with AI." Sub: "Enterprise-grade, live in production, built in weeks. This deck is one of them."
- `slide-wall` — **interactive moment #1**: grid of 6 cards (Generazioni, Engagement Unlimited, Pole Position, Connessioni Intelligenti, Trait d'Union, + Console/Hub as sixth "the platform" card), each: accent-colored kicker (client), name, one-line tag, live link (opens in new tab). Anchor line: "Every tile is a real deployment. Click any of them."
- `slide-thesis` — the deck's thesis in one sentence (EN anchor): "What follows is a plan to turn this way of working into a capability many people at Adobe can use." `nextHref` → `/method`.

### Task 7: `method.astro` — How it was built + compliance evidence

Slides:
- `slide-cover` — "Built in the open" / backdrop `bg-loom`.
- `slide-genesis` — origin: one Adobian, evenings and demos, an engine + skins architecture; timeline strip of the five experiences with real dates (from git history).
- `slide-method` — the pairing method: brief → skill-guided intake → engine → tokens/copy/assets → quality gates. Human decides, AI accelerates.
- `slide-compliance` — **evidence table** (2-col stacked rows, per legibility contract): public Adobe capabilities only · zero reserved client IP · licensed stock with tracked `provenance.json` · zero secrets in repo · WCAG 2.2 AA · public auditable repo · built with an Adobe-approved enterprise AI assistant. Each row: claim + where the proof lives.

### Task 8: `capability.astro` — anatomy + guided solution toggle

Slides:
- `slide-cover` — "One engine. Any story."
- `slide-anatomy` — engine/skins/console diagram (CSS, no image): core deck engine, per-client tokens+content, Admin Console, i18n, quality gates.
- `slide-toggle-demo` — **interactive moment #2**: an embedded, self-explanatory mini-demo of solution gating: a captioned toggle that live-hides/shows a chip row and nav entries within the slide (self-contained JS in the page, NOT the real gating runtime), annotated "This is how a seller tailors an experience to one meeting — no rebuild."
- `slide-console` — Admin Console: sections on/off, media per slide, custom slides authored live; shareable links.

### Task 9: `multiplication.astro` — from project to workforce capability

Slides:
- `slide-cover` — "What if fifty people could do this?" backdrop `bg-horizon`.
- `slide-market` — the demo-experience-platform category exists and is funded (Reprise, Demostack, Walnut, Consensus — figures + sources from Task 1). Positioning line: those are products for demos; this is a capability for experience-led selling.
- `slide-precedent` — SAP pre-sales serious games + one AI-workforce-enablement case with defensible numbers (Task 1, confidence=verified only).
- `slide-model` — the multiplication model: enable BDR/AE/SC to create autonomously via guided intake (`skills/experience-brief`) + template gallery; partners co-build joint designs.

### Task 10: `frontiers.astro` — product interaction + Boardroom Quest

Slides:
- `slide-cover` — "New frontiers".
- `slide-live-products` — real Adobe product interaction inside experiences: personalized demos, Firefly image/video generation embedded, GenStudio-grade mockups already in the engine today (GenstudioMockup/RtcdpMockup exist — say so).
- `slide-quest` — **interactive moment #3 / spotlight**: Boardroom Quest — facilitated serious game for C-level workshops; silo-breaking mechanics, Adobe products discovered as puzzle-unlocks, telemetry-driven debrief. Pixel-art styled teaser frame built in CSS (no fake screenshots), labelled "in design". SAP precedent cited.
- `slide-quest-plan` — its 3 phases (facilitated beta → multiplayer → content platform) mapped onto M1–M3; brand/legal review named as an explicit gate before first official workshop.

### Task 11: `plan.astro` — the three milestones

Slides:
- `slide-cover` — "Nine months, three milestones" backdrop `bg-blueprint`.
- `slide-m1` — **Foundations (→ mid-Sep 2026)**: pilot 5–10 Adobe Italia BDR/AE; Adobe Context Layer v1 (SC-validated product catalog/positioning/limits/roadmap); CI hardening; Quest walking skeleton; KPI baseline. Measurable targets block (spec §3).
- `slide-m2` — **Scale & open (→ mid-Jan 2027)**: 2–3 partners co-building; 25–40 active users; embedded Firefly/GenStudio demos; Quest beta + first workshop; Hackathon #1. Targets block.
- `slide-m3` — **Enterprise & lighthouse (→ mid-Apr 2027)**: SSO, audit logs, security review; EMEA; Quest multiplayer + 2nd pack; **Adobe Summit 2027 (Mar 22–25)** lighthouse. Targets block.
- `slide-kpi` — the 4-family KPI framework (GTM velocity / workforce enablement / ecosystem / platform health) as stacked full-width rows; note "every milestone declares targets on all four — the plan is falsifiable."

### Task 12: `asks.astro` — what it takes (gated section)

Gating: `pageSolutions`/`data-nav-solution` = `asks` so the whole section can be toggled off for wider audiences.
Slides:
- `slide-cover` — "What it takes".
- `slide-resources` — stacked rows, **relative bars, zero absolute € figures** (spec §10): tiered enterprise-AI licenses (top tier core builders / mid tier power creators / standard pilot users; usage-based billing, caps are ceilings) · infra & tooling (deliberately small line) · sponsored time (lead ~50%, SC hours, one design review) · brand/legal review path for Quest.
- `slide-moments` — the two funded moments: Hackathon day (M2) and Adobe Summit 2027 demo pod + speaking submission (M3).
- `slide-sponsor` — the closing ask: a named executive sponsor and a 30-minute monthly steering. Anchor: "The most important ask costs the least."

### Task 13: `closing.astro` — thesis + next step

Slides:
- `slide-thesis` — recap in one breath: proof → capability → plan → measurable.
- `slide-next` — the concrete next step: green-light the M1 pilot (names, dates); backdrop `bg-stage`. Final slide; `nextHref` loops to `/`.

---

### Task 14: `admin.astro` wrapper

**Files:** Create `apps/atelier/src/pages/admin.astro` (mirror agos's).

- [ ] **Step 1:** PAGE_REGISTRY = every page slug + slide ids exactly as built in Tasks 6–13; SOLUTIONS = `[{ id: 'asks', label: 'What it takes (sponsorship section)' }, { id: 'quest', label: 'Boardroom Quest spotlight' }]`; mark `slide-quest`/`slide-quest-plan` with `data-solution="quest"` and the asks page with `asks`. `projectSlug: 'atelier'`, `projectName: 'Experience Atelier'`, `deckHref` to `/`.
- [ ] **Step 2:** Build + open `/admin/` in preview: three tabs render; toggling `asks` hides the nav entry and the deck skips the section (arrow nav included, both directions).
- [ ] **Step 3:** Commit — `git commit -m "feat(atelier): admin wrapper (PAGE_REGISTRY, audience gating)"` + push.

### Task 15: Registration (hub, showcase, Supabase)

**Files:**
- Modify: `apps/factory-hub/src/pages/index.astro` — append entry `{ name: 'Experience Atelier', client: 'The Factory, next', accent: '#C9A96A', tagline: 'The growth plan: from one maker with AI to a workforce capability.', href: `${b}atelier/` }`.
- Modify: `apps/factory-showcase/src/data/experiences.ts` — new entry, same shape as agos's (slug `atelier`, accent `#C9A96A`, sections 8, tag/desc en+it, shot `shots/atelier.webp` — capture a 1920 cover screenshot into the showcase shots dir like the others).
- Create: `supabase/migrations/0007_seed_atelier.sql`:

```sql
insert into public.experiences (slug, name, client, description, base_url, status)
values (
  'atelier',
  'Experience Atelier',
  'Adobe — internal',
  'The Factory growth plan: three milestones to an enterprise-grade, workforce-wide capability. Trilingual EN/IT/FR.',
  '/experience-design-factory/atelier/',
  'draft'
)
on conflict (slug) do update
   set base_url = excluded.base_url, status = excluded.status, updated_at = now();
```

- [ ] **Step 1:** Apply the three changes; build hub + showcase.
- [ ] **Step 2:** Apply the migration remotely: `supabase db query --linked` (per `supabase/README.md`); verify the console dashboard lists Atelier as draft.
- [ ] **Step 3:** Commit — `git commit -m "feat(atelier): register in hub, showcase, console (draft)"` + push.

### Task 16: Full verification pass

- [ ] **Step 1:** `pnpm build` (all apps) → green. `pnpm --filter atelier typecheck` → green. `pnpm lint` → green.
- [ ] **Step 2:** Audit against static preview, all three viewports: build → `preview --port 4330` → `DECK_URL=http://localhost:4330 pnpm --filter atelier audit:deck`. Target **0 HARD failures on all 8 routes**; soft findings only on justified airy/dense slides (never fixed by shrinking type).
- [ ] **Step 3:** Screenshot EVERY slide at 1920 in EN, and the longest-copy slides also in FR and IT (FR is the overflow risk); READ each screenshot: generous type, readable ink, balanced fill, no truncation in any language.
- [ ] **Step 4:** Cross-section nav: arrow through the whole deck forward and backward, with and without the `asks` solution enabled; fullscreen persists across sections.
- [ ] **Step 5:** Fix loop until clean; commit fixes; push. Then flip the registry to live: `update public.experiences set status='live' where slug='atelier';` via `supabase db query --linked`.
- [ ] **Step 6:** Verify the deployed page once Actions completes: `https://agargiulo-adbe.github.io/experience-design-factory/atelier/` (all 3 languages toggle, links on the wall resolve).

### Task 17: Documentation + memory

- [ ] **Step 1:** Run `/handover` (skill) — records: atelier app, trilingual core extension, rebrand decision (presentation layer only), research fact-sheet location, gating-as-audience-control pattern, registry status.
- [ ] **Step 2:** Write memory `experience-atelier-deck.md` (project type: app slug, trilingual gotchas, confidentiality rules for this deck) + index line in `MEMORY.md`.
- [ ] **Step 3:** Final `git push`; confirm GitHub Actions deploy green.

---

## Self-review notes

- Spec coverage: §1 app/URL/trilingual → T2–T3; §2 eight sections + 3 interactive moments → T6–T13; §3 milestones → T11; §4 KPI → T11 `slide-kpi`; §5 asks → T12; §6 rebrand → naming used throughout, technical names untouched; §7 aesthetic → T3 tokens; §8 forwardable interactivity → T6/T8/T10 (all self-explanatory, static fallback); §9 research → T1; §10 confidentiality → T12 (no figures) + T1 (public sources); §11 technical scope → T3–T5, T14–T15; §12 out of scope respected (no platform-feature building).
- The deck presents the plan; it does not implement M1–M3 features.
- FR overflow risk explicitly checked in T16 step 3.
