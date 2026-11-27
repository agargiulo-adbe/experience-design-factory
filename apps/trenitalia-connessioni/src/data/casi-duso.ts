/**
 * I casi d'uso, in un posto solo.
 *
 * PERCHÉ ESISTE QUESTA SEZIONE
 * Chiesta dal Direttore dei canali digitali il 27 ottobre 2026: un quadro di
 * quattro o cinque casi d'uso importanti, con l'obiettivo dichiarato di
 * vendere di più. Nella stessa riunione ha posto due volte lo stesso vincolo
 * — non vuole comprare la tecnologia e doversi poi costruire tutto da solo —
 * ed è il motivo per cui ogni caso qui porta anche il lato di chi lo prepara.
 *
 * L'ORDINE NON È CASUALE: è il suo schema, non il nostro. Nella stessa
 * riunione ha descritto due sole strade per vendere di più — far entrare più
 * persone nel negozio, oppure convertire meglio chi è già entrato. Quindi i
 * casi si raggruppano in `leva`: `conversione` e `traffico`.
 *
 * TRE PASSI IN FILA (riordinati il 23 nov 2026, dopo la call con il partner)
 * Il piano per il responsabile dei canali digitali va per tappe, e ogni tappa
 * tiene quello che c'era prima:
 *   a · il primo passo: CJA su trenitalia.com, Adobe Target su trenitalia.com;
 *   b · l'acquisto e lo status: si lavora da subito, in parallelo. Si lega la
 *       vendita alla ricerca sulla pagina di conferma, senza toccare la
 *       piattaforma di vendita, e la stessa pagina porta il codice cliente: è lì
 *       che lo status CartaFreccia del CRM si lega al visitatore. Aspetta la
 *       verifica con il partner, il DPO e la sicurezza IT;
 *   c · Le Frecce e l'app: il percorso intero su Le Frecce, e Target anche lì e
 *       sull'app. Aspetta il nuovo portale di vendita, che prima non rilascia.
 * Fino al 22 nov il primo passo leggeva i due Analytics e il CRM veniva dopo. La
 * call del 23 nov l'ha rovesciato: su Le Frecce il partner misura solo la pagina
 * di conferma, e la piattaforma di vendita non rilascia prima del nuovo portale.
 * Il dettaglio tecnico sta nel documento di riconciliazione, fuori dal deck.
 * Ogni caso dichiara il passo da cui esiste; il passo b porta il caso Oro e la
 * misura sul venduto ai casi del primo.
 *
 * IL CRM È SCESO AL SECONDO PASSO LA SERA DEL 23 NOV. Verificato in Chromium: su
 * trenitalia.com non si fa login (area riservata e registrazione aprono
 * lefrecce.it; il form di login nell'HTML sta in un modale che nulla apre). Senza
 * una chiave sugli eventi del sito, lo status del CRM non si lega a nessuna visita.
 * La chiave nasce sulla pagina di conferma, se porta la traccia del sito e il
 * codice cliente. Altre chiavi possibili (l'email del riquadro «Cerca biglietto»,
 * un parametro nei link delle email CartaFreccia) stanno nel documento di
 * riconciliazione, come domande.
 *
 * RINUMERATO IL 26 NOV 2026 IN TRE FASI, dopo la call con il partner e l'AE:
 *   a · fase 0, Vista unica: i due Analytics in CJA, letti aggregati. Target
 *       prova varianti per tutti, senza pubblici. Resta il caso dell'area, che non
 *       ha bisogno di un pubblico;
 *   b · fase 1, la pagina di conferma: la traccia della ricerca passa a Le Frecce
 *       in un campo in più, e la conferma la riporta. Nascono i pubblici di
 *       visitatori, misurati sul venduto. Entra qui il caso di chi ha già cercato;
 *   c · fase 2, il login su trenitalia.com: l'unico identificativo persistente.
 *       Solo da qui il CRM serve (decisione dell'owner, 26 nov): lo status, il
 *       web e l'app della stessa persona, e Target su Le Frecce con il nuovo portale.
 * Nella stessa revisione, dalla call interna del 25 nov: gli abbonamenti diventano
 * «la home riconosce chi ha già cercato», Oro diventa lo status in generale,
 * «dal computer al telefono» diventa la stessa proposta sul sito e nell'app.
 *
 * Il caso «I clienti che avete in due» (clean room fra società) è uscito: non
 * è un caso su Target e sta nel capitolo «Metà invisibile», spento.
 */

/** Le fonti che un caso d'uso legge in CJA. */
export type Fonte = 'tcom' | 'frecce' | 'crm';

