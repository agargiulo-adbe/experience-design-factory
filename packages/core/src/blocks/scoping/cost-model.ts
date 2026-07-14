// ─────────────────────────────────────────────────────────────────────────
//  Scoping calculation engine — pure, deterministic, framework-free.
//
//  Two independent Adobe products, two licence metrics:
//    • Real-Time CDP Collaboration → Collaboration Credits (activity-based)
//    • Customer Journey Analytics   → Rows of Data
//
//  The engine models an explicit AUDIENCE FUNNEL for Collaboration
//    distinct → overlap → activated / measured
//  and separates the three credit-consuming activities (management,
//  activation, measurement) so each can size on a DIFFERENT volume base and
//  cadence. Nothing is a magic number: computeBreakdown() emits, for every
//  derived value, the symbolic formula, the substituted numbers and the
//  inputs used, plus guardrail warnings (e.g. on-demand vs recurring double
//  counting). The UI renders those directly — see ScopingCalculator.astro.
// ─────────────────────────────────────────────────────────────────────────

export type CollabPackage = 'none' | 'prime' | 'ultimate';
export type CollabMode = 'direct' | 'activity';
/** Which volume base the audience-management activity is sized on. */
export type ManagedBase = 'full' | 'overlap' | 'custom';
export type RefreshCadence = 'daily' | 'every3days' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
/** on-demand and recurring are NEVER summed unless the user picks `mixed`. */
export type ActivationMode = 'on-demand' | 'recurring' | 'mixed';
export type MeasurementModel = 'none' | 'records' | 'reports' | 'hybrid';

export interface ScopingAssumptions {
  // ── mode & package ──
  collabMode: CollabMode;
  collabPackage: CollabPackage;
  directCredits: number;

  // ── collaboration footprint ──
  partners: number;

  // ── audience funnel (all rates are 0–1) ──
  audienceSize: number;          // distinct addressable audience (deduped · matchable · usable)
  partnerOverlapRate: number;    // match / overlap rate with partner data
  activatedOverlapRate: number;  // share of the overlap actually activated
  measuredOverlapRate: number;   // share of the overlap measured

  // ── audience management ──
  managedBase: ManagedBase;
  customManagedVolume: number;   // IDs under management when managedBase = 'custom'
  managedAudiences: number;      // distinct managed audiences (e.g. per partner) — multiplier, default 1
  refreshCadence: RefreshCadence;
  refreshCustomPerYear: number;  // refreshes/yr when refreshCadence = 'custom'
  creditPerMgmtPerMillionRefresh: number; // credits per 1M managed IDs per refresh

  // ── audience insights (often 0 but part of the workflow) ──
  insightsRunsPerYear: number;
  creditPerInsight: number;

  // ── activation ──
  activationMode: ActivationMode;
  onDemandRuns: number;          // one-off activation pushes / yr
  recurringRunsPerYear: number;  // always-on activation cadence / yr
  creditPerActivationPerMillion: number; // credits per 1M activated IDs per run

  // ── measurement (may use a model distinct from activation) ──
  measurementModel: MeasurementModel;
  measurementRunsPerYear: number;
  reportsPerYear: number;
  creditPerMeasurementPerMillion: number; // records-based: credits per 1M measured IDs per run
  creditPerReport: number;                // report-based: credits per external report

