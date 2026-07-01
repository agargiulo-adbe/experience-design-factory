import type { AdobeSolution } from '@edf/core/registry/solutions';

export const UNICREDIT_SOLUTIONS: AdobeSolution[] = [
  {
    id: 'aep',
    name: 'Adobe Experience Platform',
    shortName: 'AEP',
    pillar: 'foundation',
    description: {
      it: 'La fondazione dati che unifica i profili cliente in tempo reale',
      en: 'The data foundation that unifies customer profiles in real time',
    },
  },
  {
    id: 'rtcdp',
    name: 'Real-Time CDP',
    shortName: 'RT-CDP',
    pillar: 'data',
    description: {
      it: 'Profili unificati e audience in tempo reale su 7 milioni di clienti',
      en: 'Unified profiles and real-time audiences across 7 million customers',
    },
  },
  {
    id: 'cja',
    name: 'Customer Journey Analytics',
    shortName: 'CJA',
    pillar: 'analytics',
    description: {
      it: "Insight cross-canale: dal branch al mobile, in un'unica vista",
      en: 'Cross-channel insights: from branch to mobile, in one unified view',
    },
  },
  {
    id: 'ajo-b2c',
    name: 'Journey Optimizer',
    shortName: 'AJO',
    pillar: 'journeys',
    description: {
      it: 'Orchestrazione omnicanale per acquisizione, onboarding e servicing',
      en: 'Omnichannel orchestration for acquisition, onboarding, and servicing',
    },
  },
  {
    id: 'aem-sites',
    name: 'AEM Sites & Edge Delivery',
    shortName: 'AEM Sites',
    pillar: 'content',
    description: {
      it: 'Gestione dei canali digitali con velocità editoriale enterprise',
      en: 'Digital channel management with enterprise editorial speed',
    },
  },
  {
    id: 'aem-assets',
    name: 'AEM Assets + Dynamic Media',
    shortName: 'AEM Assets',
    pillar: 'content',
    description: {
      it: 'DAM enterprise per contenuti multicanale personalizzati a scala',
      en: 'Enterprise DAM for personalized multi-channel content at scale',
    },
  },
  {
    id: 'genstudio',
    name: 'GenStudio for Performance Marketing',
    shortName: 'GenStudio',
    pillar: 'content',
    description: {
      it: 'Creazione e attivazione di contenuti on-brand per ogni segmento',
      en: 'On-brand content creation and activation for every segment',
    },
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    shortName: 'Firefly',
    pillar: 'content',
    description: {
      it: 'Generazione di immagini AI sicure per uso commerciale',
      en: 'AI image generation safe for commercial use',
    },
  },
  {
    id: 'target',
    name: 'Adobe Target',
    shortName: 'Target',
    pillar: 'personalization',
    description: {
      it: 'Test A/B e personalizzazione per ottimizzare ogni touchpoint digitale',
      en: 'A/B testing and personalization to optimize every digital touchpoint',
    },
  },
  {
    id: 'ajo-b2b',
    name: 'Journey Optimizer B2B Edition',
    shortName: 'AJO B2B',
    pillar: 'b2b',
    description: {
      it: 'Orchestrazione AI-powered per le relazioni con PMI e corporate',
      en: 'AI-powered orchestration for SME and corporate relationships',
    },
  },
  {
    id: 'marketo',
    name: 'Marketo Engage',
    shortName: 'Marketo',
    pillar: 'b2b',
    description: {
      it: 'Marketing automation B2B per lead generation e nurturing corporate',
      en: 'B2B marketing automation for corporate lead generation and nurturing',
    },
  },
];

export const DEFAULT_ENABLED_SOLUTIONS = UNICREDIT_SOLUTIONS.map((s) => s.id);

export function getSolutionById(id: string): AdobeSolution | undefined {
  return UNICREDIT_SOLUTIONS.find((s) => s.id === id);
}

export function getSolutionsByPillar(
  pillar: AdobeSolution['pillar'],
): AdobeSolution[] {
  return UNICREDIT_SOLUTIONS.filter((s) => s.pillar === pillar);
}
