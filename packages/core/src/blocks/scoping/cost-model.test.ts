import { describe, it, expect } from 'vitest';
import {
  allotmentCredits,
  refreshesPerYear,
  audienceFunnel,
  managedBaseVolume,
  collabParts,
  estimateCollabCredits,
  billableCredits,
  estimateCjaRows,
  cjaSourceRows,
  computeSnapshot,
  computeBreakdown,
  buildWarnings,
  type ScopingAssumptions,
  type UnitPrices,
} from './cost-model';
import { DEFAULT_ASSUMPTIONS } from './scenario';

// Base fixture = the shipped defaults (distinct 15M · 35% overlap · weekly · recurring).
const base: ScopingAssumptions = { ...DEFAULT_ASSUMPTIONS };
const noPrices: UnitPrices = { currency: 'EUR', pricePerCredit: null, pricePerMillionRows: null };
const prices: UnitPrices = { currency: 'EUR', pricePerCredit: 3, pricePerMillionRows: 2 };

describe('allotmentCredits', () => {
  it('maps packages to credit allotments', () => {
    expect(allotmentCredits('none')).toBe(0);
    expect(allotmentCredits('prime')).toBe(2500);
    expect(allotmentCredits('ultimate')).toBe(5000);
  });
});

describe('refreshesPerYear', () => {
  it('maps named cadences', () => {
    expect(refreshesPerYear({ ...base, refreshCadence: 'weekly' })).toBe(52);
    expect(refreshesPerYear({ ...base, refreshCadence: 'daily' })).toBe(365);
    expect(refreshesPerYear({ ...base, refreshCadence: 'monthly' })).toBe(12);
  });
  it('uses the custom count for custom cadence', () => {
    expect(refreshesPerYear({ ...base, refreshCadence: 'custom', refreshCustomPerYear: 40 })).toBe(40);
  });
});

describe('audienceFunnel', () => {
  it('derives overlap → activated / measured from rates', () => {
    const f = audienceFunnel(base);
    expect(f.distinct).toBe(15_000_000);
    expect(f.overlap).toBeCloseTo(5_250_000, 0);   // 15M × 0.35
    expect(f.activated).toBeCloseTo(5_250_000, 0);  // × 100%
    expect(f.measured).toBeCloseTo(5_250_000, 0);
  });
  it('clamps rates into [0,1]', () => {
    const f = audienceFunnel({ ...base, partnerOverlapRate: 5, activatedOverlapRate: -1 });
    expect(f.overlap).toBe(15_000_000); // clamped to 1
    expect(f.activated).toBe(0);        // clamped to 0
  });
});

describe('managedBaseVolume', () => {
  it('selects the base by managedBase', () => {
    expect(managedBaseVolume({ ...base, managedBase: 'full' })).toBe(15_000_000);
    expect(managedBaseVolume({ ...base, managedBase: 'overlap' })).toBeCloseTo(5_250_000, 0);
    expect(managedBaseVolume({ ...base, managedBase: 'custom', customManagedVolume: 2_000_000 })).toBe(2_000_000);
  });
});

describe('collabParts (activity model)', () => {
  it('breaks the estimate into management / activation / measurement', () => {
    const p = collabParts(base);
    expect(p.management).toBeCloseTo(136.5, 3);   // 5 × 5.25 × 52 × 0.1
    expect(p.activation).toBeCloseTo(12.6, 3);    // 24 × 5.25 × 0.1
    expect(p.measurement).toBeCloseTo(3.15, 3);   // 12 × 5.25 × 0.05
    expect(p.insights).toBe(0);
    expect(p.estimated).toBeCloseTo(152.25, 2);
  });

  it('uses directCredits in direct mode and zeroes the parts', () => {
    const p = collabParts({ ...base, collabMode: 'direct', directCredits: 9000 });
    expect(p.estimated).toBe(9000);
    expect(p.management).toBe(0);
    expect(p.activation).toBe(0);
  });
});

describe('activation mode — the double-count guardrail', () => {
  const both = { ...base, onDemandRuns: 6, recurringRunsPerYear: 24 };
  it('counts only recurring runs in recurring mode', () => {
    expect(collabParts({ ...both, activationMode: 'recurring' }).activationRuns).toBe(24);
  });
  it('counts only on-demand runs in on-demand mode', () => {
    expect(collabParts({ ...both, activationMode: 'on-demand' }).activationRuns).toBe(6);
  });
  it('sums both ONLY in mixed mode', () => {
    expect(collabParts({ ...both, activationMode: 'mixed' }).activationRuns).toBe(30);
  });
  it('warns when both are set but mode is not mixed', () => {
    const w = buildWarnings({ ...both, activationMode: 'recurring' });
    expect(w.some((x) => x.id === 'activation-double-count')).toBe(true);
    const w2 = buildWarnings({ ...both, activationMode: 'mixed' });
    expect(w2.some((x) => x.id === 'activation-double-count')).toBe(false);
  });
});

