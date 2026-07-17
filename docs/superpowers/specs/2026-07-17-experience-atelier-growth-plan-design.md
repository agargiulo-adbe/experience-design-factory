# Experience Atelier — Growth Plan Exp Design (design doc)

Date: 2026-07-17 · Status: approved by owner (structure, name, accent) · Audience of the
deliverable: Adobe senior leadership (Western Europe). This doc is sanitized for a public
repo: it contains no internal-only figures and no organisational context beyond what the
public deliverable itself will show.

## 1. What we are building

A new experience app in the monorepo — **`apps/atelier`**, served at
`/experience-design-factory/atelier/` — an immersive **trilingual** deck (**EN default,
IT and FR toggle** — the first three-language experience; FR is deliberate for a
Paris-based audience and itself demonstrates the multilingual capability) that presents:

1. the Experience Design Factory project itself (origin, method, compliance evidence);
2. a 3‑milestone growth plan (2 / 6 / 9 months → mid‑Sep 2026, mid‑Jan 2027, mid‑Apr 2027);
3. an extended KPI framework;
4. the resources/sponsorship asked for;
5. the rebrand: **Experience Design Factory → “Experience Atelier”** (presentation layer
   only — repo, slugs, `@edf/core`, URLs, localStorage keys unchanged).

Built on the shared engine (`DeckContainer`/`Slide`, solution gating, admin wrapper,
`T`/`LangToggle`), registered in factory-hub, in factory-showcase (data-driven from
`experiences.ts`) and in the Super Admin Console registry. Full deck contract applies: 12 audit checks at
1920/1440/1280, type & legibility contract, `nextHref`/`prevHref`, WCAG 2.2 AA.

**Dual-mode requirement:** the deck must work presented live AND forwarded cold (no
presenter). Every interactive moment is self-explanatory with guided annotation; no
moment depends on a human in the room.

## 2. Narrative arc — 8 sections (enablement-first, “B + best of C”)

1. **Overture** — cold open on the fact: “Six enterprise-grade experiences. Five brands.
   One Adobian, paired with AI.” Interactive wall of the six live experiences
   (screenshots → real deck links). The wow is reality, not mockups.
2. **How it was built** — genesis + method (human+AI pairing with an Adobe-approved
   enterprise AI assistant) and the **compliance section with evidence**: only public
   Adobe capabilities, zero reserved client IP, licensed stock assets with tracked
   provenance (`provenance.json`), zero secrets in the repo, WCAG AA, public repo =
   auditable by anyone. Each claim paired with its proof.
3. **The capability** — anatomy: one engine, N skins, config-driven Admin Console, i18n,
   automated quality gates. **Interactive moment #1:** a guided solution-toggle that
   shows the deck reconfiguring itself.
4. **The multiplication** — the pivot: from project to workforce capability. What happens
   when 50 BDR/AE/SC create experiences autonomously. Research-backed comparables: the
   demo-experience-platform category (Reprise, Demostack, Walnut, Consensus), SAP's
   pre-sales serious games, sales-workforce AI enablement cases. Every figure sourced
   and dated.
5. **New frontiers** — product evolutions: real Adobe product interaction inside
   experiences (personalized demos, Firefly image/video generation embedded) +
   **Boardroom Quest spotlight** (facilitated serious game for C-level workshops;
   pixel-art teaser; SAP precedent as validation; brand/legal review explicitly part of
   the plan, before any official workshop use).
6. **The plan** — the 3 milestones (below), each with measurable results.
7. **What it takes** — the asks (below), ordered so executive sponsorship closes.
8. **Closing** — thesis recap + one concrete next step (M1 pilot).

## 3. The 3 milestones

**M1 — Foundations (→ mid-Sep 2026).** Personal project → pilot-ready platform:
multi-user hardening + CI quality gates; pilot with 5–10 Adobe Italia BDR/AE creating a
first experience via guided intake (`skills/experience-brief`); **Adobe Context Layer
v1** — product catalog/positioning/limits/roadmap as versioned content validated by
Solution Consultants; Boardroom Quest walking skeleton; rebrand rollout (presentation
layer); KPI telemetry baseline.
*Measurable:* time-to-first-experience < 1 week for a pilot user; ≥ 3 pilot-created
experiences; KPI baseline instrumented.

