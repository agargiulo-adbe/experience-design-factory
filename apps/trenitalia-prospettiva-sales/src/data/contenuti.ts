/**
 * LA FONTE UNICA dei contenuti del deck: i blocchi che vivono nel percorso intero
 * e nel taglio «In dieci minuti».
 *
 * PERCHÉ ESISTE QUESTO FILE
 * Perché due percorsi che tengono due copie a mano degli stessi blocchi divergono
 * — non è una possibilità, è una certezza, e diverge sempre il taglio corto,
 * perché le correzioni arrivano sul lungo. Su Intesa «Su scala umana» è successo
 * nello stesso giro in cui nei commenti c'era scritto «se divergono comanda il
 * lungo». Qui ogni voce è definita UNA volta e le due pagine la importano.
 *
 * COME FUNZIONA
 * Dove il taglio da dieci minuti ha bisogno di meno parole, la versione corta è
 * un campo ACCANTO a quella lunga (`bBreve`), non un'altra voce: titoli, numeri,
 * ordine ed etichette restano fisicamente lo stesso oggetto. Si può accorciare
 * una descrizione; non si può cambiare, per distrazione, che cosa dice la slide.
 * Il gate che lo verifica: `DECK_URL=… pnpm audit:taglio --app trenitalia-prospettiva-sales`.
 *
 * LINGUA
 * Una sola (vedi `SITE.langs`): le stringhe qui sono in italiano, senza `<T>`.
 * Se un giorno l'experience diventasse bilingue, ogni campo diventa `{it, en}` —
 * e il posto dove farlo è questo, non le pagine.
 *
 * REGOLA: nessuna pagina riscrive a mano quello che sta qui. Se serve una
 * variante, si aggiunge un campo in questo file.
 */
import { SOURCES as S, type ChiaveFonte } from './sources';

export interface Card {
  k: string;
  t: string;
  b: string;
  /** La stessa cosa in meno parole, per il taglio da dieci minuti. */
  bBreve?: string;
  /** Le fonti che reggono QUESTA voce, per chiave. */
  fonti?: ChiaveFonte[];
}

export interface Stat {
  v: string;
  /** «su 8» e simili: il denominatore, reso piccolo accanto al numero. */
  su?: string;
  l: string;
  s: string;
}

/* ── Copertina e firma: le righe che vivono in entrambi i percorsi ───────── */
export const COVER = {
  tag: 'Quattro punti in cui una vendita si perde prima di diventare un viaggio.',
  /** La riga della slide-firma, identica nei due percorsi. */
  firma: 'Il passo dopo: un tavolo di lavoro sulle domande aperte.',
};

/* ── Le teste di slide che i due percorsi condividono ─────────────────────
   Sembrano dettagli — un occhiello, un titolo, un lead — ed è esattamente lì
   che due percorsi divergono senza che nessuno se ne accorga: nessuno rilegge
   un titolo. Il lead ha una versione breve per il taglio; il titolo no, perché
   un titolo diverso vuol dire una slide diversa. */
export const TESTE = {
  contesto: {
    titolo: 'Tre cose che capitano nello stesso anno',
    lead: 'Quell’ambizione sul 96% arriva nell’anno in cui il mercato si allarga e la leva del prezzo si chiude verso l’alto. Non è una brutta notizia: è il motivo per cui conviene guardarla adesso.',
    leadBreve: 'Quell’ambizione sul 96% arriva nell’anno in cui il mercato si allarga e la leva del prezzo si chiude verso l’alto.',
  },
  mappa: {
    eyebrow: 'La mappa',
    titolo: 'Quattro punti, in ordine di percorso',
    lead: 'Sono anche i quattro capitoli che seguono. Se uno solo vi interessa, si va diretti lì: il resto si legge dopo, o non si legge.',
    leadBreve: 'Nel percorso intero sono quattro capitoli, uno per punto. Se uno vi interessa, si apre quello e il resto resta chiuso.',
  },
};

/* ── Capitolo 01 · la sua frase ────────────────────────────────────────────
   Il dato e la citazione sono DUE cose, e qui stanno separate per un motivo
   preciso: il 75% e il 4% circolano al TTG come dato di contesto e NON sono una
   sua citazione verbatim; il 96% sì. Prima stavano dentro le stesse virgolette,
   attribuite a lui, con in calce un link ANSA che non conteneva nessuno dei tre
   numeri. Su una slide d'apertura costruita sulle parole dell'interlocutore,
   quello è l'errore che costa tutto il resto del documento. */
