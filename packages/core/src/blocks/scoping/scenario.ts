import type { ScopingAssumptions, UnitPrices, CollabPackage } from './cost-model';

export interface Scenario {
  id?: string;
  title: string;
  assumptions: ScopingAssumptions;
  prices: UnitPrices;
  visibility: 'private' | 'link' | 'team';
}

export const DEFAULT_ASSUMPTIONS: ScopingAssumptions = {
  collabMode: 'activity',
  collabPackage: 'prime' as CollabPackage,
  directCredits: 0,
  partners: 5,
  audienceSize: 15_000_000,
  activationsPerYear: 24,
  creditPerActivation: 0,
  creditPerAudienceMgmt: 0,
  creditPerMeasurement: 0,
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
}

export function serializeScenario(s: Scenario): ScenarioPayload {
  return { title: s.title, assumptions: s.assumptions, prices: s.prices };
}

export function deserializeScenario(payload: ScenarioPayload, id?: string): Scenario {
  return {
    id,
    title: payload.title ?? 'Scenario',
    assumptions: { ...DEFAULT_ASSUMPTIONS, ...(payload.assumptions ?? {}) },
    prices: { ...DEFAULT_PRICES, ...(payload.prices ?? {}) },
    visibility: 'private',
  };
}

export function scenarioIdFromSearch(search: string): string | null {
  return new URLSearchParams(search).get('scenario');
}
