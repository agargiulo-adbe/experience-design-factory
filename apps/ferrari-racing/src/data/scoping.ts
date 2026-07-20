import type { Scenario } from '@edf/core/blocks/scoping/scenario';
import { DEFAULT_ASSUMPTIONS } from '@edf/core/blocks/scoping/scenario';

// ─────────────────────────────────────────────────────────────────────
//  RT-CDP Collaboration inputs mirror Adobe's official "Real-Time CDP
//  Collaboration Scoping Calculator" (Sales Calculator + hidden burn/assump
//  sheet). Burn rates (mgmt 2 · activation 500 · always-on 100 · measurement
//  50 credits per 1M) and the default assumptions (match 30% · reach 50% ·
//  frequency 10× · conversion 5%) are OFFICIAL constants baked into the engine
//  (see cost-model.ts BURN / ASSUMPTION_DEFAULTS), not tunable placeholders.
//  The model computes licence VOLUMES only (credits / rows) — no Adobe list
//  prices; the cost per instance is a user-set hypothesis (standalone scenario).
//  Ferrari volume figures are reasoned inferences from public
//  footprint research (F1 826.5M fans · Scuderia social ~35M · ferrari.com
//  ~2.7M/mo). CJA (Rows of Data) is a second, independent product and is NOT
//  part of the Adobe workbook.
// ─────────────────────────────────────────────────────────────────────

// Instance costs are user-set hypotheses (no Adobe list prices modelled):
// a cost for the Ferrari instance (editable) and 0 per partner instance (editable).
const ILLUSTRATIVE_PRICES = { currency: 'EUR', ferrariInstanceCost: 100_000, partnerInstanceCost: 0 };

