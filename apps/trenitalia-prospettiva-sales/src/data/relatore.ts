/**
 * LE NOTE PER CHI PRESENTA.
 *
 * PER CHI È SCRITTA: un collega che apre questo deck **per la prima volta**,
 * un'ora prima di entrare in sala. Non sa niente del cliente, non era al dry
 * run, e deve poter reggere la conversazione. Quindi ogni voce dice tre cose e
 * nessuna in più: **come si apre la slide a voce**, **qual è il fatto e da dove
 * viene**, e **che cosa arriva se chiedono**.
 *
 * ⚠️ QUESTA PAGINA È PUBBLICA, come tutto il deck. Qui dentro non entra niente
 * che non sia già in slide o già pubblico: nessun dato di contratto, nessun
 * nome di persona, nessuna misura interna, nessuna indicazione su che cosa non
 * si nomina in quella stanza. Quella parte vive nel dossier riservato e si
 * legge prima, non da qui.
 *
 * ⚠️ NON SI SCRIVE A MANO QUELLO CHE È GIÀ NEI DATI. Titoli, numeri e fonti li
 * rende la pagina leggendo `slides.ts`, `chapters.ts` e `contenuti.ts`: qui
 * sta solo quello che un dato non può dire, cioè come lo si racconta. Se una
 * slide entra nel registro e non ha la sua nota, la pagina lo segnala in
 * chiaro invece di tacere.
 */

export interface NotaSlide {
  /** L'id della slide, lo stesso del registro in `slides.ts`. */
  id: string;
  /** Come si apre a voce. Una frase, quella che si dice davvero. */
  dire: string;
  /** Che cosa regge la slide, e da dove viene. Omesso dove la slide è un respiro. */
  fatto?: string;
  /** La domanda che arriva più spesso, e la risposta onesta. */
  seChiedono?: { d: string; r: string };
  /** Una cautela — solo se è già dichiarata in slide. */
  attenzione?: string;
}

/** Quanto dura un capitolo, in minuti, su un'ora piena. */
export const MINUTI: Record<string, number> = {
  apertura: 7, domanda: 6, ricerca: 11, viaggio: 11,
  contenuto: 7, rete: 8, rotta: 10,
};

/** Le tre cose che devono restare se il resto si perde. */
export const TRE_COSE: string[] = [
  'La vendita si perde in quattro punti diversi, e tre stanno prima o fuori dal sito.',
  'Su tutte e quattro le idee una parte della tecnologia è già nel loro contratto.',
  'Non chiediamo un progetto: chiediamo mezza giornata sui loro dati, sul canale delle agenzie.',
];

/** Che cosa si chiede, parola per parola. È anche l'ultima slide. */
export const ASK_A_VOCE =
  'Una sessione sui vostri dati, prima di qualunque progetto: guardiamo insieme come vende la rete delle agenzie.';

