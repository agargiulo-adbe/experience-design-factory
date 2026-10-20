/**
 * LE FONTI, in un posto solo.
 *
 * PERCHÉ ESISTE QUESTO FILE
 * Perché una fonte sbagliata non si vede. Nel giro del 12 ottobre 2026 la slide
 * d'apertura citava un articolo ANSA — link vivo, data giusta, 200 alla verifica
 * automatica — che NON conteneva la frase messa fra virgolette: il 75% e il 4%
 * stanno in un altro pezzo, e il 96% in un terzo. Tre slide, poi, citavano due
 * homepage (`fsnews.it`, `fsbusitalia.it`) per sei fatti diversi: un link che
 * risponde e non porta da nessuna parte è una fonte dichiarata e non data.
 *
 * COME SI USA
 * Ogni voce porta `url`, `label` (il testo del link) e `data`. `cosaDice` non
 * finisce in pagina: è il promemoria di che cosa quella pagina conferma davvero,
 * e serve a chi un giorno riuserà la fonte per un'altra frase — è lì che nascono
 * le attribuzioni sbagliate. Una voce senza `url` è una fonte nostra o interna:
 * si cita per quello che è, senza finto link (regola del repo: le fonti pubbliche
 * portano il link, quelle nostre si nominano).
 *
 * REGOLA: una slide non scrive un indirizzo a mano. Se una fonte serve a due
 * slide, le due slide citano la stessa voce di qui — così la correzione arriva a
 * entrambe, e al taglio «In dieci minuti» insieme a loro.
 */
export interface Fonte {
  /** Assente = fonte nostra o interna: si nomina, non si linka. */
  url?: string;
  /** Il testo cliccabile in slide. Corto: è una fonte, non una CTA. */
  label: string;
  data: string;
  /** Promemoria interno: che cosa questa pagina conferma, parola per parola. */
  cosaDice: string;
}

