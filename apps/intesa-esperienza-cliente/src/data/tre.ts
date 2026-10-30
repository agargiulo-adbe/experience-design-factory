/**
 * LE TRE COSE — fonte unica delle due slide di sintesi.
 *
 * ⚠️ PERCHÉ DUE SLIDE E NON UNA RIPETUTA (verifica sulla documentazione,
 * 30 ott 2026). La tecnica «dì quello che dirai, dillo, ripeti quello che
 * hai detto» è folklore — la traccia più antica è del 1908, un consiglio
 * su come si fa una predica, e non è di Aristotele. Quello che regge è
 * **metà** di quella formula:
 *
 *   · L'ANTICIPAZIONE in apertura è la parte con le prove migliori
 *     (advance organizer: effetto 0,21 subito, 0,38 dopo tre settimane).
 *     È la slide A, e si guarda tutta insieme: è una mappa, non un
 *     racconto, quindi niente `data-substep`.
 *   · RI-PRESENTARE LO STESSO MATERIALE è invece la famiglia con meno
 *     prove (Dunlosky 2013: riassunto e rilettura a bassa utilità).
 *
 * Da qui la forma: la slide B non ripete la A. Tiene la **stessa
 * geometria** — perché è lì che chi guarda riaggancia — e cambia il
 * contenuto: `riga` dice che cosa vedrete, `poi` dice che cosa ne è
 * seguito. Un campo accanto all'altro, mai due oggetti diversi, se no
 * divergono (è la regola del taglio corto).
 *
 * ⚠️ NIENTE GIULIA NELLA COLONNA `riga`: la slide A sta nel capitolo 01,
 * dove la persona non è ancora stata introdotta. In `poi` sì, perché
 * quella slide arriva alla fine.
 */
export interface Cosa {
  n: string;
  /** Il gruppo dell'offerta: porta il colore, che è un contratto. */
  gruppo: 'trovare' | 'engagement' | 'piattaforma';
  /** L'ancora: due o tre parole, non una frase. */
  t: { it: string; en: string };
  /** Slide A — che cosa vedrete. Una riga. */
  riga: { it: string; en: string };
  /** Slide B — che cosa ne è seguito. Una riga, più densa. */
  poi: { it: string; en: string };
  prodotto: string;
}

export const TRE: Cosa[] = [
  {
    n: '1', gruppo: 'trovare', prodotto: 'Adobe Brand Visibility',
    t: { it: 'Farsi trovare', en: 'Being found' },
    riga: { it: 'Chi cerca casa lo chiede a un assistente, non a un motore. O la banca è citata, o non esiste.', en: 'House-hunting starts with an assistant, not a search engine. Either the bank is cited, or it does not exist.' },
    poi: { it: 'I due strati: prima si misura come comparite nelle risposte generate, poi i correttivi vanno in rete al bordo, senza toccare il CMS.', en: 'The two layers: first you measure how you show up in generated answers, then fixes ship at the edge, without touching the CMS.' },
  },
  {
    n: '2', gruppo: 'engagement', prodotto: 'Adobe Experience Platform',
    t: { it: 'Parlare a uno per uno', en: 'Speaking one to one' },
    riga: { it: 'Un profilo solo e una decisione sola, su tutti i canali. Anche su chi cliente non è ancora.', en: 'One profile and one decision, across every channel. Including people who are not customers yet.' },
    poi: { it: 'Il profilo si cuce da identificativi che non si parlano, l’arbitro sceglie fra le proposte, e l’esecuzione può restare nei vostri sistemi.', en: 'The profile is stitched from identifiers that do not talk, the arbiter picks among proposals, and execution can stay in your systems.' },
  },
  {
    n: '3', gruppo: 'piattaforma', prodotto: 'Adobe CX Analytics',
    t: { it: 'Misurare in un posto solo', en: 'Measuring in one place' },
    riga: { it: 'App, sito, contact center e filiale nello stesso dato. Quello che non si misura non si decide.', en: 'App, site, contact centre and branch in one dataset. What is not measured does not get decided.' },
    poi: { it: 'Quattro domande che oggi hanno quattro risposte diverse — e tre cose da concordare prima: identità, eventi, gruppi di controllo.', en: 'Four questions that today get four different answers — and three things to agree first: identity, events, control groups.' },
  },
];
