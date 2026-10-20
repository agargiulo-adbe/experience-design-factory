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
import { SOURCES as S, type ChiaveFonte, type Fonte } from './sources';

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
  tag: 'Quattro punti in cui una vendita si perde prima che qualcuno salga sul treno.',
  /** La riga della slide-firma, identica nei due percorsi. */
  firma: 'Il passo dopo: mezza giornata sui dati della rete delle agenzie.',
};

/* ── Le teste di slide che i due percorsi condividono ─────────────────────
   Sembrano dettagli — un occhiello, un titolo, un lead — ed è esattamente lì
   che due percorsi divergono senza che nessuno se ne accorga: nessuno rilegge
   un titolo. Il lead ha una versione breve per il taglio; il titolo no, perché
   un titolo diverso vuol dire una slide diversa. */
export const TESTE = {
  contesto: {
    // 16 ott: la cornice è la parola che ha usato LUI al TTG il giorno prima.
    // Stava per diventare una quarta card, ma rompeva la griglia a tre ed era
    // comunque la cosa sbagliata: non è un quarto fattore, è il titolo dell'anno.
    titolo: 'Tre cose che capitano nello stesso anno',
    // 20 ott: il lead apriva ripetendo «internazionalizzazione», che adesso è la
    // slide precedente. Qui resta quello che quella parola vuol dire in concreto.
    lead: 'Il Frecciarossa in Germania dall’estate 2027 e a Berlino nel 2028, dopo Spagna e Francia; e mercati nuovi fra Asia, Sud America e Australia. Tutto questo arriva nell’anno in cui il mercato interno si allarga e il prezzo non sale.',
    leadBreve: 'Il Frecciarossa in Germania dal 2027 e a Berlino nel 2028: tutto nell’anno in cui il mercato si allarga e la leva del prezzo si chiude verso l’alto.',
  },
  mappa: {
    eyebrow: 'La mappa',
    titolo: 'Quattro punti, in ordine di percorso',
    lead: 'Sono anche i quattro capitoli che seguono. Se uno solo vi interessa, si va diretti lì: il resto si legge dopo, o non si legge.',
    leadBreve: 'Nel percorso intero sono quattro capitoli, uno per punto. Se uno vi interessa, si apre quello e il resto resta chiuso.',
  },
};

/* ── Capitolo 01 · la sua frase ────────────────────────────────────────────
   20 ott 2026: questa slide citava il TTG dell'OTTOBRE 2025 — il 96% del
   territorio non ancora esplorato, il 75% degli stranieri sul 4%, Busitalia.
   Fatti veri, ma di un anno fa, e le slide successive di questo stesso
   capitolo stavano già sul TTG 2026. Aprire un documento del 2026 con la
   dichiarazione dell'anno prima è il modo più rapido di farsi dire «quello lo
   dicevamo allora».

   Ora la slide sta sulle sue parole del 15 ottobre 2026, verificate
   sull'articolo riga per riga. Due cose, e sono le due che reggono tutto il
   deck: la parola dell'anno, e dove dice di stare investendo. Il secondo
   verbatim è il motivo per cui questo deck esiste — se investono sui canali
   diretti, dove quei canali perdono vendite è esattamente la domanda. */
export const APERTURA = {
  eyebrow: 'Rimini, TTG Travel Experience, 15 ottobre 2026',
  /** La parola che ha usato lui, grande quanto la pagina. */
  dato: 'Internazionalizzazione.',
  /** Sue parole, verbatim. */
  citazione:
    '«La parola chiave è internazionalizzazione: vogliamo rafforzare la collaborazione con i nostri <strong>partner</strong>.»',
  /** E la seconda metà della stessa intervista: dove dice di investire. */
  lettura:
    'E, nella stessa intervista: «stiamo investendo significativamente nell’evoluzione dei nostri <strong>canali digitali diretti</strong>, in particolare nell’app e nel sito web».',
  letturaBreve:
    'E, nella stessa intervista, sugli investimenti: «i nostri <strong>canali digitali diretti</strong>, in particolare nell’app e nel sito web».',
  /** La riga di fonte, identica nei due percorsi: il link lo mette la pagina,
   *  le parole stanno qui — scritte a mano in due posti, divergevano. */
  fonte: {
    prima: 'Le sue parole, al TTG di quest’anno:',
    dopo: 'I mercati che ha indicato: Europa e Nord America, «ma anche quelli emergenti per noi, come Asia, Sud America e Australia».',
  },
};

