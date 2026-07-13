import { describe, it, expect } from 'vitest';
import {
  allotmentCredits,
  estimateCollabCredits,
  billableCredits,
  estimateCjaRows,
  computeSnapshot,
  type ScopingAssumptions,
  type UnitPrices,
} from './cost-model';

const base: ScopingAssumptions = {
  collabMode: 'activity',
  collabPackage: 'prime',
  directCredits: 0,
  partners: 5,
  audienceSize: 15_000_000,
  activationsPerYear: 24,
  creditPerActivation: 1,
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

describe('allotmentCredits', () => {
  it('maps packages to credit allotments', () => {
    expect(allotmentCredits('none')).toBe(0);
    expect(allotmentCredits('prime')).toBe(2500);
    expect(allotmentCredits('ultimate')).toBe(5000);
  });
});

describe('estimateCollabCredits', () => {
  it('uses directCredits in direct mode', () => {
    expect(estimateCollabCredits({ ...base, collabMode: 'direct', directCredits: 9000 })).toBe(9000);
  });

  it('sums activity coefficients in activity mode', () => {
    expect(estimateCollabCredits(base)).toBe(24);
  });

  it('scales with audience-management and measurement coefficients', () => {
    const a = { ...base, creditPerAudienceMgmt: 2, creditPerMeasurement: 0.5 };
    expect(estimateCollabCredits(a)).toBe(46);
  });
});

describe('billableCredits', () => {
  it('subtracts the bundled allotment and floors at zero', () => {
    expect(billableCredits(9000, 2500)).toBe(6500);
    expect(billableCredits(1000, 2500)).toBe(0);
  });
});

describe('estimateCjaRows', () => {
  it('sums all channel building blocks per year', () => {
    expect(estimateCjaRows(base)).toBe(1_150_000_000);
  });
});

describe('computeSnapshot', () => {
  it('hides cost when prices are null but always returns quantities', () => {
    const prices: UnitPrices = { currency: 'EUR', pricePerCredit: null, pricePerMillionRows: null };
    const s = computeSnapshot(base, prices);
    expect(s.cjaRowsPerYear).toBe(1_150_000_000);
    expect(s.cjaAnnualIngestionLimit).toBe(3_450_000_000);
    expect(s.collabBillableCredits).toBe(0);
    expect(s.collabCost).toBeNull();
    expect(s.cjaCost).toBeNull();
    expect(s.totalCost).toBeNull();
  });

  it('computes cost when prices are set', () => {
    const a = { ...base, collabMode: 'direct' as const, directCredits: 10_000, collabPackage: 'none' as const };
    const prices: UnitPrices = { currency: 'EUR', pricePerCredit: 3, pricePerMillionRows: 2 };
    const s = computeSnapshot(a, prices);
    expect(s.collabBillableCredits).toBe(10_000);
    expect(s.collabCost).toBe(30_000);
    expect(s.cjaCost).toBe(2300);
    expect(s.totalCost).toBe(32_300);
  });
});
