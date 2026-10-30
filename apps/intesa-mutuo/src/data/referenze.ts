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
};

/* Tutte e quattro dalla STESSA pagina pubblica: una fonte che regge vale
   più di quattro numeri di quattro clienti, dove basta che uno non si
   apra e cadono tutti. */
export const CIFRE_TSB = [
  { n: '9 giorni → 24 ore', l: { it: 'latenza del dato', en: 'data latency' } },
  { n: '+39%', l: { it: 'clienti che scelgono un prodotto dopo un’interazione personalizzata', en: 'customers choosing a product after a personalized interaction' },
    lBreve: { it: 'sceglie un prodotto dopo un’interazione personalizzata', en: 'choose a product after a personalized interaction' } },
  { n: '1.000+', l: { it: 'casi d’uso in produzione: erano 250 tre anni fa', en: 'use cases live: 250 three years ago' },
    lBreve: { it: 'casi d’uso in produzione', en: 'use cases live' } },
  { n: '91%', l: { it: 'dei prodotti acquistati sui canali digitali', en: 'of products bought digitally' } },
];

/* Le quattro misure di ACQUISIZIONE, e che cosa se ne sa oggi. L'ask del
   deck sta qui, in un posto solo: due versioni della richiesta sono il
   modo più rapido di sembrare confusi davanti a un cliente. */
/* ⚠️ Scritte per essere capite senza chi presenta. La versione prima
   diceva «oggi: non si sa → con il gruppo di controllo»: due frammenti
   che vanno ricomposti da chi legge, e in sala nessuno lo fa. Qui ogni
   riga dice una cosa sola, in parole intere. */
export const MISURE = [
  { l: { it: 'Quante simulazioni vengono riprese', en: 'How many simulations get resumed' },
    oggi: { it: 'oggi non si misura', en: 'not measured today' },
    poi: { it: 'si misura, con un gruppo che non riceve niente', en: 'measured, against a group that receives nothing' } },
  { l: { it: 'Quanto passa fra il gesto e il contatto', en: 'How long between the action and the contact' },
    oggi: { it: 'oggi si contano i giorni', en: 'today it is counted in days' },
    poi: { it: 'si contano le ore', en: 'counted in hours' } },
  { l: { it: 'Quante volte si contatta la stessa persona', en: 'How often the same person is contacted' },
    oggi: { it: 'oggi ogni campagna ha il suo limite', en: 'today each campaign has its own limit' },
    poi: { it: 'un limite solo, valido su tutti i canali', en: 'one limit, across every channel' } },
  { l: { it: 'Quanto costa acquisire una cliente', en: 'What it costs to acquire a customer' },
    oggi: { it: 'oggi si sa per canale', en: 'today known per channel' },
    poi: { it: 'si sa sul percorso intero, filiale compresa', en: 'known across the whole path, branch included' },
    chiave: true },
];

/* L'ASK, in un posto solo. */
export const ASK = {
  it: 'Un percorso solo, il mutuo, con il gruppo di controllo. Se non si muove, lo sappiamo in un trimestre.',
  en: 'One journey only, the mortgage, with a control group. If it does not move, we know within a quarter.',
};
