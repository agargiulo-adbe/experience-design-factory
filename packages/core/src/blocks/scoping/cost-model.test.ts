import { describe, it, expect } from 'vitest';
import {
  BURN,
  ASSUMPTION_DEFAULTS,
  ceilingTo,
  recommendedCreditPack,
  audienceFunnel,
  refreshesPerYear,
  collabParts,
  estimateCollabCredits,
  simpleScopingMatrix,
  estimateCjaRows,
  cjaSourceRows,
  partnerAssumptions,
  computeSnapshot,
  computeBreakdown,
  buildWarnings,
  type ScopingAssumptions,
  type UnitPrices,
} from './cost-model';
import { DEFAULT_ASSUMPTIONS } from './scenario';

// Base fixture = the shipped defaults, which mirror the Adobe workbook defaults
// (onboarded 10M · avg audience 1M · match 30% · every 6 days · 1 campaign).
const base: ScopingAssumptions = { ...DEFAULT_ASSUMPTIONS };
const noPrices: UnitPrices = { currency: 'EUR', ferrariInstanceCost: null, partnerInstanceCost: null };
const prices: UnitPrices = { currency: 'EUR', ferrariInstanceCost: 100_000, partnerInstanceCost: 0 };

// ─── Official constants match the workbook's hidden burn/assumption table ───
describe('official constants (Adobe workbook)', () => {
  it('burn rates', () => {
    expect(BURN.management).toBe(2);       // J2
    expect(BURN.activationAdHoc).toBe(500); // J3
    expect(BURN.activationAlwaysOn).toBe(100); // J4
    expect(BURN.measurement).toBe(50);     // J5
  });
  it('default assumptions', () => {
    expect(ASSUMPTION_DEFAULTS.matchRate).toBe(0.3);
    expect(ASSUMPTION_DEFAULTS.reach).toBe(0.5);
    expect(ASSUMPTION_DEFAULTS.frequency).toBe(10);
    expect(ASSUMPTION_DEFAULTS.conversion).toBe(0.05);
    expect(ASSUMPTION_DEFAULTS.creditListPrice).toBe(5);
  });
});

describe('ceilingTo / recommendedCreditPack', () => {
  it('Excel CEILING to a step', () => {
    expect(ceilingTo(150, 10)).toBe(150);
    expect(ceilingTo(75.375, 10)).toBe(80);
    expect(ceilingTo(1216.6667, 10)).toBe(1220);
  });
  it('tiered pack sizing (Sales Calc row 31)', () => {
    expect(recommendedCreditPack(1450)).toBe(1500);  // <10k → step 500
    expect(recommendedCreditPack(6630)).toBe(7000);  // <10k → step 500
    expect(recommendedCreditPack(950)).toBe(1000);   // <1k → step 100
    expect(recommendedCreditPack(12000)).toBe(12000);// <50k → step 1000
    expect(recommendedCreditPack(60000)).toBe(60000);// ≥50k → step 5000
    expect(recommendedCreditPack(61000)).toBe(65000);
  });
});

// ─── Audience funnel: matched → impressions / conversions ───
describe('audienceFunnel', () => {
  it('derives matched, impressions and conversions (workbook C44/C56/C59)', () => {
    const f = audienceFunnel(base);
    expect(f.matched).toBe(300_000);              // 1M × 0.30
    expect(f.impressionsPerCampaign).toBe(1_500_000); // 300k × 10 × 0.5
    expect(f.conversionsPerCampaign).toBe(7_500);     // 300k × 0.5 × 0.05
  });
  it('clamps rates into [0,1]', () => {
    const f = audienceFunnel({ ...base, matchRate: 5 });
    expect(f.matched).toBe(1_000_000); // clamped to 1
  });
});

describe('refreshesPerYear', () => {
  it('every 6 days → 365/6', () => {
    expect(refreshesPerYear(base)).toBeCloseTo(365 / 6, 6);
  });
  it('clamps the cadence to 1–6 days', () => {
    expect(refreshesPerYear({ ...base, refreshEveryXDays: 1 })).toBe(365);
    expect(refreshesPerYear({ ...base, refreshEveryXDays: 30 })).toBeCloseTo(365 / 6, 6); // clamp to 6
  });
});

