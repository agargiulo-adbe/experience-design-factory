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
  /** Non mostra la riga «Fonte: …» sotto la slide (richiesta dell'owner, 9 nov 2026). */
  senzaRigaFonte?: boolean;
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
    occhiello: 'Idea 1 di 4',
    /* 9 nov 2026, review: questa slide approfondisce UNA delle otto domande. Le
       cifre su tutte e otto stanno sulla slide degli esiti, dopo il campione. */
    titolo: 'La prima delle otto: come arrivo da Roma a\u00a0Matera senza\u00a0auto',
    mock: 'ricerca',
    cifra: { k: '2 su 2', v: 'gli assistenti AI che su questa domanda aprono con gli operatori di autobus' },
    chiusa: 'Il biglietto combinato treno più autobus va prima al concorrente. ChatGPT cita Freccialink solo dopo.',
    capability: ['Misurare come comparite nelle risposte', 'Produrre le pagine che l’AI legge'],
    gruppi: ['visibilita', 'canale'],
    fonte: `${SOURCES.misura.label}, domanda 1 delle 8. La schermata riassume l’esito su ChatGPT, non è la risposta registrata.`,
  },
  {
    slug: 'viaggio',
    misura: 'Quanta conversione in\u00a0più portano le\u00a0proposte personalizzate',
    occhiello: 'Idea 2 di 4',
    titolo: 'Personalizzazione su larga scala: la\u00a0proposta giusta a\u00a0ogni cliente',
    mock: 'viaggio',
    /* 9 nov 2026, review: in call si è visto che su trenitalia.com Roma-Matera
       esce già con Frecciarossa più Freccialink. La cifra diceva «tre tratte che
       oggi si prenotano una per una», e la combinazione esiste: l'idea non è
       farla, è capire quale proporre a chi. Il 96% è suo, ottobre 2025. */
    cifra: { k: 'CartaFreccia', v: 'la proposta cambia con il livello: stessa tratta, vantaggi diversi per chi viaggia di più' },
    chiusa: 'Il cliente CartaFreccia trova in homepage la meta giusta e un vantaggio legato al suo livello. Con chi non è registrato si parte da posizione e navigazione.',
    prova: {
      chi: 'Brightline',
      settore: 'alta velocità ferroviaria, Florida',
      fatto: 'Chi abbandona la prenotazione riceve un promemoria con l’itinerario salvato. Chi viaggia spesso riceve parcheggio scontato e upgrade dell’ultimo minuto, in app, ai chioschi e via email.',
      fonte: SOURCES.brightline,
    },
    capability: ['Riconoscere chi arriva, registrato o no', 'Provare una\u00a0proposta su\u00a0una\u00a0parte del\u00a0traffico'],
    gruppi: ['acquisto', 'collaborazione'],
    fonte: 'Schermata d’esempio. Si propone solo ciò che si può comprare: prezzo e acquisto restano nei vostri sistemi.',
  },
  {
    slug: 'contenuto',
    misura: 'Quanti giorni passano dal brief alla vetrina, per mercato',
    occhiello: 'Idea 3 di 4',
    titolo: 'Una sola campagna approvata, adattata a ogni mercato',
    mock: 'contenuto',
    /* ⚠️ 6 nov 2026, panel: era «da giorni a minuti», il tempo di uscita di
       una banca brasiliana, su una pila che NON comprende GenStudio né
       Firefly — due dei tre nomi che la slide affianca. */
    cifra: { k: '3 × 5', v: 'le versioni minime di ogni campagna: tre prodotti per cinque mercati' },
    chiusa: 'Dalla stessa campagna nascono le versioni per Monaco e per Parigi: cambiano offerta e messaggio, restano logo, tono e regole del marchio.',
    capability: ['Produrre le varianti su scala, governate'],
    gruppi: ['contenuto'],
    /* ⚠️ 6 nov 2026, REFUTATA dal fact-check, ed era l'errore nella direzione
       peggiore: svendeva una capacità che esiste e inventava un costo di
       progetto — su una riga che la slide portava come prova di onestà. Le
       release notes dicono 12 lingue in disponibilità generale più 5 in beta;
       quello che è limitato all'inglese è l'analisi del tono del testo, che è
       un'altra funzione. */
    fonte: 'La schermata è un esempio nostro: la revisione umana resta una vostra scelta di processo.',
  },
  {
    slug: 'rete',
    misura: 'Venduto per agenzia attiva, e il peso dell’intermediato sul diretto',
    occhiello: 'Idea 4 di 4',
    titolo: 'Quanto del\u00a0venduto in\u00a0agenzia nasce sul\u00a0digitale?',
    mock: 'rete',
    /* ⚠️ 6 nov 2026, panel: SEI personas su sei, il rilievo più corale del
       giro e il secondo che sopravvive dal 12 ottobre. La cifra grande del
       capitolo che parla del CANALE AGENZIALE erano i 70.000 punti vendita
       sul Regionale fuori dalle biglietterie: altro contratto, altro
       margine, altro prodotto, altra direzione — e un dato del 2014.
       Dichiarare l'età non salva la cifra: in proiezione si legge il numero,
       non la nota. Il numero del canale è loro, è di ottobre 2025, e lo ha
       detto lui al TTG.
       9 nov 2026: su richiesta del cliente nessun numero di agenzie in questo
       capitolo, e il capitolo diventa dichiaratamente da approfondire. */
    cifra: { k: 'Da approfondire', v: 'una possibilità da verificare insieme: le agenzie vendono su un sistema diverso dal sito' },
    /* ⚠️ 4 nov: la chiusa diceva «la rete vende ogni giorno, e non sapete
       chi vende che cosa». Non possiamo dirlo: di che cosa vedano della rete
       non esiste fonte, e un'affermazione di assenza su un cliente si verifica
       sulle sue pagine prima di scriverla. Qui resta quello che proponiamo,
       e la domanda la fa la slide che chiude il capitolo. */
    chiusa: 'Il venduto per agenzia lo avete già. Il passo in più è capire quali vendite partono da una ricerca o da un’offerta vista online.',
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
      senzaRigaFonte: true,
    },
    capability: ['Legare il venduto al percorso digitale', 'Capire quali materiali portano vendite'],
    gruppi: ['rete'],
    fonte: 'Perimetro: le agenzie fisiche, le agenzie online vendono con logiche proprie. Il canale agenziale di Unipol è stato raccontato da loro ad Adobe Summit 2026.',
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
