import type { Scenario } from '@edf/core/blocks/scoping/scenario';
import { DEFAULT_ASSUMPTIONS } from '@edf/core/blocks/scoping/scenario';

// ─────────────────────────────────────────────────────────────────────
//  Every number here is a STATED assumption with an audit trail (see
//  FIELD_AUDIT below): where it comes from, how it's computed, its semantic
//  data-type (official constant vs internal default vs customer assumption
//  vs quote-only price) and the reasoning. Volume figures are reasoned
//  inferences from public footprint research (F1 826.5M fans · Scuderia
//  social ~35M · ferrari.com ~2.7M/mo · ~5 data-relevant partners). Adobe
//  unit prices and credit burn-rates are quote-only: the values shipped
//  here are clearly-labelled illustrative placeholders — replace with the
//  Sales Order. No field is ever left at 0 or blank.
// ─────────────────────────────────────────────────────────────────────

// Illustrative unit prices (quote-only — see FIELD_AUDIT for provenance).
const ILLUSTRATIVE_PRICES = { currency: 'EUR', pricePerCredit: 3, pricePerMillionRows: 2 };

// ── Scenario presets (Conservative / Base / Aggressive). Each is a delta
//    over DEFAULT_ASSUMPTIONS; the calculator surfaces them as chips. ──
export const SEED_SCENARIOS: Scenario[] = [
  {
    title: 'Conservativo / Conservative', preset: 'conservative', visibility: 'private',
    prices: { ...ILLUSTRATIVE_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      collabPackage: 'prime',
      partners: 2, audienceSize: 5_000_000, partnerOverlapRate: 0.25,
      managedBase: 'overlap', managedAudiences: 2, refreshCadence: 'monthly',
      activationMode: 'recurring', onDemandRuns: 0, recurringRunsPerYear: 12,
      measurementModel: 'records', measurementRunsPerYear: 4, reportsPerYear: 4,
      webVisitsPerYear: 32_000_000, webHitsPerVisit: 5,
      appMau: 800_000, appEventsPerMauPerMonth: 20,
      socialAudience: 35_000_000, socialActivePct: 0.05, socialActionsPerActivePerMonth: 5,
      crmProfiles: 1_500_000, crmEventsPerProfilePerYear: 24,
      eventsRowsPerYear: 15_000_000,
    },
  },
  {
    title: 'Base', preset: 'base', visibility: 'private',
    prices: { ...ILLUSTRATIVE_PRICES },
    assumptions: { ...DEFAULT_ASSUMPTIONS }, // 5 partner / 15M distinct / 35% overlap / weekly
  },
  {
    title: 'Ambizioso / Aggressive', preset: 'aggressive', visibility: 'private',
    prices: { ...ILLUSTRATIVE_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      collabPackage: 'ultimate',
      partners: 10, audienceSize: 40_000_000, partnerOverlapRate: 0.6,
      managedBase: 'overlap', managedAudiences: 10, refreshCadence: 'daily',
      activationMode: 'mixed', onDemandRuns: 12, recurringRunsPerYear: 52,
      measurementModel: 'hybrid', measurementRunsPerYear: 24, reportsPerYear: 24,
      webVisitsPerYear: 32_000_000, webHitsPerVisit: 12,
      appMau: 4_000_000, appEventsPerMauPerMonth: 40,
      socialAudience: 48_000_000, socialActivePct: 0.2, socialActionsPerActivePerMonth: 9,
      crmProfiles: 6_000_000, crmEventsPerProfilePerYear: 36,
      eventsRowsPerYear: 120_000_000,
    },
  },
];

// ── Per-field audit registry: drives labels, grouping, number formatting,
//    conditional visibility, semantic badges and the per-field audit tooltip.
export type FieldFormat = 'int' | 'decimal' | 'percent' | 'currency';
export type FieldGroup = 'collab' | 'cja';
export type FieldInput = 'number' | 'select';
/** Semantic data-type → the badge shown next to the field. */
export type DataType = 'official' | 'default-assumption' | 'customer-assumption' | 'price';
export type FieldCategory =
  | 'package' | 'pricing' | 'footprint' | 'audience' | 'overlap'
  | 'management' | 'activation' | 'measurement' | 'insights'
  | 'source-volume' | 'row-conversion' | 'governance';

export interface FieldOption { value: string; label: { en: string; it: string } }

export interface FieldAudit {
  key: string;                  // ScopingAssumptions field or a price key
  group: FieldGroup;
  section: { en: string; it: string };
  label: { en: string; it: string };
  format: FieldFormat;
  input?: FieldInput;           // default 'number'; 'select' → renders a dropdown
  options?: FieldOption[];      // when input === 'select'
  mode?: 'activity' | 'direct'; // Collaboration-only: which estimation mode shows it
  category?: FieldCategory;
  dataType?: DataType;          // default 'default-assumption'
  advancedOnly?: boolean;       // hidden until "Advanced assumptions" is opened
  appliesWhen?: string;         // 'key=v1|v2' — show only when assumptions[key] ∈ {v…}
  impacts?: { en: string; it: string }; // which outputs this variable drives
  toConfirm?: boolean;          // illustrative / client-to-confirm → amber marker
  source: { en: string; it: string };
  calc: { en: string; it: string };
  assumption: { en: string; it: string };
}

