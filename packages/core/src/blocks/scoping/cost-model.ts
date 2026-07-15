// ─────────────────────────────────────────────────────────────────────────
//  Scoping calculation engine — pure, deterministic, framework-free.
//
//  The Collaboration model is a faithful re-implementation of Adobe's official
//  "Real-Time CDP Collaboration Scoping Calculator" (Sales Calculator +
//  hidden "Drop Downs, Burn, Assump" sheet). It ships BOTH of the workbook's
//  scoping paths:
//    • SIMPLE  scoping — the campaign-count matrix (1·3·6·12·24·36), each
//      activity CEILING-ed to 10 credits, then a recommended credit PACK sized
//      by tier. Refresh is fixed at every 6 days (365/6 ≈ 60.83 refreshes/yr).
//    • DETAILED scoping — the granular per-input model (management + ad-hoc
//      activation + measurement summary-stats + measurement attribution),
//      unrounded, summed to a total credit volume.
//  Both consume the workbook's official BURN RATES and default ASSUMPTIONS
//  (match rate 30% · reach 50% · frequency 10× · conversion 5% · $5/credit).
//  There is NO annual allotment subtraction: the deliverable is a recommended
//  credit pack, exactly as the workbook computes it.
//
//  Customer Journey Analytics (Rows of Data) is a second, independent product
//  and is NOT part of the Adobe workbook — its model is unchanged.
//
//  Nothing is a magic number: computeBreakdown() emits, for every derived
//  value, the symbolic formula, the substituted numbers and the inputs used.
// ─────────────────────────────────────────────────────────────────────────

export type CollabMode = 'simple' | 'detailed' | 'direct';
export type MeasurementToggle = boolean;

/** How the onboarded audience refresh cadence is modelled. */
export type RefreshMode = 'continuous' | 'campaign-linked';

export interface ScopingAssumptions {
  // ── mode ──
  collabMode: CollabMode;
  directCredits: number;         // 'direct' mode: credits scoped directly

  // ── perimeter & instances (1 Ferrari instance + N partner instances) ──
  // All parties are standalone. Volumes below drive the credit VOLUME estimate;
  // the monetary cost per instance is a user-set hypothesis (see UnitPrices).
  partnerInstances: number;      // number of partner Collaboration instances (one per partner)
  partnerOnboardedIds: number;   // IDs onboarded per partner-tipo instance / yr
  partnerAvgAudienceSize: number;// average audience per partner-tipo instance
  partnerAdHocCampaignsPerYear: number; // ad-hoc campaigns per partner-tipo instance / yr

  // ── refresh mode (audience management driver) ──
  refreshMode: RefreshMode;      // continuous (always-on) or campaign-linked
  refreshesPerCampaign: number;  // campaign-linked: refreshes fired around each campaign

  // ── shared audience & funnel (workbook defaults) ──
  onboardedIds: number;          // IDs onboarded into Collaboration / yr (Sales Calc E15 / C41)
  avgAudienceSize: number;       // average audience size (C17 / C42)
  matchRate: number;             // match / overlap rate — default 0.30 (H9 / C43)
  frequencyMultiple: number;     // impressions frequency multiple — default 10 (H11 / C54)
  reachPct: number;              // reach — default 0.50 (H10 / C55)
  conversionRate: number;        // conversion rate — default 0.05 (H12 / C58)
  measurementEnabled: MeasurementToggle; // measurement use-cases yes/no (E16 / C16)

  // ── detailed scoping only ──
  refreshEveryXDays: number;     // audience refresh cadence, every X days (1–6) (C47)
  adHocCampaignsPerYear: number; // one-time (ad hoc) activation campaigns / yr (C50)
  audiencesPerCampaign: number;  // audiences targeted per campaign (C51)
  measurementCampaignsPerYear: number;   // campaigns measured / yr (C61)
  summaryReportsPerCampaign: number;     // summary-statistics reports / campaign (C62)
  attributionReportsPerCampaign: number; // attribution reports / campaign (C63)
  alwaysOnRunsPerYear: number;   // always-on (weekly) activation runs / yr — J4 (default 0, latent in workbook)

  // ── simple scoping only ──
  simpleCampaignsPerYear: number; // headline campaign count for the summary (one of the tiers)

