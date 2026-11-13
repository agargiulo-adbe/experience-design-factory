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
  /* Clienti e agenzie del Gruppo Unipol, al 31 dicembre 2025: «17,6 milioni
     Clienti», «2.035 agenzie e 4.910 subagenzie in Italia». Letto l'11 nov
     2026. Il modello e i risultati NON vengono da qui ma dalla sessione di
     Unipol ad Adobe Summit 2026 (CP16, 21 aprile), di cui non c'è un link
     pubblico verificato: si cita per nome. Al Summit Unipol diceva 16,8
     milioni di clienti e 2.100 agenzie: dato precedente, vince il fact sheet. */
  unipol: 'https://www.unipol.com/sites/default/files/documents/2026-06/unipol_fact_sheet_giugno_2026_1.pdf',
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

/* Una riga di CIFRE_TSB nella forma di un riquadro del caso: le cifre di
   TSB restano in un posto solo. */
function CIFRE_TSB_RIGA(i: number) {
  const c = CIFRE_TSB[i] as { n: string; l: L; lBreve?: L };
  return { n: c.n, l: c.l, lBreve: c.lBreve };
}

/* ══════════════════════════════════════════════════════════════════════
   I TRE CASI, UNA SLIDE CIASCUNO, sulla stessa grammatica (11 nov 2026):
   titolo col risultato in accento, il PRIMA e l'OGGI in grande, una cifra
   sotto la riga, due cifre a riquadro, una fascia sul «come», la fonte.
   La referenza è la slide Santander del deck Adobe; la pelle resta quella
   di Intesa. Il componente è `components/Caso.astro`, e lo usano sia il
   percorso intero sia il taglio «In dieci minuti»: stesso oggetto, la
   versione corta è un campo accanto (`lBreve`, `ponteBreve`).

   ⚠️ Qui sono confluiti TSB_SUB, TSB_PRIMA, CA_PRIMA e CA_CIFRE, con le
   correzioni del fact-check dell'11 nov 2026 che portavano:
   · TSB: il 91% è lo stato di OGGI, il prima è solo la latenza di nove
     giorni, e «grande banca» la pagina non lo dice;
   · TSB: il +39% è su clienti ESISTENTI e senza base: «base non
     pubblicata» resta accanto alla cifra, anche nel taglio corto;
   · Crédit Agricole: il +15% non viene da percorsi di filiale ma
     «particularly for self-service offers triggered by real-time
     behaviour»; base e periodo non pubblicati, e si dice accanto;
   · Crédit Agricole: la frase dei sei mesi non parla di filiale.
   Santander, letta l'11 nov 2026 sulla pagina BR: «antes disparadas
   apenas após três dias, agora são ativadas em até 15 minutos» (campagne
   di abbandono), «aumento de 600% na conversão», «+100 milhões de
   perfis», «2,3 vezes mais conversão» delle personalizzate sulle
   generiche, CoE «no início de 2025» per la governance globale, e
   «ecossistema comum entre países». ⚠️ La riga «competenze costruite
   dentro la banca» della slide di riferimento NON è sulla pagina: fuori.
   ══════════════════════════════════════════════════════════════════════ */
type L = { it: string; en: string };
export interface Caso {
  slug: string; nome: string;
  occ: L;
  titolo: { pre: L; accento: L };
  hero: { occ: L; prima?: { n: L }; oggi: { k: L; n: L }; l?: L };
  metrica: { n: string; l: L; lBreve?: L };
  nota?: L;
  riquadri: { n: string; l: L; lBreve?: L }[];
  fascia: { occ: L; testo: L; icona: 'riprende' | 'rete' | 'strati' };
  ponte?: L; ponteBreve?: L;
  fonte: { url: string; nome: string };
  /** Dopo il link: di che cosa è fonte, e una seconda fonte senza link. */
  fonteCoda?: L;
}

/* ⚠️ L'ORDINE IN PAGINA (11 nov 2026, owner): Santander, Crédit Agricole,
   TSB, Unipol. La cornice «nessuno di questi è un caso come il vostro» sta
   sul PRIMO caso, Santander; TSB tiene il ponte sulla filiale. */