// Shared option sets
const CADENCE_OPTIONS: FieldOption[] = [
  { value: 'daily', label: { en: 'Daily (365/yr)', it: 'Giornaliera (365/anno)' } },
  { value: 'every3days', label: { en: 'Every 3 days (122/yr)', it: 'Ogni 3 giorni (122/anno)' } },
  { value: 'weekly', label: { en: 'Weekly (52/yr)', it: 'Settimanale (52/anno)' } },
  { value: 'biweekly', label: { en: 'Every 2 weeks (26/yr)', it: 'Ogni 2 settimane (26/anno)' } },
  { value: 'monthly', label: { en: 'Monthly (12/yr)', it: 'Mensile (12/anno)' } },
  { value: 'custom', label: { en: 'Custom…', it: 'Personalizzato…' } },
];
const MANAGED_BASE_OPTIONS: FieldOption[] = [
  { value: 'full', label: { en: 'Full addressable audience', it: 'Audience indirizzabile piena' } },
  { value: 'overlap', label: { en: 'Overlap audience only', it: 'Solo audience in overlap' } },
  { value: 'custom', label: { en: 'Custom managed volume', it: 'Volume gestito personalizzato' } },
];
const ACTIVATION_MODE_OPTIONS: FieldOption[] = [
  { value: 'on-demand', label: { en: 'On-demand (one-off)', it: 'On-demand (one-off)' } },
  { value: 'recurring', label: { en: 'Recurring (always-on)', it: 'Ricorrente (always-on)' } },
  { value: 'mixed', label: { en: 'Mixed (sum both)', it: 'Mista (somma entrambe)' } },
];
const MEASUREMENT_MODEL_OPTIONS: FieldOption[] = [
  { value: 'records', label: { en: 'Records-based', it: 'Su base record' } },
  { value: 'reports', label: { en: 'External report-based', it: 'Su base report esterni' } },
  { value: 'hybrid', label: { en: 'Hybrid (both)', it: 'Ibrido (entrambi)' } },
  { value: 'none', label: { en: 'None', it: 'Nessuno' } },
];

