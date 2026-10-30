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
  it: 'Una delle poche referenze bancarie pubbliche che nominano Offer Decisioning, e porta un caso di mutuo. Una pratica lasciata a metà in app, ripresa in tempo reale: parole loro.',
  en: 'One of the few public banking references naming Offer Decisioning, and it carries a mortgage case. An application left half-done in the app, resumed in real time: their words.',
};
/* Il «prima», perché una referenza senza il prima non pesa: scala,
   canali, stack di partenza. */
export const TSB_PRIMA = {
  it: 'Il prima: una grande banca retail con il 91% dei prodotti già acquistati sui canali digitali e un dato che arrivava in nove giorni. La scala non è la vostra; la forma del caso sì.',
  en: 'The before: a large retail bank with 91% of products already bought on digital channels and data arriving in nine days. The scale is not yours; the shape of the case is.',
};
export const CA_PRIMA = {
  it: 'Oltre 150 percorsi su acquisizione, ingaggio e retention, con Journey Optimizer, Real-Time CDP, Customer Journey Analytics, Target e Workfront. Prima fase in produzione in meno di sei mesi, su canali digitali e di filiale.',
  en: 'Over 150 journeys across acquisition, engagement and retention, with Journey Optimizer, Real-Time CDP, Customer Journey Analytics, Target and Workfront. First phase live in under six months, on digital and branch channels.',
};

/* Tutte e quattro dalla STESSA pagina pubblica: una fonte che regge vale
   più di quattro numeri di quattro clienti, dove basta che uno non si
   apra e cadono tutti. */
export const CIFRE_TSB = [
  { n: '9 giorni → <24 ore', l: { it: 'latenza del dato', en: 'data latency' } },
  /* ⚠️ Il +39% è su CLIENTI ESISTENTI, in app: non è una prova
     sull'acquisizione, e va detto (panel, 30 ott 2026). */
  { n: '+39%', l: { it: 'clienti in più che scelgono un prodotto TSB dopo un’interazione personalizzata', en: 'more customers choosing a TSB product following a personalized interaction' },
    lBreve: { it: 'clienti in più che scelgono un prodotto', en: 'more customers choosing a product' } },
  { n: '1.000+', l: { it: 'casi d’uso in produzione: erano 250 tre anni fa', en: 'use cases live: 250 three years ago' },
    lBreve: { it: 'casi d’uso in produzione', en: 'use cases live' } },
  { n: '91%', l: { it: 'dei prodotti acquistati sui canali digitali', en: 'of products bought digitally' } },
];

/* Le quattro misure di ACQUISIZIONE, e che cosa se ne sa oggi. L'ask del
   deck sta qui, in un posto solo: due versioni della richiesta sono il
   modo più rapido di sembrare confusi davanti a un cliente. */
/* ⚠️ Scritte per essere capite senza chi presenta. La versione prima
   diceva «oggi: non si sa → con il gruppo di controllo»: due frammenti
   che vanno ricomposti da chi legge, e in sala nessuno lo fa. Qui ogni
   riga dice una cosa sola, in parole intere.
   ⚠️ LA COLONNA «OGGI» È UNA DOMANDA, NON UN FATTO (panel, 30 ott 2026).
   Diceva «oggi non si misura», «oggi ogni campagna ha il suo limite»:
   affermazioni sullo stato della banca che nessuno ci ha chiesto, sulla
   slide dell'ask — e la banca una politica di contatto per cliente ce
   l'ha già. Ora la colonna chiede, nella forma dei «Da verificare con
   voi» dei momenti; la risposta vera si scrive dopo averla sentita.
   `estesa`: le due misure del target e della filiale entrano nel
   percorso intero; il taglio corto le salta, perché la slide-firma non
   ha sei righe di spazio. Un campo accanto, non un altro elenco. */
export const MISURE = [
  { l: { it: 'Quante simulazioni vengono riprese', en: 'How many simulations get resumed' },
    oggi: { it: 'oggi: come lo sapete?', en: 'today: how do you know?' },
    poi: { it: 'si misura, con un gruppo che non riceve niente', en: 'measured, against a group that receives nothing' } },
  { l: { it: 'Quanto passa fra il gesto e il contatto', en: 'How long between the action and the contact' },
    oggi: { it: 'oggi: in giorni, o in ore?', en: 'today: days, or hours?' },
    poi: { it: 'si contano le ore', en: 'counted in hours' } },
  { l: { it: 'Quante volte si contatta la stessa persona', en: 'How often the same person is contacted' },
    oggi: { it: 'oggi: per cliente, canale per canale?', en: 'today: per customer, channel by channel?' },
    poi: { it: 'una politica sola, valutata quando si decide', en: 'one policy, weighed at decision time' } },
  { l: { it: 'Il percorso rende, e il target era giusto', en: 'Does the journey pay, and was the target right' },
    oggi: { it: 'oggi: dalla redemption?', en: 'today: from redemption?' },
    poi: { it: 'fase 1: uplift del percorso sul controllo · fase 2: uplift per target', en: 'phase 1: journey uplift vs control · phase 2: uplift per target' },
    estesa: true },
  { l: { it: 'Quanto il digitale porta in filiale', en: 'How much digital brings into the branch' },
    oggi: { it: 'oggi: si aggancia la firma al percorso?', en: 'today: is the signature tied back to the path?' },
    poi: { it: 'appuntamenti nati online e chiusi, tempo alla delibera', en: 'appointments born online and closed, time to approval' },
    estesa: true },
  { l: { it: 'Quanto costa acquisire una cliente', en: 'What it costs to acquire a customer' },
    oggi: { it: 'oggi: per canale, o sul percorso?', en: 'today: per channel, or across the path?' },
    poi: { it: 'si sa sul percorso intero, filiale compresa', en: 'known across the whole path, branch included' },
    chiave: true },
];

/* Le condizioni del trimestre, sotto l'ask: un pilota senza soglia si
   dichiara riuscito sempre. */
export const TRIMESTRE = {
  it: 'Il trimestre parte dal primo invio, con la soglia dichiarata prima. Dentro, i KPI intermedi: riprese, appuntamenti, richieste firmate; le erogazioni dopo. Gruppo di controllo e aggancio della firma in filiale si decidono al primo tavolo; il costo per canale lo caricate voi. Dopo il trimestre viene il cross-sell dopo la firma, su clienti che nel CRM ci sono: un secondo giro, non un’alternativa.',
  en: 'The quarter starts at the first send, with the threshold declared beforehand. Inside, the intermediate KPIs: resumptions, appointments, signed applications; approvals later. Control group and the branch-signature link get decided at the first table; channel cost is loaded by you. After the quarter comes cross-sell after signature, on customers the CRM does know: a second loop, not an alternative.',
};

/* L'ASK, in un posto solo. */
export const ASK = {
  it: 'Un percorso solo, il mutuo, con il gruppo di controllo. Se non si muove, lo sappiamo in un trimestre.',
  en: 'One journey only, the mortgage, with a control group. If it does not move, we know within a quarter.',
};
