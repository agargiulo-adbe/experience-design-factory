# Ferrari — Licensing & Scoping Calculator (RTCDP Collaboration + CJA)

**Date:** 2026-07-13
**Experience:** `apps/ferrari-racing` ("Pole Position")
**New route:** `/scoping` — EN *"Licensing & Scoping"* / IT *"Licensing e Scoping"*
**Status:** Design approved (2026-07-13); ready for implementation plan.

---

## 1. Purpose

A customer-facing, interactive page nested in the Ferrari experience that lets a user model
the **license volumes and cost** of **Adobe Real-Time CDP Collaboration** and **Adobe Customer
Journey Analytics (CJA)** for Ferrari, under explicit, editable assumptions. Users enter their
own **unit prices** (both products are quote-only — see §3) to obtain a cost estimate, build
**multiple named scenarios**, **save them persistently** against their logged-in identity, and
**share** them (private / link / team). Because scenarios are customer-facing, UX/UI/copy must
match the Ferrari experience exactly.

This spec covers a single cohesive feature with a sequential build order (§10). It is scoped
for one implementation plan.

## 2. Terminology note (carried into the UI)

Per the source brief, **"Data Collaboration" = Adobe Real-Time CDP Collaboration**. The page
shows a short "Possibili ambiguità terminologiche / Terminology" note stating this, so the
customer never conflates it with a generic capability.

## 3. Documented facts that shape the model

Separated into **facts** (sourced) and **inferences** (reasoned), per the source brief's rigor rules.