export const FONTI: { id: Fonte; nome: string; nota: string }[] = [
  { id: 'tcom', nome: 'trenitalia.com', nota: 'Adobe Analytics' },
  { id: 'frecce', nome: 'Le Frecce', nota: 'Adobe Analytics, web e app' },
  { id: 'crm', nome: 'CRM e fedeltà', nota: 'lo status, con un’estrazione' },
];

/** Dove Adobe Target cambia quello che si vede. */
export type Superficie = 'tcom' | 'frecce' | 'app';

/** Le tre configurazioni del piano. */
export type ConfigId = 'a' | 'b' | 'c';
export interface Config {
  id: ConfigId;
  /** L'ancora: il nome della configurazione, sei parole al massimo. */
  nome: string;
  /** Che cosa legge CJA. */
  legge: string;
  /** Dove agisce Target. */
  agisce: string;
  /** Da che cosa dipende. */
  serve: string;
  /** La stessa cosa in una riga, per la fascia sotto ogni caso. */
  serveBreve: string;
  /** Dove agisce Target, in breve: la testata della matrice. */
  breve: string;
  /** Quando: la riga sopra il nome della stazione, nello scambio. */
  quando: string;
  /** Le stesse due cose in pastiglie, per lo scambio: che cosa legge CJA, dove agisce Target. */
  leggeL: string[];
  agisceL: string[];
}
export const CONFIG: Config[] = [
  { id: 'a', nome: 'Fase 0 · Vista unica', quando: 'Si parte da qui', legge: 'i due Analytics, per giorno e per tratta', agisce: 'trenitalia.com, con prove per tutti', serve: 'i due Analytics in CJA; il via libera di FS Technology, di Le Frecce e del DPO', breve: 'prove per tutti', serveBreve: 'Si prova già oggi con Target. La lista delle tratte la approva il revenue management.', leggeL: ['trenitalia.com', 'Le Frecce e app, aggregati'], agisceL: ['trenitalia.com'] },
  { id: 'b', nome: 'Fase 1 · La conferma', quando: 'Dopo le prime letture', legge: 'chi ha cercato e poi ha comprato', agisce: 'trenitalia.com, con i pubblici', serve: 'prima la conferma legata, misurata in CJA senza licenze nuove; poi i pubblici verso Target, con una licenza di Real-Time CDP', breve: 'gruppi di visitatori', serveBreve: 'Un campo in più nel passaggio a Le Frecce, e Real-Time CDP per i gruppi.', leggeL: ['trenitalia.com', 'Le Frecce e app, aggregati', 'L’acquisto, legato alla ricerca'], agisceL: ['trenitalia.com'] },
  { id: 'c', nome: 'Fase 2 · Il login', quando: 'Con il login sul sito', legge: 'la stessa persona sui due siti, con lo status', agisce: 'trenitalia.com, Le Frecce e app', serve: 'il login su trenitalia.com e, per Le Frecce e l’app, il nuovo portale: decisioni del Gruppo', breve: 'il cliente, anche in app', serveBreve: 'Il login su trenitalia.com. Per Le Frecce e l’app, il nuovo portale.', leggeL: ['trenitalia.com', 'Le Frecce e app, aggregati', 'L’acquisto, legato alla ricerca', 'CRM e fedeltà', 'Le Frecce, il percorso'], agisceL: ['trenitalia.com', 'Le Frecce', 'App Trenitalia'] },
];

/** I passi sono in fila: un caso vale dal suo passo in poi. */
const ORDINE: Record<ConfigId, number> = { a: 0, b: 1, c: 2 };
export const valeIn = (c: { config: ConfigId }, k: ConfigId) => ORDINE[c.config] <= ORDINE[k];

/**
 * Un gesto e il prodotto che lo esegue. `skill` è il nome della skill di
 * Coworker che lo copre: non è un'etichetta nostra, è quello che la
 * documentazione pubblica elenca (vedi FONTI_COWORKER in fondo al file).
 */
export interface Passo {
  t: string;
  dove: 'CJA' | 'Target';
  skill: string;
}

/** Uno stadio del flusso: che cosa fa, e un esempio concreto di dato. */
export interface Stadio { k: string; v: string; e: string }

