/**
 * Presenter notes — «La rotta» (rotta.astro).
 * Keyed by slide id. Each note: what to say, when to press ↓ (sub-steps), the
 * transition to the next slide. IT default, EN for the bilingual run.
 */
export interface SlideNote {
  it: string;
  en: string;
}

const notes: Record<string, SlideNote> = {
  'slide-route': {
    it: 'I quattro passi compaiono da soli in sequenza, nessun ↓ da premere. Leggili in ordine e fermati sul quinto, il riquadro blu: è l’unica cosa che chiediamo oggi. Martedì, 90 minuti con DGSIS, due decisioni: il perimetro-dati e il journey pilota (immissioni in ruolo). Chiedi chi sarà al tavolo. Poi → per chiudere.',
    en: 'The four steps stagger in on their own, no ↓ needed. Read them in order and stop on the fifth, the blue box: it is the only ask of the day. Tuesday, 90 minutes with DGSIS, two decisions: the data perimeter and the pilot journey (tenure appointments). Ask who will be at the table. Then → to close.',
  },
  'slide-close': {
    it: 'Il video parte da solo e si ferma: non parlarci sopra. Leggi la frase una volta sola, poi le tre parole: orchestrare, misurare, governare. La riga tricolore è il congedo. Il deck torna alla copertina con →: lasciala aperta durante le domande.',
    en: 'The clip starts on its own and stops: do not talk over it. Read the sentence once, then the three words: orchestrate, measure, govern. The tricolour rule is the sign-off. → returns the deck to the cover: leave it open during the Q&A.',
  },
};

export default notes;
