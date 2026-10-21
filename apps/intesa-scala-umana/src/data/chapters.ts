/**
 * I quattro capitoli della Prospettiva «Su scala umana».
 *
 * Non inventati: sono lo SCHELETRO del tipo `prospettiva` in
 * `packages/core/src/data/experienceTypes.ts` — «il vostro anno visto da fuori
 * → la domanda → le idee → la rotta» — riempito col contenuto già verificato
 * delle quattro slide del 22 ottobre (`docs/Intesa Sanpaolo/output/build/
 * build_slide_22ott.py`, git-ignorato).
 *
 * VINCOLI EREDITATI dal builder e dalla lista say/don't del dossier, che valgono
 * su ogni stringa di questa app:
 *  · nessun competitor nominato, mai — né in pagina né nei commenti;
 *  · mai «sostituire», «rimpiazzare», «migrazione», «rip-and-replace»:
 *    la posizione è l'innesto su un'architettura;
 *  · mai «profilazione» (provvedimento del Garante del 12 marzo 2026, opposizione
 *    pendente): si dice «consenso», «preferenze», «governance del dato»;
 *  · nessun pitch AI-first: l'AI entra come abilitatore di un caso misurato;
 *  · nessuna cifra contrattuale, nessuna scadenza, nessun rinnovo;
 *  · nessuna traccia dell'esistenza di un dossier interno;
 *  · voce al plurale istituzionale: il deck gira fra i colleghi del cliente e
 *    deve reggere senza chi l'ha presentato;
 *  · ogni numero ha una fonte pubblica datata (vedi `sources.ts`).
 */
export interface Bilingual {
  it: string;
  en: string;
}

export interface Chapter {
  slug: string;
  num: string;
  /** titolo del capitolo — dallo scheletro del tipo `prospettiva` */
  label: Bilingual;
  /** che cosa ci si porta via da questo capitolo, una riga — sulla card dell'indice */
  lead: Bilingual;
  /**
   * La riga sotto il titolo nella COPERTINA del capitolo. Fa un lavoro diverso
   * dal `lead` — la card dice che cosa c'è dentro a chi scorre, la copertina
   * prepara chi sta per entrare — ma vive nello STESSO oggetto, e non è un
   * caso: finché le due righe stavano in due posti (qui e scritta a mano nella
   * pagina), una correzione ne mancava sempre una. È successo: il claim
   * refutato su Santander è stato corretto nel `lead`, nell'indice e nel
   * titolo della slide del caso, ed è sopravvissuto cinque giorni nella
   * copertina del capitolo 03, dove nessuno lo cercava.
   */
  cover: Bilingual;
}

export const CHAPTERS: Chapter[] = [
  {
    slug: 'apertura',
    num: '01',
    label: {
      it: 'Il vostro anno, visto da fuori',
      en: 'Your year, seen from outside',
    },
    lead: {
      it: 'Tre cose che avete dichiarato voi, i numeri che ci stanno dietro, e che cosa chiedono a chi comunica.',
      en: 'Three things you stated yourselves, the figures behind them, and what they ask of whoever communicates.',
    },
    cover: {
      it: 'Quello che di voi si legge da fuori, con la data accanto a ogni fatto.',
      en: 'What can be read about you from outside, with a date beside every fact.',
    },
  },
  {
    slug: 'domanda',
    num: '02',
    label: { it: 'La domanda', en: 'The question' },
    lead: {
      it: 'Dove si è spostato il punto di attrito, e le quattro cose che vorremmo capire prima di proporre.',
      en: 'Where the friction point has moved, and the four things we want to understand before proposing.',
    },
    cover: {
      it: 'Quattro cose che vorremmo capire prima di proporre qualunque cosa.',
      en: 'Four things we would like to understand before proposing anything at all.',
    },
  },
  {
    slug: 'idee',
    num: '03',
    label: { it: 'Le idee', en: 'The ideas' },
    lead: {
      it: 'Dove ci appoggiamo su quello che avete già, e una banca che ne ha percorso una parte.',
      en: 'Where we build on what you already have, and a bank that walked part of it.',
    },
    cover: {
      it: 'Dove ci appoggiamo su quello che avete già, e una banca che ne ha percorso una parte.',
      en: 'Where we build on what you already have, and a bank that walked part of it.',
    },
  },
  {
    slug: 'rotta',
    num: '04',
    label: { it: 'La rotta', en: 'The route' },
    lead: {
      it: 'Tre passi, e la richiesta: i referenti di contenuto, dati e targeting, due casi, una data.',
      en: 'Three steps, and the ask: the content, data and targeting contacts, two cases, one date.',
    },
    cover: {
      it: 'Tre passi, e la richiesta: i referenti di contenuto, dati e targeting, due casi, una data.',
      en: 'Three steps, and the ask: the content, data and targeting contacts, two cases, one date.',
    },
  },
];

const ORDER = CHAPTERS.map((c) => c.slug);

/** Il capitolo dopo `slug`; stringa vuota = la home (ultimo capitolo). */
export function nextSlug(slug: string): string {
  const i = ORDER.indexOf(slug);
  return i === -1 || i === ORDER.length - 1 ? '' : ORDER[i + 1];
}

/** Il capitolo prima di `slug`; stringa vuota = la home (primo capitolo). */
export function prevSlug(slug: string): string {
  const i = ORDER.indexOf(slug);
  return i <= 0 ? '' : ORDER[i - 1];
}
