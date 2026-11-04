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
  /** Il punto della slide. Una frase, e si vede che è una frase. */
  chiusa: string;
  /** La referenza. Assente dove non ne esiste una che possiamo provare:
   *  forzarne una che non c'entra è peggio che non averla. */
  prova?: Prova;
  /** La riga di fonte, SENZA il link della referenza: quello lo compone la
   *  slide da `prova.fonte`, così l'indirizzo sta in un posto solo. */
  fonte: string;
}

export const IDEE: Idea[] = [
  {
    slug: 'ricerca',
    occhiello: 'L’idea, in una schermata',
    titolo: 'Essere la fonte, non una delle voci',
    mock: 'ricerca',
    cifra: { k: '2 su 8', v: 'le risposte di Google che citano trenitalia.com fra le fonti. Su ChatGPT, sulle stesse otto domande, sono 7.' },
    chiusa: 'Dove la pagina giusta esiste nella lingua giusta, la risposta la usa, e il prodotto torna vostro.',
    fonte: `${SOURCES.misura.label}. Nessuna referenza pubblica di un altro cliente su questo tema regge la verifica: la prova qui è la nostra misura, e si rifà davanti a voi.`,
  },
  {
    slug: 'viaggio',
    occhiello: 'L’idea, in una schermata',
    titolo: 'Una soluzione intera, non tre prodotti da cercare',
    mock: 'viaggio',
    cifra: { k: '+11%', v: 'le vendite dalle proposte personalizzate, ordinate dal sistema invece che a mano' },
    chiusa: 'L’ultimo miglio dentro la stessa ricerca: chi compra smette di cercarlo altrove.',
    prova: {
      chi: 'Telmore',
      settore: 'telecomunicazioni, Danimarca',
      fatto: '+11% le vendite dalle proposte personalizzate e +25% le vendite incrociate ai già clienti, con la stessa vetrina di prima.',
      fonte: SOURCES.telmore,
    },
    fonte: 'L’itinerario in schermata è un esempio nostro, non un prodotto a listino.',
  },
  {
    slug: 'contenuto',
    occhiello: 'L’idea, in una schermata',
    titolo: 'Un master approvato, quattro mercati',
    mock: 'contenuto',
    cifra: { k: 'da giorni a minuti', v: 'il tempo fra la campagna approvata e la variante pubblicata, su 4.400 asset creativi' },
    chiusa: 'La campagna che esce in Italia è già pronta per Monaco e per Shanghai: cambia la lingua, non l’impianto.',
    prova: {
      chi: 'Santander Brasil',
      settore: 'banca, dieci mercati nel gruppo',
      fatto: '530 offerte al retail e 800 alle PMI con oltre 4.400 asset creativi, e il tempo di uscita sceso da giorni a minuti.',
      fonte: SOURCES.santander,
    },
    fonte: 'La validazione automatica di marchio oggi lavora in inglese: la revisione umana su ogni lingua resta, e va messa a piano.',
  },
  {
    slug: 'rete',
    occhiello: 'L’idea, in una schermata',
    titolo: 'La rete vende meglio se ha in mano la stessa cosa del sito',
    mock: 'rete',
    cifra: { k: 'oltre 70.000', v: 'i punti vendita fuori dalle biglietterie sul Regionale; il dato è del 2014 e va riconfermato' },
    /* ⚠️ 4 nov: la chiusa diceva «la rete vende ogni giorno, e non sapete
       chi vende che cosa». Non possiamo dirlo: di che cosa vedano della rete
       non esiste fonte, e un'affermazione di assenza su un cliente si verifica
       sulle sue pagine prima di scriverla. Qui resta quello che proponiamo,
       e la domanda la fa la slide che chiude il capitolo. */
    chiusa: 'La proposta e il materiale arrivano già pronti al banco: l’agenzia smette di costruirseli.',
    fonte: `${SOURCES.retePunti.label}. Il numero è loro e ha dodici anni: in slide sta come ordine di grandezza, non come misura di oggi.`,
  },
];

export const idea = (slug: Idea['slug']) => IDEE.find((i) => i.slug === slug)!;
