import type { ScopingAssumptions, UnitPrices } from './cost-model';
import { CREDIT_LIST_PRICE } from './cost-model';

/** Preset identity for the scenario chips (Conservative / Base / Aggressive). */
export type PresetId = 'conservative' | 'base' | 'aggressive';
export const PRESET_ORDER: PresetId[] = ['conservative', 'base', 'aggressive'];
export const PRESET_LABELS: Record<PresetId, { en: string; it: string }> = {
  conservative: { en: 'Conservative', it: 'Conservativo' },
  base: { en: 'Base', it: 'Base' },
  aggressive: { en: 'Aggressive', it: 'Ambizioso' },
};

export interface Scenario {
  id?: string;
  title: string;
  assumptions: ScopingAssumptions;
  prices: UnitPrices;
  visibility: 'private' | 'link' | 'team';
  preset?: PresetId; // set on seeded presets; absent on user-saved / custom scenarios
}

// Defaults mirror the Adobe "Real-Time CDP Collaboration Scoping Calculator"
// (Detailed Scoping block + the workbook's default assumptions).
export const DEFAULT_ASSUMPTIONS: ScopingAssumptions = {
  // mode
  collabMode: 'detailed',
  directCredits: 5_000,
  // shared audience & funnel (workbook defaults)
  onboardedIds: 10_000_000,
  avgAudienceSize: 1_000_000,
  matchRate: 0.3,
  frequencyMultiple: 10,
  reachPct: 0.5,
  conversionRate: 0.05,
  measurementEnabled: true,
  // detailed scoping
  refreshEveryXDays: 6,
  adHocCampaignsPerYear: 1,
  audiencesPerCampaign: 1,
  measurementCampaignsPerYear: 1,
  summaryReportsPerCampaign: 1,
  attributionReportsPerCampaign: 1,
  alwaysOnRunsPerYear: 0,
  // simple scoping
  simpleCampaignsPerYear: 1,
  // CJA sources (independent product — unchanged)
  webVisitsPerYear: 32_000_000,
  webHitsPerVisit: 8,
  appMau: 1_500_000,
  appEventsPerMauPerMonth: 30,
  socialAudience: 35_000_000,
  socialActivePct: 0.1,
  socialActionsPerActivePerMonth: 6,
  crmProfiles: 3_000_000,
  crmEventsPerProfilePerYear: 24,
  eventsRowsPerYear: 30_000_000,
  cjaIngestionMultiplier: 3,
};

export const DEFAULT_PRICES: UnitPrices = {
  currency: 'EUR',
  pricePerCredit: CREDIT_LIST_PRICE, // $5 list (workbook H13); quote-only in practice
  pricePerMillionRows: null,
};

export interface ScenarioPayload {
  title: string;
  assumptions: Partial<ScopingAssumptions>;
  prices?: Partial<UnitPrices>;
  preset?: PresetId;
}

export function serializeScenario(s: Scenario): ScenarioPayload {
  return { title: s.title, assumptions: s.assumptions, prices: s.prices, preset: s.preset };
}

export function deserializeScenario(payload: ScenarioPayload, id?: string): Scenario {
  return {
    id,
    title: payload.title ?? 'Scenario',
    // Spread over DEFAULT_ASSUMPTIONS so older payloads (missing the newer
    // funnel / cadence / mode fields) inherit sane defaults automatically.
    assumptions: { ...DEFAULT_ASSUMPTIONS, ...(payload.assumptions ?? {}) },
    prices: { ...DEFAULT_PRICES, ...(payload.prices ?? {}) },
    visibility: 'private',
    preset: payload.preset,
  };
}

export function scenarioIdFromSearch(search: string): string | null {
  return new URLSearchParams(search).get('scenario');
}