/* ── Capitolo 01 · i tre orologi ───────────────────────────────────────────
   Le prime due versioni di questa slide si contraddicevano da sole: una carta
   diceva «il piano industriale annunciato a settembre», l'altra «il piano è
   atteso entro la fine dell'anno». A settembre è stato annunciato che il piano
   ARRIVERÀ: una cosa sola, in due carte, senza contraddirsi. */
export const CONTESTO: Card[] = [
  {
    /* 16 ott: la concorrenza non arriva solo dai binari. Il 13 maggio la
       Commissione ha proposto che chi ha metà del mercato domestico venda
       sulla propria piattaforma anche i treni degli altri — è il tema di
       disintermediazione che tocca davvero questa stanza, perché riguarda la
       sua vetrina e non un rivenditore. ⚠️ È una proposta, e la slide lo dice. */
    k: 'Il mercato',
    t: 'Un concorrente in più, e una vetrina da aprire',
    b: 'Sull’alta velocità oggi siete in due: SNCF ha il via libera dal 7 marzo 2026 e dichiara di volere il 15% entro il 2030. E a maggio la Commissione ha proposto che chi ha metà del mercato domestico venda sulla propria piattaforma anche i treni degli altri.',
    bBreve: 'Sull’alta velocità siete in due, e la Commissione ha proposto che chi ha metà del mercato venda sulla propria piattaforma anche i treni degli altri.',
    fonti: ['sncfVialibera', 'sncf', 'ueTicketing'],
  },
  {
    k: 'Il prezzo',
    t: 'Una leva che si muove da sola',
    b: 'Il revenue management sull’alta velocità lo fate da anni, e lavora. È cambiato il tetto: i biglietti non aumenteranno, lo ha dichiarato il vertice del Gruppo a settembre. Verso l’alto la leva è chiusa.',
    bBreve: 'Il revenue management lavora già. È cambiato il tetto: il vertice del Gruppo ha dichiarato che i biglietti non aumenteranno.',
    fonti: ['prezziFermi'],
  },
  {
    k: 'Il momento',
    t: 'Un piano in scrittura, un sito in rifacimento',
    b: 'Il nuovo piano industriale di Gruppo arriva entro la fine dell’anno. E l’avete detto voi al TTG: l’app è nuova da maggio, il sito arriva entro marzo 2027. Quello che si decide adesso entra lì dentro; il resto diventa un progetto a parte.',
    bBreve: 'Il piano di Gruppo arriva entro fine anno e il nuovo sito entro marzo 2027: quello che si decide adesso entra lì dentro.',
    fonti: ['piano', 'ttgSales2026', 'monaco'],
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
  /** La premessa sta nell'occhiello, non nel titolo: è contesto, e finché occupava
   *  il posto della domanda la domanda arrivava in terza riga, dietro due
   *  subordinate e una doppia relativa. Qui sopra sta il fatto, sotto la domanda. */
  eyebrow: 'Il prezzo si muove già da sé, e più in alto non va',
  titolo: 'Allora dove si perdono le vendite?',
  sub: 'Ha quattro risposte, e stanno in quattro punti diversi del percorso che una persona fa prima di salire su un treno.',
  subBreve: 'Ha quattro risposte, in quattro punti diversi del percorso che una persona fa prima di salire su un treno.',
  perimetri:
    'Due di questi quattro punti non si decidono in questa stanza: dal settembre 2025 il percorso di acquisto sta in Customer Operations, marca e prezzo nel marketing. Lo scriviamo noi, e quello che vi chiediamo alla fine resta tutto dentro il vostro perimetro.',
};

export interface Punto { n: string; dove: string; t: string; b: string; bBreve: string }
export const PUNTI: Punto[] = [
  {
    /* 16 ott: il punto 01 copre adesso anche il secondo tempo di quel canale,
       perché il capitolo 03 lo contiene. La mappa e i capitoli devono dire la
       stessa cosa: è la prima a essere letta e l'ultima a essere ricordata. */
    n: '01',
    dove: 'Prima del sito',
    t: 'Nella risposta che qualcun altro scrive',
    b: 'Chi organizza un viaggio chiede a un assistente, e riceve una risposta che cita qualcuno. Se non siete voi, la vendita è persa prima che una vostra pagina si apra. E quel canale sta diventando anche un posto dove si compra.',
    bBreve: 'Chi organizza un viaggio chiede a un assistente, e la risposta cita qualcuno. Se non siete voi, la vendita è persa prima che si apra una vostra pagina.',
  },
  {
    n: '02',
    dove: 'Dentro l’offerta',
    t: 'Nel momento in cui il viaggio torna a essere un biglietto',
    b: 'Treno, autobus, sosta e volo sono già nella vostra offerta, e da ieri c’è anche la crociera. Nel momento in cui compra, però, chi sta componendo un viaggio è indistinguibile da chiunque altro.',
    bBreve: 'Treno, autobus, sosta e volo sono già nella vostra offerta. Chi sta componendo un viaggio, nel momento in cui compra, è indistinguibile da chiunque altro.',
  },
  {
    n: '03',
    dove: 'A valle',
    t: 'Nel materiale che non si riesce a produrre',
    b: 'Una squadra sola vende tre prodotti più i servizi, su più mercati e in più lingue. Il materiale da produrre si moltiplica, e a mano non si tiene il passo.',
    bBreve: 'Una squadra sola vende tre prodotti su più mercati e più lingue. Il materiale si moltiplica, e a mano non si tiene il passo.',
  },
  {
    n: '04',
    dove: 'Nel canale che è vostro',
    t: 'In 12.400 agenzie che non vi rispondono',
    b: 'La rete intermediata vende ogni giorno. Non sapete quali agenzie vendono che cosa, dove si ferma la proposta multiprodotto, quale materiale funziona.',
    bBreve: 'La rete intermediata vende ogni giorno. Non sapete chi vende che cosa, né dove si ferma la proposta multiprodotto.',
  },
];

/* ── Capitolo 03 · il referto della misura ─────────────────────────────────
   NIENTE conteggio animato su questi numeri: mentre contava, la slide diceva
   «0 su 8 risposte nominano Trenitalia», l'esatto contrario del fatto. */
export const REFERTO: Stat[] = [
  { v: '7', su: 'su 8', l: 'Fonte citata · ChatGPT', s: 'trenitalia.com fra le fonti: va a prendere la risposta sui siti ufficiali, e il link dice «prenota con Trenitalia»' },
  { v: '2', su: 'su 8', l: 'Fonte citata · Google', s: 'trenitalia.com fra le fonti: la risposta si costruisce su rivenditori e aggregatori (Trainline, Rome2Rio, Omio), che vendono comunque i vostri biglietti' },
  { v: '0', su: 'su 8', l: 'Errori sul marchio · ChatGPT', s: 'Frecciarossa e Intercity attribuiti a Trenitalia, sempre' },
  { v: '2', su: 'su 8', l: 'Errori sul marchio · Google', s: 'le Frecce elencate come se fossero aziende in concorrenza con voi' },
];

export const KPI: Card[] = [
  { k: 'Presenza', t: 'Su quante domande comparite', b: 'Un punteggio di visibilità da misurare nel tempo, per mercato e per lingua, non una fotografia sola.' },
  /* 16 ott, SECONDA versione. La prima diceva che i rivenditori «si prendono la
     relazione», cioè li trattava da minaccia. La verifica ha smontato la
     premessa, e il cliente avrebbe avuto in mano i numeri per smontarla in
     sala: la Commissione europea scrive che la grande maggioranza delle ricerche
     e delle vendite si concentra sui canali propri degli operatori e che le
     piattaforme terze pesano poco (90% delle visite su Bahn.de, 80-90% del
     venduto online diretto per Renfe e SNCF Connect). Lo dice anche il
     rivenditore: il suo country manager francese si lamenta che molti lo usano
     per confrontare e poi comprano sul sito dell'operatore. E soprattutto
     Trenitalia QUEI TERZI LI CORTEGGIA — pagina pubblica «diventa agenzia
     partner», sei piattaforme, provvigioni pubblicate, invito esplicito ai
     metasearch. Non è un nemico: è un canale che pagano a tariffa nota.
     Quello che resta vero, e che è un argomento di margine e non di furto: se
     nella risposta generata comparite tramite un rivenditore invece che da voi,
     quella vendita la pagate in commissione. */
  { k: 'Confronto', t: 'Con chi entra, e attraverso chi passate', b: 'Quota di voce rispetto agli altri operatori e ai rivenditori: comparire tramite loro è pagare in commissione una vendita che poteva arrivare diretta.' },
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
    /* 16 ott: Busitalia porta anche City Sightseeing, rilevata a gennaio, e i
       progetti per il turismo congressuale presentati al TTG. Stanno qui e non
       in una quarta card: la griglia è a tre, e provata a quattro si rompe. */
    k: 'Gomma',
    t: 'Busitalia, al 100%, e quello che ci ha portato dentro',
    b: 'La società di autolinee è interamente vostra: 10.300 collegamenti al giorno, e un’offerta che arriva a più di 1.700 destinazioni. Da gennaio porta anche City Sightseeing, e al TTG avete presentato i progetti per il turismo congressuale.',
    bBreve: 'Busitalia è interamente vostra: 10.300 collegamenti al giorno e più di 1.700 destinazioni. Da gennaio porta anche City Sightseeing.',
    fonti: ['busitalia', 'ttgOfferta'],
  },
  {
    k: 'Sosta',
    t: 'I parcheggi di stazione',
    b: 'Si prenotano dall’app, dal sito, in biglietteria e in agenzia. E si aggiungono a un biglietto già comprato, fino al giorno prima: è il pezzo di viaggio che comincia prima del treno.',
    fonti: ['fsPark'],
  },
  {
    /* 17 ott: in riunione era girato il dubbio che l'accordo aereo fosse in
       scadenza. Verificato: il memorandum del 9 marzo 2026 non scade — quello
       che finisce il 1° luglio 2026 è l'accordo di vendita LATAM × Trenitalia, e
       quei passeggeri vengono riprotetti su voli ITA. Verificando è però uscito
       il fatto che conta qui, e che la card non può tacere: a maggio la stessa
       compagnia ha firmato lo stesso tipo di intesa con Italo. L'asset c'è, ma
       non è esclusivo, ed è il motivo per cui va governato. */
    k: 'Aria',
    t: 'Air-Rail dal 2023, e un laboratorio comune',
    b: 'Il biglietto integrato con ITA Airways è partito nel 2023. Il 9 marzo 2026 i due Amministratori Delegati hanno firmato un memorandum per un laboratorio comune sull’intelligenza artificiale. A maggio la stessa compagnia ha firmato anche con Italo: biglietto unico treno più aereo, in vendita da luglio.',
    bBreve: 'Il biglietto integrato con ITA Airways è partito nel 2023, e a marzo è nato un laboratorio comune sull’intelligenza artificiale. A maggio la stessa compagnia ha firmato anche con Italo.',
    fonti: ['itaAirways', 'itaItalo'],
  },
];

