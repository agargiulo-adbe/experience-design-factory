/**
 * L'AGENDA DELL'INCONTRO DEL 24 NOVEMBRE — fonte unica, letta dalla copertina.
 * Coincide con i capitoli: il documento contiene esattamente ciò di cui si
 * parla. `capitolo` è lo slug che la voce apre.
 */
export interface VoceAgenda {
  n: string;
  titolo: { it: string; en: string };
  capitolo: string | null;
  ancora?: string;
}

export const AGENDA: VoceAgenda[] = [
  { n: '01', capitolo: 'adobe', titolo: { it: 'Adobe, chi siamo', en: 'Adobe, who we are' } },
  { n: '02', capitolo: 'storie', titolo: { it: 'Chi l’ha già fatto', en: 'Who has done it' } },
  { n: '03', capitolo: 'idee', titolo: { it: 'Tre idee da discutere', en: 'Three ideas to discuss' } },
  { n: '04', capitolo: 'confronto', titolo: { it: 'Partiamo da voi', en: 'Starting from you' } },
];

/** Il titolo del documento, in due livelli. */
export const TITOLO_INCONTRO = {
  t: { it: 'Dalla parte dell’assicurato', en: 'On the policyholder’s side' },
  s: { it: 'un primo confronto, con tre idee sul tavolo', en: 'a first conversation, with three ideas on the table' },
};
