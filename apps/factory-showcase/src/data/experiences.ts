/**
 * experiences.ts — the ONE source of truth for the Factory showcase site.
 *
 * Every numeric reference, KPI, count, list and skin/brand label on the site
 * derives from this array. Adding a new Experience Design here updates the hero
 * stats, the prose counts, the proof card grid and the architecture diagram
 * automatically — no template edits needed.
 *
 * `sections` = capitoli navigabili del deck, ESCLUSA la home e la pagina admin.
 *   Contati sulle rotte reali (ROUTE_SETS in scripts/deck-audit.ts + la nav
 *   costruita). Non stimare: se cambia la struttura, ricontare.
 *
 * `defaultPublished` = cosa vede lo showcase quando NON riesce a leggere lo stato
 *   di pubblicazione da Supabase (rete giù, chiavi ruotate, progetto in pausa).
 *   È un fail-closed deliberato: le experience nate da materiale di preparazione
 *   riservato restano fuori anche se il backend non risponde. Il toggle in Super
 *   Admin può accenderle, ma non è questo file a deciderlo.
 */

const LIVE = 'https://agargiulo-adbe.github.io/experience-design-factory';

export interface Experience {
  /** stable id / manifest key — coincide con la cartella in apps/ */
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
  /** capitoli navigabili, home e admin escluse */
  sections: number;
  /** visibile di default quando lo stato remoto non è leggibile */
  defaultPublished: boolean;
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
    sections: 7,
    defaultPublished: true,
    tag: {
      en: 'Quiet-luxury · IT · the first instance',
      it: 'Quiet-luxury · IT · la prima istanza',
    },
    desc: {
      en: 'The founding experience. A generational, quiet-luxury journey that proved the engine and set the quality bar.',
      it: 'L\u2019esperienza fondativa. Un viaggio generazionale quiet-luxury che ha collaudato il motore e fissato lo standard di qualit\u00e0.',
    },
  },
  {
    slug: 'unicredit-engagement',
    name: 'Engagement Unlimited',
    client: 'UniCredit',
    brandLabel: 'UniCredit',
    url: `${LIVE}/unicredit-engagement/`,
    shot: 'shots/unicredit.webp',
    accent: '#007A91',
    sections: 6,
    defaultPublished: true,
    tag: {
      en: 'Bilingual EN/IT · six chapters · the most mature',
      it: 'Bilingue EN/IT · sei capitoli · la pi\u00f9 matura',
    },
    desc: {
      en: 'One customer story told in six chapters, each one a live demo. Its design system is read from UniCredit\u2019s production CSS, not from a brand deck.',
      it: 'Una sola storia di cliente in sei capitoli, ognuno una demo dal vivo. Il design system \u00e8 letto dal CSS di produzione di UniCredit, non da un brand book.',
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
    defaultPublished: true,
    tag: {
      en: 'Bilingual EN/IT · motorsport · live product mockups',
      it: 'Bilingue EN/IT · motorsport · mockup di prodotto live',
    },
    desc: {
      en: 'A data-collaboration narrative from Maranello to every fan, with interactive Adobe product mockups and a licensing scoping model built into the deck.',
      it: 'Un racconto di data-collaboration da Maranello a ogni tifoso, con mockup interattivi dei prodotti Adobe e un modello di scoping del licensing dentro al deck.',
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
    sections: 12,
    defaultPublished: true,
    tag: {
      en: 'Forked deck · trunk + two self-contained branches',
      it: 'Deck biforcato · tronco + due rami autoconsistenti',
    },
    desc: {
      en: 'The same story splits at a fork into two self-contained branches \u2014 FS Park and Trenitalia \u2014 five mirrored chapters each, so one deck serves two audiences without a rebuild.',
      it: 'La stessa storia si biforca in due rami autoconsistenti \u2014 FS Park e Trenitalia \u2014 cinque capitoli speculari ciascuno: un deck solo per due platee, senza rebuild.',
    },
  },
  {
    slug: 'agos-trait-dunion',
    name: "Trait d'Union",
    client: 'Agos',
    brandLabel: 'Agos',
    url: `${LIVE}/agos-trait-dunion/`,
    shot: 'shots/agos.webp',
    accent: '#06ABB8',
    sections: 7,
    defaultPublished: true,
    tag: {
      en: '7 chapters · IT · consumer credit',
      it: '7 capitoli · IT · credito al consumo',
    },
    desc: {
      en: 'Two worlds \u2014 digital and branch, acquisition and customer base \u2014 connected into one measurable customer intelligence, sequenced with the core transformation.',
      it: "Due mondi \u2014 digitale e filiale, acquisition e customer base \u2014 connessi in un'unica intelligenza del cliente, in sequenza con la trasformazione dei sistemi core.",
    },
  },
  {
    slug: 'atelier',
    name: 'Experience Atelier',
    client: 'Adobe Italy',
    brandLabel: 'Atelier',
    url: `${LIVE}/atelier/`,
    shot: 'shots/atelier.webp',
    accent: '#C9A96A',
    sections: 7,
    defaultPublished: false,
    tag: {
      en: 'Trilingual EN/IT/FR · the Factory\u2019s own growth plan',
      it: 'Trilingue EN/IT/FR · il piano di crescita della Factory',
    },
    desc: {
      en: 'The Factory presenting itself to Adobe leadership: what it is, what it multiplies, where it could go next.',
      it: 'La Factory che si presenta alla leadership Adobe: cos\u2019\u00e8, cosa moltiplica, dove pu\u00f2 andare.',
    },
  },
  {
    slug: 'eni-orbita',
    name: 'Orbita',
    client: 'Eni',
    brandLabel: 'Eni',
    url: `${LIVE}/eni-orbita/`,
    shot: 'shots/eni.webp',
    accent: '#FFCE00',
    sections: 6,
    defaultPublished: false,
    tag: {
      en: '6 chapters · IT · energy',
      it: '6 capitoli · IT · energia',
    },
    desc: {
      en: 'Built for a single conversation with the CIO: the platform question, the trajectories, and the route \u2014 nothing generic.',
      it: 'Costruita per una sola conversazione con il CIO: la domanda sulla piattaforma, le traiettorie e la rotta \u2014 niente di generico.',
    },
  },
  {
    slug: 'mim-alfabeti',
    name: 'Alfabeti',
    client: 'Ministero dell\u2019Istruzione',
    brandLabel: 'MIM',
    url: `${LIVE}/mim-alfabeti/`,
    shot: 'shots/mim.webp',
    accent: '#0066CC',
    sections: 7,
    defaultPublished: false,
    tag: {
      en: '7 chapters · IT · public sector',
      it: '7 capitoli · IT · settore pubblico',
    },
    desc: {
      en: 'Reaching a million people who work in schools: one voice, one journey, and the platform that carries it.',
      it: 'Arrivare a un milione di persone che lavorano nella scuola: una voce, un percorso e la piattaforma che lo regge.',
    },
  },
  {
    slug: 'isybank-momento',
    name: 'Il momento giusto',
    client: 'Isybank',
    brandLabel: 'Isybank',
    url: `${LIVE}/isybank-momento/`,
    shot: 'shots/isybank.webp',
    accent: '#1B99FB',
    sections: 3,
    defaultPublished: false,
    tag: {
      en: '3 chapters · IT · digital-native bank',
      it: '3 capitoli · IT · banca digitale',
    },
    desc: {
      en: 'Short by design \u2014 one question, a handful of ideas, four open questions to end on. Every claim carries its source on the slide.',
      it: 'Corta per scelta \u2014 una domanda, poche idee, quattro domande aperte in chiusura. Ogni affermazione porta la sua fonte sulla slide.',
    },
  },
  {
    slug: 'aperture-email',
    name: 'Aperture',
    client: 'Osservatorio',
    brandLabel: 'Aperture',
    url: `${LIVE}/aperture-email/`,
    shot: 'shots/aperture.webp',
    accent: '#2EE6A6',
    sections: 6,
    defaultPublished: false,
    tag: {
      en: 'Bilingual EN/IT · independent research · vendor-neutral',
      it: 'Bilingue EN/IT · ricerca indipendente · vendor-neutral',
    },
    desc: {
      en: 'Not a pitch: an observatory on tracking inside brand email. Sources are cited, never interpreted, and no Adobe product appears.',
      it: 'Non un pitch: un osservatorio sul tracciamento dentro le email dei brand. Le fonti sono citate, mai interpretate, e non compare nessun prodotto Adobe.',
    },
  },
];

/** Le experience mostrate quando lo stato remoto non è leggibile (fail-closed). */
export const DEFAULT_PUBLISHED = EXPERIENCES.filter((e) => e.defaultPublished);

/** Number of live, deployed experiences — il set di default, non il registry intero. */
export const EXPERIENCE_COUNT = DEFAULT_PUBLISHED.length;

/** Sum of all sections across the published portfolio. */
export const TOTAL_SECTIONS = DEFAULT_PUBLISHED.reduce((n, e) => n + e.sections, 0);

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