/* ── Capitolo 04 · il viaggio comincia altrove ─────────────────────────── */
export const PRIMA: Card[] = [
  {
    // 16 ott: non più «un partner del viaggio» generico. Ne hanno firmato uno
    // ieri, in pubblico, e il deck lo nomina con la sua fonte.
    k: 'Con chi, adesso',
    t: 'Quello che avete appena firmato',
    b: 'Il protocollo con Costa Crociere, presentato al TTG il 15 ottobre, porta la vostra offerta dentro la loro piattaforma e dal 2027 collega i due sistemi di prenotazione. È il caso da cui partire: ha una data, e il perimetro l’avete scelto voi.',
    bBreve: 'Il protocollo con Costa, presentato al TTG il 15 ottobre, collega i due sistemi di prenotazione dal 2027. È il caso da cui partire.',
    fonti: ['costaTtg'],
  },
  {
    k: 'Dove sta il valore',
    t: 'Arrivare prima della scelta del vettore',
    b: 'Chi ha già scelto data e tratta confronta solo il prezzo. Chi ha prenotato una crociera da Genova sta ancora decidendo come arrivarci, e oggi non lo sapete.',
    bBreve: 'Chi ha già scelto data e tratta confronta solo il prezzo. Chi sta ancora decidendo, no.',
  },
  {
    /* 16 ott. La card diceva «lì non si compra su un sito», come se fosse un
       fenomeno da spiegare a loro. Verificato sulla LORO pagina: ci sono già
       dentro e ci vendono dal 2025 — mini-program WeChat che vende, account
       che informa, e nessun sito in cinese (le rotte /zh, /cn, /chi danno 404).
       Dire a un cliente una cosa che lui ha già fatto, come se fosse un'idea
       nostra, è il modo più rapido di perdere la stanza. Quindi la card parte
       da lì e sposta la domanda su quello che manca: i dati di quel canale.

       ⚠️ NON si propone di attivare su WeChat con la nostra tecnologia, e la
       ragione è contrattuale, non tecnica: nei termini generali Adobe la Cina
       continentale è un «Restricted Country», e l'elenco dei servizi ammessi
       non comprende la piattaforma né l'orchestrazione. Esiste dal 2 ottobre
       2026 il modo di trattare un canale non nativo come WeChat dentro
       l'orchestrazione, ma dove girano quei dati è una domanda da legale, non
       da slide. Qui si dice il fatto e si lascia la domanda aperta. */
    k: 'La Cina, dove siete già',
    t: 'Vendete dentro WeChat dal 2025',
    b: 'Non c’è un vostro sito in cinese: c’è un mini-program che vende Frecce, Intercity e regionali. Le vendite su quel mercato sono raddoppiate in un anno, e quello che quel canale sa di chi compra resta lì.',
    bBreve: 'Non c’è un sito in cinese: c’è un mini-program che vende, e le vendite su quel mercato sono raddoppiate in un anno.',
    fonti: ['trenitaliaCinese', 'fsCina'],
  },
];