// ── Scenario presets (Conservative / Base / Aggressive). Each is a delta
//    over DEFAULT_ASSUMPTIONS; the calculator surfaces them as chips. ──
export const SEED_SCENARIOS: Scenario[] = [
  {
    title: 'Conservativo / Conservative', preset: 'conservative', visibility: 'private',
    prices: { ...ILLUSTRATIVE_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      collabMode: 'detailed',
      partnerInstances: 1,
      partnerOnboardedIds: 1_000_000, partnerAvgAudienceSize: 150_000, partnerAdHocCampaignsPerYear: 2,
      refreshMode: 'campaign-linked', refreshesPerCampaign: 1,
      onboardedIds: 5_000_000, avgAudienceSize: 500_000, matchRate: 0.25,
      refreshEveryXDays: 6, adHocCampaignsPerYear: 3, audiencesPerCampaign: 1,
      alwaysOnRunsPerYear: 0,
      measurementEnabled: true, measurementCampaignsPerYear: 2,
      summaryReportsPerCampaign: 1, attributionReportsPerCampaign: 1,
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
    assumptions: { ...DEFAULT_ASSUMPTIONS }, // 10M onboarded / 1M audience / 30% match / every 6 days / 1 campaign
  },
  {
    title: 'Ambizioso / Aggressive', preset: 'aggressive', visibility: 'private',
    prices: { ...ILLUSTRATIVE_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      collabMode: 'detailed',
      partnerInstances: 8,
      partnerOnboardedIds: 4_000_000, partnerAvgAudienceSize: 600_000, partnerAdHocCampaignsPerYear: 6,
      refreshMode: 'continuous', refreshesPerCampaign: 1,
      onboardedIds: 40_000_000, avgAudienceSize: 4_000_000, matchRate: 0.4,
      refreshEveryXDays: 3, adHocCampaignsPerYear: 12, audiencesPerCampaign: 2,
      alwaysOnRunsPerYear: 52,
      measurementEnabled: true, measurementCampaignsPerYear: 12,
      summaryReportsPerCampaign: 2, attributionReportsPerCampaign: 2,
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
  | 'source-volume' | 'row-conversion' | 'governance'
  | 'perimeter' | 'party';

export interface FieldOption { value: string; label: { en: string; it: string } }

export interface FieldAudit {
  key: string;                  // ScopingAssumptions field or a price key
  group: FieldGroup;
  section: { en: string; it: string };
  label: { en: string; it: string };
  format: FieldFormat;
  input?: FieldInput;           // default 'number'; 'select' → renders a dropdown
  options?: FieldOption[];      // when input === 'select'
  mode?: string;                // Collaboration-only: which estimation mode(s) show it (pipe-separated)
  category?: FieldCategory;
  dataType?: DataType;          // default 'default-assumption'
  advancedOnly?: boolean;       // hidden until "Advanced assumptions" is opened
  appliesWhen?: string;         // 'key=v1|v2' — show only when assumptions[key] ∈ {v…}
  impacts?: { en: string; it: string }; // which outputs this variable drives
  hint?: { en: string; it: string };    // one-line impact shown INLINE under the input
  toConfirm?: boolean;          // illustrative / client-to-confirm → amber marker
  source: { en: string; it: string };
  calc: { en: string; it: string };
  assumption: { en: string; it: string };
}

const SIMPLE_DETAILED = 'simple|detailed';

const REFRESH_MODE_OPTIONS: FieldOption[] = [
  { value: 'continuous', label: { en: 'Continuous (always-on)', it: 'Continuo (always-on)' } },
  { value: 'campaign-linked', label: { en: 'Around campaigns only', it: 'Solo a ridosso delle campagne' } },
];

const PERIMETER = { en: 'Perimeter & instances', it: 'Perimetro & istanze' };

export const FIELD_AUDIT: FieldAudit[] = [
  // ══════════════ PERIMETER & INSTANCES ══════════════
  // 1 Ferrari Racing instance + N partner instances (all standalone). Volumes drive
  // the credit estimate; the per-instance cost is a user-set hypothesis (editable).
  {
    key: 'ferrariInstanceCost', group: 'collab', format: 'currency',
    category: 'party', dataType: 'customer-assumption',
    section: PERIMETER,
    label: { en: 'Ferrari instance cost / yr', it: 'Costo istanza Ferrari / anno' },
    hint: { en: 'Your cost hypothesis for the Ferrari instance — set it as you like.', it: 'La tua ipotesi di costo per l’istanza Ferrari — impostala come preferisci.' },
    impacts: { en: 'Total cost (Ferrari instance)', it: 'Costo totale (istanza Ferrari)' },
    source: { en: 'Your assumption — no Adobe list price', it: 'Tua assunzione — nessun prezzo di listino Adobe' },
    calc: { en: 'Flat annual cost you attribute to the Ferrari instance', it: 'Costo annuo flat che attribuisci all’istanza Ferrari' },
    assumption: { en: 'A round placeholder — replace with your own figure', it: 'Un valore segnaposto — sostituiscilo con la tua cifra' },
  },
  {
    key: 'partnerInstances', group: 'collab', format: 'int',
    category: 'perimeter', dataType: 'customer-assumption',
    section: PERIMETER,
    label: { en: 'Partner instances', it: 'Istanze partner' },
    hint: { en: 'One Collaboration instance per sponsor — multiplies the partner cost below.', it: 'Una istanza Collaboration per sponsor — moltiplica il costo partner qui sotto.' },
    impacts: { en: 'Multiplies the per-partner cost by N', it: 'Moltiplica il costo per-partner per N' },
    source: { en: 'Scuderia Ferrari HP partner roster', it: 'Roster partner Scuderia Ferrari HP' },
    calc: { en: 'Number of partner sponsors each running their own instance', it: 'Numero di partner sponsor, ciascuno con la propria istanza' },
    assumption: { en: '3 partners by default — set to your sponsor count', it: '3 partner di default — imposta il tuo numero di sponsor' },
  },
  {
    key: 'partnerInstanceCost', group: 'collab', format: 'currency',
    category: 'party', dataType: 'customer-assumption',
    section: PERIMETER,
    label: { en: 'Cost per partner instance / yr', it: 'Costo per istanza partner / anno' },
    hint: { en: 'Cost per partner instance — 0 by default; edit if partners are charged.', it: 'Costo per istanza partner — 0 di default; modificalo se i partner hanno un costo.' },
    impacts: { en: 'Total cost = Ferrari + (this × partner instances)', it: 'Costo totale = Ferrari + (questo × istanze partner)' },
    source: { en: 'Your assumption — no Adobe list price', it: 'Tua assunzione — nessun prezzo di listino Adobe' },
    calc: { en: 'Flat annual cost per partner instance', it: 'Costo annuo flat per istanza partner' },
    assumption: { en: '0 by default — editable', it: '0 di default — modificabile' },
  },
  {
    key: 'partnerAdHocCampaignsPerYear', group: 'collab', format: 'int', advancedOnly: true,
    category: 'perimeter', dataType: 'customer-assumption',
    section: PERIMETER,
    label: { en: 'Campaigns / partner / yr', it: 'Campagne / partner / anno' },
    impacts: { en: 'Partner activation credits (per instance)', it: 'Credits di attivazione partner (per istanza)' },
    source: { en: 'Sponsor activation plan', it: 'Piano di attivazione sponsor' },
    calc: { en: 'Ad-hoc campaigns a typical partner runs per year', it: 'Campagne ad-hoc che un partner tipo lancia in un anno' },
    assumption: { en: '3 per partner by default', it: '3 per partner di default' },
  },
  {
    key: 'partnerOnboardedIds', group: 'collab', format: 'int', advancedOnly: true,
    category: 'perimeter', dataType: 'customer-assumption',
    section: PERIMETER,
    label: { en: 'IDs onboarded / partner / yr', it: 'ID onboardati / partner / anno' },
    impacts: { en: 'Partner audience-management credits (per instance)', it: 'Credits di gestione audience partner (per istanza)' },
    source: { en: 'Typical sponsor 1st-party base', it: 'Base 1st-party di uno sponsor tipo' },
    calc: { en: 'Distinct identities a typical partner onboards', it: 'Identità distinte onboardate da un partner tipo' },
    assumption: { en: '2M per partner — lighter than Ferrari', it: '2M per partner — più leggera di Ferrari' },
  },
  {
    key: 'partnerAvgAudienceSize', group: 'collab', format: 'int', advancedOnly: true,
    category: 'perimeter', dataType: 'customer-assumption',
    section: PERIMETER,
    label: { en: 'Partner audience size', it: 'Dimensione audience partner' },
    impacts: { en: 'Partner activation & measurement volumes (per instance)', it: 'Volumi di attivazione e measurement partner (per istanza)' },
    source: { en: 'Campaign-planning assumption', it: 'Assunzione di pianificazione campagne' },
    calc: { en: 'Average activated audience per partner campaign', it: 'Audience media attivata per campagna partner' },
    assumption: { en: '300k per partner audience', it: '300k per audience partner' },
  },

  // ══════════════ COLLABORATION ══════════════
  // ── Direct scoping (direct mode only) ──
  {
    key: 'directCredits', group: 'collab', mode: 'direct', format: 'int',
    category: 'package', dataType: 'customer-assumption',
    section: { en: 'Direct scoping', it: 'Scoping diretto' },
    label: { en: 'Annual Collaboration Credits', it: 'Collaboration Credits annui' },
    impacts: { en: 'Estimated credits & recommended pack (bypasses the activity model)', it: 'Credits stimati e pacchetto consigliato (salta il modello ad attività)' },
    source: { en: 'Scoping estimate / Sales Order', it: 'Stima di scoping / Sales Order' },
    calc: { en: 'Credits scoped directly, bypassing the activity estimate', it: 'Credits scopati direttamente, senza stima da attività' },
    assumption: { en: '5,000 credits — placeholder to replace with the Sales Order', it: '5.000 credits — segnaposto da sostituire con il Sales Order' },
  },
  // ── Audience & funnel (simple + detailed) ──
  {
    key: 'onboardedIds', group: 'collab', mode: SIMPLE_DETAILED, format: 'int',
    category: 'audience', dataType: 'customer-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'IDs onboarded into Collaboration / yr', it: 'ID onboardati in Collaboration / anno' },
    impacts: { en: 'Audience transformation & management credits', it: 'Credits di trasformazione e gestione audience' },
    source: { en: 'Scuderia social ~35M + web + CRM, de-duplicated (Motorsport Week 2025 · Similarweb)', it: 'Social Scuderia ~35M + web + CRM, de-duplicati (Motorsport Week 2025 · Similarweb)' },
    calc: { en: 'Distinct hashed identities (email / phone / IP) onboarded per year', it: 'Identità hashate distinte (email / telefono / IP) onboardate per anno' },
    assumption: { en: '~10M after cross-platform de-dup — followers are not all matchable identities', it: '~10M dopo de-dup cross-platform — i follower non sono tutti identità matchabili' },
  },
  {
    key: 'avgAudienceSize', group: 'collab', mode: SIMPLE_DETAILED, format: 'int',
    category: 'audience', dataType: 'customer-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Average audience size', it: 'Dimensione media audience' },
    hint: { en: 'Audience size × match rate = matched audience — the base that activation & measurement credits are counted on.', it: 'Dimensione audience × match rate = audience matchata — la base su cui si contano i credits di attivazione e measurement.' },
    impacts: { en: 'Matched audience → activation & measurement volumes', it: 'Audience matchata → volumi di attivazione e measurement' },
    source: { en: 'Campaign-planning assumption (≈10% of onboarded by default)', it: 'Assunzione di pianificazione campagne (≈10% degli onboardati di default)' },
    calc: { en: 'Average size of an activated / measured audience', it: 'Dimensione media di un’audience attivata / misurata' },
    assumption: { en: '~1M per audience', it: '~1M per audience' },
  },
  {
    key: 'matchRate', group: 'collab', mode: SIMPLE_DETAILED, format: 'percent',
    category: 'overlap', dataType: 'default-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Match rate', it: 'Match rate' },
    hint: { en: 'Share of the audience that overlaps the partner’s data in the clean room. Lower match → fewer matched users → lower activation/measurement credits.', it: 'Quota di audience che si sovrappone ai dati del partner nella clean room. Match più basso → meno utenti matchati → meno credits di attivazione/measurement.' },
    impacts: { en: 'Matched audience = average audience × match rate', it: 'Audience matchata = audience media × match rate' },
    source: { en: 'Adobe calculator default — 30% recommendation', it: 'Default del calcolatore Adobe — raccomandazione 30%' },
    calc: { en: 'Share of the audience that matches partner data (clean-room)', it: 'Quota di audience che matcha con i dati partner (clean-room)' },
    assumption: { en: '30% — the workbook default; varies materially by partner', it: '30% — il default del workbook; varia molto per partner' },
  },
  // ── Funnel rates (advanced — used by measurement) ──
  {
    key: 'frequencyMultiple', group: 'collab', mode: SIMPLE_DETAILED, format: 'decimal', advancedOnly: true,
    category: 'overlap', dataType: 'default-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Frequency multiple', it: 'Moltiplicatore di frequenza' },
    impacts: { en: 'Impressions per campaign (drives measurement)', it: 'Impression per campagna (guida il measurement)' },
    source: { en: 'Adobe calculator default — 10× recommendation', it: 'Default del calcolatore Adobe — raccomandazione 10×' },
    calc: { en: 'Impressions = matched × frequency × reach', it: 'Impression = matchata × frequenza × reach' },
    assumption: { en: '10× by default', it: '10× di default' },
  },
  {
    key: 'reachPct', group: 'collab', mode: SIMPLE_DETAILED, format: 'percent', advancedOnly: true,
    category: 'overlap', dataType: 'default-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Reach', it: 'Reach' },
    impacts: { en: 'Impressions & conversions per campaign', it: 'Impression e conversioni per campagna' },
    source: { en: 'Adobe calculator default — 50% recommendation', it: 'Default del calcolatore Adobe — raccomandazione 50%' },
    calc: { en: 'Share of the matched audience reached', it: 'Quota di audience matchata raggiunta' },
    assumption: { en: '50% by default', it: '50% di default' },
  },
  {
    key: 'conversionRate', group: 'collab', mode: SIMPLE_DETAILED, format: 'percent', advancedOnly: true,
    category: 'overlap', dataType: 'default-assumption',
    section: { en: 'Audience & funnel', it: 'Audience e funnel' },
    label: { en: 'Conversion rate', it: 'Tasso di conversione' },
    impacts: { en: 'Conversions per campaign (drives attribution measurement)', it: 'Conversioni per campagna (guida il measurement di attribution)' },
    source: { en: 'Adobe calculator default — 5% recommendation', it: 'Default del calcolatore Adobe — raccomandazione 5%' },
    calc: { en: 'Conversions = matched × reach × conversion rate', it: 'Conversioni = matchata × reach × tasso di conversione' },
    assumption: { en: '5% by default', it: '5% di default' },
  },
  // ── Audience management (detailed) ──
  {
    key: 'refreshMode', group: 'collab', mode: 'detailed', input: 'select', options: REFRESH_MODE_OPTIONS, format: 'int',
    category: 'management', dataType: 'customer-assumption',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Refresh mode', it: 'Modalità di refresh' },
    hint: { en: 'Continuous keeps audiences match-ready all year (Adobe default). Around-campaigns refreshes only near each campaign — fewer credits when you run just a handful.', it: 'Continuo tiene le audience sempre pronte al match (default Adobe). A ridosso delle campagne fa il refresh solo vicino a ogni campagna — meno credits se ne fai poche.' },
    impacts: { en: 'How many refreshes/yr drive the management credits', it: 'Quanti refresh/anno guidano i credits di gestione' },
    source: { en: 'Modelling choice on top of the Adobe cadence input', it: 'Scelta di modellazione sopra l’input di cadenza Adobe' },
    calc: { en: 'Continuous = 365 ÷ days; around-campaigns = campaigns × refreshes/campaign', it: 'Continuo = 365 ÷ giorni; a ridosso = campagne × refresh/campagna' },
    assumption: { en: 'Continuous by default — mirrors the Adobe workbook', it: 'Continuo di default — rispecchia il workbook Adobe' },
  },
  {
    key: 'refreshEveryXDays', group: 'collab', mode: 'detailed', format: 'int', appliesWhen: 'refreshMode=continuous',
    category: 'management', dataType: 'default-assumption',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Refresh every X days (1–6)', it: 'Refresh ogni X giorni (1–6)' },
    impacts: { en: 'Refreshes/yr = 365 ÷ X → management credits', it: 'Refresh/anno = 365 ÷ X → credits di gestione' },
    source: { en: 'Adobe calculator input (range 1–6 days)', it: 'Input del calcolatore Adobe (range 1–6 giorni)' },
    calc: { en: 'How often the onboarded audience is transformed / re-indexed', it: 'Con che frequenza l’audience onboardata viene trasformata / re-indicizzata' },
    assumption: { en: 'Every 6 days (≈61 refreshes/yr) — the workbook default', it: 'Ogni 6 giorni (≈61 refresh/anno) — il default del workbook' },
  },
  {
    key: 'refreshesPerCampaign', group: 'collab', mode: 'detailed', format: 'int', appliesWhen: 'refreshMode=campaign-linked',
    category: 'management', dataType: 'customer-assumption',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Refreshes per campaign', it: 'Refresh per campagna' },
    hint: { en: 'How many times you refresh the audience around each campaign. Refreshes/yr = campaigns × this.', it: 'Quante volte aggiorni l’audience a ridosso di ogni campagna. Refresh/anno = campagne × questo.' },
    impacts: { en: 'Refreshes/yr (campaign-linked) → management credits', it: 'Refresh/anno (legato alle campagne) → credits di gestione' },
    source: { en: 'Campaign-preparation assumption', it: 'Assunzione di preparazione campagna' },
    calc: { en: 'Refreshes fired in the run-up to each campaign', it: 'Refresh eseguiti a ridosso di ogni campagna' },
    assumption: { en: '1 refresh per campaign', it: '1 refresh per campagna' },
  },
  // ── Activation (detailed) ──
  {
    key: 'adHocCampaignsPerYear', group: 'collab', mode: 'detailed', format: 'int',
    category: 'activation', dataType: 'customer-assumption',
    section: { en: 'Activation', it: 'Attivazione' },
    label: { en: 'Ad-hoc campaigns / year', it: 'Campagne ad-hoc / anno' },
    hint: { en: 'One-off activations — a livery launch, a home-GP push. (Continuous “always-on” programmes are the separate field below.)', it: 'Attivazioni one-off — un lancio livrea, una spinta per il GP di casa. (I programmi continui “always-on” sono il campo separato più sotto.)' },
    impacts: { en: 'Ad-hoc activation credits', it: 'Credits di attivazione ad-hoc' },
    source: { en: '2026 F1 calendar / tent-pole moments', it: 'Calendario F1 2026 / momenti tent-pole' },
    calc: { en: 'One-time (ad hoc) activation campaigns per year', it: 'Campagne di attivazione one-time (ad hoc) per anno' },
    assumption: { en: '1 by default — raise for a fuller activation plan', it: '1 di default — alzalo per un piano di attivazione più ricco' },
  },
  {
    key: 'audiencesPerCampaign', group: 'collab', mode: 'detailed', format: 'int', advancedOnly: true,
    category: 'activation', dataType: 'default-assumption',
    section: { en: 'Activation', it: 'Attivazione' },
    label: { en: 'Audiences per campaign', it: 'Audience per campagna' },
    impacts: { en: 'Multiplies ad-hoc activation credits', it: 'Moltiplica i credits di attivazione ad-hoc' },
    source: { en: 'Campaign-plan assumption', it: 'Assunzione di piano campagne' },
    calc: { en: 'Audiences targeted per campaign (excluding always-on)', it: 'Audience targettizzate per campagna (escluse le always-on)' },
    assumption: { en: '1 by default', it: '1 di default' },
  },
  {
    key: 'alwaysOnRunsPerYear', group: 'collab', mode: 'detailed', format: 'int', advancedOnly: true,
    category: 'activation', dataType: 'default-assumption',
    section: { en: 'Activation', it: 'Attivazione' },
    label: { en: 'Always-on activation runs / year', it: 'Run di attivazione always-on / anno' },
    impacts: { en: 'Always-on (weekly) activation credits', it: 'Credits di attivazione always-on (settimanale)' },
    source: { en: 'Adobe calculator burn rate (100 / 1M / run)', it: 'Burn rate del calcolatore Adobe (100 / 1M / run)' },
    calc: { en: 'Always-on activation cadence per year (e.g. 52 = weekly)', it: 'Cadenza di attivazione always-on per anno (es. 52 = settimanale)' },
    assumption: { en: '0 by default — set 52 for a weekly always-on programme', it: '0 di default — imposta 52 per un programma always-on settimanale' },
  },
  // ── Measurement (detailed) ──
  {
    key: 'measurementCampaignsPerYear', group: 'collab', mode: 'detailed', format: 'int', appliesWhen: 'measurementEnabled=true',
    category: 'measurement', dataType: 'customer-assumption',
    section: { en: 'Measurement', it: 'Measurement' },
    label: { en: 'Measured campaigns / year', it: 'Campagne misurate / anno' },
    impacts: { en: 'Summary-statistics & attribution measurement credits', it: 'Credits di measurement summary-statistics e attribution' },
    source: { en: 'Reporting plan', it: 'Piano di reporting' },
    calc: { en: 'Campaigns the customer runs measurement on per year', it: 'Campagne su cui il cliente esegue measurement per anno' },
    assumption: { en: '1 by default', it: '1 di default' },
  },
  {
    key: 'summaryReportsPerCampaign', group: 'collab', mode: 'detailed', format: 'int', advancedOnly: true, appliesWhen: 'measurementEnabled=true',
    category: 'measurement', dataType: 'default-assumption',
    section: { en: 'Measurement', it: 'Measurement' },
    label: { en: 'Summary-statistics reports / campaign', it: 'Report summary-statistics / campagna' },
    impacts: { en: 'Summary-statistics measurement credits', it: 'Credits di measurement summary-statistics' },
    source: { en: 'Reporting plan', it: 'Piano di reporting' },
    calc: { en: 'Standalone summary-statistics reports per campaign', it: 'Report summary-statistics standalone per campagna' },
    assumption: { en: '1 by default', it: '1 di default' },
  },
  {
    key: 'attributionReportsPerCampaign', group: 'collab', mode: 'detailed', format: 'int', advancedOnly: true, appliesWhen: 'measurementEnabled=true',
    category: 'measurement', dataType: 'default-assumption',
    section: { en: 'Measurement', it: 'Measurement' },
    label: { en: 'Attribution reports / campaign', it: 'Report di attribution / campagna' },
    impacts: { en: 'Attribution measurement credits', it: 'Credits di measurement di attribution' },
    source: { en: 'Reporting plan', it: 'Piano di reporting' },
    calc: { en: 'Attribution reports per campaign (include summary statistics)', it: 'Report di attribution per campagna (includono summary statistics)' },
    assumption: { en: '1 by default', it: '1 di default' },
  },
  // ── Simple scoping ──
  {
    key: 'simpleCampaignsPerYear', group: 'collab', mode: 'simple', format: 'int',
    category: 'activation', dataType: 'customer-assumption',
    section: { en: 'Activation', it: 'Attivazione' },
    label: { en: 'Total campaigns / year', it: 'Campagne totali / anno' },
    impacts: { en: 'Activation & measurement (simple scoping)', it: 'Attivazione e measurement (scoping rapido)' },
    source: { en: 'Adobe calculator campaign tiers (1 · 3 · 6 · 12 · 24 · 36)', it: 'Fasce campagne del calcolatore Adobe (1 · 3 · 6 · 12 · 24 · 36)' },
    calc: { en: 'Estimated annual total campaigns', it: 'Totale campagne annue stimate' },
    assumption: { en: '1 by default', it: '1 di default' },
  },

  // ══════════════ CJA (independent product — unchanged) ══════════════
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
      en: 'The license metric for Real-Time CDP Collaboration — a finite pool of credits burned by collaboration activities. It starts from a funnel: your audience × match rate = the matched audience, the base every activation and measurement is counted on. The estimate then rounds up to a recommended credit pack.',
      it: 'La metrica di licenza di Real-Time CDP Collaboration — un pool finito di credits bruciato dalle attività di collaboration. Parte da un funnel: la tua audience × match rate = l’audience matchata, la base su cui si contano attivazione e measurement. La stima si arrotonda poi a un pacchetto di crediti consigliato.',
    },
    consumes: [
      { en: 'Audience management — onboarded IDs × refreshes/yr × 2 credits/1M. Refresh can be continuous (always-on) or only around campaigns.', it: 'Gestione audience — ID onboardati × refresh/anno × 2 credits/1M. Il refresh può essere continuo (always-on) o solo a ridosso delle campagne.' },
      { en: 'Activation — matched audience × 500 credits/1M for ad-hoc campaigns (a launch, a home GP); always-on runs at 100/1M/run.', it: 'Attivazione — audience matchata × 500 credits/1M per le campagne ad-hoc (un lancio, il GP di casa); le run always-on a 100/1M/run.' },
      { en: 'Measurement — summary statistics on impressions + attribution on (impressions + conversions), at 50 credits/1M.', it: 'Measurement — summary statistics su impression + attribution su (impression + conversioni), a 50 credits/1M.' },
    ],
    example: {
      en: 'e.g. management (10M÷1M)×(365÷6)×2 ≈ 1,217 + activation (0.3M÷1M)×1×500 = 150 + measurement 75 + 75.375 → ~1,517 credits/yr → recommended pack 2,000.',
      it: 'es. gestione (10M÷1M)×(365÷6)×2 ≈ 1.217 + attivazione (0,3M÷1M)×1×500 = 150 + measurement 75 + 75,375 → ~1.517 credit/anno → pacchetto consigliato 2.000.',
    },
  },
  {
    product: { en: 'Customer Journey Analytics', it: 'Customer Journey Analytics' },
    metric: { en: 'Rows of Data', it: 'Rows of Data' },
    what: {
      en: 'The license metric for CJA: the rows of data available for analysis, where 1 row = 0.25 KB. Every customer event — web, app, social, CRM — becomes rows. Independent of Collaboration.',
      it: 'La metrica di licenza di CJA: le righe di dati disponibili per l’analisi, dove 1 riga = 0,25 KB. Ogni evento cliente — web, app, social, CRM — diventa righe. Indipendente da Collaboration.',
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

// ── The four things that make up the annual cost — with a worked Ferrari read. ──
export interface CostDriver {
  tag: { en: string; it: string };      // SKU / metric label
  title: { en: string; it: string };
  body: { en: string; it: string };
  ferrari: { en: string; it: string };  // how it reads for the Ferrari perimeter
}

export const COST_DRIVERS: CostDriver[] = [
  {
    tag: { en: 'Instances · perimeter', it: 'Istanze · perimetro' },
    title: { en: 'One instance per party', it: 'Una istanza per party' },
    body: {
      en: 'Ferrari runs its own Collaboration instance; each partner runs its own. Every instance is standalone.',
      it: 'Ferrari ha la propria istanza Collaboration; ogni partner la propria. Ogni istanza è standalone.',
    },
    ferrari: {
      en: 'With N partners the perimeter is 1 Ferrari instance + N partner instances.',
      it: 'Con N partner il perimetro è 1 istanza Ferrari + N istanze partner.',
    },
  },
  {
    tag: { en: 'Collaboration Credits', it: 'Collaboration Credits' },
    title: { en: 'A credit pool per instance', it: 'Un pool di crediti per istanza' },
    body: {
      en: 'Management + activation + measurement consume Collaboration Credits. It is the licence volume, not a price.',
      it: 'Gestione + attivazione + measurement consumano Collaboration Credits. È il volume di licenza, non un prezzo.',
    },
    ferrari: {
      en: 'Estimated credits round up to a recommended pack — a quantity you can read and compare.',
      it: 'I crediti stimati si arrotondano a un pacchetto consigliato — una quantità che puoi leggere e confrontare.',
    },
  },
  {
    tag: { en: 'CJA · Rows of Data', it: 'CJA · Rows of Data' },
    title: { en: 'One analytics instance, all partners', it: 'Un’unica istanza analytics, tutti i partner' },
    body: {
      en: 'A single Ferrari CJA instance aggregates every partner’s results. It sizes on a separate metric — Rows of Data — independent of Collaboration.',
      it: 'Un’unica istanza CJA Ferrari aggrega i risultati di ogni partner. Si dimensiona su una metrica separata — Rows of Data — indipendente da Collaboration.',
    },
    ferrari: {
      en: 'Not multiplied by partners: one instance covers the whole grid. Sized on total web + app + social + CRM + events rows.',
      it: 'Non si moltiplica per i partner: una istanza copre tutta la griglia. Dimensionata sulle righe totali web + app + social + CRM + eventi.',
    },
  },
  {
    tag: { en: 'Cost · you set it', it: 'Costo · lo imposti tu' },
    title: { en: 'The cost is your hypothesis', it: 'Il costo è una tua ipotesi' },
    body: {
      en: 'No list prices are baked in. You set the cost per instance in the calculator; the total follows from the perimeter.',
      it: 'Nessun prezzo di listino è incorporato. Imposti tu il costo per istanza nel configuratore; il totale segue dal perimetro.',
    },
    ferrari: {
      en: 'Ferrari instance cost is yours to set; partner instances default to 0 and are editable.',
      it: 'Il costo dell’istanza Ferrari lo imposti tu; le istanze partner sono a 0 di default e modificabili.',
    },
  },
];

export const COST_MODEL_SUMMARY = {
  en: 'Perimeter = one Ferrari instance + N partner instances (all standalone) + one Ferrari CJA instance. Volumes (Collaboration Credits and Rows of Data) are estimated; the cost per instance is yours to set in the calculator.',
  it: 'Perimetro = un’istanza Ferrari + N istanze partner (tutte standalone) + un’unica istanza CJA Ferrari. I volumi (Collaboration Credits e Rows of Data) sono stimati; il costo per istanza lo imposti tu nel configuratore.',
};

// ── End-to-end use cases spanning the whole product perimeter. ──
export interface UseCase {
  title: { en: string; it: string };
  scenario: { en: string; it: string };
  products: string[];                        // short product tags in flow order
  steps: { en: string; it: string }[];
  consumes: { en: string; it: string };      // indicative credits / rows read
}

export const USE_CASES: UseCase[] = [
  {
    title: { en: 'Season launch — the 2026 livery', it: 'Lancio di stagione — la livrea 2026' },
    scenario: {
      en: 'Ferrari and its title partner reveal the new car and turn the moment into a co-marketed campaign, without either side handing over raw customer data.',
      it: 'Ferrari e il title partner svelano la nuova monoposto e trasformano il momento in una campagna co-marketing, senza che nessuno ceda dati grezzi dei clienti.',
    },
    products: ['RT-CDP Collaboration', 'GenStudio', 'Adobe Express', 'CJA'],
    steps: [
      { en: 'Match Ferrari and partner audiences in the clean room → a shared, privacy-safe launch segment.', it: 'Match tra audience Ferrari e partner nella clean room → un segmento di lancio condiviso e privacy-safe.' },
      { en: 'GenStudio generates on-brand variants at scale; Express handles the quick partner edits.', it: 'GenStudio genera varianti on-brand su scala; Express gestisce le modifiche rapide del partner.' },
      { en: 'Activate the matched segment on the partner’s owned and paid channels.', it: 'Attiva il segmento matchato sui canali owned e paid del partner.' },
      { en: 'CJA reads the aggregate lift — reach, engagement, conversions — across both brands.', it: 'CJA legge il lift aggregato — reach, engagement, conversioni — su entrambi i brand.' },
    ],
    consumes: {
      en: 'One ad-hoc activation + a refresh around the launch → Collaboration credits; launch traffic → CJA rows.',
      it: 'Una attivazione ad-hoc + un refresh a ridosso del lancio → Collaboration credits; il traffico del lancio → righe CJA.',
    },
  },
  {
    title: { en: 'Race weekend — the home GP', it: 'Weekend di gara — il GP di casa' },
    scenario: {
      en: 'A real-time moment at Monza: capitalise on the surge in fan attention with a fast, co-branded activation that goes live within the weekend.',
      it: 'Un momento real-time a Monza: sfrutta il picco di attenzione dei tifosi con un’attivazione co-branded veloce, live nell’arco del weekend.',
    },
    products: ['RT-CDP Collaboration', 'GenStudio', 'CJA'],
    steps: [
      { en: 'Build a race-weekend audience from live fan signals, matched with the partner.', it: 'Costruisci un’audience race-weekend dai segnali live dei tifosi, matchata col partner.' },
      { en: 'Spin up creative variants in GenStudio for each channel and market.', it: 'Genera varianti creative in GenStudio per ogni canale e mercato.' },
      { en: 'Activate immediately; measure against the weekend’s conversions in CJA.', it: 'Attiva subito; misura sulle conversioni del weekend in CJA.' },
    ],
    consumes: {
      en: 'A single high-intensity ad-hoc campaign → activation + measurement credits; event traffic → CJA rows.',
      it: 'Una singola campagna ad-hoc ad alta intensità → credits di attivazione + measurement; il traffico dell’evento → righe CJA.',
    },
  },
  {
    title: { en: 'Onboarding a new sponsor', it: 'Onboarding di un nuovo sponsor' },
    scenario: {
      en: 'A new partner joins the grid. You stand up their Collaboration instance, run a first joint campaign, and fold the results into Ferrari’s season view.',
      it: 'Un nuovo partner entra in griglia. Accendi la sua istanza Collaboration, lanci una prima campagna congiunta e integri i risultati nella vista di stagione Ferrari.',
    },
    products: ['RT-CDP Collaboration', 'GenStudio', 'Adobe Express', 'CJA'],
    steps: [
      { en: 'Provision the partner instance — a standalone Collaboration instance with its own credit pool.', it: 'Attiva l’istanza partner — un’istanza Collaboration standalone con il proprio pool di crediti.' },
      { en: 'Match audiences, then create the first campaign in GenStudio + Express.', it: 'Match delle audience, poi crea la prima campagna in GenStudio + Express.' },
      { en: 'Activate and measure; the results roll into Ferrari’s single CJA view.', it: 'Attiva e misura; i risultati confluiscono nell’unica vista CJA di Ferrari.' },
    ],
    consumes: {
      en: 'A new partner instance → its own credit pack; nothing extra on CJA (one shared Ferrari instance).',
      it: 'Una nuova istanza partner → il suo pacchetto crediti; nulla di extra su CJA (istanza Ferrari unica condivisa).',
    },
  },
  {
    title: { en: 'Always-on tifosi programme', it: 'Programma always-on per i tifosi' },
    scenario: {
      en: 'Beyond the peaks, a season-long nurture keeps the fan relationship warm — continuous audiences, weekly activations, measured end to end.',
      it: 'Oltre i picchi, un nurture lungo tutta la stagione tiene calda la relazione col tifoso — audience continue, attivazioni settimanali, misurate end to end.',
    },
    products: ['RT-CDP Collaboration', 'GenStudio', 'CJA'],
    steps: [
      { en: 'Keep audiences continuously refreshed so they stay match-ready all year.', it: 'Tieni le audience aggiornate in continuo così restano pronte al match tutto l’anno.' },
      { en: 'Run weekly always-on activations with rotating GenStudio creative.', it: 'Esegui attivazioni always-on settimanali con creatività GenStudio a rotazione.' },
      { en: 'Track the season-long trend in CJA — retention, not just spikes.', it: 'Segui il trend di stagione in CJA — retention, non solo picchi.' },
    ],
    consumes: {
      en: 'Continuous refresh + always-on runs → steady Collaboration credits; year-round traffic → the bulk of CJA rows.',
      it: 'Refresh continuo + run always-on → credits Collaboration costanti; il traffico tutto l’anno → il grosso delle righe CJA.',
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
  { key: 'burn-rates', tag: 'fact', en: 'Burn rates: management 2 · activation 500 · always-on 100 · measurement 50 (credits / 1M)', it: 'Burn rate: gestione 2 · attivazione 500 · always-on 100 · measurement 50 (credits / 1M)', sourceEn: 'Adobe RT-CDP Collaboration Scoping Calculator', sourceIt: 'Adobe RT-CDP Collaboration Scoping Calculator' },
  { key: 'assumptions', tag: 'fact', en: 'Default assumptions: match 30% · reach 50% · frequency 10× · conversion 5%', it: 'Assunzioni di default: match 30% · reach 50% · frequenza 10× · conversione 5%', sourceEn: 'Adobe Scoping Calculator (defaults)', sourceIt: 'Adobe Scoping Calculator (default)' },
  { key: 'pack-sizing', tag: 'fact', en: 'Deliverable = a recommended credit pack (estimate rounded to a tier)', it: 'Deliverable = un pacchetto di crediti consigliato (stima arrotondata a scaglione)', sourceEn: 'Adobe Scoping Calculator (Sales Calc row 31)', sourceIt: 'Adobe Scoping Calculator (Sales Calc riga 31)' },
  { key: 'standalone', tag: 'inference', en: 'Standalone scenario only — one Collaboration instance per party (1 Ferrari + N partners)', it: 'Solo scenario standalone — una istanza Collaboration per party (1 Ferrari + N partner)', sourceEn: 'Perimeter model', sourceIt: 'Modello di perimetro' },
  { key: 'instance-cost', tag: 'sales-order', en: 'Instance cost is a user-set hypothesis (no Adobe list price modelled)', it: 'Il costo per istanza è un’ipotesi impostata dall’utente (nessun prezzo di listino Adobe)', sourceEn: 'Your input', sourceIt: 'Tuo input' },
  { key: 'metric-cja', tag: 'fact', en: 'CJA metric = Rows of Data (1 row = 0.25 KB)', it: 'Metrica CJA = Rows of Data (1 riga = 0,25 KB)', sourceEn: 'CJA Product Description', sourceIt: 'Product Description CJA' },
  { key: 'ingestion', tag: 'fact', en: 'Annual Ingestion Limit ≤ 3× licensed rows', it: 'Annual Ingestion Limit ≤ 3× righe licenziate', sourceEn: 'CJA Guardrails', sourceIt: 'CJA Guardrails' },
  { key: 'independence', tag: 'inference', en: 'Independent licensing — no dependency between the two', it: 'Licensing indipendente — nessuna dipendenza tra i due', sourceEn: 'Two separate Product Descriptions', sourceIt: 'Due Product Description separate' },
  { key: 'volumes', tag: 'inference', en: 'Ferrari volumes derived from public footprint', it: 'Volumi Ferrari derivati dal footprint pubblico', sourceEn: 'Nielsen / Similarweb / partner list', sourceIt: 'Nielsen / Similarweb / lista partner' },
  { key: 'app-crm', tag: 'sales-order', en: 'App MAU & CRM size: client to confirm', it: 'App MAU e dimensione CRM: da confermare col cliente' },
];

export const DISCLAIMER = {
  it: 'Stima illustrativa dei volumi di licenza (Collaboration Credits e CJA Rows of Data) per lo scenario standalone. I costi per istanza sono ipotesi impostate dall’utente. Non sostituisce un Sales Order o i PSLT applicabili.',
  en: 'Illustrative estimate of the licence volumes (Collaboration Credits and CJA Rows of Data) for the standalone scenario. Per-instance costs are user-set hypotheses. It does not replace a Sales Order or applicable PSLT.',
};
