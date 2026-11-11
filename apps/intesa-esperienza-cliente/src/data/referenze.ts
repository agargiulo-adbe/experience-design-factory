/**
 * Le referenze pubbliche e le misure — FONTE UNICA.
 *
 * ⚠️ Stanno qui, e non dentro le pagine, perché il percorso intero e il
 * taglio «In dieci minuti» le usano entrambi. Due copie a mano degli
 * stessi numeri divergono sempre, e diverge sempre il taglio corto,
 * perché le correzioni arrivano sul lungo (memoria
 * `taglio-corto-stessa-fonte`, e il gate è `pnpm audit:taglio`).
 *
 * Fonti aperte e lette il 29 ott 2026. Il link si cita perché chi riceve
 * il deck non era in sala e il controllo lo fa davvero.
 */
export const FONTI = {
  tsb: 'https://business.adobe.com/customer-success-stories/tsb-case-study.html',
  santander: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html',
  /* ⚠️ Il deck la dava «caso non pubblicato, si cita a voce»: era FALSO.
     La pagina è pubblica con esattamente +15% e +20%, e tre personas
     volevano tagliare la referenza per quell'etichetta (panel, 30 ott
     2026). Letta e verificata il 30 ott 2026. */
  creditAgricole: 'https://business.adobe.com/uk/customer-success-stories/credit-agricole-italia.html',
};

/* La riga sotto il titolo di TSB, in un posto solo perché la rendono
   due pagine (percorso intero e taglio corto).
   ⚠️ Diceva «l'unica referenza pubblica in cui Offer Decisioning è
   nominato»: falso — la pagina di U.S. Bank nomina «the offer decisioning
   capability of Adobe Journey Optimizer». Corretto il 30 ott 2026. */
export const TSB_SUB = {
  it: 'Prima banca britannica su Experience Platform. Una pratica di mutuo lasciata a metà in app, ripresa in tempo reale.',
  en: 'The first UK bank on Experience Platform. A mortgage application left half-done in the app, resumed in real time.',
};
/* Il «prima», perché una referenza senza il prima non pesa.
   ⚠️ Diceva «Il prima: una grande banca retail con il 91% dei prodotti già
   acquistati sui canali digitali»: smentito alla fonte (fact-check, 11 nov
   2026). Il 91% è lo stato di OGGI («Today, more than 91% of products…»),
   il prima è solo la latenza di nove giorni, e «grande banca» la pagina non
   lo dice. Riletta l'11 nov 2026.
   `breve` è per il taglio «In dieci minuti»: stesso oggetto, un campo
   accanto (regola `taglio-corto-stessa-fonte`). */
export const TSB_PRIMA = {
  it: 'Il prima: un dato che arrivava in nove giorni. Oggi oltre il 91% dei prodotti si compra sui canali digitali. Da voi il mutuo si chiude in filiale: per questo l’imbuto conta gli appuntamenti.',
  en: 'The before: data that arrived in nine days. Today over 91% of products are bought on digital channels. At your bank the mortgage closes in branch: that is why the funnel also counts appointments.',
  breve: {
    it: 'Il prima: un dato che arrivava in nove giorni. Oggi oltre il 91% è digitale; da voi il mutuo si chiude in filiale.',
    en: 'The before: data that arrived in nine days. The 91% is today’s; at your bank the mortgage closes in branch.',
  },
};
/* ⚠️ «Prima fase in produzione in meno di sei mesi, su canali digitali e
   di filiale»: la frase dei sei mesi sulla pagina non parla di filiale
   (fact-check, 11 nov 2026). Il pezzo si toglie da qui. */
export const CA_PRIMA = {
  it: 'Oltre 150 percorsi su acquisizione, ingaggio e retention, con Journey Optimizer, Real-Time CDP, Customer Journey Analytics, Target e Workfront. Prima fase in produzione in meno di sei mesi.',
  en: 'Over 150 journeys across acquisition, engagement and retention, with Journey Optimizer, Real-Time CDP, Customer Journey Analytics, Target and Workfront. First phase live in under six months.',
};
/* Crédit Agricole Italia, le cifre con la loro cornice. ⚠️ Il +15% NON
   viene da percorsi di filiale: la pagina dice «particularly for
   self-service offers triggered by real-time behaviour», con l'esempio
   della rateizzazione in app dopo un pagamento con carta. Base e periodo
   non sono pubblicati, e si dice. Riletta l'11 nov 2026. */
export const CA_CIFRE = {
  it: '+15% di conversioni al primo acquisto, soprattutto sulle offerte self-service attivate dal comportamento in tempo reale, e +20% di efficacia delle campagne di cross-sell. Base e periodo non pubblicati.',
  en: '+15% first-purchase conversions, particularly on self-service offers triggered by real-time behaviour, and +20% cross-sell campaign effectiveness. Baseline and period not published.',
};
/* La cornice delle referenze, in un posto solo. ⚠️ Diceva «i numeri sono
   quelli pubblicati da loro»: sono casi pubblicati da Adobe, con i
   portavoce delle banche citati (fact-check, 11 nov 2026). */