/* ── Capitolo 03 · il secondo tempo dello stesso canale ───────────────────
   Deciso il 16 ott, dopo due riunioni e una verifica.

   PERCHÉ STA QUI e non nel capitolo del viaggio, dove era finito prima: in una
   riunione con la società tecnologica del Gruppo il confine è stato tirato da
   loro, non da noi — la visibilità «nel conversazionale puro, fuori dal sito»
   è una cosa, la «multicanalità di vendita che include la messaggistica» è
   un'altra. Il canale proprietario interviene quando il cliente ha GIÀ scelto
   Trenitalia; l'assistente generalista interviene PRIMA, mentre sta ancora
   decidendo. Questo capitolo è quello del «prima», quindi è qui che la vendita
   dentro l'assistente appartiene.

   PERCHÉ NON È UNA NOSTRA IDEA: alla stessa riunione hanno dichiarato che
   «acquistare direttamente dai canali agentici» è una delle ambizioni e dei
   pilastri su cui stanno già lavorando. La slide parte da lì, non da noi.

   ⚠️ VINCOLI VERIFICATI il 16 ott, nessuno negoziabile.
   · Il prodotto si chiama LLM Apps ed È annunciato pubblicamente: una frase nel
     comunicato Adobe del 20 aprile 2026. Si nomina citando QUELLA fonte, e
     nient'altro: tutto il resto che sappiamo è materiale interno.
   · NON è in general availability. In riunione si era detto il contrario.
   · Prerequisito dichiarato: AEM Sites, che loro hanno.
   · Nessun cliente citabile: non se ne nomina nessuno.
   · La cautela che il materiale interno scrive contro sé stesso, e che va detta
     prima perché è la prima obiezione di chi capisce: oggi gli assistenti non
     scoprono da soli questi collegamenti. Esporsi non basta. */