export const APERTURA = {
  eyebrow: 'Rimini, TTG Travel Experience, ottobre 2025',
  /** Dato di contesto: niente virgolette, niente attribuzione a lui. */
  dato: 'Il <strong>75%</strong> degli stranieri che visitano l’Italia si ferma sul <strong>4%</strong> del territorio.',
  /** Sue parole, verbatim. */
  citazione:
    '«Contribuiamo a far conoscere agli italiani e soprattutto ai visitatori stranieri quel <strong>96% del territorio italiano non ancora esplorato</strong>.»',
  /** Come lo legge lui, e con che leva. */
  lettura:
    'Lo stesso giorno, sulla leva: «investiamo sull’intermodalità, arricchendo il nostro pacchetto con un’offerta capillare grazie anche alle connessioni di Busitalia».',
  letturaBreve:
    'E la leva che ha indicato è l’intermodalità, «grazie anche alle connessioni di Busitalia».',
};

/* ── Capitolo 01 · i tre orologi ───────────────────────────────────────────
   Le prime due versioni di questa slide si contraddicevano da sole: una carta
   diceva «il piano industriale annunciato a settembre», l'altra «il piano è
   atteso entro la fine dell'anno». A settembre è stato annunciato che il piano
   ARRIVERÀ: una cosa sola, in due carte, senza contraddirsi. */
export const CONTESTO: Card[] = [
  {
    k: 'Il mercato',
    t: 'Da due operatori a tre, e il terzo è autorizzato',
    b: 'Sull’alta velocità italiana oggi siete in due. SNCF ha il via libera da marzo 2026, debutta non prima della fine del 2027 e dichiara di volere il 15% del mercato. Sulla rete tradizionale è già entrato un operatore partecipato da Renfe.',
    bBreve: 'Sull’alta velocità siete in due: SNCF ha il via libera da marzo 2026 e dichiara di volere il 15% del mercato.',
    fonti: ['sncf', 'arenaways'],
  },
  {
    k: 'Il prezzo',
    t: 'Una leva che si muove da sola',
    b: 'Dal 1º gennaio 2026 il prezzo delle Frecce varia con la domanda, come in aereo. E i biglietti non aumenteranno: lo ha dichiarato il vertice del Gruppo. Verso l’alto la leva è chiusa, e non è vostra: il revenue management sta nel marketing.',
    bBreve: 'Dal 1º gennaio 2026 il prezzo delle Frecce varia con la domanda, e il vertice del Gruppo ha dichiarato che i biglietti non aumenteranno.',
    fonti: ['pricing', 'prezziFermi'],
  },
  {
    k: 'Il momento',
    t: 'Un piano che si sta scrivendo',
    b: 'Il nuovo piano industriale di Gruppo arriva entro la fine dell’anno: lo ha annunciato il vertice a settembre. Il piano si sta scrivendo adesso, ed è il momento in cui un’idea esterna diventa una riga di piano invece che una richiesta fuori piano.',
    bBreve: 'Il piano industriale di Gruppo arriva entro la fine dell’anno, e si sta scrivendo adesso: un’idea esterna può diventare una riga di piano.',
    fonti: ['piano'],
  },
];

/* ── Capitolo 02 · la domanda e i quattro punti ────────────────────────────
   La domanda è la stessa, parola per parola, nel percorso intero e nel taglio.
   I quattro punti SONO i quattro capitoli che seguono, nello stesso ordine.

   La prima versione chiedeva «quando il prezzo non è più la leva»: falsa, e
   smentita dalla slide precedente dello stesso deck. Dal 1º gennaio 2026 il
   prezzo delle Frecce varia con la domanda, quindi lavora più di prima — solo
   che è una leva del marketing, non della Direzione Sales. La domanda giusta non
   dice che la leva è spenta: dice di chi è.

   `perimetri` è la riga che il panel ha chiesto a voce alta da tre poltrone
   diverse: due dei quattro punti si decidono altrove, e dirlo noi prima vale
   molto più che farselo dire da loro. */
