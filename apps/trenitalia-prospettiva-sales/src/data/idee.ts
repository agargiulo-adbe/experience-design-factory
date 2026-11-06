/**
 * LE QUATTRO IDEE, nel registro XD — una slide per idea.
 *
 * ⚠️ XD E I MICRO-DIAGRAMMI SONO DUE REGISTRI, e non si sostituiscono
 * (`skills/experience-design/references/xd.md`, BINDING per ogni deck).
 * Qui c'è quello che si PROIETTA: un mockup grande, una cifra, una frase,
 * una referenza. Il meccanismo — i prodotti, il dato, i passi — resta dove
 * stava, dietro «Scopri come», e si apre se lo chiedono.
 *
 * Fonte unica: la stessa voce serve il percorso intero e il taglio «In dieci
 * minuti». Se una cifra cambia, cambia in un posto solo.
 */
import { SOURCES, type Fonte } from './sources';
import { SERVE, type Pezzo } from './contenuti';

export interface Prova {
  /** Il nome di chi l'ha fatto. Mai un logo ricostruito a mano. */
  chi: string;
  /** Il settore, dichiarato: una referenza fuori settore è onesta, non nascosta. */
  settore: string;
  /** Il fatto, con le parole del caso. */
  fatto: string;
  fonte: Fonte;
}

export interface Idea {
  /** Il capitolo a cui appartiene. */
  slug: 'ricerca' | 'viaggio' | 'contenuto' | 'rete';
  occhiello: string;
  titolo: string;
  /** Il mockup che si proietta. */
  mock: 'ricerca' | 'viaggio' | 'contenuto' | 'rete';
  /** La cifra: una sola, grande. */
  cifra: { k: string; v: string };
  /** Due cifre affiancate, quando il punto della slide È il confronto e
   *  metterne una sola darebbe a un lato più peso dell'altro. */
  cifre?: { k: string; v: string }[];
  /** Il punto della slide. Una frase, e si vede che è una frase. */
  chiusa: string;
  /** La referenza. Assente dove non ne esiste una che possiamo provare:
   *  forzarne una che non c'entra è peggio che non averla. */
  prova?: Prova;
  /** La riga di fonte, SENZA il link della referenza: quello lo compone la
   *  slide da `prova.fonte`, così l'indirizzo sta in un posto solo. */
  fonte: string;
  /** ── IL LIVELLO DI MEZZO ──────────────────────────────────────────────
   *  Che cosa Adobe sa fare perché quell'idea stia in piedi. In termini di
   *  business, non di prodotto: è la richiesta del dry run del 5 nov 2026 —
   *  «deve restare evidente che quelle sono le idee, quelle le capability e
   *  quelli i prodotti». Una o due per idea, mai tre: è un ponte, non un
   *  elenco, e il rilievo che l'ha generato era «dove sta Adobe? Non l'ho
   *  vista: siamo troppo sullo sfondo». */
  capability: string[];
  /** ── IL LIVELLO DI SOTTO ──────────────────────────────────────────────
   *  I gruppi di `SERVE` che servono questa idea. Si REFERENZIANO, non si
   *  ricopiano: gli stati dei prodotti sono letti dal contratto e vivono in
   *  un posto solo (`contenuti.ts`). Due gruppi dove l'idea ha due facce. */
  gruppi: (keyof typeof SERVE)[];
}

