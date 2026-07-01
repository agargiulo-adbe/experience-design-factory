export type SolutionPillar = 'foundation' | 'data' | 'journeys' | 'content' | 'analytics' | 'personalization' | 'b2b';

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
];

export const PROJECTS: ConsoleProject[] = [
  {
    slug: 'unicredit-engagement',
    name: 'Engagement Unlimited',
    client: 'UniCredit',
    description: 'Come Adobe trasforma ogni interazione digitale in una relazione che crea valore — per ogni cliente UniCredit, in ogni momento.',
    baseUrl: '/experience-design-factory/unicredit-engagement/',
    solutions: UNICREDIT_SOLUTIONS,
  },
  {
    slug: 'generazioni-maxmara',
    name: 'Generazioni',
    client: 'Max Mara',
    description: "L'eredità generazionale del guardaroba Max Mara — come Adobe Experience Cloud alimenta la relazione con le clienti.",
    baseUrl: '/experience-design-factory/',
    solutions: [],
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
};

export const PILLAR_ORDER: SolutionPillar[] = [
  'foundation',
  'data',
  'journeys',
  'content',
  'analytics',
  'personalization',
  'b2b',
];
