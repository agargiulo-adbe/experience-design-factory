export type CollabPackage = 'none' | 'prime' | 'ultimate';

export interface ScopingAssumptions {
  collabMode: 'direct' | 'activity';
  collabPackage: CollabPackage;
  directCredits: number;
  partners: number;
  audienceSize: number;
  activationsPerYear: number;
  creditPerActivation: number;
  creditPerAudienceMgmt: number;
  creditPerMeasurement: number;
  webVisitsPerYear: number;
  webHitsPerVisit: number;
  appMau: number;
  appEventsPerMauPerMonth: number;
  socialAudience: number;
  socialActivePct: number;
  socialActionsPerActivePerMonth: number;
  crmProfiles: number;
  crmEventsPerProfilePerYear: number;
  eventsRowsPerYear: number;
}

export interface UnitPrices {
  currency: string;
  pricePerCredit: number | null;
  pricePerMillionRows: number | null;
}

export interface ScopingSnapshot {
  collabCreditsEstimated: number;
  collabAllotment: number;
  collabBillableCredits: number;
  collabCost: number | null;
  cjaRowsPerYear: number;
  cjaAnnualIngestionLimit: number;
  cjaCost: number | null;
  totalCost: number | null;
}

const ALLOTMENTS: Record<CollabPackage, number> = { none: 0, prime: 2500, ultimate: 5000 };

export function allotmentCredits(pkg: CollabPackage): number {
  return ALLOTMENTS[pkg];
}

export function estimateCollabCredits(a: ScopingAssumptions): number {
  if (a.collabMode === 'direct') return Math.max(0, a.directCredits);
  const activation = a.activationsPerYear * a.creditPerActivation;
  const management = a.partners * a.creditPerAudienceMgmt;
  const measurement = a.activationsPerYear * a.creditPerMeasurement;
  return activation + management + measurement;
}

export function billableCredits(estimated: number, allotment: number): number {
  return Math.max(0, estimated - allotment);
}

export function estimateCjaRows(a: ScopingAssumptions): number {
  const web = a.webVisitsPerYear * a.webHitsPerVisit;
  const app = a.appMau * a.appEventsPerMauPerMonth * 12;
  const social = a.socialAudience * a.socialActivePct * a.socialActionsPerActivePerMonth * 12;
  const crm = a.crmProfiles * a.crmEventsPerProfilePerYear;
  return web + app + social + crm + a.eventsRowsPerYear;
}

export function computeSnapshot(a: ScopingAssumptions, prices: UnitPrices): ScopingSnapshot {
  const collabCreditsEstimated = estimateCollabCredits(a);
  const collabAllotment = allotmentCredits(a.collabPackage);
  const collabBillableCredits = billableCredits(collabCreditsEstimated, collabAllotment);
  const cjaRowsPerYear = estimateCjaRows(a);
  const cjaAnnualIngestionLimit = cjaRowsPerYear * 3;

  const collabCost = prices.pricePerCredit == null
    ? null
    : collabBillableCredits * prices.pricePerCredit;
  const cjaCost = prices.pricePerMillionRows == null
    ? null
    : (cjaRowsPerYear / 1_000_000) * prices.pricePerMillionRows;
  const totalCost = collabCost == null && cjaCost == null
    ? null
    : (collabCost ?? 0) + (cjaCost ?? 0);

  return {
    collabCreditsEstimated,
    collabAllotment,
    collabBillableCredits,
    collabCost,
    cjaRowsPerYear,
    cjaAnnualIngestionLimit,
    cjaCost,
    totalCost,
  };
}
