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

## Calculation model (RTCDP Collaboration) — faithful to the Adobe workbook

This is a 1:1 re-implementation of Adobe's official **Real-Time CDP Collaboration
Scoping Calculator** (the "Sales Calculator" sheet + the hidden "Drop Downs, Burn,
Assump" sheet). Official constants live in `cost-model.ts` as `BURN` /
`ASSUMPTION_DEFAULTS`:

```
BURN: management 2 · activation (ad hoc) 500 · always-on 100 · measurement 50   (credits / 1M)
ASSUMPTION_DEFAULTS: match 30% · reach 50% · frequency 10× · conversion 5% · $5/credit
```

Audience funnel (rates clamped to [0,1]):

```
matched      = avgAudienceSize × matchRate
impressions  = matched × frequencyMultiple × reachPct        (per campaign)
conversions  = matched × reachPct × conversionRate           (per campaign)
```

Three estimation modes (`collabMode`):

**`detailed`** (default) — granular, unrounded:

```
management            = (onboardedIds ÷ 1M) × (365 ÷ refreshEveryXDays) × 2
activation (ad hoc)   = (matched × adHocCampaignsPerYear × audiencesPerCampaign × 500) ÷ 1M
activation (always-on)= (matched ÷ 1M) × alwaysOnRunsPerYear × 100          (0 by default)
measurement summary   = (impressions ÷ 1M) × summaryReportsPerCampaign × measuredCampaigns × 50
measurement attribut. = ((conversions + impressions) ÷ 1M) × measuredCampaigns × attributionReports × 50
estimated             = Σ the above          (measurement gated by measurementEnabled)
```

**`simple`** — the workbook's campaign-count matrix (`1·3·6·12·24·36`), refresh fixed at
every 6 days (365/6), each activity **CEILING-ed to 10** credits:

```
management  = CEILING( (onboardedIds ÷ 1M) × 2 × (365/6), 10 )
activation  = CEILING( (matched ÷ 1M) × campaigns × 500, 10 )
measurement = CEILING( (impressions + conversions) ÷ 1M × 50 × measurementEnabled, 10 )
```

**`direct`** — `estimated = max(0, directCredits)`.

**No annual allotment, no list prices.** The deliverable is a **recommended credit
pack** — the total rounded UP by tier (workbook Sales Calc row 31) — as a VOLUME.
Perimeter = 1 Ferrari instance + N partner instances (all standalone). The monetary
cost is a user-set hypothesis, not derived from Adobe prices:

```
recommendedPack = total → CEILING(100|500|1,000|5,000 by magnitude)
totalCost       = ferrariInstanceCost + partnerInstances × partnerInstanceCost   (editable)
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
```
CJA is a VOLUME only (Rows of Data) — no separate cost is modelled.

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
**reconciles cell-by-cell to the Adobe workbook**: the burn/assumption constants,
`ceilingTo`/`recommendedCreditPack`, the funnel, the DETAILED line items
(1216.67 / 150 / 75 / 75.375 → 1517.04, workbook C67–C72), the SIMPLE matrix totals
(`[1450, 1900, 2580, 3930, 6630, 9340]`, row 30) and pack tiers
(`[1500, 2000, 3000, 4000, 7000, 9500]`, row 31), plus CJA per-source rows,
snapshot/cost, breakdown substitution, warnings and the (de)serialize round-trip.

## Known limitations / next steps
- **Per-partner matrix**: the audience is a single global average (`matchRate`,
  `avgAudienceSize`). A per-partner overlap/activation matrix is the natural next step.
- **Always-on activation** (`alwaysOnRunsPerYear`, burn 100) is wired but latent
  in the workbook (defaults to 0) — set it for a weekly always-on programme.
- **Unit price** is the workbook's $5 list price; still quote-only in practice —
  replace with the Sales Order. Flagged `price` / “Quote-only” in the UI.
- **PDF export**: JSON + CSV ship today; PDF is best handled via browser print.
