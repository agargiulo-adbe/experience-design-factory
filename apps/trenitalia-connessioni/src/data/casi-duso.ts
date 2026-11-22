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
  { id: 'c', nome: 'Su Le Frecce e app', legge: 'trenitalia.com e Le Frecce', agisce: 'trenitalia.com, Le Frecce e app', serve: 'chi sviluppa Le Frecce', breve: 'Target anche fuori dal sito' },
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
    punto: 'Chi arriva da Verona vede le tratte da Verona, non la pagina di tutti.',
    // Esempio portato da loro il 27 ott; una prima versione con la
    // geolocalizzazione è già in produzione su trenitalia.com (dall'account, 16
    // nov). Le tratte «più comprate da lì» sono il pezzo che porta Le Frecce:
    // vale anche in aggregato, senza riconoscere la persona.
    oggi: 'Una prima versione c’è già, con un pop-up sopra la pagina. Il passo dopo è che si adattino i componenti della home.',
    viaggiatore: 'La prima schermata porta le tratte che partono da dove si trova, con le fasce di prezzo.',
    marketer: 'Una regola per area di partenza, e le tratte più comprate da lì. Si prepara una volta e vale per tutte le città.',
    conversazione: [
      { chi: 'utente', t: 'Crea un gruppo per chi si collega dall’area di Verona e mostragli le tratte più comprate da lì.' },
      { chi: 'coworker', t: 'Gruppo costruito, con le tratte lette sugli acquisti di Le Frecce. Lo porto su Adobe Target?' },
      { chi: 'utente', t: 'Sì, in cima alla home, con la fascia di prezzo.' },
      { chi: 'coworker', t: 'Attività pronta. Due settimane di prova, poi si decide se tenerla.' },
    ],
    profilo: [
      { k: 'Area', v: 'Verona' },
      { k: 'Dispositivo', v: 'computer' },
      { k: 'Ultima ricerca', v: 'Milano' },
    ],
    varianti: [
      { t: 'La pagina di tutti', n: 'offerta nazionale' },
      { t: 'Le tratte da Verona', n: 'da 19 €', match: true },
      { t: 'Promozione generica', n: '−10%' },
    ],
    push: 'Da Verona oggi: Milano da 19 €, Venezia da 29 €.',
    arricchimento: 'area di partenza e tratte più comprate da lì',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com e Le Frecce', e: 'visita da Verona su trenitalia.com · acquisti partiti da Verona su Le Frecce' },
      { k: 'Customer Journey Analytics', v: 'ricava l’area e le tratte più comprate da lì', e: 'area: Verona · tratte più comprate: Milano, Venezia, Roma' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie fra le varianti', e: 'in cima alla home: le tre tratte da Verona, con la fascia di prezzo' },
      { k: 'E torna indietro', v: 'una misura sola, non un quarto sistema', e: 'quanti arrivano all’acquisto su Le Frecce' },
    ],
    schermo: {
      dove: 'trenitalia.com',
      titolo: 'Da Verona Porta Nuova',
      tessere: [
        { t: 'Milano Centrale', n: 'da 19 €' },
        { t: 'Venezia Santa Lucia', n: 'da 29 €' },
        { t: 'Roma Termini', n: 'da 39 €' },
      ],
    },
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: chi si collega da una certa area', dove: 'Target', skill: 'target-audience-composer' },
      { t: 'Che cosa vede: le tratte da quella stazione', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti arrivano all’acquisto', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Conversione dalla home', 'Ricerche avviate', 'Vendite per area'],
    prova: { chi: 'Telmore', settore: 'telco', v: '+11%', l: 'le vendite dai banner personalizzati', url: 'https://business.adobe.com/customer-success-stories/telmore-case-study.html' },
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
    punto: 'Il tempo passato su una pagina dice che cosa interessa, anche senza login.',
    oggi: 'Chi legge a lungo la pagina degli abbonamenti e se ne va, alla visita dopo ritrova la home di chiunque.',
    viaggiatore: 'Alla visita dopo trova in cima l’abbonamento sulla tratta che cercava, e quanto spende in meno al mese.',
    marketer: 'Un gruppo costruito sul comportamento: quale sezione, per quanto tempo, quale tratta. Si prepara una volta.',
    conversazione: [
      { chi: 'utente', t: 'Trova chi ha letto la pagina degli abbonamenti per più di un minuto e non ha comprato.' },
      { chi: 'coworker', t: 'Trovato il gruppo, quasi tutto senza login. Lo porto su Adobe Target?' },
      { chi: 'utente', t: 'Sì: alla visita dopo, in cima, l’abbonamento sulla tratta che cercava.' },
      { chi: 'coworker', t: 'Attività pronta. Misuro quanti lo comprano su Le Frecce.' },
    ],
    profilo: [
      { k: 'Login', v: 'no' },
      { k: 'Ha letto', v: 'Abbonamenti, 3 minuti' },
      { k: 'Tratta cercata', v: 'Bologna → Firenze' },
    ],
    varianti: [
      { t: 'La home di chiunque', n: 'partenza vuota' },
      { t: 'L’abbonamento sulla sua tratta', n: 'Bologna → Firenze', match: true },
      { t: 'Promozione generica', n: '−10%' },
    ],
    push: 'Bologna → Firenze ogni giorno? Con l’abbonamento spendi meno.', // copy-audit-ignore — notifica al viaggiatore, non voce del deck
    arricchimento: 'la sezione letta, per quanto tempo, e la tratta',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com e Le Frecce', e: 'tre minuti sulla pagina Abbonamenti · ricerca Bologna → Firenze' },
      { k: 'Customer Journey Analytics', v: 'tiene insieme le visite della stessa persona, senza login', e: 'ha letto gli abbonamenti, non ha comprato · tratta: Bologna → Firenze' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie fra le varianti', e: 'alla visita dopo, in cima: l’abbonamento su Bologna → Firenze' },
      { k: 'E torna indietro', v: 'una misura sola, non un quarto sistema', e: 'quanti comprano l’abbonamento su Le Frecce' },
    ],
    schermo: {
      dove: 'trenitalia.com',
      titolo: 'Bologna → Firenze, ogni giorno',
      tessere: [
        { t: 'Abbonamento mensile', n: 'sulla tua tratta' },
        { t: 'Viaggi in un mese', n: 'senza limiti' },
        { t: 'Rinnovo', n: 'dall’app' },
      ],
    },
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: chi ha letto e non ha comprato', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: l’abbonamento sulla sua tratta', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti lo comprano', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Abbonamenti venduti', 'Conversione dei non loggati', 'Ritorno entro 7 giorni'],
    origine: 'cliente',
  },

  // ── Con il CRM ──────────────────────────────────────────────────────
  {
    id: 'oro',
    leva: 'conversione',
    config: 'b',
    superfici: ['tcom'],
    // CartaFreccia chiude il 31 dic 2026 e dal 2027 arriva un programma nuovo:
    // il caso parla di «livello del cliente», non di Oro, perché il nome cambia
    // e il punto no.
    titolo: 'Chi viaggia di più, riconosciuto',
    punto: 'Il livello del cliente sta nel CRM, e alla pagina non arriva.',
    oggi: 'Chi ha il livello più alto, quando entra, vede la stessa pagina di chi viaggia una volta l’anno.',
    viaggiatore: 'Al login trova i servizi compresi nel suo livello. Non uno sconto.',
    marketer: 'Il livello arriva dal CRM come attributo e decide che cosa si mostra, senza una campagna a parte.',
    conversazione: [
      { chi: 'utente', t: 'Chi ha il livello più alto: mostragli i servizi che il suo livello comprende, non uno sconto.' },
      { chi: 'coworker', t: 'Prendo il livello dal CRM come attributo. Lo uso per decidere che cosa vede?' },
      { chi: 'utente', t: 'Sì, e senza una campagna a parte.' },
      { chi: 'coworker', t: 'Pronto. Riporto l’uso dei servizi e il ritorno nel tempo.' },
    ],
    profilo: [
      { k: 'Livello', v: 'il più alto' },
      { k: 'Viaggi l’anno', v: 'oltre 40' },
      { k: 'Tratta abituale', v: 'Roma → Milano' },
    ],
    varianti: [
      { t: 'Sconto sul biglietto', n: '−10%' },
      { t: 'I servizi del suo livello', n: 'FrecciaLounge, Fast Track', match: true },
      { t: 'Invito a iscriversi', n: 'già socio' },
    ],
    push: 'FrecciaLounge inclusa anche in questo viaggio.',
    arricchimento: 'il livello del cliente, che arriva dal CRM',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com e il CRM', e: 'attributo del CRM: «livello più alto, oltre 40 viaggi l’anno»' },
      { k: 'Customer Journey Analytics', v: 'porta il livello accanto al comportamento sul sito', e: 'livello più alto · tratta abituale Roma → Milano' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie fra le varianti', e: 'mostra FrecciaLounge e Fast Track, non uno sconto' },
      { k: 'E torna indietro', v: 'una misura sola, non un quarto sistema', e: 'uso dei servizi, e ritorno nel tempo' },
    ],
    schermo: {
      dove: 'trenitalia.com · area personale',
      titolo: 'Riconosciuto al login',
      tessere: [
        { t: 'Ingresso FrecciaLounge', n: 'con un ospite' },
        { t: 'Upgrade di servizio', n: '3 gratuiti' },
        { t: 'Fast Track', n: 'Termini e Centrale' },
      ],
    },
    fonti: ['tcom', 'frecce', 'crm'],
    passi: [
      { t: 'Il gruppo: il livello del cliente, dal CRM', dove: 'Target', skill: 'target-audience-composer' },
      { t: 'Che cosa vede: i servizi compresi', dove: 'Target', skill: 'target-design' },
      { t: 'La misura: uso dei servizi e ritorno', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
    ],
    kpi: ['Uso dei servizi compresi', 'Ricavo per cliente', 'Ritorno nel tempo'],
    prova: { chi: 'Telmore', settore: 'telco', v: '+19,5%', l: 'i clienti riconosciuti sui canali a pagamento', url: 'https://business.adobe.com/customer-success-stories/telmore-case-study.html' },
    origine: 'adobe',
  },

  // ── Target su Le Frecce e app ───────────────────────────────────────
  {
    id: 'upgrade',
    leva: 'conversione',
    config: 'c',
    superfici: ['frecce', 'app'],
    titolo: 'L’upgrade che oggi si offre a tutti',
    punto: 'La stessa proposta, fatta a chi ha davvero motivo di accettarla.',
    // Dalla sintesi d'account del 27 ott: oggi la proposta di passaggio a
    // classe superiore va a tutti i viaggiatori, non su base propensione. Si
    // mostra dopo l'acquisto, quindi su Le Frecce e sull'app.
    oggi: 'Il passaggio di classe si propone a tutti i viaggiatori, non a chi è più propenso a prenderlo.',
    viaggiatore: 'Chi viaggia sempre in Standard trova la Business allo stesso prezzo, per ventiquattr’ore.',
    marketer: 'Il gruppo esce dagli acquisti, sempre Standard e alta frequenza, e diventa un’offerta a tempo su treni scelti.',
    conversazione: [
      { chi: 'utente', t: 'Chi viaggia sempre in Standard due volte al mese: proponi la Business allo stesso prezzo.' },
      { chi: 'coworker', t: 'Trovato il gruppo. Lo limito ai treni che partono con posti liberi?' },
      { chi: 'utente', t: 'Sì, e l’offerta vale ventiquattr’ore.' },
      { chi: 'coworker', t: 'Attiva su Target, su Le Frecce e sull’app. Misuro le salite di classe in più.' },
    ],
    profilo: [
      { k: 'Classe', v: 'sempre Standard' },
      { k: 'Viaggi', v: '2 al mese' },
      { k: 'Treno', v: 'posti liberi' },
    ],
    varianti: [
      { t: 'Sconto del 10%', n: 'su tutto' },
      { t: 'Business allo stesso prezzo', n: '49 €', match: true },
      { t: 'Nessuna proposta', n: '—' },
    ],
    push: 'C’è posto in Business sul tuo treno. Oggi allo stesso prezzo.', // copy-audit-ignore — notifica al viaggiatore: una push al plurale istituzionale non è una push
    arricchimento: 'frequenza di viaggio e classe abituale',
    flusso: [
      { k: 'Le fonti', v: 'gli acquisti su Le Frecce', e: 'biglietto acquistato: «Standard, Roma → Milano, 14 ott»' },
      { k: 'Customer Journey Analytics', v: 'mette in fila gli acquisti e ricava l’abitudine', e: 'due viaggi al mese, sempre in Standard · treno scelto: posti liberi' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie fra le varianti, su Le Frecce e in app', e: 'mostra la Business allo stesso prezzo, valida ventiquattr’ore' },
      { k: 'E torna indietro', v: 'una misura sola, non un quarto sistema', e: 'quante salite di classe in più' },
    ],
    schermo: {
      dove: 'Le Frecce · il tuo viaggio', // copy-audit-ignore — etichetta d'interfaccia dentro il mock, non voce del deck
      titolo: 'Business al prezzo della Standard',
      tessere: [
        { t: 'Standard, il suo solito', n: '49 €' },
        { t: 'Business, oggi', n: '49 €' },
        { t: 'Resta valida', n: '24 ore' },
      ],
    },
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: sempre Standard, alta frequenza', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: la Business allo stesso prezzo', dove: 'Target', skill: 'target-design' },
      { t: 'La misura: quante salite di classe in più', dove: 'CJA', skill: 'target-test-calculator' },
    ],
    kpi: ['Passaggi di classe', 'Ricavo medio per biglietto', 'Posti premium venduti'],
    prova: { chi: 'Telmore', settore: 'telco', v: '+25%', l: 'le vendite incrociate ai già clienti', url: 'https://business.adobe.com/customer-success-stories/telmore-case-study.html' },
    origine: 'cliente',
  },
  {
    id: 'app',
    leva: 'conversione',
    config: 'c',
    superfici: ['app'],
    titolo: 'Dal computer al telefono',
    punto: 'Cerca la sera sul computer, ritrova la stessa tratta quando apre l’app.',
    oggi: 'Il sito e l’app non si parlano: chi ha cercato una tratta la sera, la mattina sul telefono ricomincia da capo.',
    viaggiatore: 'Aprendo l’app trova in cima la tratta cercata sul computer, con i posti ancora liberi.',
    marketer: 'Il legame lo fa il login. Un gruppo, «ha cercato sul web e non ha comprato», portato sull’app.',
    conversazione: [
      { chi: 'utente', t: 'Chi ha cercato una tratta su trenitalia.com e non l’ha comprata: riproponila quando apre l’app.' },
      { chi: 'coworker', t: 'Li riconosco dal login, sul web e sull’app. Lo porto su Adobe Target?' },
      { chi: 'utente', t: 'Sì, in cima alla home dell’app, con i posti liberi.' },
      { chi: 'coworker', t: 'Attività pronta. Misuro quanti la comprano entro tre giorni.' },
    ],
    profilo: [
      { k: 'Login', v: 'sì, sul web e in app' },
      { k: 'Cercava', v: 'Bologna → Firenze' },
      { k: 'Quando', v: 'ieri sera, dal computer' },
    ],
    varianti: [
      { t: 'La home di chiunque', n: 'partenza vuota' },
      { t: 'La tratta di ieri sera', n: 'Bologna → Firenze', match: true },
      { t: 'Promozione generica', n: '−10%' },
    ],
    push: 'Bologna → Firenze delle 07:35: ancora 12 posti liberi.',
    arricchimento: 'la stessa persona sul web e sull’app, legata dal login',
    flusso: [
      { k: 'Le fonti', v: 'trenitalia.com e l’app Trenitalia', e: 'ricerca sul computer: «Bologna → Firenze», ieri alle 21:40' },
      { k: 'Customer Journey Analytics', v: 'lega il web e l’app della stessa persona, con il login', e: 'ha cercato, non ha comprato · stessa persona sull’app' },
      { k: 'Adobe Target', v: 'riceve il gruppo e sceglie fra le varianti, in app', e: 'in cima all’app: la tratta di ieri, con i posti liberi' },
      { k: 'E torna indietro', v: 'una misura sola, non un quarto sistema', e: 'quanti comprano entro tre giorni' },
    ],
    schermo: {
      dove: 'app Trenitalia',
      titolo: 'Riprendi da dove eri', // copy-audit-ignore — etichetta d'interfaccia dentro il mock
      tessere: [
        { t: 'Bologna → Firenze', n: 'cercata ieri' },
        { t: 'Partenza che guardava', n: '07:35' },
        { t: 'Posti ancora liberi', n: '12' },
      ],
    },
    fonti: ['tcom', 'frecce'],
    passi: [
      { t: 'Il gruppo: ha cercato sul web, non ha comprato', dove: 'CJA', skill: 'segmenti in Coworker Chat' },
      { t: 'Che cosa vede: la tratta che cercava', dove: 'Target', skill: 'target-vec' },
      { t: 'La misura: quanti comprano entro tre giorni', dove: 'CJA', skill: 'target-activity-verdict' },
    ],
    kpi: ['Acquisti ripresi', 'Conversione in app', 'Tempo fra ricerca e acquisto'],
    prova: { chi: 'Santander', settore: 'banca', v: '+600%', l: 'le conversioni sul carrello abbandonato', url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html' },
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
    cosa: 'Status CartaFreccia Oro, vantaggi e soglia',
    url: 'https://www.trenitalia.com/it/cartafreccia/scopri-gli-status-cartafreccia/cartafreccia-oro.html',
  },
  {
    cosa: 'Programma CartaFreccia, chiusura al 31 dicembre 2026',
    url: 'https://www.trenitalia.com/it/cartafreccia.html',
  },
  {
    cosa: 'Telmore, personalizzazione con Target e Real-Time CDP',
    url: 'https://business.adobe.com/customer-success-stories/telmore-case-study.html',
  },
  {
    cosa: 'Santander, personalizzazione in scala con Experience Platform',
    url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html',
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
  cosa: 'Operatore ferroviario ad alta velocità, posizionamento premium, che legge il viaggio con Customer Journey Analytics.',
  numeri: [
    { v: '70%', l: 'più rapida la prenotazione in app' },
    { v: '95%', l: 'della crescita dei ricavi arriva dai canali digitali' },
    { v: '618%', l: 'in più il traffico organico non di marca' },
  ],
  url: 'https://business.adobe.com/customer-success-stories/brightline.html',
  // Verificato il 28 ott 2026 sulla pagina stessa: «70% reduction in time to
  // book in-app», «95% of revenue growth now comes from digital channels»,
  // «618% increase in traffic from unbranded organic search». I prodotti che la
  // pagina dichiara sono RTCDP, CJA, AJO, AEM Sites e Assets — la stessa
  // combinazione di cui parla Convergenza, ed è il motivo per cui regge qui.
};
