import type { Scenario } from '@edf/core/blocks/scoping/scenario';
import { DEFAULT_ASSUMPTIONS } from '@edf/core/blocks/scoping/scenario';

// ─────────────────────────────────────────────────────────────────────
//  RT-CDP Collaboration inputs mirror Adobe's official "Real-Time CDP
//  Collaboration Scoping Calculator" (Sales Calculator + hidden burn/assump
//  sheet). Burn rates (mgmt 2 · activation 500 · always-on 100 · measurement
//  50 credits per 1M) and the default assumptions (match 30% · reach 50% ·
//  frequency 10× · conversion 5% · $5/credit) are OFFICIAL constants baked
//  into the engine (see cost-model.ts BURN / ASSUMPTION_DEFAULTS), not tunable
//  placeholders. Ferrari volume figures are reasoned inferences from public
//  footprint research (F1 826.5M fans · Scuderia social ~35M · ferrari.com
//  ~2.7M/mo). CJA (Rows of Data) is a second, independent product and is NOT
//  part of the Adobe workbook.
// ─────────────────────────────────────────────────────────────────────

// Unit prices — collab credit list price is the workbook's $5 (H13); CJA per-row
// price is a quote-only illustrative placeholder.
const ILLUSTRATIVE_PRICES = { currency: 'EUR', pricePerCredit: 5, pricePerMillionRows: 2 };

