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
  /** Lo slug del capitolo, quando esiste. `null` = ancora da innestare. */
  capitolo: string | null;
  /** La slide di arrivo, quando la voce non comincia dalla prima del capitolo. */
  ancora?: string;
  /** Una seconda riga, più piccola: un tema che la voce deve nominare. */
  sotto?: { it: string; en: string };
}

export const AGENDA: VoceAgenda[] = [
  /* ⚠️ L'AGENDA CONCORDATA DAL TEAM (9 nov 2026), parole sue, ed è più corta
     della barra dei capitoli: sette voci contro nove capitoli. «Dove ci
     innestiamo» copre i capitoli 04 e 05. Il pannello del 30 ott aveva
     chiesto un indice solo: qui la differenza è voluta, e la decisione è di
     chi presenta. */
  {
    n: '01', capitolo: 'adobe',
    titolo: { it: 'Adobe, chi siamo', en: 'Adobe, who we are' },
  },
  {
    n: '02', capitolo: 'adobe', ancora: 'slide-cx',
    titolo: { it: 'L’offerta Adobe', en: 'The Adobe offering' },
  },
  {
    n: '03', capitolo: 'scenario',
    titolo: { it: 'Dal dato alla decisione', en: 'From data to decision' },
  },
  {
    n: '04', capitolo: 'messa-a-terra',
    titolo: { it: 'Dove ci innestiamo', en: 'Where we plug in' },
    /* L'invito chiedeva «particolare attenzione alla Web Analytics»: la voce
       la nomina, e il passaggio è nel capitolo (panel dell'11 nov 2026). */
    sotto: { it: 'Web Analytics: da Analytics a Customer Journey Analytics', en: 'Web analytics: from Analytics to Customer Journey Analytics' },
  },
  {
    /* Il titolo della copertina del capitolo. Prima diceva «motore di lavoro»,
       e in sala «motore» è il motore di targeting della banca. */
    n: '05', capitolo: 'coworker',
    titolo: { it: 'Coworker prepara il lavoro che gli si chiede', en: 'Coworker prepares the work it is asked for' },
  },
  {
    n: '06', capitolo: 'risultati',
    titolo: { it: 'Banche che lo fanno già', en: 'Banks already doing it' },
  },
  {
    n: '07', capitolo: 'prossimi-passi',
    titolo: { it: 'Prossimi passi', en: 'Next steps' },
  },
];
