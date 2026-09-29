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
    label: { it: 'Experience League, Coworker Chat: casi d’uso', en: 'Experience League, Coworker Chat use cases' },
    url: 'https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/coworker/chat/use-cases/overview',
  },
  coworkerRca: {
    id: 'coworkerRca',
    label: { it: 'Experience League, Coworker: root-cause analysis', en: 'Experience League, Coworker: root-cause analysis' },
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
    label: { it: 'Adobe Developer, guida ai permessi MCP', en: 'Adobe Developer, MCP access guide' },
    url: 'https://developer.adobe.com/analytics-mcp/docs/guides/',
  },
  mcpClaude: {
    id: 'mcpClaude',
    label: { it: 'Adobe Developer, connettere Claude', en: 'Adobe Developer, connect Claude' },
    url: 'https://developer.adobe.com/analytics-mcp/docs/guides/claude',
  },
  posteApp: {
    id: 'posteApp',
    label: { it: 'Poste Italiane, l’App raggiunge 18,2 milioni di utenti, set 2026', en: 'Poste Italiane, the App reaches 18.2 million users, Sep 2026' },
    url: 'https://www.posteitaliane.it/it/news.html',
  },
  posteStrategy: {
    id: 'posteStrategy',
    label: { it: 'Poste Italiane, Strategy Update 2026', en: 'Poste Italiane, 2026 Strategy Update' },
    url: 'https://www.posteitaliane.it/en/group-strategy.html',
  },
  posteManifesto: {
    id: 'posteManifesto',
    label: { it: 'Poste Italiane, Manifesto per un uso etico e responsabile dell’IA, mag 2025', en: 'Poste Italiane, Manifesto for an ethical and responsible use of AI, May 2025' },
    url: 'https://www.posteitaliane.it/it/intelligenza-artificiale.html',
  },
  aaApi14: {
    id: 'aaApi14',
    label: { it: 'Adobe Analytics, fine vita API 1.4 (31 ago 2026)', en: 'Adobe Analytics, API 1.4 end of life (31 Aug 2026)' },
    url: 'https://experienceleague.adobe.com/en/docs/analytics/release-notes/latest',
  },
  targetMcp: {
    id: 'targetMcp',
    label: { it: 'Experience League, MCP server per Adobe Target', en: 'Experience League, Adobe Target MCP server' },
    url: 'https://experienceleague.adobe.com/en/docs/target/using/mcp/target-mcp',
  },
};