### 3.1 RTCDP Collaboration — FACTS
- **License metric = Collaboration Credits** (Product Description, helpx.adobe.com/legal).
- **Credit-consuming activities** (Experience League "Track your credit consumption activity",
  updated 2025-09-30): **Audience Management** (function of # IDs indexed × indexing cadence —
  daily / every 3 days / weekly), **Activation – Audience Access (Once)**, **Activation –
  Audience Access (Recurring)**, **Activation – Audience Egress (Once)**, **Activation –
  Audience Egress (Recurring)** (egress charged to the receiving collaborator), **Measurement**
  (function of # rows in campaign reports × reporting cadence).
- **One-time bundled allotments** inside broader RT-CDP packages: **2,500 credits (Prime)**,
  **5,000 credits (Ultimate)**; beyond the allotment a **separate Sales Order** for additional
  Collaboration Credits is required.
- **Overage model** = commercial **re-scope / true-up** ("Rescoped Entitlement"), not a
  documented hard stop.

### 3.2 RTCDP Collaboration — INFERENCE / TO CONFIRM
- **No public per-credit "burn rate."** Adobe states consumption is a function of scale ×
  cadence but publishes **no coefficients**. → The calculator must NOT hardcode a credit rate;
  activity→credit coefficients are **user inputs** (default blank, labeled "da Sales Order /
  Credit Consumption Table").
- "Audience insights / overlaps" is **not** a separately named billable line; likely billed
  under **Measurement** — treat as inference.

### 3.3 CJA — FACTS
- **License metric = Rows of Data**; **1 row = 0.25 KB** in CJA format (overusage measured
  quarterly). CJA Product Description.
- Capacity/guardrail concepts (Product Description + Experience League "CJA Guardrails",
  updated 2026-06-05):
  - **Core Data** — Rows with timestamp **< 13 months**; the base licensed reportable window.
  - **Historical Data** — Rows **older than 13 months**; needs the **Extended Data Capacity**
    add-on.
  - **Annual Ingestion Limit** — may cumulatively ingest **up to 3× licensed data / year**.
  - **Additional Ingestion Capacity** — Sales-Order add-on to raise ingestion/row allowance.
  - **Data Lake Storage** — ingestion/yr ≤ 3× total authorized storage.
  - **Total Monthly Report Requests** — overage licensed in quantities of **1,000**.
  - **Concurrent Report Requests** — simultaneous requests; expandable via add-on.

### 3.4 CJA — pricing
- **No official list price, no public per-row price, no public SKUs.** Quote-only. →
  unit price is a **user input**; ship no default price.

### 3.5 Relationship verdict (FACT + strong inference)
- Shared **AEP foundation** (fact). **Technical integration** exists: audiences discovered in
  CJA can be published to **Real-Time Customer Profile** (via shared AEP), downstream usable in
  activation — *not* CJA → the Collaboration app directly (fact).
- **Different license metrics** (Collaboration Credits vs Rows of Data) — fact.
- **No direct licensing dependency; each bought independently** — strong reasoned inference
  (two self-contained Product Descriptions; neither names the other as prerequisite).
- **UI consequence:** the page presents the two products as **independent**, explicitly
  countering the "integration = dependency" error.

### 3.6 Ferrari volume assumptions (ALL INFERENCE — seed defaults for the 3 scenarios)
Sourced footprint (facts): F1 global fans ~826.5M (Nielsen 2024); Scuderia social aggregate
~35M (IG ~21M); Ferrari brand IG ~32M + FB ~16.5M; ferrari.com ~2.7M visits/mo (Similarweb);
~38–40 partners, ~5–7 data-relevant (HP, Shell, UniCredit, IBM, AWS, CEVA, PUMA); UniCredit
multi-year from Jan 2025. **App MAU/downloads and CRM/newsletter size are NOT public** →
flagged "client to confirm"; they dominate the CJA estimate.

Derived seed scenarios (inference, explicit arithmetic lives in the calculator's editable fields):

| Scenario | CJA Rows/yr | Collab partners / distinct audience / activations per yr |
|---|---|---|
| **Conservativo / Conservative** | ~0.32B | 2 / 5M / 12 |
| **Base** | ~1.15B | 5 / 15M / 24 |
| **Ambizioso / Ambitious** | ~3.6B | 10 / 40M / 52 |

## 4. Cost model

Costs appear **only** when the user enters unit prices; license **quantities** are always
computed from assumptions.

### 4.1 RTCDP Collaboration
- Input modes (toggle):
  - **Direct:** user enters total annual Collaboration Credits (from scoping / Sales Order).
  - **Estimate from activity:** volume drivers × **user-editable credit coefficients** per
    activity type (§3.1). Default coefficients blank with the "da Sales Order" note.
- `billable_credits = max(0, estimated_annual_credits − bundled_allotment)`
  where `bundled_allotment ∈ {0, 2500, 5000}` (None / Prime / Ultimate selector).
- `collab_cost = billable_credits × price_per_credit` (price = user input).
- Optional add-on line: additional credits.

### 4.2 CJA
- **Channel building-block estimator**: Web, App, Social, CRM, Events/eSports — each with
  **editable multipliers** → annual ingestion (rows/yr).
- **Licensed Rows of Data** (Core Data, rolling 13-month) = primary billable quantity; the
  **Annual Ingestion Limit (≤ 3× licensed)** shown as a derived **guardrail check** (warn if
  estimated ingestion > 3× licensed).
- `cja_cost = licensed_rows × price_per_million_rows / 1e6` (price = user input; unit
  "per 1M rows").
- Optional add-on line items: Extended Data Capacity, Additional Ingestion Capacity, Total
  Monthly Report Requests (per 1,000), Concurrent Report Requests — each a quantity × user price.

### 4.3 Combined
- `total_cost = collab_cost + cja_cost + add_ons`. Shown only when the relevant prices are set;
  otherwise the panel shows quantities + "prezzo da definire".

## 5. Scenario model & persistence

A **scenario** = `{ title, assumptions, unitPrices, addOns, computedSnapshot }`.

### 5.1 Supabase table (new migration `0004_scenarios.sql`)
```
public.scenarios (
  id          uuid primary key default gen_random_uuid(),
  project_slug text not null,
  title       text not null,
  payload     jsonb not null,           -- assumptions + prices + snapshot
  created_by  uuid references public.profiles(id) on delete set null,
  visibility  text not null default 'private'
              check (visibility in ('private','link','team')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
)
```
RLS (mirrors `media_configs` conventions in `0003_hardening.sql`):
- **select** using: `visibility = 'link'` OR `created_by = auth.uid()` OR
  (`visibility = 'team'` AND caller has a `user_experience_roles` row for the matching
  experience) OR `public.is_super_admin()`. (Anonymous callers can read only `link` rows.)
- **insert** to authenticated with check `created_by = auth.uid()`.
- **update/delete** using `created_by = auth.uid()` OR `public.is_super_admin()`, with check.

### 5.2 Auth
Same mechanism the Admin Console already uses: the authenticated Supabase session token lives
in `localStorage['edf:sb-session']` (written by `apps/console` login, shared same-origin).
Writes send `Authorization: Bearer <access_token>`; anonymous reads use the anon key. This is
how scenarios become "associated with the post-login user who has access to the Exp Design."

### 5.3 Sharing
- `private` — owner only.
- `link` — URL `?scenario=<uuid>` on `/scoping/` loads it (same idea as `?cfg=`), anon-readable.
- `team` — appears in a "Scenari del team / Team scenarios" list for authenticated EDF users
  with a role on the Ferrari experience.
- **Anonymous customer**: uses the calculator live; scenarios persist to `localStorage` only
  (ephemeral). A discreet banner explains that saving/sharing to the account requires an EDF
  login. Local scenarios can be pushed to the account after login.

## 6. UX / UI

Full Ferrari token set (carbonio `#0B0B0D`, Rosso Corsa `#FF2800`, giallo Modena `#FFF200`;
Archivo + Inter; dark-dominant). Bilingual via `<T en it>`. Precedent for interactive full-bleed
slides inside a deck = the existing product mockups.

Page = a deck page (`DeckContainer` + `Slide`) with:
1. **Cover slide** (deck-style, audit-compliant): title + "two independent products".
2. **Assumptions slide** (deck-style): sources, fact/inference chips, disclaimer.
3. **Calculator slide** (full-bleed **interactive, app-like** — like the mockups; internal
   scroll only where needed; **exempt from the keynote no-scroll audit**, as `factory-showcase`
   is): two product columns (inputs left, live quantities + cost right), combined total footer,
   instant recompute on edit.
4. **Scenario library + comparison**: grid of saved scenarios; open / clone / compare
   side-by-side.

Action bar: **Salva · Salva come… · Condividi · Confronta · Reset**.

Every seeded assumption carries a small label: `Fatto · fonte` / `Inferenza` /
`Da confermare (Sales Order)`.

## 7. Admin vs FE split

- **FE (`/scoping/`):** the calculator; create/save/share/compare; load shared link.
- **Admin Console — new config-driven tab "Modello di licensing / Licensing model"** (added to
  the shared `AdminConsole.astro` engine so it can propagate, but surfaced only where the
  wrapper opts in): set **baseline assumptions** and **optional baseline unit prices** that
  prefill a fresh calculator; manage team scenarios (rename, change visibility, delete,
  feature). **No prices hardcoded in source.**

## 8. Solution gating

New solution id **`scoping`** registered in Ferrari's `solutionGroups`; the page uses
`pageSolutions={['scoping']}`, nav link `data-nav-solution`, and gated slides `data-solution`
so the existing runtime hides the section and rewrites `data-deck-next` when the solution is off.

## 9. Copy & disclaimer

Ferrari tone, essential, bilingual. Fixed disclaimer, repeated on shared scenarios:
> IT: *"Stima illustrativa basata su assunzioni dichiarate e su capability pubbliche Adobe. Non
> sostituisce un Sales Order o i PSLT applicabili. Prezzi unitari da definire contrattualmente."*
> EN: *"Illustrative estimate based on stated assumptions and public Adobe capabilities. It does
> not replace a Sales Order or applicable PSLT. Unit prices to be defined contractually."*

## 10. Build order

1. **Migration + RLS** — `supabase/migrations/0004_scenarios.sql` (table + policies).
2. **Persistence/sharing client** — small module (fetch to `/rest/v1/scenarios`, token from
   `edf:sb-session`, `?scenario=` loader, localStorage fallback).
3. **Cost-model + calculator component** — pure compute functions (unit-tested) + the
   interactive full-bleed slide UI.
4. **FE page** — `apps/ferrari-racing/src/pages/scoping.astro` (deck slides 1–4) + nav +
   solution registration + `.cs-`-style tokens as needed.
5. **Admin tab** — baseline assumptions/prices + team-scenario management in `AdminConsole.astro`.
6. **Seed 3 scenarios** + responsive check (calculator exempt from `audit:deck` no-scroll;
   narrative slides must still pass).

## 11. Out of scope (YAGNI)

- Real Adobe price lists or live pricing APIs (quote-only; user-entered).
- Modeling every CJA guardrail as a first-class input (Data Lake Storage, per-person caps,
  field caps) — kept as optional annotations/add-on line items, not core inputs.
- Login UI on the Ferrari FE (auth stays in the Console; FE detects the shared session).
- Multi-currency / tax logic (single currency field; no conversion).

## 12. Open items to verify before shipping numbers

- The numeric **Collaboration Credit Consumption Table** (Sales Order / legal doc — not public).
- Exact CJA Product Description wording/version + "Additional Ingestion Capacity" clause on the
  live legal page.
- Ferrari **app MAU/downloads** and **CRM/newsletter size** (client to confirm — dominate CJA).