export const FIELD_AUDIT: FieldAudit[] = [
  // ══════════════ COLLABORATION ══════════════
  // ── Direct scoping (direct mode only) ──
  {
    key: 'directCredits', group: 'collab', mode: 'direct', format: 'int',
    category: 'package', dataType: 'customer-assumption',
    section: { en: 'Direct scoping', it: 'Scoping diretto' },
    label: { en: 'Annual Collaboration Credits', it: 'Collaboration Credits annui' },
    impacts: { en: 'Estimated credits (bypasses the activity model)', it: 'Credits stimati (salta il modello ad attività)' },
    source: { en: 'Scoping estimate / Sales Order', it: 'Stima di scoping / Sales Order' },
    calc: { en: 'Credits scoped directly, bypassing the activity estimate', it: 'Credits scopati direttamente, senza stima da attività' },
    assumption: { en: '5,000 credits (≈ Ultimate allotment) — placeholder to replace with the Sales Order', it: '5.000 credits (≈ allotment Ultimate) — segnaposto da sostituire con il Sales Order' },
  },
  // ── Audience & funnel (activity mode) ──
  {
    key: 'partners', group: 'collab', mode: 'activity', format: 'int',
    category: 'footprint', dataType: 'customer-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Data-collaboration partners', it: 'Partner in data collaboration' },
    impacts: { en: 'Footprint context (not a direct credit driver)', it: 'Contesto footprint (non driver diretto di credits)' },
    source: { en: 'Scuderia Ferrari HP premium partner roster (HP, Shell, UniCredit, IBM/AWS, PUMA)', it: 'Roster premium partner Scuderia Ferrari HP (HP, Shell, UniCredit, IBM/AWS, PUMA)' },
    calc: { en: 'Count of data-collaboration-relevant partners', it: 'Conteggio dei partner rilevanti per la data collaboration' },
    assumption: { en: '5 of ~40 total partners are data-collaboration-relevant', it: '5 su ~40 partner totali sono rilevanti per la data collaboration' },
  },
  {
    key: 'audienceSize', group: 'collab', mode: 'activity', format: 'int',
    category: 'audience', dataType: 'customer-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Distinct addressable audience', it: 'Audience distinta indirizzabile' },
    impacts: { en: 'Top of the funnel → overlap, management (full base)', it: 'Cima del funnel → overlap, gestione (base piena)' },
    source: { en: 'Scuderia social ~35M + web + CRM, de-duplicated (Motorsport Week 2025 · Similarweb)', it: 'Social Scuderia ~35M + web + CRM, de-duplicati (Motorsport Week 2025 · Similarweb)' },
    calc: { en: 'Distinct 1st-party identities, deduplicated, matchable and realistically addressable', it: 'Identità 1st-party distinte, deduplicate, matchabili e realisticamente indirizzabili' },
    assumption: { en: '~15M after cross-platform de-dup — followers are not all matchable identities', it: '~15M dopo de-dup cross-platform — i follower non sono tutti identità matchabili' },
  },
  {
    key: 'partnerOverlapRate', group: 'collab', mode: 'activity', format: 'percent',
    category: 'overlap', dataType: 'customer-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Partner overlap / match rate', it: 'Overlap / match rate partner' },
    impacts: { en: 'Overlap audience → activation, measurement, (overlap) management', it: 'Audience in overlap → attivazione, measurement, gestione (overlap)' },
    source: { en: 'Data-collaboration match-rate benchmark (clean-room)', it: 'Benchmark match-rate in data collaboration (clean-room)' },
    calc: { en: 'Share of the addressable audience that matches partner data', it: 'Quota di audience indirizzabile che matcha con i dati del partner' },
    assumption: { en: '35% average overlap — varies materially by partner', it: '35% overlap medio — varia molto per partner' },
  },
  {
    key: 'activatedOverlapRate', group: 'collab', mode: 'activity', format: 'percent', advancedOnly: true,
    category: 'overlap', dataType: 'default-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Activated share of overlap', it: 'Quota di overlap attivata' },
    impacts: { en: 'Activated volume per run', it: 'Volume attivato per run' },
    source: { en: 'Campaign-planning assumption', it: 'Assunzione di pianificazione campagne' },
    calc: { en: 'Share of the matched overlap actually pushed to activation', it: 'Quota dell’overlap matchato effettivamente attivata' },
    assumption: { en: '100% by default — lower it to model partial activation', it: '100% di default — abbassalo per modellare attivazione parziale' },
  },
  {
    key: 'measuredOverlapRate', group: 'collab', mode: 'activity', format: 'percent', advancedOnly: true,
    category: 'overlap', dataType: 'default-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Measured share of overlap', it: 'Quota di overlap misurata' },
    impacts: { en: 'Measured volume (records-based measurement)', it: 'Volume misurato (measurement su record)' },
    source: { en: 'Measurement-design assumption', it: 'Assunzione di measurement design' },
    calc: { en: 'Share of the matched overlap included in records-based measurement', it: 'Quota dell’overlap matchato inclusa nel measurement su record' },
    assumption: { en: '100% by default', it: '100% di default' },
  },
  // ── Management ──
  {
    key: 'managedBase', group: 'collab', mode: 'activity', format: 'int', input: 'select', options: MANAGED_BASE_OPTIONS,
    category: 'management', dataType: 'default-assumption',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Managed volume base', it: 'Base del volume gestito' },
    impacts: { en: 'Which IDs the management activity is sized on', it: 'Su quali ID è dimensionata la gestione' },
    source: { en: 'Modelling choice', it: 'Scelta di modellazione' },
    calc: { en: 'Full addressable · overlap only · or a custom managed volume', it: 'Audience piena · solo overlap · o volume gestito custom' },
    assumption: { en: 'Overlap only — you typically manage the matched subset', it: 'Solo overlap — di norma gestisci il sottoinsieme matchato' },
  },
  {
    key: 'customManagedVolume', group: 'collab', mode: 'activity', format: 'int', advancedOnly: true, appliesWhen: 'managedBase=custom',
    category: 'management', dataType: 'customer-assumption',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Custom managed volume (IDs)', it: 'Volume gestito custom (ID)' },
    impacts: { en: 'Managed IDs when base = custom', it: 'ID gestiti quando base = custom' },
    source: { en: 'Client-provided', it: 'Fornito dal cliente' },
    calc: { en: 'Explicit count of IDs under management', it: 'Conteggio esplicito di ID in gestione' },
    assumption: { en: '5M — used only when managed base = custom', it: '5M — usato solo quando la base gestita = custom' },
  },
  {
    key: 'managedAudiences', group: 'collab', mode: 'activity', format: 'int',
    category: 'management', dataType: 'default-assumption',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Managed audiences', it: 'Audience gestite' },
    impacts: { en: 'Multiplies management credits (per-partner audiences)', it: 'Moltiplica i credits di gestione (audience per partner)' },
    source: { en: 'Data-strategy assumption', it: 'Assunzione di data strategy' },
    calc: { en: 'Distinct managed audiences (e.g. one per partner)', it: 'Audience gestite distinte (es. una per partner)' },
    assumption: { en: '5 — one managed audience per data partner', it: '5 — una audience gestita per partner dati' },
  },
  {
    key: 'refreshCadence', group: 'collab', mode: 'activity', format: 'int', input: 'select', options: CADENCE_OPTIONS,
    category: 'management', dataType: 'default-assumption',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Refresh cadence', it: 'Cadenza di refresh' },
    impacts: { en: 'Refreshes/yr → linear multiplier on management credits', it: 'Refresh/anno → moltiplicatore lineare sui credits di gestione' },
    source: { en: 'Indexing-cadence assumption', it: 'Assunzione sulla cadenza di indicizzazione' },
    calc: { en: 'How often the managed audience is re-indexed per year', it: 'Con che frequenza l’audience gestita viene re-indicizzata/anno' },
    assumption: { en: 'Weekly (52/yr) — daily would be ~30× monthly', it: 'Settimanale (52/anno) — il giornaliero sarebbe ~30× il mensile' },
  },
  {
    key: 'refreshCustomPerYear', group: 'collab', mode: 'activity', format: 'int', advancedOnly: true, appliesWhen: 'refreshCadence=custom',
    category: 'management', dataType: 'customer-assumption',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Custom refreshes / year', it: 'Refresh custom / anno' },
    impacts: { en: 'Refreshes/yr when cadence = custom', it: 'Refresh/anno quando cadenza = custom' },
    source: { en: 'Client-provided', it: 'Fornito dal cliente' },
    calc: { en: 'Explicit refresh count', it: 'Conteggio esplicito dei refresh' },
    assumption: { en: '52 — used only when cadence = custom', it: '52 — usato solo quando cadenza = custom' },
  },
  {
    key: 'creditPerMgmtPerMillionRefresh', group: 'collab', mode: 'activity', format: 'decimal', advancedOnly: true, toConfirm: true,
    category: 'management', dataType: 'price',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Credits per 1M IDs / refresh', it: 'Credits per 1M ID / refresh' },
    impacts: { en: 'Management credit burn-rate', it: 'Burn-rate credits di gestione' },
    source: { en: 'Illustrative — Adobe Credit Consumption Table (quote-only)', it: 'Illustrativo — Credit Consumption Table Adobe (quote-only)' },
    calc: { en: 'Credits consumed per 1M managed IDs per refresh', it: 'Credits consumati per 1M ID gestiti per refresh' },
    assumption: { en: '0.1 credit / 1M IDs / refresh — placeholder', it: '0,1 credit / 1M ID / refresh — segnaposto' },
  },
  // ── Insights (advanced) ──
  {
    key: 'insightsRunsPerYear', group: 'collab', mode: 'activity', format: 'int', advancedOnly: true,
    category: 'insights', dataType: 'default-assumption',
    section: { en: 'Audience insights', it: 'Audience insights' },
    label: { en: 'Insights runs / year', it: 'Run insights / anno' },
    impacts: { en: 'Insights credits (often 0)', it: 'Credits insights (spesso 0)' },
    source: { en: 'Workflow assumption', it: 'Assunzione di workflow' },
    calc: { en: 'Overlap / insight reports generated per year', it: 'Report di overlap / insight generati/anno' },
    assumption: { en: '0 by default — insights can be zero-cost but stay visible', it: '0 di default — gli insights possono essere a costo zero ma restano visibili' },
  },
  {
    key: 'creditPerInsight', group: 'collab', mode: 'activity', format: 'decimal', advancedOnly: true, toConfirm: true,
    category: 'insights', dataType: 'price',
    section: { en: 'Audience insights', it: 'Audience insights' },
    label: { en: 'Credits per insight run', it: 'Credits per run insight' },
    impacts: { en: 'Insights credit burn-rate', it: 'Burn-rate credits insights' },
    source: { en: 'Illustrative (quote-only)', it: 'Illustrativo (quote-only)' },
    calc: { en: 'Credits per insight run', it: 'Credits per run di insight' },
    assumption: { en: '0 — placeholder', it: '0 — segnaposto' },
  },
  // ── Activation ──
  {
    key: 'activationMode', group: 'collab', mode: 'activity', format: 'int', input: 'select', options: ACTIVATION_MODE_OPTIONS,
    category: 'activation', dataType: 'default-assumption',
    section: { en: 'Activation', it: 'Attivazione' },
    label: { en: 'Activation mode', it: 'Modalità di attivazione' },
    impacts: { en: 'Which runs count. On-demand & recurring are summed ONLY in Mixed.', it: 'Quali run contano. On-demand e recurring si sommano SOLO in Mista.' },
    source: { en: 'Campaign-model choice', it: 'Scelta del modello di campagna' },
    calc: { en: 'On-demand · recurring · or mixed (explicit sum)', it: 'On-demand · ricorrente · o mista (somma esplicita)' },
    assumption: { en: 'Recurring — always-on, race-calendar aligned', it: 'Ricorrente — always-on, allineata al calendario gare' },
  },
  {
    key: 'onDemandRuns', group: 'collab', mode: 'activity', format: 'int', appliesWhen: 'activationMode=on-demand|mixed',
    category: 'activation', dataType: 'customer-assumption',
    section: { en: 'Activation', it: 'Attivazione' },
    label: { en: 'On-demand runs / year', it: 'Run on-demand / anno' },
    impacts: { en: 'Activation runs (on-demand / mixed)', it: 'Run di attivazione (on-demand / mista)' },
    source: { en: 'Campaign plan', it: 'Piano campagne' },
    calc: { en: 'One-off activation pushes per year', it: 'Attivazioni one-off per anno' },
    assumption: { en: '6 — tent-pole moments', it: '6 — momenti tent-pole' },
  },
  {
    key: 'recurringRunsPerYear', group: 'collab', mode: 'activity', format: 'int', appliesWhen: 'activationMode=recurring|mixed',
    category: 'activation', dataType: 'customer-assumption',
    section: { en: 'Activation', it: 'Attivazione' },
    label: { en: 'Recurring runs / year', it: 'Run ricorrenti / anno' },
    impacts: { en: 'Activation runs (recurring / mixed)', it: 'Run di attivazione (ricorrente / mista)' },
    source: { en: '2026 F1 calendar (24 GP) / always-on cadence', it: 'Calendario F1 2026 (24 GP) / cadenza always-on' },
    calc: { en: 'Always-on activation cadence per year', it: 'Cadenza di attivazione always-on per anno' },
    assumption: { en: '24 — ≈ 2 / month, race-aligned', it: '24 — ≈ 2 / mese, allineata alle gare' },
  },
  {
    key: 'creditPerActivationPerMillion', group: 'collab', mode: 'activity', format: 'decimal', advancedOnly: true, toConfirm: true,
    category: 'activation', dataType: 'price',
    section: { en: 'Activation', it: 'Attivazione' },
    label: { en: 'Credits per 1M activated / run', it: 'Credits per 1M attivati / run' },
    impacts: { en: 'Activation credit burn-rate', it: 'Burn-rate credits di attivazione' },
    source: { en: 'Illustrative — Access + Egress (quote-only)', it: 'Illustrativo — Access + Egress (quote-only)' },
    calc: { en: 'Credits per 1M activated IDs per run', it: 'Credits per 1M ID attivati per run' },
    assumption: { en: '0.1 credit / 1M / run — placeholder', it: '0,1 credit / 1M / run — segnaposto' },
  },
  // ── Measurement ──
  {
    key: 'measurementModel', group: 'collab', mode: 'activity', format: 'int', input: 'select', options: MEASUREMENT_MODEL_OPTIONS,
    category: 'measurement', dataType: 'default-assumption',
    section: { en: 'Measurement', it: 'Measurement' },
    label: { en: 'Measurement model', it: 'Modello di measurement' },
    impacts: { en: 'Records-based, report-based, hybrid or none', it: 'Su record, su report, ibrido o nessuno' },
    source: { en: 'Measurement-design choice', it: 'Scelta di measurement design' },
    calc: { en: 'How measurement credits are computed', it: 'Come si calcolano i credits di measurement' },
    assumption: { en: 'Records-based — measured on the overlap', it: 'Su base record — misurato sull’overlap' },
  },
  {
    key: 'measurementRunsPerYear', group: 'collab', mode: 'activity', format: 'int', appliesWhen: 'measurementModel=records|hybrid',
    category: 'measurement', dataType: 'customer-assumption',
    section: { en: 'Measurement', it: 'Measurement' },
    label: { en: 'Measurement runs / year', it: 'Run di measurement / anno' },
    impacts: { en: 'Records-based measurement credits', it: 'Credits measurement su record' },
    source: { en: 'Reporting cadence', it: 'Cadenza di reporting' },
    calc: { en: 'Records-based measurement runs per year', it: 'Run di measurement su record per anno' },
    assumption: { en: '12 — monthly', it: '12 — mensile' },
  },
  {
    key: 'reportsPerYear', group: 'collab', mode: 'activity', format: 'int', appliesWhen: 'measurementModel=reports|hybrid',
    category: 'measurement', dataType: 'customer-assumption',
    section: { en: 'Measurement', it: 'Measurement' },
    label: { en: 'External reports / year', it: 'Report esterni / anno' },
    impacts: { en: 'Report-based measurement credits', it: 'Credits measurement su report' },
    source: { en: 'Reporting plan', it: 'Piano di reporting' },
    calc: { en: 'External measurement reports per year', it: 'Report di measurement esterni per anno' },
    assumption: { en: '12 — monthly', it: '12 — mensile' },
  },
  {
    key: 'creditPerMeasurementPerMillion', group: 'collab', mode: 'activity', format: 'decimal', advancedOnly: true, toConfirm: true, appliesWhen: 'measurementModel=records|hybrid',
    category: 'measurement', dataType: 'price',
    section: { en: 'Measurement', it: 'Measurement' },
    label: { en: 'Credits per 1M measured / run', it: 'Credits per 1M misurati / run' },
    impacts: { en: 'Records-based measurement burn-rate', it: 'Burn-rate measurement su record' },
    source: { en: 'Illustrative (quote-only)', it: 'Illustrativo (quote-only)' },
    calc: { en: 'Credits per 1M measured IDs per run', it: 'Credits per 1M ID misurati per run' },
    assumption: { en: '0.05 credit / 1M / run — placeholder', it: '0,05 credit / 1M / run — segnaposto' },
  },
  {
    key: 'creditPerReport', group: 'collab', mode: 'activity', format: 'decimal', advancedOnly: true, toConfirm: true, appliesWhen: 'measurementModel=reports|hybrid',
    category: 'measurement', dataType: 'price',
    section: { en: 'Measurement', it: 'Measurement' },
    label: { en: 'Credits per external report', it: 'Credits per report esterno' },
    impacts: { en: 'Report-based measurement burn-rate', it: 'Burn-rate measurement su report' },
    source: { en: 'Illustrative (quote-only)', it: 'Illustrativo (quote-only)' },
    calc: { en: 'Credits per external measurement report', it: 'Credits per report di measurement esterno' },
    assumption: { en: '0.5 credit / report — placeholder', it: '0,5 credit / report — segnaposto' },
  },
  // ── Unit price ──
  {
    key: 'pricePerCredit', group: 'collab', format: 'currency', toConfirm: true,
    category: 'pricing', dataType: 'price',
    section: { en: 'Unit price', it: 'Prezzo unitario' },
    label: { en: 'Price per credit', it: 'Prezzo per credito' },
    impacts: { en: 'Collaboration cost', it: 'Costo Collaboration' },
    source: { en: 'Illustrative analyst estimate — Adobe pricing is quote-only', it: 'Stima illustrativa — il prezzo Adobe è solo da preventivo' },
    calc: { en: '€ per Collaboration Credit', it: '€ per Collaboration Credit' },
    assumption: { en: '€3.00 / credit placeholder — replace with the Sales Order value', it: '€3,00 / credit segnaposto — sostituire con il valore del Sales Order' },
  },

  // ══════════════ CJA ══════════════
  {
    key: 'cjaIngestionMultiplier', group: 'cja', format: 'decimal', advancedOnly: true,
    category: 'row-conversion', dataType: 'official',
    section: { en: 'Global', it: 'Globale' },
    label: { en: 'Ingestion multiplier', it: 'Moltiplicatore ingestion' },
    impacts: { en: 'Annual Ingestion Limit', it: 'Limite ingestion annuo' },
    source: { en: 'CJA Guardrails — official constant', it: 'CJA Guardrails — costante ufficiale' },
    calc: { en: 'Annual Ingestion Limit = licensed rows × this', it: 'Limite ingestion annuo = righe licenziate × questo' },
    assumption: { en: '3× — the standard guardrail', it: '3× — il guardrail standard' },
  },
  // ── Web ──
  {
    key: 'webVisitsPerYear', group: 'cja', format: 'int',
    category: 'source-volume', dataType: 'customer-assumption',
    section: { en: 'Web', it: 'Web' },
    label: { en: 'Web visits / year', it: 'Visite web / anno' },
    impacts: { en: 'Web rows', it: 'Righe web' },
    source: { en: 'ferrari.com ~2.7M visits/mo (Similarweb, 2024–25) × 12', it: 'ferrari.com ~2,7M visite/mese (Similarweb, 2024–25) × 12' },
    calc: { en: '2.7M × 12', it: '2,7M × 12' },
    assumption: { en: '±30% panel estimate; a dedicated Scuderia property would have separate traffic', it: 'stima panel ±30%; una property Scuderia dedicata avrebbe traffico separato' },
  },
  {
    key: 'webHitsPerVisit', group: 'cja', format: 'int',
    category: 'row-conversion', dataType: 'default-assumption',
    section: { en: 'Web', it: 'Web' },
    label: { en: 'Hits per visit', it: 'Hit per visita' },
    impacts: { en: 'Web rows', it: 'Righe web' },
    source: { en: 'Analytics benchmark for media/content sites', it: 'Benchmark analytics per siti media/content' },
    calc: { en: 'Average tracked interactions per visit (pageviews + clicks)', it: 'Interazioni tracciate medie per visita (pageview + click)' },
    assumption: { en: '8 hits / visit', it: '8 hit / visita' },
  },
  // ── App (to confirm) ──
  {
    key: 'appMau', group: 'cja', format: 'int', toConfirm: true,
    category: 'source-volume', dataType: 'customer-assumption',
    section: { en: 'App', it: 'App' },
    label: { en: 'App MAU', it: 'App MAU' },
    impacts: { en: 'App rows', it: 'Righe app' },
    source: { en: 'No public Ferrari app MAU — inferred as ~4% of brand IG (32M)', it: 'Nessun dato pubblico su MAU app Ferrari — inferito come ~4% dell’IG brand (32M)' },
    calc: { en: '0.04 × 32M ≈ 1.5M', it: '0,04 × 32M ≈ 1,5M' },
    assumption: { en: '1.5M MAU — client to confirm (high-impact variable)', it: '1,5M MAU — da confermare col cliente (variabile ad alto impatto)' },
  },
  {
    key: 'appEventsPerMauPerMonth', group: 'cja', format: 'int',
    category: 'row-conversion', dataType: 'default-assumption',
    section: { en: 'App', it: 'App' },
    label: { en: 'App events / MAU / month', it: 'Eventi app / MAU / mese' },
    impacts: { en: 'App rows', it: 'Righe app' },
    source: { en: 'App analytics benchmark', it: 'Benchmark analytics app' },
    calc: { en: 'Behavioural events per active user per month', it: 'Eventi comportamentali per utente attivo/mese' },
    assumption: { en: '30 events / MAU / month', it: '30 eventi / MAU / mese' },
  },
  // ── Social ──
  {
    key: 'socialAudience', group: 'cja', format: 'int',
    category: 'source-volume', dataType: 'customer-assumption',
    section: { en: 'Social', it: 'Social' },
    label: { en: 'Social audience', it: 'Audience social' },
    impacts: { en: 'Social rows', it: 'Righe social' },
    source: { en: 'Scuderia Ferrari social aggregate ~35M (Motorsport Week, Mar 2025)', it: 'Aggregato social Scuderia Ferrari ~35M (Motorsport Week, mar 2025)' },
    calc: { en: 'Sum of cross-platform followers', it: 'Somma dei follower cross-platform' },
    assumption: { en: 'Followers are not 1st-party identities; only a share is matchable', it: 'I follower non sono identità 1st-party; solo una quota è matchabile' },
  },
  {
    key: 'socialActivePct', group: 'cja', format: 'percent',
    category: 'row-conversion', dataType: 'default-assumption',
    section: { en: 'Social', it: 'Social' },
    label: { en: 'Active share', it: 'Quota attiva' },
    impacts: { en: 'Social rows', it: 'Righe social' },
    source: { en: 'Social engagement benchmark', it: 'Benchmark engagement social' },
    calc: { en: 'Share of followers active per month', it: 'Quota di follower attivi al mese' },
    assumption: { en: '10% monthly-active', it: '10% monthly-active' },
  },
  {
    key: 'socialActionsPerActivePerMonth', group: 'cja', format: 'int',
    category: 'row-conversion', dataType: 'default-assumption',
    section: { en: 'Social', it: 'Social' },
    label: { en: 'Social actions / active / month', it: 'Azioni social / attivo / mese' },
    impacts: { en: 'Social rows', it: 'Righe social' },
    source: { en: 'Social engagement benchmark', it: 'Benchmark engagement social' },
    calc: { en: 'Tracked actions per active follower per month', it: 'Azioni tracciate per follower attivo/mese' },
    assumption: { en: '6 actions / active / month', it: '6 azioni / attivo / mese' },
  },
  // ── CRM (to confirm) ──
  {
    key: 'crmProfiles', group: 'cja', format: 'int', toConfirm: true,
    category: 'source-volume', dataType: 'customer-assumption',
    section: { en: 'CRM', it: 'CRM' },
    label: { en: 'CRM profiles', it: 'Profili CRM' },
    impacts: { en: 'CRM rows', it: 'Righe CRM' },
    source: { en: 'No public CRM size — inferred from the registered-fan base', it: 'Nessun dato pubblico sul CRM — inferito sulla base dei fan registrati' },
    calc: { en: 'Addressable marketing profiles', it: 'Profili di marketing indirizzabili' },
    assumption: { en: '3M profiles — client to confirm', it: '3M profili — da confermare col cliente' },
  },
  {
    key: 'crmEventsPerProfilePerYear', group: 'cja', format: 'int',
    category: 'row-conversion', dataType: 'default-assumption',
    section: { en: 'CRM', it: 'CRM' },
    label: { en: 'CRM events / profile / year', it: 'Eventi CRM / profilo / anno' },
    impacts: { en: 'CRM rows', it: 'Righe CRM' },
    source: { en: 'Email / journey cadence', it: 'Cadenza email / journey' },
    calc: { en: 'CRM events per profile per year', it: 'Eventi CRM per profilo/anno' },
    assumption: { en: '24 (≈ 2 / month)', it: '24 (≈ 2 / mese)' },
  },
  // ── Events ──
  {
    key: 'eventsRowsPerYear', group: 'cja', format: 'int',
    category: 'source-volume', dataType: 'customer-assumption',
    section: { en: 'Events & eSports', it: 'Eventi ed eSports' },
    label: { en: 'Events / eSports rows / year', it: 'Righe eventi / eSports / anno' },
    impacts: { en: 'Events rows', it: 'Righe eventi' },
    source: { en: 'GP + Fan Token + eSports touchpoints', it: 'Touchpoint GP + Fan Token + eSports' },
    calc: { en: 'On-site / eSports events per year', it: 'Eventi on-site / eSports per anno' },
    assumption: { en: '30M events / year', it: '30M eventi / anno' },
  },
  {
    key: 'pricePerMillionRows', group: 'cja', format: 'currency', toConfirm: true,
    category: 'pricing', dataType: 'price',
    section: { en: 'Unit price', it: 'Prezzo unitario' },
    label: { en: 'Price per 1M rows', it: 'Prezzo per 1M righe' },
    impacts: { en: 'CJA cost', it: 'Costo CJA' },
    source: { en: 'Illustrative analyst estimate — CJA pricing is quote-only', it: 'Stima illustrativa — il prezzo CJA è solo da preventivo' },
    calc: { en: '€ per 1M Rows of Data', it: '€ per 1M Rows of Data' },
    assumption: { en: '€2.00 / 1M rows placeholder — replace with the Sales Order value', it: '€2,00 / 1M righe segnaposto — sostituire con il valore del Sales Order' },
  },
];