  // ── CJA sources (independent product — unchanged) ──
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
  cjaIngestionMultiplier: number; // Annual Ingestion Limit = licensed rows × this (official guardrail = 3)
}

/** Editable, user-set cost hypotheses per Collaboration instance (no Adobe list
 *  prices are modelled). Total cost = ferrariInstanceCost + N × partnerInstanceCost. */
export interface UnitPrices {
  currency: string;
  ferrariInstanceCost: number | null;   // cost of the Ferrari instance / yr (editable)
  partnerInstanceCost: number | null;   // cost of each partner instance / yr (editable, default 0)
}

// ── Official constants — Adobe Scoping Calculator (hidden "Burn, Assump" sheet)
/** Credit burn rates (credits per 1,000,000, per the workbook's I:J table). */
export const BURN = {
  management: 2,          // J2 — Audience Transformation & Management, per 1M IDs per refresh
  activationAdHoc: 500,   // J3 — Activation (ad hoc), per 1M per campaign
  activationAlwaysOn: 100,// J4 — Always-on Activation (weekly), per 1M per run
  measurement: 50,        // J5 — Measurement (Summary Statistics & Attribution), per 1M
} as const;
/** Default modelling assumptions (workbook "Simple Scoping" G:H block). */
export const ASSUMPTION_DEFAULTS = {
  matchRate: 0.3,         // H9
  reach: 0.5,             // H10
  frequency: 10,          // H11
  conversion: 0.05,       // H12
  creditListPrice: 5,     // H13 — $ per credit (list)
} as const;
/** Simple scoping fixes the refresh at every 6 days → 365/6 refreshes/yr (C23). */
export const SIMPLE_REFRESH_DAYS = 6;
/** The campaign-count columns of the Simple Scoping matrix (C22…M22). */
export const SIMPLE_CAMPAIGN_TIERS = [1, 3, 6, 12, 24, 36] as const;
export const DAYS_PER_YEAR = 365;

// ── CJA constants (unchanged) ──
export const CJA_ROW_KB = 0.25;            // 1 Row of Data = 0.25 KB
export const DEFAULT_INGESTION_MULTIPLIER = 3;

// ── helpers ───────────────────────────────────────────────────────────────
function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.min(1, Math.max(0, x));
}
function nn(x: number): number { return Number.isFinite(x) ? Math.max(0, x) : 0; }
/** Excel CEILING(x, step) — round UP to the nearest multiple of step. */
export function ceilingTo(x: number, step: number): number {
  if (step <= 0) return x;
  return Math.ceil(x / step) * step;
}

// ── Audience funnel (workbook: matched → impressions / conversions) ─────────
export interface AudienceFunnel {
  matched: number;                // avg audience × match rate (C44 / C20)
  impressionsPerCampaign: number; // matched × frequency × reach (C56)
  conversionsPerCampaign: number; // matched × reach × conversion (C59)
}

export function audienceFunnel(a: ScopingAssumptions): AudienceFunnel {
  const matched = nn(a.avgAudienceSize) * clamp01(a.matchRate);
  return {
    matched,
    impressionsPerCampaign: matched * nn(a.frequencyMultiple) * clamp01(a.reachPct),
    conversionsPerCampaign: matched * clamp01(a.reachPct) * clamp01(a.conversionRate),
  };
}

/** Refresh cadence → refreshes per year.
 *  • continuous     → always-on hygiene: 365 / everyXDays (1–6).
 *  • campaign-linked→ refresh only around campaigns: campaigns × refreshes/campaign.
 *    (Answers the "why pay always-on refresh for 3 campaigns/yr?" objection.) */
export function refreshesPerYear(a: ScopingAssumptions): number {
  if (a.refreshMode === 'campaign-linked') {
    const campaigns = Math.max(1, Math.floor(nn(a.adHocCampaignsPerYear)));
    const perCampaign = Math.max(1, Math.floor(nn(a.refreshesPerCampaign)));
    return campaigns * perCampaign;
  }
  const days = Math.min(6, Math.max(1, Math.floor(a.refreshEveryXDays || SIMPLE_REFRESH_DAYS)));
  return DAYS_PER_YEAR / days;
}