  // ── CJA sources ──
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

export interface UnitPrices {
  currency: string;
  pricePerCredit: number | null;
  pricePerMillionRows: number | null;
}

// ── Official constants (Adobe Product Descriptions) ──────────────────────
const ALLOTMENTS: Record<CollabPackage, number> = { none: 0, prime: 2500, ultimate: 5000 };
const REFRESH_PER_YEAR: Record<Exclude<RefreshCadence, 'custom'>, number> = {
  daily: 365, every3days: 122, weekly: 52, biweekly: 26, monthly: 12,
};
export const CJA_ROW_KB = 0.25;            // 1 Row of Data = 0.25 KB
export const DEFAULT_INGESTION_MULTIPLIER = 3;

export function allotmentCredits(pkg: CollabPackage): number {
  return ALLOTMENTS[pkg] ?? 0;
}

export function refreshesPerYear(a: ScopingAssumptions): number {
  return a.refreshCadence === 'custom'
    ? Math.max(0, a.refreshCustomPerYear || 0)
    : REFRESH_PER_YEAR[a.refreshCadence] ?? 0;
}

// ── Audience funnel ──────────────────────────────────────────────────────
export interface AudienceFunnel {
  distinct: number;   // distinct addressable audience
  overlap: number;    // matchable overlap with partner data
  activated: number;  // records actually activated (per run)
  measured: number;   // records measured (per run)
}

export function audienceFunnel(a: ScopingAssumptions): AudienceFunnel {
  const distinct = Math.max(0, a.audienceSize);
  const overlap = distinct * clamp01(a.partnerOverlapRate);
  return {
    distinct,
    overlap,
    activated: overlap * clamp01(a.activatedOverlapRate),
    measured: overlap * clamp01(a.measuredOverlapRate),
  };
}

export function managedBaseVolume(a: ScopingAssumptions): number {
  const f = audienceFunnel(a);
  if (a.managedBase === 'overlap') return f.overlap;
  if (a.managedBase === 'custom') return Math.max(0, a.customManagedVolume);
  return f.distinct; // 'full'
}

// ── Collaboration credit parts (the auditable breakdown of the estimate) ──
export interface CollabParts {
  management: number;
  insights: number;
  activation: number;
  measurement: number;
  estimated: number;    // sum of the four (activity mode) or directCredits (direct mode)
  activationRuns: number;
}

export function collabParts(a: ScopingAssumptions): CollabParts {
  if (a.collabMode === 'direct') {
    const estimated = Math.max(0, a.directCredits);
    return { management: 0, insights: 0, activation: 0, measurement: 0, estimated, activationRuns: 0 };
  }
  const f = audienceFunnel(a);
  const refreshes = refreshesPerYear(a);

  const management =
    Math.max(1, a.managedAudiences) * (managedBaseVolume(a) / 1_000_000) * refreshes * a.creditPerMgmtPerMillionRefresh;

  const insights = Math.max(0, a.insightsRunsPerYear) * Math.max(0, a.creditPerInsight);

  // on-demand and recurring are only summed in 'mixed' — this is the guardrail
  // against accidental double counting.
  const activationRuns =
    a.activationMode === 'on-demand' ? Math.max(0, a.onDemandRuns)
      : a.activationMode === 'recurring' ? Math.max(0, a.recurringRunsPerYear)
        : Math.max(0, a.onDemandRuns) + Math.max(0, a.recurringRunsPerYear); // mixed
  const activation = activationRuns * (f.activated / 1_000_000) * a.creditPerActivationPerMillion;

  const recordsCredits = Math.max(0, a.measurementRunsPerYear) * (f.measured / 1_000_000) * a.creditPerMeasurementPerMillion;
  const reportsCredits = Math.max(0, a.reportsPerYear) * Math.max(0, a.creditPerReport);
  const measurement =
    a.measurementModel === 'records' ? recordsCredits
      : a.measurementModel === 'reports' ? reportsCredits
        : a.measurementModel === 'hybrid' ? recordsCredits + reportsCredits
          : 0; // 'none'

  const estimated = management + insights + activation + measurement;
  return { management, insights, activation, measurement, estimated, activationRuns };
}

export function estimateCollabCredits(a: ScopingAssumptions): number {
  return collabParts(a).estimated;
}

export function billableCredits(estimated: number, allotment: number): number {
  return Math.max(0, estimated - allotment);
}

// ── CJA rows, per source ─────────────────────────────────────────────────
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

// ── Snapshot: flat numbers the sticky results bar reads directly ─────────
export interface ScopingSnapshot {
  // funnel
  distinctAudience: number;
  overlapAudience: number;
  activatedAudience: number;
  measuredAudience: number;
  managedVolume: number;
  refreshesPerYear: number;
  // collab parts
  collabManagementCredits: number;
  collabInsightsCredits: number;
  collabActivationCredits: number;
  collabMeasurementCredits: number;
  collabCreditsEstimated: number;
  collabAllotment: number;
  collabBillableCredits: number;
  collabCost: number | null;
  // cja
  cjaRowsPerYear: number;
  cjaAnnualIngestionLimit: number;
  cjaCost: number | null;
  // total
  totalCost: number | null;
}

export function computeSnapshot(a: ScopingAssumptions, prices: UnitPrices): ScopingSnapshot {
  const f = audienceFunnel(a);
  const parts = collabParts(a);
  const collabAllotment = allotmentCredits(a.collabPackage);
  const collabBillableCredits = billableCredits(parts.estimated, collabAllotment);
  const cjaRowsPerYear = estimateCjaRows(a);
  const multiplier = a.cjaIngestionMultiplier || DEFAULT_INGESTION_MULTIPLIER;

  const collabCost = prices.pricePerCredit == null ? null : collabBillableCredits * prices.pricePerCredit;
  const cjaCost = prices.pricePerMillionRows == null ? null : (cjaRowsPerYear / 1_000_000) * prices.pricePerMillionRows;
  const totalCost = collabCost == null && cjaCost == null ? null : (collabCost ?? 0) + (cjaCost ?? 0);

  return {
    distinctAudience: f.distinct,
    overlapAudience: f.overlap,
    activatedAudience: f.activated,
    measuredAudience: f.measured,
    managedVolume: managedBaseVolume(a),
    refreshesPerYear: refreshesPerYear(a),
    collabManagementCredits: parts.management,
    collabInsightsCredits: parts.insights,
    collabActivationCredits: parts.activation,
    collabMeasurementCredits: parts.measurement,
    collabCreditsEstimated: parts.estimated,
    collabAllotment,
    collabBillableCredits,
    collabCost,
    cjaRowsPerYear,
    cjaAnnualIngestionLimit: cjaRowsPerYear * multiplier,
    cjaCost,
    totalCost,
  };
}

// ── Breakdown: every derived value with formula + substituted numbers ────
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
  const refreshes = refreshesPerYear(a);
  const managedVol = managedBaseVolume(a);
  const collab: LineItem[] = [];
  const push = (li: LineItem) => collab.push(li);

