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
 * TRE CONFIGURAZIONI, NON DUE PERIMETRI (22 nov 2026)
 * Il piano per il responsabile dei canali digitali parte da una base sola e si
 * allarga in due direzioni che non dipendono l'una dall'altra:
 *   a · il primo passo: CJA sugli Analytics di trenitalia.com e di Le Frecce
 *       (web e app), Adobe Target su trenitalia.com;
 *   b · con il CRM: lo stesso, più il livello del cliente. Aspetta il DPO;
 *   c · Target anche su Le Frecce e sull'app. Aspetta chi sviluppa Le Frecce.
 * Ogni caso dichiara la configurazione da cui esiste. La matrice lo fa vedere:
 * due casi dal primo passo, uno con il CRM, due con Target su Le Frecce e app.
 * Prima i perimetri erano due, uno per interlocutore: ora sono tappe dello
 * stesso piano, così chi legge vede dove sta oggi e che cosa guadagna dopo.
 *
 * Il caso «I clienti che avete in due» (clean room fra società) è uscito: non
 * è un caso su Target e sta nel capitolo «Metà invisibile», spento.
 */

/** Le fonti che un caso d'uso legge in CJA. */
export type Fonte = 'tcom' | 'frecce' | 'crm';

export const FONTI: { id: Fonte; nome: string; nota: string }[] = [
  { id: 'tcom', nome: 'trenitalia.com', nota: 'Adobe Analytics' },
  { id: 'frecce', nome: 'Le Frecce', nota: 'Adobe Analytics, web e app' },
  { id: 'crm', nome: 'CRM e fedeltà', nota: 'il livello del cliente' },
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
  /** Dove agisce Target, in breve: la testata della matrice. */
  breve: string;
}
export const CONFIG: Config[] = [
  { id: 'a', nome: 'Il primo passo', legge: 'trenitalia.com e Le Frecce', agisce: 'trenitalia.com', serve: 'la verifica sui due siti, già in corso', breve: 'Target su trenitalia.com' },
  { id: 'b', nome: 'Con il CRM', legge: 'anche il livello del cliente', agisce: 'trenitalia.com', serve: 'il parere del DPO', breve: 'più il livello del cliente' },
  { id: 'c', nome: 'Su Le Frecce e app', legge: 'trenitalia.com e Le Frecce', agisce: 'trenitalia.com, Le Frecce e app', serve: 'chi sviluppa Le Frecce e l’app', breve: 'Target anche fuori dal sito' },
];

/** Un caso del primo passo vale in tutte e tre; gli altri solo nella loro. */
export const valeIn = (c: { config: ConfigId }, k: ConfigId) => c.config === 'a' || c.config === k;

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
   * Come si giudica il caso. `chiude` vale se la verifica sui due siti riconosce la
   * stessa persona; `aperta` è la misura di ripiego se resta aperta (solo per i casi
   * del primo passo, che non devono aspettarla). Panel del 22 nov 2026.
   */
  giudizio: { chiude: string; aperta?: string };
  /** Chi l'ha messo sul tavolo: `cliente` pesa molto più di `adobe`. */
  origine: 'cliente' | 'adobe';
}