export const REF_CORNICE = {
  it: 'I numeri sono quelli dei casi pubblici, con i loro portavoce citati.',
  en: 'The numbers are those of the public case studies, with their spokespeople quoted.',
};

/* Tutte e quattro dalla STESSA pagina pubblica: una fonte che regge vale
   più di quattro numeri di quattro clienti, dove basta che uno non si
   apra e cadono tutti. */
export const CIFRE_TSB = [
  { n: '9 giorni → <24 ore', l: { it: 'latenza del dato', en: 'data latency' } },
  /* ⚠️ Il +39% è su CLIENTI ESISTENTI, in app: non è una prova
     sull'acquisizione, e va detto (panel, 30 ott 2026). La pagina dice
     «This year, we’ve seen 39% more customers…» senza base: «base non
     pubblicata» sta accanto alla cifra, anche nel taglio corto (panel,
     11 nov 2026). */
  { n: '+39%', l: { it: 'clienti in più che scelgono un prodotto TSB dopo un’interazione personalizzata · base non pubblicata', en: 'more customers choosing a TSB product following a personalized interaction · baseline not published' },  },
  { n: '1.000+', l: { it: 'casi d’uso in produzione: erano 250 tre anni fa', en: 'use cases live: 250 three years ago' },
    lBreve: { it: 'casi d’uso in produzione', en: 'use cases live' } },
  { n: '91%', l: { it: 'dei prodotti, oggi, si compra sui canali digitali', en: 'of products are bought digitally today' },
    lBreve: { it: 'dei prodotti, oggi, comprati sui canali digitali', en: 'of products bought digitally today' } },
];

/* Le misure di ACQUISIZIONE, e che cosa se ne sa oggi. L'ask del deck sta
   qui, in un posto solo: due versioni della richiesta sono il modo più
   rapido di sembrare confusi davanti a un cliente. */
/* ⚠️ Scritte per essere capite senza chi presenta. Ogni riga dice una cosa
   sola, in parole intere.
   ⚠️ LA COLONNA «OGGI» È UNA DOMANDA, NON UN FATTO (panel, 30 ott 2026, e
   «non toccare» del panel dell'11 nov). La risposta vera si scrive dopo
   averla sentita.
   Giro dell'11 nov 2026: sette misure, non sei. Entra il TASSO DI
   CONSENSO, che è la porta di tutte le altre; la riga della filiale conta
   anche gli appuntamenti NON chiusi e il costo per appuntamento; il costo
   diventa «per richiesta firmata, per canale», con da dove arriva la
   spesa; e «una politica sola, valutata quando si decide» esce: la
   politica di contatto resta della banca (frase canonica).
   `davanti`: le quattro che si proiettano in prossimi-passi/slide-da-voi; le
   altre stanno nel dettaglio (sintesi del capitolo, 11 nov 2026).
   `estesa`: misure che il taglio corto può saltare. `poi` è la forma che
   regge anche nel taglio corto; `poiLungo` la rende il percorso intero. Campi accanto, mai un
   altro elenco. */
export const MISURE = [
  { davanti: true, l: { it: 'Quante simulazioni vengono riprese', en: 'How many simulations get resumed' },
    oggi: { it: 'oggi: come lo sapete?', en: 'today: how do you know?' },
    poi: { it: 'si misura, con un gruppo che resta nel processo di oggi', en: 'measured, against a group that stays in today’s process' },
    poiLungo: { it: 'si misura con un gruppo che resta nel processo di oggi, approvato dalla Rete in fase 0', en: 'measured against a group that stays in today’s process, approved by the Network in phase 0' } },
  { davanti: true, l: { it: 'Quante simulazioni lasciano email e consenso', en: 'How many simulations leave an email and consent' },
    oggi: { it: 'oggi: lo misurate?', en: 'today: do you measure it?' },
    poi: { it: 'tasso di consenso, dal primo giorno', en: 'consent rate, from day one' },
    poiLungo: { it: 'tasso di consenso, dal primo giorno: senza, le altre misure non partono', en: 'consent rate, from day one: without it the other measures cannot start' },
    estesa: true },
  { l: { it: 'Quanto passa fra il gesto e il contatto', en: 'How long between the action and the contact' },
    oggi: { it: 'oggi: in giorni, o in ore?', en: 'today: days, or hours?' },
    poi: { it: 'si contano le ore', en: 'counted in hours' } },
  { l: { it: 'Quante volte si contatta la stessa persona', en: 'How often the same person is contacted' },
    oggi: { it: 'oggi: per cliente, canale per canale?', en: 'today: per customer, channel by channel?' },
    poi: { it: 'la regola di contatto resta vostra', en: 'the contact rule stays yours' } },
  { davanti: true, l: { it: 'Il percorso rende, e il target era giusto', en: 'Does the journey pay, and was the target right' },
    oggi: { it: 'oggi: dalla redemption?', en: 'today: from redemption?' },
    poi: { it: 'fase 1: uplift del percorso sul controllo · fase 2: uplift per target', en: 'phase 1: journey uplift vs control · phase 2: uplift per target' },
    estesa: true },
  { davanti: true, l: { it: 'Quanto il digitale porta in filiale', en: 'How much digital brings into the branch' },
    oggi: { it: 'oggi: si aggancia la firma al percorso?', en: 'today: is the signature tied back to the path?' },
    poi: { it: 'appuntamenti nati online, chiusi e non chiusi, e costo per appuntamento', en: 'appointments born online, closed and not closed, and cost per appointment' },
    estesa: true },
  { l: { it: 'Quanto costa una richiesta firmata, per canale', en: 'What a signed application costs, per channel' },
    oggi: { it: 'oggi: per canale, o sul percorso?', en: 'today: per channel, or across the path?' },
    poi: { it: 'con la spesa per canale portata in piattaforma', en: 'with spend per channel brought into the platform' },
    poiLungo: { it: 'la spesa per campagna entra ogni giorno con l’identificativo di campagna. I costi di rete dal Controllo di Gestione, con un criterio di ripartizione concordato con Canali in fase 0', en: 'campaign spend comes in daily with the campaign ID. Network costs from Management Control, with an allocation rule agreed with Channels in phase 0' },
    chiave: true },
];