**M2 — Scale & open (→ mid-Jan 2027).** Ecosystem opening: 2–3 Adobe Partners co-build
joint Exp Designs (external access → auth hardening); 25–40 active users with template
gallery + self-service wizard; real embedded demos (Firefly/GenStudio); Boardroom Quest
facilitated beta + first real workshop; Hackathon day #1 (Adobians + partners + clients).
*Measurable:* ≥ 10 experiences used in active deals; ≥ 2 partner co-signed experiences;
1 Boardroom Quest workshop delivered with debrief.

**M3 — Enterprise & lighthouse (→ mid-Apr 2027).** Enterprise grade: federated SSO,
audit logs, security review, data governance; expansion beyond Italy (EMEA); Boardroom
Quest multiplayer + second content pack; **Adobe Summit 2027 (Mar 22–25, Las Vegas)** as
lighthouse moment (demo pod / session).
*Measurable:* ≥ 100 enabled users; influenced pipeline tracked in €; Summit presence
confirmed; project institutionalized (team, budget line, roadmap governance).

## 4. KPI framework — 4 families, targets per milestone

1. **GTM velocity** — brief-to-experience time (hours vs weeks), # experiences in active
   deals, influenced pipeline (€), win-rate delta, **deal-size delta** on deals with an
   experience.
2. **Workforce enablement** — # enabled Adobians, **% creating fully autonomously**,
   time-to-first-experience, enablement hours delivered, internal NPS.
3. **Ecosystem** — # partners onboarded, # joint experiences, partner-sourced pipeline.
4. **Platform health & trust** — uptime, audit pass rate, WCAG AA, Adobe Context Layer
   freshness (days since last product-roadmap sync), compliance incidents = 0.

Each milestone declares explicit targets on all four families — the plan is falsifiable.

## 5. The asks (reasoned)

- **Enterprise AI licenses, tiered** — top tier only for core builders, mid tier for
  power creators, standard tier for pilot BDRs (guided flows, low consumption). Framing:
  usage-based billing, caps are ceilings not quotas → the real ask is smaller than the
  nominal one. **Public-artifact rule: the deck presents tier structure + an annual
  budget envelope; it does NOT reproduce internal price lists.**
- **Infra & tooling** — Supabase Pro, hosting, asset licenses, CI runners (~€5–10k/yr):
  a deliberately small line that demonstrates leverage.
- **Sponsored time** — official project-lead allocation (~50%), Solution Consultant
  hours for the Adobe Context Layer, one professional design review.
- **Brand/legal review** — sponsorship of the trademark/brand review path for Boardroom
  Quest before its first official workshop.
- **Hackathon day** (M2) — event budget.
- **Adobe Summit 2027** (M3) — demo pod + speaking submission.
- **Executive sponsorship** — a named executive sponsor, 30-min monthly steering. The
  most important ask and the cheapest; it closes the deck.

## 6. Rebrand decision (recorded)

**Experience Atelier** — chosen by the owner from a shortlist (vs “Experience Forge”,
vs keeping “Experience Design Factory”). Rationale: shifts from factory (volume,
impersonal) to atelier (human mastery amplified by AI, made-to-measure); coherent with
the client roster (Max Mara, Ferrari); works in EN/IT/FR. Names containing “Studio” were
excluded (collision with Adobe product naming, e.g. GenStudio). Tagline direction:
*“Where one person crafts what used to take a team.”*
Scope: presentation layer only. No renaming of repo, app slugs, packages, public URLs,
or storage keys.

## 7. Aesthetic — “dark editorial atelier”

Own identity, distinct from the Adobe-red showcase and all client skins:

- **Surfaces:** deep carbon/charcoal (near-black warm, e.g. `#111008` family), secondary
  elevated warm dark; inverse = warm ivory for light slides.
