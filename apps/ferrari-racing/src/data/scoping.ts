import type { Scenario } from '@edf/core/blocks/scoping/scenario';
import { DEFAULT_ASSUMPTIONS, DEFAULT_PRICES } from '@edf/core/blocks/scoping/scenario';

// All volume figures are REASONED INFERENCES seeded from public footprint
// research (F1 826.5M fans · Scuderia social ~35M · ferrari.com ~2.7M/mo ·
// ~5 data-relevant partners). Prices are always user-entered (quote-only).
export const SEED_SCENARIOS: Scenario[] = [
  {
    title: 'Conservativo / Conservative',
    visibility: 'private',
    prices: { ...DEFAULT_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      collabMode: 'activity', collabPackage: 'prime',
      partners: 2, audienceSize: 5_000_000, activationsPerYear: 12,
      webVisitsPerYear: 32_000_000, webHitsPerVisit: 5,
      appMau: 0, appEventsPerMauPerMonth: 0,
      socialAudience: 35_000_000, socialActivePct: 0.05, socialActionsPerActivePerMonth: 5,
      crmProfiles: 1_500_000, crmEventsPerProfilePerYear: 24,
      eventsRowsPerYear: 15_000_000,
    },
  },
  {
    title: 'Base',
    visibility: 'private',
    prices: { ...DEFAULT_PRICES },
    assumptions: { ...DEFAULT_ASSUMPTIONS }, // ≈1.15B rows, 5 partners / 15M / 24
  },
  {
    title: 'Ambizioso / Ambitious',
    visibility: 'private',
    prices: { ...DEFAULT_PRICES },
    assumptions: {
      ...DEFAULT_ASSUMPTIONS,
      collabMode: 'activity', collabPackage: 'ultimate',
      partners: 10, audienceSize: 40_000_000, activationsPerYear: 52,
      webVisitsPerYear: 32_000_000, webHitsPerVisit: 12,
      appMau: 4_000_000, appEventsPerMauPerMonth: 40,
      socialAudience: 48_000_000, socialActivePct: 0.2, socialActionsPerActivePerMonth: 9,
      crmProfiles: 6_000_000, crmEventsPerProfilePerYear: 36,
      eventsRowsPerYear: 120_000_000,
    },
  },
];

export type RigorTag = 'fact' | 'inference' | 'sales-order';

export interface AssumptionMeta {
  key: string;
  en: string;
  it: string;
  tag: RigorTag;
  sourceEn?: string;
  sourceIt?: string;
}

export const RIGOR_LABELS: Record<RigorTag, { en: string; it: string }> = {
  fact: { en: 'Documented fact', it: 'Fatto documentato' },
  inference: { en: 'Reasoned inference', it: 'Inferenza ragionata' },
  'sales-order': { en: 'Confirm on Sales Order', it: 'Da confermare (Sales Order)' },
};

export const ASSUMPTION_META: AssumptionMeta[] = [
  { key: 'metric-collab', tag: 'fact', en: 'Collaboration metric = Collaboration Credits', it: 'Metrica Collaboration = Collaboration Credits', sourceEn: 'Adobe Product Description', sourceIt: 'Product Description Adobe' },
  { key: 'allotment', tag: 'fact', en: 'Bundled one-time allotment: 2,500 (Prime) / 5,000 (Ultimate)', it: 'Allotment one-time incluso: 2.500 (Prime) / 5.000 (Ultimate)', sourceEn: 'RT-CDP Prime/Ultimate PD', sourceIt: 'PD RT-CDP Prime/Ultimate' },
  { key: 'metric-cja', tag: 'fact', en: 'CJA metric = Rows of Data (1 row = 0.25 KB)', it: 'Metrica CJA = Rows of Data (1 row = 0,25 KB)', sourceEn: 'CJA Product Description', sourceIt: 'Product Description CJA' },
  { key: 'ingestion', tag: 'fact', en: 'Annual Ingestion Limit ≤ 3× licensed rows', it: 'Annual Ingestion Limit ≤ 3× righe licenziate', sourceEn: 'CJA Guardrails', sourceIt: 'CJA Guardrails' },
  { key: 'independence', tag: 'inference', en: 'Independent licensing — no dependency between the two', it: 'Licensing indipendente — nessuna dipendenza tra i due', sourceEn: 'Two separate Product Descriptions', sourceIt: 'Due Product Description separate' },
  { key: 'volumes', tag: 'inference', en: 'Ferrari volumes derived from public footprint', it: 'Volumi Ferrari derivati dal footprint pubblico', sourceEn: 'Nielsen / Similarweb / partner list', sourceIt: 'Nielsen / Similarweb / lista partner' },
  { key: 'burn-rate', tag: 'sales-order', en: 'Credit burn-rate & unit prices are quote-only', it: 'Burn-rate credito e prezzi unitari solo da preventivo', sourceEn: 'Sales Order / Credit Consumption Table', sourceIt: 'Sales Order / Credit Consumption Table' },
  { key: 'app-crm', tag: 'sales-order', en: 'App MAU & CRM size: client to confirm', it: 'App MAU e dimensione CRM: da confermare col cliente' },
];

export const DISCLAIMER = {
  it: 'Stima illustrativa basata su assunzioni dichiarate e su capability pubbliche Adobe. Non sostituisce un Sales Order o i PSLT applicabili. Prezzi unitari da definire contrattualmente.',
  en: 'Illustrative estimate based on stated assumptions and public Adobe capabilities. It does not replace a Sales Order or applicable PSLT. Unit prices to be defined contractually.',
};
