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
  /** La riga che si proietta sotto la finestra, quando quella del drill-down è troppo lunga. */
  bSlide?: string;
  /**
   * L'ancora della voce dentro il «Scopri come»: nomina il MECCANISMO che la
   * figura mostra, non il concetto della slide. Se ripetesse `t` il dettaglio
   * direbbe due volte la stessa cosa — e la figura, che è lì per far vedere
   * come funziona, resterebbe senza nome. Sei parole al massimo.
   */
  anc?: string;
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
  tag: 'Come vendere di\u00a0più, dalla ricerca online fino all’agenzia.',
  /** La riga della slide-firma, identica nei due percorsi. */
  firma: 'Da quale cominciare lo decidiamo insieme.',
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
    titolo: 'Il 2027 si prepara adesso',
    // 20 ott: il lead apriva ripetendo «internazionalizzazione», che adesso è la
    // slide precedente. Qui resta quello che quella parola vuol dire in concreto.
  },
  mappa: {
    eyebrow: 'La mappa',
    titolo: 'Quattro idee, in ordine di percorso',
    // Il lead era due righe e, con il drill-down aperto a 1280×800, erano le
    // due righe che facevano sforare la safe-area. La seconda metà — «se
    // uno solo vi interessa si va diretti lì» — è un'istruzione d'uso: sta
    // nel blocco che si apre, non addosso a chi parla.
    lead: 'Ogni idea dice che cosa c’è già nel Gruppo e che cosa si aggiunge, per\u00a0lavorare insieme alla piattaforma del dato di\u00a0cliente annunciata a\u00a0marzo.',
    leadBreve: 'Nel percorso intero sono quattro capitoli, uno per punto.',
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
/* ── Capitolo 01 · il mercato che resta ───────────────────────────────────
   3 nov 2026, RIMESSA. Questa slide era sparita il 20 ottobre insieme al resto
   del TTG 2025, per una ragione giusta — aprire un documento del 2026 con la
   dichiarazione dell'anno prima invita a sentirsi dire «quello lo dicevamo
   allora». Ma togliendola sono sparite due cose che non dovevano sparire:
   la grandezza commerciale di cui parla tutto il deck, e **l'apertura che
   abbiamo concordato col cliente** — l'agenda mandata alla segreteria il
   9 ottobre dice, parola per parola, «Apertura con una sua frase: il 75% degli
   stranieri si ferma nel 4% del territorio, il 96% è il mercato che resta».
   Una revisione interna del 3 novembre ha notato che il capitolo annunciava
   quel numero e non lo diceva più. Aveva ragione.
   La vecchiaia del dato si gestisce come prescrive la regola: **la data in
   chiaro**, e subito dopo le sue parole del 2026, che mostrano che il filo è
   ancora teso.
   ⚠️ DUE FONTI DIVERSE, E NON SI MESCOLANO. Il 96% è SUO, verbatim
   (L'Agenzia di Viaggi, 13 ott 2025). Il 75%/4% è un dato di contesto che
   circola attorno al suo intervento (Travel Quotidiano, 15 ott 2025): va come
   dato, mai fra virgolette e mai attribuito a lui. L'ANSA del 9 ottobre, che
   una versione precedente citava per tutti e tre, non ne contiene nessuno. */
export const MERCATO = {
  eyebrow: 'Rimini, TTG Travel Experience, ottobre 2025',
  /** Le due zone della figura. Il 96% è SUO, e l'etichetta lo attribuisce
   *  senza aprire un blocco di citazione: in XD le parole sono poche. */
  /* ⚠️ 6 nov 2026, panel: l'etichetta diceva «dove si concentra oggi la
     domanda estera», e proiettata suona come se il 100% della domanda estera
     stesse sul 4%. I tre quarti stavano solo nel titolo. La cifra deve
     reggere da sola: chi guarda legge il numero e la sua riga, non il
     titolo sopra. E il 96% è SUO, dell'ottobre 2025: la data in chiaro. */
  quota: { n: '4%', l: 'il territorio su cui si ferma il 75% dei visitatori stranieri' },
  /* ⚠️ 6 nov 2026, SECONDO GIRO DEL PANEL: qui era finita una citazione
     fabbricata — «il mercato che resta» fra virgolette e attribuito a lui —
     nata da una correzione del primo giro che voleva solo datare il dato. Il
     verbatim è un altro, ed è l'errore che riconosce per primo l'uomo che
     quella frase l'ha detta. Le virgolette stanno solo attorno alle parole
     che la fonte porta davvero. */
  resto: { n: '96%', l: 'il resto del territorio, «non ancora esplorato»: parole del Direttore Sales, ottobre 2025' },
  /** Il punto della slide. */
  chiusa: 'Quel 96% si raggiunge arrivandoci, e facendosi trovare da chi lo sta cercando.',
};

/* ── Capitolo 01 · le date, su una linea ──────────────────────────────────
   4 nov. Erano quattro righe di prosa nel lead della slide del contesto, ed
   elencavano sei date: le date in prosa si leggono due volte. Su una linea si
   leggono una volta sola, e si vede la cosa che conta — che cadono tutte nei
   prossimi diciotto mesi.
   ⚠️ Nessuna data è nostra: ognuna sta nelle fonti già citate in fondo a
   quella slide (Altroconsumo gen 2026 · FS News 22 set 2026 · intervista al
   TTG 15 ott 2026 · fsnews.it 14 ott 2026). I mercati nuovi — Asia, Sud
   America, Australia — NON hanno una data e per questo non sono una tappa:
   stanno nella slide dell'internazionalizzazione, dove sono un indirizzo. */
export const CRONOLOGIA: { q: string; t: string; ora?: boolean }[] = [
  { q: 'gennaio 2026', t: 'Prezzo dinamico sulle Frecce' },
  { q: 'adesso', t: 'Piano di Gruppo in scrittura', ora: true },
  { q: 'marzo 2027', t: 'Il nuovo sito' },
  { q: 'estate 2027', t: 'Frecciarossa in Germania' },
  { q: '2028', t: 'Fino a Berlino' },
];

/* I mercati nominati al TTG il 15 ottobre 2026. L'elenco è suo, non una
   nostra selezione, e «Italia» non è fra questi: è la base da cui parte la
   stessa piattaforma. */
export const MERCATI = ['Europa', 'Nord America', 'Asia', 'Sud America', 'Australia'];

export const APERTURA = {
  eyebrow: 'Rimini, TTG Travel Experience, 15 ottobre 2026',
  /** La parola chiave dell'anno commerciale, grande quanto la pagina. */
  dato: 'Internazionalizzazione.',
  /** Sue parole, verbatim.
   *  ⚠️ 6 nov 2026, panel: la frase era tagliata a metà — si fermava a
   *  «partner» — e la seconda metà è proprio quella che regge la tesi estera
   *  del capitolo. Un virgolettato troncato è la prima cosa che nota chi
   *  quell'intervista l'ha rilasciata. Se un giorno non entrasse più nella
   *  slide, il taglio si segnala con […] DENTRO le virgolette. */
  // copy-audit-ignore L1 · è un virgolettato VERBATIM, e la frase intera è
  // esattamente ciò che il panel ha chiesto di ripristinare: accorciarla per
  // far scendere un contatore rimetterebbe il difetto appena tolto.
  citazione: // copy-audit-ignore L1 · virgolettato verbatim: accorciarlo rimetterebbe il troncamento che il panel ha fatto togliere
    '«La parola chiave è internazionalizzazione: vogliamo rafforzare la collaborazione con i nostri <strong>partner</strong> per consolidare la nostra presenza sul mercato italiano e, allo stesso tempo, promuovere la nostra offerta <strong>oltre i confini nazionali</strong>.»',
  /** E la seconda metà della stessa intervista: dove dice di investire. */
  lettura:
    'E, nella stessa intervista: «stiamo investendo significativamente nell’evoluzione dei nostri <strong>canali digitali diretti</strong>, in particolare nell’app e nel sito web».',
  letturaBreve:
    'E, nella stessa intervista, sugli investimenti: «i nostri <strong>canali digitali diretti</strong>, in particolare nell’app e nel sito web».',
  /** ⚠️ IL PONTE, ed è la riga che decide come va l'ora.
   *  «Internazionalizzazione» è la parola del Direttore Sales, ma dentro
   *  l'azienda c'è chi la legge come una traslazione dell'esistente e non
   *  come una rottura. Sono tutti e due in sala. Una slide che promette di
   *  portarli all'estero dà ragione a chi la sminuisce; una slide che dice
   *  che l'impianto è lo stesso dà ragione a tutti e due — e la frase è
   *  praticamente la loro. L'argomento smette di essere «vi aiutiamo ad
   *  andare fuori» e diventa «quello che costruite per l'Italia è la stessa
   *  cosa che vi porta fuori». Il seguito concreto è la slide dell'idea nel
   *  capitolo del contenuto: un master, quattro mercati.
   *  ⚠️ Per questo la riga NON promette un progetto estero a parte. */
  ponte:
    // copy-audit-ignore L3 · la doppia relativa è la formulazione scelta
    // dall'owner il 3 nov 2026: riscriverla toglie alla frase la forza che ha
    // davanti a chi considera l'internazionalizzazione una traslazione.
    'Non serve un programma estero a parte: la macchina che serve l’Italia serve anche Monaco, New York e Shanghai. Cambiano la lingua e il canale, non l’impianto.',
  /** La riga di fonte, identica nei due percorsi: il link lo mette la pagina,
   *  le parole stanno qui — scritte a mano in due posti, divergevano. */
  fonte: {
    prima: 'Fonte:',
    dopo: 'I mercati indicati nell’intervista: Europa e Nord America, «ma anche quelli emergenti per noi, come Asia, Sud America e Australia».',
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
    /* 6 nov 2026, panel: il titolo diceva «una vetrina da aprire». Per chi
       fa la piattaforma quella non è una vetrina: è ospitare il concorrente
       sul proprio canale, su richiesta sua, col proprio costo — il lavoro di
       sistema più grosso nominato in tutto il deck. Chiamarlo vetrina dice
       che non si sa quanto costa. E il taglio corto affermava più del lungo:
       «il mercato si allarga», senza via libera e senza data. */
    k: 'Il mercato',
    t: 'Un terzo operatore, e\u00a0un\u00a0obbligo possibile',
    anc: 'Chi altro vende, e dove',
    b: 'Oggi gli operatori sono due. Il terzo ha il via libera, ma entra non prima della fine del 2027. E la Commissione ha proposto che chi ha metà del mercato venda sulla propria piattaforma anche i treni degli altri, su richiesta loro.',
    bBreve: 'Sull’alta velocità oggi gli operatori sono due: il terzo ha il via libera ma entra non prima della fine del 2027. E la Commissione ha proposto che chi ha metà del mercato venda sulla propria piattaforma anche i treni degli altri.',
    fonti: ['sncfVialibera', 'sncf', 'ueTicketing'],
  },
  {
    /* 6 nov 2026, panel: il titolo diceva «una leva che si muove da sola».
       Il prezzo dinamico non si muove da solo — è revenue management
       governato, con un responsabile che è in azienda e che quella leva l'ha
       appena resa dinamica. Il taglio corto lo scriveva già meglio del lungo. */
    k: 'Il prezzo',
    t: 'Il revenue management lavora\u00a0già',
    anc: 'Da quando, e fin dove',
    /* ⚠️ Diceva «la leva lavora da anni», e non regge: il prezzo dinamico
       sulle Frecce è partito il 1º gennaio 2026 — dieci mesi, non anni — e
       vale SOLO sull'alta velocità, mentre in questa stanza si vendono tre
       prodotti. In sala quella data la conoscono meglio di noi. Ora la riga
       dice quello che dicono le fonti: da quando, su che cosa, e il tetto. */
    b: 'Dal gennaio 2026 il prezzo delle Frecce si muove con la domanda, e ha già chi se ne occupa. La novità è il limite: il vertice di Gruppo ha dichiarato che i biglietti non aumenteranno.',
    bBreve: 'Il revenue management lavora già. La novità è il limite: il vertice del Gruppo ha dichiarato che i biglietti non aumenteranno.',
    fonti: ['pricing', 'prezziFermi'],
  },
  {
    k: 'Il momento',
    t: 'Un piano in scrittura, un sito in rifacimento',
    anc: 'Le due finestre aperte',
    b: 'Il piano di Gruppo arriva entro fine anno, e il nuovo sito è previsto per marzo 2027. Adesso si decide.',
    bBreve: 'Il piano di Gruppo arriva entro fine anno e il nuovo sito è previsto per marzo 2027: quello che si decide adesso entra lì dentro.',
    fonti: ['piano', 'ttgSales2026', 'monaco'],
  },
];

/* ── Capitolo 01 · i problemi chiave, su una slide ─────────────────────────
   9 nov 2026, allineamento con il responsabile dei canali digitali: «questa
   parte introduttiva la farei molto più corta», tre o quattro slide sui problemi
   chiave. Le tre slide del capitolo 01 sono diventate questa. MERCATO, APERTURA e
   CONTESTO restano qui sopra con le loro verifiche, se una va ripresa a voce.
   Il prezzo non è fra i quattro: apre la slide della domanda, subito dopo. */
export const PROBLEMI: Card[] = [
  { k: 'Il territorio', t: 'Tre quarti degli\u00a0stranieri si\u00a0fermano sul\u00a04% del territorio',
    b: 'Dato di contesto del TTG 2025: il resto è il 96% «non ancora esplorato».', fonti: ['ttg96', 'turismo75'] },
  { k: 'I mercati', t: '«La parola chiave è internazionalizzazione […]»',
    b: 'Parole del Direttore Sales al TTG del 15 ottobre 2026.', fonti: ['ttgSales2026'] },
  { k: 'Il momento', t: 'Un piano in scrittura, un\u00a0sito in rifacimento',
    b: 'Il piano di Gruppo arriva entro fine anno, il nuovo sito è previsto per marzo 2027.', fonti: ['piano', 'ttgSales2026', 'pricing'] },
  { k: 'La concorrenza', t: 'Un terzo operatore sull’alta velocità, non prima di\u00a0fine\u00a02027',
    b: 'SNCF ha avuto il via libera a marzo 2026: la partenza slitta alla fine del 2027, nel migliore dei casi.', fonti: ['sncfVialibera', 'sncf', 'monaco'] },
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
   *  subordinate e una doppia relativa. Qui sopra sta il fatto, sotto la domanda.
   *
   *  ⚠️ 4 nov — DUE CORREZIONI DI FATTO, ed è la riga su cui poggia tutto il deck.
   *  Diceva «Il prezzo si muove già da sé, e più in alto non va». Entrambe le
   *  metà erano più larghe delle loro fonti:
   *  · il prezzo dinamico riguarda SOLO l'alta velocità (Altroconsumo, gen 2026:
   *    Intercity e Regionale restano a tariffa fissa). Il commento della card
   *    `Il prezzo` lo sapeva già e lo scriveva — «in questa stanza si vendono tre
   *    prodotti» — ma la correzione era arrivata alla card e non qui;
   *  · «più in alto non va» non è un tetto: è una frase dell'AD di Gruppo in
   *    conferenza stampa il 23 settembre 2026, verificata alla fonte. Una
   *    dichiarazione invecchia e si attribuisce, quindi non sta più
   *    nell'occhiello: sta in `fonte`, con il link e la data.
   *  Era anche l'UNICA slide di contenuto del deck senza riga di fonte — in
   *  entrambi i percorsi — ed era quella che affermava di più. */
  eyebrow: 'Con un terzo operatore in arrivo, e il prezzo delle Frecce che si muove già con la domanda',
  titolo: 'Come ottimizzare le vendite?',
  sub: 'Quattro idee, dalla ricerca del viaggio all’acquisto.',
  subBreve: 'Quattro idee, dalla ricerca del viaggio all’acquisto.',
  /** ⚠️ 4 nov — LA RIGA RESTA, LA MAPPA DELLE DIREZIONI NO. Il panel l'aveva
   *  chiesta da tre poltrone diverse: dichiarare noi che non tutto si decide
   *  qui vale molto più che farselo dire. Ma la versione precedente elencava
   *  quale direzione tiene che cosa, citando i documenti sindacali del 30
   *  marzo: in sala è spiegare a un direttore che cosa non è suo, con in mano
   *  le carte interne della sua azienda, e la domanda che arriva è «chi ve
   *  l'ha detto?». È lo stesso errore già corretto su PICO il 15 ottobre.
   *  Resta la rassicurazione, che è la metà utile; i confini li traccia lui,
   *  se vuole. Via anche la fonte, che serviva solo alla mappa. */
  perimetri:
    'Non tutto quello che segue si decide in questa stanza, e lo sappiamo. La cosa che vi chiediamo alla fine resta nel vostro perimetro.',
  /** La riga di fonte della slide, identica nei due percorsi: le parole stanno
   *  qui, i link li compone la pagina da `sources.ts`. Porta il tetto del prezzo
   *  dove è attribuito — a chi l'ha detto e quando — invece di lasciarlo in
   *  occhiello come se fosse una regola. */
  fonte: {
    prezzo: 'Il prezzo dinamico sulle Frecce:',
    tetto: 'Sul tetto, la dichiarazione del vertice di Gruppo:',
  },
};

