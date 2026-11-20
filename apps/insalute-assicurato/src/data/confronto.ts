/**
 * PARTIAMO DA VOI — le domande e il passo possibile. Fonte unica.
 *
 * Le domande vengono dal dossier interno («Le domande da fare»), riscritte per
 * stare in slide: quelle che toccano informazioni interne al gruppo restano
 * nel dossier, a voce. Il passo successivo è un'offerta a scelta, non un
 * piano: il tipo «prospettiva» chiede un tavolo di lavoro, e il cliente
 * sceglie da dove.
 */
type L = { it: string; en: string };

export const DOMANDE: { tema: L; d: L }[] = [
  { tema: { it: 'Il perimetro', en: 'The scope' }, d: { it: 'App, portale, rete e livelli di servizio: come si dividono oggi le responsabilità?', en: 'App, portal, network and service levels: how are responsibilities split today?' } },
  { tema: { it: 'La misura', en: 'Measurement' }, d: { it: 'Su quali indicatori vi misurate: tempi di liquidazione, pratiche rifatte, chiamate?', en: 'Which indicators do you measure yourselves on: payout times, resubmitted claims, calls?' } },
  { tema: { it: 'I due pubblici', en: 'Two audiences' }, d: { it: 'Chi vi chiede di più: gli assicurati, o le aziende e i fondi che li coprono?', en: 'Who asks more of you: policyholders, or the employers and funds that cover them?' } },
  { tema: { it: 'Gli strumenti', en: 'The tools' }, d: { it: 'Con che cosa lavorate oggi su contenuti, comunicazioni e moduli?', en: 'What do you use today for content, communications and forms?' } },
  { tema: { it: 'Il dato', en: 'The data' }, d: { it: 'Dove passa per voi il confine fra un dato di servizio e un dato sanitario?', en: 'Where do you draw the line between service data and health data?' } },
  { tema: { it: 'Le priorità', en: 'Priorities' }, d: { it: 'Che cosa vorreste vedere migliorato entro il prossimo anno?', en: 'What would you like to see improved within the next year?' } },
];

export const PASSI: { n: string; t: L; d: L }[] = [
  { n: '1', t: { it: 'Una sessione di lavoro sul rimborso', en: 'A working session on reimbursement' }, d: { it: 'Mezza giornata con il vostro team: il percorso di oggi, gli indicatori, dove si perdono le persone.', en: 'Half a day with your team: today’s journey, the indicators, where people get lost.' } },
  { n: '2', t: { it: 'Un pilota sulle risposte degli assistenti AI', en: 'A pilot on AI assistant answers' }, d: { it: 'Poche settimane, su domande vere degli assicurati: il punto di partenza, misurato.', en: 'A few weeks, on real policyholder questions: the starting point, measured.' } },
  { n: '3', t: { it: 'Un incontro su moduli e comunicazioni', en: 'A meeting on forms and communications' }, d: { it: 'Con chi li produce oggi, per vedere che cosa si può semplificare.', en: 'With the people who produce them today, to see what can be simplified.' } },
];

export const CHIUSURA = {
  domanda: { it: 'Dei tre temi, quale vorreste vedere sul vostro caso, e con chi del vostro team?', en: 'Of the three topics, which would you like to see on your own case, and with whom from your team?' },
};