// ── Scenario presets (Conservative / Base / Aggressive). Each is a delta
//    over DEFAULT_ASSUMPTIONS; the calculator surfaces them as chips. ──
export const SEED_SCENARIOS: Scenario[] = [
  {
    title: 'Conservativo / Conservative', preset: 'conservative', visibility: 'private',
    prices: { ...ILLUSTRATIVE_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      collabMode: 'detailed',
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
  mode?: string;                // Collaboration-only: which estimation mode(s) show it (pipe-separated)
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

const SIMPLE_DETAILED = 'simple|detailed';

export const FIELD_AUDIT: FieldAudit[] = [
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
    key: 'refreshEveryXDays', group: 'collab', mode: 'detailed', format: 'int',
    category: 'management', dataType: 'default-assumption',
    section: { en: 'Audience management', it: 'Gestione audience' },
    label: { en: 'Refresh every X days (1–6)', it: 'Refresh ogni X giorni (1–6)' },
    impacts: { en: 'Refreshes/yr = 365 ÷ X → management credits', it: 'Refresh/anno = 365 ÷ X → credits di gestione' },
    source: { en: 'Adobe calculator input (range 1–6 days)', it: 'Input del calcolatore Adobe (range 1–6 giorni)' },
    calc: { en: 'How often the onboarded audience is transformed / re-indexed', it: 'Con che frequenza l’audience onboardata viene trasformata / re-indicizzata' },
    assumption: { en: 'Every 6 days (≈61 refreshes/yr) — the workbook default', it: 'Ogni 6 giorni (≈61 refresh/anno) — il default del workbook' },
  },
  // ── Activation (detailed) ──
  {
    key: 'adHocCampaignsPerYear', group: 'collab', mode: 'detailed', format: 'int',
    category: 'activation', dataType: 'customer-assumption',
    section: { en: 'Activation', it: 'Attivazione' },
    label: { en: 'Ad-hoc campaigns / year', it: 'Campagne ad-hoc / anno' },
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
  // ── Unit price ──
  {
    key: 'pricePerCredit', group: 'collab', format: 'currency', toConfirm: true,
    category: 'pricing', dataType: 'price',
    section: { en: 'Unit price', it: 'Prezzo unitario' },
    label: { en: 'Price per credit', it: 'Prezzo per credito' },
    impacts: { en: 'Collaboration cost', it: 'Costo Collaboration' },
    source: { en: 'Adobe calculator list price ($5) — quote-only in practice', it: 'Prezzo di listino del calcolatore Adobe ($5) — nella pratica solo da preventivo' },
    calc: { en: '€ (≈$) per Collaboration Credit', it: '€ (≈$) per Collaboration Credit' },
    assumption: { en: '$5.00 / credit list — replace with the Sales Order value', it: '$5,00 / credit di listino — sostituire con il valore del Sales Order' },
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
      en: 'The license metric for Real-Time CDP Collaboration. A finite pool of credits is consumed as you run collaboration activities. The model mirrors Adobe’s official Scoping Calculator: no annual allotment is netted — the estimate is rounded up to a recommended credit pack.',
      it: 'La metrica di licenza di Real-Time CDP Collaboration. Un pool finito di credits viene consumato eseguendo attività di collaboration. Il modello rispecchia lo Scoping Calculator ufficiale Adobe: nessun allotment annuo viene sottratto — la stima è arrotondata a un pacchetto di crediti consigliato.',
    },
    consumes: [
      { en: 'Audience transformation & management — onboarded IDs × refresh cadence (365 ÷ every-X-days) × 2 credits/1M', it: 'Trasformazione e gestione audience — ID onboardati × cadenza refresh (365 ÷ ogni-X-giorni) × 2 credits/1M' },
      { en: 'Activation — matched audience × campaigns × 500 credits/1M (ad hoc); always-on at 100/1M/run', it: 'Attivazione — audience matchata × campagne × 500 credits/1M (ad hoc); always-on a 100/1M/run' },
      { en: 'Measurement — summary statistics on impressions + attribution on (impressions + conversions), at 50 credits/1M', it: 'Measurement — summary statistics su impression + attribution su (impression + conversioni), a 50 credits/1M' },
    ],
    example: {
      en: 'e.g. management (10M÷1M)×(365÷6)×2 ≈ 1,217 + activation (0.3M÷1M)×1×500 = 150 + measurement 75 + 75.375 → ~1,517 credits/yr → recommended pack 2,000 × $5 = $10,000.',
      it: 'es. gestione (10M÷1M)×(365÷6)×2 ≈ 1.217 + attivazione (0,3M÷1M)×1×500 = 150 + measurement 75 + 75,375 → ~1.517 credit/anno → pacchetto consigliato 2.000 × $5 = $10.000.',
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
  { key: 'assumptions', tag: 'fact', en: 'Default assumptions: match 30% · reach 50% · frequency 10× · conversion 5% · $5/credit', it: 'Assunzioni di default: match 30% · reach 50% · frequenza 10× · conversione 5% · $5/credit', sourceEn: 'Adobe Scoping Calculator (defaults)', sourceIt: 'Adobe Scoping Calculator (default)' },
  { key: 'pack-sizing', tag: 'fact', en: 'Deliverable = a recommended credit pack (no annual allotment subtraction)', it: 'Deliverable = un pacchetto di crediti consigliato (nessuna sottrazione di allotment annuo)', sourceEn: 'Adobe Scoping Calculator (Sales Calc row 31)', sourceIt: 'Adobe Scoping Calculator (Sales Calc riga 31)' },
  { key: 'metric-cja', tag: 'fact', en: 'CJA metric = Rows of Data (1 row = 0.25 KB)', it: 'Metrica CJA = Rows of Data (1 riga = 0,25 KB)', sourceEn: 'CJA Product Description', sourceIt: 'Product Description CJA' },
  { key: 'ingestion', tag: 'fact', en: 'Annual Ingestion Limit ≤ 3× licensed rows', it: 'Annual Ingestion Limit ≤ 3× righe licenziate', sourceEn: 'CJA Guardrails', sourceIt: 'CJA Guardrails' },
  { key: 'independence', tag: 'inference', en: 'Independent licensing — no dependency between the two', it: 'Licensing indipendente — nessuna dipendenza tra i due', sourceEn: 'Two separate Product Descriptions', sourceIt: 'Due Product Description separate' },
  { key: 'volumes', tag: 'inference', en: 'Ferrari volumes derived from public footprint', it: 'Volumi Ferrari derivati dal footprint pubblico', sourceEn: 'Nielsen / Similarweb / partner list', sourceIt: 'Nielsen / Similarweb / lista partner' },
  { key: 'price', tag: 'sales-order', en: 'Unit prices are quote-only ($5 credit list price is illustrative)', it: 'I prezzi unitari sono solo da preventivo ($5 di listino per credito è illustrativo)', sourceEn: 'Sales Order', sourceIt: 'Sales Order' },
  { key: 'app-crm', tag: 'sales-order', en: 'App MAU & CRM size: client to confirm', it: 'App MAU e dimensione CRM: da confermare col cliente' },
];

export const DISCLAIMER = {
  it: 'Stima illustrativa che replica la logica dello Scoping Calculator Adobe per RT-CDP Collaboration più un modello indipendente per CJA. Non sostituisce un Sales Order o i PSLT applicabili. Prezzi unitari da definire contrattualmente.',
  en: 'Illustrative estimate replicating the Adobe Scoping Calculator logic for RT-CDP Collaboration plus an independent model for CJA. It does not replace a Sales Order or applicable PSLT. Unit prices to be defined contractually.',
};