/* ── Capitolo 02 · dove ci innestiamo ──────────────────────────────────────
   6 nov 2026, IL RILIEVO PIÙ GRAVE DEL PANEL: in 43 slide non compariva mai
   la piattaforma che il Gruppo ha già scelto per il dato di cliente e per lo
   strato agentico — e il nostro interlocutore ne è sponsor pubblico. Cinque
   personas su sei l'hanno sollevato, tre hanno dichiarato che senza questa
   slide il documento non lo inoltrano: una mappa che elenca «già vostro / si
   aggiunge» come se il campo fosse libero chiede a un direttore di
   rimangiarsi, davanti ai suoi, una decisione che ha firmato.

   TRE REGOLE PER SCRIVERLA, e sono il motivo per cui dice così poco:
   · si cita il LORO comunicato, non quello del fornitore, e con il link;
   · non si giudica quella scelta, non si dice che cosa le manca, non si
     propone di sostituirla. Si dice dove finisce la nostra e basta;
   · la cucitura è una DOMANDA. Dove passi lo sanno loro, non noi.

   ⚠️ Se l'owner preferisce non nominare un fornitore terzo in slide, si
   toglie questa voce e il deck torna esattamente com'era: è un oggetto solo,
   reso da una slide sola. */
export const INNESTO = {
  eyebrow: 'Prima della mappa',
  titolo: 'Dove ci innestiamo, e che cosa non tocchiamo',
  lead: 'La piattaforma del dato di cliente il Gruppo l’ha annunciata a marzo. Niente di quello che segue chiede di rifarla.',
  voci: [
    {
      k: 'Resta dov’è',
      t: 'Il dato di cliente e l’orchestrazione del Gruppo',
      b: 'La foundation annunciata a marzo con la regia della società tecnologica, i sistemi core in migrazione, il sistema con cui le agenzie vendono.',
    },
    {
      k: 'Si affianca',
      t: 'La misura di quello che succede\u00a0prima',
      b: 'Prima del sito, dentro l’offerta, a valle e nel canale: quattro punti da leggere insieme.',
    },
    {
      k: 'Dove si collegano i sistemi',
      t: 'Una scelta che spetta a voi',
      b: 'Chi tiene il dato, chi lo espone e chi autorizza: si decide prima di qualunque test.',
    },
  ],
  chiusa: 'Fra i traguardi che il Gruppo dichiara per quest’anno c’è l’acquisto del biglietto tramite un agente. I quattro punti che seguono stanno prima di quel momento. L’idea 1 ne parla apertamente.',
};

