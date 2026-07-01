import type { AssetSlot } from '@edf/core/assets/types';

export const assets: AssetSlot[] = [
  // ── Cover / Background ────────────────────────────────────────────
  {
    id: 'bg-banking-city',
    type: 'stock',
    query: 'modern city financial district aerial night lights',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: '',
  },
  {
    id: 'bg-digital-blue',
    type: 'stock',
    query: 'abstract digital data network blue dark minimal',
    aspect: '16:9',
    width: 2400,
    grade: 'duotone',
    alt: '',
  },
  {
    id: 'bg-marble',
    type: 'stock',
    query: 'white marble texture minimal clean light',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
    alt: '',
  },

  // ── Persona B2C ────────────────────────────────────────────────────
  {
    id: 'persona-marco',
    type: 'stock',
    query: 'professional man portrait 40 years confident neutral light',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Ritratto di Marco, imprenditore 38 anni',
  },
  {
    id: 'persona-sara',
    type: 'stock',
    query: 'young woman portrait 26 years smartphone natural light',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Ritratto di Sara, neolaureata 26 anni',
  },

  // ── Persona B2B ────────────────────────────────────────────────────
  {
    id: 'persona-adriana',
    type: 'stock',
    query: 'business woman portrait executive professional office neutral',
    aspect: '4:5',
    width: 1200,
    grade: 'editorial',
    alt: 'Ritratto di Adriana, CFO PMI',
  },

  // ── Scenario ──────────────────────────────────────────────────────
  {
    id: 'banking-mobile',
    type: 'stock',
    query: 'smartphone banking app digital finance minimal',
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

  // ── Acquisizione ──────────────────────────────────────────────────
  {
    id: 'onboarding-digital',
    type: 'stock',
    query: 'person signing document tablet digital signature modern',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Onboarding digitale: firma elettronica su tablet',
  },

  // ── Contenuti / GenStudio ─────────────────────────────────────────
  {
    id: 'content-creation',
    type: 'stock',
    query: 'creative team digital content marketing office collaboration',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Team creativo al lavoro su contenuti digitali',
  },

  // ── B2B ───────────────────────────────────────────────────────────
  {
    id: 'business-meeting',
    type: 'stock',
    query: 'business meeting professional handshake office warm light',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Meeting professionale: relazione banca-impresa',
  },

  // ── Risultati ─────────────────────────────────────────────────────
  {
    id: 'results-growth',
    type: 'stock',
    query: 'financial growth chart upward arrow success business',
    aspect: '16:9',
    width: 1800,
    grade: 'editorial',
    alt: 'Grafico crescita finanziaria',
  },
];

export default assets;