// Semantic badge labels (shown next to each field) — bilingual.
export const DATA_TYPE_LABELS: Record<DataType, { en: string; it: string }> = {
  official: { en: 'Official', it: 'Ufficiale' },
  'default-assumption': { en: 'Assumption', it: 'Assunzione' },
  'customer-assumption': { en: 'Customer input', it: 'Input cliente' },
  price: { en: 'Quote-only', it: 'Da preventivo' },
};

// ── The two in-scope licensing metrics, explained with worked examples. ──
export interface MetricExplainer {
  product: { en: string; it: string };
  metric: { en: string; it: string };
  what: { en: string; it: string };
  consumes: { en: string; it: string }[];
  example: { en: string; it: string };
}

export const METRICS: MetricExplainer[] = [
  {
    product: { en: 'Real-Time CDP Collaboration', it: 'Real-Time CDP Collaboration' },
    metric: { en: 'Collaboration Credits', it: 'Collaboration Credits' },
    what: {
      en: 'The license metric for Real-Time CDP Collaboration. A finite pool of credits is consumed as you run collaboration activities with partners.',
      it: 'La metrica di licenza di Real-Time CDP Collaboration. Un pool finito di credits viene consumato man mano che esegui attività di collaboration con i partner.',
    },
    consumes: [
      { en: 'Audience management — managed IDs × refresh cadence (daily / every 3 days / weekly)', it: 'Gestione audience — ID gestiti × cadenza di refresh (giornaliera / ogni 3 giorni / settimanale)' },
      { en: 'Activation — activated volume × runs, one-time or recurring (never summed unless Mixed)', it: 'Attivazione — volume attivato × run, one-time o ricorrente (mai sommate salvo Mista)' },
      { en: 'Measurement — records-based, report-based or hybrid', it: 'Measurement — su record, su report o ibrido' },
    ],
    example: {
      en: 'e.g. management 5×(5.25M÷1M)×52×0.1 ≈ 137 + activation 24×(5.25M÷1M)×0.1 ≈ 13 + measurement ≈ 3 → ~152 credits/yr. Minus the Prime allotment (2,500) → 0 billable this year.',
      it: 'es. gestione 5×(5,25M÷1M)×52×0,1 ≈ 137 + attivazione 24×(5,25M÷1M)×0,1 ≈ 13 + measurement ≈ 3 → ~152 credit/anno. Meno l’allotment Prime (2.500) → 0 fatturabili quest’anno.',
    },
  },
  {
    product: { en: 'Customer Journey Analytics', it: 'Customer Journey Analytics' },
    metric: { en: 'Rows of Data', it: 'Rows of Data' },
    what: {
      en: 'The license metric for CJA: the rows of data available for analysis, where 1 row = 0.25 KB. Every customer event — web, app, social, CRM — becomes rows.',
      it: 'La metrica di licenza di CJA: le righe di dati disponibili per l’analisi, dove 1 riga = 0,25 KB. Ogni evento cliente — web, app, social, CRM — diventa righe.',
    },
    consumes: [
      { en: 'Licensed rows = the contracted Rows of Data available to report on (rolling 13-month Core Data window)', it: 'Righe licenziate = le Rows of Data contrattualizzate disponibili per il reporting (finestra Core Data a 13 mesi mobile)' },
      { en: 'Annual Ingestion Limit — you may ingest up to 3× the licensed rows per year', it: 'Annual Ingestion Limit — puoi ingerire fino a 3× le righe licenziate all’anno' },
      { en: 'History beyond 13 months needs the Extended Data Capacity add-on', it: 'Lo storico oltre i 13 mesi richiede l’add-on Extended Data Capacity' },
    ],
    example: {
      en: 'e.g. 32M web visits × 8 hits = 256M rows/yr from web alone. Sum across web, app, social, CRM and events → total licensed rows. Ingestion stays ≤ 3× that.',
      it: 'es. 32M visite web × 8 hit = 256M righe/anno dal solo web. Sommando web, app, social, CRM ed eventi → righe totali licenziate. L’ingestion resta ≤ 3× quel valore.',
    },
  },
];