describe('measurement model', () => {
  const a = { ...base, measurementRunsPerYear: 12, reportsPerYear: 10, creditPerMeasurementPerMillion: 0.05, creditPerReport: 0.5 };
  it('records-based sizes on measured volume', () => {
    expect(collabParts({ ...a, measurementModel: 'records' }).measurement).toBeCloseTo(3.15, 3);
  });
  it('report-based sizes on report count', () => {
    expect(collabParts({ ...a, measurementModel: 'reports' }).measurement).toBeCloseTo(5, 3); // 10 × 0.5
  });
  it('hybrid sums both', () => {
    expect(collabParts({ ...a, measurementModel: 'hybrid' }).measurement).toBeCloseTo(8.15, 3);
  });
  it('none is zero', () => {
    expect(collabParts({ ...a, measurementModel: 'none' }).measurement).toBe(0);
  });
});

describe('billableCredits', () => {
  it('subtracts the allotment and floors at zero', () => {
    expect(billableCredits(9000, 2500)).toBe(6500);
    expect(billableCredits(1000, 2500)).toBe(0);
  });
});

describe('CJA rows', () => {
  it('sums all channel building blocks per year', () => {
    expect(estimateCjaRows(base)).toBe(1_150_000_000);
  });
  it('exposes per-source rows', () => {
    const rows = Object.fromEntries(cjaSourceRows(base).map((s) => [s.id, s.rows]));
    expect(rows.web).toBe(256_000_000);
    expect(rows.app).toBe(540_000_000);
    expect(rows.social).toBeCloseTo(252_000_000, 0);
    expect(rows.crm).toBe(72_000_000);
    expect(rows.events).toBe(30_000_000);
  });
});

describe('computeSnapshot', () => {
  it('returns quantities and hides cost when prices are null', () => {
    const s = computeSnapshot(base, noPrices);
    expect(s.collabCreditsEstimated).toBeCloseTo(152.25, 2);
    expect(s.collabBillableCredits).toBe(0); // under the Prime 2,500 allotment
    expect(s.cjaRowsPerYear).toBe(1_150_000_000);
    expect(s.cjaAnnualIngestionLimit).toBe(3_450_000_000);
    expect(s.collabCost).toBeNull();
    expect(s.totalCost).toBeNull();
  });

  it('computes cost when prices are set (direct mode over the allotment)', () => {
    const a = { ...base, collabMode: 'direct' as const, directCredits: 10_000, collabPackage: 'none' as const };
    const s = computeSnapshot(a, prices);
    expect(s.collabBillableCredits).toBe(10_000);
    expect(s.collabCost).toBe(30_000);
    expect(s.cjaCost).toBe(2_300);
    expect(s.totalCost).toBe(32_300);
  });

  it('management scales linearly with refresh cadence', () => {
    const weekly = computeSnapshot({ ...base, refreshCadence: 'weekly' }, noPrices).collabManagementCredits;
    const daily = computeSnapshot({ ...base, refreshCadence: 'daily' }, noPrices).collabManagementCredits;
    expect(daily / weekly).toBeCloseTo(365 / 52, 5);
  });
});

describe('computeBreakdown', () => {
  it('emits line items with substituted formulas', () => {
    const b = computeBreakdown(base, prices);
    const mgmt = b.collab.find((l) => l.id === 'managementCredits');
    expect(mgmt).toBeTruthy();
    expect(mgmt!.substituted).toContain('=');
    expect(b.cjaSources).toHaveLength(5);
    const totalWeight = b.cjaSources.reduce((x, s) => x + s.weightPct, 0);
    expect(totalWeight).toBeCloseTo(100, 5);
  });

  it('surfaces guardrail warnings', () => {
    const b = computeBreakdown({ ...base, partnerOverlapRate: 0 }, prices);
    expect(b.warnings.some((w) => w.id === 'no-overlap')).toBe(true);
  });
});

describe('estimateCollabCredits (compat wrapper)', () => {
  it('equals collabParts.estimated', () => {
    expect(estimateCollabCredits(base)).toBeCloseTo(collabParts(base).estimated, 6);
  });
});