export interface Caso {
  id: string;
  /** La leva di vendita, con le sue parole: più gente dentro, o conversione migliore. */
  leva: 'conversione' | 'traffico';
  /** Il nome del caso. Sei parole al massimo: è un'ancora. */
  titolo: string;
  /** Una riga: che cosa cambia. */
  punto: string;
  /** Com'è oggi — e dove possibile sono parole loro, non nostre. */
  oggi: string;
  /** Che cosa vede il viaggiatore. È il lato visibile. */
  viaggiatore: string;
  /** Che cosa fa chi lavora in marketing. È il lato che decide se la cosa esiste. */
  marketer: string;
  /** Le fonti che CJA legge per questo caso. */
  fonti: Fonte[];
  /** La configurazione da cui il caso esiste. */
  config: ConfigId;
  /** Dove agisce Target. */
  superfici: Superficie[];
  /**
   * La sessione con Coworker: chi parla e che cosa dice. Alternata, perché è
   * una conversazione e non un elenco di gesti — ed è la scena `data-converse`
   * del motore, che fa comparire le bolle una alla volta dai due lati.
   */
  conversazione: { chi: 'utente' | 'coworker'; t: string }[];
  /**
   * Le informazioni di profilo che decidono che cosa viene mostrato. Tre,
   * perché il punto è «da questi tre attributi discende quella variante», non
   * fare l'inventario del profilo. Scena `data-clienteling`.
   */
  profilo: { k: string; v: string }[];
  /**
   * Le varianti in gioco: quello che vedrebbero profili diversi. Una sola
   * corrisponde a questo profilo e si afferma, le altre si smorzano — scena
   * `data-personalize`. Senza le alternative, «personalizzato» è una parola.
   */
  varianti: { t: string; n: string; match?: true }[];
  /**
   * La notifica che parte sull'app, e che sul web non esiste. È la differenza
   * vera fra i due canali: l'app RAGGIUNGE la persona, il sito può solo
   * rispondere quando lei arriva. Senza questa riga il commutatore App/Web
   * mostrerebbe due cornici diverse attorno allo stesso contenuto.
   */
  push: string;
  /**
   * Come passa da CJA a Target. Nei casi con un pubblico è la destinazione Target;
   * nel caso dell'area no: lì CJA dà le tratte, che diventano il contenuto, e l'area
   * la riconosce Target da sé. La figura del flusso lo scrive sul filo fra i due.
   */
  ponte: string;
  /** La pagina di oggi, nel mock: un titolo d'interfaccia e che cosa le manca. */
  oggiSchermo: { titolo: string; nota: string };
  /** Che cosa aggiunge CJA fra la fonte grezza e l'attivazione. Una riga. */
  arricchimento: string;
  /**
   * Il dietro le quinte, stadio per stadio, con un ESEMPIO per ciascuno. Senza
   * un dato vero accanto, «le fonti alimentano CJA che arricchisce e passa a
   * Target» è un diagramma che si può disegnare per qualunque prodotto di
   * qualunque fornitore: l'esempio è la differenza fra capire e annuire.
   * L'ultimo stadio — il ritorno della misura — sta volutamente in una riga:
   * è un anello di chiusura, non un quarto sistema.
   */
  flusso: [Stadio, Stadio, Stadio, Stadio];
  /**
   * Che cosa si vede davvero sulla pagina. Non è decorazione: un mockup di
   * rettangoli grigi fa vedere che «qualcosa cambia» e non dice che cosa, che
   * è esattamente la metà che a chi decide non interessa.
   */
  schermo: {
    /** La barra dell'indirizzo: dove succede. */
    dove: string;
    /** La riga che compare perché il gruppo è stato riconosciuto. */
    titolo: string;
    /** Le tessere che cambiano: una cosa e la sua cifra. */
    tessere: { t: string; n: string }[];
  };
  /**
   * I tre gesti, ciascuno col prodotto che lo esegue. Sono tre e non quattro
   * perché il quarto nessuno se lo ricorda, e il terzo — la misura — è quello
   * che rende la cosa una prova e non una scommessa.
   */
  passi: [Passo, Passo, Passo];
  /**
   * I KPI su cui il caso agisce. Tre, nel vocabolario di chi li guarda: sono
   * la risposta alla domanda «e questo che cosa muove?», che arriva sempre e
   * che un elenco di funzionalità non soddisfa.
   */
  kpi: [string, string, string];
  /**
   * Chi l'ha già fatto, e con che numero. La prova è PUBBLICA e il numero è
   * verbatim dalla pagina: se non si può citare col nome, non entra qui — si
   * racconta a voce. Volutamente fuori dal trasporto: non è stato chiesto un
   * concorrente, è stato chiesto che funzioni.
   *
   * Le fonti sono due, verificate il 28 ott 2026 aprendo ogni pagina:
   * **Telmore** (telco danese, 750.000 clienti) e **Santander** (banca). Il
   * numero di ciascun caso è quello che misura DAVVERO quella cosa, non il più
   * grosso disponibile: i banner personalizzati stanno sul caso della home, le
   * vendite incrociate sull'upgrade, il carrello abbandonato su chi torna, il
   * riconoscimento sui due casi che dipendono dal riconoscere.
   */
  prova?: { chi: string; settore: string; v: string; l: string; url: string };
  /**
   * Come si giudica il caso. `misura` è la misura del suo passo; `conAcquisto` è
   * quella che si aggiunge quando l'acquisto su Le Frecce è legato alla ricerca
   * (solo per i casi del primo passo, che non lo aspettano). Riordinato il 23 nov.
   */
  giudizio: { misura: string; conAcquisto?: string };
  /** Chi l'ha messo sul tavolo: `cliente` pesa molto più di `adobe`. */
  origine: 'cliente' | 'adobe';
}

