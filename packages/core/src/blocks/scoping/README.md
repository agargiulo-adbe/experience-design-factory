# Scoping calculator — architecture & extension guide

A reusable, licence-scoping calculator for **Adobe Real-Time CDP Collaboration**
(activity-based *Collaboration Credits*) and **Customer Journey Analytics**
(*Rows of Data*). Two logically independent products, modelled side by side.

Design principle: **no magic numbers.** Every output exposes its formula, the
substituted numbers and the inputs it used; every input declares its semantic
data-type (official constant vs assumption vs quote-only price).

## Layers (strict separation)

| File | Responsibility |
|---|---|
| `cost-model.ts` | Pure calculation engine. Types, the audience funnel, credit parts, CJA rows, `computeSnapshot`, `computeBreakdown`, `buildWarnings`. Framework-free, fully unit-tested. |
| `scenario.ts` | `DEFAULT_ASSUMPTIONS`, `DEFAULT_PRICES`, preset ids/labels, serialize/deserialize (forward-compatible: old payloads inherit new-field defaults). |
| `scenario-store.ts` | Persistence — localStorage (anonymous) + Supabase (`scenarios` table, share links). |
| `ScopingCalculator.astro` | UI shell + presenter (vanilla TS island): results bar, preset chips, warnings, breakdown drawers, scenario/save/share/compare/export, click-tooltips. |
| `ScopingField.astro` | One input row (label + semantic badge + audit tooltip + number/select). |
| *app* `data/scoping.ts` | **Client-specific content**: `FIELD_AUDIT` registry, `SEED_SCENARIOS` (presets), `METRICS`, `DISCLAIMER`. This is the only file most changes touch. |

> The `.scoping-*` CSS lives in `ScopingCalculator.astro` as `<style is:global>`
> because the field markup is rendered by the `ScopingField` sub-component
> (Astro scopes `<style>` per component). All selectors are `.scoping-`-prefixed
> and only load on `/scoping/`, so there is no global leakage.

## Calculation model (RTCDP Collaboration)

Audience funnel (rates clamped to [0,1]):

```
distinct  = audienceSize
overlap   = distinct × partnerOverlapRate
activated = overlap  × activatedOverlapRate     (per run)
measured  = overlap  × measuredOverlapRate
```

Managed volume base is selectable:

```
managedVolume = full ? distinct : overlap ? overlap : customManagedVolume
```

Credit parts (activity mode; `direct` mode uses `directCredits` verbatim):

```
management  = managedAudiences × (managedVolume ÷ 1M) × refreshes/yr × creditPerMgmtPerMillionRefresh
insights    = insightsRunsPerYear × creditPerInsight
activation  = activationRuns × (activated ÷ 1M) × creditPerActivationPerMillion
measurement = records-based | report-based | hybrid | none        (see below)

estimated   = management + insights + activation + measurement
billable    = max(0, estimated − packageAllotment)               (Prime 2,500 · Ultimate 5,000)
cost        = billable × pricePerCredit
```

**Anti double-count guardrail** — `activationRuns` depends on `activationMode`:
`on-demand` → `onDemandRuns`; `recurring` → `recurringRunsPerYear`;
`mixed` → their **sum** (the only case they are added). If both are set but the
mode is not `mixed`, `buildWarnings` emits `activation-double-count`.

Measurement:

```
records → measurementRunsPerYear × (measured ÷ 1M) × creditPerMeasurementPerMillion
reports → reportsPerYear × creditPerReport
hybrid  → records + reports
none    → 0
```

## Calculation model (CJA)

```
web    = webVisitsPerYear × webHitsPerVisit
app    = appMau × appEventsPerMauPerMonth × 12
social = socialAudience × socialActivePct × socialActionsPerActivePerMonth × 12
crm    = crmProfiles × crmEventsPerProfilePerYear
events = eventsRowsPerYear
rows   = Σ(web, app, social, crm, events)
ingestionLimit = rows × cjaIngestionMultiplier      (official guardrail = 3)
cost   = (rows ÷ 1M) × pricePerMillionRows
```

`computeBreakdown` also returns `cjaSources[]` with each source's rows, weight %
and substituted formula (the per-source bars in the drawer).

## How to…

### Add a new variable
1. Add the field to `ScopingAssumptions` in `cost-model.ts` and a default in
   `DEFAULT_ASSUMPTIONS` (`scenario.ts`). Old saved scenarios inherit it.
2. Use it in the relevant part of `collabParts` / `cjaSourceRows`, and add a
   `LineItem` (formula + `substituted`) in `computeBreakdown` if it drives an output.
3. Register it in the app's `FIELD_AUDIT` with `group`, `section`, `label`,
   `format`, `dataType`, `category`, bilingual `source/calc/assumption`, and —
   if conditional — `mode`, `appliesWhen` (`'key=v1|v2'`) and/or `advancedOnly`.
4. Add a unit test in `cost-model.test.ts`.

### Add a select (enumerated) input
Set `input: 'select'` + `options: [{ value, label:{en,it} }]` in the registry.
The presenter treats every `<select>` as a string-valued control automatically.

### Add a new RTCDP activity
Add its inputs (per the steps above), compute its credits in `collabParts`,
include it in `estimated`, and push a `LineItem` in `computeBreakdown.collab`.

### Add a new CJA source
Extend `CjaSourceRows['id']`, add a row in `cjaSourceRows`, a formula in
`CJA_SOURCE_FORMULA` + a `cjaSourceSubstituted` case, and register its input
field(s) in `FIELD_AUDIT` under a new `section`.

### Add a guardrail warning
Push a `Warning` in `buildWarnings` (`level: 'warn' | 'info'`, bilingual `text`,
`inputsUsed`). It renders automatically in the warnings strip.

### Localize labels
All user-facing strings are `{ en, it }`. Field labels/audit text live in the
app's `FIELD_AUDIT`; generic product strings live in the components. The active
language follows `document.documentElement[data-lang]` (the `LangToggle`).

## Semantic data-types (badges)
`official` (Adobe constant) · `default-assumption` (internal default) ·
`customer-assumption` (client to confirm) · `price` (quote-only). Rendered as
coloured badges and used to communicate confidence at a glance.

## Tests
`pnpm --filter @agargiulo-adbe/experience-core exec vitest run src/blocks/scoping`
covers the funnel, refresh-cadence scaling, the double-count guardrail, each
measurement model, per-source rows, breakdown substitution, warnings and the
serialize/deserialize round-trip.

## Known limitations / next steps
- **Per-partner matrix**: partners are modelled as a global average
  (`partnerOverlapRate`, `managedAudiences`). A per-partner overlap/activation
  matrix is the natural next step (registry + engine already support it via a
  partner loop).
- **Sensitivity / tornado**: the breakdown exposes each driver's contribution;
  a tornado chart of cost drivers is a UI-only addition.
- **Credit burn-rates & unit prices are illustrative** (quote-only) — replace
  with the Sales Order. They are flagged `price` / “Quote-only” in the UI.
- **PDF export**: JSON + CSV ship today; PDF is best handled via browser print.
