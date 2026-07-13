/**
 * experiences.ts — the ONE source of truth for the Factory showcase site.
 *
 * Every numeric reference, KPI, count, list and skin/brand label on the site
 * derives from this array. Adding a new Experience Design here updates the hero
 * stats, the prose counts, the proof card grid and the architecture diagram
 * automatically — no template edits needed.
 *
 * `sections` = the number of top-level sections/pages that experience presents
 * (used to sum a portfolio-wide "sections" total, and shown per-card via the
 * bilingual tag copy).
 */

const LIVE = 'https://agargiulo-adbe.github.io/experience-design-factory';

export interface Experience {
  /** stable id / manifest key */
  slug: string;
  /** experience (product) name */
  name: string;
  /** client / brand it's skinned for */
  client: string;
  /** short brand label for the architecture skins diagram (e.g. "Max Mara") */
  brandLabel: string;
  /** live, deployed URL (absolute) */
  url: string;
  /** relative screenshot filename under /shots/ */
  shot: string;
  /** brand accent hex — drives the card + swatch + skin-diagram colour */
  accent: string;
  /** number of top-level sections/pages the experience presents */
  sections: number;
  /** short bilingual tag line (mono, under the card name) */
  tag: { en: string; it: string };
  /** bilingual one-liner (card description) */
  desc: { en: string; it: string };
}

export const EXPERIENCES: Experience[] = [
  {
    slug: 'generazioni-maxmara',
    name: 'Generazioni',
    client: 'Max Mara',
    brandLabel: 'Max Mara',
    url: `${LIVE}/generazioni-maxmara/`,
    shot: 'shots/maxmara.webp',
    accent: '#C19A6B',
    sections: 8,
    tag: {
      en: 'Quiet-luxury · IT · the first instance',
      it: 'Quiet-luxury · IT · la prima istanza',
    },
    desc: {
      en: 'The founding experience. A generational, quiet-luxury journey that proved the engine and set the quality bar.',
      it: 'L’esperienza fondativa. Un viaggio generazionale quiet-luxury che ha collaudato il motore e fissato lo standard di qualità.',
    },
  },
  {
    slug: 'unicredit-engagement',
    name: 'Engagement Unlimited',
    client: 'UniCredit',
    brandLabel: 'UniCredit',
    url: `${LIVE}/unicredit-engagement/`,
    shot: 'shots/unicredit.webp',
    accent: '#BE2027',
    sections: 11,
    tag: {
      en: '11 sections · IT · the most mature',
      it: '11 sezioni · IT · la più matura',
    },
    desc: {
      en: 'A full Adobe CX story woven through real personas — the deepest content model, refined across five client-feedback rounds.',
      it: 'Una storia Adobe CX completa intrecciata con personas reali — il modello di contenuto più profondo, rifinito in cinque round di feedback.',
    },
  },
  {
    slug: 'ferrari-racing',
    name: 'Pole Position',
    client: 'Ferrari Racing',
    brandLabel: 'Ferrari Racing',
    url: `${LIVE}/ferrari-racing/`,
    shot: 'shots/ferrari.webp',
    accent: '#FF2800',
    sections: 9,
    tag: {
      en: 'Bilingual EN/IT · motorsport · live product mockups',
      it: 'Bilingue EN/IT · motorsport · mockup di prodotto live',
    },
    desc: {
      en: 'A data-collaboration narrative from Maranello to every fan, with interactive Adobe product mockups built into the deck.',
      it: 'Un racconto di data-collaboration da Maranello a ogni tifoso, con mockup interattivi dei prodotti Adobe integrati nel deck.',
    },
  },
  {
    slug: 'trenitalia-connessioni',
    name: 'Connessioni Intelligenti',
    client: 'FS Group',
    brandLabel: 'FS Group',
    url: `${LIVE}/trenitalia-connessioni/`,
    shot: 'shots/trenitalia.webp',
    accent: '#E2001A',
    sections: 6,
    tag: {
      en: '6 sections + use cases · IT · data collaboration',
      it: '6 sezioni + casi d’uso · IT · data collaboration',
    },
    desc: {
      en: 'The data that connects trains, travellers and services into one measurable journey — CJA convergence and privacy-first collaboration for FS Group.',
      it: 'Il dato che connette treni, viaggiatori e servizi in un unico journey misurabile — convergenza CJA e collaboration privacy-first per FS Group.',
    },
  },
];

/** Number of live, deployed experiences. */
export const EXPERIENCE_COUNT = EXPERIENCES.length;

/** Sum of all sections across the portfolio. */
export const TOTAL_SECTIONS = EXPERIENCES.reduce((n, e) => n + e.sections, 0);

/** Spelled-out English number for small counts (bilingual prose fallback). */
const EN_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** Spelled-out Italian number for small counts. */
const IT_WORDS = ['zero', 'una', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici'];

/**
 * Spell out a count in both languages, capitalised (e.g. 4 → "Four" / "Quattro").
 * Falls back to digits above the lookup range.
 */
export function spellCount(n: number): { en: string; it: string } {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    en: n < EN_WORDS.length ? cap(EN_WORDS[n]) : String(n),
    it: n < IT_WORDS.length ? cap(IT_WORDS[n]) : String(n),
  };
}