export const CASI: Caso[] = [
  // ── Fase 0 · Vista unica ────────────────────────────────────────────
  {
    id: 'geo',
    leva: 'conversione',
    config: 'a',
    superfici: ['tcom'],
    titolo: 'La home con le tratte più cercate dall’area',
    punto: 'Target riconosce l’area da sé. La fase 0 aggiunge che cosa si cerca da lì.',
    // Esempio portato da loro il 27 ott; una prima versione con la
    // geolocalizzazione è già in produzione su trenitalia.com (dall'account, 16
    // nov). Il 27 nov, in Chromium, il pop-up non compariva e Target in home non
    // consegnava offerte: si dice che c'è stato, non che c'è. Nel primo passo le tratte sono le più CERCATE su trenitalia.com; le
    // più comprate arrivano con l'acquisto su Le Frecce (23 nov).
    oggi: 'Il pop‑up per area è andato in linea? Con che esito?',
    viaggiatore: 'In cima, le tratte più cercate da lì, fra quelle con posti.',
    marketer: 'Una regola per area di partenza, e le tratte più cercate da lì. Si prepara una volta e vale per tutte le città.',
    conversazione: [
      { chi: 'utente', t: 'Crea un gruppo per chi si collega dall’area di Verona e mostragli le tratte più cercate da lì.' },
      { chi: 'coworker', t: 'Ho letto le ricerche partite da quell’area su trenitalia.com. Preparo la bozza dell’attività?' },
      { chi: 'utente', t: 'Sì, in cima alla home, contro la home di oggi.' },
      { chi: 'coworker', t: 'Bozza pronta; la durata la stimiamo con il calcolatore di Target sul traffico dell’area. La approva il marketing, la pubblica il team Target.' },
    ],
    profilo: [
      { k: 'Area', v: 'Verona' },
      { k: 'Dispositivo', v: 'computer' },
    ],
    varianti: [
      { t: 'La home di oggi', n: 'offerta nazionale' },
      { t: 'Le tratte da Verona', n: 'Milano, Venezia, Roma', match: true },
    ],
    push: '',
    ponte: 'le tratte più cercate diventano il contenuto',
    oggiSchermo: { titolo: 'Le offerte del momento', nota: 'la stessa home in tutta Italia' },
    arricchimento: 'area di partenza e tratte più cercate da lì',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com', e: 'visite e ricerche partite dall’area di Verona' },
      { k: 'Customer Journey Analytics', v: 'ricava l’area e le tratte più cercate da lì', e: 'area: Verona · tratte più cercate: Milano, Venezia, Roma' },
      { k: 'Adobe Target', v: 'riconosce l’area e sceglie la variante', e: 'in cima alla home: le tre tratte da Verona, con il link alla ricerca' },
      { k: 'E torna indietro', v: 'il risultato si legge in CJA, nello stesso report', e: 'quante ricerche partono dalla home, e quanti cliccano su Acquista' },
    ],
    schermo: {
      dove: 'trenitalia.com',
      titolo: 'Da Verona',
      tessere: [
        { t: 'Milano Centrale', n: 'la più cercata' },
        { t: 'Venezia Santa Lucia', n: 'seconda' },
        { t: 'Roma Termini', n: 'terza' },
      ],
    },
    fonti: ['tcom'],
    passi: [
      { t: 'Il gruppo: chi si collega da una certa area', dove: 'Target', skill: 'target-audience-composer' },
      { t: 'Che cosa vede: le tratte da quella stazione', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti passano all’acquisto', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Ricerche avviate dalla home', 'Conferme per area, prima e dopo', 'Conversione per area, dalla fase 1'],
    giudizio: {
      misura: 'Ricerche avviate e clic verso l’acquisto di chi ha visto la variante, contro chi ha visto la home di oggi.',
      conAcquisto: 'Quante visite dei due gruppi arrivano alla conferma su Le Frecce.',
    },
    origine: 'cliente',
  },
  // ── Fase 1 · La conferma ────────────────────────────────────────────
  {
    id: 'interesse',
    leva: 'conversione',
    config: 'b',
    superfici: ['tcom'],
    // L'esempio è del cliente: il tempo passato su una sezione del sito dice che
    // cosa interessa, e da lì si costruisce il gruppo e l'azione (raccontato
    // dall'account, 16 nov). Non serve il login: basta che la persona torni. La
    // stessa misura scelta nel primo test su Target, le ricerche nella pagina
    // dell'offerta, regge senza l'acquisto (call del 23 nov).
    titolo: 'La home riconosce chi ha già cercato',
    punto: 'La tratta cercata e il dettaglio aperto dicono che cosa interessa, anche senza login.',
    oggi: 'Chi apre il dettaglio di un abbonamento e se ne va, alla visita dopo ritrova la home di chiunque.',
    viaggiatore: 'Alla visita dopo trova in cima l’abbonamento sulla tratta che cercava.',
    marketer: 'Un gruppo costruito su un gesto preciso, l’apertura del dettaglio, e sulla tratta cercata. Si prepara una volta.',
    conversazione: [
      { chi: 'utente', t: 'Trova chi ha aperto il dettaglio di un abbonamento e non l’ha comprato.' },
      { chi: 'coworker', t: 'Trovato il gruppo, quasi tutto senza login. Preparo la bozza dell’attività?' },
      { chi: 'utente', t: 'Sì: alla visita dopo, in cima, l’abbonamento sulla tratta che cercava.' },
      { chi: 'coworker', t: 'Bozza pronta. La approva il marketing, la pubblica il team Target.' },
    ],
    profilo: [
      { k: 'Login', v: 'no' },
      { k: 'Ha aperto', v: 'Abbonamento mensile' },
      { k: 'Tratta cercata', v: 'Bologna → Firenze' },
    ],
    varianti: [
      { t: 'La home di oggi', n: 'partenza vuota' },
      { t: 'L’abbonamento sulla sua tratta', n: 'Bologna → Firenze', match: true },
    ],
    push: '',
    ponte: 'il pubblico passa a Target, dalla visita successiva',
    oggiSchermo: { titolo: 'La home di sempre', nota: 'dell’abbonamento aperto ieri non resta traccia' },
    arricchimento: 'il dettaglio aperto e la tratta cercata',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com', e: 'apertura del dettaglio «Abbonamento mensile» · ricerca Bologna → Firenze' },
      { k: 'Customer Journey Analytics', v: 'tiene insieme le visite dello stesso browser su trenitalia.com', e: 'ha aperto il dettaglio, non ha comprato · tratta: Bologna → Firenze' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie fra le varianti', e: 'alla visita dopo, in cima: l’abbonamento su Bologna → Firenze' },
      { k: 'E torna indietro', v: 'il risultato si legge in CJA, nello stesso report', e: 'quante visite del gruppo arrivano alla conferma su Le Frecce' },
    ],
    schermo: {
      dove: 'trenitalia.com',
      titolo: 'Bologna → Firenze, ogni giorno',
      tessere: [
        { t: 'Abbonamento mensile', n: 'sulla tua tratta' },
        { t: 'Sulla tratta cercata', n: 'il mese intero' },
        { t: 'Rinnovo', n: 'online' },
      ],
    },
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: chi ha letto e non ha comprato', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: l’abbonamento sulla sua tratta', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti passano all’acquisto', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Clic verso l’acquisto', 'Visite che arrivano alla conferma', 'Ritorno sulla stessa tratta'],
    giudizio: {
      misura: 'Le visite del gruppo esposto che arrivano alla conferma, contro un gruppo di controllo fisso. Quale abbonamento, solo se la conferma porta anche il prodotto.',
    },
    origine: 'cliente',
  },

  // ── Fase 2 · Il login ───────────────────────────────────────────────
  {
    id: 'oro',
    leva: 'conversione',
    config: 'c',
    superfici: ['tcom'],
    // CartaFreccia prosegue dal 1° gen 2027 con la Nuova Operazione a Premi: status
    // Argento, Oro, Platino e Platino Infinito confermati, soglie nuove in punti
    // status (Oro a 60.000). Verificato su trenitalia.com il 22 nov 2026. Dalla sera
    // del 23 nov sta nel secondo passo: su trenitalia.com non c'è login, e lo status
    // si lega al visitatore sulla pagina di conferma d'acquisto, che porta il codice
    // cliente. Vale per chi ha comprato con il login, dallo stesso browser.
    // DAL 26 NOV STA NELLA FASE 2: il CRM entra con il login su trenitalia.com,
    // che è l'unico identificativo persistente (decisione dell'owner).
    titolo: 'Lo status fedeltà, riconosciuto al ritorno',
    punto: 'Lo status sta nel programma fedeltà, e alla pagina non arriva.',
    oggi: 'Chi ha lo status Oro, quando entra, vede la stessa pagina di chi viaggia una volta l’anno.',
    viaggiatore: 'Quando torna sul sito trova i vantaggi compresi nel suo status, prima di uno sconto.',
    marketer: 'Il livello arriva dal CRM e si lega con il login: decide che cosa si mostra, senza una campagna a parte.',
    conversazione: [
      { chi: 'utente', t: 'Chi ha lo status Oro: mostragli i vantaggi del suo status, prima di uno sconto.' },
      { chi: 'coworker', t: 'Uso lo status come gruppo. Preparo la bozza dell’attività?' },
      { chi: 'utente', t: 'Sì, e senza una campagna a parte.' },
      { chi: 'coworker', t: 'Bozza pronta. La approva il marketing, la pubblica il team Target.' },
    ],
    profilo: [
      { k: 'Status', v: 'Oro' },
      { k: 'Punti status', v: 'sopra la soglia Oro' },
      { k: 'Tratta abituale', v: 'Roma → Milano' },
    ],
    varianti: [
      { t: 'Un’offerta uguale per tutti', n: 'esempio' },
      { t: 'I vantaggi del suo status', n: 'come da regolamento 2027', match: true },
    ],
    push: '',
    ponte: 'il pubblico passa a Target, con lo status',
    oggiSchermo: { titolo: 'Le offerte del momento', nota: 'la stessa pagina di chi viaggia una volta l’anno' },
    arricchimento: 'lo status CartaFreccia, che arriva dal CRM',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com, il login e il CRM', e: 'il login su trenitalia.com porta il codice cliente: «status Oro»' },
      { k: 'Customer Journey Analytics', v: 'porta lo status accanto al comportamento sul sito', e: 'status Oro · tratta abituale Roma → Milano' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie fra le varianti', e: 'mostra i vantaggi del suo livello, prima di uno sconto' },
      { k: 'E torna indietro', v: 'il risultato si legge in CJA, nello stesso report', e: 'ritorno nel tempo, e clic sui vantaggi' },
    ],
    schermo: {
      dove: 'trenitalia.com · home',
      titolo: 'I vantaggi dello status Oro',
      tessere: [
        { t: 'Ingresso FrecciaLounge', n: 'con lo status' },
        { t: 'I vantaggi del livello', n: 'dal regolamento 2027' },
        { t: 'Prima di uno sconto', n: 'non al suo posto' },
      ],
    },
    fonti: ['tcom', 'crm'],
    passi: [
      { t: 'Il gruppo: lo status, dal CRM', dove: 'Target', skill: 'target-audience-composer' },
      { t: 'Che cosa vede: i servizi compresi', dove: 'Target', skill: 'target-design' },
      { t: 'La misura: ritorno e clic sui vantaggi', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
    ],
    kpi: ['Ricavo in più dei clienti esposti, al netto dei benefici', 'Ritorno nel tempo', 'Clic sui vantaggi compresi'],
    giudizio: {
      misura: 'Ricavo incrementale netto dei clienti esposti rispetto al controllo, al netto del costo dei benefici; i vantaggi si allineano al regolamento 2027.',
    },
    origine: 'adobe',
  },

  {
    id: 'upgrade',
    leva: 'conversione',
    config: 'c',
    superfici: ['frecce', 'app'],
    titolo: 'L’upgrade che oggi si offre a tutti',
    punto: 'Target sceglie a chi mostrarlo; prezzo e posti li decide il revenue management.',
    // Dalla sintesi d'account del 27 ott: oggi la proposta di passaggio a
    // classe superiore va a tutti i viaggiatori, non su base propensione. Si
    // mostra dopo l'acquisto, quindi su Le Frecce e sull'app.
    oggi: 'Il passaggio al livello di servizio superiore si propone a tutti i viaggiatori: è ancora così?',
    viaggiatore: 'Chi viaggia spesso in Standard trova, dopo l’acquisto, l’offerta di upgrade già prezzata.',
    marketer: 'Il gruppo esce dagli acquisti, Standard e alta frequenza. L’offerta, il prezzo e i treni li fissa il revenue management.',
    conversazione: [
      { chi: 'utente', t: 'Chi viaggia in Standard due volte al mese: mostragli l’upgrade che il revenue management ha prezzato.' },
      { chi: 'coworker', t: 'Trovato il gruppo. Uso solo i treni e il prezzo del feed di vendita?' },
      { chi: 'utente', t: 'Sì, con un tetto di frequenza costruito con uno script di profilo in Target.' },
      { chi: 'coworker', t: 'Bozza pronta per Le Frecce e l’app. La approva il revenue management, la pubblica il team Target.' },
    ],
    profilo: [
      { k: 'Classe', v: 'sempre Standard' },
      { k: 'Viaggi', v: '2 al mese' },
      { k: 'Treno', v: 'nel feed delle offerte' },
    ],
    varianti: [
      { t: 'La proposta di oggi', n: 'uguale per tutti' },
      { t: 'Upgrade in Business', n: 'al prezzo fissato', match: true },
    ],
    push: '',
    ponte: 'il pubblico passa a Target, su Le Frecce e in app',
    oggiSchermo: { titolo: 'Passa in Business', nota: 'la stessa proposta a ogni viaggiatore' },
    arricchimento: 'frequenza di viaggio e livello di servizio abituale',
    flusso: [
      { k: 'Le fonti', v: 'gli acquisti su Le Frecce e il feed delle offerte', e: 'biglietti Standard su Roma → Milano · upgrade prezzato dal revenue management' },
      { k: 'Customer Journey Analytics', v: 'mette in fila gli acquisti e ricava l’abitudine', e: 'due viaggi al mese, sempre in Standard' },
      { k: 'Adobe Target', v: 'sceglie a chi mostrare l’offerta, su Le Frecce e in app', e: 'l’upgrade in Business, al prezzo del feed' },
      { k: 'Richiede in più', v: 'il feed delle offerte e il sì del revenue management', e: 'ricavo in più per posto-km, contro un gruppo di controllo' },
    ],
    schermo: {
      dove: 'Le Frecce · il tuo viaggio', // copy-audit-ignore — etichetta d'interfaccia dentro il mock, non voce del deck
      titolo: 'Passa in Business su questo treno',
      tessere: [
        { t: 'Il suo biglietto', n: 'Standard' },
        { t: 'L’offerta', n: 'Business' },
        { t: 'Prezzo', n: 'dal revenue management' },
      ],
    },
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: sempre Standard, alta frequenza', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: l’upgrade già prezzato', dove: 'Target', skill: 'target-design' },
      { t: 'La misura: ricavo in più, contro un controllo', dove: 'CJA', skill: 'target-test-calculator' },
    ],
    kpi: ['Ricavo in più per cliente, contro un gruppo di controllo', 'Quota di chi avrebbe comprato comunque', 'Posti in upgrade, sotto il tetto del revenue management'],
    giudizio: {
      misura: 'Ricavo netto per posto-km e riempimento della Business, fra treni con l’offerta e treni senza; il tetto di posti lo fissa il revenue management.',
    },
    origine: 'cliente',
  },
  {
    id: 'app',
    leva: 'conversione',
    config: 'c',
    superfici: ['app'],
    titolo: 'La stessa proposta sul sito e nell’app',
    punto: 'Quello che si è cercato sul sito torna in cima all’app, con la stessa proposta.',
    oggi: 'Il sito e l’app non si parlano: chi ha cercato una tratta la sera, la mattina sul telefono ricomincia da capo.',
    viaggiatore: 'Aprendo l’app trova in cima la tratta cercata sul computer.',
    marketer: 'Il legame lo fa il login. Un gruppo, «ha cercato sul web e non ha comprato», portato sull’app.',
    conversazione: [
      { chi: 'utente', t: 'Chi ha cercato una tratta su trenitalia.com e non l’ha comprata: riproponila quando apre l’app.' },
      { chi: 'coworker', t: 'Se il login è lo stesso sul web e sull’app, li riconosco. Preparo la bozza?' },
      { chi: 'utente', t: 'Sì, in cima alla home dell’app.' },
      { chi: 'coworker', t: 'Bozza pronta. La approva il marketing, la pubblica il team Target.' },
    ],
    profilo: [
      { k: 'Login', v: 'sì, sul web e in app' },
      { k: 'Cercava', v: 'Bologna → Firenze' },
      { k: 'Dispositivo', v: 'computer, giorni prima' },
    ],
    varianti: [
      { t: 'La home di oggi', n: 'partenza vuota' },
      { t: 'La tratta cercata', n: 'Bologna → Firenze', match: true },
    ],
    push: '',
    ponte: 'il pubblico passa a Target, nell’app',
    oggiSchermo: { titolo: 'Dove vuoi andare?', nota: 'la ricerca riparte da capo' },
    arricchimento: 'la stessa persona sul web e sull’app, legata dal login',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com e l’app Trenitalia', e: 'ricerca sul computer: «Bologna → Firenze»' },
      { k: 'Customer Journey Analytics', v: 'lega il web e l’app della stessa persona, con il login', e: 'ha cercato, non ha comprato · stessa persona sull’app' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie la variante, in app', e: 'in cima all’app: la tratta cercata' },
      { k: 'Richiede in più', v: 'Target nell’app: versione dell’SDK mobile ed eventuale rilascio dell’app, da confermare', e: 'il pubblico si aggiorna a intervalli: vale dalle aperture successive' },
    ],
    schermo: {
      dove: 'app Trenitalia',
      titolo: 'Riprendi da dove\u00a0eri', // copy-audit-ignore — etichetta d'interfaccia dentro il mock
      tessere: [
        { t: 'Bologna → Firenze', n: 'cercata sul computer' },
        { t: 'Data che guardava', n: 'la stessa' },
        { t: 'Acquisto', n: 'in due tocchi' },
      ],
    },
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: ha cercato sul web, non ha comprato', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: la tratta che cercava', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti comprano entro tre giorni', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Acquisti ripresi', 'Conversione in app', 'Tempo fra ricerca e acquisto'],
    giudizio: {
      misura: 'Acquisti in app del gruppo esposto entro una settimana, contro un gruppo di controllo fisso.',
    },
    origine: 'adobe',
  },
];

