# Ferrari — Licensing & Scoping Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive, customer-facing `/scoping` page to the Ferrari experience that models license **volumes and cost** for RTCDP Collaboration (Collaboration Credits) and CJA (Rows of Data) under editable assumptions, with user-entered unit prices, and lets logged-in EDF users save/share persistent scenarios (private/link/team).

**Architecture:** The pure cost-model + scenario-serialization live in `@edf/core` (reusable, unit-tested with Vitest — the repo has no test runner today, so Task 1 adds one). The interactive calculator is a core block `ScopingCalculator.astro`; Ferrari provides the page skin, seed scenarios, nav entry, solution gating, and Admin baseline tab. Persistence reuses the existing `media_configs` pattern: authenticated writes with the token in `localStorage['edf:sb-session']`, anon reads for shared links, plus a new `scenarios` table with private/link/team RLS.

**Tech Stack:** Astro 6 (static islands, `is:inline` client scripts), TypeScript strict, Tailwind v4 + CSS custom properties (Ferrari tokens), Supabase (Postgres + RLS, REST via `fetch`), Vitest (new, for `packages/core`), `<T>` i18n.

**Spec:** `docs/superpowers/specs/2026-07-13-ferrari-licensing-scoping-calculator-design.md`

---

## File Structure

**Create (packages/core):**
- `packages/core/vitest.config.ts` — Vitest config (node env).
- `packages/core/src/blocks/scoping/cost-model.ts` — types + pure compute functions.
- `packages/core/src/blocks/scoping/cost-model.test.ts` — unit tests.
- `packages/core/src/blocks/scoping/scenario.ts` — scenario serialize/deserialize + `?scenario=` param parse (pure).
- `packages/core/src/blocks/scoping/scenario.test.ts` — unit tests.
- `packages/core/src/blocks/scoping/scenario-store.ts` — Supabase REST + localStorage client (thin I/O).
- `packages/core/src/blocks/scoping/ScopingCalculator.astro` — the interactive full-bleed calculator UI.

**Create (apps/ferrari-racing):**
- `apps/ferrari-racing/src/data/scoping.ts` — 3 seed scenarios + assumption metadata (fact/inference/source labels).
- `apps/ferrari-racing/src/pages/scoping.astro` — the deck page (4 slides).

**Modify:**
- `package.json` (root) — add `vitest` devDep + `test` script.
- `apps/ferrari-racing/src/components/FerrariNav.astro` — add the `Scoping` nav item (gated).
- `apps/ferrari-racing/src/layouts/BaseLayout.astro` — add `scoping` to `SECTION_FLOW`.
- `apps/ferrari-racing/src/pages/admin.astro` — register the `scoping` solution + `PAGE_REGISTRY` entry.
- `packages/core/src/blocks/admin/AdminConsole.astro` — add the "Licensing model" baseline tab (config-driven).
- `supabase/migrations/0004_scenarios.sql` — new table + RLS.
- `supabase/README.md` — note the new migration.

**Data contract (used across tasks — define once, reference everywhere):**

```typescript
// The unit for a Collaboration bundled allotment.
export type CollabPackage = 'none' | 'prime' | 'ultimate'; // 0 / 2500 / 5000 credits

// One saved scenario's editable inputs + a computed snapshot.
export interface ScopingAssumptions {
  // ── Collaboration ──
  collabMode: 'direct' | 'activity';
  collabPackage: CollabPackage;
  directCredits: number;              // used when collabMode === 'direct'
  partners: number;                   // activity mode
  audienceSize: number;               // distinct addressable identities
  activationsPerYear: number;
  creditPerActivation: number;        // user coefficient, default 0 (unknown)
  creditPerAudienceMgmt: number;      // per partner-audience/yr, default 0
  creditPerMeasurement: number;       // per activation measurement, default 0
  // ── CJA ──
  webVisitsPerYear: number;
  webHitsPerVisit: number;
  appMau: number;
  appEventsPerMauPerMonth: number;
  socialAudience: number;
  socialActivePct: number;            // 0..1
  socialActionsPerActivePerMonth: number;
  crmProfiles: number;
  crmEventsPerProfilePerYear: number;
  eventsRowsPerYear: number;          // on-site / eSports lump sum
}

export interface UnitPrices {
  currency: string;                   // e.g. 'EUR'
  pricePerCredit: number | null;      // null = not set → cost hidden
  pricePerMillionRows: number | null; // null = not set → cost hidden
}

export interface ScopingSnapshot {
  collabCreditsEstimated: number;
  collabAllotment: number;
  collabBillableCredits: number;
  collabCost: number | null;
  cjaRowsPerYear: number;
  cjaAnnualIngestionLimit: number;    // 3× licensed (guardrail)
  cjaCost: number | null;
  totalCost: number | null;
}

export interface Scenario {
  id?: string;                        // uuid once persisted
  title: string;
  assumptions: ScopingAssumptions;
  prices: UnitPrices;
  visibility: 'private' | 'link' | 'team';
}
```

---

### Task 1: Add Vitest to `packages/core`

**Files:**
- Create: `packages/core/vitest.config.ts`
- Modify: `packages/core/package.json`
- Modify: `package.json` (root)

- [ ] **Step 1: Add the Vitest config**

Create `packages/core/vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 2: Add the `test` script to the core package**

In `packages/core/package.json`, add a `"test"` script to the `"scripts"` object:

```json
"test": "vitest run"
```

- [ ] **Step 3: Add Vitest as a root dev dependency + workspace test script**

In root `package.json` `"devDependencies"`, add:

```json
"vitest": "^2.1.8"
```

And in root `package.json` `"scripts"`, add:

```json
"test": "pnpm -r test"
```

- [ ] **Step 4: Install**

Run: `pnpm install`
Expected: completes; `vitest` resolves in `packages/core`.

- [ ] **Step 5: Add a smoke test to prove the runner works**

Create `packages/core/src/blocks/scoping/smoke.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';

describe('vitest wiring', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run it**

Run: `pnpm --filter @agargiulo-adbe/experience-core test`
Expected: PASS (1 test).

- [ ] **Step 7: Remove the smoke test and commit**

```bash
rm packages/core/src/blocks/scoping/smoke.test.ts
git add packages/core/vitest.config.ts packages/core/package.json package.json pnpm-lock.yaml
git commit -m "chore(core): add vitest test runner"
```

---

### Task 2: Cost-model types + pure compute (TDD)

**Files:**
- Create: `packages/core/src/blocks/scoping/cost-model.ts`
- Test: `packages/core/src/blocks/scoping/cost-model.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `packages/core/src/blocks/scoping/cost-model.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  allotmentCredits,
  estimateCollabCredits,
  billableCredits,
  estimateCjaRows,
  computeSnapshot,
  type ScopingAssumptions,
  type UnitPrices,
} from './cost-model';

const base: ScopingAssumptions = {
  collabMode: 'activity',
  collabPackage: 'prime',
  directCredits: 0,
  partners: 5,
  audienceSize: 15_000_000,
  activationsPerYear: 24,
  creditPerActivation: 1,
  creditPerAudienceMgmt: 0,
  creditPerMeasurement: 0,
  webVisitsPerYear: 32_000_000,
  webHitsPerVisit: 8,
  appMau: 1_500_000,
  appEventsPerMauPerMonth: 30,
  socialAudience: 35_000_000,
  socialActivePct: 0.1,
  socialActionsPerActivePerMonth: 6,
  crmProfiles: 3_000_000,
  crmEventsPerProfilePerYear: 24,
  eventsRowsPerYear: 30_000_000,
};

describe('allotmentCredits', () => {
  it('maps packages to credit allotments', () => {
    expect(allotmentCredits('none')).toBe(0);
    expect(allotmentCredits('prime')).toBe(2500);
    expect(allotmentCredits('ultimate')).toBe(5000);
  });
});

describe('estimateCollabCredits', () => {
  it('uses directCredits in direct mode', () => {
    expect(estimateCollabCredits({ ...base, collabMode: 'direct', directCredits: 9000 })).toBe(9000);
  });

  it('sums activity coefficients in activity mode', () => {
    // activation: 24 * 1 = 24; mgmt: partners*audienceMgmt = 0; measurement: 0
    expect(estimateCollabCredits(base)).toBe(24);
  });

  it('scales with audience-management and measurement coefficients', () => {
    const a = { ...base, creditPerAudienceMgmt: 2, creditPerMeasurement: 0.5 };
    // activation 24 + mgmt (5 partners * 2) 10 + measurement (24 * 0.5) 12 = 46
    expect(estimateCollabCredits(a)).toBe(46);
  });
});

describe('billableCredits', () => {
  it('subtracts the bundled allotment and floors at zero', () => {
    expect(billableCredits(9000, 2500)).toBe(6500);
    expect(billableCredits(1000, 2500)).toBe(0);
  });
});

describe('estimateCjaRows', () => {
  it('sums all channel building blocks per year', () => {
    // web 32e6*8=256e6; app 1.5e6*30*12=540e6; social 35e6*0.1*6*12=252e6;
    // crm 3e6*24=72e6; events 30e6  => 1,150,000,000
    expect(estimateCjaRows(base)).toBe(1_150_000_000);
  });
});