export const SOURCES = {
  /* ── Le sue parole ────────────────────────────────────────────────────── */
  /* ── TTG 2026, 14-16 ottobre: le fonti più fresche del deck. Il protocollo
     con Costa è stato presentato dal Direttore Sales in persona il 15, cioè il
     giorno prima che questo capitolo venisse riscritto: è la ragione per cui
     l'idea della collaborazione fra aziende smette di essere un'ipotesi. ── */
  costaTtg: {
    url: 'https://www.fsnews.it/it/focus-on/servizi/2026/10/15/costa-crociere-trenitalia-accordo.html',
    label: 'fsnews.it, 15 ottobre 2026',
    data: '15 ottobre 2026',
    cosaDice:
      'Protocollo d\'intesa Trenitalia-Costa Crociere presentato al TTG di Rimini: l\'offerta Trenitalia entra nella piattaforma di Costa con un unico percorso di acquisto crociera + treno. Da gennaio 2027 un booking engine collega IN TEMPO REALE i sistemi di prenotazione delle due aziende, e le agenzie di viaggio potranno aggiungere alla crociera i collegamenti nazionali e internazionali ricevendo conferma immediata. Previsti anche gestione bagagli, orari coordinati con gli arrivi delle navi, assistenza in stazione e a bordo. ⚠️ Il protocollo è stato PRESENTATO dal Direttore Sales, non è documentato chi lo abbia firmato: non attribuirgli la firma.',
  },
  ttgSales2026: {
    url: 'https://www.affaritaliani.it/economia/notizie-aziende/trenitalia-presente-al-ttg-2026-siglata-lintesa-con-costa-crociere.html',
    label: 'intervista al Direttore Sales, 15 ottobre 2026',
    data: '15 ottobre 2026',
    cosaDice:
      'Verbatim: «La parola chiave è internazionalizzazione»; i mercati citati sono Europa e Nord America, più quelli «emergenti per noi, come Asia, Sud America e Australia»; «stiamo investendo significativamente nell\'evoluzione dei nostri canali digitali diretti, in particolare nell\'app e nel sito web»; nuova app lanciata «lo scorso maggio», e «entro marzo 2027 prevediamo di lanciare il nostro nuovo sito web». Sulle escursioni in crociera cita Genova-Cinque Terre, Napoli-Pompei, Taranto-Locorotondo e Alberobello.',
  },
  /* L'unica fonte PUBBLICA su questa capacità: una frase nel comunicato del
     20 apr 2026. Tutto il resto che sappiamo (stato, prerequisiti, prezzo,
     date) è materiale interno e non si cita. ⚠️ Non è in disponibilità
     generale: verificato il 16 ott 2026. */
  llmApps: {
    url: 'https://news.adobe.com/news/2026/04/adobe-introduces-brand-visibility-solution',
    label: 'comunicato Adobe, 20 aprile 2026',
    data: '20 aprile 2026',
    cosaDice:
      'Verbatim: «LLM Apps (a new capability in AEM) will enable brands to build branded experiences that run directly within LLM interfaces, extending a brand\'s presence across AI surfaces.» È l\'unica frase pubblica esistente sul prodotto: la pagina di soluzione collegata al comunicato non lo nomina, e su Experience League non c\'è documentazione.',
  },
  /* 17 ott 2026: qui stava la referenza Alterra Mountain Company. È uscita per
     decisione d'account — nel deck non va nessuna referenza di un altro cliente.
     Resta a verbale il perché non ce n'era una buona: fra i clienti pubblici di
     Real-Time CDP Collaboration non c'è né un vettore né una ferrovia né una
     crociera (verificato il 16 ott 2026), e un caso di un altro settore apre la
     domanda «e nel nostro?» invece di chiuderla. */
  /* ⚠️ Fonte PRIMARIA, letta il 16 ott 2026 sulla pagina di Trenitalia: la voce
     cinese del selettore di lingua non porta a un sito, porta a due codici QR.
     Uno apre il mini-program WeChat che VENDE, l'altro l'account che informa.
     Cioè: il canale cinese di Trenitalia non è il suo sito, è WeChat. */
  trenitaliaCinese: {
    url: 'https://www.trenitalia.com/it/html/trenitalia/cinese.html',
    label: 'trenitalia.com, pagina in cinese',
    data: 'consultata il 16 ottobre 2026',
    cosaDice:
      'La pagina invita a «scansionare il codice per entrare nel mini-program WeChat, acquistare biglietti comodamente» e a «seguire l\'account ufficiale WeChat per informazioni su prodotti e servizi». Nessun sito localizzato in cinese esiste: /zh, /cn e /chi restituiscono 404. Il canale cinese è WeChat.',
  },
  fsCina: {
    url: 'https://www.fsnews.it/it/focus-on/corporate/2025/5/27/trenitalia-nuova-offerta-cina.html',
    label: 'fsnews.it, 27 maggio 2025',
    data: '27 maggio 2025',
    cosaDice:
      'Verbatim: «I biglietti sono acquistabili sulle principali piattaforme cinesi come WeChat dal profilo ufficiale Trenitalia chiamato Frecciarossa, con percorso di acquisto interamente in cinese.» Perimetro venduto: network Frecciarossa, Trenitalia Pass, Intercity e regionali, più il bus Busitalia per The Mall. Le vendite in Cina sono raddoppiate nel 2025 sul 2024.',
  },
  cinaArrivi: {
    url: 'https://portaleoperatori.italia.it/news/detail/?id=18',
    label: 'Ministero del Turismo, 13 ottobre 2025',
    data: '13 ottobre 2025',
    cosaDice:
      'La Cina è al decimo posto per arrivi in Italia. ⚠️ Per i volumi in slide si usano i dati ISTAT, che sono primari e arrivano al 2025: 2.308.594 arrivi e 4.661.118 presenze di clienti residenti in Cina. Non mescolare mai gli arrivi ISTAT con i «viaggiatori» di Banca d\'Italia: sono due sistemi di conteggio diversi.',
  },
  /* Il fatto più grosso che il deck non aveva: la proposta della Commissione
     del 13 maggio 2026. Gli operatori con quota domestica dal 50% in su
     dovranno mostrare e vendere anche i concorrenti sulla propria piattaforma.
     Riguarda il Direttore Sales più di qualunque rivenditore, perché tocca la
     sua vetrina. ⚠️ È una PROPOSTA: non è ancora legge, e va detto. */
  ueTicketing: {
    url: 'https://transport.ec.europa.eu/document/download/5fd64be7-44b8-4dd3-b084-05c35c5f2a8b_en?filename=SWD_2026_300_Impact_assessment.pdf',
    label: 'valutazione d’impatto della Commissione europea, 13 maggio 2026',
    data: '13 maggio 2026',
    cosaDice:
      'Gli operatori storici con una quota di mercato domestica pari o superiore al 50% dovranno esporre sulla propria piattaforma tutti i servizi ferroviari del Paese e, su richiesta, vendere i biglietti degli altri operatori; dodici mesi dall\'entrata in vigore, e in assenza di accordo entro otto mesi decide il regolatore nazionale. La stessa valutazione d\'impatto osserva che la grande maggioranza delle ricerche e delle vendite online resta oggi sui canali propri degli operatori. ⚠️ Proposta, non norma vigente.',
  },
  monaco: {
    url: 'https://www.fsnews.it/it/focus-on/servizi/2026/10/14/ttg-rimini-2026-fs-trenitalia.html',
    label: 'fsnews.it, 14 ottobre 2026',
    data: '14 ottobre 2026',
    cosaDice:
      'Al TTG 2026 il Gruppo ha presentato il nuovo Pass Interrail e l\'offerta commerciale del collegamento Milano-Monaco, in partenza nel 2027. Il Direttore Sales ha aggiunto che dall\'estate 2027 il Frecciarossa arriverà in Germania e che nel 2028 il collegamento sarà prolungato fino a Berlino, dopo Spagna e Francia.',
  },
  /* Gli altri annunci del TTG 2026 che toccano la vendita: il nuovo Pass
     Interrail, i progetti per il turismo d'affari e congressuale con Busitalia,
     e City Sightseeing, il gruppo rilevato da Busitalia a gennaio 2026. Sono
     tutti pezzi di offerta che allargano il carrello oltre il biglietto. */
  ttgOfferta: {
    url: 'https://www.fsnews.it/it/focus-on/servizi/2026/10/14/ttg-rimini-2026-fs-trenitalia.html',
    label: 'il Gruppo FS al TTG 2026',
    data: '14-16 ottobre 2026',
    cosaDice:
      'Al TTG 2026: presentazione del nuovo Pass Interrail; progetti Trenitalia e Busitalia per il turismo congressuale; approfondimento sui servizi City Sightseeing, il gruppo rilevato da Busitalia a gennaio 2026; e una sessione di chiusura dedicata ai nuovi servizi digitali e al salvadanaio elettronico.',
  },
  /* ⚠️ Il canale WhatsApp non è mai stato ANNUNCIATO — zero comunicati, zero
     stampa — ma è PUBBLICATO da Trenitalia stessa: il link wa.me sta in chiaro
     sulla pagina Informazioni, e sulla pagina CartaFRECCIA Oro è scritto che
     da lì si acquista. Quindi si può nominare citando loro, senza rivelare
     niente: è la differenza fra «lo sappiamo da una riunione» e «sta sul
     vostro sito». Verificato il 16 ott 2026. */
  /* ⚠️ Il canale WhatsApp non è mai stato ANNUNCIATO — zero comunicati, zero
     stampa — ma è PUBBLICATO da Trenitalia stessa: il link wa.me sta in chiaro
     sulla pagina Informazioni. Si nomina citando loro.
     ⚠️ CONFLITTO RISOLTO il 20 ott 2026, e in favore della prova diretta: la
     pagina CartaFRECCIA Oro lascia intendere che da WhatsApp si acquisti, ma
     provandolo a mano («voglio andare da Milano a Roma») l'assistente dà le
     combinazioni e rimanda il link sull'app e sul sito. È un canale di
     assistenza e informazione, NON di vendita. In riunione, il 20 ott, chi
     aveva usato la parola «vendono» si è corretto a voce. Nel deck non si
     scrive che da lì si compra. */
  whatsappTrenitalia: {
    url: 'https://www.trenitalia.com/it/informazioni.html',
    label: 'trenitalia.com, pagina Informazioni',
    data: 'consultata il 16 ottobre 2026',
    cosaDice:
      'La pagina pubblica il collegamento diretto al canale WhatsApp di Trenitalia. L\'assistente risponde in linguaggio naturale e propone soluzioni di viaggio con orari, classi e prezzi; si presenta come «assistente virtuale di Trenitalia basato su Intelligenza Artificiale». Il percorso però si chiude altrove: verificato provandolo, rimanda all\'app e al sito per l\'acquisto. La pagina CartaFRECCIA Oro lascia intendere il contrario: vince la prova diretta.',
  },
  whatsappEuropa: {
    url: 'https://www.trenord.it/news/trenord-informa/comunicati-stampa/biglietto-treno-whatsapp/',
    label: 'confronto fra operatori europei',
    data: 'verificato il 16 ottobre 2026',
    cosaDice:
      'Nessun altro operatore ferroviario europeo vende dentro WhatsApp: Trenord ci consegna il biglietto comprato alla macchina (comunicato del 28 aprile 2026), Renfe e Deutsche Bahn mandano notifiche, SNCF Voyageurs ci fa assistenza con agenti dal marzo 2025, Eurostar dichiara pubblicamente di non operare su WhatsApp. Per Italo, ÖBB e SBB non risulta nulla.',
  },
  ttgAnsa: {
    url: 'https://www.ansa.it/ansacom/notizie/economia/ferrovie-dello-stato-italiane/2025/10/09/cacciapuoti-trenitalia-investiamo-sulla-intermodalita_379ce4de-97d4-48e7-83b6-064a2a522de8.html',
    label: 'ANSA, 9 ottobre 2025',
    data: '9 ottobre 2025',
    cosaDice:
      'Verbatim: «affermiamo Trenitalia come mobility leader del nostro Paese»; «unire le forze delle tre squadre commerciali… in un\'unica squadra di vendita»; «una proposizione di offerta che è multiprodotto, non solo treno, ma anche servizi gomma e servizi ancillari»; «investiamo sull\'intermodalità… grazie anche alle connessioni di Busitalia, oggi 100% Trenitalia… riusciamo a raggiungere più di 1700 destinazioni». NON contiene il 75%, il 4% né il 96%.',
  },
  ttg96: {
    url: 'https://www.lagenziadiviaggimag.it/trenitalia-busitalia-ora-lintermodalita-e-realta/',
    label: 'L’Agenzia di Viaggi, 13 ottobre 2025',
    data: '13 ottobre 2025',
    cosaDice:
      'Verbatim, sue parole: «contribuiamo a far conoscere agli italiani e soprattutto ai visitatori stranieri quel 96% del territorio italiano non ancora esplorato»; «siamo il mobility leader del Paese con investimenti per 1 miliardo di euro»; «oltre 6.400 agenzie sul territorio italiano e altre 6.000 all\'estero»; «6.600 collegamenti in Italia verso 1.700 destinazioni».',
  },
  turismo75: {
    url: 'https://www.travelquotidiano.com/trasporti/busitalia-insieme-a-trenitalia-arriviamo-al-cuore-della-destinazione/tqid-499236',
    label: 'Travel Quotidiano, 15 ottobre 2025',
    data: '15 ottobre 2025',
    cosaDice:
      'Il dato come circola al TTG: «Il 75% degli stranieri che visitano l\'Italia si ferma sul 4% del territorio». È un dato di contesto riportato attorno al suo intervento, NON una sua citazione verbatim: in slide va come dato, non fra virgolette.',
  },
  cina: {
    url: 'https://www.cameraitacina.com/news/general-news/ccic-strengthens-cooperation-with-trenitalia-for-the-development-of-the-chinese-market',
    label: 'Camera di Commercio Italiana in Cina, 26 maggio 2026',
    data: '26 maggio 2026',
    cosaDice:
      'Accordo con la Camera di Commercio Italiana in Cina, con sua dichiarazione. Vendite in Cina raddoppiate nel 2025 sull\'anno prima; passeggeri del primo trimestre 2026 ancora raddoppiati sul primo trimestre 2025.',
  },

  /* ── Il mercato e il momento ──────────────────────────────────────────── */
  sncf: {
    url: 'https://www.ilfoglio.it/economia/2026/03/04/news/i-treni-di-sncf-piu-vicini-allalta-velocita-italiana--126012',
    label: 'Il Foglio, 4 marzo 2026',
    data: '4 marzo 2026',
    cosaDice:
      'Sull\'alta velocità italiana ci sono DUE operatori (Trenitalia e Italo); SNCF sarebbe il terzo. Partenza commerciale slittata «alla fine del 2027, nel migliore dei casi». Obiettivo dichiarato: 15% del mercato entro il 2030, fino a 10 milioni di posti l\'anno. Prime 18 tracce, prevalenza Torino-Roma-Napoli.',
  },
  arenaways: {
    url: 'https://www.shipmag.it/le-ferrovie-spagnole-sbarcano-in-italia-renfe-acquista-il-33-di-arenaways/',
    label: 'ShipMag, 2025',
    data: '21 luglio 2025',
    cosaDice:
      'Renfe (con il fondo Serena) entra al 33% nella holding che opera i treni Arenaways. Arenaways è sulla rete TRADIZIONALE, non sull\'alta velocità: nuovi collegamenti da dicembre 2025, servizio pubblico in Piemonte.',
  },
  // NON più citata in slide dal secondo giro del panel: la slide presentava il
  // pricing dinamico come la novità dell'anno, e per chi fa quel mestiere da anni
  // («il revenue management è il mestiere, non la novità») era la riga che faceva
  // rileggere tutte le altre con sospetto. Resta qui perché il limite che porta —
  // riguarda solo le Frecce — vale comunque per chi scriverà la prossima versione.
  pricing: {
    url: 'https://www.altroconsumo.it/vita-privata-famiglia/viaggi-tempo-libero/news/trenitalia-prezzi-biglietti-dinamici',
    label: 'Altroconsumo, gennaio 2026',
    data: 'gennaio 2026',
    cosaDice:
      'Dal 1º gennaio 2026 i prezzi delle Frecce variano con la domanda, come gli aerei. Riguarda SOLO l\'alta velocità: Intercity e Regionale restano a tariffa fissa. Dirlo di «tutti i biglietti» è sbagliato, e lui vende tre prodotti.',
  },
  piano: {
    url: 'https://www.fsnews.it/it/focus-on/corporate/2026/9/22/innotrans-2026-ad-fs-strisciuglio-nuovo-piano-industriale.html',
    label: 'FS News, 22 settembre 2026',
    data: '22 settembre 2026',
    cosaDice:
      'Verbatim del vertice di Gruppo a InnoTrans: «la definizione di un piano industriale entro la fine dell\'anno che avrà come focus la sicurezza». Il piano NON è stato annunciato a settembre: a settembre è stato annunciato che arriverà. Nessuna cifra, nessun riferimento ai prezzi dei biglietti.',
  },
  prezziFermi: {
    url: 'https://www.monetaweb.it/impresa-e-management/gruppo-fs-strisciuglio-accelera-sul-piano-industriale-focus-su-viaggiatori-e-sicurezza/',
    label: 'MonetaWeb, 23 settembre 2026',
    data: '23 settembre 2026',
    cosaDice:
      'Conferenza stampa a InnoTrans, verbatim del vertice di Gruppo: «non ci sarà alcun aumento per il prezzo dei biglietti», in risposta ai rincari energetici. È una dichiarazione del vertice, non una riga di piano — il piano non è ancora uscito. Stesso fatto, in altre parole, su lamescolanza.com del 22 settembre 2026.',
  },

  sncfVialibera: {
    url: 'https://www.quotidianopiemontese.it/2026/03/07/inuovi-concorrenti-treni-alta-velocita-regionali/',
    label: 'stampa, 7 marzo 2026',
    data: '7 marzo 2026',
    cosaDice:
      'Il via libera dell\'Antitrust a SNCF sull\'alta velocità italiana è del 7 marzo 2026. Il Foglio del 4 marzo è di tre giorni PRIMA: cita l\'istruttoria, il debutto slittato e l\'obiettivo del 15%, non l\'autorizzazione. Due fatti, due date, due fonti.',
  },
  pico: {
    url: 'https://www.ttgitalia.com/agenzie-viaggi/65585-nasce-pico-il-nuovo-sistema-vendite-di-trenitalia-XWTG69275',
    label: 'TTG Italia, 1 marzo 2011',
    data: '1 marzo 2011',
    cosaDice:
      'Nasce PICO, la piattaforma che unifica i sistemi di vendita precedenti di Trenitalia; avvio a fasi nel 2011. La migrazione delle agenzie da Sipax si completa entro la fine del 2014 (TTG Italia, 28 ottobre 2014, stesso sito). ⚠️ NON È PIÙ CITATA IN SLIDE (15 ott 2026): sosteneva la frase su PICO, uscita dal deck perché del rifacimento non esiste fonte pubblica — riverificato il 15 ott, si trovano solo una manutenzione programmata dei canali agenzie e il pricing dinamico di gennaio. La voce resta qui perché il fatto è vero e serve se in sala qualcuno nomina la piattaforma.',
  },
  riorgCommerciale: {
    url: 'https://www.fitcisl.org/documenti/trenitalia-settore-commerciale/',
    label: 'documenti sindacali, 30 marzo 2026',
    data: '30 marzo 2026',
    cosaDice:
      'Riorganizzazione del settore commerciale di Trenitalia: la Direzione Customer Operations, istituita a settembre 2025, tiene vendita diretta, assistenza e post-vendita, con le Customer Room. È la fonte di «il percorso di acquisto non è della Direzione Sales», che altrimenti è un\'affermazione sull\'organigramma del cliente detta al cliente senza prova.',
  },

  /* ── L'intermodale che è già partito ──────────────────────────────────── */
  busitalia: {
    url: 'https://www.fsnews.it/it/focus-on/servizi/2025/10/9/busitalia-trenitalia-ttg-rimini-2025.html',
    label: 'FS News, 9 ottobre 2025',
    data: '9 ottobre 2025',
    cosaDice:
      'Sue parole: «un\'offerta che integra treno, bus e altri vettori, collegando più di 1.700 destinazioni». Busitalia: 10.300 collegamenti al giorno, oltre 44 milioni investiti in nuovi autobus. ATTENZIONE: le 1.700 destinazioni sono dell\'offerta Trenitalia nel suo insieme, NON di Busitalia da sola.',
  },
  fsPark: {
    url: 'https://www.trenitalia.com/it/servizi/fs-park.html',
    label: 'trenitalia.com · FS Park',
    data: 'letta il 12 ottobre 2026',
    cosaDice:
      'La sosta si prenota e si paga dall\'app Trenitalia, dal sito, in biglietteria e in agenzia; si può aggiungere a un biglietto già comprato fino alle 24 del giorno prima («Completa il tuo viaggio»).',
  },
  itaAirways: {
    url: 'https://www.trenitalia.com/it/chi-siamo/comunicati-stampa/20260309-ita-airways-e-trenitalia.html',
    label: 'comunicato Trenitalia, 9 marzo 2026',
    data: '9 marzo 2026',
    cosaDice:
      'Memorandum of Understanding ITA Airways × Trenitalia firmato dai due Amministratori Delegati, con costituzione di un «AI Intermodality and Sustainability Lab» congiunto. Nella stessa pagina, l\'AD di ITA Airways data il biglietto integrato Air-Rail: «un percorso avviato nel 2023». Una pagina sola conferma entrambe le date.',
  },

  /* La stessa compagnia aerea con cui avete il laboratorio ha firmato anche con
     il vostro concorrente. Letto il 17 ott 2026 su una fonte di settore apribile:
     il comunicato di ITA risponde 403 a qualunque accesso automatico, quindi la
     riga in slide porta questa. */
  itaItalo: {
    url: 'https://www.qualitytravel.it/ita-airways-e-italo-insieme-arriva-il-biglietto-unico-trenoaereo/188329',
    label: 'Quality Travel, 12 maggio 2026',
    data: '12 maggio 2026',
    cosaDice:
      'Protocollo d\'intesa ITA Airways × Italo firmato a Roma dai due Amministratori Delegati (Joerg Eberhart e Gianbattista La Rocca). Biglietto combinato treno più aereo in un\'unica operazione, in vendita «da luglio» tramite le agenzie di viaggio, i GDS per i travel manager e il sito di ITA. Italo aveva già integrato bus e servizi navali. ⚠️ Non sostituisce l\'accordo con Trenitalia: si aggiunge.',
  },

  /* ── Il canale intermediato ───────────────────────────────────────────── */
  agenzie: {
    url: 'https://www.trenitalia.com/it/informazioni/diventa-agenzia-partner.html',
    label: 'trenitalia.com · canali per le agenzie',
    data: 'letta il 12 ottobre 2026',
    cosaDice:
      'I canali con cui le agenzie vendono Trenitalia: PICO FULL, PICO Easy, Easy Web, OLTA, Tour Operator System, white label; commissioni fino al 6%; reti SIR, LIS e SISAL. Non contiene il numero dei punti vendita.',
  },
  retePunti: {
    url: 'https://www.sisal.com/news-media/comunicati-stampa/servizi/trenitalia-biglietti-e-abbonamenti-in-vendita-nelle-ricevitorie-sisal-comunicati-stampa-sisal-corporate',
    label: 'comunicato Sisal, novembre 2014',
    data: 'novembre 2014',
    cosaDice:
      'Verbatim: le ricevitorie Sisal «si aggiungeranno all\'attuale rete commerciale di Trenitalia Regionale, portando a oltre 70mila i punti vendita (tabaccherie, bar, edicole, ricevitorie e self service) integrativi e alternativi alle tradizionali biglietterie di stazione». Quindi: oltre 70.000 è il totale dei punti vendita FUORI dalle biglietterie, sul Regionale, ed è un dato del 2014. Non è il numero delle agenzie di viaggio e non è il numero della piattaforma.',
  },

  /* ── La misura che abbiamo fatto noi: si nomina, non si linka ─────────── */
  misura: {
    label: 'misura Adobe dell’11 e 12 ottobre 2026',
    data: '11-12 ottobre 2026',
    cosaDice:
      'Otto domande di viaggio senza nomi di marca, poste a ChatGPT e alla risposta generata di Google, una per conversazione nuova. Metodo, risposte verbatim e limiti: docs/Ferrovie/MISURA-visibilita-risposte-generate-2026-10-11.md. Non è pubblica: si cita per quello che è, senza link.',
  },

  /* ── Prodotti Adobe ──────────────────────────────────────────────────── */
  brandVisibility: {
    url: 'https://experienceleague.adobe.com/en/docs/brand-visibility/using/essentials/overview',
    label: 'Adobe Brand Visibility',
    data: 'documentazione pubblica',
    cosaDice: 'Punteggio di visibilità del marchio nelle risposte generate, quota di voce rispetto ai concorrenti, opportunità sulle pagine, traffico agentico separato dal referral.',
  },
  cja: {
    url: 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing',
    label: 'Customer Journey Analytics',
    data: 'documentazione pubblica',
    cosaDice: 'Analisi del percorso cliente su più canali e più insiemi di dati, con identità unificata.',
  },
  target: {
    url: 'https://experienceleague.adobe.com/en/docs/target/using/target-home',
    label: 'Adobe Target',
    data: 'documentazione pubblica',
    cosaDice: 'Test A/B, esperienze alternative su una parte del traffico e misura dell\'effetto.',
  },
  rtcdpCollab: {
    url: 'https://experienceleague.adobe.com/en/docs/real-time-cdp-collaboration/using/home',
    label: 'Adobe Real-Time CDP Collaboration',
    data: 'documentazione pubblica',
    cosaDice: 'Due aziende lavorano sugli stessi clienti senza trasferirsi i dati: ciascuna resta nel proprio ambiente governato.',
  },
  aem: {
    url: 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/overview/introduction',
    label: 'Adobe Experience Manager',
    data: 'documentazione pubblica',
    cosaDice: 'Gestione di contenuti e asset, approvazioni, pubblicazione multicanale.',
  },
  genstudio: {
    url: 'https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/home',
    label: 'Adobe GenStudio for Performance Marketing',
    data: 'documentazione pubblica',
    cosaDice: 'Produzione di varianti di campagna conformi alle regole di marca, con misura attaccata al singolo pezzo.',
  },
  analytics: {
    url: 'https://experienceleague.adobe.com/en/docs/analytics/analyze/home',
    label: 'Adobe Analytics',
    data: 'documentazione pubblica',
    cosaDice: 'Analisi del comportamento sui canali digitali: segmenti, percorsi, confronti nel tempo. È il prodotto che Trenitalia ha già in casa.',
  },
  aemAssets: {
    url: 'https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/overview',
    label: 'Adobe Experience Manager Assets',
    data: 'documentazione pubblica',
    cosaDice: 'La biblioteca degli asset: versioni, diritti d\'uso, metadati, distribuzione ai canali. Trenitalia ha Assets oltre a Sites.',
  },
  firefly: {
    // Il nome che il cliente riconosce è «Adobe Firefly»; la pagina pubblica che
    // descrive l'uso su scala — generazione dentro un flusso, via API — è quella
    // di Firefly Services. Le pagine di prodotto su adobe.com rispondono 403 a
    // qualunque accesso automatico e non sarebbero verificabili da nessun gate.
    url: 'https://developer.adobe.com/firefly-services/docs/guides/',
    label: 'Adobe Firefly',
    data: 'documentazione pubblica',
    cosaDice: 'Generazione di immagini e varianti visive con modelli addestrati su contenuti licenziati, utilizzabile anche dentro un flusso di produzione tramite Firefly Services.',
  },
  workfront: {
    url: 'https://experienceleague.adobe.com/en/docs/workfront/using/home',
    label: 'Adobe Workfront',
    data: 'documentazione pubblica',
    cosaDice: 'Il governo del lavoro: richieste, assegnazioni, scadenze, approvazioni e stato di avanzamento su campagne e materiali. È il pezzo che tiene insieme chi chiede e chi produce.',
  },
  coworker: {
    // La descrizione di prodotto su helpx risponde 403 a qualunque accesso automatico —
    // anche a URL inesistenti — quindi un link lì non è verificabile da nessun gate.
    // L'annuncio di disponibilità generale dichiara la stessa data e risponde 200.
    url: 'https://news.adobe.com/news/2026/06/adobe-announces-general-availability-of-cx-enterprise-coworker',
    label: 'CX Enterprise Coworker',
    data: 'giugno 2026',
    cosaDice: 'Annuncio di disponibilità generale, giugno 2026: motore agentico sui processi di marketing e customer experience, con governance e supervisione umana. ⚠️ Internamente: rilascio per moduli e per coorti ancora in corso fra ottobre e novembre 2026, disponibilità sull\'Europa da confermare. In slide non si promette come cosa da accendere.',
  },
} satisfies Record<string, Fonte>;

export type ChiaveFonte = keyof typeof SOURCES;
