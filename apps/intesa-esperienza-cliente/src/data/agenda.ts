/**
 * L'AGENDA DELL'INCONTRO DEL 5 NOVEMBRE — fonte unica.
 *
 * ⚠️ NON È L'ELENCO DEI CAPITOLI, ed è il motivo per cui questo file
 * esiste invece di riusare `chapters.ts`. I capitoli sono quello che il
 * documento contiene **oggi**; l'agenda è quello di cui si parlerà in
 * sala, e mentre il deck del 5 novembre viene innestato un pezzo per
 * volta le due cose non coincidono. Un'agenda che mostra solo ciò che è
 * già pronto non è l'agenda dell'incontro: è un indice.
 *
 * Le voci vengono dall'agenda del `.pptx` (slide 03), con una
 * differenza dichiarata: lì **la storia di Giulia non ha una voce** —
 * stava dentro «Tutta l'offerta Adobe». Qui è metà del documento, e una
 * voce ce l'ha.
 *
 * `capitolo` è lo slug del capitolo che già copre quella voce. Finché è
 * `null` la voce si legge ma non si clicca: si aggiorna quando il pezzo
 * viene innestato, e questo file è l'unico posto da toccare.
 */
export interface VoceAgenda {
  n: string;
  titolo: { it: string; en: string };
  riga: { it: string; en: string };
  /** Lo slug del capitolo, quando esiste. `null` = ancora da innestare. */
  capitolo: string | null;
}

export const AGENDA: VoceAgenda[] = [
  /* ⚠️ UN INDICE SOLO (panel del 30 ott 2026). La copertina titolava
     «02 Tutta l'offerta Adobe · 03 Lo stesso mutuo · 04 Dal dato alla
     decisione» mentre la barra e le cover dicevano «02 Scenario · 03 La
     persona · 04 I sette momenti»: due indici dello stesso documento,
     e chi seguiva l'agenda non ritrovava i capitoli. Ora i numeri e i
     titoli sono quelli della barra, che è quella che si percorre; la
     `riga` resta il posto dove l'agenda dice di che cosa si parla. */
  {
    n: '01', capitolo: 'adobe',
    titolo: { it: 'Adobe per Intesa Sanpaolo', en: 'Adobe for Intesa Sanpaolo' },
    riga: { it: 'Chi siamo, i blocchi dell’offerta, e le tre cose di cui si parla oggi', en: 'Who we are, the building blocks, and the three things on the table today' },
  },
  {
    n: '02', capitolo: 'scenario',
    titolo: { it: 'Scenario', en: 'Scenario' },
    riga: { it: 'Il segnale che c’è già, e il motore di targeting che resta', en: 'The signal that already exists, and the targeting engine that stays' },
  },
  {
    n: '03', capitolo: 'persona',
    titolo: { it: 'La persona', en: 'The persona' },
    riga: { it: 'Giulia, 34 anni, non è vostra cliente: le sue tracce, e i dati che mancano', en: 'Giulia, 34, not your customer: her traces, and the data that is missing' },
  },
  {
    n: '04', capitolo: 'momenti',
    titolo: { it: 'I sette momenti, dai due lati', en: 'Seven moments, from both sides' },
    riga: { it: 'Sopra la sua vista, sotto la vostra; poi gli approfondimenti su dato, profilo, regia e arbitro', en: 'Her view above, yours below; then the deep dives on data, profile, orchestration and the arbiter' },
  },
  {
    n: '05', capitolo: 'circolo',
    titolo: { it: 'Il giro che si chiude', en: 'The loop that closes' },
    riga: { it: 'Il ritorno, e su chi lavora: su lei, e sulla prospect ancora da conoscere', en: 'The return, and who it works on: on her, and on the prospect still unknown' },
  },
  {
    n: '06', capitolo: 'coworker',
    titolo: { it: 'Il lavoro si chiede a parole', en: 'The work is asked for in words' },
    riga: { it: 'Dall’obiettivo alla campagna pronta, con i vostri dati', en: 'From objective to a campaign ready to go, on your data' },
  },
  {
    n: '07', capitolo: 'risultati',
    titolo: { it: 'Banche che lo fanno già', en: 'Banks already doing it' },
    riga: { it: 'Che cosa hanno in produzione, con quali numeri', en: 'What they run in production, with which numbers' },
  },
  {
    n: '08', capitolo: 'analytics',
    titolo: { it: 'CX Analytics', en: 'CX analytics' },
    riga: { it: 'Che cosa si misura, e che cosa se ne fa chi decide', en: 'What gets measured, and what the decision-makers do with it' },
  },
  {
    n: '09', capitolo: 'prossimi-passi',
    titolo: { it: 'Prossimi passi', en: 'Next steps' },
    riga: { it: 'Le misure dal giorno uno, e quello che ci serve da voi', en: 'The measures from day one, and what we need from you' },
  },
];