// ── Collaboration credit parts (auditable breakdown of the estimate) ────────
export interface CollabParts {
  management: number;
  activation: number;             // ad-hoc activation
  activationAlwaysOn: number;     // always-on (weekly) — 0 by default
  measurementSummary: number;
  measurementAttribution: number;
  estimated: number;              // total credits (sum, or directCredits)
  recommendedPack: number;        // total rounded up to a credit-pack tier
}

/** Tiered pack sizing — workbook Sales Calc row 31 (nested CEILING by magnitude). */
export function recommendedCreditPack(total: number): number {
  const t = nn(total);
  if (t < 1000) return ceilingTo(t, 100);
  if (t < 10000) return ceilingTo(t, 500);
  if (t < 50000) return ceilingTo(t, 1000);
  return ceilingTo(t, 5000);
}

export function collabParts(a: ScopingAssumptions): CollabParts {
  if (a.collabMode === 'direct') {
    const estimated = nn(a.directCredits);
    return {
      management: 0, activation: 0, activationAlwaysOn: 0,
      measurementSummary: 0, measurementAttribution: 0,
      estimated, recommendedPack: recommendedCreditPack(estimated),
    };
  }

  const f = audienceFunnel(a);
  const measOn = a.measurementEnabled ? 1 : 0;

  if (a.collabMode === 'simple') {
    // Simple Scoping: fixed refresh (365/6), campaign-count driven, CEILING to 10.
    const campaigns = nn(a.simpleCampaignsPerYear) || 1;
    const refreshes = DAYS_PER_YEAR / SIMPLE_REFRESH_DAYS;
    const management = ceilingTo((nn(a.onboardedIds) / 1_000_000) * BURN.management * refreshes, 10);
    const activation = ceilingTo((f.matched / 1_000_000) * campaigns * BURN.activationAdHoc, 10);
    // impressions & conversions scale with campaign count in the matrix
    const impressions = f.matched * nn(a.frequencyMultiple) * campaigns * clamp01(a.reachPct);
    const conversions = f.matched * campaigns * clamp01(a.reachPct) * clamp01(a.conversionRate);
    const measurement = ceilingTo(((impressions + conversions) / 1_000_000) * BURN.measurement * measOn, 10);
    const estimated = management + activation + measurement;
    return {
      management, activation, activationAlwaysOn: 0,
      measurementSummary: measurement, measurementAttribution: 0,
      estimated, recommendedPack: recommendedCreditPack(estimated),
    };
  }

  // Detailed Scoping (default): granular, unrounded.
  const refreshes = refreshesPerYear(a);
  const management = (nn(a.onboardedIds) / 1_000_000) * refreshes * BURN.management;
  const activation =
    (f.matched * nn(a.adHocCampaignsPerYear) * nn(a.audiencesPerCampaign) * BURN.activationAdHoc) / 1_000_000;
  const activationAlwaysOn = (f.matched / 1_000_000) * nn(a.alwaysOnRunsPerYear) * BURN.activationAlwaysOn;
  const measurementSummary =
    (f.impressionsPerCampaign / 1_000_000) * nn(a.summaryReportsPerCampaign) * nn(a.measurementCampaignsPerYear) * BURN.measurement * measOn;
  const measurementAttribution =
    ((f.conversionsPerCampaign + f.impressionsPerCampaign) / 1_000_000) * nn(a.measurementCampaignsPerYear) * nn(a.attributionReportsPerCampaign) * BURN.measurement * measOn;
  const estimated = management + activation + activationAlwaysOn + measurementSummary + measurementAttribution;
  return {
    management, activation, activationAlwaysOn,
    measurementSummary, measurementAttribution,
    estimated, recommendedPack: recommendedCreditPack(estimated),
  };
}

export function estimateCollabCredits(a: ScopingAssumptions): number {
  return collabParts(a).estimated;
}

/** Partner-tipo assumptions: Ferrari's funnel/measurement rates, partner volumes. */
export function partnerAssumptions(a: ScopingAssumptions): ScopingAssumptions {
  return {
    ...a,
    onboardedIds: a.partnerOnboardedIds,
    avgAudienceSize: a.partnerAvgAudienceSize,
    adHocCampaignsPerYear: a.partnerAdHocCampaignsPerYear,
  };
}