- **Ink:** warm ivory/platinum (`#F2EDE3` family) + a readable warm grey tier
  (slate/stone-200/300 equivalent) for body — full-strength, never opacity-dimmed.
- **Accent:** **champagne / burnished gold** (e.g. `#C9A96A` primary, deeper bronze
  secondary). Used surgically: rules, kickers, key numerals, CTA. Explicit `rgba()` for
  chrome/buttons (audit contrast parser can’t read `oklab()`/`color-mix()`).
- **Type:** serif display **Fraunces** (editorial, contemporary) + **Inter** body — a
  pairing no other experience uses. Full type & legibility contract minimums.
- Motion: restrained, `prefers-reduced-motion` respected.

Token contract in `apps/atelier/src/global.css` per the standard semantic scheme
(`--surface-*`, `--accent-*`, `--font-*`, safe-area tokens, `.cs-*` classes).

## 8. Interactive moments (self-explanatory, forwardable)

1. **Live experience wall** (Overture) — six clickable live-experience cards.
2. **Guided solution toggle** (The capability) — annotated auto-play or click-to-try
   toggle showing nav + slides + deep-links reconfigure; works without narration.
3. **Boardroom Quest teaser** (New frontiers) — visual teaser (pixel-art frame(s) /
   short loop), clearly labelled as “in design”, no fake product claims.

Each degrades gracefully: static fallback content if JS fails; nothing blocks deck nav.

## 9. Research plan (before final copy; deep-research harness)

Four strands, every claim sourced + dated, no un-defensible figures (the “Learning
Pyramid” lesson): (a) demo-experience-platform category — Reprise, Demostack, Walnut,
Consensus: funding, adoption, conversion metrics; (b) vendor pre-sales serious games —
SAP BTP Diamond Game, S/4HANA Movement (already validated in the Boardroom Quest
research doc); (c) AI enablement of commercial workforce — cases with defensible
numbers; (d) BDR + AI productivity / deal-size benchmarks. Output: a sourced fact sheet
that feeds sections 4–6 of the deck.

## 10. Confidentiality safeguards (public repo, public URL)

- No internal organisational context (names of sponsors/targets, internal objectives)
  in the deck, in this spec, or in commits.
- No internal price lists or internal wiki content verbatim; asks presented as tier
  structure + envelope.
- No reserved client IP; imagery rules per Quality Bar (no wrong-brand imagery).
- If leadership later requires figures the public page cannot carry, option recorded:
  gate the “What it takes” section behind the existing solution-gating/shared-config
  mechanism or deliver figures in a private annex — decision deferred, not blocking.

## 11. Technical scope

- **i18n engine extension (`packages/core`, backward-compatible):** `T.astro` gains an
  optional `fr` prop; `LangToggle` gains a prop-driven three-language variant. Existing
  experiences keep their two-language behaviour untouched (verify each still builds).
  Copy rule: EN, IT and FR each idiomatic, never literal echoes; FR runs ~15–20% longer —
  keep all three variants within the layout the audit validates.
- New Astro app `apps/atelier` mirroring the structure of the latest experience
  (`agos-trait-dunion` as reference): `BaseLayout.astro`, `global.css` tokens,
  `assets.manifest.ts` (Pexels pipeline, abstract atelier/craft/light imagery),
  `/admin/` thin wrapper (PAGE_REGISTRY, SOLUTIONS), page-per-section decks with
  `nextHref`/`prevHref` chain.
- Registered in: root `astro.config` deploy merge (`.github/workflows/deploy.yml`),
  factory-hub links, console `experiences` registry (new migration), showcase `experiences.ts`.
- Solution gating doubles as **section gating for audiences** (e.g. share a link with
  or without “What it takes”).
- Quality gates: `pnpm --filter atelier build` + `audit:deck` (3 viewports, 0 hard
  failures) against a static preview + 1920 screenshot read of every slide.

## 12. Out of scope (this deliverable)

- Building any of the M1–M3 platform features themselves (pilot flows, SSO, partner
  access, Boardroom Quest code) — the deck *presents* the plan; execution is separate.
- Renaming any technical identifier.
- A PPTX/PDF export (can be derived later if asked).
