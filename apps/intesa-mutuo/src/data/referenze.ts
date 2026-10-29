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
export const MISURE = [
  { l: { it: 'Simulazioni riprese', en: 'Simulations resumed' },
    oggi: { it: 'oggi: non si sa', en: 'today: unknown' },
    poi: { it: 'con il gruppo di controllo', en: 'with the control group' } },
  { l: { it: 'Ore fra l’evento e il contatto', en: 'Hours between event and contact' },
    oggi: { it: 'oggi: giorni', en: 'today: days' },
    poi: { it: 'obiettivo: ore', en: 'target: hours' } },
  { l: { it: 'Contatti per prospect', en: 'Contacts per prospect' },
    oggi: { it: 'oggi: per campagna', en: 'today: per campaign' },
    poi: { it: 'un tetto solo', en: 'one cap' } },
  { l: { it: 'Costo per cliente acquisito', en: 'Cost per acquired customer' },
    oggi: { it: 'oggi: per canale', en: 'today: per channel' },
    poi: { it: 'sul percorso intero', en: 'across the whole path' },
    chiave: true },
];

/* L'ASK, in un posto solo. */
export const ASK = {
  it: 'Un percorso solo, il mutuo, con il gruppo di controllo. Se non si muove, lo sappiamo in un trimestre.',
  en: 'One journey only, the mortgage, with a control group. If it does not move, we know within a quarter.',
};
