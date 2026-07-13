# Experience Design Factory — Remediation & Evolution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close P0 security gaps, fix broken navigation/copy/sources on Ferrari Racing, and add ESLint tooling — mandatory items through Part 3, then best-effort evolutions.

**Architecture:** Monorepo (pnpm, Astro 6, TypeScript strict). Fixes are spread across `supabase/migrations/`, `packages/core/`, `apps/ferrari-racing/`, and `apps/console/`. Each task is a single logical unit. No new abstractions beyond what the spec mandates. A new `apps/ferrari-racing/src/data/sources.ts` module centralises all verified claims and source citations.

**Tech Stack:** Astro 6, TypeScript strict, Tailwind v4, Supabase, pnpm workspace, ESLint 9 flat config, playwright (audit).

---

## State on entry (read before starting)

The following P0 work is **already done** in the working tree but not yet committed:
- `supabase/migrations/0003_hardening.sql` (new file, untracked) — P0-1 privilege escalation trigger + P0-2 `media_configs` table definition.
- `apps/ferrari-racing/src/layouts/BaseLayout.astro` (staged) — already uses DOM APIs for media building (`buildMediaEl`/`isSafeUrl`), no innerHTML from remote config.
- `apps/unicredit-engagement/src/layouts/BaseLayout.astro` (unstaged) — same DOM API pattern.
- `packages/core/src/blocks/admin/AdminConsole.astro` (unstaged) — already gates "Genera link" behind a session `accessToken`, uses that token as Bearer (not anon key).

Task 1 commits this existing work; Tasks 2–12 are new changes.

---

## Task 1: Commit existing P0-1 / P0-2 security work

**Files:**
- Commit: `supabase/migrations/0003_hardening.sql`
- Commit: `apps/ferrari-racing/src/layouts/BaseLayout.astro`
- Commit: `apps/unicredit-engagement/src/layouts/BaseLayout.astro`
- Commit: `packages/core/src/blocks/admin/AdminConsole.astro`

- [ ] **Step 1: Verify the four files match their expected state**

  Open each file and confirm:
  - `0003_hardening.sql` creates `guard_profile_privileges` trigger, `guard_experience_columns` trigger, and `public.media_configs` table with the two RLS policies.
  - Both BaseLayouts define `buildMediaEl()` using `document.createElement` and `img.alt = slotCfg.caption` (property, not attribute interpolation), with `isSafeUrl()` returning false for non-https.
  - `AdminConsole.astro` around line 1052 reads `accessToken` from `localStorage['edf:sb-session']` and aborts with an error message if empty, then uses `'Authorization': 'Bearer ' + accessToken` on the POST.

- [ ] **Step 2: Stage everything and commit**

  ```bash
  cd /Users/agargiulo/Documents/progetti/Experience\ Design\ Factory
  git add supabase/migrations/0003_hardening.sql \
          apps/ferrari-racing/src/layouts/BaseLayout.astro \
          apps/unicredit-engagement/src/layouts/BaseLayout.astro \
          packages/core/src/blocks/admin/AdminConsole.astro
  git commit -m "$(cat <<'EOF'
  fix(security): P0-1/P0-2 — close privilege escalation + XSS chain

  - 0003_hardening.sql: BEFORE UPDATE triggers block non-super-admins from
    changing is_super_admin/status on profiles or slug/base_url on experiences;
    recreates policies with WITH CHECK; creates media_configs with RLS.
  - BaseLayouts (Ferrari + UniCredit): buildMediaEl uses DOM APIs only —
    no innerHTML from remote config; isSafeUrl allowlists https: protocol.
  - AdminConsole: Genera-link gates on console session accessToken; uses it
    as Bearer instead of anon key so media_configs insert is authenticated.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 2: P0-3 — Add ESLint 9 flat config so `pnpm lint` works

**Files:**
- Create: `eslint.config.js` (repo root)
- Modify: `package.json` (root) — change `lint` script, add devDeps
- Modify: `pnpm-lock.yaml` (auto-updated by pnpm)

- [ ] **Step 1: Install the required ESLint plugins**

  ```bash
  cd /Users/agargiulo/Documents/progetti/Experience\ Design\ Factory
  pnpm add -D -w typescript-eslint eslint-plugin-astro @typescript-eslint/parser
  ```

  Expected: pnpm installs without error and updates `pnpm-lock.yaml`.

- [ ] **Step 2: Write `eslint.config.js`**

  Create `eslint.config.js` at repo root:

  ```js
  // @ts-check
  import tseslint from 'typescript-eslint';
  import pluginAstro from 'eslint-plugin-astro';

  export default tseslint.config(
    // Ignore build output and generated assets
    { ignores: ['**/dist/**', '**/.astro/**', '**/src/assets/generated/**', '**/node_modules/**'] },

    // TypeScript files
    ...tseslint.configs.recommended,

    // Astro files
    ...pluginAstro.configs.recommended,

    // Relax rules that are noisy across this codebase
    {
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      },
    },
  );
  ```

- [ ] **Step 3: Update the `lint` script in `package.json`**

  Change:
  ```json
  "lint": "eslint . --ext .ts,.tsx,.astro"
  ```
  to:
  ```json
  "lint": "eslint ."
  ```

- [ ] **Step 4: Run `pnpm lint` and fix anything it reports**

  ```bash
  pnpm lint 2>&1 | head -60
  ```

  Expected categories of errors:
  - Unused vars in console pages → prefix with `_` or remove.
  - `any` types in `apps/console/src/` → add type or `// eslint-disable-line` with justification.
  - Astro parser warnings → configure `parserOptions` in `eslint.config.js` if needed.

  Fix each reported issue. If a file has many `any` in inline scripts (which ESLint cannot type-check), add `/* eslint-disable @typescript-eslint/no-explicit-any */` at the top of that file.

