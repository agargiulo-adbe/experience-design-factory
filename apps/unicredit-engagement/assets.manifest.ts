import type { AssetSlot } from '@edf/core/assets/types';

export const assets: AssetSlot[] = [
  // ── Cover / Hero backgrounds ──────────────────────────────────────
  {
    id: 'bg-banking-city',
    type: 'stock',
    query: 'Milan Porta Nuova skyline financial district modern glass buildings twilight',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: '',
  },
  {
    id: 'bg-digital-blue',
    type: 'stock',
    query: 'abstract dark blue geometric data network lines technology minimal',
    aspect: '16:9',
    width: 2400,
    grade: 'duotone',
    alt: '',
  },
  {
    id: 'bg-marble',
    type: 'stock',
    query: 'white marble texture clean architectural surface light minimal luxury',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: '',
  },
  {
    id: 'bg-unlimited',
    type: 'stock',
    query: 'wide open horizon sea sky sunrise expansive blue unlimited freedom',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: '',
  },
  {
    id: 'bg-data-dark',
    type: 'stock',
    query: 'dark abstract digital dashboard analytics data visualization dark minimal',
    aspect: '16:9',
    width: 2400,
    grade: 'duotone',
    alt: '',
  },

  // ── Persona B2C ────────────────────────────────────────────────────
  {
    id: 'persona-marco',
    type: 'stock',
    query: 'italian professional businessman portrait 40 years confident suit indoor natural light',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Ritratto di Marco, imprenditore 38 anni',
  },
  {
    id: 'persona-sara',
    type: 'stock',
    query: 'young italian woman portrait 26 years smartphone smiling natural light',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Ritratto di Sara, neolaureata 26 anni',
  },

  // ── Persona B2B ────────────────────────────────────────────────────
  {
    id: 'persona-adriana',
    type: 'stock',
    query: 'professional woman executive portrait 50 years elegant business office confident',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Ritratto di Adriana, CFO PMI',
  },

  // ── Digital Banking ────────────────────────────────────────────────
  {
    id: 'banking-mobile',
    type: 'stock',
    query: 'smartphone banking app finance screen hand modern minimal dark',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'App bancaria mobile su smartphone',
  },
  {
    id: 'banking-data',
    type: 'code',
    aspect: '16:9',
    width: 1100,
    grade: 'none',
    alt: 'Animazione: unificazione dati cliente in profilo real-time',
  },
  {
    id: 'banking-branch',
    type: 'stock',
    query: 'modern bank interior italy elegant minimal clean office professional',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Filiale bancaria moderna',
  },

  // ── Analytics & AI ─────────────────────────────────────────────────
  {
    id: 'analytics-screen',
    type: 'stock',
    query: 'data analytics dashboard screen charts business intelligence dark office minimal',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Dashboard analytics su schermo',
  },
  {
    id: 'ai-platform',
    type: 'stock',
    query: 'artificial intelligence neural network technology blue abstract futuristic minimal',
    aspect: '16:9',
    width: 1800,
    grade: 'duotone',
    alt: 'Piattaforma AI astratta',
  },

  // ── Acquisizione / Onboarding ──────────────────────────────────────
  {
    id: 'onboarding-digital',
    type: 'stock',
    query: 'person digital tablet signature signing document modern professional light background',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Onboarding digitale: firma elettronica su tablet',
  },

  // ── Contenuti / GenStudio ──────────────────────────────────────────
  {
    id: 'content-creation',
    type: 'stock',
    query: 'creative marketing team laptop collaboration modern office bright minimal',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Team creativo al lavoro su contenuti digitali',
  },

  // ── B2B ────────────────────────────────────────────────────────────
  {
    id: 'business-meeting',
    type: 'stock',
    query: 'professional business meeting handshake partners corporate office modern',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Meeting professionale: relazione banca-impresa',
  },
  {
    id: 'business-growth',
    type: 'stock',
    query: 'small business owner entrepreneur office italy confident modern light',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Imprenditore PMI',
  },

  // ── Risultati / ROI ────────────────────────────────────────────────
  {
    id: 'results-growth',
    type: 'stock',
    query: 'financial success growth upward chart blue minimal clean office light',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Crescita finanziaria',
  },
];

export default assets;