// ─── DETAILED scoping reconciliation (Sales Calc C67–C72) ───
describe('collabParts — detailed scoping (reconciles to the workbook)', () => {
  const p = collabParts(base);
  it('management = (10M/1M)×(365/6)×2 = 1216.6667 (C67)', () => {
    expect(p.management).toBeCloseTo(1216.6667, 3);
  });
  it('activation ad-hoc = (300k×1×1×500)/1M = 150 (C68)', () => {
    expect(p.activation).toBeCloseTo(150, 6);
  });
  it('measurement summary = (1.5M/1M)×1×1×50 = 75 (C69)', () => {
    expect(p.measurementSummary).toBeCloseTo(75, 6);
  });
  it('measurement attribution = ((7500+1.5M)/1M)×1×1×50 = 75.375 (C70)', () => {
    expect(p.measurementAttribution).toBeCloseTo(75.375, 6);
  });
  it('total credits = 1517.0417 (C72)', () => {
    expect(p.estimated).toBeCloseTo(1517.0417, 3);
    expect(estimateCollabCredits(base)).toBeCloseTo(1517.0417, 3);
  });
  it('measurement toggle off zeroes both measurement parts', () => {
    const q = collabParts({ ...base, measurementEnabled: false });
    expect(q.measurementSummary).toBe(0);
    expect(q.measurementAttribution).toBe(0);
    expect(q.estimated).toBeCloseTo(1216.6667 + 150, 3);
  });
  it('always-on activation adds (matched/1M)×runs×100', () => {
    const q = collabParts({ ...base, alwaysOnRunsPerYear: 52 });
    expect(q.activationAlwaysOn).toBeCloseTo((300_000 / 1_000_000) * 52 * 100, 6); // 1560
  });
});

// ─── SIMPLE scoping reconciliation (Sales Calc rows 27–31) ───
describe('collabParts — simple scoping (CEILING to 10 + pack tiers)', () => {
  const simple = { ...base, collabMode: 'simple' as const, simpleCampaignsPerYear: 1 };
  it('1 campaign → 1220 / 150 / 80, total 1450, pack 1500', () => {
    const p = collabParts(simple);
    expect(p.management).toBe(1220);
    expect(p.activation).toBe(150);
    expect(p.measurementSummary).toBe(80);
    expect(p.estimated).toBe(1450);
    expect(p.recommendedPack).toBe(1500);
  });
  it('24 campaigns → total 6630, pack 7000 (col K)', () => {
    const p = collabParts({ ...simple, simpleCampaignsPerYear: 24 });
    expect(p.estimated).toBe(6630);
    expect(p.recommendedPack).toBe(7000);
  });
  it('the full campaign matrix matches SUM row 30 and pack row 31', () => {
    const totals = simpleScopingMatrix(base).map((c) => c.total);
    expect(totals).toEqual([1450, 1900, 2580, 3930, 6630, 9340]);
    const packs = simpleScopingMatrix(base).map((c) => c.recommendedPack);
    expect(packs).toEqual([1500, 2000, 3000, 4000, 7000, 9500]);
  });
});

describe('direct mode', () => {
  it('uses directCredits and zeroes the activity parts', () => {
    const p = collabParts({ ...base, collabMode: 'direct', directCredits: 9000 });
    expect(p.estimated).toBe(9000);
    expect(p.management).toBe(0);
    expect(p.activation).toBe(0);
    expect(p.recommendedPack).toBe(9000); // <10k → already a 500-multiple
  });
});

// ─── CJA (independent product — unchanged) ───
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

// ─── campaign-linked refresh mode (customer critique) ───
describe('refreshesPerYear — campaign-linked mode', () => {
  it('continuous (default) = 365 / days', () => {
    expect(refreshesPerYear(base)).toBeCloseTo(365 / 6, 6);
  });
  it('campaign-linked = campaigns × refreshes per campaign', () => {
    const a: ScopingAssumptions = { ...base, refreshMode: 'campaign-linked', adHocCampaignsPerYear: 3, refreshesPerCampaign: 1 };
    expect(refreshesPerYear(a)).toBe(3);
  });
  it('campaign-linked collapses management credits vs always-on', () => {
    const cont = collabParts(base).management;
    const linked = collabParts({ ...base, refreshMode: 'campaign-linked', adHocCampaignsPerYear: 3, refreshesPerCampaign: 1 }).management;
    expect(linked).toBeLessThan(cont);
    expect(linked).toBeCloseTo((10_000_000 / 1_000_000) * 3 * 2, 6); // 60, not ~1217
  });
});