// ── Simple Scoping matrix — one column per campaign tier (for the compare view)
export interface SimpleMatrixColumn {
  campaigns: number;
  management: number;
  activation: number;
  measurement: number;
  total: number;
  recommendedPack: number;
}
export function simpleScopingMatrix(a: ScopingAssumptions): SimpleMatrixColumn[] {
  return SIMPLE_CAMPAIGN_TIERS.map((campaigns) => {
    const p = collabParts({ ...a, collabMode: 'simple', simpleCampaignsPerYear: campaigns });
    return {
      campaigns,
      management: p.management,
      activation: p.activation,
      measurement: p.measurementSummary,
      total: p.estimated,
      recommendedPack: p.recommendedPack,
    };
  });
}

// ── CJA rows, per source (independent product — unchanged) ──────────────────
export interface CjaSourceRows {
  id: 'web' | 'app' | 'social' | 'crm' | 'events';
  rows: number;
}

export function cjaSourceRows(a: ScopingAssumptions): CjaSourceRows[] {
  return [
    { id: 'web', rows: a.webVisitsPerYear * a.webHitsPerVisit },
    { id: 'app', rows: a.appMau * a.appEventsPerMauPerMonth * 12 },
    { id: 'social', rows: a.socialAudience * a.socialActivePct * a.socialActionsPerActivePerMonth * 12 },
    { id: 'crm', rows: a.crmProfiles * a.crmEventsPerProfilePerYear },
    { id: 'events', rows: Math.max(0, a.eventsRowsPerYear) },
  ];
}

export function estimateCjaRows(a: ScopingAssumptions): number {
  return cjaSourceRows(a).reduce((sum, s) => sum + s.rows, 0);
}

// ── Snapshot: flat numbers the sticky results bar reads directly ────────────
export interface ScopingSnapshot {
  // funnel
  matchedAudience: number;
  impressionsPerCampaign: number;
  conversionsPerCampaign: number;
  refreshesPerYear: number;
  // ── licence VOLUMES (no money) — Ferrari instance ──
  collabManagementCredits: number;
  collabActivationCredits: number;
  collabMeasurementCredits: number;      // summary + attribution
  collabCreditsEstimated: number;        // Ferrari instance estimated credits / yr
  collabRecommendedPack: number;         // Ferrari credits rounded to a pack (volume)
  // ── partner-tipo instance (× N) ──
  partnerInstances: number;
  collabPartnerCreditsEach: number;
  collabPartnerPackEach: number;
  // ── cja volumes ──
  cjaRowsPerYear: number;
  cjaAnnualIngestionLimit: number;
  // ── COST (user-set hypotheses, no Adobe prices) ──
  ferrariInstanceCost: number | null;    // editable Ferrari instance cost
  partnerInstanceCost: number | null;    // editable per-partner instance cost
  partnerCostTotal: number | null;       // per-partner × N
  totalCost: number | null;              // Ferrari + N × partner
}

export function computeSnapshot(a: ScopingAssumptions, prices: UnitPrices): ScopingSnapshot {
  const f = audienceFunnel(a);
  const parts = collabParts(a); // Ferrari instance
  const partnerParts = collabParts(partnerAssumptions(a)); // one partner-tipo instance
  const cjaRowsPerYear = estimateCjaRows(a);
  const multiplier = a.cjaIngestionMultiplier || DEFAULT_INGESTION_MULTIPLIER;
  const N = Math.max(0, Math.floor(nn(a.partnerInstances)));

  // Cost is purely the user-set per-instance hypotheses (no Adobe list prices).
  const ferrariInstanceCost = prices.ferrariInstanceCost;
  const partnerInstanceCost = prices.partnerInstanceCost;
  const partnerCostTotal = partnerInstanceCost == null ? null : partnerInstanceCost * N;
  const totalCost =
    ferrariInstanceCost == null && partnerCostTotal == null
      ? null
      : (ferrariInstanceCost ?? 0) + (partnerCostTotal ?? 0);

  return {
    matchedAudience: f.matched,
    impressionsPerCampaign: f.impressionsPerCampaign,
    conversionsPerCampaign: f.conversionsPerCampaign,
    refreshesPerYear: refreshesPerYear(a),
    collabManagementCredits: parts.management,
    collabActivationCredits: parts.activation + parts.activationAlwaysOn,
    collabMeasurementCredits: parts.measurementSummary + parts.measurementAttribution,
    collabCreditsEstimated: parts.estimated,
    collabRecommendedPack: parts.recommendedPack,
    partnerInstances: N,
    collabPartnerCreditsEach: partnerParts.estimated,
    collabPartnerPackEach: partnerParts.recommendedPack,
    cjaRowsPerYear,
    cjaAnnualIngestionLimit: cjaRowsPerYear * multiplier,
    ferrariInstanceCost,
    partnerInstanceCost,
    partnerCostTotal,
    totalCost,
  };
}