/** `bRiga` è la riga del drill-down: UNA riga, ~15 parole. La regola ne
 *  consente venti, e `bBreve` ne porta venticinque — aperte in `Dettaglio`
 *  fanno quattro righe per voce e il blocco sfonda il viewport a 1280×800. */
/** `tavolo` — 6 nov 2026, panel. Quattro capitoli su sette descrivono
 *  superfici che non si decidono alla Direzione Sales, e la cautela stava in
 *  un posto solo (`DOMANDA.perimetri`): in sala basta, nel file inoltrato no.
 *  ⚠️ NON si riapre la mappa delle direzioni tolta il 4 novembre — elencare
 *  quale direzione tiene che cosa, con in mano le carte interne della loro
 *  azienda, è spiegare a un direttore che cosa non è suo, e la domanda che
 *  arriva è «chi ve l'ha detto?». Qui si dichiara solo il NOSTRO modo di
 *  stare al tavolo: dove il punto è condiviso portiamo domande, dove è suo
 *  lo diciamo. Il confine lo traccia lui, se vuole.
 *  Due parole, non una riga: sta sulla mappa sotto ogni fermata, e la
 *  spiegazione per esteso resta una sola, in `DOMANDA.perimetri`. */
export interface Punto { n: string; dove: string; t: string; b: string; bRiga?: string; bBreve: string; tavolo?: string }
export const PUNTI: Punto[] = [
  {
    /* 16 ott: il punto 01 copre adesso anche il secondo tempo di quel canale,
       perché il capitolo 03 lo contiene. La mappa e i capitoli devono dire la
       stessa cosa: è la prima a essere letta e l'ultima a essere ricordata. */
    n: '1',
    dove: 'Prima del sito',
    t: 'Nella risposta che qualcun altro scrive',
    b: 'Chi organizza un viaggio chiede a un assistente, e riceve una risposta che cita qualcuno. Se non siete voi, la vendita è persa prima che una vostra pagina si apra. E quel canale sta diventando anche un posto dove si compra.',
    bRiga: 'Se nella risposta non ci siete voi, la vendita può sfuggire prima del vostro sito.',
    bBreve: 'Chi organizza un viaggio chiede a un assistente, e la risposta cita qualcuno. Se non siete voi, la vendita può sfuggire prima del vostro sito.',
  },
  {
    n: '2',
    dove: 'Sul sito e in app',
    t: 'Nella proposta che ognuno vede',
    b: 'La proposta può cambiare in base a chi arriva: prima chi non è registrato, poi chi lo è. Su larga scala, e sempre con offerte che si possono comprare.',
    /* 6 nov, panel: era un'affermazione di assenza sui loro sistemi, scritta
       da fuori — e due slide dopo il deck elenca Air-Rail dal 2023 e la sosta
       che si aggiunge a un biglietto già comprato. Un'assenza sul cliente si
       verifica sulle sue pagine prima di scriverla; qui diventa la domanda. */
    bRiga: 'La proposta può cambiare in base a chi arriva, registrato o no?',
    bBreve: 'La proposta può cambiare in base a chi arriva, registrato o no: su larga scala, e sempre con offerte che si possono comprare.',
  },
  {
    n: '3',
    dove: 'A valle',
    t: 'Nei contenuti per ogni mercato',
    b: 'Una squadra sola copre tre prodotti più i servizi, su più mercati e canali. I tre non hanno le stesse leve: alta velocità a mercato, Intercity su servizio universale, Regionale su contratti con le Regioni. I contenuti si moltiplicano, e a mano è difficile stare al passo.',
    bRiga: 'I contenuti si moltiplicano per prodotto, mercato e canale, e a mano è difficile stare al passo.',
    bBreve: 'Una squadra sola vende tre prodotti su più mercati e canali. I contenuti si moltiplicano, e a mano è difficile stare al passo.',
  },
  {
    n: '4',
    dove: 'Nel canale che è vostro',
    t: 'Nelle agenzie: tutto da approfondire',
    b: 'Il venduto per agenzia lo avete già. Si può legare a ciò che succede prima sul digitale? Va approfondito insieme, sul sistema con cui le agenzie vendono.',
    bRiga: 'Il venduto per agenzia c’è già: si può legare al percorso digitale?',
    bBreve: 'Il venduto per agenzia lo avete già. Si può legare a ciò che succede prima sul digitale? Va approfondito insieme.',
  },
];

