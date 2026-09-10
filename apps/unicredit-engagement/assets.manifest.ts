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
    duotone: ['#04252D', '#CCECEA'],
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
    duotone: ['#04252D', '#CCECEA'],
    alt: '',
  },

  // ── Firefly backdrops (workshop cut) — Adobe Firefly Services, on-brand ──
  // Generated build-time via `assets:build` (FIREFLY_CLIENT_ID/SECRET in .env).
  // Abstract, no letterforms/logos/wrong-brand; carry C2PA Content Credentials.
  {
    id: 'ff-engine-map',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Abstract elegant visualization of six glowing interconnected engines of light, petrol-teal (#007A91) and bright cyan (#00AED0) energy threads flowing between hexagonal nodes, one single node glowing red (#E2001A), very dark teal-black background (#04252D), premium financial-technology aesthetic, dark, sophisticated, cinematic depth, subtle bokeh, minimal',
    negativePrompt:
      'gold, amber, warm orange, yellow, brown, beige, crimson red dominance, purple, pink, text, words, letters, typography, logos, watermark, brand names, people, faces, car, automobile, user interface, dashboard screenshot, cluttered',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },
  {
    id: 'ff-il-sito',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Abstract premium visualization of a single bright cyan (#00AED0) beam of light discovered among countless petrol-teal (#007A91) data streams converging to one bright point over a very dark teal-black background (#04252D), the feeling of being found, financial-technology elegance, dark, cinematic, minimal',
    negativePrompt:
      'gold, amber, warm orange, yellow, brown, beige, crimson red dominance, purple, pink, text, words, letters, typography, logos, watermark, brand names, people, faces, car, automobile, user interface, dashboard screenshot, cluttered',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },
  {
    id: 'ff-contenuti',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Abstract flowing ribbons of petrol-teal (#007A91) and bright cyan (#00AED0) light weaving into ordered parallel streams over a very dark teal-black background (#04252D), one single red (#E2001A) filament running among them, the sense of content composed at speed, premium editorial, dark, cinematic, minimal',
    negativePrompt:
      'gold, amber, warm orange, yellow, brown, beige, crimson red dominance, purple, pink, text, words, letters, typography, logos, watermark, brand names, people, faces, car, automobile, user interface, dashboard screenshot, cluttered',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },

  {
    id: 'bg-visibilita',
    type: 'stock',
    query: 'AI search digital discovery network abstract dark minimal future technology',
    aspect: '16:9',
    width: 2400,
    grade: 'duotone',
    duotone: ['#04252D', '#CCECEA'],
    alt: '',
  },
  {
    id: 'bg-coworker',
    type: 'stock',
    query: 'AI collaboration professional workflow team light modern minimal office',
    aspect: '16:9',
    width: 2400,
    grade: 'editorial',
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
    duotone: ['#04252D', '#CCECEA'],
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

  // ── La storia di Marco — 5 momenti (Scenario). Scene senza volti, no letterform. ──
  {
    id: 'ff-story-01',
    type: 'firefly',
    contentClass: 'photo',
    prompt:
      'Evening in a warm Italian family kitchen, a smartphone lying on a wooden table with a soft glowing screen, ceramic espresso cup, house keys, folded property brochure, warm lamp light, shallow depth of field, cinematic, editorial photography, no people',
    negativePrompt:
      'text, words, letters, typography, logos, watermark, brand names, people, faces, hands, user interface, readable screen, cluttered',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },
  {
    id: 'ff-story-02',
    type: 'firefly',
    contentClass: 'photo',
    prompt:
      'Bright living room in the morning, laptop open on a low table with a soft glowing screen, children drawings pinned on the wall out of focus, plants, natural window light, calm family home atmosphere, editorial photography, shallow depth of field, no people',
    negativePrompt:
      'text, words, letters, typography, logos, watermark, brand names, people, faces, hands, readable screen, user interface, cluttered',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },
  {
    id: 'ff-story-03',
    type: 'firefly',
    contentClass: 'art',
    prompt:
      'Abstract visualization of a single customer journey as one continuous luminous thread of petrol-teal (#007A91) and cyan (#00AED0) light passing through eight glowing nodes, the last node glowing red (#E2001A), very dark teal-black background (#04252D), glass reflections, premium financial-technology aesthetic, cinematic depth, minimal',
    negativePrompt:
      'gold, amber, warm orange, yellow, brown, beige, purple, pink, text, words, letters, typography, logos, watermark, brand names, people, faces, dashboard screenshot, charts with numbers, cluttered',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },
  {
    id: 'ff-story-04',
    type: 'firefly',
    contentClass: 'photo',
    prompt:
      'Modern bank branch advisor office in the morning, elegant desk with a tablet, a closed notebook and a pen, two empty chairs ready for an appointment, soft light through vertical blinds, warm wood and glass, calm and premium, editorial photography, no people',
    negativePrompt:
      'text, words, letters, typography, logos, watermark, brand names, people, faces, hands, readable screen, cluttered',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },
  {
    id: 'ff-story-05',
    type: 'firefly',
    contentClass: 'photo',
    prompt:
      'Front door of a new apartment slightly open with keys in the lock, warm late-afternoon sunlight spilling into an empty freshly painted hallway, a couple of moving boxes, sense of a new beginning, editorial photography, shallow depth of field, no people',
    negativePrompt:
      'text, words, letters, typography, logos, watermark, brand names, people, faces, hands, cluttered',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },

  {
    id: 'ff-story-genstudio',
    type: 'firefly',
    contentClass: 'photo',
    prompt:
      'Morning at a Milan café terrace, a smartphone lying on a marble table next to a cappuccino with a soft glowing screen showing an abstract colourful social feed, a folded newspaper, warm sunlight, tram blurred in the background, editorial photography, shallow depth of field, no people',
    negativePrompt:
      'text, words, letters, typography, logos, watermark, brand names, people, faces, hands, readable screen, user interface, cluttered',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },
  {
    id: 'ff-scenario-cover',
    type: 'firefly',
    contentClass: 'photo',
    prompt:
      'Milan Porta Nuova financial district at blue hour seen from above, a tall slender modern glass skyscraper with a spire dominating the skyline, deep teal-blue sky, cool cyan city lights, thin threads of petrol-teal light tracing the streets below, cinematic, premium, editorial photography, no people',
    negativePrompt:
      'gold, amber, warm orange sunset, yellow street lights, brown, beige, text, words, letters, typography, logos, watermark, brand names, people, faces, cars close-up, cluttered, cartoon',
    aspect: '16:9',
    width: 2400,
    grade: 'none',
    alt: '',
  },
];
