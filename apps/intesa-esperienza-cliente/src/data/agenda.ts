/**
 * L'AGENDA DELL'INCONTRO DEL 19 NOVEMBRE — fonte unica.
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
  /** Lo slug del capitolo, quando esiste. `null` = ancora da innestare. */
  capitolo: string | null;
  /** La slide di arrivo, quando la voce non comincia dalla prima del capitolo. */
  ancora?: string;
  /** Una seconda riga, più piccola: un tema che la voce deve nominare. */
  sotto?: { it: string; en: string };
}

export const AGENDA: VoceAgenda[] = [
  /* ⚠️ SEI VOCI, NOMI DAL CONTENUTO (decisione dell'owner, 11 nov 2026).
     L'agenda del team del 9 nov aveva sette voci: «02 L'offerta» era
     un'ancora dentro il capitolo su Adobe e nella barra non si accendeva
     mai; il caso di Giulia, metà del documento, compariva come «Dal dato
     alla decisione»; «Prossimi passi» non diceva che dentro c'è la proposta.
     Ora agenda, barra (`VOCI_NAV`), copertine e titoli di pagina portano gli
     stessi nomi e gli stessi numeri: si cambiano qui e in `chapters.ts`. */
  { n: '01', capitolo: 'adobe',
    titolo: { it: 'Adobe e l’offerta', en: 'Adobe and the offering' } },
  { n: '02', capitolo: 'scenario',
    titolo: { it: 'Giulia: un mutuo, sette momenti', en: 'Giulia: one mortgage, seven moments' } },
  { n: '03', capitolo: 'messa-a-terra',
    titolo: { it: 'Dove ci innestiamo', en: 'Where we plug in' },
    /* L'invito chiedeva «particolare attenzione alla Web Analytics»: nel
       capitolo è Customer Journey Analytics sopra Adobe Analytics, e
       l'attribuzione delle firme fino alla filiale. */
    sotto: { it: 'e come si misura, con Customer Journey Analytics', en: 'and how it is measured, with Customer Journey Analytics' } },
  { n: '04', capitolo: 'coworker',
    titolo: { it: 'CX Enterprise Coworker', en: 'CX Enterprise Coworker' } },
  { n: '05', capitolo: 'risultati',
    titolo: { it: 'Tre banche che lo fanno già', en: 'Three banks already doing it' } },
  { n: '06', capitolo: 'prossimi-passi',
    titolo: { it: 'La proposta e come si parte', en: 'The proposal and how we start' } },
];

/** Il titolo del documento, in due livelli (decisione dell'owner, 11 nov 2026):
    lo stesso nella copertina dell'incontro e in quella del taglio corto, che è
    la versione che gira al capo. Il secondo livello dice il percorso del caso. */
export const TITOLO_INCONTRO = {
  t: { it: 'Acquisire chi non è ancora vostro cliente', en: 'Winning people who are not yet your customers' },
  s: { it: 'dal primo segnale alla firma', en: 'from the first signal to the signature' },
};