/* Le condizioni del trimestre, sotto l'ask: un pilota senza soglia si
   dichiara riuscito sempre. La prima frase è «da non toccare» (panel, 11
   nov 2026); la seconda era «Gruppo di controllo e costo per canale si
   decidono al primo tavolo», e ora la forma della soglia sta in `SOGLIA`. */
export const TRIMESTRE = {
  it: 'Il trimestre parte dal primo invio, con la soglia dichiarata prima.',
  en: 'The quarter starts at the first send, with the threshold declared beforehand.',
};

/* La FORMA della soglia (panel, 11 nov 2026): con circa 1.900 richieste
   firmate l'anno, in un trimestre con gruppo di controllo le firme da sole
   non mostrano niente. Si giudica su riprese e appuntamenti; le firme e
   gli erogati si leggono. X e Y non si inventano: si fissano in fase 0. */
export const SOGLIA = [
  { k: { it: 'La soglia', en: 'The threshold' },
    v: { it: 'la soglia (punti di ripresa sul controllo) e il campione minimo si calcolano in fase 0 sui vostri volumi', en: 'the threshold (resumption points versus control) and the minimum sample are calculated in phase 0 on your volumes' } },
  { k: { it: 'Che cosa è una ripresa', en: 'What counts as a resumption' },
    v: { it: 'un gesto della cliente entro 14 giorni, su qualunque canale: simulazione completata, documenti caricati o appuntamento preso; i giorni si fissano in fase 0', en: 'an action by the customer within 14 days, on any channel: simulation completed, documents uploaded or appointment booked; the days are set in phase 0' } },
  { k: { it: 'Il gruppo di controllo', en: 'The control group' },
    v: { it: 'quota del 5-10%, fissata in fase 0 sui volumi. Si estrae per browser sulla proposta del sito e per profilo sui richiami dopo il consenso; lo stesso prospect su due dispositivi è un limite noto', en: 'a 5-10% share, set in phase 0 on volumes. Drawn per browser for the site offer and per profile for follow-ups after consent; the same prospect on two devices is a known limit' } },
  { k: { it: 'Che cosa si giudica', en: 'What gets judged' },
    v: { it: 'la soglia si giudica su riprese e appuntamenti; le firme si leggono', en: 'the threshold is judged on resumptions and appointments; signatures are read' } },
  { k: { it: 'Il vincolo per la Rete', en: 'The constraint for the Network' },
    v: { it: 'vale a parità o miglioramento di appuntamenti tenuti e di firme per appuntamento sul controllo', en: 'it holds only with appointments kept and signatures per appointment equal to or better than control' } },
  { k: { it: 'Gli erogati', en: 'Disbursements' },
    v: { it: 'misura del trimestre dopo, agganciata per codice pratica', en: 'measured the following quarter, matched by application code' } },
];

/* L'ASK, in un posto solo. */
/* Il seguito in una riga, per il taglio corto (panel, 11 nov 2026, giro 2):
   chi riceve il taglio deve sapere che il pilota porta una licenza e come
   esce. Le stesse tappe di prossimi-passi/slide-fasi. */
export const SEGUITO = {
  it: 'Fase 0 disegno · fase 1 licenza e trimestre di misura, poi si estende o si ferma.',
  en: 'Phase 0 design · phase 1 licence and a quarter of measurement, then it extends or stops.',
};

export const ASK = {
  it: 'Un percorso solo, il mutuo, con il gruppo di controllo. Se non si muove, lo sappiamo in un trimestre.',
  en: 'One journey only, the mortgage, with a control group. If it does not move, we know within a quarter.',
};