export const CASI: Caso[] = [
  // ── Il primo passo ──────────────────────────────────────────────────
  {
    id: 'geo',
    leva: 'conversione',
    config: 'a',
    superfici: ['tcom'],
    titolo: 'La home sa da dove parti',
    punto: 'Target riconosce da sé l’area; CJA aggiunge le tratte comprate davvero da chi parte da lì.',
    // Esempio portato da loro il 27 ott; una prima versione con la
    // geolocalizzazione è già in produzione su trenitalia.com (dall'account, 16
    // nov). Le tratte «più comprate da lì» sono il pezzo che porta Le Frecce:
    // vale anche in aggregato, senza riconoscere la persona.
    oggi: 'Una prima versione c’è già, con un pop-up sopra la pagina. Il passo dopo è che si adattino i componenti della home.',
    viaggiatore: 'La prima schermata porta le tratte più comprate da dove si trova. Il prezzo resta quello corrente, uguale per tutti.',
    marketer: 'Una regola per area di partenza, e le tratte più comprate da lì. Si prepara una volta e vale per tutte le città.',
    conversazione: [
      { chi: 'utente', t: 'Crea un gruppo per chi si collega dall’area di Verona e mostragli le tratte più comprate da lì.' },
      { chi: 'coworker', t: 'Ho letto le tratte sugli acquisti di Le Frecce, in aggregato. Preparo la bozza dell’attività?' },
      { chi: 'utente', t: 'Sì, in cima alla home, contro la home di oggi.' },
      { chi: 'coworker', t: 'Bozza pronta, con la durata calcolata sul traffico dell’area. La approva e la pubblica il team Target.' },
    ],
    profilo: [
      { k: 'Area', v: 'Verona' },
      { k: 'Dispositivo', v: 'computer' },
      { k: 'Ultima ricerca', v: 'Milano' },
    ],
    varianti: [
      { t: 'La home di oggi', n: 'offerta nazionale' },
      { t: 'Le tratte da Verona', n: 'Milano, Venezia, Roma', match: true },
    ],
    push: '',
    arricchimento: 'area di partenza e tratte più comprate da lì',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com e Le Frecce', e: 'visita da Verona su trenitalia.com · acquisti partiti da Verona su Le Frecce' },
      { k: 'Customer Journey Analytics', v: 'ricava l’area e le tratte più comprate da lì', e: 'area: Verona · tratte più comprate: Milano, Venezia, Roma' },
      { k: 'Adobe Target', v: 'riconosce l’area e sceglie la variante', e: 'in cima alla home: le tre tratte da Verona, al prezzo corrente' },
      { k: 'E torna indietro', v: 'il risultato si legge in CJA, nello stesso report', e: 'quanti arrivano all’acquisto su Le Frecce' },
    ],
    schermo: {
      dove: 'trenitalia.com',
      titolo: 'Da Verona Porta Nuova',
      tessere: [
        { t: 'Milano Centrale', n: 'la più comprata' },
        { t: 'Venezia Santa Lucia', n: 'seconda' },
        { t: 'Roma Termini', n: 'terza' },
      ],
    },
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: chi si collega da una certa area', dove: 'Target', skill: 'target-audience-composer' },
      { t: 'Che cosa vede: le tratte da quella stazione', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti arrivano all’acquisto', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Conversione dalla home', 'Ricerche avviate', 'Vendite per area'],
    giudizio: {
      chiude: 'Acquisti su Le Frecce di chi ha visto la variante, contro chi ha visto la home di oggi.',
      aperta: 'Ricerche avviate e passaggi verso Le Frecce, per gruppo; l’acquisto si legge in aggregato.',
    },
    origine: 'cliente',
  },
  {
    id: 'interesse',
    leva: 'conversione',
    config: 'a',
    superfici: ['tcom'],
    // L'esempio è del cliente: il tempo passato su una sezione del sito dice che
    // cosa interessa, e da lì si costruisce il gruppo e l'azione (raccontato
    // dall'account, 16 nov). Non serve il login: basta che la persona torni.
    titolo: 'Chi legge gli abbonamenti e non compra',
    punto: 'Chi apre il dettaglio di un abbonamento dice che cosa gli interessa, anche senza login.',
    oggi: 'Chi apre il dettaglio di un abbonamento e se ne va, alla visita dopo ritrova la home di chiunque.',
    viaggiatore: 'Alla visita dopo trova in cima l’abbonamento sulla tratta che cercava, e quanto spende in meno al mese.',
    marketer: 'Un gruppo costruito su un gesto preciso, l’apertura del dettaglio, e sulla tratta cercata. Si prepara una volta.',
    conversazione: [
      { chi: 'utente', t: 'Trova chi ha aperto il dettaglio di un abbonamento e non l’ha comprato.' },
      { chi: 'coworker', t: 'Trovato il gruppo, quasi tutto senza login. Preparo la bozza dell’attività?' },
      { chi: 'utente', t: 'Sì: alla visita dopo, in cima, l’abbonamento sulla tratta che cercava.' },
      { chi: 'coworker', t: 'Bozza pronta. La approva e la pubblica il team Target.' },
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
    arricchimento: 'il dettaglio aperto e la tratta cercata',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com e Le Frecce', e: 'apertura del dettaglio «Abbonamento mensile» · ricerca Bologna → Firenze' },
      { k: 'Customer Journey Analytics', v: 'tiene insieme le visite dello stesso browser su trenitalia.com', e: 'ha aperto il dettaglio, non ha comprato · tratta: Bologna → Firenze' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie fra le varianti', e: 'alla visita dopo, in cima: l’abbonamento su Bologna → Firenze' },
      { k: 'E torna indietro', v: 'il risultato si legge in CJA, nello stesso report', e: 'quanti comprano l’abbonamento su Le Frecce' },
    ],
    schermo: {
      dove: 'trenitalia.com',
      titolo: 'Bologna → Firenze, ogni giorno',
      tessere: [
        { t: 'Abbonamento mensile', n: 'sulla tua tratta' },
        { t: 'Viaggi in un mese', n: 'senza limiti' },
        { t: 'Rinnovo', n: 'online' },
      ],
    },
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: chi ha letto e non ha comprato', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: l’abbonamento sulla sua tratta', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti lo comprano', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Abbonamenti venduti', 'Conversione dei non loggati', 'Ritorno entro 7 giorni'],
    giudizio: {
      chiude: 'Abbonamenti comprati su Le Frecce dal gruppo esposto, contro un gruppo di controllo fisso.',
      aperta: 'Clic verso l’acquisto dell’abbonamento su trenitalia.com, per gruppo; l’acquisto si legge in aggregato.',
    },
    origine: 'cliente',
  },

  // ── Con il CRM ──────────────────────────────────────────────────────
  {
    id: 'oro',
    leva: 'conversione',
    config: 'b',
    superfici: ['tcom'],
    // CartaFreccia prosegue dal 1° gen 2027 con la Nuova Operazione a Premi: status
    // Argento, Oro, Platino e Platino Infinito confermati, soglie nuove in punti
    // status (Oro a 60.000). Verificato su trenitalia.com il 22 nov 2026.
    titolo: 'Il cliente Oro, riconosciuto al login',
    punto: 'Il livello del cliente sta nel CRM, e alla pagina non arriva.',
    oggi: 'Chi ha lo status Oro, quando entra, vede la stessa pagina di chi viaggia una volta l’anno.',
    viaggiatore: 'Al login trova i vantaggi compresi nel suo status, prima di uno sconto.',
    marketer: 'Il livello arriva dal CRM come attributo e decide che cosa si mostra, senza una campagna a parte.',
    conversazione: [
      { chi: 'utente', t: 'Chi ha lo status Oro: mostragli i vantaggi del suo status, prima di uno sconto.' },
      { chi: 'coworker', t: 'Uso lo status che arriva dal CRM come attributo. Preparo la bozza dell’attività?' },
      { chi: 'utente', t: 'Sì, e senza una campagna a parte.' },
      { chi: 'coworker', t: 'Bozza pronta. La approva e la pubblica il team Target.' },
    ],
    profilo: [
      { k: 'Status', v: 'Oro' },
      { k: 'Punti status', v: 'sopra la soglia Oro' },
      { k: 'Tratta abituale', v: 'Roma → Milano' },
    ],
    varianti: [
      { t: 'Sconto sul biglietto', n: '−10%' },
      { t: 'I vantaggi del suo status', n: 'FrecciaLounge, Fast Track', match: true },
      { t: 'Invito a iscriversi', n: 'già socio' },
    ],
    push: '',
    arricchimento: 'lo status CartaFreccia, che arriva dal CRM',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com e il CRM', e: 'attributo del CRM: «status Oro»' },
      { k: 'Customer Journey Analytics', v: 'porta lo status accanto al comportamento sul sito', e: 'status Oro · tratta abituale Roma → Milano' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie fra le varianti', e: 'mostra FrecciaLounge e Fast Track, prima di uno sconto' },
      { k: 'E torna indietro', v: 'il risultato si legge in CJA, nello stesso report', e: 'uso dei servizi, e ritorno nel tempo' },
    ],
    schermo: {
      dove: 'trenitalia.com · area personale',
      titolo: 'Riconosciuto al login',
      tessere: [
        { t: 'Ingresso FrecciaLounge', n: 'con lo status' },
        { t: 'Upgrade gratuiti', n: 'dell’anno' },
        { t: 'Fast Track', n: 'Termini e Centrale' },
      ],
    },
    fonti: ['tcom', 'frecce', 'crm'],
    passi: [
      { t: 'Il gruppo: lo status, dal CRM', dove: 'Target', skill: 'target-audience-composer' },
      { t: 'Che cosa vede: i servizi compresi', dove: 'Target', skill: 'target-design' },
      { t: 'La misura: uso dei servizi e ritorno', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
    ],
    kpi: ['Uso dei vantaggi compresi', 'Ricavo per cliente', 'Ritorno nel tempo'],
    giudizio: {
      chiude: 'Ricavo e ritorno nel tempo dei clienti Oro esposti, contro un gruppo di controllo fisso.',
    },
    origine: 'adobe',
  },

  // ── Target su Le Frecce e app ───────────────────────────────────────
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
    oggi: 'Il passaggio di classe si propone a tutti i viaggiatori, non a chi è più propenso a prenderlo.',
    viaggiatore: 'Chi viaggia spesso in Standard trova, dopo l’acquisto, l’offerta di upgrade già prezzata.',
    marketer: 'Il gruppo esce dagli acquisti, Standard e alta frequenza. L’offerta, il prezzo e i treni li fissa il revenue management.',
    conversazione: [
      { chi: 'utente', t: 'Chi viaggia in Standard due volte al mese: mostragli l’upgrade che il revenue management ha prezzato.' },
      { chi: 'coworker', t: 'Trovato il gruppo. Uso solo i treni e il prezzo del feed di vendita?' },
      { chi: 'utente', t: 'Sì, con un tetto di frequenza per cliente.' },
      { chi: 'coworker', t: 'Bozza pronta per Le Frecce e l’app. La approva e la pubblica il team Target.' },
    ],
    profilo: [
      { k: 'Classe', v: 'sempre Standard' },
      { k: 'Viaggi', v: '2 al mese' },
      { k: 'Treno', v: 'nel feed delle offerte' },
    ],
    varianti: [
      { t: 'Nessuna proposta', n: 'come oggi' },
      { t: 'Upgrade in Business', n: 'al prezzo fissato', match: true },
    ],
    push: '',
    arricchimento: 'frequenza di viaggio e classe abituale',
    flusso: [
      { k: 'Le fonti', v: 'gli acquisti su Le Frecce e il feed delle offerte', e: 'biglietto «Standard, Roma → Milano, 14 ott» · upgrade prezzato dal revenue management' },
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
    kpi: ['Ricavo per posto-km', 'Ricavo medio per biglietto', 'Posti premium venduti'],
    giudizio: {
      chiude: 'Ricavo in più per posto-km contro un gruppo di controllo, al netto di chi avrebbe comprato la Business comunque.',
    },
    origine: 'cliente',
  },
  {
    id: 'app',
    leva: 'conversione',
    config: 'c',
    superfici: ['app'],
    titolo: 'Dal computer al telefono',
    punto: 'Cerca sul computer, ritrova la stessa tratta quando apre l’app.',
    oggi: 'Il sito e l’app non si parlano: chi ha cercato una tratta la sera, la mattina sul telefono ricomincia da capo.',
    viaggiatore: 'Aprendo l’app trova in cima la tratta cercata sul computer.',
    marketer: 'Il legame lo fa il login. Un gruppo, «ha cercato sul web e non ha comprato», portato sull’app.',
    conversazione: [
      { chi: 'utente', t: 'Chi ha cercato una tratta su trenitalia.com e non l’ha comprata: riproponila quando apre l’app.' },
      { chi: 'coworker', t: 'Li riconosco dal login, sul web e sull’app. Preparo la bozza dell’attività?' },
      { chi: 'utente', t: 'Sì, in cima alla home dell’app.' },
      { chi: 'coworker', t: 'Bozza pronta. La approva e la pubblica il team Target.' },
    ],
    profilo: [
      { k: 'Login', v: 'sì, sul web e in app' },
      { k: 'Cercava', v: 'Bologna → Firenze' },
      { k: 'Dove', v: 'dal computer, giorni prima' },
    ],
    varianti: [
      { t: 'La home di oggi', n: 'partenza vuota' },
      { t: 'La tratta cercata', n: 'Bologna → Firenze', match: true },
    ],
    push: '',
    arricchimento: 'la stessa persona sul web e sull’app, legata dal login',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com e l’app Trenitalia', e: 'ricerca sul computer: «Bologna → Firenze»' },
      { k: 'Customer Journey Analytics', v: 'lega il web e l’app della stessa persona, con il login', e: 'ha cercato, non ha comprato · stessa persona sull’app' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie la variante, in app', e: 'in cima all’app: la tratta cercata' },
      { k: 'Richiede in più', v: 'Target nell’app e l’Analytics dell’app, da confermare', e: 'il pubblico si aggiorna a intervalli: vale dalle aperture successive' },
    ],
    schermo: {
      dove: 'app Trenitalia',
      titolo: 'Riprendi da dove eri', // copy-audit-ignore — etichetta d'interfaccia dentro il mock
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
      chiude: 'Acquisti in app del gruppo esposto entro una settimana, contro un gruppo di controllo fisso.',
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
  numeri: [
    { v: '95%', l: 'della crescita dei ricavi arriva dai canali digitali' },
  ],
  url: 'https://business.adobe.com/customer-success-stories/brightline.html',
  // Verificato il 28 ott 2026 sulla pagina stessa: «70% reduction in time to
  // book in-app», «95% of revenue growth now comes from digital channels»,
  // «618% increase in traffic from unbranded organic search». I prodotti che la
  // pagina dichiara sono RTCDP, CJA, AJO, AEM Sites e Assets — la stessa
  // combinazione di cui parla Convergenza, ed è il motivo per cui regge qui.
};
