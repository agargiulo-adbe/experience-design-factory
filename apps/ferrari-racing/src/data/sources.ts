// apps/ferrari-racing/src/data/sources.ts
// Single source of truth for verified claim citations on Ferrari Racing slides.
// Every numeric claim must either appear here or carry an explicit 'illustrativo' label.

export interface Source {
  id: string;
  label: string;
  url: string;
}

export const SOURCES: Record<string, Source> = {
  ferrari_fy2025: {
    id: 'ferrari_fy2025',
    label: 'Ferrari FY2025 Full-Year Results (Feb 2026)',
    url: 'https://www.ferrari.com/en-EN/corporate/articles/2025-full-year-and-fourth-quarter-financial-results',
  },
  ferrari_cmd_2025: {
    id: 'ferrari_cmd_2025',
    label: 'Ferrari Capital Markets Day (Oct 2025) — 2030 Strategic Plan',
    url: 'https://www.ferrari.com/en-EN/corporate/articles/ferrari-capital-markets-day-targeting-new-heights',
  },
  ibm_ferrari_2026: {
    id: 'ibm_ferrari_2026',
    label: 'IBM × Scuderia Ferrari HP (May 2026)',
    url: 'https://newsroom.ibm.com/2025-05-01-ibm-and-scuderia-ferrari-hp-debut-reimagined-mobile-app-to-supercharge-global-formula-1-fan-experience',
  },
  ibm_case_study: {
    id: 'ibm_case_study',
    label: 'IBM Case Study — Scuderia Ferrari HP',
    url: 'https://www.ibm.com/case-studies/scuderia-ferrari',
  },
  adobe_rtcdp_blog: {
    id: 'adobe_rtcdp_blog',
    label: 'Adobe RT-CDP Collaboration — Improving Co-Marketing Efforts',
    url: 'https://business.adobe.com/blog/real-time-cdp-collaboration-improving-co-marketing-efforts',
  },
  adobe_summit_alterra: {
    id: 'adobe_summit_alterra',
    label: 'Adobe Summit 2025 S507 — Alterra Mountain Co.',
    url: 'https://business.adobe.com/summit/2025/sessions/data-collaboration-with-adobe-how-alterra-achieved-s507.html',
  },
  genstudio_product: {
    id: 'genstudio_product',
    label: 'GenStudio for Performance Marketing',
    url: 'https://business.adobe.com/products/genstudio-for-performance-marketing.html',
  },
  brand_concierge: {
    id: 'brand_concierge',
    label: 'Adobe Brand Concierge',
    url: 'https://business.adobe.com/products/brand-concierge.html',
  },
};

// Short citation strings for use in slide footers.
export function cite(...ids: string[]): string {
  return ids.map((id) => SOURCES[id]?.label ?? id).join(' · ');
}
