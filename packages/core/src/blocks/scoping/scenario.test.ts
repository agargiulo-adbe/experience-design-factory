import { describe, it, expect } from 'vitest';
import { serializeScenario, deserializeScenario, scenarioIdFromSearch, type Scenario } from './scenario';
import type { ScopingAssumptions, UnitPrices } from './cost-model';

const assumptions: ScopingAssumptions = {
  collabMode: 'direct', collabPackage: 'prime', directCredits: 9000,
  partners: 5, audienceSize: 15_000_000, activationsPerYear: 24,
  creditPerActivation: 0, creditPerAudienceMgmt: 0, creditPerMeasurement: 0,
  webVisitsPerYear: 32_000_000, webHitsPerVisit: 8, appMau: 1_500_000,
  appEventsPerMauPerMonth: 30, socialAudience: 35_000_000, socialActivePct: 0.1,
  socialActionsPerActivePerMonth: 6, crmProfiles: 3_000_000,
  crmEventsPerProfilePerYear: 24, eventsRowsPerYear: 30_000_000,
};
const prices: UnitPrices = { currency: 'EUR', pricePerCredit: null, pricePerMillionRows: null };
const scenario: Scenario = { title: 'Base', assumptions, prices, visibility: 'private' };

describe('serialize/deserialize round-trip', () => {
  it('preserves the scenario through a JSON payload', () => {
    const payload = serializeScenario(scenario);
    const back = deserializeScenario(payload);
    expect(back.title).toBe('Base');
    expect(back.assumptions.directCredits).toBe(9000);
    expect(back.visibility).toBe('private');
  });

  it('fills defaults for a missing/partial payload', () => {
    const back = deserializeScenario({ title: 'X', assumptions: { collabMode: 'direct' } });
    expect(back.title).toBe('X');
    expect(back.assumptions.webHitsPerVisit).toBeTypeOf('number');
    expect(back.prices.pricePerCredit).toBeNull();
    expect(back.visibility).toBe('private');
  });
});

describe('scenarioIdFromSearch', () => {
  it('reads the ?scenario= uuid', () => {
    expect(scenarioIdFromSearch('?scenario=abc-123')).toBe('abc-123');
  });
  it('returns null when absent', () => {
    expect(scenarioIdFromSearch('?foo=1')).toBeNull();
  });
});
