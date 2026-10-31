/**
 * LE FRASI CHE VIVONO IN DUE PERCORSI, definite UNA VOLTA.
 *
 * ⚠️ PERCHÉ ESISTE QUESTO FILE. Il percorso intero e il taglio da dieci minuti
 * dicono alcune cose uguali: la chiusa di un capitolo, il titolo del modello di
 * costo, le due righe su che cosa muove il conto. Finché quelle frasi stanno
 * scritte a mano in due pagine, divergono — non è una possibilità, è una
 * certezza, e diverge il taglio corto, perché le correzioni arrivano sul lungo.
 * Qui stanno una volta sola, e le due pagine le importano.
 *
 * Lo verifica `DECK_URL=… pnpm audit:taglio --app bper-sopra-quello-che-avete`,
 * che è HARD su una stringa scritta a mano in due pagine e in nessuna fonte.
 */
export interface Due { it: string; en: string }

/* ⚠️ IL CONTEGGIO STA QUI, E SOLO QUI.
   Il secondo giro di revisione ha trovato lo stesso fatto contato in quattro
   modi — «due blocchi cambiano» in copertina, «due escono, tre entrano» su
   una copertina di capitolo, «quattro entrano» nella slide dentro quel
   capitolo, «di nove, sette non li tocchiamo» sulla mappa — e il conteggio
   sbagliato era su una slide proiettata. Cinque lettori su cinque se ne sono
   accorti, e la chiarezza è l'unico asse che è SCESO fra il primo e il
   secondo giro.
   Due unità diverse, che è la ragione per cui si confondevano: i BLOCCHI
   dell'architettura (nove, tre cambiano) e i MODULI di prodotto (due escono,
   quattro entrano). Nominarle insieme in un posto solo è il modo di non
   poterle più mescolare. */
export const CONTEGGIO = {
  blocchi: {
    it: 'Tre blocchi su nove cambiano, e cinque restano come sono. Il nono è il gestionale clienti, e lo decide la vostra gara, non noi.',
    en: 'Three of nine blocks change, and five stay as they are. The ninth is the core customer system, and your tender decides it, not us.',
  },
  moduli: {
    it: 'Due prodotti escono, quattro moduli entrano',
    en: 'Two products go out, four modules come in',
  },
  righe: {
    it: 'Le prime due righe sostituiscono. Le altre due aggiungono l’arbitrato fra canali e la misura sul percorso, e si licenziano a parte.',
    en: 'The first two rows replace. The other two add arbitration across channels and journey-wide measurement, and are licensed separately.',
  },
} as const satisfies Record<string, Due>;

/** Le chiuse di capitolo che il taglio riprende. */
export const CHIUSE = {
  perimetro: {
    it: 'Il perimetro del cambiamento è la fascia di mezzo. Sopra e sotto non si tocca niente.',
    en: 'The change is confined to the middle band. Above and below, nothing is touched.',
  },
  /* ⚠️ CONTATO, non stimato. Nove blocchi: cinque restano, uno è in gara e
     non lo tocchiamo noi, due escono, uno entra. Quelli che tocchiamo sono
     tre. Le prime due versioni di questa riga — «sei su nove non si toccano»
     e «di nove, sette non li tocchiamo» — contavano male, e il secondo giro
     di revisione le ha prese entrambe. Qui vive una volta sola, così il
     taglio corto non può dire un numero diverso. */
  mappa: {
    it: 'Di nove blocchi, noi ne tocchiamo tre',
    en: 'Of nine blocks, we touch three',
  },
  controllo: {
    it: 'Il controllo non si perde: cambia posto. Si sposta dalla lista alla regola, e la regola la scrivete voi.',
    en: 'Control is not lost: it moves. From the list to the rule, and you write the rule.',
  },
  /* ⚠️ RISCRITTA DOPO UNA VERIFICA CHE HA DETTO IL CONTRARIO.
     Diceva «oggi in casa non ha un equivalente». Il comunicato del cliente
     del 23 novembre 2022 scrive che il suo motore di Marketing Automation
     «consente di calcolare dinamicamente la miglior proposta commerciale per
     ogni singolo cliente (Next Best Action)»: l'affermazione di assenza è
     smentita dalla fonte più forte che esista, la loro. Quello che resta vero
     è più preciso, e si porta come domanda. */
  terzoModulo: {
    it: 'Il vostro motore calcola già quale proposta fare a ogni cliente. La domanda è chi arbitra quando più proposte competono nello stesso momento.',
    en: 'Your engine already computes which offer fits each customer. The question is who arbitrates when several offers compete at the same moment.',
  },
} as const satisfies Record<string, Due>;