export const CASI: Record<'tsb' | 'santander' | 'creditAgricole' | 'unipol', Caso> = {
  tsb: {
    slug: 'tsb', nome: 'TSB',
    occ: { it: 'Un caso britannico', en: 'A UK case' },
    titolo: { pre: { it: 'TSB:', en: 'TSB:' }, accento: { it: 'il dato in meno di 24 ore', en: 'data in under 24 hours' } },
    hero: {
      occ: { it: 'La latenza del dato', en: 'Data latency' },
      prima: { n: { it: '9 giorni', en: '9 days' } },
      oggi: { k: { it: 'Oggi', en: 'Today' }, n: { it: '<24 ore', en: '<24 hours' } },
    },
    metrica: CIFRE_TSB_RIGA(1),
    riquadri: [CIFRE_TSB_RIGA(2), CIFRE_TSB_RIGA(3)],
    fascia: {
      occ: { it: 'Prima banca britannica su Experience Platform', en: 'The first UK bank on Experience Platform' },
      testo: { it: 'Una pratica di mutuo lasciata a metà in app, ripresa in tempo reale', en: 'A mortgage application left half-done in the app, resumed in real time' },
      icona: 'riprende',
    },
    ponte: { it: 'Da voi il mutuo si chiude in filiale: per questo la misura conta anche gli appuntamenti.', en: 'At your bank the mortgage closes in branch: that is why the measurement also counts appointments.' },
    ponteBreve: { it: 'Da voi il mutuo si chiude in filiale: la misura conta anche gli appuntamenti.', en: 'At your bank the mortgage closes in branch: the measurement also counts appointments.' },
    fonte: { url: FONTI.tsb, nome: 'business.adobe.com · TSB' },
  },
  santander: {
    slug: 'santander', nome: 'Santander Brasil',
    occ: { it: 'Un caso internazionale · Gruppo Santander', en: 'An international case · Santander Group' },
    titolo: { pre: { it: 'Santander Brasil:', en: 'Santander Brasil:' }, accento: { it: 'reagire entro 15 minuti', en: 'reacting within 15 minutes' } },
    hero: {
      occ: { it: 'Le iniziative per chi abbandona a metà', en: 'Initiatives for people who drop out halfway' },
      prima: { n: { it: '3 giorni', en: '3 days' } },
      oggi: { k: { it: 'Oggi, entro', en: 'Today, within' }, n: { it: '15 minuti', en: '15 minutes' } },
    },
    metrica: { n: '+600%', l: { it: 'conversioni su queste iniziative', en: 'conversions on these initiatives' } },
    riquadri: [
      { n: '100 mln+', l: { it: 'profili cliente in una vista unica', en: 'customer profiles in a single view' } },
      { n: '2,3x', l: { it: 'conversione delle iniziative personalizzate sulle generiche', en: 'conversion of personalized initiatives over generic ones' } },
    ],
    fascia: {
      occ: { it: 'Dal 2025 · Center of Excellence', en: 'Since 2025 · Center of Excellence' },
      testo: { it: 'Governance globale dei dati · un ecosistema comune fra i Paesi del gruppo', en: 'Global data governance · one ecosystem shared across the group’s countries' },
      icona: 'rete',
    },
    ponte: { it: 'Nessuno di questi casi è uguale al vostro: i numeri sono quelli dichiarati in pubblico.', en: 'None of these cases is the same as yours: the figures are the ones stated in public.' },
    fonte: { url: FONTI.santander, nome: 'business.adobe.com · Santander' },
  },
  creditAgricole: {
    slug: 'credit-agricole', nome: 'Crédit Agricole Italia',
    occ: { it: 'Un caso italiano · Gruppo Crédit Agricole', en: 'An Italian case · Crédit Agricole Group' },
    titolo: { pre: { it: 'Crédit Agricole Italia:', en: 'Crédit Agricole Italia:' }, accento: { it: '+15% al primo acquisto', en: '+15% on first purchase' } },
    hero: {
      occ: { it: 'Le offerte attivate dal comportamento in tempo reale', en: 'Offers triggered by real-time behaviour' },
      oggi: { k: { it: 'Conversioni', en: 'Conversions' }, n: { it: '+15%', en: '+15%' } },
      l: { it: 'al primo acquisto, soprattutto sulle offerte self-service', en: 'on first purchase, particularly on self-service offers' },
    },
    metrica: { n: '+20%', l: { it: 'efficacia delle iniziative di cross-sell', en: 'cross-sell initiative effectiveness' } },
    nota: { it: 'Base e periodo non pubblicati.', en: 'Baseline and period not published.' },
    riquadri: [
      { n: '150+', l: { it: 'percorsi su acquisizione, ingaggio e retention', en: 'journeys across acquisition, engagement and retention' } },
      { n: '<6 mesi', l: { it: 'alla prima fase in produzione', en: 'to the first phase in production' } },
    ],
    fascia: {
      occ: { it: 'Cinque prodotti Adobe', en: 'Five Adobe products' },
      testo: { it: 'Journey Optimizer · Real-Time CDP · Customer Journey Analytics · Target · Workfront', en: 'Journey Optimizer · Real-Time CDP · Customer Journey Analytics · Target · Workfront' },
      icona: 'strati',
    },
    fonte: { url: FONTI.creditAgricole, nome: 'business.adobe.com · Crédit Agricole Italia' },
  },
  /* Unipol — assicurazioni, non banca. Il punto per chi è in sala: una rete
     fisica grande (agenzie) e il digitale nella stessa analisi, con le
     campagne misurate anche su quello che si vende fuori dal digitale. È la
     forma del problema della filiale.
     Dalla sessione del Summit (testo delle slide): «Website · APP · Agents
     selling tool · SalesForce · Issued Policies DB» nello stesso modello;
     «Impact of marketing campaign on offline conversion»; «–90% time to
     deliver integrated analyses»; «2x faster root cause identification».
     ⚠️ Referenziabilità: Unipol ha parlato in pubblico (Summit, aprile 2026;
     AI Forum di Milano, 21 ott 2026), ma uno stato «Referenceable» formale
     non risulta; un case study Adobe è in lavorazione. Confermare col team
     dell'account Unipol prima del 19 novembre. */
  unipol: {
    slug: 'unipol', nome: 'Unipol',
    occ: { it: 'Unipol · assicurazioni, Italia', en: 'Unipol · insurance, Italy' },
    titolo: { pre: { it: 'Unipol:', en: 'Unipol:' }, accento: { it: 'agenzie e digitale nella stessa analisi', en: 'agencies and digital in one analysis' } },
    hero: {
      occ: { it: 'Agenzie, sito, app e polizze nella stessa analisi', en: 'Agencies, website, app and policies in one analysis' },
      oggi: { k: { it: 'Clienti', en: 'Customers' }, n: { it: '17,6 mln', en: '17.6 m' } },
      l: { it: 'del gruppo, al 31 dicembre 2025', en: 'of the group, at 31 December 2025' },
    },
    metrica: { n: '2.035', l: { it: 'agenzie in Italia', en: 'agencies in Italy' } },
    riquadri: [
    ],
    fascia: {
      occ: { it: 'Adobe Summit 2026 · la sessione di Unipol', en: 'Adobe Summit 2026 · Unipol’s session' },
      testo: { it: 'Un modello di analisi omnicanale su Customer Journey Analytics', en: 'An omnichannel analysis model on Customer Journey Analytics' },
      icona: 'rete',
    },
    fonte: { url: FONTI.unipol, nome: 'unipol.com · fact sheet, giugno 2026' },
    fonteCoda: { it: ' · clienti e agenzie <span class=im-nw>al 31 dicembre 2025.</span> Il modello: Unipol ad Adobe Summit 2026', en: ' · customers and agencies <span class=im-nw>at 31 December 2025.</span> The model: Unipol at Adobe Summit 2026' },
  },
};

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
    oggi: { it: 'oggi: da quale fonte?', en: 'today: from which source?' },
    poi: { it: 'si misura, con un gruppo che resta nel processo di oggi', en: 'measured, against a group that stays in today’s process' },
    poiLungo: { it: 'si misura con un gruppo che resta nel processo di oggi, approvato dalla Rete in fase 0', en: 'measured against a group that stays in today’s process, approved by the Network in phase 0' } },
  { davanti: true, l: { it: 'Quante simulazioni lasciano email e consenso', en: 'How many simulations leave an email and consent' },
    oggi: { it: 'oggi: lo misurate?', en: 'today: do you measure it?' },
    poi: { it: 'tasso di consenso, dal primo giorno', en: 'consent rate, from day one' },
    poiLungo: { it: 'tasso di consenso, dal primo giorno: senza, le altre misure non partono', en: 'consent rate, from day one: without it the other measures cannot start' },
    estesa: true },
  { l: { it: 'Quanto passa fra l’azione e il contatto', en: 'How long between the action and the contact' },
    oggi: { it: 'oggi: in giorni, o in ore?', en: 'today: days, or hours?' },
    poi: { it: 'si contano le ore', en: 'counted in hours' } },
  { l: { it: 'Quante volte si contatta la stessa persona', en: 'How often the same person is contacted' },
    oggi: { it: 'oggi: per cliente, canale per canale?', en: 'today: per customer, channel by channel?' },
    poi: { it: 'contatti per persona, dentro la vostra politica di contatto', en: 'contacts per person, inside your contact policy' } },
  { davanti: true, l: { it: 'Resa del percorso e scelta del target', en: 'Journey return and target choice' },
    oggi: { it: 'oggi: dalla redemption?', en: 'today: from redemption?' },
    poi: { it: 'fase 1: uplift del percorso sul controllo; il target in fase 2, o già in fase 1 con due regole se i volumi bastano', en: 'phase 1: journey uplift vs control; the target in phase 2, or in phase 1 with two rules if volumes allow' },
    estesa: true },
  { davanti: true, l: { it: 'Quanto il digitale porta in filiale', en: 'How much digital brings into the branch' },
    oggi: { it: 'oggi: si aggancia la firma al percorso?', en: 'today: is the signature tied back to the path?' },
    poi: { it: 'appuntamenti nati online, chiusi e non chiusi, e costo per appuntamento', en: 'appointments born online, closed and not closed, and cost per appointment' },
    estesa: true },
  { l: { it: 'Quanto costa una richiesta firmata, per canale', en: 'What a signed application costs, per channel' },
    oggi: { it: 'oggi: per canale, o sul percorso?', en: 'today: per channel, or across the path?' },
    poi: { it: 'con la spesa pubblicitaria per canale caricata ogni giorno', en: 'with ad spend per channel loaded daily' },
    poiLungo: { it: 'la spesa pubblicitaria entra ogni giorno con il suo identificativo. I costi di rete dal Controllo di Gestione, con un criterio di ripartizione concordato con Canali in fase 0', en: 'ad spend comes in daily with its own ID. Network costs from Management Control, with an allocation rule agreed with Channels in phase 0' },
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
    v: { it: 'un’azione della cliente entro 14 giorni, su qualunque canale: simulazione completata, documenti caricati o appuntamento preso; i giorni si fissano in fase 0', en: 'an action by the customer within 14 days, on any channel: simulation completed, documents uploaded or appointment booked; the days are set in phase 0' } },
  { k: { it: 'Il gruppo di controllo', en: 'The control group' },
    v: { it: 'quota del 5-10%, fissata in fase 0 sui volumi. Si estrae per browser sulla proposta del sito e per profilo sui richiami dopo il consenso; lo stesso non cliente su due dispositivi è un limite noto', en: 'a 5-10% share, set in phase 0 on volumes. Drawn per browser for the site offer and per profile for follow-ups after consent; the same non-customer on two devices is a known limit' } },
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
  it: 'Fase 0 progettazione · fase 1 licenza e trimestre di misura, poi si estende o si ferma.',
  en: 'Phase 0 design · phase 1 licence and a quarter of measurement, then it extends or stops.',
};

export const ASK = {
  it: 'Un percorso solo, il mutuo, <span class=im-nw>con il gruppo di controllo.</span> Dal primo invio, un trimestre dice se le riprese si muovono.',
  en: 'One journey only, the mortgage, with a control group. From the first send, a quarter tells whether resumptions move.',
};