/* ── Capitolo 03 · il referto della misura ─────────────────────────────────
   NIENTE conteggio animato su questi numeri: mentre contava, la slide diceva
   «0 su 8 risposte nominano Trenitalia», l'esatto contrario del fatto. */
/* ── LE OTTO DOMANDE, per esteso ───────────────────────────────────────────
   3 nov 2026. Il deck diceva «otto domande, nessuna di marca» e non le
   mostrava mai: chi guarda non sa quali siano, e quando più avanti compare la
   risposta su Torino-Bologna non può collegarla alla misura. Il rilievo è
   arrivato da una revisione interna, e è giusto: un numero senza il suo
   campione chiede di fidarsi, e un deck viene letto da chi non era in sala.
   Le domande sono verbatim, come sono state digitate, in minuscolo e senza
   punto interrogativo: una per conversazione nuova, nessuna con un nome di
   marca. Grezzi e metodo:
   docs/Ferrovie/MISURA-visibilita-risposte-generate-2026-10-11.md. */
export const DOMANDE: { n: number; t: string; lang: 'IT' | 'EN' }[] = [
  { n: 1, t: 'come arrivo da Roma a Matera senza auto', lang: 'IT' },
  { n: 2, t: 'how to travel from Rome to Florence without a car', lang: 'EN' },
  { n: 3, t: 'come visitare la costiera amalfitana senza macchina', lang: 'IT' },
  { n: 4, t: 'how to visit Puglia without a car', lang: 'EN' },
  { n: 5, t: 'come arrivare alle Cinque Terre senza auto', lang: 'IT' },
  { n: 6, t: 'best way to get from Milan to Venice', lang: 'EN' },
  { n: 7, t: 'how to get from Rome to Pompeii by train', lang: 'EN' },
  { n: 8, t: 'come andare da Torino a Bologna in giornata senza auto', lang: 'IT' },
];

export const KPI: Card[] = [
  { k: 'Presenza', t: 'Su quante domande comparite', bSlide: 'Google sbaglia 2 volte su 8: elenca le Frecce come aziende in\u00a0concorrenza. ChatGPT mai.',
    anc: 'Chi viene citato, e da dove', b: 'Un punteggio nel tempo, per mercato e per lingua, invece di una fotografia sola.' },
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
  { k: 'Fonti', t: 'Da quale sito arriva la risposta', bSlide: 'Su Google soprattutto rivenditori, come Trainline e Omio. Se\u00a0la\u00a0vendita passa da loro, si paga in commissione.',
    anc: 'Il passaggio che costa commissione', b: 'Comparire tramite un rivenditore è pagare in commissione una vendita che poteva arrivare diretta.' },
  /* ⚠️ 6 nov 2026, panel: la riga diceva «le visite che nascono da una
     risposta generata, oggi indistinte dal resto del traffico». È
     un'affermazione di assenza sui loro sistemi, scritta da fuori: il sito è
     strumentato, e quello che manca semmai è la definizione condivisa. Una
     capacità che sembra mancare si verifica sulle loro pagine prima di
     scriverla; qui diventa la domanda. In coda il costo del contatto, che
     quattro personas hanno chiesto e che è la misura di chi assiste. */
  { k: 'Traffico', t: 'Quanto arriva davvero dagli assistenti AI', bSlide: 'Persone distinte dagli agenti, per sapere quanto vale il\u00a0canale.',
    anc: 'Tracciare, distinguere, governare', b: 'Il traffico che arriva dagli assistenti AI si riesce oggi a isolare? Serve distinguere le persone dagli agenti e sapere quali fonti gli assistenti considerano autorevoli: una risposta sbagliata è una chiamata in più all’assistenza.' },
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
    t: 'Busitalia, interamente del\u00a0Gruppo, e i suoi collegamenti',
    anc: 'La gomma, dentro casa',
    /* ⚠️ 6 nov 2026, REFUTATA dalla fonte che la slide stessa cita, e il
       commento qui sopra lo diceva già: i 10.300 collegamenti sono di
       Busitalia, le 1.700 destinazioni sono dell'offerta Trenitalia nel suo
       insieme. Erano cuciti in una frase sola, come se fossero lo stesso
       soggetto — ed è un numero loro, su una slide del loro mestiere. */
    b: 'Interamente vostra: 10.300 collegamenti al giorno. E l’offerta integrata treno più bus arriva a più di 1.700 destinazioni.',
    bBreve: 'Busitalia è interamente vostra: 10.300 collegamenti al giorno, dentro un’offerta integrata che arriva a più di 1.700 destinazioni. Da gennaio porta anche City Sightseeing.',
    fonti: ['busitalia', 'ttgOfferta'],
  },
  {
    k: 'Sosta',
    t: 'I parcheggi di stazione',
    anc: 'La sosta, già a sistema',
    b: 'Si aggiungono a un biglietto già comprato, fino al giorno prima: il viaggio comincia lì.',
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
    t: 'Air-Rail dal 2023, e un laboratorio comune',
    anc: 'Il volo, già in prova',
    b: 'Partito nel 2023, e da marzo c’è un memorandum che istituisce un laboratorio comune. A maggio ITA Airways ha firmato anche con Italo.',
    bBreve: 'Il biglietto integrato con ITA Airways è partito nel 2023, e a marzo un memorandum ha istituito un laboratorio comune sull’intelligenza artificiale. A maggio la stessa compagnia ha firmato anche con Italo.',
    fonti: ['itaAirways', 'itaItalo'],
  },
];

