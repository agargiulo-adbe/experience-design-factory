/**
 * lega — una parola di servizio non resta appesa a fine riga.
 *
 * Articoli, preposizioni e congiunzioni brevi si legano alla parola che segue con
 * uno spazio unificatore, così il browser va a capo PRIMA di loro e non dopo. È il
 * rilievo `S` di `audit:wrap`. Le code di frase (`F`, l'ultima parola sola sulla
 * riga) non si risolvono qui: legarle con lo spazio unificatore fa sbordare il
 * blocco, ed è una trappola già pagata.
 *
 * Si applica ai testi che arrivano dai dati (`data/*.ts`) al momento della resa.
 */
const SERVIZIO = [
  'a', 'ad', 'ai', 'al', 'all’', 'alla', 'alle', 'allo', 'agli',
  'che', 'chi', 'con', 'da', 'dal', 'dai', 'dalla', 'dalle', 'dagli', 'dallo',
  'del', 'dei', 'della', 'delle', 'dello', 'degli', 'di',
  'e', 'ed', 'fra', 'gli', 'i', 'il', 'in', 'la', 'le', 'lo', 'ma', 'nel', 'nei', 'nella',
  'nelle', 'o', 'per', 'se', 'su', 'sui', 'sul', 'sulla', 'sulle', 'sugli', 'tra',
  'un', 'una', 'uno', 'è', 'non',
];
const RE = new RegExp(`(^|[\\s«(])(${SERVIZIO.join('|')}) (?=\\S)`, 'giu');

export const lega = (s: string): string => s.replace(RE, (_m, pre: string, w: string) => `${pre}${w} `)
  // due passate: «di un passo» lega anche la seconda parola di servizio
  .replace(RE, (_m, pre: string, w: string) => `${pre}${w} `);