  if (a.collabMode === 'activity') {
    push({
      id: 'overlapAudience', label: { en: 'Overlap audience', it: 'Audience in overlap' },
      value: f.overlap, unit: 'ids',
      formula: 'distinct addressable × partner overlap rate',
      substituted: `${n(f.distinct)} × ${pct(a.partnerOverlapRate)} = ${n(f.overlap)}`,
      inputsUsed: ['audienceSize', 'partnerOverlapRate'], kind: 'derived',
    });
    push({
      id: 'activatedAudience', label: { en: 'Activated volume / run', it: 'Volume attivato / run' },
      value: f.activated, unit: 'ids',
      formula: 'overlap audience × activated overlap rate',
      substituted: `${n(f.overlap)} × ${pct(a.activatedOverlapRate)} = ${n(f.activated)}`,
      inputsUsed: ['partnerOverlapRate', 'activatedOverlapRate'], kind: 'derived',
    });
    push({
      id: 'managementCredits', label: { en: 'Management credits', it: 'Credits gestione' },
      value: parts.management, unit: 'credits',
      formula: 'managed audiences × (managed IDs ÷ 1M) × refreshes/yr × credits per 1M per refresh',
      substituted: `${n(Math.max(1, a.managedAudiences))} × (${n(managedVol)} ÷ 1M) × ${n(refreshes)} × ${dec(a.creditPerMgmtPerMillionRefresh)} = ${dec(parts.management)}`,
      inputsUsed: ['managedAudiences', 'managedBase', 'refreshCadence', 'creditPerMgmtPerMillionRefresh'], kind: 'derived',
    });
    if (parts.insights > 0) {
      push({
        id: 'insightsCredits', label: { en: 'Insights credits', it: 'Credits insights' },
        value: parts.insights, unit: 'credits',
        formula: 'insights runs/yr × credits per insight',
        substituted: `${n(a.insightsRunsPerYear)} × ${dec(a.creditPerInsight)} = ${dec(parts.insights)}`,
        inputsUsed: ['insightsRunsPerYear', 'creditPerInsight'], kind: 'derived',
      });
    }
    push({
      id: 'activationCredits', label: { en: 'Activation credits', it: 'Credits attivazione' },
      value: parts.activation, unit: 'credits',
      formula: `activation runs (${a.activationMode}) × (activated volume ÷ 1M) × credits per 1M per run`,
      substituted: `${n(parts.activationRuns)} × (${n(f.activated)} ÷ 1M) × ${dec(a.creditPerActivationPerMillion)} = ${dec(parts.activation)}`,
      inputsUsed: ['activationMode', 'onDemandRuns', 'recurringRunsPerYear', 'creditPerActivationPerMillion'], kind: 'derived',
    });
    if (a.measurementModel !== 'none') {
      push({
        id: 'measurementCredits', label: { en: 'Measurement credits', it: 'Credits measurement' },
        value: parts.measurement, unit: 'credits',
        formula: measurementFormula(a.measurementModel),
        substituted: measurementSubstituted(a, f, parts.measurement),
        inputsUsed: ['measurementModel', 'measurementRunsPerYear', 'reportsPerYear', 'creditPerMeasurementPerMillion', 'creditPerReport'], kind: 'derived',
      });
    }
  }