/* ── Capitolo 04 · il viaggio comincia altrove ─────────────────────────── */
export const PRIMA: Card[] = [
  {
    // 16 ott: non più «un partner del viaggio» generico. Ne hanno firmato uno
    // ieri, in pubblico, e il deck lo nomina con la sua fonte.
    k: 'Con chi, adesso',
    t: 'L’accordo con Costa Crociere',
    anc: 'Un accordo che esiste già',
    b: 'Il protocollo con Costa Crociere, presentato al TTG il 15 ottobre, porta la vostra offerta dentro la loro piattaforma. Da gennaio 2027 è annunciato il collegamento dei due sistemi di prenotazione: riguarda la vendita. La prima domanda è quanto ne copra già.',
    bBreve: 'Il protocollo con Costa, presentato al TTG il 15 ottobre, annuncia il collegamento dei due sistemi di prenotazione da gennaio 2027. Quanto copre già?',
    fonti: ['costaTtg'],
  },
  {
    k: 'Dove sta il valore',
    t: 'Proporre il treno a chi ha già prenotato la crociera',
    anc: 'Il treno, per chi ha la crociera',
    b: 'Con data e tratta già decise, si sceglie soprattutto sul prezzo. Chi ha prenotato una crociera da Genova deve ancora capire come arrivarci: conoscerlo permette una proposta vantaggiosa prima di ogni confronto.',
    bBreve: 'Con data e tratta già decise, si sceglie soprattutto sul prezzo. Chi deve ancora capire come arrivare si può raggiungere prima di ogni confronto.',
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

   PERCHÉ NON È UNA NOSTRA IDEA, e dal 6 nov 2026 lo dice una fonte PUBBLICA
   invece di una riunione: il comunicato del Gruppo del 5 marzo 2026 mette
   «acquisto biglietti tramite agente AI» fra i traguardi dichiarati per il
   2026. Prima la frase poggiava su quanto detto a voce in una riunione, e
   «ce l'avete detto voi» è una fonte che in sala non si può mostrare.

   ⚠️ NON SI DICE «canali agentici» (6 nov 2026, panel). È un calco da
   «agentic channels», e in casa loro «canale agenziale» è la rete delle
   agenzie di viaggio, cioè il capitolo 06 di questo stesso documento: due
   cose diverse con parole quasi identiche, a quattro capitoli di distanza.
   Si dice «dentro la conversazione».

   ⚠️ E SE LA VENDITA AVVIENE LÌ, È UN CANALE DISTRIBUTIVO NUOVO, non solo un
   innesto di piattaforma: di chi è quel cliente, quanto costa quel
   passaggio, chi emette e chi assiste. Sono domande, e le facciamo noi.

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
    k: 'La direzione',
    t: 'Vendere dentro la conversazione',
    anc: 'Una direzione che si apre',
    b: 'Non è una proposta nostra: «acquisto biglietti tramite agente AI» è fra i traguardi che il Gruppo ha dichiarato per quest’anno.',
  },
  {
    k: 'Che cosa cambia',
    t: 'La risposta come punto vendita',
    anc: 'Di chi è quel cliente',
    b: 'Chi chiede «come arrivo a Matera senza auto» oggi riceve una risposta, e poi va altrove a comprare. Se un giorno comprasse lì, di chi è quel cliente e chi emette il biglietto?',
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
    anc: 'Dentro la piattaforma che avete',
    b: 'Vive dentro Experience Manager, la vostra piattaforma di contenuti: è un’estensione, non un sistema accanto.',
  },
];

/* ── Capitolo 05 · l'aritmetica ────────────────────────────────────────────
   I numeri sono i suoi, dichiarati al TTG dell'ottobre 2025, più la rete di
   terzi del Regionale. Prima c'era «4 mercati esteri presidiati»: nessuna fonte
   pubblica dice quattro, e un numero senza fonte su una slide di numeri è il
   primo che qualcuno chiede. */
export const MOLTIPLICATORI: Stat[] = [
  { v: '3', l: 'prodotti più i servizi', s: 'Alta Velocità, Intercity e Regionale: una squadra sola li vende tutti' },
  /* ⚠️ 9 nov 2026: la cifra delle agenzie è uscita su richiesta del cliente. Prima,
     6 nov 2026, panel: la terza cifra erano i «70.000 punti vendita»,
     affiancati alle 12.400 agenzie con lo stesso peso — due reti diverse,
     due prodotti, due contratti, e un dato del 2014 accanto a uno del 2025.
     Dichiarare l'età non basta: in proiezione si legge il numero. Al loro
     posto il moltiplicatore che manca davvero all'aritmetica del capitolo,
     ed è loro e del 2026: i mercati. I 70.000 restano nel capitolo 06. */
  { v: '5', l: 'i mercati che nominate', s: 'Europa, Nord America, Asia, Sud America e Australia: i mercati indicati nell’intervista dell’ottobre 2026' },
];

