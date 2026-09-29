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
  adobe_cx_coworker_ga: {
    id: 'adobe_cx_coworker_ga',
    label: 'Adobe CX Enterprise Coworker — general availability (Adobe News, 10 June 2026)',
    url: 'https://news.adobe.com/news/2026/06/adobe-announces-general-availability-of-cx-enterprise-coworker',
  },
  adobe_cx_coworker_blog: {
    id: 'adobe_cx_coworker_blog',
    label: 'Introducing CX Enterprise Coworker — Adobe blog (19 June 2026)',
    url: 'https://business.adobe.com/blog/introducing-cx-enterprise-coworker',
  },
  el_coworker_chat: {
    id: 'el_coworker_chat',
    label: 'Coworker Chat overview — Experience League',
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/coworker/chat/overview',
  },
  el_coworker_ui: {
    id: 'el_coworker_ui',
    label: 'Coworker Chat UI guide (plan mode, availability by application) — Experience League',
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/coworker/chat/ui-guide',
  },
  el_coworker_cja: {
    id: 'el_coworker_cja',
    label: 'Analyze Customer Journey Analytics data with Coworker Chat — Experience League',
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/coworker/chat/use-cases/data-insights/analytics-chat',
  },
  el_coworker_ajo: {
    id: 'el_coworker_ajo',
    label: 'Coworker for journeys — Adobe Journey Optimizer guide',
    url: 'https://experienceleague.adobe.com/en/docs/journey-optimizer/using/orchestrate-journeys/journeys-coworker-skills',
  },
  el_coworker_aem: {
    id: 'el_coworker_aem',
    label: 'Agentic capabilities in AEM through CX Enterprise Coworker — Experience League',
    url: 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/ai-in-aem/agentic-capabilities/overview',
  },
  el_coworker_gateway: {
    id: 'el_coworker_gateway',
    label: 'Adobe CX Coworker Gateway (unified MCP endpoint) — Experience League',
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/mcp/overview',
  },
  el_coworker_workfront: {
    id: 'el_coworker_workfront',
    label: 'CX Coworker in Workfront — availability note — Experience League',
    url: 'https://experienceleague.adobe.com/en/docs/workfront/using/basics/coworker-in-workfront/coworker-overview',
  },
  el_coworker_use_cases: {
    id: 'el_coworker_use_cases',
    label: 'Coworker Chat use cases and sample prompts — Experience League',
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/coworker/chat/use-cases/overview',
  },
  adobe_cx_analytics: {
    id: 'adobe_cx_analytics',
    label: 'Adobe CX Analytics — unified intelligence layer (Summit 2026)',
    url: 'https://news.adobe.com/news/2026/04/adobe-unveils-cx-enterprise-coworker',
  },
  adobe_cja: {
    id: 'adobe_cja',
    label: 'Adobe Customer Journey Analytics',
    url: 'https://business.adobe.com/products/analytics/customer-journey-analytics.html',
  },
  adobe_content_analytics: {
    id: 'adobe_content_analytics',
    label: 'Adobe Content Analytics',
    url: 'https://business.adobe.com/products/analytics/content-analytics.html',
  },
  adobe_workfront: {
    id: 'adobe_workfront',
    label: 'Adobe Workfront',
    url: 'https://business.adobe.com/products/workfront/main.html',
  },
  adobe_aem_sites: {
    id: 'adobe_aem_sites',
    label: 'Adobe Experience Manager Sites',
    url: 'https://business.adobe.com/products/experience-manager/sites/aem-sites.html',
  },
  adobe_target: {
    id: 'adobe_target',
    label: 'Adobe Target',
    url: 'https://business.adobe.com/products/target/adobe-target.html',
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
  adobe_customer_stories: {
    id: 'adobe_customer_stories',
    label: 'Adobe customer success stories (public)',
    url: 'https://business.adobe.com/customer-success-stories/index.html',
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
