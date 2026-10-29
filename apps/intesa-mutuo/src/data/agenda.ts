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
  {
    n: '01', capitolo: 'adobe',
    titolo: { it: 'Adobe, chi siamo', en: 'Adobe, who we are' },
    riga: { it: 'Posizionamento nei servizi finanziari e obiettivo dell’incontro', en: 'Positioning in financial services, and what this meeting is for' },
  },
  {
    n: '02', capitolo: 'adobe',
    titolo: { it: 'Tutta l’offerta Adobe', en: 'The whole Adobe offering' },
    riga: { it: 'Da farsi trovare alla misura: i blocchi, e come stanno insieme', en: 'From being found to measurement: the blocks, and how they hold together' },
  },
  {
    n: '03', capitolo: 'momenti',
    titolo: { it: 'Lo stesso mutuo, dai due lati', en: 'The same mortgage, from both sides' },
    riga: { it: 'Sette momenti di una persona che non vi conosce ancora, e che cosa succede dall’altra parte', en: 'Seven moments of someone who does not know you yet, and what happens on the other side' },
  },
  {
    n: '04', capitolo: null,
    titolo: { it: 'Dal dato alla decisione', en: 'From data to decision' },
    riga: { it: 'Misurare i canali, scegliere chi contattare, decidere l’offerta', en: 'Measure the channels, choose who to contact, decide the offer' },
  },
  {
    n: '05', capitolo: null,
    titolo: { it: 'Dove ci innestiamo', en: 'Where we plug in' },
    riga: { it: 'L’architettura di arrivo: che cosa resta vostro, che cosa aggiungiamo', en: 'The target architecture: what stays yours, what we add' },
  },
  {
    n: '06', capitolo: null,
    titolo: { it: 'Il lavoro si chiede a parole', en: 'The work is asked for in words' },
    riga: { it: 'Dalla domanda al dato, dall’obiettivo alla campagna pronta', en: 'From question to data, from objective to a campaign ready to go' },
  },
  {
    n: '07', capitolo: 'risultati',
    titolo: { it: 'Banche che lo fanno già', en: 'Banks already doing it' },
    riga: { it: 'Che cosa hanno in produzione, con quali numeri', en: 'What they run in production, with which numbers' },
  },
  {
    n: '08', capitolo: null,
    titolo: { it: 'Prossimi passi', en: 'Next steps' },
    riga: { it: 'Che cosa facciamo da qui, chi lo fa, entro quando', en: 'What we do from here, who does it, by when' },
  },
];