export const CANALE: Card[] = [
  {
    k: 'La vostra ambizione',
    t: 'Vendere dentro i canali agentici',
    b: 'Non è una proposta nostra: è uno dei pilastri che avete dichiarato di avere in lavorazione. Il sito e l’app portano l’ottanta per cento dei ricavi, e il canale dove si decide oggi non è ancora un canale dove si vende.',
  },
  {
    k: 'Che cosa cambia',
    t: 'La risposta diventa anche il banco',
    b: 'Chi chiede «come arrivo a Matera senza auto» oggi riceve una risposta e poi va altrove a comprare. Il passo che si sta aprendo è chiudere lì: scegliere l’orario e confermare senza uscire dalla conversazione.',
  },
  {
    /* 17 ott, due passate. Prima la card non nominava il prodotto (residuo di
       quando lo credevo non annunciato). Poi è uscito dalla slide lo STATO di
       disponibilità: il nome e il concetto bastano in sala, e a che punto è il
       prodotto è una cosa che diciamo a voce, non una riga che il deck si porta
       in giro per i corridoi del cliente. Resta a verbale: annunciato il
       20 aprile 2026 come capacità di AEM, non ancora in disponibilità generale. */
    k: 'Dove si innesta',
    t: 'Si chiama LLM Apps',
    b: 'Vive dentro Experience Manager, la piattaforma che avete già: porta la vostra offerta dentro la conversazione, e il viaggiatore prenota lì. Una cosa da guardare insieme mentre si decide dove mettere il canale.',
  },
];

/* ── Capitolo 05 · l'aritmetica ────────────────────────────────────────────
   I numeri sono i suoi, dichiarati al TTG dell'ottobre 2025, più la rete di
   terzi del Regionale. Prima c'era «4 mercati esteri presidiati»: nessuna fonte
   pubblica dice quattro, e un numero senza fonte su una slide di numeri è il
   primo che qualcuno chiede. */
export const MOLTIPLICATORI: Stat[] = [
  { v: '3', l: 'prodotti più i servizi', s: 'Alta Velocità, Intercity e Regionale: una squadra sola li vende tutti' },
  { v: '12.400', l: 'agenzie, in Italia e all’estero', s: '6.400 sul territorio italiano e 6.000 fuori: numeri vostri, ottobre 2025' },
  { v: '70.000', l: 'punti vendita fuori dalle biglietterie', s: 'tabaccherie, bar, edicole, ricevitorie e self service sul Regionale: dato del 2014, da aggiornare insieme' },
];