  push({
    id: 'collabCreditsEstimated', label: { en: 'Estimated credits / yr', it: 'Credits stimati / anno' },
    value: parts.estimated, unit: 'credits',
    formula: a.collabMode === 'direct' ? 'direct credits' : 'management + insights + activation + measurement',
    substituted: a.collabMode === 'direct'
      ? `${dec(parts.estimated)}`
      : `${dec(parts.management)} + ${dec(parts.insights)} + ${dec(parts.activation)} + ${dec(parts.measurement)} = ${dec(parts.estimated)}`,
    inputsUsed: [], kind: 'output',
  });
  push({
    id: 'collabBillableCredits', label: { en: 'Billable credits / yr', it: 'Credits fatturabili / anno' },
    value: s.collabBillableCredits, unit: 'credits',
    formula: 'max(0, estimated − package allotment)',
    substituted: `max(0, ${dec(parts.estimated)} − ${n(s.collabAllotment)}) = ${dec(s.collabBillableCredits)}`,
    inputsUsed: ['collabPackage'], kind: 'output',
  });
  if (prices.pricePerCredit != null) {
    push({
      id: 'collabCost', label: { en: 'Collaboration cost', it: 'Costo Collaboration' },
      value: s.collabCost ?? 0, unit: 'eur',
      formula: 'billable credits × price per credit',
      substituted: `${dec(s.collabBillableCredits)} × ${money(prices.pricePerCredit)} = ${money(s.collabCost ?? 0)}`,
      inputsUsed: ['pricePerCredit'], kind: 'output',
    });
  }

  // CJA per source
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
  if (prices.pricePerMillionRows != null) {
    cja.push({
      id: 'cjaCost', label: { en: 'CJA cost', it: 'Costo CJA' },
      value: s.cjaCost ?? 0, unit: 'eur',
      formula: '(licensed rows ÷ 1M) × price per 1M rows',
      substituted: `(${n(s.cjaRowsPerYear)} ÷ 1M) × ${money(prices.pricePerMillionRows)} = ${money(s.cjaCost ?? 0)}`,
      inputsUsed: ['pricePerMillionRows'], kind: 'output',
    });
  }

  return { collab, cja, cjaSources, warnings: buildWarnings(a) };
}

