export type SolutionPillar = 'foundation' | 'data' | 'journeys' | 'content' | 'analytics' | 'personalization' | 'b2b' | 'intelligence';

export interface MediaSlot {
  id: string;
  label: string;
  page: string;
}

export interface ConsoleSolution {
  id: string;
  name: string;
  shortName: string;
  pillar: SolutionPillar;
  description: string;
  pagesGated: string[];
}

export interface ConsoleProject {
  slug: string;
  name: string;
  client: string;
  description: string;
  baseUrl: string;
  solutions: ConsoleSolution[];
  mediaSlots?: MediaSlot[];
}

const UNICREDIT_SOLUTIONS: ConsoleSolution[] = [
  {
    id: 'aep',
    name: 'Adobe Experience Platform',
    shortName: 'AEP',
    pillar: 'foundation',
    description: 'Foundation: unifica tutti i dati cliente in real-time.',
    pagesGated: [],
  },
  {
    id: 'rtcdp',
    name: 'Real-Time CDP',
    shortName: 'RT-CDP',
    pillar: 'data',
    description: 'Profili unificati e audience segmentation in tempo reale.',
    pagesGated: ['Conosci'],
  },
  {
    id: 'cja',
    name: 'Customer Journey Analytics',
    shortName: 'CJA',
    pillar: 'analytics',
    description: 'Cross-channel analytics: dal branch al mobile in una vista.',
    pagesGated: ['Analizza'],
  },
  {
    id: 'ajo-b2c',
    name: 'Journey Optimizer B2C',
    shortName: 'AJO B2C',
    pillar: 'journeys',
    description: 'Orchestrazione omnicanale per acquisizione e engagement.',
    pagesGated: ['Acquisisci', 'Coinvolgi'],
  },
  {
    id: 'aem-sites',
    name: 'AEM Sites & Edge Delivery',
    shortName: 'AEM Sites',
    pillar: 'content',
    description: 'Gestione canali digitali con velocità editoriale enterprise.',
    pagesGated: ['Acquisisci'],
  },
  {
    id: 'aem-assets',
    name: 'AEM Assets + Dynamic Media',
    shortName: 'AEM Assets',
    pillar: 'content',
    description: 'DAM enterprise per contenuti multicanale a scala.',
    pagesGated: ['Contenuti'],
  },
  {
    id: 'genstudio',
    name: 'GenStudio for Performance Marketing',
    shortName: 'GenStudio',
    pillar: 'content',
    description: 'Varianti di contenuto on-brand in pochi minuti.',
    pagesGated: ['Contenuti'],
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    shortName: 'Firefly',
    pillar: 'content',
    description: 'AI image generation sicura per uso commerciale.',
    pagesGated: [],
  },
  {
    id: 'target',
    name: 'Adobe Target',
    shortName: 'Target',
    pillar: 'personalization',
    description: 'A/B testing e personalizzazione su ogni touchpoint digitale.',
    pagesGated: ['Coinvolgi'],
  },
  {
    id: 'ajo-b2b',
    name: 'Journey Optimizer B2B Edition',
    shortName: 'AJO B2B',
    pillar: 'b2b',
    description: 'Account-based journeys per PMI e corporate banking.',
    pagesGated: ['B2B'],
  },
  {
    id: 'marketo',
    name: 'Marketo Engage',
    shortName: 'Marketo',
    pillar: 'b2b',
    description: 'Marketing automation B2B per lead generation corporate.',
    pagesGated: ['B2B'],
  },
  {
    id: 'cx-analytics',
    name: 'Adobe CX Analytics',
    shortName: 'CX Analytics',
    pillar: 'intelligence',
    description: 'Nuovo umbrella: CJA + Content Analytics + Adobe Analytics — intelligence unificata.',
    pagesGated: ['Analizza'],
  },
  {
    id: 'data-insights-agent',
    name: 'Data Insights Agent',
    shortName: 'DIA',
    pillar: 'intelligence',
    description: 'AI agent per root cause analysis in linguaggio naturale — powered by Adobe AI Platform.',
    pagesGated: ['Analizza'],
  },
  {
    id: 'content-analytics',
    name: 'Adobe Content Analytics',
    shortName: 'Content Analytics',
    pillar: 'intelligence',
    description: 'Misura quale contenuto porta a risultati — per segmento, canale, momento del journey.',
    pagesGated: ['Contenuti', 'Analizza'],
  },
  {
    id: 'mix-modeler',
    name: 'Adobe Mix Modeler',
    shortName: 'Mix Modeler',
    pillar: 'intelligence',
    description: 'Marketing Campaign Analytics con causal AI — full-funnel attribution e budget optimization.',
    pagesGated: ['Analizza'],
  },
];