describe('computeSnapshot', () => {
  it('hides cost when prices are null but always returns quantities', () => {
    const prices: UnitPrices = { currency: 'EUR', pricePerCredit: null, pricePerMillionRows: null };
    const s = computeSnapshot(base, prices);
    expect(s.cjaRowsPerYear).toBe(1_150_000_000);
    expect(s.cjaAnnualIngestionLimit).toBe(3_450_000_000);
    expect(s.collabBillableCredits).toBe(0); // 24 estimated - 2500 allotment => 0
    expect(s.collabCost).toBeNull();
    expect(s.cjaCost).toBeNull();
    expect(s.totalCost).toBeNull();
  });

  it('computes cost when prices are set', () => {
    const a = { ...base, collabMode: 'direct' as const, directCredits: 10_000, collabPackage: 'none' as const };
    const prices: UnitPrices = { currency: 'EUR', pricePerCredit: 3, pricePerMillionRows: 2 };
    const s = computeSnapshot(a, prices);
    expect(s.collabBillableCredits).toBe(10_000);
    expect(s.collabCost).toBe(30_000);           // 10000 * 3
    expect(s.cjaCost).toBe(2300);                // 1.15e9 / 1e6 * 2
    expect(s.totalCost).toBe(32_300);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @agargiulo-adbe/experience-core test`
Expected: FAIL ("Cannot find module './cost-model'").

- [ ] **Step 3: Write the implementation**

Create `packages/core/src/blocks/scoping/cost-model.ts`:

```typescript
export type CollabPackage = 'none' | 'prime' | 'ultimate';

export interface ScopingAssumptions {
  collabMode: 'direct' | 'activity';
  collabPackage: CollabPackage;
  directCredits: number;
  partners: number;
  audienceSize: number;
  activationsPerYear: number;
  creditPerActivation: number;
  creditPerAudienceMgmt: number;
  creditPerMeasurement: number;
  webVisitsPerYear: number;
  webHitsPerVisit: number;
  appMau: number;
  appEventsPerMauPerMonth: number;
  socialAudience: number;
  socialActivePct: number;
  socialActionsPerActivePerMonth: number;
  crmProfiles: number;
  crmEventsPerProfilePerYear: number;
  eventsRowsPerYear: number;
}

export interface UnitPrices {
  currency: string;
  pricePerCredit: number | null;
  pricePerMillionRows: number | null;
}

export interface ScopingSnapshot {
  collabCreditsEstimated: number;
  collabAllotment: number;
  collabBillableCredits: number;
  collabCost: number | null;
  cjaRowsPerYear: number;
  cjaAnnualIngestionLimit: number;
  cjaCost: number | null;
  totalCost: number | null;
}

const ALLOTMENTS: Record<CollabPackage, number> = { none: 0, prime: 2500, ultimate: 5000 };

export function allotmentCredits(pkg: CollabPackage): number {
  return ALLOTMENTS[pkg];
}

export function estimateCollabCredits(a: ScopingAssumptions): number {
  if (a.collabMode === 'direct') return Math.max(0, a.directCredits);
  const activation = a.activationsPerYear * a.creditPerActivation;
  const management = a.partners * a.creditPerAudienceMgmt;
  const measurement = a.activationsPerYear * a.creditPerMeasurement;
  return activation + management + measurement;
}

export function billableCredits(estimated: number, allotment: number): number {
  return Math.max(0, estimated - allotment);
}

export function estimateCjaRows(a: ScopingAssumptions): number {
  const web = a.webVisitsPerYear * a.webHitsPerVisit;
  const app = a.appMau * a.appEventsPerMauPerMonth * 12;
  const social = a.socialAudience * a.socialActivePct * a.socialActionsPerActivePerMonth * 12;
  const crm = a.crmProfiles * a.crmEventsPerProfilePerYear;
  return web + app + social + crm + a.eventsRowsPerYear;
}

export function computeSnapshot(a: ScopingAssumptions, prices: UnitPrices): ScopingSnapshot {
  const collabCreditsEstimated = estimateCollabCredits(a);
  const collabAllotment = allotmentCredits(a.collabPackage);
  const collabBillableCredits = billableCredits(collabCreditsEstimated, collabAllotment);
  const cjaRowsPerYear = estimateCjaRows(a);
  const cjaAnnualIngestionLimit = cjaRowsPerYear * 3;

  const collabCost = prices.pricePerCredit == null
    ? null
    : collabBillableCredits * prices.pricePerCredit;
  const cjaCost = prices.pricePerMillionRows == null
    ? null
    : (cjaRowsPerYear / 1_000_000) * prices.pricePerMillionRows;
  const totalCost = collabCost == null && cjaCost == null
    ? null
    : (collabCost ?? 0) + (cjaCost ?? 0);

  return {
    collabCreditsEstimated,
    collabAllotment,
    collabBillableCredits,
    collabCost,
    cjaRowsPerYear,
    cjaAnnualIngestionLimit,
    cjaCost,
    totalCost,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @agargiulo-adbe/experience-core test`
Expected: PASS (all cost-model tests).

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/blocks/scoping/cost-model.ts packages/core/src/blocks/scoping/cost-model.test.ts
git commit -m "feat(core): scoping cost-model (Collaboration credits + CJA rows)"
```

---

### Task 3: Scenario serialize + share-link param parse (TDD)

**Files:**
- Create: `packages/core/src/blocks/scoping/scenario.ts`
- Test: `packages/core/src/blocks/scoping/scenario.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `packages/core/src/blocks/scoping/scenario.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { serializeScenario, deserializeScenario, scenarioIdFromSearch, type Scenario } from './scenario';
import type { ScopingAssumptions, UnitPrices } from './cost-model';

const assumptions: ScopingAssumptions = {
  collabMode: 'direct', collabPackage: 'prime', directCredits: 9000,
  partners: 5, audienceSize: 15_000_000, activationsPerYear: 24,
  creditPerActivation: 0, creditPerAudienceMgmt: 0, creditPerMeasurement: 0,
  webVisitsPerYear: 32_000_000, webHitsPerVisit: 8, appMau: 1_500_000,
  appEventsPerMauPerMonth: 30, socialAudience: 35_000_000, socialActivePct: 0.1,
  socialActionsPerActivePerMonth: 6, crmProfiles: 3_000_000,
  crmEventsPerProfilePerYear: 24, eventsRowsPerYear: 30_000_000,
};
const prices: UnitPrices = { currency: 'EUR', pricePerCredit: null, pricePerMillionRows: null };
const scenario: Scenario = { title: 'Base', assumptions, prices, visibility: 'private' };

describe('serialize/deserialize round-trip', () => {
  it('preserves the scenario through a JSON payload', () => {
    const payload = serializeScenario(scenario);
    const back = deserializeScenario(payload);
    expect(back.title).toBe('Base');
    expect(back.assumptions.directCredits).toBe(9000);
    expect(back.visibility).toBe('private');
  });

  it('fills defaults for a missing/partial payload', () => {
    const back = deserializeScenario({ title: 'X', assumptions: { collabMode: 'direct' } });
    expect(back.title).toBe('X');
    expect(back.assumptions.webHitsPerVisit).toBeTypeOf('number');
    expect(back.prices.pricePerCredit).toBeNull();
    expect(back.visibility).toBe('private');
  });
});

describe('scenarioIdFromSearch', () => {
  it('reads the ?scenario= uuid', () => {
    expect(scenarioIdFromSearch('?scenario=abc-123')).toBe('abc-123');
  });
  it('returns null when absent', () => {
    expect(scenarioIdFromSearch('?foo=1')).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @agargiulo-adbe/experience-core test`
Expected: FAIL ("Cannot find module './scenario'").

- [ ] **Step 3: Write the implementation**

Create `packages/core/src/blocks/scoping/scenario.ts`:

```typescript
import type { ScopingAssumptions, UnitPrices, CollabPackage } from './cost-model';

export interface Scenario {
  id?: string;
  title: string;
  assumptions: ScopingAssumptions;
  prices: UnitPrices;
  visibility: 'private' | 'link' | 'team';
}

export const DEFAULT_ASSUMPTIONS: ScopingAssumptions = {
  collabMode: 'activity',
  collabPackage: 'prime' as CollabPackage,
  directCredits: 0,
  partners: 5,
  audienceSize: 15_000_000,
  activationsPerYear: 24,
  creditPerActivation: 0,
  creditPerAudienceMgmt: 0,
  creditPerMeasurement: 0,
  webVisitsPerYear: 32_000_000,
  webHitsPerVisit: 8,
  appMau: 1_500_000,
  appEventsPerMauPerMonth: 30,
  socialAudience: 35_000_000,
  socialActivePct: 0.1,
  socialActionsPerActivePerMonth: 6,
  crmProfiles: 3_000_000,
  crmEventsPerProfilePerYear: 24,
  eventsRowsPerYear: 30_000_000,
};

export const DEFAULT_PRICES: UnitPrices = {
  currency: 'EUR',
  pricePerCredit: null,
  pricePerMillionRows: null,
};

// The JSON blob stored in scenarios.payload (assumptions + prices, no title/visibility).
export interface ScenarioPayload {
  title: string;
  assumptions: Partial<ScopingAssumptions>;
  prices?: Partial<UnitPrices>;
}

export function serializeScenario(s: Scenario): ScenarioPayload {
  return { title: s.title, assumptions: s.assumptions, prices: s.prices };
}

export function deserializeScenario(payload: ScenarioPayload, id?: string): Scenario {
  return {
    id,
    title: payload.title ?? 'Scenario',
    assumptions: { ...DEFAULT_ASSUMPTIONS, ...(payload.assumptions ?? {}) },
    prices: { ...DEFAULT_PRICES, ...(payload.prices ?? {}) },
    visibility: 'private',
  };
}

export function scenarioIdFromSearch(search: string): string | null {
  return new URLSearchParams(search).get('scenario');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter @agargiulo-adbe/experience-core test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/blocks/scoping/scenario.ts packages/core/src/blocks/scoping/scenario.test.ts
git commit -m "feat(core): scoping scenario serialize + share-link param"
```

---

### Task 4: Supabase migration for `scenarios` (table + RLS)

**Files:**
- Create: `supabase/migrations/0004_scenarios.sql`
- Modify: `supabase/README.md`

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/0004_scenarios.sql`:

```sql
-- ─────────────────────────────────────────────────────────────────────
--  0004 · scenarios — persistent, shareable licensing/scoping scenarios
--  Mirrors media_configs (0003) conventions: anon read only for shared
--  rows, authenticated owner writes. Adds private/link/team visibility.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists public.scenarios (
  id           uuid primary key default gen_random_uuid(),
  project_slug text not null,
  title        text not null,
  payload      jsonb not null,
  created_by   uuid references public.profiles (id) on delete set null,
  visibility   text not null default 'private'
               check (visibility in ('private', 'link', 'team')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.scenarios enable row level security;

-- SELECT: shared-by-link rows are anon-readable; otherwise the owner,
-- team members with a role on the experience, or a super admin.
drop policy if exists scenarios_select on public.scenarios;
create policy scenarios_select on public.scenarios
  for select using (
    visibility = 'link'
    or created_by = auth.uid()
    or public.is_super_admin()
    or (
      visibility = 'team'
      and exists (
        select 1 from public.user_experience_roles r
        join public.experiences e on e.id = r.experience_id
        where r.user_id = auth.uid() and e.slug = scenarios.project_slug
      )
    )
  );

-- INSERT: authenticated users, only as themselves.
drop policy if exists scenarios_insert on public.scenarios;
create policy scenarios_insert on public.scenarios
  for insert to authenticated
  with check (created_by = auth.uid());

-- UPDATE: owner or super admin.
drop policy if exists scenarios_update on public.scenarios;
create policy scenarios_update on public.scenarios
  for update to authenticated
  using (created_by = auth.uid() or public.is_super_admin())
  with check (created_by = auth.uid() or public.is_super_admin());

-- DELETE: owner or super admin.
drop policy if exists scenarios_delete on public.scenarios;
create policy scenarios_delete on public.scenarios
  for delete to authenticated
  using (created_by = auth.uid() or public.is_super_admin());
```

- [ ] **Step 2: Verify it references real columns**

Run: `grep -n "experiences\|user_experience_roles\|slug\|experience_id\|is_super_admin" supabase/migrations/0001_super_admin.sql`
Expected: confirms `experiences.slug`, `user_experience_roles.experience_id`, `user_experience_roles.user_id`, and `public.is_super_admin()` all exist (the migration's join relies on them). If `experiences` uses a different PK/column name, adjust the join accordingly before continuing.

- [ ] **Step 3: Document the migration**

In `supabase/README.md`, under the migrations list (near the section the user referenced around line 20), add a line:

```markdown
- `0004_scenarios.sql` — persistent licensing/scoping scenarios (private/link/team RLS) for the Ferrari `/scoping` calculator.
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0004_scenarios.sql supabase/README.md
git commit -m "feat(supabase): scenarios table + private/link/team RLS"
```

> **Note:** applying the migration to the remote DB (`supabase db query --linked` or the SQL editor) is a one-time manual op done outside this plan, like `media_configs` before it.

---

### Task 5: Scenario store client (Supabase REST + localStorage)

**Files:**
- Create: `packages/core/src/blocks/scoping/scenario-store.ts`

This is thin network I/O (not unit-tested — the repo has no network mock harness; verified by typecheck + manual). It reuses the exact `edf:sb-session` token pattern from `AdminConsole.astro`.

- [ ] **Step 1: Write the store**

Create `packages/core/src/blocks/scoping/scenario-store.ts`:

```typescript
import type { Scenario } from './scenario';
import { serializeScenario, deserializeScenario } from './scenario';

export interface StoreCtx {
  supabaseUrl: string;
  supabaseAnonKey: string;
  projectSlug: string;
}

function accessToken(): string {
  try {
    return (JSON.parse(localStorage.getItem('edf:sb-session') || 'null') || {}).access_token || '';
  } catch {
    return '';
  }
}

export function isLoggedIn(): boolean {
  return accessToken() !== '';
}

const LOCAL_KEY = (slug: string) => `edf:scoping-local:${slug}`;

// ── Local (anonymous / ephemeral) scenarios ──────────────────────────
export function loadLocal(slug: string): Scenario[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY(slug)) || '[]');
  } catch {
    return [];
  }
}

export function saveLocal(slug: string, scenarios: Scenario[]): void {
  localStorage.setItem(LOCAL_KEY(slug), JSON.stringify(scenarios));
}

// ── Remote (persistent, account-linked) scenarios ────────────────────
export async function saveRemote(ctx: StoreCtx, s: Scenario): Promise<string> {
  const token = accessToken();
  if (!token) throw new Error('not-logged-in');
  const res = await fetch(ctx.supabaseUrl + '/rest/v1/scenarios', {
    method: 'POST',
    headers: {
      apikey: ctx.supabaseAnonKey,
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      project_slug: ctx.projectSlug,
      title: s.title,
      payload: serializeScenario(s),
      visibility: s.visibility,
    }),
  });
  const rows = await res.json();
  const id = rows && rows[0] && rows[0].id;
  if (!id) throw new Error('save-failed');
  return id;
}

export async function fetchRemoteById(ctx: StoreCtx, id: string): Promise<Scenario | null> {
  const token = accessToken();
  const res = await fetch(
    ctx.supabaseUrl + '/rest/v1/scenarios?id=eq.' + encodeURIComponent(id) + '&select=id,title,payload,visibility',
    { headers: { apikey: ctx.supabaseAnonKey, Authorization: 'Bearer ' + (token || ctx.supabaseAnonKey) } },
  );
  const rows = await res.json();
  if (!rows || !rows[0]) return null;
  const s = deserializeScenario(rows[0].payload, rows[0].id);
  s.visibility = rows[0].visibility;
  s.title = rows[0].title;
  return s;
}

export async function listMine(ctx: StoreCtx): Promise<Scenario[]> {
  const token = accessToken();
  if (!token) return [];
  const res = await fetch(
    ctx.supabaseUrl + '/rest/v1/scenarios?project_slug=eq.' + encodeURIComponent(ctx.projectSlug) +
      '&select=id,title,payload,visibility&order=updated_at.desc',
    { headers: { apikey: ctx.supabaseAnonKey, Authorization: 'Bearer ' + token } },
  );
  const rows = await res.json();
  if (!Array.isArray(rows)) return [];
  return rows.map((r: any) => {
    const s = deserializeScenario(r.payload, r.id);
    s.visibility = r.visibility;
    s.title = r.title;
    return s;
  });
}
```

- [ ] **Step 2: Typecheck the core package**

Run: `pnpm --filter @agargiulo-adbe/experience-core typecheck 2>/dev/null || pnpm --filter ferrari-racing typecheck`
Expected: no type errors from `scenario-store.ts`. (Core has no standalone typecheck script; the Ferrari `astro check` in Task 8 will cover it once imported. If run now in isolation, `tsc --noEmit packages/core/src/blocks/scoping/scenario-store.ts` should report no errors.)

- [ ] **Step 3: Commit**

```bash
git add packages/core/src/blocks/scoping/scenario-store.ts
git commit -m "feat(core): scenario store (supabase REST + localStorage fallback)"
```

---

### Task 6: Ferrari seed scenarios + assumption metadata

**Files:**
- Create: `apps/ferrari-racing/src/data/scoping.ts`

- [ ] **Step 1: Write the data module**

Create `apps/ferrari-racing/src/data/scoping.ts`. These are the 3 seed scenarios from the spec (all INFERENCE) plus bilingual labels and the fact/inference source chips:

```typescript
import type { Scenario } from '@edf/core/blocks/scoping/scenario';
import { DEFAULT_ASSUMPTIONS, DEFAULT_PRICES } from '@edf/core/blocks/scoping/scenario';

// All volume figures are REASONED INFERENCES seeded from public footprint
// research (F1 826.5M fans · Scuderia social ~35M · ferrari.com ~2.7M/mo ·
// ~5 data-relevant partners). Prices are always user-entered (quote-only).
export const SEED_SCENARIOS: Scenario[] = [
  {
    title: 'Conservativo / Conservative',
    visibility: 'private',
    prices: { ...DEFAULT_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      collabMode: 'activity', collabPackage: 'prime',
      partners: 2, audienceSize: 5_000_000, activationsPerYear: 12,
      webVisitsPerYear: 32_000_000, webHitsPerVisit: 5,
      appMau: 0, appEventsPerMauPerMonth: 0,
      socialAudience: 35_000_000, socialActivePct: 0.05, socialActionsPerActivePerMonth: 5,
      crmProfiles: 1_500_000, crmEventsPerProfilePerYear: 24,
      eventsRowsPerYear: 15_000_000,
    },
  },
  {
    title: 'Base',
    visibility: 'private',
    prices: { ...DEFAULT_PRICES },
    assumptions: { ...DEFAULT_ASSUMPTIONS }, // ≈1.15B rows, 5 partners / 15M / 24
  },
  {
    title: 'Ambizioso / Ambitious',
    visibility: 'private',
    prices: { ...DEFAULT_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      collabMode: 'activity', collabPackage: 'ultimate',
      partners: 10, audienceSize: 40_000_000, activationsPerYear: 52,
      webVisitsPerYear: 32_000_000, webHitsPerVisit: 12,
      appMau: 4_000_000, appEventsPerMauPerMonth: 40,
      socialAudience: 48_000_000, socialActivePct: 0.2, socialActionsPerActivePerMonth: 9,
      crmProfiles: 6_000_000, crmEventsPerProfilePerYear: 36,
      eventsRowsPerYear: 120_000_000,
    },
  },
];

export type RigorTag = 'fact' | 'inference' | 'sales-order';

export interface AssumptionMeta {
  key: string;             // matches a ScopingAssumptions field or a group
  en: string;
  it: string;
  tag: RigorTag;
  sourceEn?: string;
  sourceIt?: string;
}

export const RIGOR_LABELS: Record<RigorTag, { en: string; it: string }> = {
  fact: { en: 'Documented fact', it: 'Fatto documentato' },
  inference: { en: 'Reasoned inference', it: 'Inferenza ragionata' },
  'sales-order': { en: 'Confirm on Sales Order', it: 'Da confermare (Sales Order)' },
};

// Chips shown on the "Assumptions" slide.
export const ASSUMPTION_META: AssumptionMeta[] = [
  { key: 'metric-collab', tag: 'fact', en: 'Collaboration metric = Collaboration Credits', it: 'Metrica Collaboration = Collaboration Credits', sourceEn: 'Adobe Product Description', sourceIt: 'Product Description Adobe' },
  { key: 'allotment', tag: 'fact', en: 'Bundled one-time allotment: 2,500 (Prime) / 5,000 (Ultimate)', it: 'Allotment one-time incluso: 2.500 (Prime) / 5.000 (Ultimate)', sourceEn: 'RT-CDP Prime/Ultimate PD', sourceIt: 'PD RT-CDP Prime/Ultimate' },
  { key: 'metric-cja', tag: 'fact', en: 'CJA metric = Rows of Data (1 row = 0.25 KB)', it: 'Metrica CJA = Rows of Data (1 row = 0,25 KB)', sourceEn: 'CJA Product Description', sourceIt: 'Product Description CJA' },
  { key: 'ingestion', tag: 'fact', en: 'Annual Ingestion Limit ≤ 3× licensed rows', it: 'Annual Ingestion Limit ≤ 3× righe licenziate', sourceEn: 'CJA Guardrails', sourceIt: 'CJA Guardrails' },
  { key: 'independence', tag: 'inference', en: 'Independent licensing — no dependency between the two', it: 'Licensing indipendente — nessuna dipendenza tra i due', sourceEn: 'Two separate Product Descriptions', sourceIt: 'Due Product Description separate' },
  { key: 'volumes', tag: 'inference', en: 'Ferrari volumes derived from public footprint', it: 'Volumi Ferrari derivati dal footprint pubblico', sourceEn: 'Nielsen / Similarweb / partner list', sourceIt: 'Nielsen / Similarweb / lista partner' },
  { key: 'burn-rate', tag: 'sales-order', en: 'Credit burn-rate & unit prices are quote-only', it: 'Burn-rate credito e prezzi unitari solo da preventivo', sourceEn: 'Sales Order / Credit Consumption Table', sourceIt: 'Sales Order / Credit Consumption Table' },
  { key: 'app-crm', tag: 'sales-order', en: 'App MAU & CRM size: client to confirm', it: 'App MAU e dimensione CRM: da confermare col cliente' },
];

export const DISCLAIMER = {
  it: 'Stima illustrativa basata su assunzioni dichiarate e su capability pubbliche Adobe. Non sostituisce un Sales Order o i PSLT applicabili. Prezzi unitari da definire contrattualmente.',
  en: 'Illustrative estimate based on stated assumptions and public Adobe capabilities. It does not replace a Sales Order or applicable PSLT. Unit prices to be defined contractually.',
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/ferrari-racing/src/data/scoping.ts
git commit -m "feat(ferrari): seed scoping scenarios + assumption metadata"
```

---

### Task 7: `ScopingCalculator.astro` core block (interactive UI)

**Files:**
- Create: `packages/core/src/blocks/scoping/ScopingCalculator.astro`

The component renders two product columns of numeric inputs, a live results panel, and an action bar. All compute delegates to the tested `cost-model.ts`; persistence delegates to `scenario-store.ts`. It is a full-bleed, app-like island (internal scroll allowed — exempt from `audit:deck`).

- [ ] **Step 1: Write the component**

Create `packages/core/src/blocks/scoping/ScopingCalculator.astro`:

```astro
---
interface Props {
  projectSlug: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  experienceUrl: string; // absolute URL of the /scoping/ page for share links
}
const { projectSlug, supabaseUrl, supabaseAnonKey, experienceUrl } = Astro.props;
---
<div class="scoping" data-scoping
     data-project={projectSlug}
     data-supabase-url={supabaseUrl}
     data-supabase-key={supabaseAnonKey}
     data-experience-url={experienceUrl}>

  <div class="scoping-cols">
    <!-- ── Collaboration column ─────────────────────────────── -->
    <section class="scoping-card" aria-labelledby="sc-collab-h">
      <h3 id="sc-collab-h" class="scoping-card-h">
        <span data-lang-en>Real-Time CDP Collaboration</span><span data-lang-it>Real-Time CDP Collaboration</span>
      </h3>
      <label class="scoping-field">
        <span data-lang-en>Bundled package allotment</span><span data-lang-it>Allotment del package</span>
        <select data-k="collabPackage">
          <option value="none">None (0)</option>
          <option value="prime">Prime (2,500)</option>
          <option value="ultimate">Ultimate (5,000)</option>
        </select>
      </label>
      <label class="scoping-field">
        <span data-lang-en>Estimation mode</span><span data-lang-it>Modalità di stima</span>
        <select data-k="collabMode">
          <option value="activity" data-lang-en>Estimate from activity</option>
          <option value="direct" data-lang-en>Direct credits</option>
        </select>
      </label>
      <label class="scoping-field" data-when="direct">
        <span data-lang-en>Annual Collaboration Credits</span><span data-lang-it>Collaboration Credits annui</span>
        <input type="number" min="0" data-k="directCredits" />
      </label>
      <div data-when="activity">
        <label class="scoping-field"><span data-lang-en>Data-collaboration partners</span><span data-lang-it>Partner in data collaboration</span><input type="number" min="0" data-k="partners" /></label>
        <label class="scoping-field"><span data-lang-en>Distinct addressable audience</span><span data-lang-it>Audience distinta indirizzabile</span><input type="number" min="0" data-k="audienceSize" /></label>
        <label class="scoping-field"><span data-lang-en>Activations / year</span><span data-lang-it>Attivazioni / anno</span><input type="number" min="0" data-k="activationsPerYear" /></label>
        <label class="scoping-field scoping-so"><span data-lang-en>Credits per activation</span><span data-lang-it>Credits per attivazione</span><input type="number" min="0" step="0.01" data-k="creditPerActivation" /></label>
        <label class="scoping-field scoping-so"><span data-lang-en>Credits per partner audience mgmt</span><span data-lang-it>Credits per audience mgmt partner</span><input type="number" min="0" step="0.01" data-k="creditPerAudienceMgmt" /></label>
        <label class="scoping-field scoping-so"><span data-lang-en>Credits per measurement</span><span data-lang-it>Credits per measurement</span><input type="number" min="0" step="0.01" data-k="creditPerMeasurement" /></label>
      </div>
      <label class="scoping-field scoping-so"><span data-lang-en>Price per credit (Sales Order)</span><span data-lang-it>Prezzo per credito (Sales Order)</span><input type="number" min="0" step="0.01" data-k="pricePerCredit" placeholder="—" /></label>
    </section>

    <!-- ── CJA column ───────────────────────────────────────── -->
    <section class="scoping-card" aria-labelledby="sc-cja-h">
      <h3 id="sc-cja-h" class="scoping-card-h">
        <span data-lang-en>Customer Journey Analytics</span><span data-lang-it>Customer Journey Analytics</span>
      </h3>
      <label class="scoping-field"><span data-lang-en>Web visits / year</span><span data-lang-it>Visite web / anno</span><input type="number" min="0" data-k="webVisitsPerYear" /></label>
      <label class="scoping-field"><span data-lang-en>Hits per visit</span><span data-lang-it>Hit per visita</span><input type="number" min="0" data-k="webHitsPerVisit" /></label>
      <label class="scoping-field scoping-so"><span data-lang-en>App MAU (client to confirm)</span><span data-lang-it>App MAU (da confermare)</span><input type="number" min="0" data-k="appMau" /></label>
      <label class="scoping-field"><span data-lang-en>App events / MAU / month</span><span data-lang-it>Eventi app / MAU / mese</span><input type="number" min="0" data-k="appEventsPerMauPerMonth" /></label>
      <label class="scoping-field"><span data-lang-en>Social audience</span><span data-lang-it>Audience social</span><input type="number" min="0" data-k="socialAudience" /></label>
      <label class="scoping-field"><span data-lang-en>Active share (0–1)</span><span data-lang-it>Quota attiva (0–1)</span><input type="number" min="0" max="1" step="0.01" data-k="socialActivePct" /></label>
      <label class="scoping-field"><span data-lang-en>Social actions / active / month</span><span data-lang-it>Azioni social / attivo / mese</span><input type="number" min="0" data-k="socialActionsPerActivePerMonth" /></label>
      <label class="scoping-field scoping-so"><span data-lang-en>CRM profiles (client to confirm)</span><span data-lang-it>Profili CRM (da confermare)</span><input type="number" min="0" data-k="crmProfiles" /></label>
      <label class="scoping-field"><span data-lang-en>CRM events / profile / year</span><span data-lang-it>Eventi CRM / profilo / anno</span><input type="number" min="0" data-k="crmEventsPerProfilePerYear" /></label>
      <label class="scoping-field"><span data-lang-en>Events / eSports rows / year</span><span data-lang-it>Righe eventi / eSports / anno</span><input type="number" min="0" data-k="eventsRowsPerYear" /></label>
      <label class="scoping-field scoping-so"><span data-lang-en>Price per 1M rows (Sales Order)</span><span data-lang-it>Prezzo per 1M righe (Sales Order)</span><input type="number" min="0" step="0.01" data-k="pricePerMillionRows" placeholder="—" /></label>
    </section>

    <!-- ── Results panel ────────────────────────────────────── -->
    <aside class="scoping-results" aria-live="polite">
      <div class="scoping-metric"><span data-lang-en>Billable credits / yr</span><span data-lang-it>Credits fatturabili / anno</span><b data-out="collabBillableCredits">—</b></div>
      <div class="scoping-metric"><span data-lang-en>Collaboration cost</span><span data-lang-it>Costo Collaboration</span><b data-out="collabCost">—</b></div>
      <div class="scoping-metric"><span data-lang-en>CJA Rows / yr</span><span data-lang-it>Righe CJA / anno</span><b data-out="cjaRowsPerYear">—</b></div>
      <div class="scoping-metric"><span data-lang-en>Annual ingestion limit (3×)</span><span data-lang-it>Limite ingestion annuo (3×)</span><b data-out="cjaAnnualIngestionLimit">—</b></div>
      <div class="scoping-metric"><span data-lang-en>CJA cost</span><span data-lang-it>Costo CJA</span><b data-out="cjaCost">—</b></div>
      <div class="scoping-metric scoping-total"><span data-lang-en>Total (indicative)</span><span data-lang-it>Totale (indicativo)</span><b data-out="totalCost">—</b></div>
    </aside>
  </div>

  <!-- ── Action bar ─────────────────────────────────────────── -->
  <div class="scoping-actions">
    <select data-scoping-picker aria-label="Scenario"></select>
    <input type="text" data-scoping-title placeholder="Scenario name" />
    <select data-scoping-visibility aria-label="Visibility">
      <option value="private" data-lang-en>Private</option>
      <option value="link" data-lang-en>Shared via link</option>
      <option value="team" data-lang-en>Team</option>
    </select>
    <button data-scoping-save><span data-lang-en>Save</span><span data-lang-it>Salva</span></button>
    <button data-scoping-share><span data-lang-en>Share</span><span data-lang-it>Condividi</span></button>
    <button data-scoping-reset><span data-lang-en>Reset</span><span data-lang-it>Reset</span></button>
    <span data-scoping-note class="scoping-note"></span>
  </div>
</div>

<script>
  import {
    computeSnapshot, type ScopingAssumptions, type UnitPrices,
  } from './cost-model';
  import {
    DEFAULT_ASSUMPTIONS, DEFAULT_PRICES, scenarioIdFromSearch, type Scenario,
  } from './scenario';
  import {
    isLoggedIn, loadLocal, saveLocal, saveRemote, fetchRemoteById, listMine, type StoreCtx,
  } from './scenario-store';

  const NUM_KEYS = new Set([
    'directCredits','partners','audienceSize','activationsPerYear','creditPerActivation',
    'creditPerAudienceMgmt','creditPerMeasurement','webVisitsPerYear','webHitsPerVisit',
    'appMau','appEventsPerMauPerMonth','socialAudience','socialActivePct',
    'socialActionsPerActivePerMonth','crmProfiles','crmEventsPerProfilePerYear','eventsRowsPerYear',
  ]);

  function initScoping(root: HTMLElement) {
    const ctx: StoreCtx = {
      projectSlug: root.dataset.project!,
      supabaseUrl: root.dataset.supabaseUrl!,
      supabaseAnonKey: root.dataset.supabaseKey!,
    };
    const experienceUrl = root.dataset.experienceUrl!;
    let assumptions: ScopingAssumptions = { ...DEFAULT_ASSUMPTIONS };
    let prices: UnitPrices = { ...DEFAULT_PRICES };
    const note = root.querySelector<HTMLElement>('[data-scoping-note]')!;

    const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
    const fmtMoney = (n: number | null) =>
      n == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: prices.currency, maximumFractionDigits: 0 }).format(n);

    function writeInputs() {
      root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-k]').forEach((el) => {
        const k = el.dataset.k!;
        if (k === 'pricePerCredit') el.value = prices.pricePerCredit == null ? '' : String(prices.pricePerCredit);
        else if (k === 'pricePerMillionRows') el.value = prices.pricePerMillionRows == null ? '' : String(prices.pricePerMillionRows);
        else el.value = String((assumptions as any)[k]);
      });
      root.querySelectorAll<HTMLElement>('[data-when]').forEach((el) => {
        el.style.display = el.dataset.when === assumptions.collabMode ? '' : 'none';
      });
    }

    function readInput(el: HTMLInputElement | HTMLSelectElement) {
      const k = el.dataset.k!;
      if (k === 'pricePerCredit') prices.pricePerCredit = el.value === '' ? null : Number(el.value);
      else if (k === 'pricePerMillionRows') prices.pricePerMillionRows = el.value === '' ? null : Number(el.value);
      else if (NUM_KEYS.has(k)) (assumptions as any)[k] = Number(el.value) || 0;
      else (assumptions as any)[k] = el.value; // collabMode / collabPackage
    }

    function render() {
      const s = computeSnapshot(assumptions, prices);
      const out = (name: string, v: string) => {
        const el = root.querySelector(`[data-out="${name}"]`);
        if (el) el.textContent = v;
      };
      out('collabBillableCredits', fmt(s.collabBillableCredits));
      out('collabCost', fmtMoney(s.collabCost));
      out('cjaRowsPerYear', fmt(s.cjaRowsPerYear));
      out('cjaAnnualIngestionLimit', fmt(s.cjaAnnualIngestionLimit));
      out('cjaCost', fmtMoney(s.cjaCost));
      out('totalCost', fmtMoney(s.totalCost));
    }

    root.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-k]').forEach((el) => {
      el.addEventListener('input', () => { readInput(el); if (el.dataset.k === 'collabMode') writeInputs(); render(); });
    });

    // ── Scenario picker ────────────────────────────────────
    const picker = root.querySelector<HTMLSelectElement>('[data-scoping-picker]')!;
    let scenarios: Scenario[] = [];

    function refreshPicker() {
      picker.innerHTML = '';
      scenarios.forEach((sc, i) => {
        const o = document.createElement('option');
        o.value = String(i);
        o.textContent = sc.title + (sc.visibility !== 'private' ? ` · ${sc.visibility}` : '');
        picker.appendChild(o);
      });
    }

    function applyScenario(sc: Scenario) {
      assumptions = { ...DEFAULT_ASSUMPTIONS, ...sc.assumptions };
      prices = { ...DEFAULT_PRICES, ...sc.prices };
      (root.querySelector('[data-scoping-title]') as HTMLInputElement).value = sc.title;
      (root.querySelector('[data-scoping-visibility]') as HTMLSelectElement).value = sc.visibility;
      writeInputs(); render();
    }

    picker.addEventListener('change', () => {
      const sc = scenarios[Number(picker.value)];
      if (sc) applyScenario(sc);
    });

    // ── Save / Share / Reset ───────────────────────────────
    root.querySelector('[data-scoping-save]')!.addEventListener('click', async () => {
      const title = (root.querySelector('[data-scoping-title]') as HTMLInputElement).value || 'Scenario';
      const visibility = (root.querySelector('[data-scoping-visibility]') as HTMLSelectElement).value as Scenario['visibility'];
      const sc: Scenario = { title, assumptions: { ...assumptions }, prices: { ...prices }, visibility };
      if (isLoggedIn()) {
        try {
          const id = await saveRemote(ctx, sc);
          sc.id = id;
          scenarios.unshift(sc); refreshPicker();
          note.textContent = 'Saved to your account.';
        } catch { note.textContent = 'Save failed — check your connection.'; }
      } else {
        scenarios.unshift(sc); saveLocal(ctx.projectSlug, scenarios.filter((x) => !x.id)); refreshPicker();
        note.textContent = 'Saved locally. Log in from the Console to persist & share.';
      }
    });

    root.querySelector('[data-scoping-share]')!.addEventListener('click', async () => {
      if (!isLoggedIn()) { note.textContent = 'Log in from the Console (/console/) to create a share link.'; return; }
      const title = (root.querySelector('[data-scoping-title]') as HTMLInputElement).value || 'Scenario';
      const sc: Scenario = { title, assumptions: { ...assumptions }, prices: { ...prices }, visibility: 'link' };
      try {
        const id = await saveRemote(ctx, sc);
        // Absolute URL from the live origin (Astro `site` may be unset) — the
        // passed experienceUrl is the fallback when opened off-origin.
        const path = location.pathname.replace(/\?.*$/, '');
        const url = (location.origin ? location.origin + path : experienceUrl) + '?scenario=' + id;
        await navigator.clipboard?.writeText(url).catch(() => {});
        note.textContent = 'Share link copied: ' + url;
      } catch { note.textContent = 'Could not create share link.'; }
    });

    root.querySelector('[data-scoping-reset]')!.addEventListener('click', () => {
      assumptions = { ...DEFAULT_ASSUMPTIONS }; prices = { ...DEFAULT_PRICES };
      writeInputs(); render(); note.textContent = '';
    });

    // ── Boot: seed list from data attribute-injected globals, load shared/local ──
    const seeded = (window as any).__edfScopingSeeds as Scenario[] | undefined;
    scenarios = (seeded ? seeded.slice() : []).concat(loadLocal(ctx.projectSlug));
    refreshPicker();

    const sharedId = scenarioIdFromSearch(location.search);
    if (sharedId) {
      fetchRemoteById(ctx, sharedId).then((sc) => {
        if (sc) { scenarios.unshift(sc); refreshPicker(); applyScenario(sc); }
      });
    } else if (scenarios[0]) {
      applyScenario(scenarios[0]);
    } else {
      writeInputs(); render();
    }
    if (isLoggedIn()) listMine(ctx).then((mine) => { if (mine.length) { scenarios = mine.concat(scenarios); refreshPicker(); } });
  }

  // Init on first load AND on SPA nav (the deck uses ClientRouter — a module
  // script evaluates once; astro:page-load re-fires per SPA navigation). Guard
  // against double-init with a dataset flag (see mockup-navigation patterns).
  function bootAll() {
    document.querySelectorAll<HTMLElement>('[data-scoping]').forEach((el) => {
      if (el.dataset.scopingReady === '1') return;
      el.dataset.scopingReady = '1';
      initScoping(el);
    });
  }
  bootAll();
  document.addEventListener('astro:page-load', bootAll);
</script>

<style>
  .scoping { display: flex; flex-direction: column; gap: 1rem; width: 100%; height: 100%; overflow-y: auto; padding: 1rem; }
  .scoping-cols { display: grid; grid-template-columns: 1fr; gap: 1rem; }
  @media (min-width: 900px) { .scoping-cols { grid-template-columns: 1fr 1fr 0.8fr; } }
  .scoping-card { background: color-mix(in srgb, var(--surface-inverse, #0B0B0D) 82%, #fff 4%); border: 1px solid var(--line-subtle, rgba(255,255,255,0.1)); border-radius: 6px; padding: 1rem; }
  .scoping-card-h { font-family: var(--font-display); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.75rem; color: var(--ink-inverse, #F4F4F2); }
  .scoping-field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.6rem; font-size: 0.72rem; color: var(--color-grigio-300, #cfcfcf); }
  .scoping-field input, .scoping-field select { background: rgba(255,255,255,0.06); border: 1px solid var(--line-subtle, rgba(255,255,255,0.14)); color: var(--ink-inverse, #F4F4F2); border-radius: 4px; padding: 0.4rem 0.5rem; font-size: 0.85rem; }
  .scoping-so { border-left: 2px solid var(--accent-secondary, #FFF200); padding-left: 0.5rem; }
  .scoping-results { display: flex; flex-direction: column; gap: 0.5rem; background: color-mix(in srgb, var(--surface-inverse, #0B0B0D) 70%, #fff 6%); border-radius: 6px; padding: 1rem; align-self: start; }
  .scoping-metric { display: flex; justify-content: space-between; align-items: baseline; gap: 0.75rem; font-size: 0.72rem; color: var(--color-grigio-300, #cfcfcf); }
  .scoping-metric b { font-family: var(--font-display); font-size: 1.05rem; color: var(--ink-inverse, #F4F4F2); }
  .scoping-total { border-top: 1px solid var(--line-subtle, rgba(255,255,255,0.14)); padding-top: 0.5rem; }
  .scoping-total b { color: var(--accent-primary, #FF2800); font-size: 1.35rem; }
  .scoping-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
  .scoping-actions input, .scoping-actions select, .scoping-actions button { background: rgba(255,255,255,0.06); border: 1px solid var(--line-subtle, rgba(255,255,255,0.14)); color: var(--ink-inverse, #F4F4F2); border-radius: 4px; padding: 0.4rem 0.6rem; font-size: 0.8rem; }
  .scoping-actions button { cursor: pointer; font-weight: 600; }
  .scoping-actions button:hover { border-color: var(--accent-primary, #FF2800); color: var(--accent-primary, #FF2800); }
  .scoping-note { font-size: 0.72rem; color: var(--color-grigio-400, #9a9a9a); flex-basis: 100%; }
</style>
```

- [ ] **Step 2: Commit** (the page in Task 8 verifies the build)

```bash
git add packages/core/src/blocks/scoping/ScopingCalculator.astro
git commit -m "feat(core): ScopingCalculator interactive block"
```

---

### Task 8: Ferrari `/scoping` page + nav + gating

**Files:**
- Create: `apps/ferrari-racing/src/pages/scoping.astro`
- Modify: `apps/ferrari-racing/src/components/FerrariNav.astro`
- Modify: `apps/ferrari-racing/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add the nav item**

In `apps/ferrari-racing/src/components/FerrariNav.astro`, add to the `navItems` array (after the `The Loop` entry):

```typescript
  { en: 'Scoping', it: 'Scoping', href: '/scoping', solution: 'scoping' },
```

- [ ] **Step 2: Add the section to the deck flow**

In `apps/ferrari-racing/src/layouts/BaseLayout.astro`, add to the `SECTION_FLOW` array (after the `loop` entry, as the final section):

```javascript
    { slug: 'scoping', gate: ['scoping'] },
```

- [ ] **Step 3: Write the page**

Create `apps/ferrari-racing/src/pages/scoping.astro` (deck-style cover + assumptions slides, then the full-bleed calculator, then the disclaimer):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import FerrariNav from '../components/FerrariNav.astro';
import DeckContainer from '@edf/core/blocks/immersive/DeckContainer.astro';
import Slide from '@edf/core/blocks/immersive/Slide.astro';
import ScopingCalculator from '@edf/core/blocks/scoping/ScopingCalculator.astro';
import T from '@edf/core/blocks/i18n/T.astro';
import { href } from '@edf/core/utils/url.js';
import { SEED_SCENARIOS, ASSUMPTION_META, RIGOR_LABELS, DISCLAIMER } from '../data/scoping.ts';

const base = import.meta.env.BASE_URL;
const currentPath = Astro.url.pathname;
const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';
const site = Astro.site ? Astro.site.toString().replace(/\/$/, '') : '';
const experienceUrl = site + href(base, '/scoping');
---
<BaseLayout title="Licensing & Scoping" pageSolutions={['scoping']}>
  <div class="fixed top-0 left-0 right-0 z-50">
    <FerrariNav currentPath={currentPath} base={base} />
  </div>

  <DeckContainer nextHref={href(base, '/')}>

    <!-- SLIDE 0: Cover -->
    <Slide id="slide-cover" bg="inverse" align="center">
      <T en="LICENSING & SCOPING" it="LICENSING E SCOPING" as="p" class="slide-eyebrow text-[var(--accent-secondary)] mb-5" />
      <T as="h1" class="slide-title text-[var(--ink-inverse)] mb-6" style="font-size: clamp(2.5rem, 6vw, 5rem);"
        en="Two products.<br/>One clear estimate." it="Due prodotti.<br/>Una stima chiara." />
      <T as="p" class="slide-lead text-[var(--color-grigio-300)] max-w-3xl mx-auto"
        en="RTCDP Collaboration and CJA share the Adobe Experience Platform foundation and integrate — yet they license independently, on different metrics. Model both here."
        it="RTCDP Collaboration e CJA condividono la fondazione Adobe Experience Platform e si integrano — ma si licenziano in modo indipendente, su metriche diverse. Modellali qui." />
      <T as="p" class="slide-caption text-[var(--color-grigio-400)] mt-6 text-sm max-w-2xl mx-auto"
        en="Terminology: “Data Collaboration” here means Adobe Real-Time CDP Collaboration."
        it="Terminologia: “Data Collaboration” qui indica Adobe Real-Time CDP Collaboration." />
    </Slide>

    <!-- SLIDE 1: Assumptions & rigor -->
    <Slide id="slide-assumptions" bg="inverse" align="left">
      <T en="ASSUMPTIONS" it="ASSUNZIONI" as="p" class="slide-eyebrow text-[var(--accent-primary)] mb-4" />
      <T as="h2" class="slide-title text-[var(--ink-inverse)] mb-6" style="font-size: clamp(1.8rem, 3.6vw, 3rem);"
        en="Every number, classified." it="Ogni numero, classificato." />
      <ul class="sc-assume">
        {ASSUMPTION_META.map((m) => (
          <li class={`sc-chip sc-${m.tag}`}>
            <span class="sc-tag"><span data-lang-en>{RIGOR_LABELS[m.tag].en}</span><span data-lang-it>{RIGOR_LABELS[m.tag].it}</span></span>
            <span class="sc-txt"><span data-lang-en>{m.en}</span><span data-lang-it>{m.it}</span></span>
          </li>
        ))}
      </ul>
    </Slide>

    <!-- SLIDE 2: The calculator (full-bleed interactive; exempt from audit:deck) -->
    <Slide id="slide-calculator" bg="inverse" align="center" data-demo-flex>
      <ScopingCalculator
        projectSlug="ferrari-racing"
        supabaseUrl={SUPABASE_URL}
        supabaseAnonKey={SUPABASE_ANON_KEY}
        experienceUrl={experienceUrl}
      />
    </Slide>

    <!-- SLIDE 3: Disclaimer -->
    <Slide id="slide-disclaimer" bg="brand" align="center">
      <T en="IMPORTANT" it="IMPORTANTE" as="p" class="slide-eyebrow mb-4" />
      <T as="p" class="slide-lead max-w-3xl mx-auto" en={DISCLAIMER.en} it={DISCLAIMER.it} />
    </Slide>

  </DeckContainer>

  <script is:inline define:vars={{ seeds: SEED_SCENARIOS }}>
    // Hand the seed scenarios to the calculator island.
    window.__edfScopingSeeds = seeds;
  </script>

  <style>
    .sc-assume { display: grid; grid-template-columns: 1fr; gap: 0.5rem; max-width: 60rem; }
    @media (min-width: 768px) { .sc-assume { grid-template-columns: 1fr 1fr; } }
    .sc-chip { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.5rem 0.75rem; border-radius: 5px; border: 1px solid var(--line-subtle); background: rgba(255,255,255,0.03); }
    .sc-tag { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; }
    .sc-fact .sc-tag { color: #4ade80; }
    .sc-inference .sc-tag { color: var(--accent-secondary); }
    .sc-sales-order .sc-tag { color: var(--accent-primary); }
    .sc-txt { font-size: 0.8rem; color: var(--color-grigio-300); }
  </style>
</BaseLayout>
```

- [ ] **Step 4: Build the Ferrari app**

Run: `pnpm --filter ferrari-racing build`
Expected: build succeeds; `/scoping/` is emitted in `dist`.

- [ ] **Step 5: Typecheck**

Run: `pnpm --filter ferrari-racing typecheck`
Expected: no type errors.

- [ ] **Step 6: Manually verify in the browser**

Run: `pnpm --filter ferrari-racing dev`, open `/ferrari-racing/scoping/`. Confirm: cover + assumptions slides render; the calculator computes live (change "Hits per visit" → "CJA Rows / yr" updates); prices empty → costs show "—"; entering prices → costs appear; the scenario picker shows Conservativo/Base/Ambizioso; Reset works. (Save/Share require a logged-in Console session; without one, Save stores locally and Share prompts to log in.)

- [ ] **Step 7: Commit**

```bash
git add apps/ferrari-racing/src/pages/scoping.astro apps/ferrari-racing/src/components/FerrariNav.astro apps/ferrari-racing/src/layouts/BaseLayout.astro
git commit -m "feat(ferrari): /scoping page + nav entry + deck-flow gating"
```

---

### Task 8B: Scenario comparison view (spec §6/§7 "Confronta")

**Files:**
- Modify: `packages/core/src/blocks/scoping/ScopingCalculator.astro`

Adds a "Compare" button that renders a side-by-side table of every loaded scenario's key snapshot metrics, computed via the tested `computeSnapshot`. (Note: "Salva come…" from the spec action bar is already satisfied — **Save** always creates a new entry from the current title field, so saving under a new name is a save-as.)

- [ ] **Step 1: Add the Compare button + table markup**

In `ScopingCalculator.astro`, inside `.scoping-actions`, add a Compare button after the Reset button:

```astro
    <button data-scoping-compare><span data-lang-en>Compare</span><span data-lang-it>Confronta</span></button>
```

And after the `.scoping-actions` div (still inside `[data-scoping]`), add the table container:

```astro
  <div class="scoping-compare" data-scoping-compare-panel hidden>
    <table class="scoping-compare-table"><thead></thead><tbody></tbody></table>
  </div>
```

- [ ] **Step 2: Render the comparison in the script**

In the `<script>`, inside `initScoping`, after the Reset handler, add:

```typescript
    const comparePanel = root.querySelector<HTMLElement>('[data-scoping-compare-panel]')!;
    root.querySelector('[data-scoping-compare]')!.addEventListener('click', () => {
      if (!scenarios.length) { note.textContent = 'No scenarios to compare yet.'; return; }
      const rows: Array<[string, (s: ReturnType<typeof computeSnapshot>) => string]> = [
        ['Billable credits', (s) => fmt(s.collabBillableCredits)],
        ['Collab cost', (s) => fmtMoney(s.collabCost)],
        ['CJA rows / yr', (s) => fmt(s.cjaRowsPerYear)],
        ['Ingestion limit (3×)', (s) => fmt(s.cjaAnnualIngestionLimit)],
        ['CJA cost', (s) => fmtMoney(s.cjaCost)],
        ['Total', (s) => fmtMoney(s.totalCost)],
      ];
      const snaps = scenarios.map((sc) => ({
        title: sc.title,
        snap: computeSnapshot({ ...DEFAULT_ASSUMPTIONS, ...sc.assumptions }, { ...DEFAULT_PRICES, ...sc.prices }),
      }));
      const thead = comparePanel.querySelector('thead')!;
      const tbody = comparePanel.querySelector('tbody')!;
      thead.innerHTML = '<tr><th></th>' + snaps.map((x) => `<th>${x.title}</th>`).join('') + '</tr>';
      tbody.innerHTML = rows
        .map(([label, f]) => `<tr><td>${label}</td>` + snaps.map((x) => `<td>${f(x.snap)}</td>`).join('') + '</tr>')
        .join('');
      comparePanel.hidden = false;
    });
```

- [ ] **Step 3: Style the table**

In the component `<style>`, add:

```css
  .scoping-compare { overflow-x: auto; }
  .scoping-compare-table { width: 100%; border-collapse: collapse; font-size: 0.75rem; color: var(--color-grigio-300, #cfcfcf); }
  .scoping-compare-table th, .scoping-compare-table td { border: 1px solid var(--line-subtle, rgba(255,255,255,0.12)); padding: 0.4rem 0.6rem; text-align: right; }
  .scoping-compare-table th:first-child, .scoping-compare-table td:first-child { text-align: left; color: var(--ink-inverse, #F4F4F2); }
  .scoping-compare-table thead th { color: var(--accent-secondary, #FFF200); }
```

- [ ] **Step 4: Build + manual check**

Run: `pnpm --filter ferrari-racing build`
Expected: build succeeds. In the browser, load `/ferrari-racing/scoping/`, click **Compare** → a table lists Conservativo/Base/Ambizioso side by side with their metrics.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/blocks/scoping/ScopingCalculator.astro
git commit -m "feat(core): scenario comparison table in scoping calculator"
```

---

### Task 9: Register the `scoping` solution in the Admin registries

**Files:**
- Modify: `apps/ferrari-racing/src/pages/admin.astro`

- [ ] **Step 1: Add the solution definition**

In `apps/ferrari-racing/src/pages/admin.astro`, add to the `SOLUTIONS` array a new entry (new pillar `scoping` so it groups on its own):

```typescript
  { id: 'scoping', name: 'Licensing & Scoping', shortName: 'Scoping', pillar: 'scoping', description: 'Calcolatore di volumi e costi di licenza (Collaboration Credits + CJA Rows of Data) con scenari salvabili e condivisibili.', appearsIn: ['Scoping'] },
```

- [ ] **Step 2: Register the pillar label/color/order**

In the same file, extend the pillar maps so the new solution renders:

```typescript
const PILLAR_LABELS: Record<string, string> = { foundation: 'Foundation', data: 'Data Collaboration', content: 'Content', analytics: 'Analytics', scoping: 'Licensing' };
const PILLAR_ORDER = ['foundation', 'data', 'content', 'analytics', 'scoping'];
const PILLAR_COLORS: Record<string, string> = { foundation: '#FF2800', data: '#2563eb', content: '#ea580c', analytics: '#0891b2', scoping: '#FFF200' };
```

- [ ] **Step 3: Add the page to `PAGE_REGISTRY`**

In the same file, add to `PAGE_REGISTRY` (after the `loop` entry):

```typescript
  { slug: 'scoping', label: 'Licensing & Scoping (08)', slides: [
    { id: 'slide-cover', label: 'Cover' },
    { id: 'slide-assumptions', label: 'Assunzioni & rigore' },
    { id: 'slide-calculator', label: 'Calcolatore' },
    { id: 'slide-disclaimer', label: 'Disclaimer' },
  ]},
```

- [ ] **Step 4: Build the Ferrari app to confirm the registries compile**

Run: `pnpm --filter ferrari-racing build`
Expected: build succeeds; the Admin page lists the `Scoping` solution and section.

- [ ] **Step 5: Commit**

```bash
git add apps/ferrari-racing/src/pages/admin.astro
git commit -m "feat(ferrari): register scoping solution + page in Admin registries"
```

---

### Task 10: Admin "Licensing model" baseline tab (config-driven)

**Files:**
- Modify: `packages/core/src/blocks/admin/AdminConsole.astro`

The tab lets an admin set **baseline assumptions + optional baseline prices** that prefill a fresh calculator (stored in `localStorage['edf:scoping-baseline:<slug>']`, read by the calculator when no seed/shared scenario applies), and lists the admin's own saved scenarios with a delete control. It is gated behind a new optional prop so only Ferrari surfaces it.

- [ ] **Step 1: Add the opt-in prop**

In `AdminConsole.astro`'s `Props` interface, add:

```typescript
  showScopingTab?: boolean;
```

And in the destructured props (near `supabaseAnonKey: SUPABASE_ANON_KEY = ''`), add:

```typescript
  showScopingTab = false,
```

- [ ] **Step 2: Add the tab button**

Find the tab bar (the `.admin-tab` buttons). Add, after the last existing tab button, a conditional tab:

```astro
  {showScopingTab && (
    <button class="admin-tab" data-tab="scoping" role="tab" aria-selected="false">
      Modello di licensing
    </button>
  )}
```

- [ ] **Step 3: Add the tab panel**

After the last existing tab panel, add:

```astro
  {showScopingTab && (
    <section class="admin-panel" data-panel="scoping" hidden>
      <h2 class="admin-h2">Baseline di licensing & scoping</h2>
      <p class="admin-help">Questi valori pre-compilano un calcolatore nuovo. I prezzi restano opzionali (quote-only) e non vengono mai hardcoded nel codice.</p>
      <div class="admin-scoping-grid">
        <label>Prezzo per credito<input type="number" step="0.01" data-scoping-baseline="pricePerCredit" placeholder="—" /></label>
        <label>Prezzo per 1M righe<input type="number" step="0.01" data-scoping-baseline="pricePerMillionRows" placeholder="—" /></label>
        <label>Partner (baseline)<input type="number" data-scoping-baseline="partners" /></label>
        <label>Audience distinta<input type="number" data-scoping-baseline="audienceSize" /></label>
        <label>Attivazioni / anno<input type="number" data-scoping-baseline="activationsPerYear" /></label>
      </div>
      <button class="admin-btn" data-scoping-baseline-save>Salva baseline</button>
      <span class="admin-note" data-scoping-baseline-note></span>
    </section>
  )}
```

- [ ] **Step 4: Wire the baseline persistence in the inline script**

In the `<script is:inline …>` block (which already has `projectSlug` in scope via `define:vars`), add near the end of the `DOMContentLoaded` handler:

```javascript
    // ── Scoping baseline (optional tab) ──────────────────────
    var scopingKey = 'edf:scoping-baseline:' + projectSlug;
    var scopingInputs = document.querySelectorAll('[data-scoping-baseline]');
    if (scopingInputs.length) {
      var saved = {};
      try { saved = JSON.parse(localStorage.getItem(scopingKey) || '{}'); } catch (e) {}
      scopingInputs.forEach(function (el) {
        var k = el.getAttribute('data-scoping-baseline');
        if (saved[k] != null) el.value = saved[k];
      });
      var sBtn = document.querySelector('[data-scoping-baseline-save]');
      var sNote = document.querySelector('[data-scoping-baseline-note]');
      if (sBtn) sBtn.addEventListener('click', function () {
        var out = {};
        scopingInputs.forEach(function (el) { if (el.value !== '') out[el.getAttribute('data-scoping-baseline')] = Number(el.value); });
        localStorage.setItem(scopingKey, JSON.stringify(out));
        if (sNote) sNote.textContent = 'Baseline salvata.';
      });
    }
```

- [ ] **Step 5: Make the calculator honor the baseline**

In `packages/core/src/blocks/scoping/ScopingCalculator.astro`, in the boot section of the `<script>`, just before `if (scenarios[0])`, read the baseline as the fallback default:

```typescript
    try {
      const baseline = JSON.parse(localStorage.getItem('edf:scoping-baseline:' + ctx.projectSlug) || '{}');
      if (baseline.pricePerCredit != null) prices.pricePerCredit = baseline.pricePerCredit;
      if (baseline.pricePerMillionRows != null) prices.pricePerMillionRows = baseline.pricePerMillionRows;
      ['partners','audienceSize','activationsPerYear'].forEach((k) => {
        if (baseline[k] != null) (assumptions as any)[k] = baseline[k];
      });
    } catch {}
```

- [ ] **Step 6: Opt Ferrari in**

In `apps/ferrari-racing/src/pages/admin.astro`, add `showScopingTab` to the `<AdminConsole … />` props:

```astro
    showScopingTab={true}
```

- [ ] **Step 7: Build both surfaces**

Run: `pnpm --filter ferrari-racing build`
Expected: build succeeds; the Admin page shows the "Modello di licensing" tab.

- [ ] **Step 8: Verify no regression to other experiences**

Run: `pnpm --filter unicredit-engagement build && pnpm --filter generazioni-maxmara build`
Expected: both still build (the new tab is opt-in via `showScopingTab`, default `false`, so their Admin is unchanged).

- [ ] **Step 9: Commit**

```bash
git add packages/core/src/blocks/admin/AdminConsole.astro packages/core/src/blocks/scoping/ScopingCalculator.astro apps/ferrari-racing/src/pages/admin.astro
git commit -m "feat(admin): opt-in Licensing model baseline tab + calculator prefill"
```

---

### Task 11: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the core unit tests**

Run: `pnpm --filter @agargiulo-adbe/experience-core test`
Expected: PASS (cost-model + scenario suites).

- [ ] **Step 2: Typecheck the whole workspace**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: no new errors in the created files.

- [ ] **Step 4: Deck audit (narrative slides must still pass)**

Run: `pnpm --filter ferrari-racing audit:deck`
Expected: PASS for cover/assumptions/disclaimer slides. The `slide-calculator` is an interactive `data-demo-flex` island and may scroll internally — if the audit flags only that slide's internal scroll, that is expected per the spec (calculator is exempt); confirm no OTHER slide regressed. If the audit tool has no per-slide exemption, note the calculator slide in its known-exceptions the same way `factory-showcase` is excluded.

- [ ] **Step 5: Build all apps**

Run: `pnpm build`
Expected: every app builds; merged artifact includes `/ferrari-racing/scoping/`.

- [ ] **Step 6: Final manual smoke (logged-in path)**

With a Console login active (`localStorage['edf:sb-session']` present after applying migration 0004 remotely), on `/ferrari-racing/scoping/`: Save a scenario (persists), set visibility → Share (copies `?scenario=<uuid>`), open that URL in a fresh tab → the scenario loads. Toggle the `scoping` solution off in the Admin → the Scoping nav entry and section disappear and arrow-nav skips it.

- [ ] **Step 7: Commit any audit-exception note, then push**

```bash
git add -A
git commit -m "chore(ferrari): verification pass for scoping calculator" --allow-empty
git push
```

---

## Notes for the implementer

- **Applying migration 0004 to the remote DB is manual** (like `media_configs`): `supabase db query --linked < supabase/migrations/0004_scenarios.sql` or paste into the SQL editor. The FE degrades gracefully without it (local scenarios still work; remote save shows an error note).
- **Prices are never hardcoded.** If you feel the urge to add a "default price", stop — both products are quote-only (spec §3.4, §3.2).
- **Fact vs inference labeling** is a product requirement, not decoration — keep the `scoping-so` (Sales Order) and assumption chips intact.
- **Do not** try to make the calculator slide pass the keynote no-scroll audit by cramming inputs; it is intentionally an app-like island (spec §6, user decision 2026-07-13).
- **CJA add-on line items deferred (per spec §11).** Extended Data Capacity, Additional Ingestion Capacity, Total Monthly Report Requests (per 1,000), and Concurrent Report Requests are intentionally NOT modeled as first-class calculator inputs in v1 — spec §11 scopes them as optional annotations, not core inputs. The two headline metrics (Collaboration Credits + CJA Rows of Data) plus the Collaboration additional-credits allotment logic are the v1 model. If a future iteration needs them, add each as a `{ quantity, pricePerUnit }` line item summed into `total_cost` — the `computeSnapshot` shape already isolates the two headline costs so add-ons slot in additively.