// ── Breakdown: every derived value with formula + substituted numbers ───────
export type LineKind = 'derived' | 'output';
export interface Bilingual { en: string; it: string }

export interface LineItem {
  id: string;
  label: Bilingual;
  value: number;
  unit: 'credits' | 'rows' | 'ids' | 'eur' | 'x' | 'runs';
  formula: string;      // symbolic (language-neutral)
  substituted: string;  // numbers plugged in
  inputsUsed: string[]; // assumption keys feeding this line
  kind: LineKind;
}

export type WarningLevel = 'warn' | 'info';
export interface Warning {
  id: string;
  level: WarningLevel;
  text: Bilingual;
  inputsUsed: string[];
}

export interface ScopingBreakdown {
  collab: LineItem[];
  cja: LineItem[];
  cjaSources: { id: CjaSourceRows['id']; rows: number; weightPct: number; formula: string; substituted: string }[];
  warnings: Warning[];
}

export function computeBreakdown(a: ScopingAssumptions, prices: UnitPrices): ScopingBreakdown {
  const f = audienceFunnel(a);
  const parts = collabParts(a);
  const s = computeSnapshot(a, prices);
  const collab: LineItem[] = [];
  const push = (li: LineItem) => collab.push(li);

  if (a.collabMode === 'direct') {
    push({
      id: 'collabCreditsEstimated', label: { en: 'Scoped credits / yr', it: 'Credits scopati / anno' },
      value: parts.estimated, unit: 'credits',
      formula: 'direct credits', substituted: `${dec(parts.estimated)}`,
      inputsUsed: ['directCredits'], kind: 'output',
    });
  } else {
    const measOn = a.measurementEnabled ? 1 : 0;
    push({
      id: 'matchedAudience', label: { en: 'Matched audience', it: 'Audience matchata' },
      value: f.matched, unit: 'ids',
      formula: 'average audience × match rate',
      substituted: `${n(a.avgAudienceSize)} × ${pct(a.matchRate)} = ${n(f.matched)}`,
      inputsUsed: ['avgAudienceSize', 'matchRate'], kind: 'derived',
    });

    if (a.collabMode === 'simple') {
      const campaigns = nn(a.simpleCampaignsPerYear) || 1;
      const refreshes = DAYS_PER_YEAR / SIMPLE_REFRESH_DAYS;
      const impressions = f.matched * nn(a.frequencyMultiple) * campaigns * clamp01(a.reachPct);
      const conversions = f.matched * campaigns * clamp01(a.reachPct) * clamp01(a.conversionRate);
      push({
        id: 'managementCredits', label: { en: 'Audience management', it: 'Gestione audience' },
        value: parts.management, unit: 'credits',
        formula: 'CEILING( (onboarded IDs ÷ 1M) × mgmt burn × (365 ÷ 6), 10 )',
        substituted: `CEIL( (${n(a.onboardedIds)} ÷ 1M) × ${BURN.management} × ${dec(refreshes)} ) = ${dec(parts.management)}`,
        inputsUsed: ['onboardedIds'], kind: 'derived',
      });
      push({
        id: 'activationCredits', label: { en: 'Activation', it: 'Attivazione' },
        value: parts.activation, unit: 'credits',
        formula: 'CEILING( (matched ÷ 1M) × campaigns × activation burn, 10 )',
        substituted: `CEIL( (${n(f.matched)} ÷ 1M) × ${n(campaigns)} × ${BURN.activationAdHoc} ) = ${dec(parts.activation)}`,
        inputsUsed: ['simpleCampaignsPerYear', 'avgAudienceSize', 'matchRate'], kind: 'derived',
      });
      push({
        id: 'measurementCredits', label: { en: 'Measurement', it: 'Measurement' },
        value: parts.measurementSummary, unit: 'credits',
        formula: 'CEILING( (impressions + conversions) ÷ 1M × measurement burn × measurement?, 10 )',
        substituted: `CEIL( (${n(impressions)} + ${n(conversions)}) ÷ 1M × ${BURN.measurement} × ${measOn} ) = ${dec(parts.measurementSummary)}`,
        inputsUsed: ['measurementEnabled', 'frequencyMultiple', 'reachPct', 'conversionRate'], kind: 'derived',
      });
    } else {
      // detailed
      const refreshes = refreshesPerYear(a);
      push({
        id: 'managementCredits', label: { en: 'Audience transformation & management', it: 'Trasformazione e gestione audience' },
        value: parts.management, unit: 'credits',
        formula: a.refreshMode === 'campaign-linked'
          ? '(onboarded IDs ÷ 1M) × (campaigns × refreshes/campaign) × mgmt burn'
          : '(onboarded IDs ÷ 1M) × (365 ÷ refresh days) × mgmt burn',
        substituted: `(${n(a.onboardedIds)} ÷ 1M) × ${dec(refreshes)} × ${BURN.management} = ${dec(parts.management)}`,
        inputsUsed: a.refreshMode === 'campaign-linked'
          ? ['onboardedIds', 'refreshMode', 'adHocCampaignsPerYear', 'refreshesPerCampaign']
          : ['onboardedIds', 'refreshEveryXDays', 'refreshMode'], kind: 'derived',
      });
      push({
        id: 'activationCredits', label: { en: 'Activation — ad hoc', it: 'Attivazione — ad hoc' },
        value: parts.activation, unit: 'credits',
        formula: '(matched × campaigns × audiences/campaign × activation burn) ÷ 1M',
        substituted: `(${n(f.matched)} × ${n(a.adHocCampaignsPerYear)} × ${n(a.audiencesPerCampaign)} × ${BURN.activationAdHoc}) ÷ 1M = ${dec(parts.activation)}`,
        inputsUsed: ['adHocCampaignsPerYear', 'audiencesPerCampaign'], kind: 'derived',
      });
      if (parts.activationAlwaysOn > 0) {
        push({
          id: 'activationAlwaysOnCredits', label: { en: 'Activation — always-on', it: 'Attivazione — always-on' },
          value: parts.activationAlwaysOn, unit: 'credits',
          formula: '(matched ÷ 1M) × always-on runs/yr × always-on burn',
          substituted: `(${n(f.matched)} ÷ 1M) × ${n(a.alwaysOnRunsPerYear)} × ${BURN.activationAlwaysOn} = ${dec(parts.activationAlwaysOn)}`,
          inputsUsed: ['alwaysOnRunsPerYear'], kind: 'derived',
        });
      }
      if (a.measurementEnabled) {
        push({
          id: 'measurementSummaryCredits', label: { en: 'Measurement — summary statistics', it: 'Measurement — summary statistics' },
          value: parts.measurementSummary, unit: 'credits',
          formula: '(impressions ÷ 1M) × summary reports × measured campaigns × measurement burn',
          substituted: `(${n(f.impressionsPerCampaign)} ÷ 1M) × ${n(a.summaryReportsPerCampaign)} × ${n(a.measurementCampaignsPerYear)} × ${BURN.measurement} = ${dec(parts.measurementSummary)}`,
          inputsUsed: ['summaryReportsPerCampaign', 'measurementCampaignsPerYear', 'measurementEnabled'], kind: 'derived',
        });
        push({
          id: 'measurementAttributionCredits', label: { en: 'Measurement — attribution', it: 'Measurement — attribution' },
          value: parts.measurementAttribution, unit: 'credits',
          formula: '((conversions + impressions) ÷ 1M) × measured campaigns × attribution reports × measurement burn',
          substituted: `((${n(f.conversionsPerCampaign)} + ${n(f.impressionsPerCampaign)}) ÷ 1M) × ${n(a.measurementCampaignsPerYear)} × ${n(a.attributionReportsPerCampaign)} × ${BURN.measurement} = ${dec(parts.measurementAttribution)}`,
          inputsUsed: ['measurementCampaignsPerYear', 'attributionReportsPerCampaign', 'measurementEnabled'], kind: 'derived',
        });
      }
    }

    push({
      id: 'collabCreditsEstimated', label: { en: 'Total credits / yr', it: 'Credits totali / anno' },
      value: parts.estimated, unit: 'credits',
      formula: a.collabMode === 'simple' ? 'management + activation + measurement' : 'management + activation + measurement (summary + attribution)',
      substituted: `${dec(parts.estimated)}`,
      inputsUsed: [], kind: 'output',
    });
  }

  // ── Ferrari instance credit pack (VOLUME, no money) ──
  push({
    id: 'collabRecommendedPack', label: { en: 'Recommended credit pack', it: 'Pacchetto crediti consigliato' },
    value: s.collabRecommendedPack, unit: 'credits',
    formula: 'estimated credits → pack tier (100 / 500 / 1,000 / 5,000)',
    substituted: `${dec(parts.estimated)} → ${n(s.collabRecommendedPack)}`,
    inputsUsed: [], kind: 'output',
  });
  if (s.partnerInstances > 0) {
    push({
      id: 'collabPartnerCredits', label: { en: 'Per-partner credits / yr', it: 'Credits per partner / anno' },
      value: s.collabPartnerCreditsEach, unit: 'credits',
      formula: 'partner instance estimated credits (× N instances)',
      substituted: `${dec(s.collabPartnerCreditsEach)} × ${n(s.partnerInstances)} instances`,
      inputsUsed: ['partnerInstances', 'partnerOnboardedIds', 'partnerAvgAudienceSize', 'partnerAdHocCampaignsPerYear'], kind: 'output',
    });
  }

  // ── Cost: user-set per-instance hypotheses (no Adobe prices) ──
  if (s.totalCost != null) {
    push({
      id: 'ferrariInstanceCost', label: { en: 'Ferrari instance cost', it: 'Costo istanza Ferrari' },
      value: s.ferrariInstanceCost ?? 0, unit: 'eur',
      formula: 'your Ferrari instance cost',
      substituted: `${money(s.ferrariInstanceCost ?? 0)}`,
      inputsUsed: ['ferrariInstanceCost'], kind: 'output',
    });
    push({
      id: 'collabPartnerCost', label: { en: 'Partner instances', it: 'Istanze partner' },
      value: s.partnerCostTotal ?? 0, unit: 'eur',
      formula: 'per-partner instance cost × partner instances',
      substituted: `${money(s.partnerInstanceCost ?? 0)} × ${n(s.partnerInstances)} = ${money(s.partnerCostTotal ?? 0)}`,
      inputsUsed: ['partnerInstanceCost', 'partnerInstances'], kind: 'output',
    });
    push({
      id: 'collabTotalCost', label: { en: 'Total cost / yr', it: 'Costo totale / anno' },
      value: s.totalCost ?? 0, unit: 'eur',
      formula: 'Ferrari instance + N × partner instance',
      substituted: `${money(s.ferrariInstanceCost ?? 0)} + ${money(s.partnerCostTotal ?? 0)} = ${money(s.totalCost ?? 0)}`,
      inputsUsed: [], kind: 'output',
    });
  }

  // CJA per source (unchanged)
  const srcRows = cjaSourceRows(a);
  const total = srcRows.reduce((x, r) => x + r.rows, 0) || 1;
  const cjaSources = srcRows.map((r) => ({
    id: r.id,
    rows: r.rows,
    weightPct: (r.rows / total) * 100,
    formula: CJA_SOURCE_FORMULA[r.id],
    substituted: cjaSourceSubstituted(a, r.id, r.rows),
  }));

  const cja: LineItem[] = [
    {
      id: 'cjaRowsPerYear', label: { en: 'Licensed rows / yr', it: 'Righe licenziate / anno' },
      value: s.cjaRowsPerYear, unit: 'rows',
      formula: 'Σ (web + app + social + crm + events)',
      substituted: srcRows.map((r) => n(r.rows)).join(' + ') + ` = ${n(s.cjaRowsPerYear)}`,
      inputsUsed: ['webVisitsPerYear', 'appMau', 'socialAudience', 'crmProfiles', 'eventsRowsPerYear'], kind: 'output',
    },
    {
      id: 'cjaAnnualIngestionLimit', label: { en: 'Annual ingestion limit', it: 'Limite ingestion annuo' },
      value: s.cjaAnnualIngestionLimit, unit: 'rows',
      formula: 'licensed rows × ingestion multiplier',
      substituted: `${n(s.cjaRowsPerYear)} × ${dec(a.cjaIngestionMultiplier || DEFAULT_INGESTION_MULTIPLIER)} = ${n(s.cjaAnnualIngestionLimit)}`,
      inputsUsed: ['cjaIngestionMultiplier'], kind: 'output',
    },
  ];

  return { collab, cja, cjaSources, warnings: buildWarnings(a) };
}