export const UNPOSTO: Card[] = [
  {
    k: 'Il tempo',
    t: 'Dal brief alla vetrina',
    b: 'Non quanto costa una variante, ma dopo quanti giorni è davanti a un cliente: lì si perde una stagione.',
  },
  {
    k: 'Il marchio',
    t: 'Conforme senza una revisione a mano',
    b: 'Le regole del marchio stanno dentro lo strumento, non in un documento che qualcuno deve ricordarsi di aprire.',
  },
  {
    k: 'Le persone',
    t: 'Le stesse, con meno passaggi a mano',
    b: 'Le persone restano le stesse: cambia quante versioni riescono a far uscire in una settimana.',
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
  dopo: 'agenzie di viaggio vendono i vostri biglietti: 6.400 in Italia e 6.000 all’estero, numeri vostri dell’ottobre 2025. Più di <strong>settantamila</strong> sono i punti vendita fuori dalle biglietterie (tabaccherie, bar, edicole, ricevitorie), che vendono il Regionale: è un dato del 2014. Di tutto questo canale sapete quello che vi raccontano i conti.',
  dopoBreve: 'agenzie di viaggio vendono i vostri biglietti, 6.400 in Italia e 6.000 all’estero. Di questo canale sapete quello che vi raccontano i conti.',
  domanda:
    // 15 ott — PICO esce dal deck. Diceva «ci risulta che la stiate rifacendo»:
    // di quel rifacimento NON ESISTE FONTE PUBBLICA (riverificato il 15 ott: si
    // trovano una manutenzione programmata dei canali agenzie e il pricing
    // dinamico di gennaio, nessun rifacimento annunciato), e «ci risulta»
    // ammette per iscritto di avere una fonte che non possiamo citare. Chiedere
    // proprio quello, proprio a loro, fa arrivare «chi ve l'ha detto?»: non è un
    // rischio, è la domanda naturale, e si risponde male. In più non è il suo
    // cantiere — il percorso di acquisto sta in un'altra direzione da settembre
    // 2025 — quindi gli si chiedeva di commentare il lavoro di un collega.
    // Tolto anche «finché il capitolato è aperto»: presumeva una gara in corso
    // di cui non abbiamo prova. L'argomento regge senza: 12.400 agenzie che
    // vendono ogni giorno e una misura che non c'è. Il «quando conviene farlo»
    // resta, ma come principio sui sistemi, non come informazione su di loro.
    'Misurare un canale costa poco mentre si mette mano al sistema che lo serve, e diventa un progetto a sé dopo. Del canale intermediato, oggi che cosa riuscite a vedere?',
};

/* 20 ott: il blocco era scarno e il valore non si vedeva — tre righe che
   dicevano che cosa si misura, nessuna che dicesse che cosa se ne ricava.
   Ora ogni voce porta la conseguenza, e «che cosa converte» dice di QUALI
   contenuti parla: in agenzia la carta esiste ancora, e tanta. Tenerla fuori
   avrebbe fatto sembrare la proposta un discorso da sito web fatto a chi
   stampa locandine. */
export const SAPERE: Card[] = [
  {
    k: 'Chi vende che cosa',
    t: 'Per rete, per agenzia, per prodotto',
    b: 'È la misura diretta della riorganizzazione commerciale: dove la proposta multiprodotto arriva, e dove si ferma al solo treno. Da lì si vede su quali agenzie insistere, e quali vendono un prodotto solo perché nessuno ha dato loro gli altri.',
    bBreve: 'È la misura diretta della riorganizzazione commerciale: dove la proposta multiprodotto arriva, e dove si ferma al solo treno.',
  },
  {
    k: 'Che cosa converte',
    t: 'Quale materiale vende, e quale resta nel cassetto',
    b: 'Digitale e cartaceo insieme. Le schede prodotto e le email, ma anche le locandine, le brochure e il materiale da banco: in agenzia si stampa ancora, e molto. Di nessuno dei due si sa oggi che cosa ha venduto. È il collegamento con il capitolo precedente: produrne meno, e più di quelli che funzionano.',
    bBreve: 'Digitale e cartaceo: schede ed email, ma anche brochure e materiale da banco. Produrne meno, e più di quelli che funzionano.',
  },
  {
    k: 'Che cosa succede se…',
    t: 'Provare un’alternativa invece di deciderla',
    b: 'Una proposta diversa su una parte della rete, misurata per due settimane, prima di portarla a tutte. Su un sito si fa; su questo canale, per quanto ne sappiamo, no. E una campagna sbagliata su 12.400 agenzie si scopre a stagione finita.',
    bBreve: 'Una proposta diversa su una parte della rete, misurata due settimane prima di portarla a tutte. Su un sito si fa; qui, per quanto ne sappiamo, no.',
  },
];

/* ── Capitolo 07 · il passo e le domande ───────────────────────────────────
   L'ask sta in un posto solo: due versioni della richiesta sono il modo più
   rapido di sembrare confusi davanti a un cliente. */
export const ASK = {
  eyebrow: 'Quello che vi chiediamo',
  // «mentre la piattaforma si rifà» affermava come fatto, nel titolo dell'ask e
  // su entrambi i percorsi, ciò che la slide del capitolo 06 poneva come
  // domanda — e quel fatto non ha fonte pubblica. Uscito il 15 ott.
  titolo: 'Una sessione sui vostri dati,<br />prima di qualunque progetto.',
    // Le tre «che cosa» sono la formula che il panel ha messo fra le cose da NON
  // toccare: cinque personas su sei la citano come la riga che fa accettare la
  // riunione. Il ritmo è voluto, non è una frase contorta — eccezione dichiarata.
  sub: 'Guardare insieme come vende la rete delle agenzie: che cosa sapete già, che cosa manca, e che cosa cambierebbe potendolo vedere. Mezza giornata, i vostri dati, nessun impegno dopo. <strong>Non è un progetto e non è un’offerta.</strong>',  // copy-audit-ignore
  /** Che cosa serve davvero: «i vostri dati» non è un perimetro, e chi tiene la
   *  piattaforma commerciale lo chiede al primo giro. */
  servono:
    'Che cosa serve: un estratto <strong>aggregato</strong> delle vendite per agenzia e per prodotto, nel formato che la piattaforma ha già. Il periodo lo scegliete voi, e vale l’accordo di riservatezza come per qualunque altro dato. Se estrarlo costa più di mezza giornata, guardiamo quello che c’è.',
};

export const DOMANDE_APERTE = [
  'Quanta parte delle vendite passa dai vostri canali e quanta dagli intermediari, e quale dei due volete far crescere?',
  'Quale dato esiste oggi per rete e per agenzia, e chi lo possiede?',
  'Del percorso intermodale, quanto è già deciso e quanto è ancora da disegnare?',
  'Il materiale per i mercati esteri, in tutte le lingue: chi lo fa oggi?',
];

/* ── Che cosa serve, concretamente ─────────────────────────────────────────
   Chiesto in riunione il 20 ott 2026, e vale per OGNI idea del deck: una
   Prospettiva che non dice con che cosa si fa una cosa lascia la stanza con
   l'impressione che si debba comprare tutto da capo. Qui si dice il contrario,
   ed è vero — ed è vero più di quanto pensassimo prima di leggere il contratto.

   TRE STATI, e non due: la terza riga esiste perché l'accordo quadro ha una
   sezione che fissa il prezzo di prodotti NON ancora acquistati. Dire «si
   aggiunge» di una cosa che ha già il suo prezzo nel loro contratto sarebbe
   falso in difetto.
   · `avete`  — licenziato oggi: qui si estende a un uso nuovo;
   · `prezzo` — non licenziato, ma con prezzo già fissato nell'accordo quadro;
   · `nuovo`  — non c'è, e va aggiunto.

   LETTO SUL CONTRATTO, non a memoria. La copia sta nella cartella d'account,
   che è git-ignorata, e qui non se ne riportano gli estremi: il repo è pubblico.
   · Licenziato: Analytics, Experience Manager Sites, Commerce, Journey
     Optimizer, Target; più le postazioni Creative Cloud e Acrobat.
   · Le postazioni Creative Cloud portano con sé la copertura Firefly: Firefly
     NON è tutto da comprare, e dirlo incrementale sarebbe un errore nostro.
   · A prezzo bloccato: Workfront, Experience Manager Assets, Forms, Dynamic
     Media, spazio, e volumi aggiuntivi di Target e Analytics.
   · Experience Manager Assets risulta poi acquistato: sta in `avete`.
   · NON compare da nessuna parte: Customer Journey Analytics, Real-Time CDP
     Collaboration, GenStudio, CX Enterprise Coworker, Brand Visibility. Quelli
     sono `nuovo`, senza sfumature.

   In slide vanno i NOMI, mai il contratto: niente importi, quantità, scadenze,
   numero di postazioni. Il contratto è la ragione per cui la pastiglia dice
   quello che dice, non una cosa da proiettare.

   Il blocco vive DENTRO «Che cosa serve, concretamente», cioè dietro il
   drill-down: in sala si apre se qualcuno chiede, e intanto non appesantisce
   una slide che deve reggere da sola. */
export type Stato = 'avete' | 'prezzo' | 'nuovo';
export interface Pezzo {
  nome: string;
  /** La fonte pubblica del prodotto: il nome in slide è un link verificabile. */
  fonte?: ChiaveFonte;
  stato: Stato;
  /** A che cosa serve QUI, in una riga. Non la scheda del prodotto. */
  a: string;
}

export const LEGENDA: Record<Stato, { eti: string; spiega: string }> = {
  avete: { eti: 'già vostro', spiega: 'nel contratto' },
  prezzo: { eti: 'prezzo già fissato', spiega: 'nell\u2019accordo quadro' },
  nuovo: { eti: 'si aggiunge', spiega: 'oggi non c\u2019\u00e8' },
};

export const SERVE: Record<
  'visibilita' | 'canale' | 'acquisto' | 'collaborazione' | 'contenuto' | 'rete',
  Pezzo[]
> = {
  visibilita: [
    { nome: 'Adobe Brand Visibility', fonte: 'brandVisibility', stato: 'nuovo', a: 'la misura, e le pagine che mancano' },
    { nome: 'Adobe Experience Manager', fonte: 'aem', stato: 'avete', a: 'dove le pagine già nascono' },
  ],
  canale: [
    { nome: 'Adobe Experience Manager', fonte: 'aem', stato: 'avete', a: 'la base su cui si innesta' },
    { nome: 'LLM Apps', fonte: 'llmApps', stato: 'nuovo', a: 'l\u2019offerta dentro l\u2019assistente' },
  ],
  acquisto: [
    { nome: 'Adobe Analytics', fonte: 'analytics', stato: 'avete', a: 'il punto di partenza' },
    { nome: 'Customer Journey Analytics', fonte: 'cja', stato: 'nuovo', a: 'il percorso per intero' },
    { nome: 'Adobe Target', fonte: 'target', stato: 'avete', a: 'provare una proposta diversa' },
  ],
  collaborazione: [
    { nome: 'Adobe Real-Time CDP Collaboration', fonte: 'rtcdpCollab', stato: 'nuovo', a: 'il luogo neutro dell\u2019incrocio' },
    { nome: 'Adobe Analytics', fonte: 'analytics', stato: 'avete', a: 'il vostro lato dell\u2019incrocio' },
  ],
  contenuto: [
    { nome: 'Adobe Experience Manager Assets', fonte: 'aemAssets', stato: 'avete', a: 'il materiale e le sue versioni' },
    { nome: 'Adobe Firefly', fonte: 'firefly', stato: 'avete', a: 'le immagini, già nelle postazioni Creative Cloud' },
    { nome: 'Adobe Workfront', fonte: 'workfront', stato: 'prezzo', a: 'chi chiede, chi produce, chi approva' },
    { nome: 'Adobe GenStudio for Performance Marketing', fonte: 'genstudio', stato: 'nuovo', a: 'le varianti di campagna' },
    { nome: 'CX Enterprise Coworker', fonte: 'coworker', stato: 'nuovo', a: 'il lavoro agentico sulla produzione' },
  ],
  rete: [
    { nome: 'Adobe Analytics', fonte: 'analytics', stato: 'avete', a: 'la misura che già usate' },
    { nome: 'Customer Journey Analytics', fonte: 'cja', stato: 'nuovo', a: 'il venduto per rete e per agenzia' },
    /* 20 ott: Target torna nominabile QUI. Il verdetto del panel del 12 ott
       riguardava il nominarlo «fra i requisiti della nuova piattaforma» \u2014 un
       fornitore che si autonomina dentro un capitolato \u00e8 un tema di procurement.
       Questo blocco \u00e8 un'altra cosa: \u00e8 che cosa serve alla NOSTRA proposta, e
       tacerlo proprio dove il cliente chiede i prodotti sarebbe reticenza. */
    { nome: 'Adobe Target', fonte: 'target', stato: 'avete', a: 'provare su una parte della rete' },
  ],
};

/* ── Servizi ───────────────────────────────────────────────────────────────
   `card(x, 'breve')` serve la versione corta dove c'è, quella lunga dove non
   c'è: così il taglio non può perdere una voce per distrazione. */
export const card = (c: Card, taglio: 'lungo' | 'breve' = 'lungo'): Card =>
  taglio === 'lungo' || !c.bBreve ? c : { ...c, b: c.bBreve };

/** Le fonti di una voce, pronte da rendere: `[{url, label}]`. */
export const fontiDi = (c: Pick<Card, 'fonti'>): Fonte[] => (c.fonti ?? []).map((k) => S[k]);
