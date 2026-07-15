import { describe, it, expect } from 'vitest';
import {
  serializeScenario, deserializeScenario, scenarioIdFromSearch,
  DEFAULT_ASSUMPTIONS, PRESET_ORDER, type Scenario,
} from './scenario';
import type { UnitPrices } from './cost-model';

const prices: UnitPrices = { currency: 'EUR', pricePerCredit: null, pricePerMillionRows: null };
const scenario: Scenario = {
  title: 'Base',
  assumptions: { ...DEFAULT_ASSUMPTIONS, collabMode: 'direct', directCredits: 9000 },
  prices,
  visibility: 'private',
  preset: 'base',
};

describe('serialize/deserialize round-trip', () => {
  it('preserves the scenario (incl. preset) through a JSON payload', () => {
    const payload = serializeScenario(scenario);
    const back = deserializeScenario(payload);
    expect(back.title).toBe('Base');
    expect(back.assumptions.directCredits).toBe(9000);
    expect(back.assumptions.matchRate).toBe(DEFAULT_ASSUMPTIONS.matchRate);
    expect(back.preset).toBe('base');
    expect(back.visibility).toBe('private');
  });

  it('fills defaults for a partial payload (older saved scenarios)', () => {
    const back = deserializeScenario({ title: 'X', assumptions: { collabMode: 'direct' } });
    expect(back.title).toBe('X');
    // A legacy payload has none of the new funnel/cadence fields — they default:
    expect(back.assumptions.refreshEveryXDays).toBe(DEFAULT_ASSUMPTIONS.refreshEveryXDays);
    expect(back.assumptions.onboardedIds).toBe(DEFAULT_ASSUMPTIONS.onboardedIds);
    expect(back.assumptions.webHitsPerVisit).toBeTypeOf('number');
    // prices default to the workbook list price ($5) when the payload omits them:
    expect(back.prices.pricePerCredit).toBe(5);
  });
});

describe('presets', () => {
  it('orders the three presets', () => {
    expect(PRESET_ORDER).toEqual(['conservative', 'base', 'aggressive']);
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