export type RigorTag = 'fact' | 'inference' | 'sales-order';

export const RIGOR_LABELS: Record<RigorTag, { en: string; it: string }> = {
  fact: { en: 'Documented fact', it: 'Fatto documentato' },
  inference: { en: 'Reasoned inference', it: 'Inferenza ragionata' },
  'sales-order': { en: 'Confirm on Sales Order', it: 'Da confermare (Sales Order)' },
};

export interface AssumptionMeta {
  key: string;
  en: string;
  it: string;
  tag: RigorTag;
  sourceEn?: string;
  sourceIt?: string;
}

export const ASSUMPTION_META: AssumptionMeta[] = [
  { key: 'metric-collab', tag: 'fact', en: 'Collaboration metric = Collaboration Credits', it: 'Metrica Collaboration = Collaboration Credits', sourceEn: 'Adobe Product Description', sourceIt: 'Product Description Adobe' },
  { key: 'allotment', tag: 'fact', en: 'Bundled one-time allotment: 2,500 (Prime) / 5,000 (Ultimate)', it: 'Allotment one-time incluso: 2.500 (Prime) / 5.000 (Ultimate)', sourceEn: 'RT-CDP Prime/Ultimate PD', sourceIt: 'PD RT-CDP Prime/Ultimate' },
  { key: 'metric-cja', tag: 'fact', en: 'CJA metric = Rows of Data (1 row = 0.25 KB)', it: 'Metrica CJA = Rows of Data (1 riga = 0,25 KB)', sourceEn: 'CJA Product Description', sourceIt: 'Product Description CJA' },
  { key: 'ingestion', tag: 'fact', en: 'Annual Ingestion Limit ≤ 3× licensed rows', it: 'Annual Ingestion Limit ≤ 3× righe licenziate', sourceEn: 'CJA Guardrails', sourceIt: 'CJA Guardrails' },
  { key: 'independence', tag: 'inference', en: 'Independent licensing — no dependency between the two', it: 'Licensing indipendente — nessuna dipendenza tra i due', sourceEn: 'Two separate Product Descriptions', sourceIt: 'Due Product Description separate' },
  { key: 'funnel', tag: 'inference', en: 'Audience funnel: distinct → overlap → activated / measured', it: 'Funnel audience: distinta → overlap → attivata / misurata', sourceEn: 'Clean-room match-rate benchmarks', sourceIt: 'Benchmark match-rate clean-room' },
  { key: 'volumes', tag: 'inference', en: 'Ferrari volumes derived from public footprint', it: 'Volumi Ferrari derivati dal footprint pubblico', sourceEn: 'Nielsen / Similarweb / partner list', sourceIt: 'Nielsen / Similarweb / lista partner' },
  { key: 'burn-rate', tag: 'sales-order', en: 'Credit burn-rates & unit prices are quote-only', it: 'Burn-rate credito e prezzi unitari solo da preventivo', sourceEn: 'Sales Order / Credit Consumption Table', sourceIt: 'Sales Order / Credit Consumption Table' },
  { key: 'app-crm', tag: 'sales-order', en: 'App MAU & CRM size: client to confirm', it: 'App MAU e dimensione CRM: da confermare col cliente' },
];

export const DISCLAIMER = {
  it: 'Stima illustrativa basata su assunzioni dichiarate e su capability pubbliche Adobe. Non sostituisce un Sales Order o i PSLT applicabili. Prezzi unitari e burn-rate dei crediti da definire contrattualmente.',
  en: 'Illustrative estimate based on stated assumptions and public Adobe capabilities. It does not replace a Sales Order or applicable PSLT. Unit prices and credit burn-rates to be defined contractually.',
};