export const NOTE: Record<string, NotaSlide[]> = {
  index: [
    { id: 'slide-cover',
      dire: 'Un’ora, quattro punti in cui una vendita si perde prima che qualcuno salga su un treno. Niente slide di prodotto: alla fine vi chiediamo una cosa sola.',
      seChiedono: { d: 'È una proposta commerciale?', r: 'No. È una lettura del vostro anno fatta da fuori, e una domanda. L’unica richiesta è mezza giornata di lavoro insieme.' } },
  ],

  apertura: [
    { id: 'slide-cover', dire: 'Partiamo da tre fatti che cambiano l’anno commerciale. Nessuno dei tre arriva da noi: sono vostri, o del mercato.' },
    { id: 'slide-mercato',
      dire: 'Al TTG dell’anno scorso il tema era il 96% del territorio che gli stranieri non vedono. Il rovescio è che tre quarti di loro si concentrano sul 4%.',
      fatto: 'Il 96% è una citazione del vostro Direttore Sales; il 75%/4% è un dato di contesto del TTG, non una sua frase. Fonti in slide.',
      attenzione: 'Il 75%/4% va detto come dato che circolava al TTG, mai come una sua dichiarazione: la differenza è in slide ed è giusto che si veda.' },
    { id: 'slide-novantasei',
      dire: 'Quest’anno la parola che ha usato lui è una sola: internazionalizzazione. E nella stessa intervista dice dove stanno investendo: app e sito.',
      fatto: 'Intervista al Direttore Sales, TTG, 15 ottobre 2026. I mercati sono i suoi, non una nostra selezione.',
      seChiedono: { d: 'Serve un programma estero separato?', r: 'No, ed è il punto della slide: la macchina che serve l’Italia è la stessa. Cambiano lingua e canale, non l’impianto.' } },
    { id: 'slide-contesto',
      dire: 'Tre cose si muovono nello stesso anno: il mercato, il prezzo e il momento. È la finestra in cui quello che si decide entra nel piano.',
      fatto: 'Prezzo dinamico sulle Frecce da gennaio 2026; piano di Gruppo entro fine anno; nuovo sito previsto per marzo 2027, parole sue.',
      seChiedono: { d: 'Il prezzo non è già la leva?', r: 'Lo è, e lavora da gennaio. Ma verso l’alto il vertice ha dichiarato che non aumenteranno: da lì in poi la leva è un’altra.' } },
  ],

  domanda: [
    { id: 'slide-cover', dire: 'Da qui in avanti tutto risponde a una domanda sola.' },
    { id: 'slide-domanda',
      dire: 'Il prezzo si muove già con la domanda. Allora dove si perdono le vendite che il prezzo non recupera?',
      attenzione: 'Qui si fa una pausa. È la domanda del documento: se la si copre parlando, il resto dell’ora non ha una cornice.' },
    { id: 'slide-mappa',
      dire: 'Quattro possibili risposte, in ordine di percorso: prima del sito, dentro l’offerta, a valle, e nel canale che è vostro. Sono anche i quattro capitoli che seguono.',
      seChiedono: { d: 'E voi che cosa ci mettete?', r: 'Si apre il secondo blocco della slide: per ogni idea le cose da saper fare e i prodotti, con quali sono già vostri. È lì apposta, non va proiettato prima che lo chiedano.' } },
  ],

  ricerca: [
    { id: 'slide-cover', dire: 'Il primo punto sta prima di ogni vostra pagina. Ed è l’unico capitolo in cui portiamo una misura fatta da noi.' },
    { id: 'slide-idea',
      dire: 'Abbiamo fatto le stesse otto domande di viaggio a due assistenti. Su ChatGPT siete fra le fonti sette volte su otto; nella risposta generata di Google, due.',
      fatto: 'Misura Adobe dell’11 e 12 ottobre 2026, otto domande, due assistenti. Il campione è piccolo e lo diciamo in slide.',
      seChiedono: { d: 'Otto domande sono poche.', r: 'Sì, ed è scritto. Non è una statistica: è una fotografia ripetibile. L’offerta è rifarla insieme con le vostre domande.' } },
    { id: 'slide-referto',
      dire: 'Queste sono le otto domande, una per conversazione nuova, nessuna di marca. Due assistenti, due risposte diverse.',
      fatto: 'Il metodo è in slide perché la prima cosa che si controlla è come è stata fatta la misura.' },
    { id: 'slide-frecce',
      dire: 'Su una delle otto, Google mette sullo stesso piano Frecciarossa, Italo, Trenitalia e Intercity, come fossero quattro aziende in concorrenza. Due sono vostri prodotti.',
      fatto: 'Verbatim dalla risposta generata, domanda 8. Sulla stessa domanda ChatGPT non sbaglia.',
      attenzione: 'L’errore è dell’assistente, non loro: attribuirlo a «gli assistenti» in generale sarebbe falso, perché l’altro non sbaglia mai sulle otto.' },
    { id: 'slide-leva',
      dire: 'La leva è concreta: si cambia la pagina e si rimisura se la risposta cambia. Non è ottimizzazione per un motore, è scrivere le pagine che quei sistemi leggono.',
      seChiedono: { d: 'È SEO?', r: 'No. La SEO ottimizza un posizionamento in un elenco; qui si lavora su che cosa un sistema generativo cita come fonte, e si misura.' } },
    { id: 'slide-canale',
      dire: 'E c’è un secondo tempo: dove oggi vi citano, domani si potrebbe comprare.',
      attenzione: 'Al condizionale, sempre. È una direzione dichiarata in un comunicato, non una roadmap: raccontarla come certa è il modo più rapido di perdere credibilità sul resto.' },
  ],

  viaggio: [
    { id: 'slide-cover', dire: 'Questo è il capitolo in cui abbiamo più domande che risposte: l’intermodale è il vostro mestiere, non il nostro.' },
    { id: 'slide-idea',
      dire: 'L’idea è una soluzione intera da cercare una volta sola, treno, gomma e ultimo miglio insieme, invece di tre prodotti da comporre a mano.',
      fatto: 'La referenza è Telmore, telco danese: +25% le vendite incrociate ai già clienti e +21% la crescita del digitale.',
      attenzione: 'È fuori settore e si dice: una referenza fuori settore dichiarata è onesta, una nascosta si scopre.' },
    { id: 'slide-gia',
      dire: 'Il punto di partenza è già vostro: l’intermodale è nel vostro perimetro, non è una cosa da costruire.',
      fatto: 'Fonti loro, in slide.' },
    { id: 'slide-matera',
      dire: 'Roma-Matera: tutti e due gli assistenti aprono con gli operatori di autobus, e il biglietto combinato lo attribuiscono prima al concorrente.',
      fatto: 'Dalle stesse otto domande del capitolo precedente. La gomma su quella tratta è vostra, e nella risposta non compare.' },
    { id: 'slide-acquisto',
      dire: 'Chi va a Bari in vacanza e chi ci va per lavoro: all’acquisto li distinguete?',
      attenzione: 'È una domanda, non un’accusa. Se rispondono «sì, lo facciamo», è una buona notizia e si va oltre: non si insiste.' },
    { id: 'slide-prima',
      dire: 'Il viaggio si decide prima, e altrove. Chi ha prenotato una crociera sta ancora decidendo come arrivare al porto.',
      fatto: 'Il protocollo con Costa Crociere presentato al TTG il 15 ottobre 2026: è il caso da cui partire perché ha una data ed è loro.' },
    { id: 'slide-collab',
      dire: 'Si lavora in due sugli stessi viaggiatori senza scambiarsi i dati: ciascuno tiene i suoi dove sono, e si incrocia solo chi interessa a entrambe.',
      seChiedono: { d: 'Dobbiamo consegnare la nostra base clienti?', r: 'No, ed è il punto: nessuno consegna il proprio elenco. Ogni azienda resta nel proprio ambiente con le proprie regole di accesso.' } },
  ],

  contenuto: [
    { id: 'slide-cover', dire: 'Terzo punto, a valle: la squadra è una e i prodotti sono tre.' },
    { id: 'slide-idea',
      dire: 'Un master approvato una volta, e da lì le varianti per mercato e per lingua.',
      fatto: 'La referenza è Santander Brasil: 530 offerte al retail e 800 alle PMI con oltre 4.400 asset, e il tempo di lancio sceso da giorni a minuti.',
      attenzione: 'La validazione automatica di marchio oggi lavora in inglese: la revisione umana sulle altre lingue resta, ed è scritto in slide.' },
    { id: 'slide-aritmetica',
      dire: 'Il conto è semplice: un venditore che conosceva un prodotto oggi ne vende tre, più i servizi. A mano quel numero di versioni non esce.',
      seChiedono: { d: 'Vuol dire sostituire l’agenzia creativa?', r: 'No. Vuol dire che il master resta loro e le varianti smettono di essere lavoro a mano.' } },
    { id: 'slide-unposto',
      dire: 'Nasce, si approva, si traduce e si misura nello stesso posto: è il punto, non i nomi dei prodotti.' },
  ],

  rete: [
    { id: 'slide-cover', dire: 'Ultimo punto, ed è quello su cui facciamo la richiesta: il canale che è già vostro.' },
    { id: 'slide-idea',
      dire: 'L’idea: la stessa proposta che il sito sta spingendo arriva pronta al banco dell’agenzia, invece di essere costruita lì a mano.',
      attenzione: 'Questa è l’unica delle quattro idee senza una referenza: non si promette un risultato, si descrive che cosa succede.' },
    { id: 'slide-settantamila',
      dire: '12.400 agenzie vendono i vostri biglietti, 6.400 in Italia e 6.000 all’estero. E fuori dalle biglietterie si parla di oltre settantamila punti vendita.',
      fatto: 'Le 12.400 agenzie sono un numero loro dell’ottobre 2025. I settantamila punti vendita vengono da un comunicato del 2014.',
      attenzione: 'Il dato del 2014 va detto come ordine di grandezza, non come misura di oggi. È scritto in slide: dirlo prima che lo notino loro vale molto.' },
    { id: 'slide-sapere',
      dire: 'Di un canale digitale si sa chi entra e dove si ferma. Che cosa sapreste della rete, se la guardaste come guardate un sito?' },
    { id: 'slide-serve',
      dire: 'E c’è una ragione di tempo: si misura mentre si mette mano al sistema che serve quel canale, e dopo diventa un progetto a sé.',
      seChiedono: { d: 'Che cosa serve da noi?', r: 'Un estratto aggregato delle vendite per agenzia e per prodotto, nel formato che la piattaforma ha già. Il periodo lo scelgono loro.' } },
  ],

  rotta: [
    { id: 'slide-cover', dire: 'Quattro punti sono troppi per cominciare da tutti. Ne proponiamo uno, e la decisione è loro.' },
    { id: 'slide-ripresa',
      dire: 'Ecco le quattro idee di nuovo: le capacità da avere, e i prodotti. Su tutte e quattro una parte è già in casa vostra.',
      attenzione: 'È il momento in cui si tace e si lascia guardare la slide. La domanda in titolo è per loro.' },
    { id: 'slide-passo',
      dire: ASK_A_VOCE,
      attenzione: 'Non è un progetto e non è un’offerta, e va detto con queste parole. Mezza giornata, i loro dati, nessun impegno dopo.' },
    { id: 'slide-domande',
      dire: 'E quattro cose che possiamo imparare solo da voi. Chiudere con le domande, non con una promessa.' },
    { id: 'slide-signature', dire: 'Grazie. Il link resta vostro: il percorso intero è nel menu, e c’è anche una versione da dieci minuti.' },
  ],

  'dieci-minuti': [
    { id: 'slide-cover',
      dire: 'Se l’ora diventa venti minuti si apre questa: stesse fonti, stessi numeri, sei slide e la richiesta dentro.',
      attenzione: 'È anche la versione che l’interlocutore gira al suo capo: qui le quattro idee con i prodotti si proiettano, non stanno dietro un drill-down.' },
    { id: 'slide-novantasei', dire: 'La parola dell’anno, con la sua fonte.' },
    { id: 'slide-contesto', dire: 'Le tre cose che si muovono nello stesso anno.' },
    { id: 'slide-domanda', dire: 'La domanda. Identica al percorso intero, parola per parola.' },
    { id: 'slide-mappa', dire: 'I quattro punti, con una riga ciascuno.' },
    { id: 'slide-contributi', dire: 'Le quattro idee e i prodotti, con quali sono già loro.' },
    { id: 'slide-passo', dire: ASK_A_VOCE },
    { id: 'slide-signature', dire: 'Chiusura.' },
  ],
};

/** La nota di una slide, se c'è. */
export function nota(slug: string, id: string): NotaSlide | undefined {
  return NOTE[slug]?.find((n) => n.id === id);
}