export const DOMANDA = {
  titolo: 'Il prezzo lo muove il mercato, e non è la vostra leva.<br />Dove si perdono le vendite?',
  sub: 'Non è una domanda retorica: ha quattro risposte, e stanno in quattro punti diversi del percorso che una persona fa prima di salire su un treno.',
  subBreve: 'Ha quattro risposte, in quattro punti diversi del percorso che una persona fa prima di salire su un treno.',
  perimetri:
    'Due di questi quattro punti non si decidono in questa stanza: il percorso di acquisto sta in Customer Operations, marca e prezzo nel marketing. Lo diciamo noi prima che lo diciate voi — e quello che vi chiediamo alla fine cade per intero dentro il vostro perimetro.',
};

export interface Punto { n: string; dove: string; t: string; b: string; bBreve: string }
export const PUNTI: Punto[] = [
  {
    n: '01',
    dove: 'Prima del sito',
    t: 'Nella risposta che qualcun altro scrive',
    b: 'Chi organizza un viaggio oggi chiede a un assistente, e riceve una risposta che cita qualcuno. Se non siete voi, la vendita è persa prima che una vostra pagina si apra.',
    bBreve: 'Chi organizza un viaggio chiede a un assistente, e la risposta cita qualcuno. Se non siete voi, la vendita è persa prima che una vostra pagina si apra.',
  },
  {
    n: '02',
    dove: 'Dentro l’offerta',
    t: 'Nel momento in cui il viaggio torna a essere un biglietto',
    b: 'Treno, autobus, sosta e volo sono già nella vostra offerta, e la pianificazione porta-a-porta esiste su alcune destinazioni. Quello che non si vede da nessuna parte è il valore del viaggio intero: chi lo sta componendo, nel momento in cui compra, è indistinguibile da chiunque altro.',
    bBreve: 'Treno, autobus, sosta e volo sono già nella vostra offerta. Chi sta componendo un viaggio, nel momento in cui compra, è indistinguibile da chiunque altro.',
  },
  {
    n: '03',
    dove: 'A valle',
    t: 'Nel materiale che non si riesce a produrre',
    b: 'Una squadra sola che vende tre prodotti più i servizi, sui mercati esteri e in più lingue, ha bisogno di un numero di varianti che nessuna struttura creativa produce a mano.',
    bBreve: 'Una squadra sola che vende tre prodotti su più mercati e più lingue ha bisogno di più varianti di quante se ne producano a mano.',
  },
  {
    n: '04',
    dove: 'Nel canale che è vostro',
    t: 'In dodicimila agenzie che vendono e non rispondono',
    b: 'La rete intermediata vende ogni giorno e non restituisce quasi nulla: quali agenzie vendono che cosa, dove si ferma la proposta multiprodotto, quale materiale funziona.',
    bBreve: 'La rete intermediata vende ogni giorno e non restituisce quasi nulla: chi vende che cosa, e dove si ferma la proposta multiprodotto.',
  },
];

/* ── Capitolo 03 · il referto della misura ─────────────────────────────────
   NIENTE conteggio animato su questi numeri: mentre contava, la slide diceva
   «0 su 8 risposte nominano Trenitalia», l'esatto contrario del fatto. */
export const REFERTO: Stat[] = [
  { v: '7', su: 'su 8', l: 'trenitalia.com citato come fonte, su ChatGPT', s: 'va a prendere la risposta sui siti ufficiali, e il link dice «prenota con Trenitalia»' },
  { v: '2', su: 'su 8', l: 'trenitalia.com citato come fonte, su Google', s: 'la risposta si costruisce su rivenditori e aggregatori: Trainline, Rome2Rio, Omio — che vendono comunque i vostri biglietti' },
  { v: '0', su: 'su 8', l: 'errori sul marchio, su ChatGPT', s: 'Frecciarossa e Intercity attribuiti a Trenitalia, sempre' },
  { v: '2', su: 'su 8', l: 'errori sul marchio, su Google', s: 'le Frecce elencate come se fossero aziende in concorrenza con voi' },
];

export const KPI: Card[] = [
  { k: 'Presenza', t: 'Su quante domande comparite', b: 'Un punteggio di visibilità da misurare nel tempo, per mercato e per lingua, non una fotografia sola.' },
  { k: 'Confronto', t: 'Quanto, rispetto a chi entra adesso', b: 'La quota di voce rispetto agli altri operatori sulle stesse domande: è il numero che dice se si sta guadagnando o perdendo terreno.' },
  { k: 'Traffico', t: 'Quanto arriva davvero dagli assistenti', b: 'Le visite che nascono da una risposta generata, separate da quelle di ricerca: oggi, nella maggior parte delle aziende, finiscono indistinte nello stesso totale.' },
];

