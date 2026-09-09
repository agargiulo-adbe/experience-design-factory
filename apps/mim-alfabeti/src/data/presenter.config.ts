/**
 * Presenter view configuration — «La voce del Ministero» (mim-alfabeti).
 *
 * Single source for the presenter window (`/presenter/`) and the deck-side
 * bridge (`components/PresenterBridge.astro`):
 *  - section order + per-section time budgets (minutes) — full run = 16',
 *    «Versione 15 minuti» = 15';
 *  - the ordered slide ids of every section (mirrors admin PAGE_REGISTRY —
 *    keep the two in sync when a slide is added/split) with a bilingual label
 *    used as the fallback title when a slide has no speaker note;
 *  - the cut list: `<section>:<slide-id>` keys hidden in the short version.
 *
 * Section keys = the deck's `sectionSlug()` (last path segment): the home is
 * `mim-alfabeti`. Notes files (`data/notes/<section>.ts`) may use `index` for
 * the home — the presenter maps both.
 */

export const PRESENTER_CHANNEL = 'edf-presenter:mim-alfabeti';

/** localStorage keys shared by the presenter and the bridge. */
export const CUT_STORAGE_KEY = 'edf:cut';        // 'short' | absent (full)
export const CUT_IDS_STORAGE_KEY = 'edf:cut-ids'; // JSON string[] of `<section>:<slide-id>`

export interface PresenterSlide {
  id: string;
  label: { it: string; en: string };
}

export interface PresenterSection {
  /** Deck section slug (last path segment). Home = 'mim-alfabeti'. */
  slug: string;
  /** Path relative to the app base ('' = home). */
  path: string;
  label: { it: string; en: string };
  /** Time budget in minutes — full run. */
  budgetMin: number;
  /** Time budget in minutes — «Versione 15 minuti». */
  budgetShortMin: number;
  slides: PresenterSlide[];
}

export const SECTIONS: PresenterSection[] = [
  {
    slug: 'mim-alfabeti', path: '', label: { it: 'Apertura', en: 'Opening' },
    budgetMin: 0, budgetShortMin: 0,
    slides: [
      { id: 'slide-cover',   label: { it: 'La voce del Ministero', en: "The Ministry's voice" } },
      { id: 'slide-thesis',  label: { it: 'La tesi — la prima porta non è la classe', en: 'The thesis — the first door is not the classroom' } },
      { id: 'slide-pillars', label: { it: 'Orchestrare · Misurare · Governare', en: 'Orchestrate · Measure · Govern' } },
    ],
  },
  {
    slug: 'domanda', path: 'domanda', label: { it: 'La domanda', en: 'The question' },
    budgetMin: 2, budgetShortMin: 2,
    slides: [
      { id: 'slide-cover',     label: { it: 'Come parla il Ministero al personale', en: 'How the Ministry speaks to its staff' } },
      { id: 'slide-processes', label: { it: 'Tre processi, un problema', en: 'Three processes, one problem' } },
      { id: 'slide-questions', label: { it: 'Tre domande sulla misura', en: 'Three questions on measurement' } },
    ],
  },
  {
    slug: 'storia', path: 'storia', label: { it: 'La storia', en: 'The story' },
    budgetMin: 4, budgetShortMin: 4,
    slides: [
      { id: 'slide-ritratto', label: { it: 'Giulia oggi — docente precaria di sostegno', en: 'Giulia today — a substitute support teacher' } },
      { id: 'slide-notte',    label: { it: "Com'è oggi — 150 preferenze «al buio»", en: 'Today — 150 preferences «in the dark»' } },
      { id: 'slide-evolve',   label: { it: 'Come cambia — profilo governato + journey misurato', en: 'How it changes — governed profile + measured journey' } },
    ],
  },
  {
    slug: 'voce', path: 'voce', label: { it: 'La proposta', en: 'The proposal' },
    budgetMin: 2, budgetShortMin: 2,
    slides: [
      { id: 'slide-cover', label: { it: 'Lo spazio è libero, lo stack è pronto', en: 'The space is open, the stack is ready' } },
      { id: 'slide-why',   label: { it: 'Perché funziona qui', en: 'Why it works here' } },
      { id: 'slide-how',   label: { it: 'Come funziona — CDP → AJO → CJA', en: 'How it works — CDP → AJO → CJA' } },
    ],
  },
  {
    slug: 'competenze', path: 'competenze', label: { it: 'I processi', en: 'Processes' },
    budgetMin: 3, budgetShortMin: 2,
    slides: [
      { id: 'slide-cover',    label: { it: 'Ogni processo è un journey', en: 'Every process is a journey' } },
      { id: 'slide-journeys', label: { it: 'Cinque processi', en: 'Five processes' } },
      { id: 'slide-example',  label: { it: 'Journey concreto — immissione in ruolo', en: 'A concrete journey — tenure appointment' } },
    ],
  },
  {
    slug: 'accesso', path: 'accesso', label: { it: 'Governance', en: 'Governance' },
    budgetMin: 2, budgetShortMin: 2,
    slides: [
      { id: 'slide-cover',       label: { it: 'Già acquistabile, governato per costruzione', en: 'Already procurable, governed by design' } },
      { id: 'slide-procurement', label: { it: "Stack ACN-qualificato + veicoli d'acquisto", en: 'ACN-qualified stack + procurement vehicles' } },
      { id: 'slide-trust',       label: { it: 'Perimetro-dati, uso istituzionale, privacy by design', en: 'Data perimeter, institutional use, privacy by design' } },
    ],
  },
  {
    slug: 'persone', path: 'persone', label: { it: 'La misura', en: 'Measurement' },
    budgetMin: 2, budgetShortMin: 2,
    slides: [
      { id: 'slide-cover',    label: { it: 'Ciò che non si è mai misurato', en: 'What was never measured' } },
      { id: 'slide-metrics',  label: { it: 'Cinque misure con CJA', en: 'Five measures with CJA' } },
      { id: 'slide-segments', label: { it: 'Docenti · Dirigenti · ATA', en: 'Teachers · Principals · Admin staff' } },
    ],
  },
  {
    slug: 'rotta', path: 'rotta', label: { it: 'La rotta', en: 'The path' },
    budgetMin: 1, budgetShortMin: 1,
    slides: [
      { id: 'slide-route', label: { it: 'Un percorso, quattro passi', en: 'One path, four steps' } },
      { id: 'slide-close', label: { it: 'In un respiro', en: 'In one breath' } },
    ],
  },
];

/** Total budget (minutes) of the full run. */
export const TOTAL_BUDGET_MIN = SECTIONS.reduce((n, s) => n + s.budgetMin, 0);           // 16
/** Total budget (minutes) of «Versione 15 minuti». */
export const TOTAL_BUDGET_SHORT_MIN = SECTIONS.reduce((n, s) => n + s.budgetShortMin, 0); // 15

/**
 * «Versione 15 minuti» — slides hidden by the bridge (`<section>:<slide-id>`).
 * Never hides a whole section (the chapter chain / prev-next hrefs stay valid).
 *  - the opening's pillar recap (the three verbs return in «La rotta»);
 *  - the worked tenure-appointment journey (the five-process slide carries it);
 *  - the audience breakdown (the three roles are already on the metrics slide).
 */
export const CUT_SHORT: string[] = [
  'mim-alfabeti:slide-pillars',
  'competenze:slide-example',
  'persone:slide-segments',
];