// ── Guardrail warnings ──────────────────────────────────────────────────────
export function buildWarnings(a: ScopingAssumptions): Warning[] {
  const w: Warning[] = [];
  if (a.collabMode === 'direct') return w;

  if (clamp01(a.matchRate) === 0) {
    w.push({
      id: 'no-match', level: 'warn', inputsUsed: ['matchRate'],
      text: {
        en: 'Match rate is 0 — matched audience, activation and measurement volumes collapse to 0. Provide a match/overlap rate.',
        it: 'Il match rate è 0 — audience matchata, attivazione e measurement diventano 0. Inserisci un tasso di match/overlap.',
      },
    });
  }
  if (a.collabMode === 'detailed' && (a.refreshEveryXDays < 1 || a.refreshEveryXDays > 6)) {
    w.push({
      id: 'refresh-range', level: 'warn', inputsUsed: ['refreshEveryXDays'],
      text: {
        en: 'Refresh cadence should be every 1–6 days (the workbook clamps it to that range). Values outside 1–6 are clamped.',
        it: 'La cadenza di refresh dovrebbe essere ogni 1–6 giorni (il modello la vincola a questo range). Valori fuori 1–6 vengono clampati.',
      },
    });
  }
  if (a.collabMode === 'detailed' && a.refreshEveryXDays <= 1) {
    w.push({
      id: 'refresh-daily', level: 'info', inputsUsed: ['refreshEveryXDays'],
      text: {
        en: 'Daily refresh (every 1 day) applies a 365× multiplier to management credits vs a single yearly refresh. Confirm the cadence.',
        it: 'Il refresh giornaliero (ogni 1 giorno) applica un moltiplicatore 365× ai credits di gestione. Verifica la cadenza.',
      },
    });
  }
  if (!a.measurementEnabled) {
    w.push({
      id: 'measurement-off', level: 'info', inputsUsed: ['measurementEnabled'],
      text: {
        en: 'Measurement use-cases are off → measurement credits are 0.',
        it: 'I casi d’uso di measurement sono disattivati → i credits di measurement sono 0.',
      },
    });
  }
  return w;
}