// Media slots are dynamic demo boxes inside deck slides.
// Each slot is addressable by ID; config is stored in localStorage key
// `edf:media-slots:<project-slug>` and applied at runtime (no server needed).
export const PROJECTS: ConsoleProject[] = [
  {
    slug: 'unicredit-engagement',
    name: 'Engagement Unlimited',
    client: 'UniCredit',
    description: 'Come Adobe trasforma ogni interazione digitale in una relazione che crea valore — per ogni cliente UniCredit, in ogni momento.',
    baseUrl: '/experience-design-factory/unicredit-engagement/',
    solutions: UNICREDIT_SOLUTIONS,
    mediaSlots: [
      { id: 'conosci-rtcdp-demo', label: 'RT-CDP Unified Profile', page: 'Conosci' },
      { id: 'acquisisci-jo-demo', label: 'Journey Optimizer Demo', page: 'Acquisisci' },
      { id: 'coinvolgi-target-demo', label: 'Adobe Target Demo', page: 'Coinvolgi' },
      { id: 'coinvolgi-experimentation-demo', label: 'Experimentation Accelerator', page: 'Coinvolgi' },
      { id: 'contenuti-genstudio-demo', label: 'GenStudio Demo', page: 'Contenuti' },
      { id: 'contenuti-brandconcierge-demo', label: 'Brand Concierge Demo', page: 'Contenuti' },
      { id: 'analizza-dia-demo', label: 'Data Insights Agent Demo', page: 'Analizza' },
      { id: 'analizza-cxa-demo', label: 'CX Analytics Dashboard', page: 'Analizza' },
      { id: 'coworker-chat-demo', label: 'Coworker Chat Demo', page: 'Coworker AI' },
      { id: 'coworker-campaigns-demo', label: 'Coworker Campaigns Demo', page: 'Coworker AI' },
      { id: 'motore-stack-demo', label: 'AI Platform Architecture', page: 'Motore Adobe' },
    ],
  },
  {
    slug: 'ferrari-racing',
    name: 'Pole Position',
    client: 'Ferrari Racing',
    description: 'Come il dato trasforma ogni sponsorship in una partnership misurabile — Ferrari Racing e i suoi Partner Sponsor, con Adobe.',
    baseUrl: '/experience-design-factory/ferrari-racing/',
    solutions: [
      { id: 'rtcdp-collab', name: 'Real-Time CDP Collaboration', shortName: 'RT-CDP Collab', pillar: 'data', description: 'Ferrari e i Partner definiscono insieme le audience, privacy-first.', pagesGated: ['Define'] },
      { id: 'genstudio', name: 'GenStudio for Performance Marketing', shortName: 'GenStudio', pillar: 'content', description: 'I Partner creano on-brand; risultati campagna integrati.', pagesGated: ['Create', 'Activate'] },
      { id: 'express', name: 'Adobe Express', shortName: 'Express', pillar: 'content', description: 'Template brand-safe per i team dei Partner.', pagesGated: ['Create'] },
      { id: 'brand', name: 'Brand Guardrails (GenStudio)', shortName: 'Brand', pillar: 'content', description: 'Controlli brand GenStudio: verifica pre-pubblicazione e monitoraggio post — garantisce conformità alle linee guida Ferrari.', pagesGated: ['Create'] },
      { id: 'cja', name: 'Customer Journey Analytics', shortName: 'CJA', pillar: 'analytics', description: 'Aggrega i risultati di tutti i Partner in una vista.', pagesGated: ['Analytics'] },
      { id: 'aep', name: 'Adobe Experience Platform', shortName: 'AEP', pillar: 'foundation', description: 'La fondazione dati del loop.', pagesGated: [] },
    ],
  },
  {
    slug: 'generazioni-maxmara',
    name: 'Generazioni',
    client: 'Max Mara',
    description: "L'eredità generazionale del guardaroba Max Mara — come Adobe Experience Cloud alimenta la relazione con le clienti.",
    baseUrl: '/experience-design-factory/generazioni-maxmara/',
    solutions: [],
  },
  {
    slug: 'trenitalia-connessioni',
    name: 'Connessioni Intelligenti',
    client: 'FS Group',
    description: 'Il dato che connette treni, viaggiatori e servizi in un unico journey misurabile — FS Group con Adobe.',
    baseUrl: '/experience-design-factory/trenitalia-connessioni/',
    solutions: [
      { id: 'cja', name: 'Customer Journey Analytics', shortName: 'CJA', pillar: 'analytics', description: 'Layer di convergenza cross-sistema: unifica AA, App, Responsys, Salesforce e FS Park in un\'unica vista del journey cliente.', pagesGated: ['CJA — Convergenza', 'Connessioni FS Park', 'Roadmap Adobe'] },
      { id: 'rtcdp', name: 'Adobe Real-Time CDP', shortName: 'RT-CDP', pillar: 'data', description: 'Profili cliente unificati in real-time: risoluzione identità cross-sistema e segmentazione streaming per AJO.', pagesGated: ['Roadmap Adobe'] },
      { id: 'ajo', name: 'Adobe Journey Optimizer', shortName: 'AJO', pillar: 'journeys', description: 'Orchestrazione journey omnicanale con AI: trigger CJA → decisione canale → esecuzione su Responsys/push/AEM.', pagesGated: ['Roadmap Adobe'] },
      { id: 'mix-modeler', name: 'Adobe Mix Modeler', shortName: 'Mix Modeler', pillar: 'intelligence', description: 'Media Mix Modeling con Causal AI: misura il contributo incrementale di ogni canale e ottimizza il budget media cross-canale.', pagesGated: ['Roadmap Adobe'] },
      { id: 'data-collab', name: 'Adobe Data Collaboration', shortName: 'Data Collab', pillar: 'data', description: 'Clean room privacy-first per FS Park × Trenitalia: audience matching GDPR-compliant senza condividere PII.', pagesGated: ['Connessioni FS Park', 'Roadmap Adobe'] },
    ],
  },
];

export function getProject(slug: string): ConsoleProject | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const PILLAR_LABELS: Record<SolutionPillar, string> = {
  foundation: 'Foundation',
  data: 'Data & Profiles',
  journeys: 'Journeys',
  content: 'Content',
  analytics: 'Analytics',
  personalization: 'Personalization',
  b2b: 'B2B',
  intelligence: 'CX Analytics & AI',
};

export const PILLAR_ORDER: SolutionPillar[] = [
  'foundation',
  'data',
  'journeys',
  'content',
  'analytics',
  'intelligence',
  'personalization',
  'b2b',
];
