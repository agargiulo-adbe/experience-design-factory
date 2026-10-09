/**
 * Il percorso del deck, in un posto solo.
 *
 * Fino al 9 ott 2026 il percorso stava scritto tre volte — nel rail della nav,
 * nelle card della home e nei `nextHref`/`prevHref` di ogni pagina — e bastava
 * cambiarne uno per avere un deck che diceva due cose diverse su dove si va.
 *
 * Dal 9 ott il percorso è questo elenco. La riunione con il cliente ha ridotto
 * il perimetro della proposta a **trenitalia.com + CRM**: il ramo FS Park, il
 * bivio che lo introduce e il capitolo sulla clean room restano nel repo, ma
 * fuori dal percorso di default — `attiva: false`. Si riaccendono rimettendo il
 * flag a `true`, e nav, home e frecce si riallineano da sole.
 */

export interface Tappa {
  /** Rotta senza base, come la vuole `href()`. */
  slug: string;
  label: string;
  /** Una riga che dice al cliente cosa trova lì. Va nelle card della home. */
  sub: string;
  /** Tronco = contesto comune; Capitolo = la serie numerata 01–04. */
  kind: 'Tronco' | 'Capitolo';
  /** Fuori percorso ma raggiungibile: non appare in nav, home e frecce. */
  attiva: boolean;
  /** Id soluzione per il gating runtime dell'Admin. */
  solution?: string;
}

export const TAPPE: Tappa[] = [
  { slug: 'scenario', kind: 'Tronco', attiva: true, label: 'Scenario',
    sub: 'Il lunedì di Davide, visto dai sistemi' },

  // Il bivio apre il confronto FS Park × Trenitalia: è il racconto di Gruppo,
  // che il cliente ha chiesto di tenere come orizzonte e non come proposta.
  { slug: 'bivio', kind: 'Tronco', attiva: false, label: 'Il bivio',
    sub: 'Due società, due sguardi sullo stesso percorso' },

  { slug: 'trenitalia/partenza', kind: 'Capitolo', attiva: true, label: 'Partenza',
    sub: 'Cosa si vede di chi compra, e cosa no' },
  { slug: 'trenitalia/fondamenta', kind: 'Capitolo', attiva: true, label: 'Fondamenta',
    sub: 'Gli Analytics e il CRM già in casa' },
  { slug: 'trenitalia/convergenza', kind: 'Capitolo', attiva: true, label: 'Convergenza',
    sub: 'Cosa si legge, cosa si attiva, dove sta il dato', solution: 'cja' },

  // Tutto il capitolo poggia su FS Park e sulla clean room: segue il bivio.
  { slug: 'trenitalia/meta-invisibile', kind: 'Capitolo', attiva: false, label: 'Metà invisibile',
    sub: 'La collaborazione fra società, in una clean room', solution: 'data-collab' },

  { slug: 'trenitalia/percorso', kind: 'Capitolo', attiva: true, label: 'Percorso',
    sub: 'La prima fase e la decisione che serve' },
];

/** Le tappe nel percorso di default, in ordine. */
export const PERCORSO = TAPPE.filter((t) => t.attiva);

/** I capitoli numerati: la serie 01–0N è loro, il tronco non si numera. */
export const CAPITOLI = PERCORSO.filter((t) => t.kind === 'Capitolo');

const indice = (slug: string) => PERCORSO.findIndex((t) => t.slug === slug);

/**
 * La tappa dopo `slug` nel percorso attivo, o `undefined` se è l'ultima.
 * Chiamata da una pagina fuori percorso (il bivio, FS Park) torna `undefined`:
 * quelle pagine tengono le proprie rotte scritte a mano.
 */
export const prossima = (slug: string): Tappa | undefined => {
  const i = indice(slug);
  return i < 0 ? undefined : PERCORSO[i + 1];
};

/** La tappa prima di `slug`. Per la prima tappa torna `undefined`: lì si va alla home. */
export const precedente = (slug: string): Tappa | undefined => {
  const i = indice(slug);
  return i <= 0 ? undefined : PERCORSO[i - 1];
};

/**
 * Le due rotte di una pagina del percorso, da passare a `DeckContainer`.
 * Prima tappa e ultima tornano alla home: il deck si chiude dove è iniziato.
 */
export const rotte = (slug: string) => {
  const n = prossima(slug);
  const p = precedente(slug);
  return { next: n ? '/' + n.slug : '/', prev: p ? '/' + p.slug : '/' };
};