/**
 * La referenza pubblica che regge il capitolo. Brightline è l'unico operatore
 * ferroviario con una storia Adobe PUBBLICA e numeri citabili: alta velocità,
 * posizionamento premium, la stessa combinazione di strumenti. Gli altri casi
 * che abbiamo (una compagnia aerea americana, un operatore ferroviario
 * nordamericano, un portale di viaggi) stanno in materiale riservato: si
 * raccontano senza nome, e senza cifre che non siano pubbliche.
 */
/**
 * Le fonti che il capitolo cita, verificate il 28 ott 2026 aprendo ogni pagina.
 *
 * Le due del cliente servono a non sbagliare i nomi dei suoi servizi — ed è
 * così che è saltata fuori la cosa che conta di più in questo capitolo:
 * **CartaFreccia chiude il 31 dicembre 2026**, i punti si spendono entro il
 * 31 marzo 2027, e per l'alta velocità non risulta annunciato un sostituto.
 * Non è «non ci sarà»: è «non è stato detto», e si chiede.
 *
 * Le due di Adobe reggono la riga «lo chiedi a parole»: le skill nominate
 * accanto ai gesti sono quelle che la documentazione pubblica elenca, non
 * etichette nostre.
 */
export const FONTI_CAPITOLO = [
  {
    cosa: 'Status CartaFreccia Oro e vantaggi',
    url: 'https://www.trenitalia.com/it/cartafreccia/scopri-gli-status-cartafreccia/cartafreccia-oro.html',
  },
  {
    cosa: 'CartaFreccia dal 1° gennaio 2027: status confermati, soglie nuove',
    url: 'https://www.trenitalia.com/it/cartafreccia/cartafreccia-2027.html',
  },
  {
    cosa: 'Coworker Chat, le skill su Target e sui segmenti',
    url: 'https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows',
  },
  {
    cosa: 'Coworker dentro Customer Journey Analytics, limiti compresi',
    url: 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/coworker',
  },
];

export const RIFERIMENTO = {
  nome: 'Brightline',
  cosa: 'Operatore ferroviario ad alta velocità che legge il viaggio con Customer Journey Analytics. Target non fa parte del suo insieme di prodotti.',
  // Dal panel del 26 nov 2026: la cifra del 95% è una quota della crescita, non un
  // effetto dei prodotti, e Brightline non usa Target. Resta come esempio di
  // prodotto, senza numeri.
  numeri: [] as { v: string; l: string }[],
  url: 'https://business.adobe.com/customer-success-stories/brightline.html',
  // Verificato il 28 ott 2026 sulla pagina stessa: «70% reduction in time to
  // book in-app», «95% of revenue growth now comes from digital channels»,
  // «618% increase in traffic from unbranded organic search». I prodotti che la
  // pagina dichiara sono RTCDP, CJA, AJO, AEM Sites e Assets — la stessa
  // combinazione di cui parla Convergenza, ed è il motivo per cui regge qui.
};
