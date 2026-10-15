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
  /** che cosa ci si porta via da questo capitolo, una riga */
  lead: Bilingual;
  /**
   * IL PUNTO del capitolo: una frase, e dice la CONSEGUENZA per loro — non il
   * riassunto di quello che il capitolo ha appena mostrato. Obbligatorio: un
   * capitolo senza il suo punto non compila.
   *
   * Lo rende `ChapterPoint` come ultima slide del capitolo. Nell'ULTIMO capitolo
   * no: lì `DeckClose` chiude il cerchio — la domanda d'apertura
   * (`DOMANDA_LETTURA`), questa frase come risposta, e l'ask. Due chiusure a
   * dieci secondi di distanza sono una di troppo.
   *
   * Venticinque parole al massimo, voce al plurale istituzionale, e valgono tutti
   * i vincoli ereditati qui sopra. Il gate: `pnpm audit:sintesi --app
   * intesa-scala-umana`.
   */
  messaggio: Bilingual;
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
      it: 'Tre obiettivi che avete dichiarato voi, i numeri che ci state dietro, e che cosa chiedono a chi comunica.',
      en: 'Three goals you stated yourselves, the figures behind them, and what they ask of whoever communicates.',
    },
    messaggio: {
      it: 'La base digitale c’è già: adesso cresce il contenuto che deve passarci sopra.',
      en: 'The digital groundwork is already there: what grows now is the content that runs over it.',
    },
  },
  {
    slug: 'domanda',
    num: '02',
    label: { it: 'La domanda', en: 'The question' },
    lead: {
      it: 'Le tre direzioni dichiarate da voi, e le quattro cose da capire prima di proporre.',
      en: 'The three directions you set out, and the four things to understand before proposing.',
    },
    messaggio: {
      it: 'Prima di qualunque proposta ci servono quattro risposte, non una decisione.',
      en: 'Before any proposal we need four answers, not a decision.',
    },
  },
  {
    slug: 'idee',
    num: '03',
    label: { it: 'Le idee', en: 'The ideas' },
    lead: {
      it: 'Dove ci appoggiamo su quello che avete già, e una banca che ha fatto una strada vicina.',
      en: 'Where we build on what you already have, and a bank that walked a nearby road.',
    },
    messaggio: {
      it: 'Ogni strato si appoggia a\u00a0qualcosa che avete già: il lavoro è collegarli, non ricominciare.',
      en: 'Each layer rests on something you already have: the work is connecting them, not starting over.',
    },
  },
  {
    slug: 'rotta',
    num: '04',
    label: { it: 'La rotta', en: 'The route' },
    lead: {
      it: 'Tre passi, e la richiesta: un referente, due casi, una data.',
      en: 'Three steps, and the ask: one contact, two cases, one date.',
    },
    messaggio: {
      it: 'Da fuori non possiamo saperlo: è esattamente quello che vorremmo verificare con voi.',
      en: 'From outside we cannot know: that is exactly what we would like to check with you.',
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