/* ── Capitolo 04 · quello che è già partito ────────────────────────────────
   Tre correzioni di fatto, tutte dalla stessa verifica del 12 ottobre 2026:
   le 1.700 destinazioni sono dell'offerta Trenitalia nel suo insieme e non di
   Busitalia da sola (sue parole, FS News del 9 ott 2025); la compagnia aerea si
   NOMINA, perché il protocollo è pubblico e l'ha firmato il suo Amministratore
   Delegato — chiamarla «la compagnia aerea» davanti a chi c'era suona evasivo;
   e il laboratorio ha una data precisa, il 9 marzo 2026. */
export const GIA: Card[] = [
  {
    k: 'Gomma',
    t: 'Busitalia, al 100%',
    b: 'La società di autolinee è interamente vostra: 10.300 collegamenti al giorno. L’offerta che integra treno, gomma e altri vettori arriva a più di 1.700 destinazioni — parole vostre, un anno fa.',
    fonti: ['busitalia'],
  },
  {
    k: 'Sosta',
    t: 'I parcheggi di stazione',
    b: 'Si prenotano dall’app, dal sito, in biglietteria e in agenzia, e si aggiungono a un biglietto già comprato fino al giorno prima: il pezzo di viaggio che comincia prima del treno.',
    fonti: ['fsPark'],
  },
  {
    k: 'Aria',
    t: 'Air-Rail dal 2023, un laboratorio dal 2026',
    b: 'Il biglietto integrato con ITA Airways è partito nel 2023. Dal 9 marzo 2026 c’è anche un laboratorio comune sull’intelligenza artificiale per l’intermodalità, firmato dai due Amministratori Delegati.',
    fonti: ['itaAirways'],
  },
];

/* ── Capitolo 04 · il viaggio comincia altrove ─────────────────────────── */
export const PRIMA: Card[] = [
  {
    k: 'Con chi',
    t: 'Partner del viaggio, e le società del Gruppo',
    b: 'Lo stesso meccanismo vale fra aziende diverse e fra società della stessa famiglia, che oggi guardano gli stessi clienti da finestre separate.',
  },
  {
    k: 'Dove sta il valore',
    t: 'Arrivare prima della scelta del vettore',
    b: 'Quando la decisione è «come arrivo», la partita è già giocata sul prezzo. Prima, si gioca sul viaggio.',
  },
  {
    k: 'La Cina, e il resto dell’Asia',
    t: 'Dove non si compra su un sito',
    b: 'Lì l’acquisto e il pagamento vivono dentro le applicazioni locali: è un canale, non una versione tradotta del vostro. Il numero di quel mercato sta nel capitolo sul contenuto.',
  },
];

/* ── Capitolo 05 · l'aritmetica ────────────────────────────────────────────
   I numeri sono i suoi, dichiarati al TTG dell'ottobre 2025, più la rete di
   terzi del Regionale. Prima c'era «4 mercati esteri presidiati»: nessuna fonte
   pubblica dice quattro, e un numero senza fonte su una slide di numeri è il
   primo che qualcuno chiede. */
export const MOLTIPLICATORI: Stat[] = [
  { v: '3', l: 'prodotti più i servizi', s: 'Alta Velocità, Intercity e Regionale: una squadra sola li vende tutti' },
  { v: '12.400', l: 'agenzie, in Italia e all’estero', s: '6.400 sul territorio italiano e 6.000 fuori, più la Cina dove le vendite sono raddoppiate nel 2025' },
  { v: '70.000', l: 'punti vendita di terzi', s: 'ricevitorie, bar, tabaccherie ed edicole che vendono i biglietti regionali' },
];

export const UNPOSTO: Card[] = [
  {
    k: 'Il tempo',
    t: 'Dal brief alla vetrina',
    b: 'Il numero da guardare non è quanto costa una variante, ma quanti giorni passano prima che sia davanti a un cliente. È lì che si perde una stagione.',
  },
  {
    k: 'Il marchio',
    t: 'Conforme senza una revisione a mano',
    b: 'Le regole del marchio stanno dentro lo strumento invece che in un documento che qualcuno dovrebbe ricordarsi di aprire.',
  },
  {
    k: 'Le persone',
    t: 'Le stesse, con meno passaggi a mano',
    b: 'La stessa squadra, più versioni in circolo nella stessa settimana. Nessun taglio: è il numero di versioni che cambia.',
  },
];

