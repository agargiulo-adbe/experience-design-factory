import type { ScopingAssumptions, UnitPrices, CollabPackage } from './cost-model';

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

export const DEFAULT_ASSUMPTIONS: ScopingAssumptions = {
  // mode & package
  collabMode: 'activity',
  collabPackage: 'prime' as CollabPackage,
  directCredits: 5_000,
  // footprint
  partners: 5,
  // audience funnel
  audienceSize: 15_000_000,
  partnerOverlapRate: 0.35,
  activatedOverlapRate: 1,
  measuredOverlapRate: 1,
  // management
  managedBase: 'overlap',
  customManagedVolume: 5_000_000,
  managedAudiences: 5,
  refreshCadence: 'weekly',
  refreshCustomPerYear: 52,
  creditPerMgmtPerMillionRefresh: 0.1,
  // insights
  insightsRunsPerYear: 0,
  creditPerInsight: 0,
  // activation
  activationMode: 'recurring',
  onDemandRuns: 6,
  recurringRunsPerYear: 24,
  creditPerActivationPerMillion: 0.1,
  // measurement
  measurementModel: 'records',
  measurementRunsPerYear: 12,
  reportsPerYear: 12,
  creditPerMeasurementPerMillion: 0.05,
  creditPerReport: 0.5,
  // CJA sources
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
  pricePerCredit: null,
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
