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
  /** ⚠️ 6 nov 2026, panel, e sopravviveva dal giro del 12 ottobre: in
   *  quarantatré slide non compariva un solo indicatore del mestiere del
   *  cliente. «In comitato ci si va con le unità di misura», e senza, quattro
   *  idee sono quattro conversazioni. Una riga per idea, dichiarata come il
   *  numero che guarderemmo INSIEME — non come un beneficio promesso, che il
   *  vocabolario di questo deck vieta. */
  misura: string;
}

export const IDEE: Idea[] = [
  {
    slug: 'ricerca',
    misura: 'Da quante risposte arrivate, e quanto di quel traffico diventa un biglietto',
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
    misura: 'Quanta parte del venduto aggancia più di un prodotto',
    occhiello: 'L’idea, in una schermata',
    titolo: 'Una soluzione intera, da cercare una volta sola',
    mock: 'viaggio',
    /* ⚠️ 6 nov 2026, panel: qui c'era «+11%», la metrica di una telco danese,
       in corpo grande sopra una slide che parla di treni. Quattro personas su
       sei l'hanno messa fra le condizioni: nessuno dei due settori di
       referenza ha posti che scadono, curva di riempimento o rete
       intermediata, e una percentuale altrui in cifra grande apre la domanda
       «e da noi?» invece di chiuderla. Resta il meccanismo, e il numero
       grande torna a essere loro. */
    cifra: { k: '3', v: 'le tratte di uno stesso viaggio che oggi si prenotano una per\u00a0una' },
    chiusa: 'L’ultimo miglio dentro la stessa ricerca: chi compra smette di cercarlo altrove.',
    prova: {
      chi: 'Telmore',
      settore: 'telecomunicazioni, Danimarca',
      /* Meccanismo, non risultato: le percentuali sono uscite il 6 nov 2026
         col panel. Il perimetro si dichiara, perché è la prima cosa che
         chiede chi vende posti su un treno. */
      fatto: 'Le proposte ordinate dal sistema invece che elencate a\u00a0mano. Altro perimetro: telco ad abbonamento, nessun posto che scade.',
      fonte: SOURCES.telmore,
    },
    capability: ['Riconoscere lo stesso cliente su prodotti diversi', 'Provare una proposta su una parte del traffico'],
    gruppi: ['acquisto', 'collaborazione'],
    fonte: 'L’itinerario in schermata è un esempio nostro, non un prodotto a listino.',
  },
  {
    slug: 'contenuto',
    misura: 'Quanti giorni passano dal brief alla vetrina, per mercato',
    occhiello: 'L’idea, in una schermata',
    titolo: 'Un master approvato, quattro mercati',
    mock: 'contenuto',
    /* ⚠️ 6 nov 2026, panel: era «da giorni a minuti», il tempo di uscita di
       una banca brasiliana, su una pila che NON comprende GenStudio né
       Firefly — due dei tre nomi che la slide affianca. */
    cifra: { k: '3 × 5', v: 'tre prodotti per cinque mercati, prima ancora delle\u00a0lingue' },
    chiusa: 'La campagna che esce in Italia è già pronta per Monaco e per Shanghai: si rifà la lingua, si tiene il resto.',
    prova: {
      chi: 'Santander Brasil',
      settore: 'banca, dieci mercati nel gruppo',
      fatto: 'Un master approvato e le sue varianti per mercato, in un flusso\u00a0solo. Altro perimetro: una banca, e senza gli strumenti di generazione nominati qui accanto.',
      fonte: SOURCES.santander,
    },
    capability: ['Produrre le varianti su scala, governate'],
    gruppi: ['contenuto'],
    /* ⚠️ 6 nov 2026, REFUTATA dal fact-check, ed era l'errore nella direzione
       peggiore: svendeva una capacità che esiste e inventava un costo di
       progetto — su una riga che la slide portava come prova di onestà. Le
       release notes dicono 12 lingue in disponibilità generale più 5 in beta;
       quello che è limitato all'inglese è l'analisi del tono del testo, che è
       un'altra funzione. */
    fonte: `La generazione multilingua con validazione di marchio è dichiarata su 12 lingue (${SOURCES.genstudioRelease.label}): la revisione umana resta una vostra scelta di processo.`,
  },
  {
    slug: 'rete',
    misura: 'Venduto per agenzia attiva, e il peso dell’intermediato sul diretto',
    occhiello: 'L’idea, in una schermata',
    titolo: 'La stessa proposta del sito arriva al banco dell’agenzia',
    mock: 'rete',
    /* ⚠️ 6 nov 2026, panel: SEI personas su sei, il rilievo più corale del
       giro e il secondo che sopravvive dal 12 ottobre. La cifra grande del
       capitolo che parla del CANALE AGENZIALE erano i 70.000 punti vendita
       sul Regionale fuori dalle biglietterie: altro contratto, altro
       margine, altro prodotto, altra direzione — e un dato del 2014.
       Dichiarare l'età non salva la cifra: in proiezione si legge il numero,
       non la nota. Il numero del canale è loro, è di ottobre 2025, e lo ha
       detto lui al TTG. I 70.000 restano, in nota, su `slide-settantamila`. */
    cifra: { k: '12.400', v: 'le agenzie di viaggio che vendono i vostri biglietti: 6.400 in Italia e 6.000 all’estero, numeri vostri dell’ottobre 2025' },
    /* ⚠️ 4 nov: la chiusa diceva «la rete vende ogni giorno, e non sapete
       chi vende che cosa». Non possiamo dirlo: di che cosa vedano della rete
       non esiste fonte, e un'affermazione di assenza su un cliente si verifica
       sulle sue pagine prima di scriverla. Qui resta quello che proponiamo,
       e la domanda la fa la slide che chiude il capitolo. */
    chiusa: 'L’agenzia smette di costruirsi le proposte a mano, e vende quello che il sito sta già spingendo.',
    /* ⚠️ ERA L'UNICA DELLE QUATTRO IDEE SENZA REFERENZA, ed è quella su cui
       si fa la richiesta. Unipol è il caso più vicino che esista: la rete
       agenziale più estesa d'Italia, e lo strumento con cui l'agente vende
       portato dentro la stessa analisi del sito.
       TRE REGOLE RISPETTATE, e sono il motivo per cui questa voce è scritta
       così e non in modo più comodo:
       · la SCALA viene dalle loro pagine, con il link — il deck del Summit
         portava 2.100 agenzie e 16,8 milioni di clienti, cifre di un anno fa
         già superate da loro stessi;
       · il MECCANISMO viene dall'intervento al Summit, citato come tale e
         senza link, perché una sessione non è una pagina che si apre;
       · NESSUNA metrica di Unipol. Quelle della sessione misurano la
         velocità dell'analisi, non il venduto per rete: sotto una frase sulle
         agenzie sarebbero la prova sbagliata.
       E non si dice «quotazioni»: nei loro materiali il preventivo sta solo
       sui flussi digitali del sito, mai sul canale agenziale. */
    prova: {
      chi: 'Unipol',
      settore: 'assicurazioni, Italia',
      fatto: '17,6 milioni di clienti e +2.000 agenzie: lo strumento con cui l’agente vende e le polizze emesse stanno nella stessa analisi del sito.',
      fonte: SOURCES.unipolRete,
    },
    capability: ['Misurare il venduto per rete', 'Combinare il canale con i digitali'],
    gruppi: ['rete'],
    fonte: `${SOURCES.agenzie.label}, e le cifre dette dal Direttore Sales al TTG nell’ottobre 2025. Il canale agenziale di Unipol è stato raccontato da loro ad ${SOURCES.unipolSummit.label}: l’abstract pubblico di quella sessione non nomina le agenzie, il pezzo sul canale sta nelle slide presentate.`,
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