export const UNPOSTO: Card[] = [
  {
    k: 'Il tempo',
    t: 'Meno giorni dal brief alla vetrina',
    anc: 'Il tempo, non il costo',
    b: 'Il metro è dopo quanti giorni una variante arriva davanti a un cliente. È lì che si gioca una stagione.',
  },
  {
    k: 'Il marchio',
    /* 6 nov 2026, secondo giro: «conforme senza una revisione a mano»
       prometteva di togliere la firma di una persona, e non è quello che lo
       strumento fa. Il vantaggio vero è che gli errori formali si fermano
       prima della pubblicazione; l'approvazione resta di chi la dà oggi. */
    t: 'Le regole dentro lo strumento, l’approvazione resta\u00a0vostra',
    anc: 'Le regole, prima di pubblicare',
    b: 'Le regole del marchio stanno dentro lo strumento, non in un documento che qualcuno deve ricordarsi di aprire.',
  },
  {
    k: 'Le persone',
    t: 'Stessi team, meno lavoro manuale',
    anc: 'Le stesse persone, meno lavoro manuale',
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
/* 20 ott: il blocco era scarno e il valore non si vedeva — tre righe che
   dicevano che cosa si misura, nessuna che dicesse che cosa se ne ricava.
   Ora ogni voce porta la conseguenza, e «che cosa converte» dice di QUALI
   contenuti parla: in agenzia la carta esiste ancora, e tanta. Tenerla fuori
   avrebbe fatto sembrare la proposta un discorso da sito web fatto a chi
   stampa locandine. */
export const SAPERE: Card[] = [
  {
    k: 'Dal digitale al banco',
    t: 'Il venduto, letto insieme al percorso digitale',
    anc: 'Il venduto, con quello che viene prima',
    b: 'Il dato transazionale c’è già, fino alla singola agenzia. Si aggiunge che cosa è successo prima, online.',
    bBreve: 'È la misura diretta della riorganizzazione commerciale: dove la proposta multiprodotto arriva, e dove si ferma al solo treno.',
  },
  {
    k: 'Che cosa converte',
    t: 'Quali contenuti vendono, e quali restano nel cassetto',
    anc: 'Digitale e cartaceo insieme',
    b: 'Schede ed email, ma anche brochure e stampati da banco: in agenzia si stampa ancora, e molto.',
    bBreve: 'Digitale e cartaceo: schede ed email, ma anche brochure e stampati da banco. Produrne meno, e più di quelli che funzionano.',
  },
  {
    k: 'Che cosa succede se…',
    t: 'Provare un’alternativa prima di adottarla',
    anc: 'Prima su poche agenzie',
    b: 'Sul sito si prova una proposta su una parte del traffico. Sulla rete si potrebbe fare lo stesso, prima di estenderla a tutte le agenzie.',
    bBreve: 'Una proposta diversa su una parte della rete, misurata due settimane prima di portarla a tutte. Su un sito si fa; qui, per quanto ne sappiamo, no.',
  },
];

/* ── Capitolo 07 · quello che chiediamo ────────────────────────────────────
   ⚠️ 6 nov 2026, sera: L'ASK CAMBIA, ED È UNA DECISIONE DELL'OWNER CONTRO IL
   VERDETTO DEL PANEL. La mezza giornata sui dati della rete agenzie era la
   voce che tutte e sei le personas avevano messo fra le «non toccare», ed era
   l'unica cosa che il Direttore Sales poteva concedere da solo. Esce lo
   stesso, e la ragione è di chi conosce la stanza: quella sessione è già
   intrinseca al lavoro che corre con il presidio digitale e con la società
   tecnologica del Gruppo, quindi a lui non chiede niente che non stia già
   succedendo. Qui si chiede l'unica cosa che può dare lui: una rotta
   confermata, e un posto al tavolo quando il\u00a0piano si\u00a0scrive.

   L'ask sta in un posto solo: due versioni della richiesta sono il modo più
   rapido di sembrare confusi davanti a un cliente. */
export const ASK = {
  eyebrow: 'Quello che vi chiediamo',
  titolo: 'Una conferma sulla roadmap,<br />e il nostro contributo all’offerta.',
  sub: 'Nessuna delle tre chiede un progetto, un budget o una firma.',
  /** I tre punti, nell'ordine in cui si dicono. `t` è l'ancora (≤6 parole),
   *  `b` la riga che sopravvive all'inoltro. */
  punti: [
    {
      k: 'Il riscontro',
      t: 'Quali di queste quattro sono priorità\u00a0vostre',
      b: 'Delle quattro direzioni del documento, quali state già mettendo in campo, e in che ordine.',
    },
    {
      k: 'Gli spunti',
      t: 'Che cosa non abbiamo\u00a0visto',
      b: 'Questo documento è costruito da fuori, su fonti pubbliche e una misura nostra: quello che ci sfugge lo sapete voi.',
    },
    {
      k: 'Il contributo',
      t: 'Offrirvi il nostro contributo nella\u00a0pianificazione dell’offerta\u00a0integrata',
      b: 'E quando si disegna l’approccio per le Frecce, dopo la definizione dei nuovi prodotti: è lì che un’idea diventa un caso d’uso.',
    },
  ],
  /** ⚠️ Il confine, e vale la pena sapere perché è scritto così. Nelle parole
   *  interne è «non vogliamo sostituire chi li segue né fare i consulenti
   *  strategici». In slide un nome di terzi non ci va: resta il confine. */
  chiusa: 'Ogni passo segue i processi di FS Technology e del Gruppo, e chi vi accompagna oggi resta.',
};

/* ── Capitolo 07 · la macro timeline ───────────────────────────────────────
   9 nov 2026: l'ha chiesta il responsabile dei canali digitali («proverei a
   proporre una specie di roadmap»), distinguendo quello che si può avviare da
   quello che dipende da altri. ⚠️ Il repo è pubblico: nessuna data del nuovo CRM,
   che viene da una conversazione. L'unica data è quella del sito, che è pubblica. */
export const TEMPI = {
  eyebrow: 'Una possibile sequenza',
  titolo: 'Prima quello che si può avviare subito',
  sub: 'Una proposta da riordinare con le vostre priorità, nel rispetto dei processi di FS Technology e del Gruppo.',
  /* 10 nov 2026: da binario a barre. `da` è la colonna in cui la barra parte, `stato` il
     colore: rossa si avvia subito, ardesia dipende da altro, tratteggiata è da approfondire. */
  orizzonti: ['Da subito', 'Con il nuovo CRM', 'Dopo, con i sistemi di vendita'],
  voci: [
    { k: 'Da subito', da: 0, stato: 'ora', t: 'Governo della presenza negli assistenti AI', b: 'Misura continua di marchio e fonti, con impatto minimo sui sistemi.' },
    { k: 'Da subito', da: 0, stato: 'ora', t: 'Personalizzazione per\u00a0chi non è registrato', b: 'Si aggiunge Customer Journey Analytics, Target lavora su trenitalia.com.' },
    { k: 'Con il nuovo CRM', da: 1, stato: 'dopo', t: 'Personalizzazione per i clienti registrati', b: 'Il profilo resta nel CRM.' }, // copy-audit-ignore V2 · «registrati» è un participio plurale, non un imperativo
    { k: 'Dopo, con i sistemi di vendita', da: 2, stato: 'dopo', t: 'Un’esperienza unica per il cliente', b: 'Si propone e si compra nello stesso percorso.' },
    { k: 'Da approfondire insieme', da: 0, stato: 'aperto', t: 'Le agenzie', b: 'Campagne, digitale e venduto per agenzia nella stessa analisi.' },
  ],
  strato: { t: 'Contenuti su scala: si possono avviare in qualunque fase', b: 'Più personalizzazione vuol dire più varianti. La misura per contenuto arriva con Customer Journey Analytics.' },
  figura: 'Sei attività su tre orizzonti: da quelle che si avviano subito a quelle che dipendono da altri sistemi',
};

/* ── Capitolo 07 · che cosa va previsto ────────────────────────────────────
   6 nov 2026. Questa slide nasce dal panel — la Direzione Generale chiedeva
   una taglia e un indicatore, «senza unità di misura non entra nel piano» —
   e la sera cambia soggetto insieme all'ask: non è più che cosa esce da una
   sessione, è che cosa va messo nel piano perché una direzione confermata
   diventi un programma.

   ⚠️ NIENTE LISTINO, e niente importi: la seconda voce nomina le CAPACITÀ,
   non i prodotti in corpo grande. I nomi stanno già dove devono, nella mappa
   di `slide-ripresa`, marcati «si aggiunge». Quello che sappiamo noi sul come
   stanno rinnovando sta nelle note per chi presenta, non qui. */
export const ESITO = {
  eyebrow: 'Perché una rotta diventi un piano',
  titolo: 'Che cosa va previsto, e su che cosa si\u00a0vede',
  sub: 'Su tutte e quattro le direzioni una parte è già nel Gruppo. Quello che si aggiunge sono due voci, e vanno previste prima.',
  voci: [
    {
      k: 'Quello che c’è già',
      t: 'La base, e non si rifà\u00a0niente',
      b: 'Analisi del sito, prova sul traffico, gestione dei contenuti: le quattro direzioni si appoggiano lì sopra.',
    },
    {
      k: 'Quello che si aggiunge',
      t: 'Due voci, e vanno\u00a0previste',
      b: 'Si aggiunge la lettura unica del percorso d’acquisto. La prova sul traffico c’è, e va estesa al volume che serve.',
    },
    {
      k: 'Su che cosa si vede',
      t: 'Un indicatore vostro per\u00a0direzione',
      b: 'Scelto insieme prima di cominciare: è la condizione perché il piano regga davanti a chi lo approva.',
    },
  ],
  chiusa: 'Che cosa serve lo diciamo qui. Quanto pesa si misura insieme, sul perimetro che scegliete voi.',
  /** L'etichetta della figura: è testo per chi usa un lettore di schermo, e
   *  stava scritta a mano in due pagine — l'ha preso `audit:taglio`. */
  figura: 'Dalla base che c’è già all’indicatore su cui si vede l’effetto, in tre passi',
};

export const DOMANDE_APERTE = [
  'Quanta parte delle vendite passa dai vostri canali e quanta dagli intermediari, e quale dei due volete far crescere?',
  'Quale dato esiste oggi per rete e per agenzia, e chi lo possiede?',
  'Del percorso intermodale, quanto è già deciso e quanto è ancora da disegnare?',
  'I contenuti per i mercati esteri, in tutte le lingue: chi li fa oggi?',
  // 6 nov 2026, panel: la mappa copre chi compra per sé o tramite un'agenzia
  // di viaggio, e il corporate — convenzioni, business travel, grandi clienti
  // — ha un percorso tutto suo, che sul checkout pubblico non passa.
  // Dichiararlo fuori perimetro costa una riga; farselo chiedere, l'ora.
  'Il canale corporate — convenzioni, business travel, grandi clienti — non è in questi quattro punti: ha un percorso suo. Rientra in questo lavoro, o va affrontato a parte?',
  // 6 nov 2026, panel, dal seggio della Direzione Sales: in un canale
  // intermediato quello che muove il venduto sono l'incentivo e la
  // convenzione — un'agenzia vende ciò che le rende di più. La misura è una
  // leva a due mani, e la seconda è loro: meglio chiederlo noi.
  'Se le condizioni con le agenzie restano quelle di oggi, che cosa cambierebbe avendo la misura?',
];

/* ── Che cosa serve, concretamente ─────────────────────────────────────────
   Chiesto in riunione il 20 ott 2026, e vale per OGNI idea del deck: una
   Prospettiva che non dice con che cosa si fa una cosa lascia la stanza con
   l'impressione che si debba comprare tutto da capo. Qui si dice il contrario,
   ed è vero — ed è vero più di quanto pensassimo prima di leggere il contratto.

   DUE STATI. Ce n'era un terzo — «prezzo già fissato nell'accordo quadro» —
   e il 5 nov 2026 è uscito su indicazione di chi tiene il conto: l'accordo si
   rinegozia l'anno prossimo, quindi portare in sala un prezzo di oggi come se
   valesse domani è un impegno che non possiamo prendere. Chi lo usava era
   **solo Workfront**, che torna dove sta per contratto: non licenziato.
   · `avete`  — licenziato oggi: qui si estende a un uso nuovo;
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

   DUE SFUMATURE decise in riunione il 20 ott, che la sola lettura del contratto
   non dava:
   · Il DAM del gruppo NON è del marketing di Trenitalia — è di un'altra società,
     e una terza istanza è prevista altrove. Per questo la riga dice «c'è già nel
     gruppo, da estendere» e non «è vostro»: estendere una cosa che l'azienda ha
     già è un passo corto, spacciarla per loro è un errore che si scopre in sala.
   · Di Firefly hanno la VERSIONE BASE, quella che arriva con le postazioni
     Creative Cloud. Quello che si propone — la produzione su scala — non è nel
     contratto: verificato, i modelli personalizzati non compaiono né fra i
     prodotti licenziati né fra quelli a prezzo bloccato. La riga nomina gli
     strumenti che hanno; il salto lo dice il testo del drill-down.

   Il blocco vive DENTRO «Che cosa serve, concretamente», cioè dietro il
   drill-down: in sala si apre se qualcuno chiede, e intanto non appesantisce
   una slide che deve reggere da sola. */
import type { ScenaId } from './pop';
export type Stato = 'avete' | 'nuovo';
/**
 * IL COLORE DI OGNI PRODOTTO — uno stabile, lo stesso ovunque compaia.
 *
 * PERCHÉ SERVE. Sulla mappa delle quattro idee gli stessi prodotti tornano in
 * colonne diverse — Customer Journey Analytics sta sia nel viaggio sia nelle
 * agenzie — e leggendo nomi lunghi in quattro colonne quella ricorrenza non si
 * vede. Il colore la rende immediata: lo stesso punto, nella stessa tinta, in
 * due colonne lontane.
 *
 * ⚠️ IL COLORE STA NEL PUNTO, NON NEL NOME. Colorare i nomi costerebbe tre
 * cose: entrerebbe in conflitto con il colore che già dice lo stato (già
 * vostro / si aggiunge), richiederebbe due palette — una per le slide chiare e
 * una per quelle scure — e a corpo piccolo porterebbe metà dei nomi sotto la
 * soglia AA, che è il gate `audit:ink`. Il punto è decorazione, il nome resta
 * inchiostro leggibile, e la distinzione si vede lo stesso.
 *
 * Le tinte sono a luminanza media di proposito: devono reggere sia sul fondo
 * ardesia del drill-down sia sull'avorio della slide di chiusura. I prodotti
 * della stessa famiglia prendono tinte vicine (Experience Manager e i suoi
 * Assets), così la parentela si legge senza scriverla.
 */
export const COLORE_PEZZO: Record<string, string> = {
  'Adobe Experience Manager': '#e8743b',
  'Adobe Experience Manager Assets': '#f0a94b',
  'LLM Apps, dentro Adobe Experience Manager': '#b05ccc',
  'Adobe Brand Visibility': '#d9486e',
  'Adobe Analytics': '#3d8ee0',
  'Customer Journey Analytics': '#38b6c4',
  'Adobe Target': '#2fae6b',
  'Adobe Real-Time Collaboration': '#7a8cf0',
  'Adobe Creative Cloud': '#e05b9a',
  'Adobe Workfront': '#c9a227',
  'Adobe GenStudio for Performance Marketing': '#5fb3a3',
  'CX Enterprise Coworker': '#8aa0c9',
  'Adobe Content Analytics': '#6fa8dc',
};

export interface Pezzo {
  nome: string;
  /** La fonte pubblica del prodotto: il nome in slide è un link verificabile. */
  fonte?: ChiaveFonte;
  stato: Stato;
  /** A che cosa serve QUI, in una riga. Non la scheda del prodotto. */
  a: string;
  /** La scena del pop-in: prodotto × questo caso d'uso. Solo per ciò che si aggiunge. */
  pop?: ScenaId;
}

/** Il nome sulle pillole: il prefisso «Adobe» lo dice già il marchio che apre la riga.
 *  GenStudio si accorcia in «for PeM» perché il nome intero allargava la sua colonna; per esteso
 *  resta nel pop-in. Una funzione sola, così striscia e mappa non divergono. */
export const nomeBreve = (nome: string) => {
  const n = nome.replace(/\u00a0/g, ' ');
  if (n.startsWith('LLM Apps')) return 'LLM Apps';
  if (n.includes('GenStudio')) return 'GenStudio for PeM';
  return n.replace(/^Adobe /, '').replace(/,\s*con\s+/, ' con ');
};

/**
 * DOVE LAVORA OGGI CIÒ CHE È GIÀ NEL GRUPPO. Una definizione sola: striscia e mappa
 * la leggono da qui, così il perimetro non può divergere.
 * Verificato il 10 nov 2026 su estratto d'uso e tag caricati dal vivo. Analytics: due
 * report suite distinte, e le chiamate mobile stanno in quella delle Frecce. Target:
 * parte sulle pagine di trenitalia.com e non su lefrecce.it. «Prima del login» viene
 * dall'account: da fuori non si vede l'area riservata.
 */
export const PERIMETRO: Record<string, string[]> = {
  'Adobe Analytics': ['trenitalia.com', 'Le Frecce', 'App'],
  'Adobe Target': ['trenitalia.com', 'prima del login'],
  'Adobe Experience Manager Assets': ['Fondazione FS'],
};

/** 10 nov 2026, conferma dell'account: nel Gruppo c'è, ma lavora altrove. Si vede dalla
 *  forma: filetto tratteggiato invece che continuo, con il nome di dove sta. Per usarlo
 *  in Trenitalia serve un nuovo acquisto, e si dice a voce. */
export const ALTROVE = new Set(['Adobe Experience Manager Assets']);

/** La stessa cosa in poco spazio, per le pillole della mappa: una riga sola anche a 1280. */
export const PERIMETRO_CORTO: Record<string, string> = {
  'Adobe Analytics': 'sito · Frecce · app',
  'Adobe Target': 'sito, prima del login',
  'Adobe Experience Manager Assets': 'Fondazione FS',
};

export const LEGENDA: Record<Stato, { eti: string; spiega: string }> = {
  avete: { eti: 'già nel Gruppo', spiega: 'contratto FS Technology' },
  nuovo: { eti: 'si aggiunge', spiega: 'oggi non c\u2019\u00e8' },
};

export const SERVE: Record<
  'visibilita' | 'canale' | 'acquisto' | 'collaborazione' | 'contenuto' | 'rete',
  Pezzo[]
> = {
  visibilita: [
    { nome: 'Adobe Brand Visibility', fonte: 'brandVisibility', stato: 'nuovo', a: 'Come comparite nelle risposte AI', pop: 'bv-ricerca' },
    { nome: 'Adobe Experience Manager', fonte: 'aem', stato: 'avete', a: 'Dove le pagine già nascono' },
  ],
  canale: [
    { nome: 'Adobe Experience Manager', fonte: 'aem', stato: 'avete', a: 'la base su cui si innesta' },
    /* ⚠️ VERIFICATO ALLA FONTE il 5 nov 2026, e il deck sbagliava due volte.
       Il comunicato Adobe del 20 aprile dice, verbatim: «LLM Apps (**a new
       capability in AEM**) will enable brands to build branded experiences
       that run directly within LLM interfaces». Quindi (a) non è un prodotto
       a sé ma una capability di AEM, e il nome lo dice; (b) la riga diceva
       «l'offerta dentro l'assistente», e nello stesso comunicato quel vettore
       — «Reach» — contiene anche Brand Concierge, cioè il checkout dentro la
       conversazione: territorio presidiato da un accordo che il cliente ha
       dichiarato pubblicamente, e che non possiamo nominare né sfiorare.
       Ora la riga parla di PRESENZA DI MARCA, non di vendita. */
    { nome: 'LLM Apps, dentro Adobe Experience Manager', fonte: 'llmApps', stato: 'nuovo',
      a: 'La marca dentro gli assistenti AI', pop: 'llm-ricerca' },
  ],
  acquisto: [
    { nome: 'Adobe Analytics', fonte: 'analytics', stato: 'avete', a: 'I segmenti di chi naviga' },
    { nome: 'Customer Journey Analytics', fonte: 'cja', stato: 'nuovo', a: 'CartaFreccia e navigazione insieme', pop: 'cja-acquisto' },
    { nome: 'Adobe Target', fonte: 'target', stato: 'avete', a: 'La home per segmento' },
    { nome: 'CX Enterprise Coworker', fonte: 'coworker', stato: 'nuovo', a: 'Agenti AI sui segmenti', pop: 'coworker-acquisto' },
  ],
  collaborazione: [
    { nome: 'Adobe Real-Time Collaboration', fonte: 'rtcdpCollab', stato: 'nuovo', a: 'Incrocio e attivazione con i partner', pop: 'collab-costa' },
  ],
  contenuto: [
    { nome: 'Adobe Experience Manager Assets', fonte: 'aemAssets', stato: 'avete', a: 'Da estendere a Trenitalia' },
    /* 10 nov 2026, dall'account: in uso in Trenitalia, non per la produzione di contenuti; Firefly
       non è un prodotto loro, ci sono i crediti inclusi in Creative Cloud. */
    { nome: 'Adobe Creative Cloud', fonte: 'firefly', stato: 'avete', a: 'Con crediti Firefly inclusi' },
    { nome: 'Adobe Workfront', fonte: 'workfront', stato: 'nuovo', a: 'Richieste e approvazioni', pop: 'workfront-contenuto' },
    { nome: 'Adobe GenStudio for Performance Marketing', fonte: 'genstudio', stato: 'nuovo', a: 'Le varianti per il paid media', pop: 'genstudio-contenuto' },
    { nome: 'Adobe Content Analytics', fonte: 'contentAnalytics', stato: 'nuovo', a: 'Quali contenuti funzionano davvero', pop: 'ca-contenuto' },
    { nome: 'CX Enterprise Coworker', fonte: 'coworker', stato: 'nuovo', a: 'Agenti AI sulla produzione', pop: 'coworker-contenuto' },
  ],
  rete: [
    /* 10 nov 2026: la striscia porta solo CJA, che qui fa il lavoro: unisce campagne,
       digitale e venduto per agenzia. */
    { nome: 'Customer Journey Analytics', fonte: 'cja', stato: 'nuovo', a: 'Campagne, sito, app e agenzie insieme', pop: 'cja-rete' },
  ],
};

/* ── Chi siamo ─────────────────────────────────────────────────────────────
   9 nov 2026, richiesta dell'owner: dopo la copertina, tre righe.
   ⚠️ Nomi e foto del team sono dati dall'owner per la sala. Il repo è pubblico:
   prima di un push si decide se restano.
   ⚠️ La timeline viene da una slide di lavoro Adobe sull'account, non da una
   fonte pubblica: per questo non porta link. Le metriche di quella slide (pagine
   viste, redattori, siti) restano fuori: sono dati del cliente.
   L'offerta nomina solo prodotti già presenti nel deck: niente orchestrazione
   dei messaggi, che confina con la piattaforma scelta dal Gruppo. */
export const CHI_SIAMO = {
  eyebrow: 'Adobe e il Gruppo FS',
  titolo: 'Chi siamo',
  team: {
    k: 'Il team Adobe per Ferrovie',
    persone: [
      { foto: 'capuano', nome: 'Rosa Capuano', ruolo: 'Enterprise Sales Director' },
      { foto: 'perrone', nome: 'Dario Perrone', ruolo: 'Digital Experience Account Executive' },
      { foto: 'gargiulo', nome: 'Antonio Gargiulo', ruolo: 'Product Sales Specialist Data & Analytics' },
      { foto: 'tammaro', nome: 'Riccardo Tammaro', ruolo: 'Product Sales Specialist Content' },
    ],
  },
  offerta: {
    k: 'L’offerta Adobe, end to end', // copy-audit-ignore · «end to end» è la parola chiesta dall'owner
    fasi: [
      { k: 'Farsi trovare nell\u2019era dell\u2019AI', p: 'Brand Visibility · LLM Apps' },
      { k: 'Creare', p: 'Creative Cloud con Firefly · GenStudio for PeM · Workfront' },
      { k: 'Pubblicare', p: 'Experience Manager · Assets' },
      { k: 'Personalizzare', p: 'Target' },
      { k: 'Misurare', p: 'Analytics · Customer Journey Analytics · Content Analytics' },
    ],
    /* Lo strato che attraversa tutte le fasi, chiesto dall'owner. Che cosa è attivo
       su quale prodotto si dice a voce: la disponibilità cambia per prodotto. */
    strato: { t: 'CX Enterprise Coworker', b: 'agenti AI accanto ai vostri team, su tutte le fasi' },
  },
  storia: {
    k: 'Adobe e Ferrovie, la storia',
    tappe: [
      { q: '2017', t: 'Fondazione digitale', b: 'Adozione di Adobe Experience Manager e Adobe Analytics' },
      { q: '2024-2025', t: 'Migrazione al cloud', b: 'Febbraio 2025, ultima fase: 26 siti migrati, 6 nativi cloud' },
      { q: '2025', t: 'Go-live strategici', b: 'Trenitalia e FS Logistix su piattaforme evolute' },
      { q: '2026', t: 'Site transformation', b: 'FS Italiane: trasformazione del sito entro l’anno', ora: true },
      { q: '2027 e oltre', t: 'Evoluzione', b: 'Altri siti del Gruppo FS, e Experience Manager Assets da estendere' },
    ],
  },
};

/* ── Servizi ───────────────────────────────────────────────────────────────
   `card(x, 'breve')` serve la versione corta dove c'è, quella lunga dove non
   c'è: così il taglio non può perdere una voce per distrazione. */
export const card = (c: Card, taglio: 'lungo' | 'breve' = 'lungo'): Card =>
  taglio === 'lungo' || !c.bBreve ? c : { ...c, b: c.bBreve };

/** Le fonti di una voce, pronte da rendere: `[{url, label}]`. */
export const fontiDi = (c: Pick<Card, 'fonti'>): Fonte[] => (c.fonti ?? []).map((k) => S[k]);
