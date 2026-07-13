import type { Scenario } from '@edf/core/blocks/scoping/scenario';
import { DEFAULT_ASSUMPTIONS } from '@edf/core/blocks/scoping/scenario';

// ─────────────────────────────────────────────────────────────────────
//  Every number here is a STATED assumption with an audit trail (see
//  FIELD_AUDIT below): where it comes from, how it's computed, and the
//  reasoning. Volume figures are reasoned inferences from public footprint
//  research (F1 826.5M fans · Scuderia social ~35M · ferrari.com ~2.7M/mo ·
//  ~5 data-relevant partners). Adobe unit prices are quote-only: the values
//  shipped here are clearly-labelled illustrative placeholders — replace with
//  the Sales Order. No field is ever left at 0 or blank.
// ─────────────────────────────────────────────────────────────────────

// Illustrative unit prices (quote-only — see FIELD_AUDIT for provenance).
const ILLUSTRATIVE_PRICES = { currency: 'EUR', pricePerCredit: 3, pricePerMillionRows: 2 };

// Illustrative credit burn-rates (quote-only — Adobe Credit Consumption Table).
const CREDIT_RATES = { creditPerActivation: 1, creditPerAudienceMgmt: 2, creditPerMeasurement: 0.5 };

export const SEED_SCENARIOS: Scenario[] = [
  {
    title: 'Conservativo / Conservative',
    visibility: 'private',
    prices: { ...ILLUSTRATIVE_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS, ...CREDIT_RATES,
      collabMode: 'activity', collabPackage: 'prime',
      directCredits: 3_000,
      partners: 2, audienceSize: 5_000_000, activationsPerYear: 12,
      webVisitsPerYear: 32_000_000, webHitsPerVisit: 5,
      appMau: 800_000, appEventsPerMauPerMonth: 20,
      socialAudience: 35_000_000, socialActivePct: 0.05, socialActionsPerActivePerMonth: 5,
      crmProfiles: 1_500_000, crmEventsPerProfilePerYear: 24,
      eventsRowsPerYear: 15_000_000,
    },
  },
  {
    title: 'Base',
    visibility: 'private',
    prices: { ...ILLUSTRATIVE_PRICES },
    assumptions: { ...DEFAULT_ASSUMPTIONS, ...CREDIT_RATES, directCredits: 5_000 }, // ≈1.15B rows · 5 partner / 15M / 24
  },
  {
    title: 'Ambizioso / Ambitious',
    visibility: 'private',
    prices: { ...ILLUSTRATIVE_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS, ...CREDIT_RATES,
      collabMode: 'activity', collabPackage: 'ultimate',
      directCredits: 10_000,
      partners: 10, audienceSize: 40_000_000, activationsPerYear: 52,
      webVisitsPerYear: 32_000_000, webHitsPerVisit: 12,
      appMau: 4_000_000, appEventsPerMauPerMonth: 40,
      socialAudience: 48_000_000, socialActivePct: 0.2, socialActionsPerActivePerMonth: 9,
      crmProfiles: 6_000_000, crmEventsPerProfilePerYear: 36,
      eventsRowsPerYear: 120_000_000,
    },
  },
];

// ── Per-field audit registry: drives the calculator labels, grouping,
//    number formatting, non-zero defaults and the per-field audit tooltip. ──
export type FieldFormat = 'int' | 'decimal' | 'percent' | 'currency';
export type FieldGroup = 'collab' | 'cja';

export interface FieldAudit {
  key: string;                 // ScopingAssumptions field or a price key
  group: FieldGroup;
  section: { en: string; it: string };
  label: { en: string; it: string };
  format: FieldFormat;
  mode?: 'activity' | 'direct'; // Collaboration-only: which input mode shows it
  toConfirm?: boolean;          // illustrative / client-to-confirm → amber marker
  source: { en: string; it: string };
  calc: { en: string; it: string };
  assumption: { en: string; it: string };
}

