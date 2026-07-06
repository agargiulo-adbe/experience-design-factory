// apps/unicredit-engagement/src/data/sources.ts
// Single source of truth for verified claim citations on UniCredit slides.
// Every numeric claim must either appear here or carry an explicit 'illustrativo' label.

export interface Source {
  id: string;
  label: string;
  url: string;
}

export const SOURCES: Record<string, Source> = {
  unicredit_unlocked: {
    id: 'unicredit_unlocked',
    label: 'UniCredit Unlocked — Strategic Plan 2022–2024 (extended 2025)',
    url: 'https://www.unicreditgroup.eu/en/investors/financial-reporting/annual-report.html',
  },
  adobe_cx_coworker: {
    id: 'adobe_cx_coworker',
    label: 'Adobe CX Enterprise Coworker — Adobe Summit 2026 announcement',
    url: 'https://news.adobe.com/news/2026/04/adobe-unveils-cx-enterprise-coworker',
  },
  adobe_cx_analytics: {
    id: 'adobe_cx_analytics',
    label: 'Adobe CX Analytics — unified intelligence layer (Summit 2026)',
    url: 'https://news.adobe.com/news/2026/04/adobe-unveils-cx-enterprise-coworker',
  },
  adobe_rtcdp_collab: {
    id: 'adobe_rtcdp_collab',
    label: 'Adobe Real-Time CDP Collaboration',
    url: 'https://business.adobe.com/products/real-time-customer-data-platform/real-time-cdp-collaboration.html',
  },
  adobe_genstudio_ga: {
    id: 'adobe_genstudio_ga',
    label: 'GenStudio for Performance Marketing — GA',
    url: 'https://business.adobe.com/products/genstudio-for-performance-marketing.html',
  },
  adobe_project_halo: {
    id: 'adobe_project_halo',
    label: 'Adobe Project Halo — AI-led engagement for agile marketing teams (private beta)',
    url: 'https://business.adobe.com/blog/adobe-unlocks-ai-led-customer-engagement-for-agile-marketing-teams',
  },
  forrester_tei_aep: {
    id: 'forrester_tei_aep',
    label: 'Forrester TEI — Adobe Real-Time CDP (composite organization)',
    url: 'https://business.adobe.com/resources/reports/forrester-total-economic-impact-of-adobe-real-time-cdp.html',
  },
  adobe_summit_alterra: {
    id: 'adobe_summit_alterra',
    label: 'Adobe Summit 2025 S507 — Alterra Mountain Co.',
    url: 'https://business.adobe.com/summit/2025/sessions/data-collaboration-with-adobe-how-alterra-achieved-s507.html',
  },
};

// Short citation strings for use in slide footers.
export function cite(...ids: string[]): string {
  return ids.map((id) => SOURCES[id]?.label ?? id).join(' · ');
}