// ── Guardrail warnings (error prevention, §6 of the brief) ───────────────
export function buildWarnings(a: ScopingAssumptions): Warning[] {
  const w: Warning[] = [];
  if (a.collabMode !== 'activity') return w;

  if (a.activationMode !== 'mixed' && a.onDemandRuns > 0 && a.recurringRunsPerYear > 0) {
    const counted = a.activationMode === 'on-demand' ? 'on-demand' : 'recurring';
    w.push({
      id: 'activation-double-count', level: 'warn', inputsUsed: ['activationMode', 'onDemandRuns', 'recurringRunsPerYear'],
      text: {
        en: `Both on-demand and recurring runs are set, but mode is “${a.activationMode}”. Only ${counted} runs are counted — switch to Mixed to sum them.`,
        it: `Sono impostati sia run on-demand sia recurring, ma la modalità è “${a.activationMode}”. Vengono contate solo le run ${counted} — passa a Mixed per sommarle.`,
      },
    });
  }
  if (clamp01(a.partnerOverlapRate) === 0) {
    w.push({
      id: 'no-overlap', level: 'warn', inputsUsed: ['partnerOverlapRate'],
      text: {
        en: 'Partner overlap rate is 0 — activation and measurement volumes collapse to 0. Provide an overlap/match rate.',
        it: 'Il match/overlap rate con i partner è 0 — i volumi di attivazione e measurement diventano 0. Inserisci un tasso di overlap.',
      },
    });
  }
  if (a.managedBase === 'full' && clamp01(a.partnerOverlapRate) < 1) {
    w.push({
      id: 'managed-full', level: 'info', inputsUsed: ['managedBase', 'partnerOverlapRate'],
      text: {
        en: 'Management is sized on the FULL addressable audience, not just the partner overlap. Switch the managed base to “Overlap only” to size on the matched subset.',
        it: 'La gestione è dimensionata sull’audience indirizzabile PIENA, non solo sull’overlap con il partner. Imposta la base gestita su “Solo overlap” per dimensionare sul sottoinsieme matchato.',
      },
    });
  }
  if (a.refreshCadence === 'daily') {
    w.push({
      id: 'daily-refresh', level: 'info', inputsUsed: ['refreshCadence'],
      text: {
        en: 'Daily refresh applies a ~30× multiplier to management credits vs monthly. Confirm the indexing cadence is really daily.',
        it: 'Il refresh giornaliero applica un moltiplicatore ~30× ai credits di gestione rispetto al mensile. Verifica che la cadenza di indicizzazione sia davvero giornaliera.',
      },
    });
  }
  if (a.measurementModel === 'reports' && a.reportsPerYear === 0) {
    w.push({
      id: 'reports-zero', level: 'warn', inputsUsed: ['measurementModel', 'reportsPerYear'],
      text: {
        en: 'Measurement model is report-based but reports/yr is 0 → measurement credits are 0.',
        it: 'Il modello di measurement è report-based ma i report/anno sono 0 → i credits di measurement sono 0.',
      },
    });
  }
  if ((a.measurementModel === 'records' || a.measurementModel === 'hybrid') && clamp01(a.measuredOverlapRate) === 0) {
    w.push({
      id: 'measured-zero', level: 'warn', inputsUsed: ['measurementModel', 'measuredOverlapRate'],
      text: {
        en: 'Records-based measurement is selected but measured overlap rate is 0 → records measurement credits are 0.',
        it: 'È selezionato il measurement su base record ma il measured overlap rate è 0 → i credits di measurement su record sono 0.',
      },
    });
  }
  return w;
}

// ── helpers ──────────────────────────────────────────────────────────────
function clamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.min(1, Math.max(0, x));
}
const NF = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const NF2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const n = (x: number) => NF.format(Math.round(x));
const dec = (x: number) => NF2.format(x);
const pct = (x: number) => `${NF2.format(clamp01(x) * 100)}%`;
const money = (x: number) => `€${NF2.format(x)}`;

function measurementFormula(m: MeasurementModel): string {
  if (m === 'records') return 'measurement runs/yr × (measured volume ÷ 1M) × credits per 1M per run';
  if (m === 'reports') return 'reports/yr × credits per report';
  if (m === 'hybrid') return '(records-based) + (report-based)';
  return '0';
}
function measurementSubstituted(a: ScopingAssumptions, f: AudienceFunnel, result: number): string {
  const rec = `${n(a.measurementRunsPerYear)} × (${n(f.measured)} ÷ 1M) × ${dec(a.creditPerMeasurementPerMillion)}`;
  const rep = `${n(a.reportsPerYear)} × ${dec(a.creditPerReport)}`;
  if (a.measurementModel === 'records') return `${rec} = ${dec(result)}`;
  if (a.measurementModel === 'reports') return `${rep} = ${dec(result)}`;
  if (a.measurementModel === 'hybrid') return `[${rec}] + [${rep}] = ${dec(result)}`;
  return `${dec(result)}`;
}

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