export const FIELD_AUDIT: FieldAudit[] = [
  // ── Collaboration · Audience & activation ──
  {
    key: 'directCredits', group: 'collab', mode: 'direct', format: 'int',
    section: { en: 'Direct scoping', it: 'Scoping diretto' },
    label: { en: 'Annual Collaboration Credits', it: 'Collaboration Credits annui' },
    source: { en: 'Scoping estimate / Sales Order', it: 'Stima di scoping / Sales Order' },
    calc: { en: 'Credits scoped directly, bypassing the activity estimate', it: 'Credits scopati direttamente, senza stima da attività' },
    assumption: { en: '5,000 credits (≈ Ultimate allotment) — placeholder to replace with the Sales Order', it: '5.000 credits (≈ allotment Ultimate) — segnaposto da sostituire con il Sales Order' },
  },
  {
    key: 'partners', group: 'collab', mode: 'activity', format: 'int',
    section: { en: 'Audience & activation', it: 'Audience e attivazione' },
    label: { en: 'Data-collaboration partners', it: 'Partner in data collaboration' },
    source: { en: 'Scuderia Ferrari HP premium partner roster (HP, Shell, UniCredit, IBM/AWS, PUMA)', it: 'Roster premium partner Scuderia Ferrari HP (HP, Shell, UniCredit, IBM/AWS, PUMA)' },
    calc: { en: 'Count of data-collaboration-relevant partners', it: 'Conteggio dei partner rilevanti per la data collaboration' },
    assumption: { en: '5 of ~40 total partners are data-collaboration-relevant', it: '5 su ~40 partner totali sono rilevanti per la data collaboration' },
  },
  {
    key: 'audienceSize', group: 'collab', mode: 'activity', format: 'int',
    section: { en: 'Audience & activation', it: 'Audience e attivazione' },
    label: { en: 'Distinct addressable audience', it: 'Audience distinta indirizzabile' },
    source: { en: 'Scuderia social ~35M + web + CRM, de-duplicated (Motorsport Week 2025 · Similarweb)', it: 'Social Scuderia ~35M + web + CRM, de-duplicati (Motorsport Week 2025 · Similarweb)' },
    calc: { en: 'Distinct 1st-party matchable identities across platforms', it: 'Identità 1st-party distinte e matchabili tra le piattaforme' },
    assumption: { en: '~15M after cross-platform de-dup — followers are not all matchable identities', it: '~15M dopo de-dup cross-platform — i follower non sono tutti identità matchabili' },
  },
  {
    key: 'activationsPerYear', group: 'collab', mode: 'activity', format: 'int',
    section: { en: 'Audience & activation', it: 'Audience e attivazione' },
    label: { en: 'Activations / year', it: 'Attivazioni / anno' },
    source: { en: '2026 F1 calendar (24 Grands Prix) / campaign plan', it: 'Calendario F1 2026 (24 Gran Premi) / piano campagne' },
    calc: { en: '≈ 2 activations per month', it: '≈ 2 attivazioni al mese' },
    assumption: { en: 'Bi-weekly cadence, aligned to the race calendar', it: 'Cadenza bisettimanale, allineata al calendario gare' },
  },
  // ── Collaboration · Credit consumption (illustrative) ──
  {
    key: 'creditPerActivation', group: 'collab', mode: 'activity', format: 'decimal', toConfirm: true,
    section: { en: 'Credit consumption', it: 'Consumo crediti' },
    label: { en: 'Credits per activation', it: 'Credits per attivazione' },
    source: { en: 'Illustrative — Adobe Credit Consumption Table (quote-only)', it: 'Illustrativo — Credit Consumption Table Adobe (quote-only)' },
    calc: { en: 'Credits per Activation event (Access + Egress)', it: 'Credits per evento di Activation (Access + Egress)' },
    assumption: { en: '1 credit / activation — placeholder; replace with the Sales Order table', it: '1 credit / attivazione — segnaposto; sostituire con la tabella del Sales Order' },
  },
  {
    key: 'creditPerAudienceMgmt', group: 'collab', mode: 'activity', format: 'decimal', toConfirm: true,
    section: { en: 'Credit consumption', it: 'Consumo crediti' },
    label: { en: 'Credits per partner audience mgmt', it: 'Credits per audience mgmt partner' },
    source: { en: 'Illustrative — function of IDs indexed × cadence', it: 'Illustrativo — funzione di ID indicizzati × cadenza' },
    calc: { en: 'Credits per managed partner-audience per year', it: 'Credits per audience-partner gestita/anno' },
    assumption: { en: '2 credits per partner-audience / year — placeholder', it: '2 credit per partner-audience / anno — segnaposto' },
  },
  {
    key: 'creditPerMeasurement', group: 'collab', mode: 'activity', format: 'decimal', toConfirm: true,
    section: { en: 'Credit consumption', it: 'Consumo crediti' },
    label: { en: 'Credits per measurement', it: 'Credits per measurement' },
    source: { en: 'Illustrative — function of report rows × cadence', it: 'Illustrativo — funzione di righe report × cadenza' },
    calc: { en: 'Credits per measurement report per activation', it: 'Credits per report di measurement per attivazione' },
    assumption: { en: '0.5 credit / measurement — placeholder', it: '0,5 credit / measurement — segnaposto' },
  },
  {
    key: 'pricePerCredit', group: 'collab', format: 'currency', toConfirm: true,
    section: { en: 'Unit price', it: 'Prezzo unitario' },
    label: { en: 'Price per credit', it: 'Prezzo per credito' },
    source: { en: 'Illustrative analyst estimate — Adobe pricing is quote-only', it: 'Stima illustrativa — il prezzo Adobe è solo da preventivo' },
    calc: { en: '€ per Collaboration Credit', it: '€ per Collaboration Credit' },
    assumption: { en: '€3.00 / credit placeholder — replace with the Sales Order value', it: '€3,00 / credit segnaposto — sostituire con il valore del Sales Order' },
  },
  // ── CJA · Web ──
  {
    key: 'webVisitsPerYear', group: 'cja', format: 'int',
    section: { en: 'Web', it: 'Web' },
    label: { en: 'Web visits / year', it: 'Visite web / anno' },
    source: { en: 'ferrari.com ~2.7M visits/mo (Similarweb, 2024–25) × 12', it: 'ferrari.com ~2,7M visite/mese (Similarweb, 2024–25) × 12' },
    calc: { en: '2.7M × 12', it: '2,7M × 12' },
    assumption: { en: '±30% panel estimate; a dedicated Scuderia property would have separate traffic', it: 'stima panel ±30%; una property Scuderia dedicata avrebbe traffico separato' },
  },
  {
    key: 'webHitsPerVisit', group: 'cja', format: 'int',
    section: { en: 'Web', it: 'Web' },
    label: { en: 'Hits per visit', it: 'Hit per visita' },
    source: { en: 'Analytics benchmark for media/content sites', it: 'Benchmark analytics per siti media/content' },
    calc: { en: 'Average tracked interactions per visit (pageviews + clicks)', it: 'Interazioni tracciate medie per visita (pageview + click)' },
    assumption: { en: '8 hits / visit', it: '8 hit / visita' },
  },
  // ── CJA · App (to confirm) ──
  {
    key: 'appMau', group: 'cja', format: 'int', toConfirm: true,
    section: { en: 'App', it: 'App' },
    label: { en: 'App MAU', it: 'App MAU' },
    source: { en: 'No public Ferrari app MAU — inferred as ~4% of brand IG (32M)', it: 'Nessun dato pubblico su MAU app Ferrari — inferito come ~4% dell’IG brand (32M)' },
    calc: { en: '0.04 × 32M ≈ 1.5M', it: '0,04 × 32M ≈ 1,5M' },
    assumption: { en: '1.5M MAU — client to confirm (high-impact variable)', it: '1,5M MAU — da confermare col cliente (variabile ad alto impatto)' },
  },
  {
    key: 'appEventsPerMauPerMonth', group: 'cja', format: 'int',
    section: { en: 'App', it: 'App' },
    label: { en: 'App events / MAU / month', it: 'Eventi app / MAU / mese' },
    source: { en: 'App analytics benchmark', it: 'Benchmark analytics app' },
    calc: { en: 'Behavioural events per active user per month', it: 'Eventi comportamentali per utente attivo/mese' },
    assumption: { en: '30 events / MAU / month', it: '30 eventi / MAU / mese' },
  },
  // ── CJA · Social ──
  {
    key: 'socialAudience', group: 'cja', format: 'int',
    section: { en: 'Social', it: 'Social' },
    label: { en: 'Social audience', it: 'Audience social' },
    source: { en: 'Scuderia Ferrari social aggregate ~35M (Motorsport Week, Mar 2025)', it: 'Aggregato social Scuderia Ferrari ~35M (Motorsport Week, mar 2025)' },
    calc: { en: 'Sum of cross-platform followers', it: 'Somma dei follower cross-platform' },
    assumption: { en: 'Followers are not 1st-party identities; only a share is matchable', it: 'I follower non sono identità 1st-party; solo una quota è matchabile' },
  },
  {
    key: 'socialActivePct', group: 'cja', format: 'percent',
    section: { en: 'Social', it: 'Social' },
    label: { en: 'Active share', it: 'Quota attiva' },
    source: { en: 'Social engagement benchmark', it: 'Benchmark engagement social' },
    calc: { en: 'Share of followers active per month', it: 'Quota di follower attivi al mese' },
    assumption: { en: '10% monthly-active', it: '10% monthly-active' },
  },
  {
    key: 'socialActionsPerActivePerMonth', group: 'cja', format: 'int',
    section: { en: 'Social', it: 'Social' },
    label: { en: 'Social actions / active / month', it: 'Azioni social / attivo / mese' },
    source: { en: 'Social engagement benchmark', it: 'Benchmark engagement social' },
    calc: { en: 'Tracked actions per active follower per month', it: 'Azioni tracciate per follower attivo/mese' },
    assumption: { en: '6 actions / active / month', it: '6 azioni / attivo / mese' },
  },
  // ── CJA · CRM (to confirm) ──
  {
    key: 'crmProfiles', group: 'cja', format: 'int', toConfirm: true,
    section: { en: 'CRM', it: 'CRM' },
    label: { en: 'CRM profiles', it: 'Profili CRM' },
    source: { en: 'No public CRM size — inferred from the registered-fan base', it: 'Nessun dato pubblico sul CRM — inferito sulla base dei fan registrati' },
    calc: { en: 'Addressable marketing profiles', it: 'Profili di marketing indirizzabili' },
    assumption: { en: '3M profiles — client to confirm', it: '3M profili — da confermare col cliente' },
  },
  {
    key: 'crmEventsPerProfilePerYear', group: 'cja', format: 'int',
    section: { en: 'CRM', it: 'CRM' },
    label: { en: 'CRM events / profile / year', it: 'Eventi CRM / profilo / anno' },
    source: { en: 'Email / journey cadence', it: 'Cadenza email / journey' },
    calc: { en: 'CRM events per profile per year', it: 'Eventi CRM per profilo/anno' },
    assumption: { en: '24 (≈ 2 / month)', it: '24 (≈ 2 / mese)' },
  },
  // ── CJA · Events ──
  {
    key: 'eventsRowsPerYear', group: 'cja', format: 'int',
    section: { en: 'Events & eSports', it: 'Eventi ed eSports' },
    label: { en: 'Events / eSports rows / year', it: 'Righe eventi / eSports / anno' },
    source: { en: 'GP + Fan Token + eSports touchpoints', it: 'Touchpoint GP + Fan Token + eSports' },
    calc: { en: 'On-site / eSports events per year', it: 'Eventi on-site / eSports per anno' },
    assumption: { en: '30M events / year', it: '30M eventi / anno' },
  },
  {
    key: 'pricePerMillionRows', group: 'cja', format: 'currency', toConfirm: true,
    section: { en: 'Unit price', it: 'Prezzo unitario' },
    label: { en: 'Price per 1M rows', it: 'Prezzo per 1M righe' },
    source: { en: 'Illustrative analyst estimate — CJA pricing is quote-only', it: 'Stima illustrativa — il prezzo CJA è solo da preventivo' },
    calc: { en: '€ per 1M Rows of Data', it: '€ per 1M Rows of Data' },
    assumption: { en: '€2.00 / 1M rows placeholder — replace with the Sales Order value', it: '€2,00 / 1M righe segnaposto — sostituire con il valore del Sales Order' },
  },
];

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
      { en: 'Audience management — a function of IDs indexed × indexing cadence (daily / every 3 days / weekly)', it: 'Gestione audience — funzione di ID indicizzati × cadenza di indicizzazione (giornaliera / ogni 3 giorni / settimanale)' },
      { en: 'Activation — audience access & egress, one-time or recurring', it: 'Attivazione — accesso ed egress dell’audience, one-time o ricorrente' },
      { en: 'Measurement — a function of report rows × reporting cadence', it: 'Measurement — funzione di righe report × cadenza di reporting' },
    ],
    example: {
      en: 'e.g. 24 activations × 1 + 5 partner-audiences × 2 + 24 measurements × 0.5 = 46 credits/yr. Minus the Prime bundled allotment (2,500) → 0 billable this year. Beyond the allotment, a separate Sales Order is required.',
      it: 'es. 24 attivazioni × 1 + 5 partner-audience × 2 + 24 measurement × 0,5 = 46 credit/anno. Meno l’allotment incluso Prime (2.500) → 0 fatturabili quest’anno. Oltre l’allotment serve un Sales Order separato.',
    },
  },
  {
    product: { en: 'Customer Journey Analytics', it: 'Customer Journey Analytics' },
    metric: { en: 'Rows of Data', it: 'Rows of Data' },
    what: {
      en: 'The license metric for CJA: the daily-average rows of data available for analysis, where 1 row = 0.25 KB. Every customer event — web, app, social, CRM — becomes rows.',
      it: 'La metrica di licenza di CJA: la media giornaliera di righe di dati disponibili per l’analisi, dove 1 riga = 0,25 KB. Ogni evento cliente — web, app, social, CRM — diventa righe.',
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
  { key: 'volumes', tag: 'inference', en: 'Ferrari volumes derived from public footprint', it: 'Volumi Ferrari derivati dal footprint pubblico', sourceEn: 'Nielsen / Similarweb / partner list', sourceIt: 'Nielsen / Similarweb / lista partner' },
  { key: 'burn-rate', tag: 'sales-order', en: 'Credit burn-rate & unit prices are quote-only', it: 'Burn-rate credito e prezzi unitari solo da preventivo', sourceEn: 'Sales Order / Credit Consumption Table', sourceIt: 'Sales Order / Credit Consumption Table' },
  { key: 'app-crm', tag: 'sales-order', en: 'App MAU & CRM size: client to confirm', it: 'App MAU e dimensione CRM: da confermare col cliente' },
];

export const DISCLAIMER = {
  it: 'Stima illustrativa basata su assunzioni dichiarate e su capability pubbliche Adobe. Non sostituisce un Sales Order o i PSLT applicabili. Prezzi unitari e burn-rate dei crediti da definire contrattualmente.',
  en: 'Illustrative estimate based on stated assumptions and public Adobe capabilities. It does not replace a Sales Order or applicable PSLT. Unit prices and credit burn-rates to be defined contractually.',
};