- [ ] **Step 5: Verify lint passes**

  ```bash
  pnpm lint
  ```

  Expected: exit 0, no errors (warnings OK).

- [ ] **Step 6: Commit**

  ```bash
  git add eslint.config.js package.json pnpm-lock.yaml
  git add -u   # pick up any fixed source files
  git commit -m "$(cat <<'EOF'
  fix(tooling): P0-3 — add ESLint 9 flat config so pnpm lint works

  Adds eslint.config.js (typescript-eslint + eslint-plugin-astro, flat config),
  updates the lint script (removes removed --ext flag), fixes all reported issues.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 3: P1-1 — Fix analisi.astro CTA — should go to /proof, not /loop

**Files:**
- Modify: `apps/ferrari-racing/src/pages/analisi.astro`

The slide `slide-insights` (last slide in analisi) has a CTA that navigates to `/loop`, skipping the entire Proof chapter. The deck's `nextHref` already correctly points to `/proof`. The CTA must match.

- [ ] **Step 1: Open and verify the current state**

  In `analisi.astro` around line 129, confirm the CTA reads:
  ```astro
  <a href={href(base, '/loop')}
  ```
  and the labels say:
  ```
  <span data-lang-en>To the Loop</span><span data-lang-it>Verso il Loop</span>
  ```

- [ ] **Step 2: Change the CTA href and labels**

  Replace the entire `<a>` element in `slide-insights` (around line 129–133) with:
  ```astro
  <a href={href(base, '/proof')}
     class="inline-flex items-center gap-3 px-9 py-4 text-[clamp(1rem,1.2vw,1.2rem)] font-semibold tracking-wide uppercase bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] transition-colors rounded-sm" data-reveal data-reveal-delay="0.4">
    <span data-lang-en>Next: The Proof</span><span data-lang-it>Avanti: La Prova</span>
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </a>
  ```

- [ ] **Step 3: Verify the full chain is correct**

  Confirm that `analisi.astro` also has `<DeckContainer nextHref={href(base, '/proof')}>` (deck arrow nav) and that `proof.astro` has `<DeckContainer nextHref={href(base, '/loop')}>`. Both should be correct.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/ferrari-racing/src/pages/analisi.astro
  git commit -m "$(cat <<'EOF'
  fix(ferrari): P1-1 — analisi CTA now goes to /proof, not /loop

  The slide-insights CTA skipped the entire Proof chapter. Changed href and
  labels to 'Next: The Proof / Avanti: La Prova'.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 4: Create `sources.ts` — single source of truth for Ferrari verified claims

**Files:**
- Create: `apps/ferrari-racing/src/data/sources.ts`

This module is consumed by slide footers in Tasks 5–9 and serves as the authoritative record of what is verified vs. illustrative.

- [ ] **Step 1: Create the file**

  ```typescript
  // apps/ferrari-racing/src/data/sources.ts
  // Single source of truth for verified claim citations on Ferrari Racing slides.
  // Every numeric claim must either appear here or carry the 'illustrativo' label.

  export interface Source {
    id: string;
    label: string;
    url: string;
  }

  export const SOURCES: Record<string, Source> = {
    ferrari_fy2025: {
      id: 'ferrari_fy2025',
      label: 'Ferrari FY2025 Full-Year Results (Feb 2026)',
      url: 'https://www.ferrari.com/en-EN/corporate/articles/2025-full-year-and-fourth-quarter-financial-results',
    },
    ferrari_cmd_2025: {
      id: 'ferrari_cmd_2025',
      label: 'Ferrari Capital Markets Day (Oct 2025) — 2030 Strategic Plan',
      url: 'https://www.ferrari.com/en-EN/corporate/articles/ferrari-capital-markets-day-targeting-new-heights',
    },
    ibm_ferrari_2026: {
      id: 'ibm_ferrari_2026',
      label: 'IBM × Scuderia Ferrari HP (May 2026)',
      url: 'https://newsroom.ibm.com/2025-05-01-ibm-and-scuderia-ferrari-hp-debut-reimagined-mobile-app-to-supercharge-global-formula-1-fan-experience',
    },
    ibm_case_study: {
      id: 'ibm_case_study',
      label: 'IBM Case Study — Scuderia Ferrari HP',
      url: 'https://www.ibm.com/case-studies/scuderia-ferrari',
    },
    adobe_rtcdp_blog: {
      id: 'adobe_rtcdp_blog',
      label: 'Adobe RT-CDP Collaboration — Improving Co-Marketing Efforts',
      url: 'https://business.adobe.com/blog/real-time-cdp-collaboration-improving-co-marketing-efforts',
    },
    adobe_summit_alterra: {
      id: 'adobe_summit_alterra',
      label: 'Adobe Summit 2025 S507 — Alterra Mountain Co.',
      url: 'https://business.adobe.com/summit/2025/sessions/data-collaboration-with-adobe-how-alterra-achieved-s507.html',
    },
    genstudio_product: {
      id: 'genstudio_product',
      label: 'GenStudio for Performance Marketing',
      url: 'https://business.adobe.com/products/genstudio-for-performance-marketing.html',
    },
    brand_concierge: {
      id: 'brand_concierge',
      label: 'Adobe Brand Concierge',
      url: 'https://business.adobe.com/products/brand-concierge.html',
    },
  };

  // Short citation strings for use in slide footers.
  export function cite(...ids: string[]): string {
    return ids.map((id) => SOURCES[id]?.label ?? id).join(' · ');
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add apps/ferrari-racing/src/data/sources.ts
  git commit -m "$(cat <<'EOF'
  feat(ferrari): add sources.ts — verified citations for all slide claims

  Single source of truth: every numeric claim maps to a SOURCES entry or
  carries an explicit 'illustrativo' label. cite() produces footer strings.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 5: P1-2 — Replace Brand Concierge with GenStudio brand checks across Ferrari

**Files:**
- Modify: `apps/ferrari-racing/src/pages/create.astro`
- Modify: `apps/ferrari-racing/src/pages/loop.astro`
- Modify: `apps/ferrari-racing/src/pages/admin.astro`
- Modify: `apps/console/src/data/projects-registry.ts`

Brand Concierge is a customer-facing conversational product on AEP Agent Orchestrator, not a brand-compliance checker. Brand guardrail/pre-publication checks belong to GenStudio for Performance Marketing.

### 5a: Fix create.astro — slide-guardrails

- [ ] **Step 1: Verify current state in `create.astro`**

  Confirm `guardrailPoints` array (around line 21) reads:
  - `en: 'Brand Concierge enforces Ferrari's guidelines…'`
  - Point 3: `'~70% auto pre-approved'` mentioning Brand Concierge.

- [ ] **Step 2: Replace `guardrailPoints` and slide copy**

  Replace the `guardrailPoints` const and the `slide-guardrails` `<T>` paragraph in `create.astro`:

  ```typescript
  // replace the guardrailPoints array (was Brand Concierge copy)
  const guardrailPoints = [
    { en: 'Pre-publication check', it: 'Controllo pre-pubblicazione', bodyEn: 'GenStudio verifies every asset against Ferrari guidelines — Rosso Corsa, logo usage, tone — before it can go live.', bodyIt: 'GenStudio verifica ogni asset rispetto alle linee guida Ferrari — Rosso Corsa, uso del logo, tono — prima di poter andare online.' },
    { en: 'Post-publication monitoring', it: 'Monitoraggio post-pubblicazione', bodyEn: 'Live campaigns are watched continuously — brand drift is flagged, not discovered later.', bodyIt: 'Le campagne live sono monitorate di continuo — le deviazioni di brand si segnalano, non si scoprono dopo.' },
    { en: 'Only compliant work goes live', it: 'Solo il lavoro conforme va online', bodyEn: 'This is the trust that lets Ferrari open its brand to partners — enforced by GenStudio, not manual review.', bodyIt: 'È la fiducia che permette a Ferrari di aprire il proprio brand ai partner — applicata da GenStudio, non da revisione manuale.' },
  ];
  ```

  Replace the main paragraph in `slide-guardrails` (the `<T>` element that starts `"Brand Concierge enforces Ferrari's guidelines"`):
  ```astro
  <T
    as="p" class="text-[clamp(1.05rem,1.5vw,1.4rem)] text-white/85 max-w-3xl mb-10"
    en="GenStudio for Performance Marketing enforces Ferrari's brand guidelines — Rosso Corsa, logo usage, tone — with automated pre-publication checks and post-publication monitoring. Only compliant work goes live. This is the trust that lets Ferrari open its brand to partners."
    it="GenStudio for Performance Marketing applica le linee guida Ferrari — Rosso Corsa, uso del logo, tono — con controlli automatici pre-pubblicazione e monitoraggio post-pubblicazione. Solo il lavoro conforme va online. È la fiducia che permette a Ferrari di aprire il proprio brand ai partner."
  />
  ```

  Also add `data-solution="brand"` to the `slide-guardrails` Slide element:
  ```astro
  <Slide id="slide-guardrails" bg="brand" align="center" data-solution="brand">
  ```

- [ ] **Step 3: Verify no "Brand Concierge" remains in create.astro**

  ```bash
  grep -n "Brand Concierge\|brand-concierge\|brandconcierge" apps/ferrari-racing/src/pages/create.astro
  ```

  Expected: no output.

### 5b: Fix loop.astro — engineStack entry

- [ ] **Step 4: Verify current state in `loop.astro`**

  Confirm `engineStack` (around line 22) contains:
  ```typescript
  { name: 'Brand Concierge', en: 'Guardrails that keep the brand intact', ... }
  ```

- [ ] **Step 5: Replace the Brand Concierge entry**

  Replace the Brand Concierge row in `engineStack` with:
  ```typescript
  { name: 'GenStudio Brand Checks', en: 'Brand guardrails — automated pre-publication compliance', it: 'Guardrail di brand — conformità pre-pubblicazione automatizzata' },
  ```

  The "One engine — not six disconnected tools" count stays the same (6 items).

- [ ] **Step 6: Verify no "Brand Concierge" remains in loop.astro**

  ```bash
  grep -n "Brand Concierge\|brand-concierge" apps/ferrari-racing/src/pages/loop.astro
  ```

  Expected: no output.

### 5c: Fix admin.astro — SOLUTIONS 'brand' entry

- [ ] **Step 7: Update admin.astro SOLUTIONS**

  In `admin.astro`, locate the `brand` solution entry (around line 68):
  ```typescript
  { id: 'brand', name: 'Brand Guardrails (Brand Concierge)', shortName: 'Brand', pillar: 'content', description: 'Guardrail e linee guida Ferrari con verifiche pre e post pubblicazione.', appearsIn: ['Create'] },
  ```

  Replace with:
  ```typescript
  { id: 'brand', name: 'Brand Guardrails (GenStudio)', shortName: 'Brand', pillar: 'content', description: 'Controlli di brand GenStudio: verifica pre-pubblicazione + monitoraggio post — ogni asset conforme alle linee guida Ferrari.', appearsIn: ['Create'] },
  ```

### 5d: Fix console/projects-registry.ts — Ferrari 'brand' solution

- [ ] **Step 8: Update projects-registry.ts**

  Locate the Ferrari `brand` solution entry (around line 186):
  ```typescript
  { id: 'brand', name: 'Brand Guardrails (Brand Concierge)', shortName: 'Brand', pillar: 'content', description: 'Guardrail Ferrari con verifiche pre e post.', pagesGated: ['Create'] },
  ```

  Replace with:
  ```typescript
  { id: 'brand', name: 'Brand Guardrails (GenStudio)', shortName: 'Brand', pillar: 'content', description: 'Controlli brand GenStudio: verifica pre-pubblicazione e monitoraggio post — garantisce conformità alle linee guida Ferrari.', pagesGated: ['Create'] },
  ```

- [ ] **Step 9: Global Brand Concierge grep**

  ```bash
  grep -rn "Brand Concierge\|brand-concierge\|brand_concierge" \
    apps/ferrari-racing/src/ apps/console/src/ packages/core/src/ \
    --include="*.ts" --include="*.astro" --include="*.tsx"
  ```

  Expected: zero results (the `sources.ts` we created has a `brand_concierge` source key that points to the product page — that is correct factual attribution, not a wrong claim). If any "Brand Concierge" appears in claim context (not as a cited URL), fix it.

- [ ] **Step 10: Commit**

  ```bash
  git add apps/ferrari-racing/src/pages/create.astro \
          apps/ferrari-racing/src/pages/loop.astro \
          apps/ferrari-racing/src/pages/admin.astro \
          apps/console/src/data/projects-registry.ts
  git commit -m "$(cat <<'EOF'
  fix(ferrari): P1-2 — reattribute brand guardrails to GenStudio brand checks

  Brand Concierge is a customer-facing conversational product, not a
  brand-compliance checker. All references to it in guardrail/compliance
  contexts (create, loop, admin, console registry) now correctly attribute
  GenStudio for Performance Marketing's built-in brand checks.
  Also wires data-solution="brand" to slide-guardrails in create.astro
  so the console toggle actually gates that slide.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 6: P1-3 — Fix €9.0B framing (group revenue, not sponsorship target)

**Files:**
- Modify: `apps/ferrari-racing/src/pages/loop.astro`
- Modify: `apps/ferrari-racing/src/pages/index.astro`

€9.0B is Ferrari's total group net revenues 2030 target (CMD Oct 2025), not a sponsorship-line target.

### 6a: Fix loop.astro

- [ ] **Step 1: Verify current state in loop.astro**

  Confirm `prizeStats` (around line 31):
  ```typescript
  { stat: '€9.0B', en: '2030 revenue ambition', it: 'obiettivo ricavi 2030' },
  ```

  And slide-roi paragraph (around line 123):
  ```
  "growing the €800M+ (+22%) sponsorship line toward the €9.0B 2030 ambition."
  ```

  And source footer (around line 146):
  ```
  "Source: Ferrari FY2025 · Capital Markets Day 2030 · Adobe Data Collaboration for Sports"
  ```

- [ ] **Step 2: Fix prizeStats label**

  Change the €9.0B entry in `prizeStats`:
  ```typescript
  { stat: '€9.0B', en: '2030 group net revenues target', it: 'obiettivo ricavi netti di gruppo 2030' },
  ```

- [ ] **Step 3: Fix slide-roi paragraph**

  Change the `<T>` component paragraph text:

  EN: `"With proof of value, Ferrari retains and expands sponsors, commands a price premium, and attracts net-new partners — growing the €800M+ (+22%) sponsorship line and contributing to the group's €9.0B 2030 net-revenue ambition."`

  IT: `"Con la prova del valore, Ferrari trattiene ed espande gli sponsor, impone un premium di prezzo e attrae partner del tutto nuovi — facendo crescere la linea sponsorship da €800M+ (+22%) e contribuendo all'obiettivo €9.0B di ricavi netti di gruppo 2030."`

- [ ] **Step 4: Fix source footer in loop.astro**

  Change (both `data-lang-en` and `data-lang-it` spans):

  EN: `Source: Ferrari FY2025 Full-Year Results (Feb 2026) · Capital Markets Day (Oct 2025) — 2030 Strategic Plan`

  IT: `Fonte: risultati Ferrari FY2025 (feb 2026) · Capital Markets Day (ott 2025) — Piano Strategico 2030`

### 6b: Fix index.astro

- [ ] **Step 5: Verify current state in index.astro**

  Confirm `slide-shift` stat card (around line 107):
  ```astro
  <p ...>€9.0B</p>
  <T ... en="2030 revenue ambition" it="obiettivo ricavi 2030" />
  ```

  And source footer (around line 111):
  ```
  "Source: Ferrari FY2025 results · Capital Markets Day 2030"
  ```

- [ ] **Step 6: Fix the stat label in slide-shift**

  Change the `<T>` for the €9.0B card:
  ```astro
  <T as="p" class="text-sm text-white/80" en="2030 group net revenues target" it="obiettivo ricavi netti di gruppo 2030" />
  ```

- [ ] **Step 7: Fix the source footer in slide-shift**

  EN: `Source: Ferrari FY2025 Full-Year Results (Feb 2026) · Capital Markets Day (Oct 2025) — 2030 Strategic Plan`
  IT: `Fonte: risultati Ferrari FY2025 (feb 2026) · Capital Markets Day (ott 2025) — Piano Strategico 2030`

- [ ] **Step 8: Commit**

  ```bash
  git add apps/ferrari-racing/src/pages/loop.astro \
          apps/ferrari-racing/src/pages/index.astro
  git commit -m "$(cat <<'EOF'
  fix(ferrari): P1-3 — reframe €9.0B as group net revenues target, not sponsorship

  €9.0B is Ferrari's total group net revenues 2030 target (CMD Oct 2025).
  Previous copy implied a >10× sponsorship growth. Updated stat labels,
  the slide-roi sentence, and source footers across index and loop.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 7: P1-4 — Fix proof.astro stale/imprecise source footer + Alterra

**Files:**
- Modify: `apps/ferrari-racing/src/pages/proof.astro`

Issues: "closed betas" stale (GA since Feb 2025), "Ferrari/IBM 2025" → 2026, NBCU 227M unverified, Alterra 3× ROAS unverified, "19 ski resorts" needs the "Ikon Pass company" fallback.

- [ ] **Step 1: Verify current state in proof.astro**

  Confirm `cases` array (around line 14):
  - NBCUniversal: stats `['10×', 'match rate'], ['2×', 'conversions'], ['90%', 'lift']`; copy includes "Reaches 227M US adults monthly"
  - Alterra: stats `['3×', 'ROAS'], ['+30%', 'conversions'], ['1', 'clean room']`; copy includes "19 ski resorts"
  - Ferrari: stats `['+56%', 'race-day users'], ['+35%', 'downloads'], ['~400M', 'Tifosi']`

  Confirm footer (around line 93):
  ```
  "Sources: Adobe RT-CDP Collaboration closed betas (NBCUniversal, Alterra) · Ferrari/IBM 2025 · names illustrative"
  ```

- [ ] **Step 2: Fix the NBCUniversal `cases` entry**

  The "227M US adults monthly" is unverified. Soften to a tier description. Also add "beta" qualifier to the results.

  Replace the NBCUniversal case object `en`/`it` copy:
  - EN: `'One of the largest premium audiences in the US. Real-Time CDP Collaboration matched audiences with an advertiser, activated, and closed the loop with privacy-safe measurement (beta results).'`
  - IT: `'Una delle audience premium più grandi degli Stati Uniti. Con Real-Time CDP Collaboration ha allineato le audience con un advertiser, attivato e chiuso il loop con misurazione privacy-safe (risultati beta).'`

- [ ] **Step 3: Fix the Alterra cases entry**

  "3× ROAS" is unverified. Remove it. Use the verified "+30% conversions" and "Ikon Pass company" instead of "19 ski resorts".

  Replace the Alterra stats array:
  ```typescript
  stats: [['+30%', 'conversions'], ['1', 'clean room']],
  ```

  Replace the Alterra copy:
  - EN: `'The Ikon Pass company. Fragmented data and CTV challenges solved by activating first-party data privacy-first with Real-Time CDP Collaboration. (Adobe Summit 2025)'`
  - IT: `'La società Ikon Pass. Dati frammentati e sfide CTV risolti attivando i dati first-party in modo privacy-first con Real-Time CDP Collaboration. (Adobe Summit 2025)'`

- [ ] **Step 4: Fix the Ferrari (IBM) case entry**

  The stats cover results since the 2025 relaunch, published May 2026. The label "(2025)" should say "since 2025 relaunch":

  Replace Ferrari copy:
  - EN: `'The 2025 app relaunch — powered by first-party fan signals — turned engagement into measurable growth with the Tifosi (results published May 2026).'`
  - IT: `'Il rilancio dell’app 2025 — alimentato dai segnali fan first-party — ha trasformato l’engagement in crescita misurabile con i Tifosi (risultati pubblicati maggio 2026).'`

  Replace the Ferrari stats label for `+56%`:
  ```typescript
  stats: [['+56%', 'race-day users (since relaunch)'], ['+35%', 'downloads'], ['~400M', 'Tifosi']],
  ```

- [ ] **Step 5: Fix the source footer**

  Replace the footer paragraph content:

  EN: `Sources: Adobe RT-CDP Collaboration (NBCUniversal beta results) · Adobe Summit 2025 S507 (Alterra) · IBM × Scuderia Ferrari HP, 2026 · names illustrative`
  IT: `Fonti: Adobe RT-CDP Collaboration (risultati beta NBCUniversal) · Adobe Summit 2025 S507 (Alterra) · IBM × Scuderia Ferrari HP, 2026 · nomi illustrativi`

- [ ] **Step 6: Commit**

  ```bash
  git add apps/ferrari-racing/src/pages/proof.astro
  git commit -m "$(cat <<'EOF'
  fix(ferrari): P1-4 — accurate sources on proof.astro case studies

  - 'closed betas' removed (RT-CDP Collab is GA since Feb 2025); results
    labelled as 'beta results' where applicable (NBCUniversal)
  - Alterra: removed unverified '3× ROAS'; updated to Ikon Pass company,
    '+30% conversions' (Adobe Summit 2025 S507 confirmed)
  - Ferrari/IBM: updated from '2025' to 'since 2025 relaunch'; source
    now 'IBM × Scuderia Ferrari HP, 2026' (IBM newsroom, May 2026)
  - NBCUniversal: softened unverified '227M US adults monthly' figure

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 8: P1-5 — Fix index.astro fabricated source + unverified stats

**Files:**
- Modify: `apps/ferrari-racing/src/pages/index.astro`

The "Adobe / Forrester, Data Collaboration for Sports" composite source does not exist. The 70%/88% stats need sourcing or an illustrative label.

- [ ] **Step 1: Verify current state in index.astro**

  Confirm `slide-arena` footer (around line 79):
  ```
  "Source: Adobe / Forrester, Data Collaboration for Sports · Ferrari FY2025"
  ```

  Confirm the three `arenaStats` (around line 14):
  - `{ stat: '70%', en: 'of the web is unreachable via third-party cookies', ... }`
  - `{ stat: '88%', en: 'of sports organizations now collect first-party fan data', ... }`
  - `{ stat: '~400M', en: 'Tifosi worldwide — the most-followed team in Formula 1', ... }`

- [ ] **Step 2: Mark 70% and 88% as illustrative**

  These stats have no citable official source. Label them illustrative in the stat cards by appending a note to each:

  For `arenaStats`, update the two unverified entries:
  ```typescript
  { stat: '70%', en: 'of the web unreachable via third-party cookies (illustrative)', it: 'del web irraggiungibile via cookie di terze parti (dato illustrativo)' },
  { stat: '88%', en: 'of sports organizations collect first-party fan data (illustrative)', it: 'delle organizzazioni sportive raccoglie già dati fan first-party (dato illustrativo)' },
  { stat: '~400M', en: 'Tifosi worldwide — the most-followed team in Formula 1', it: 'Tifosi nel mondo — la squadra più seguita della Formula 1' },
  ```

- [ ] **Step 3: Fix the source footer**

  Remove the fabricated composite. The only verified source on this slide is Ferrari FY2025 (for ~400M, IBM) and the IBM case study. Update the footer:

  EN: `Source: Ferrari FY2025 Full-Year Results (Feb 2026) · IBM × Scuderia Ferrari HP, 2026`
  IT: `Fonte: risultati Ferrari FY2025 (feb 2026) · IBM × Scuderia Ferrari HP, 2026`

- [ ] **Step 4: Commit**

  ```bash
  git add apps/ferrari-racing/src/pages/index.astro
  git commit -m "$(cat <<'EOF'
  fix(ferrari): P1-5 — remove fabricated Forrester source; label unsourced stats

  'Adobe / Forrester, Data Collaboration for Sports' does not exist.
  The 70%/88% industry stats have no official source — now labelled
  illustrative. Source footer updated to verified references only.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 9: P1-6 + Concept disclaimer — Language default + index disclaimer

**Files:**
- Modify: `apps/ferrari-racing/src/layouts/BaseLayout.astro`
- Modify: `apps/ferrari-racing/src/pages/index.astro`
- Modify: `CLAUDE.md`

Ferrari defaults to EN (the deck is presented at international events). This is intentional and different from Max Mara/UniCredit (IT default). Need to document this decision and add a concept disclaimer on the index cover.

### 9a: Document the EN-default decision in CLAUDE.md

- [ ] **Step 1: Find the Bilingual section in CLAUDE.md**

  In `CLAUDE.md`, locate the `## Bilingual (i18n)` section (after "`LangToggle` sets + persists...").

  After "Ferrari defaults EN with EN/IT toggle", add a clarifying sentence:

  > `Ferrari intentionally defaults to EN (international event context); Max Mara and UniCredit default to IT. The `lang`/`data-lang` attributes in Ferrari's BaseLayout are `en` by design — do not change without updating this note.`

- [ ] **Step 2: Run `pnpm typecheck` to verify no breakage**

  ```bash
  pnpm typecheck
  ```

  Expected: exit 0.

### 9b: Add concept disclaimer on index.astro cover slide

- [ ] **Step 3: Add the disclaimer to slide-cover in index.astro**

  In `apps/ferrari-racing/src/pages/index.astro`, inside `slide-cover` after the existing `<div class="flex items-center ...">` badge row (around line 52), add:

  ```astro
  <p class="mt-7 text-center text-[0.58rem] tracking-widest uppercase text-[var(--color-grigio-500)] max-w-2xl mx-auto">
    <span data-lang-en>Concept demo — illustrative scenario not commissioned by Ferrari · Public data cited at sources</span>
    <span data-lang-it>Demo concettuale — scenario illustrativo non commissionato da Ferrari · Dati pubblici citati alle fonti</span>
  </p>
  ```

  Verify it stays within the safe area (it is tiny text below the badge chips, well within the bottom of the slide).

- [ ] **Step 4: Commit**

  ```bash
  git add apps/ferrari-racing/src/layouts/BaseLayout.astro \
          apps/ferrari-racing/src/pages/index.astro \
          CLAUDE.md
  git commit -m "$(cat <<'EOF'
  fix(ferrari): P1-6 + disclaimer — document EN default; add concept disclaimer

  Ferrari deck defaults to EN by design (international event context),
  unlike IT-defaulting Max Mara and UniCredit. Documented in CLAUDE.md.
  Added discreet concept disclaimer to the index cover slide.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 10: P2-2 — Update CLAUDE.md docs to match current reality

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Find and fix the stale `apps/console` description**

  Locate the line in CLAUDE.md that still describes `apps/console` as "local Node backend + SPA editor [future phase]" (if present) and replace with the accurate description (shipped static Astro + Supabase auth, multi-user, real auth).

  The existing CLAUDE.md already has an accurate Super Admin Console section — verify there is no contradicting stale text in any Architecture section.

- [ ] **Step 2: Verify the Architecture/Apps section includes all four apps**

  In `CLAUDE.md`, the `## Apps & structure` section should list:
  - `apps/generazioni-maxmara`
  - `apps/unicredit-engagement`
  - `apps/ferrari-racing`
  - `apps/console`

  If any are missing, add them with a one-line description.

- [ ] **Step 3: Update audit:deck description**

  Find any mention of "audit only runs at 1920×1080" (may be in `docs/AUDIT.md` if it exists, or in CLAUDE.md). Update to reflect 3 viewports: `[[1920, 1080], [1440, 900], [1280, 800]]`.

  ```bash
  grep -rn "1920.*1080\|only.*1920\|single.*viewport" \
    /Users/agargiulo/Documents/progetti/Experience\ Design\ Factory/docs/ \
    /Users/agargiulo/Documents/progetti/Experience\ Design\ Factory/CLAUDE.md
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add CLAUDE.md docs/
  git commit -m "$(cat <<'EOF'
  docs: P2-2 — update CLAUDE.md to match current repo state

  - Console described accurately (shipped Astro + Supabase, not future phase)
  - All four apps listed in structure
  - audit:deck described as 3-viewport (not 1920×1080 only)

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 11: P2-3 — Add dev convenience scripts + Ferrari audit:deck

**Files:**
- Modify: `package.json` (root)
- Modify: `apps/ferrari-racing/package.json`
- Modify: `apps/unicredit-engagement/package.json`
- Modify: `apps/console/package.json`

- [ ] **Step 1: Add per-app dev scripts to root package.json**

  In the root `package.json` `scripts` block, add after the existing `dev` script:
  ```json
  "dev:ferrari": "pnpm --filter ferrari-racing dev",
  "dev:unicredit": "pnpm --filter unicredit-engagement dev",
  "dev:console": "pnpm --filter console dev",
  "audit:deck:all": "pnpm --filter generazioni-maxmara audit:deck && pnpm --filter ferrari-racing audit:deck"
  ```

- [ ] **Step 2: Add `audit:deck` to ferrari-racing/package.json**

  In `apps/ferrari-racing/package.json`, add to `scripts`:
  ```json
  "audit:deck": "tsx ../../scripts/deck-audit.ts"
  ```

  This mirrors the Max Mara pattern exactly. The ROUTES in `deck-audit.ts` need to be parametrized (EVO-1 task), but the script invocation itself is correct now.

- [ ] **Step 3: Verify the console app package.json name**

  ```bash
  cat apps/console/package.json | grep '"name"'
  ```

  Use the actual `name` value in the filter if it differs from `console`.

- [ ] **Step 4: Commit**

  ```bash
  git add package.json \
          apps/ferrari-racing/package.json
  git commit -m "$(cat <<'EOF'
  chore: P2-3 — add dev:ferrari/unicredit/console scripts + ferrari audit:deck

  Root package.json now has per-app dev shortcuts and audit:deck:all.
  ferrari-racing package.json has audit:deck script (wired, ROUTES TBD in EVO-1).

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Task 12: Final verification gate

**No file changes.** This is a mandatory quality check before declaring done.

- [ ] **Step 1: Run `pnpm typecheck`**

  ```bash
  cd /Users/agargiulo/Documents/progetti/Experience\ Design\ Factory
  pnpm typecheck 2>&1 | tail -20
  ```

  Expected: exit 0, no errors.

- [ ] **Step 2: Run `pnpm lint`**

  ```bash
  pnpm lint 2>&1 | tail -20
  ```

  Expected: exit 0 (warnings acceptable).

- [ ] **Step 3: Run `pnpm build`**

  ```bash
  pnpm build 2>&1 | tail -30
  ```

  Expected: exit 0, all four apps build successfully.

- [ ] **Step 4: Grep for banned strings across Ferrari pages**

  ```bash
  grep -rn "Brand Concierge" apps/ferrari-racing/src/ apps/console/src/ \
    --include="*.ts" --include="*.astro"
  ```
  Expected: zero results (or only in `sources.ts` as a factual URL reference, not a claim).

  ```bash
  grep -rn "closed betas\|Capital Markets Day 2030\|Forrester.*Data Collaboration for Sports\|Adobe.*Forrester" \
    apps/ferrari-racing/src/ --include="*.ts" --include="*.astro"
  ```
  Expected: zero results.

  ```bash
  grep -rn "Ferrari/IBM 2025\|href.*\/loop.*analisi\|To the Loop.*slide-insights" \
    apps/ferrari-racing/src/ --include="*.ts" --include="*.astro"
  ```
  Expected: zero results.

- [ ] **Step 5: Push final state**

  ```bash
  git push
  ```

---

## Evolution Tasks (best-effort — start here if time permits after Task 12)

### EVO-1 / FEVO-1: Extend deck-audit.ts to Ferrari + UniCredit

**Files:**
- Modify: `scripts/deck-audit.ts`
- Modify: `apps/unicredit-engagement/package.json`

The ROUTES const in `deck-audit.ts` is currently hard-coded for Max Mara. Change it to accept the target app via `APP` env var (or a CLI arg), and define route maps for all three experiences.

- [ ] **Step 1: Read `scripts/deck-audit.ts` fully**

  The file defines `ROUTES` as a static array and `findBaseUrl()` auto-discovers the port.

- [ ] **Step 2: Parametrize ROUTES**

  At the top of `deck-audit.ts`, replace the static `ROUTES` with a map:

  ```typescript
  const ROUTE_MAPS: Record<string, Array<{ name: string; route: string }>> = {
    'generazioni-maxmara': [
      { name: 'home', route: '/experience-design-factory/' },
      { name: 'acquisizione', route: '/experience-design-factory/acquisizione/' },
      { name: 'engagement', route: '/experience-design-factory/engagement/' },
      { name: 'conversione', route: '/experience-design-factory/conversione/' },
      { name: 'loyalty', route: '/experience-design-factory/loyalty/' },
      { name: 'persona', route: '/experience-design-factory/persona/' },
      { name: 'motore-adobe', route: '/experience-design-factory/motore-adobe/' },
      { name: 'chiusura', route: '/experience-design-factory/chiusura/' },
    ],
    'ferrari-racing': [
      { name: 'arena', route: '/experience-design-factory/ferrari-racing/' },
      { name: 'protagonisti', route: '/experience-design-factory/ferrari-racing/protagonisti/' },
      { name: 'define', route: '/experience-design-factory/ferrari-racing/define/' },
      { name: 'create', route: '/experience-design-factory/ferrari-racing/create/' },
      { name: 'activate', route: '/experience-design-factory/ferrari-racing/activate/' },
      { name: 'analisi', route: '/experience-design-factory/ferrari-racing/analisi/' },
      { name: 'proof', route: '/experience-design-factory/ferrari-racing/proof/' },
      { name: 'loop', route: '/experience-design-factory/ferrari-racing/loop/' },
    ],
    'unicredit-engagement': [
      { name: 'scenario', route: '/experience-design-factory/unicredit-engagement/' },
      { name: 'visibilita', route: '/experience-design-factory/unicredit-engagement/visibilita/' },
      // add remaining unicredit pages
    ],
  };

  const APP = process.env.AUDIT_APP ?? 'generazioni-maxmara';
  const ROUTES = ROUTE_MAPS[APP] ?? ROUTE_MAPS['generazioni-maxmara'];
  ```

- [ ] **Step 3: Update `findBaseUrl()` to use the app's first route**

  Ensure `findBaseUrl()` uses `ROUTES[0].route` which it already does — no change needed if it does.

- [ ] **Step 4: Add `audit:deck` to unicredit-engagement/package.json**

  ```json
  "audit:deck": "tsx ../../scripts/deck-audit.ts"
  ```

  Usage: `AUDIT_APP=ferrari-racing pnpm --filter ferrari-racing audit:deck`

- [ ] **Step 5: Update root package.json `audit:deck:all`**

  ```json
  "audit:deck:all": "AUDIT_APP=generazioni-maxmara pnpm --filter generazioni-maxmara audit:deck && AUDIT_APP=ferrari-racing pnpm --filter ferrari-racing audit:deck"
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add scripts/deck-audit.ts apps/ferrari-racing/package.json apps/unicredit-engagement/package.json package.json
  git commit -m "$(cat <<'EOF'
  feat(audit): EVO-1 — parametrize deck-audit.ts for Ferrari + UniCredit routes

  AUDIT_APP env var selects which app's routes to audit. Ferrari and UniCredit
  route maps added. audit:deck scripts added to both app package.json files.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

### EVO-2: CI quality gate — typecheck + lint + build on PRs

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

  ```yaml
  name: CI

  on:
    pull_request:
      branches: [main]
    push:
      branches: [main]

  jobs:
    quality:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
          with:
            version: 11
        - uses: actions/setup-node@v4
          with:
            node-version: 22
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm typecheck
        - run: pnpm lint
        - run: pnpm build
          env:
            PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
            PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add .github/workflows/ci.yml
  git commit -m "$(cat <<'EOF'
  feat(ci): EVO-2 — add CI workflow gating typecheck + lint + build on PRs

  Prevents broken builds from reaching the deploy job. Runs on PRs and
  pushes to main with the same env vars as the deploy workflow.

  Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
  EOF
  )"
  git push
  ```

---

## Acceptance checklist (verify before declaring complete)

- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0 (no errors)
- [ ] `pnpm build` exits 0 (all four apps)
- [ ] `grep -r "Brand Concierge" apps/ferrari-racing/src apps/console/src --include="*.ts" --include="*.astro"` → 0 results in claim context
- [ ] `grep -r "closed betas\|Capital Markets Day 2030\|Forrester.*Sports" apps/ferrari-racing/src --include="*.ts" --include="*.astro"` → 0 results
- [ ] `grep -r "href.*\/loop" apps/ferrari-racing/src/pages/analisi.astro` → 0 results (CTA now points to /proof)
- [ ] 0003_hardening.sql committed; privilege escalation trigger present
- [ ] Concept disclaimer visible on Ferrari index cover slide
- [ ] €9.0B labelled "2030 group net revenues target" in both index and loop