// ─── partner instances (1 Ferrari + N partner-tipo) ───
describe('partnerAssumptions', () => {
  it('overrides only the volume inputs with the partner figures', () => {
    const p = partnerAssumptions(base);
    expect(p.onboardedIds).toBe(base.partnerOnboardedIds);
    expect(p.avgAudienceSize).toBe(base.partnerAvgAudienceSize);
    expect(p.adHocCampaignsPerYear).toBe(base.partnerAdHocCampaignsPerYear);
    expect(p.matchRate).toBe(base.matchRate); // funnel rates shared with Ferrari
  });
});

// ─── Snapshot: VOLUMES stay, cost = editable per-instance hypotheses (no Adobe €) ───
describe('computeSnapshot', () => {
  it('exposes credit & row VOLUMES; hides cost when unpriced', () => {
    const s = computeSnapshot(base, noPrices);
    expect(s.collabCreditsEstimated).toBeCloseTo(1517.0417, 3); // Ferrari instance estimate
    expect(s.collabRecommendedPack).toBe(2000);                 // 1517 → CEILING 500
    expect(s.partnerInstances).toBe(3);
    expect(s.collabPartnerCreditsEach).toBeCloseTo(423.4458, 3);
    expect(s.collabPartnerPackEach).toBe(500);
    expect(s.cjaRowsPerYear).toBe(1_150_000_000);
    expect(s.cjaAnnualIngestionLimit).toBe(3_450_000_000);
    expect(s.totalCost).toBeNull();
  });
  it('cost = Ferrari instance + N × partner instance (user-set)', () => {
    const s = computeSnapshot(base, prices);
    expect(s.ferrariInstanceCost).toBe(100_000);
    expect(s.partnerInstanceCost).toBe(0);
    expect(s.partnerCostTotal).toBe(0);        // 0 × 3
    expect(s.totalCost).toBe(100_000);         // Ferrari + partners
  });
  it('partner cost scales with the per-instance cost and instance count', () => {
    const s = computeSnapshot(base, { currency: 'EUR', ferrariInstanceCost: 100_000, partnerInstanceCost: 10_000 });
    expect(s.partnerCostTotal).toBe(30_000);   // 10,000 × 3
    expect(s.totalCost).toBe(130_000);
  });
  it('no CJA cost is modelled (rows are a volume only)', () => {
    const s = computeSnapshot(base, prices);
    expect((s as unknown as Record<string, unknown>).cjaCost).toBeUndefined();
  });
  it('management scales linearly with refresh cadence', () => {
    const every6 = computeSnapshot({ ...base, refreshEveryXDays: 6 }, noPrices).collabManagementCredits;
    const every3 = computeSnapshot({ ...base, refreshEveryXDays: 3 }, noPrices).collabManagementCredits;
    expect(every3 / every6).toBeCloseTo(2, 6); // half the days → twice the refreshes
  });
});

describe('computeBreakdown', () => {
  it('emits line items with substituted formulas and the CJA source weights', () => {
    const b = computeBreakdown(base, prices);
    const mgmt = b.collab.find((l) => l.id === 'managementCredits');
    expect(mgmt).toBeTruthy();
    expect(mgmt!.substituted).toContain('=');
    expect(b.collab.find((l) => l.id === 'collabRecommendedPack')).toBeTruthy();
    expect(b.cjaSources).toHaveLength(5);
    const totalWeight = b.cjaSources.reduce((x, s) => x + s.weightPct, 0);
    expect(totalWeight).toBeCloseTo(100, 5);
  });
  it('includes the partner-instances collab cost line when priced', () => {
    const b = computeBreakdown(base, prices);
    expect(b.collab.some((l) => l.id === 'collabPartnerCost')).toBe(true);
    expect(b.collab.some((l) => l.id === 'collabTotalCost')).toBe(true);
  });
});

describe('buildWarnings', () => {
  it('warns when match rate is 0', () => {
    expect(buildWarnings({ ...base, matchRate: 0 }).some((w) => w.id === 'no-match')).toBe(true);
  });
  it('flags refresh cadence outside 1–6 days', () => {
    expect(buildWarnings({ ...base, refreshEveryXDays: 14 }).some((w) => w.id === 'refresh-range')).toBe(true);
  });
  it('informs when measurement is off', () => {
    expect(buildWarnings({ ...base, measurementEnabled: false }).some((w) => w.id === 'measurement-off')).toBe(true);
  });
});