export const IDEE: Idea[] = [
  {
    slug: 'ricerca',
    occhiello: 'L’idea, in una schermata',
    /* Il titolo È il confronto: con una cifra sola in evidenza la slide sembrava
       dire «gli assistenti non vi citano», e la misura dice il contrario — dipende
       da quale assistente. Le due cifre stanno affiancate e con lo stesso peso. */
    titolo: 'Su ChatGPT siete fra le fonti 7 volte su 8. Su Google, 2.',
    mock: 'ricerca',
    cifra: { k: '7 su 8', v: 'le risposte di ChatGPT che citano trenitalia.com fra le fonti' },
    cifre: [
      { k: '7 su 8', v: 'le risposte di ChatGPT che citano trenitalia.com fra le fonti' },
      { k: '2 su 8', v: 'le stesse otto domande, nella risposta generata dentro la ricerca Google' },
    ],
    /* La chiusa diceva «nella lingua giusta» e «il prodotto torna vostro». La misura
       non scompone per lingua (quattro domande IT e quattro EN, nessun dato separato)
       e non misura a chi torni il prodotto. Quello che mostra davvero è il link: su
       ChatGPT i link sono «prenota con Trenitalia». */
    chiusa: 'Su ChatGPT il link dice «prenota con Trenitalia», e manda a\u00a0comprare da voi invece che da un rivenditore.',
    capability: ['Misurare come comparite nelle risposte', 'Produrre le pagine che l’AI legge'],
    gruppi: ['visibilita', 'canale'],
    fonte: `${SOURCES.misura.label}, su 8 domande. Possiamo ripeterla insieme. La schermata è un esempio nostro, non una risposta registrata.`,
  },
  {
    slug: 'viaggio',
    occhiello: 'L’idea, in una schermata',
    titolo: 'Una soluzione intera, da cercare una volta sola',
    mock: 'viaggio',
    cifra: { k: '+11%', v: 'le vendite dalle proposte personalizzate, ordinate dal sistema invece che a mano' },
    chiusa: 'L’ultimo miglio dentro la stessa ricerca: chi compra smette di cercarlo altrove.',
    prova: {
      chi: 'Telmore',
      settore: 'telecomunicazioni, Danimarca',
      fatto: '+11% le vendite dalle proposte personalizzate e +25% le vendite incrociate ai già clienti, con la stessa vetrina di prima.',
      fonte: SOURCES.telmore,
    },
    capability: ['Riconoscere lo stesso cliente su prodotti diversi', 'Provare una proposta su una parte del traffico'],
    gruppi: ['acquisto', 'collaborazione'],
    fonte: 'L’itinerario in schermata è un esempio nostro, non un prodotto a listino.',
  },
  {
    slug: 'contenuto',
    occhiello: 'L’idea, in una schermata',
    titolo: 'Un master approvato, quattro mercati',
    mock: 'contenuto',
    cifra: { k: 'da giorni a minuti', v: 'il tempo fra la campagna approvata e la variante pubblicata, su 4.400 asset creativi' },
    chiusa: 'La campagna che esce in Italia è già pronta per Monaco e per Shanghai: si rifà la lingua, si tiene il resto.',
    prova: {
      chi: 'Santander Brasil',
      settore: 'banca, dieci mercati nel gruppo',
      fatto: '530 offerte al retail e 800 alle PMI con oltre 4.400 asset creativi, e il tempo di uscita sceso da giorni a minuti.',
      fonte: SOURCES.santander,
    },
    capability: ['Produrre le varianti su scala, governate'],
    gruppi: ['contenuto'],
    fonte: 'La validazione automatica di marchio oggi lavora in inglese: la revisione umana su ogni lingua resta, e va messa a piano.',
  },
  {
    slug: 'rete',
    occhiello: 'L’idea, in una schermata',
    titolo: 'La stessa proposta del sito arriva al banco dell’agenzia',
    mock: 'rete',
    cifra: { k: 'oltre 70.000', v: 'i punti vendita fuori dalle biglietterie sul Regionale; il dato è del 2014 e va riconfermato' },
    /* ⚠️ 4 nov: la chiusa diceva «la rete vende ogni giorno, e non sapete
       chi vende che cosa». Non possiamo dirlo: di che cosa vedano della rete
       non esiste fonte, e un'affermazione di assenza su un cliente si verifica
       sulle sue pagine prima di scriverla. Qui resta quello che proponiamo,
       e la domanda la fa la slide che chiude il capitolo. */
    chiusa: 'L’agenzia smette di costruirsi le proposte a mano, e vende quello che il sito sta già spingendo.',
    capability: ['Misurare il venduto per rete', 'Combinare il canale con i digitali'],
    gruppi: ['rete'],
    fonte: `${SOURCES.retePunti.label}. Il numero è loro e ha dodici anni: in slide sta come ordine di grandezza, non come misura di oggi.`,
  },
];

export const idea = (slug: Idea['slug']) => IDEE.find((i) => i.slug === slug)!;

/** I prodotti di un'idea, presi dai suoi gruppi in `SERVE` e **deduplicati per
 *  nome**: due facce della stessa idea citano spesso lo stesso prodotto — AEM
 *  sta sia nella visibilità sia nel canale — e in slide va nominato una volta.
 *  Vince la prima occorrenza, cioè quella del gruppo principale. */
export function pezziDi(slug: Idea['slug']): Pezzo[] {
  const visti = new Set<string>();
  const out: Pezzo[] = [];
  for (const g of idea(slug).gruppi) {
    for (const pz of SERVE[g]) {
      if (visti.has(pz.nome)) continue;
      visti.add(pz.nome);
      out.push(pz);
    }
  }
  return out;
}