/** Il modello di costo: titolo e le due righe che muovono il conto. */
export const COSTO = {
  titolo: {
    it: 'Si paga su quanto si usa, non su quante persone lo usano',
    en: 'You pay on how much is used, not on how many people use it',
  },
  alza: {
    it: 'Il conto sale se portiamo dentro dati che potevano restare nella vostra piattaforma: per questo le due domande di prima vanno chiuse.',
    en: 'The bill rises if we bring in data that could have stayed in your own platform: that is why the two earlier questions must be closed.',
  },
  abbassa: {
    it: 'Partire da un canale e un percorso: si paga il perimetro acceso, non quello previsto.',
    en: 'Starting from one channel and one journey: you pay for what is switched on, not for what is planned.',
  },
  cifra: {
    it: 'Senza quei cinque dati vi diamo un intervallo, non un prezzo.',
    en: 'Without those five inputs we give you a range, not a price.',
  },
} as const satisfies Record<string, Due>;

/** L’ask: sta in UN posto solo. Due versioni della richiesta sono il modo più
 *  rapido di sembrare confusi davanti a un cliente. */
export const ASK = {
  titolo: {
    it: 'Mezza giornata, con chi conosce i vostri sistemi',
    en: 'Half a day, with the people who know your systems',
  },
  riga: {
    it: 'Tre blocchi cambiano, il resto resta vostro. Il passo successivo è mezza giornata sui vostri sistemi.',
    en: 'Three blocks change, the rest stays yours. The next step is half a day on your systems.',
  },
} as const satisfies Record<string, Due>;

/* ══════════════════════════════════════════════════════════════════════
   I DRIVER DEL COSTO — cinque, e vivono qui perché li leggono due pagine.
   ⚠️ Erano quattro, in una lista scritta dentro `valore.astro`, e il taglio
   ne teneva una copia a mano nella sua slide del costo. Tre righe su quattro
   non reggevano alla descrizione di prodotto: la personalizzazione si
   licenzia sul traffico (pagine viste all'anno, oppure chiamate al server) e
   quella grandezza mancava; «assistito» non è una voce di canale; e la
   conservazione del dato pesa quanto il volume ingerito. Un driver sbagliato
   non è un dettaglio: è una cifra costruita sulla metrica sbagliata, e si
   deve ritirare davanti alle stesse persone.
   ══════════════════════════════════════════════════════════════════════ */
export interface Driver {
  k: Due;
  d: Due;
  s: Due;
  /** La forma breve per il taglio: un campo ACCANTO al nome lungo, non
      un'altra voce, così le due pagine non possono dire grandezze diverse. */
  b: Due;
}

export const DRIVER: Driver[] = [
  {
    k: { it: 'Quanti profili', en: 'How many profiles' },
    d: { it: 'I profili ingaggiabili: è la metrica con cui si fattura la regia, e l’arbitro usa la stessa.', en: 'Engageable profiles: the billing metric for orchestration, and the arbiter uses the same one.' },
    s: { it: 'Serve: quante persone contattabili, per canale.', en: 'Needed: how many contactable people, per channel.' },
    b: { it: 'profili ingaggiabili', en: 'engageable profiles' },
  },
  {
    k: { it: 'Quali canali', en: 'Which channels' },
    d: { it: 'Posta, mobile e web sono voci separate; esiste anche la voce unica che li comprende tutti.', en: 'Email, mobile and web are separate line items; there is also a single all-channel item.' },
    s: { it: 'Serve: su quali canali si parte, e in che ordine.', en: 'Needed: which channels start, and in what order.' },
    b: { it: 'quali canali si accendono', en: 'which channels switch on' },
  },
  {
    k: { it: 'Quanto traffico', en: 'How much traffic' },
    d: { it: 'La personalizzazione si licenzia sul traffico: le pagine viste in un anno, o le chiamate al server.', en: 'Personalisation is licensed on traffic: annual page views, or server calls.' },
    s: { it: 'Serve: le pagine viste di sito e area riservata in un anno.', en: 'Needed: a year of page views on the site and the logged-in area.' },
    b: { it: 'pagine viste all’anno', en: 'annual page views' },
  },
  {
    k: { it: 'Quante righe di dato', en: 'How many rows of data' },
    d: { it: 'La misura si licenzia sul volume ingerito e sulla finestra di conservazione, non sul numero di report.', en: 'Measurement is licensed on ingested volume and retention window, not on report count.' },
    s: { it: 'Serve: il volume di eventi digitali in un anno, e per quanti mesi vanno tenuti.', en: 'Needed: a year of digital event volume, and how many months it must be kept.' },
    b: { it: 'righe di dato e conservazione', en: 'rows of data and retention' },
  },
  {
    k: { it: 'Quanti invii', en: 'How many sends' },
    d: { it: 'I volumi annui per canale, con i picchi dichiarati: è la parte che si sottostima sempre.', en: 'Annual volumes per channel, with peaks declared: the part always underestimated.' },
    s: { it: 'Serve: gli invii dell’ultimo anno, mese per mese.', en: 'Needed: last year’s sends, month by month.' },
    b: { it: 'volumi di invio', en: 'send volumes' },
  },
];