/* ── Capitolo 06 · il canale intermediato ──────────────────────────────────
   Il numero grande era «70.000 punti vendita raggiunti attraverso la piattaforma
   con cui le agenzie vi vendono». Sono due cose diverse messe insieme: i 70.000
   sono la rete di terzi che vende il REGIONALE (numero del 2014, ingresso delle
   ricevitorie Sisal), le agenzie di viaggio sono 12.400 e sono il suo canale.
   E il rifacimento della piattaforma, che era affermato, non ha una fonte
   pubblica: diventa una domanda, che in una Prospettiva vale più di un'asserzione. */
export const RETE = {
  numero: '12.400',
  dopo: 'agenzie di viaggio vendono i vostri biglietti: 6.400 in Italia e 6.000 all’estero, numeri vostri dell’ottobre 2025. Più di <strong>settantamila</strong> punti di terzi — ricevitorie, bar, tabaccherie, edicole — vendono il Regionale. Di tutto questo canale sapete quello che vi raccontano i conti.',
  dopoBreve: 'agenzie di viaggio vendono i vostri biglietti, 6.400 in Italia e 6.000 all’estero. Di questo canale sapete quello che vi raccontano i conti.',
  domanda:
    'PICO, la piattaforma con cui le agenzie vi vendono, è del 2011 e ha preso il posto di Sipax. Ci risulta che la stiate rifacendo: se è così, finché il capitolato è aperto la misura è una riga di requisiti; dopo è un progetto a sé. È una domanda, non un’affermazione.',
};

export const SAPERE: Card[] = [
  {
    k: 'Chi vende che cosa',
    t: 'Per rete, per agenzia, per prodotto',
    b: 'Dove la proposta multiprodotto arriva e dove si ferma al solo treno: è la misura diretta della vostra riorganizzazione commerciale.',
  },
  {
    k: 'Che cosa converte',
    t: 'Quale materiale vende, e quale resta nel cassetto',
    b: 'Il collegamento con il capitolo precedente: produrre meno varianti e più di quelle che funzionano.',
  },
  {
    k: 'Che cosa succede se…',
    t: 'Provare un’alternativa invece di deciderla',
    b: 'Una proposta diversa su una parte della rete, misurata per due settimane, prima di portarla a tutte. Su un sito si fa; su questo canale, per quanto ne sappiamo, no — ed è una delle cose che vorremmo chiedervi.',
  },
];

/* ── Capitolo 07 · il passo e le domande ───────────────────────────────────
   L'ask sta in un posto solo: due versioni della richiesta sono il modo più
   rapido di sembrare confusi davanti a un cliente. */
export const ASK = {
  eyebrow: 'Quello che vi chiediamo',
  titolo: 'Una sessione sui vostri dati,<br />mentre la piattaforma si rifà.',
  sub: 'Guardare insieme come vende la rete delle agenzie: che cosa sapete già, che cosa manca, e che cosa cambierebbe potendolo vedere. Mezza giornata, i vostri dati, nessun impegno dopo. <strong>Non è un progetto e non è un’offerta.</strong>',
  /** Che cosa serve davvero: «i vostri dati» non è un perimetro, e chi tiene la
   *  piattaforma commerciale lo chiede al primo giro. */
  servono:
    'Che cosa serve: un estratto delle vendite per agenzia e per prodotto, da chi tiene la piattaforma commerciale, nel formato che ha già. Se estrarlo costa più di mezza giornata, guardiamo quello che c’è.',
};

export const DOMANDE_APERTE = [
  'Del percorso intermodale, quanto è già deciso e quanto è ancora da disegnare?',
  'Quanta parte delle vendite passa dai vostri canali e quanta dagli intermediari, e quale dei due volete far crescere?',
  'Le biglietterie e il personale a bordo come entrano in questa idea di viaggio unico?',
  'Il materiale per i mercati esteri, in tutte le lingue: chi lo fa oggi?',
];

/* ── Servizi ───────────────────────────────────────────────────────────────
   `card(x, 'breve')` serve la versione corta dove c'è, quella lunga dove non
   c'è: così il taglio non può perdere una voce per distrazione. */
export const card = (c: Card, taglio: 'lungo' | 'breve' = 'lungo'): Card =>
  taglio === 'lungo' || !c.bBreve ? c : { ...c, b: c.bBreve };

/** Le fonti di una voce, pronte da rendere: `[{url, label}]`. */
export const fontiDi = (c: Pick<Card, 'fonti'>) => (c.fonti ?? []).map((k) => S[k]);
