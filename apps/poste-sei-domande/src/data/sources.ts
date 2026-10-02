/**
 * Fonti pubbliche citate sulle slide. Solo ciò che è pubblicato: release notes,
 * documentazione developer, comunicati. Niente materiale interno Adobe.
 */
export interface Source { id: string; label: { it: string; en: string }; url: string; }

export const SOURCES: Record<string, Source> = {
  aaRelease: {
    id: 'aaRelease',
    label: { it: 'Adobe Analytics, release notes settembre 2026', en: 'Adobe Analytics release notes, September 2026' },
    url: 'https://experienceleague.adobe.com/en/docs/analytics/release-notes/latest',
  },
  coworkerNews: {
    id: 'coworkerNews',
    label: { it: 'Adobe News, GA di CX Enterprise Coworker, 10 giu 2026', en: 'Adobe News, CX Enterprise Coworker GA, 10 Jun 2026' },
    url: 'https://news.adobe.com/news/2026/06/adobe-announces-general-availability-of-cx-enterprise-coworker',
  },
  coworkerDocs: {
    id: 'coworkerDocs',
    label: { it: 'Experience League, Coworker Chat: casi d’uso (oggi documentati su CJA)', en: 'Experience League, Coworker Chat use cases (documented on CJA today)' },
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/coworker/chat/use-cases/overview',
  },
  mcpFaq: {
    id: 'mcpFaq',
    label: { it: 'Adobe Developer, MCP Analytics: FAQ (licenza e limiti)', en: 'Adobe Developer, Analytics MCP: FAQ (licensing and limits)' },
    url: 'https://developer.adobe.com/analytics-mcp/docs/support/faq',
  },
  coworkerChat: {
    id: 'coworkerChat',
    label: { it: 'Experience League, Coworker Chat: panoramica e guida all’interfaccia', en: 'Experience League, Coworker Chat: overview and UI guide' },
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/coworker/chat/ui-guide',
  },
  coworkerRca: {
    id: 'coworkerRca',
    label: { it: 'Experience League, Coworker: root-cause analysis (doc CJA; versione Analytics dal 2 ott)', en: 'Experience League, Coworker: root-cause analysis (CJA doc; Analytics version from 2 Oct)' },
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/coworker/chat/use-cases/data-insights/root-cause-analysis',
  },
  mcpDocs: {
    id: 'mcpDocs',
    label: { it: 'Adobe Developer, MCP server per Adobe Analytics', en: 'Adobe Developer, Adobe Analytics MCP server' },
    url: 'https://developer.adobe.com/analytics-mcp/docs/',
  },
  mcpTools: {
    id: 'mcpTools',
    label: { it: 'Adobe Developer, riferimento dei tool MCP Analytics', en: 'Adobe Developer, Analytics MCP tool reference' },
    url: 'https://developer.adobe.com/analytics-mcp/docs/aa/reference',
  },
  mcpGuides: {
    id: 'mcpGuides',
    label: { it: 'Adobe Developer, MCP Analytics: primi passi e permessi', en: 'Adobe Developer, Analytics MCP: getting started and permissions' },
    url: 'https://developer.adobe.com/analytics-mcp/docs/guides/',
  },
  mcpClaude: {
    id: 'mcpClaude',
    label: { it: 'Adobe Developer, connettere Claude', en: 'Adobe Developer, connect Claude' },
    url: 'https://developer.adobe.com/analytics-mcp/docs/guides/claude',
  },
  posteApp: {
    id: 'posteApp',
    label: { it: 'TG Poste, l’App «P» supera i 18 milioni di utenti, 23 set 2026', en: 'TG Poste, the “P” App passes 18 million users, 23 Sep 2026' },
    url: 'https://tgposte.poste.it/tgposte/2026/09/23/tg-poste-del-23-settembre-2026/',
  },
  posteStrategy: {
    id: 'posteStrategy',
    label: { it: 'Poste Italiane, risultati 1S 2026 e aggiornamento sulla strategia, lug 2026', en: 'Poste Italiane, 1H 2026 results and strategy update, Jul 2026' },
    url: 'https://www.media.poste.it/970f026a-a8d1-47df-97a1-e6d77def1b0b/file/PI_Q2-26_CS_ITA',
  },
  posteManifesto: {
    id: 'posteManifesto',
    label: { it: 'Poste Italiane, Manifesto per un uso etico e responsabile dell’IA', en: 'Poste Italiane, Manifesto for an ethical and responsible use of AI' },
    url: 'https://www.posteitaliane.it/it/manifesto-intelligenza-artificiale.html',
  },
  aaApi14: {
    id: 'aaApi14',
    label: { it: 'Adobe Analytics, fine vita API 1.4 (31 ago 2026)', en: 'Adobe Analytics, API 1.4 end of life (31 Aug 2026)' },
    url: 'https://developer.adobe.com/analytics-apis/docs/1.4/guides/eol/',
  },
  targetMcp: {
    id: 'targetMcp',
    label: { it: 'Experience League, Coworker: analizzare e lanciare attività Adobe Target', en: 'Experience League, Coworker: analyse and launch Adobe Target activities' },
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/coworker/chat/use-cases/optimization/target',
  },
};
