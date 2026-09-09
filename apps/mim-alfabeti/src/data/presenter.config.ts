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
      { id: 'slide-cover',  label: { it: 'La voce del Ministero', en: "The Ministry's voice" } },
      { id: 'slide-thesis', label: { it: 'La tesi + Orchestrare · Misurare · Governare', en: 'The thesis + Orchestrate · Measure · Govern' } },
    ],
  },
  {
    slug: 'domanda', path: 'domanda', label: { it: 'La domanda', en: 'The question' },
    budgetMin: 2, budgetShortMin: 2,
    slides: [
      { id: 'slide-processes', label: { it: 'I momenti che muovono una carriera', en: 'The moments that move a career' } },
      { id: 'slide-scala',     label: { it: 'La scala — quante persone, davvero', en: 'The scale — how many people, really' } },
      { id: 'slide-questions', label: { it: 'Tre domande, tre numeri che chiediamo', en: 'Three questions, three numbers we ask for' } },
    ],
  },
  {
    slug: 'storia', path: 'storia', label: { it: 'La storia', en: 'The story' },
    budgetMin: 4, budgetShortMin: 4,
    slides: [
      { id: 'slide-ponte',    label: { it: 'Ponte — una docente tra 234.576', en: 'Bridge — one teacher among 234,576' } },
      { id: 'slide-ritratto', label: { it: 'Giulia oggi', en: 'Giulia today' } },
      { id: 'slide-notte',    label: { it: 'La notte di luglio', en: 'The July night' } },
      { id: 'slide-evolve',   label: { it: 'Come cambia', en: 'How it changes' } },
    ],
  },
  {
    slug: 'voce', path: 'voce', label: { it: 'La proposta', en: 'The proposal' },
    budgetMin: 2, budgetShortMin: 1,
    slides: [
      { id: 'slide-why',   label: { it: 'Lo spazio è libero, lo stack è pronto', en: 'The space is open, the stack is ready' } },
      { id: 'slide-unica', label: { it: 'Accanto a Piattaforma Unica, non al posto', en: 'Beside Piattaforma Unica, not instead' } },
    ],
  },
  {
    slug: 'competenze', path: 'competenze', label: { it: 'I processi', en: 'Processes' },
    budgetMin: 3, budgetShortMin: 3,
    slides: [
      { id: 'slide-builder', label: { it: 'Journey builder', en: 'Journey builder' } },
    ],
  },
  {
    slug: 'accesso', path: 'accesso', label: { it: 'Governance', en: 'Governance' },
    budgetMin: 2, budgetShortMin: 2,
    slides: [
      { id: 'slide-procurement', label: { it: 'Già acquistabile', en: 'Already procurable' } },
      { id: 'slide-trust',       label: { it: 'Tre garanzie sul dato del personale', en: 'Three guarantees on staff data' } },
    ],
  },
  {
    slug: 'persone', path: 'persone', label: { it: 'La misura', en: 'Measurement' },
    budgetMin: 2, budgetShortMin: 2,
    slides: [
      { id: 'slide-metrics',  label: { it: 'Cinque misure con CJA', en: 'Five measures with CJA' } },
      { id: 'slide-segments', label: { it: 'Le persone dietro i profili', en: 'The people behind the profiles' } },
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
  'domanda:slide-questions',
  'voce:slide-unica',
  'persone:slide-segments',
];
