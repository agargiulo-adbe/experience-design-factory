import type { Locale } from '../i18n/index.js';

export interface AdobeProduct {
  id: string;
  name: string;
  claim: Record<Locale, string>;
  phase: string[];
  icon: string;
}

export const adobeProducts: AdobeProduct[] = [
  // --- Core / Trasversale ---
  {
    id: 'aep',
    name: 'Adobe Experience Platform',
    claim: {
      it: 'La base dati unificata che trasforma il data lake in profili azionabili in tempo reale',
      en: 'The unified data foundation turning the data lake into real-time actionable profiles',
    },
    phase: ['core'],
    icon: 'aep',
  },
  {
    id: 'rtcdp',
    name: 'Real-Time CDP',
    claim: {
      it: 'Profili cliente unificati e audience pronte all\'azione, dal data lake ai canali',
      en: 'Unified customer profiles and actionable audiences, from data lake to channels',
    },
    phase: ['core', 'acquisizione', 'loyalty'],
    icon: 'rtcdp',
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    claim: {
      it: 'Intelligenza artificiale integrata per analisi, automazione e insight conversazionali',
      en: 'Integrated AI for analysis, automation, and conversational insights',
    },
    phase: ['core'],
    icon: 'ai-assistant',
  },
  {
    id: 'agent-orchestrator',
    name: 'Agent Orchestrator',
    claim: {
      it: 'Orchestrazione di agenti AI per automatizzare workflow complessi end-to-end',
      en: 'AI agent orchestration for end-to-end complex workflow automation',
    },
    phase: ['core'],
    icon: 'agent-orchestrator',
  },
  // --- Acquisizione ---
  {
    id: 'cja',
    name: 'Customer Journey Analytics',
    claim: {
      it: 'Analisi cross-channel del percorso cliente per ottimizzare ogni punto di contatto',
      en: 'Cross-channel customer journey analysis to optimize every touchpoint',
    },
    phase: ['acquisizione', 'loyalty'],
    icon: 'cja',
  },
  {
    id: 'genstudio',
    name: 'GenStudio for Performance Marketing',
    claim: {
      it: 'Creatività on-brand a scala con AI generativa — internalizza parte del lavoro delle agenzie',
      en: 'On-brand creativity at scale with generative AI — internalize part of agency work',
    },
    phase: ['acquisizione'],
    icon: 'genstudio',
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    claim: {
      it: 'Generazione di immagini e contenuti creativi con AI, sicuri per uso commerciale',
      en: 'AI-powered creative content and image generation, safe for commercial use',
    },
    phase: ['acquisizione'],
    icon: 'firefly',
  },
  {
    id: 'express',
    name: 'Adobe Express',
    claim: {
      it: 'Creazione rapida di contenuti on-brand per ogni team, senza necessità di designer',
      en: 'Rapid on-brand content creation for every team, no designer needed',
    },
    phase: ['acquisizione'],
    icon: 'express',
  },
  {
    id: 'mix-modeler',
    name: 'Mix Modeler',
    claim: {
      it: 'Ottimizzazione del media mix con AI per massimizzare il ROI di ogni canale',
      en: 'AI-powered media mix optimization to maximize ROI across channels',
    },
    phase: ['acquisizione'],
    icon: 'mix-modeler',
  },
  // --- Engagement ---
  {
    id: 'aem-sites',
    name: 'AEM Sites',
    claim: {
      it: 'Gestione dei contenuti e storytelling digitale personalizzato su ogni canale',
      en: 'Content management and personalized digital storytelling across channels',
    },
    phase: ['engagement'],
    icon: 'aem-sites',
  },
  {
    id: 'target',
    name: 'Adobe Target',
    claim: {
      it: 'Personalizzazione e test A/B per ottimizzare ogni esperienza in tempo reale',
      en: 'Personalization and A/B testing to optimize every experience in real time',
    },
    phase: ['engagement', 'conversione'],
    icon: 'target',
  },
  {
    id: 'commerce',
    name: 'Adobe Commerce',
    claim: {
      it: 'Commercio digitale per esperienze d\'acquisto seamless, dai pezzi d\'ingresso al total look',
      en: 'Digital commerce for seamless shopping experiences, from entry pieces to total look',
    },
    phase: ['engagement', 'conversione'],
    icon: 'commerce',
  },
  // --- Conversione ---
  {
    id: 'journey-optimizer',
    name: 'Journey Optimizer',
    claim: {
      it: 'Orchestrazione di journey multicanale in tempo reale, dal trigger all\'azione',
      en: 'Real-time multichannel journey orchestration, from trigger to action',
    },
    phase: ['conversione', 'loyalty'],
    icon: 'journey-optimizer',
  },
  {
    id: 'brand-concierge',
    name: 'Brand Concierge',
    claim: {
      it: 'Agente conversazionale AI per la scoperta prodotto e l\'assistenza personalizzata',
      en: 'AI conversational agent for product discovery and personalized assistance',
    },
    phase: ['conversione'],
    icon: 'brand-concierge',
  },
  // --- Loyalty ---
  // rtcdp, cja, journey-optimizer already listed above with 'loyalty' phase
  // --- Operations ---
  {
    id: 'workfront',
    name: 'Workfront',
    claim: {
      it: 'Gestione del lavoro e orchestrazione della content supply chain con le agenzie',
      en: 'Work management and content supply chain orchestration with agencies',
    },
    phase: ['operations'],
    icon: 'workfront',
  },
];

export function getProductsByPhase(phase: string): AdobeProduct[] {
  return adobeProducts.filter((p) => p.phase.includes(phase));
}

export function getProductById(id: string): AdobeProduct | undefined {
  return adobeProducts.find((p) => p.id === id);
}