// ── format helpers ──────────────────────────────────────────────────────────
const NF = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const NF2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const n = (x: number) => NF.format(Math.round(x));
const dec = (x: number) => NF2.format(x);
const pct = (x: number) => `${NF2.format(clamp01(x) * 100)}%`;
const money = (x: number) => `€${NF2.format(x)}`;

const CJA_SOURCE_FORMULA: Record<CjaSourceRows['id'], string> = {
  web: 'web visits/yr × hits per visit',
  app: 'app MAU × events per MAU per month × 12',
  social: 'social audience × active share × actions per active per month × 12',
  crm: 'CRM profiles × events per profile per year',
  events: 'events & eSports rows / year',
};
function cjaSourceSubstituted(a: ScopingAssumptions, id: CjaSourceRows['id'], rows: number): string {
  switch (id) {
    case 'web': return `${n(a.webVisitsPerYear)} × ${dec(a.webHitsPerVisit)} = ${n(rows)}`;
    case 'app': return `${n(a.appMau)} × ${dec(a.appEventsPerMauPerMonth)} × 12 = ${n(rows)}`;
    case 'social': return `${n(a.socialAudience)} × ${pct(a.socialActivePct)} × ${dec(a.socialActionsPerActivePerMonth)} × 12 = ${n(rows)}`;
    case 'crm': return `${n(a.crmProfiles)} × ${dec(a.crmEventsPerProfilePerYear)} = ${n(rows)}`;
    case 'events': return `${n(rows)}`;
  }
}
