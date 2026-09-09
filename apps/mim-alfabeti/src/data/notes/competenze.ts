/** Presenter notes — /competenze («I processi»). Keyed by slide id. */
export default {
  'slide-builder': {
    it: 'Questa slide si tocca. Scegliete un processo con i chip o con i tasti 1–5 (Immissioni, Mobilità, Supplenze, GPS/GaE, Formazione): i quattro passi del journey e i tre KPI cambiano; i valori sono esempi, e la slide lo dice con la filigrana. Il cursore «Quota raggiunta» (↑/↓ da tastiera, o trascinandolo) muove le domande evitate al help-desk, con la formula scritta sotto il numero: base × quota × 0,35. Le frecce ← → cambiano comunque slide; il pubblico (Docenti, Dirigenti, ATA) cambia solo la base di partenza.',
    en: 'This slide is meant to be touched. Pick a process with the chips or keys 1–5 (Tenure, Mobility, Substitutes, GPS/GaE, Training): the four journey steps and the three KPIs change; the values are examples, and the watermark says so. The “Share reached” slider (↑/↓ on the keyboard, or drag it) moves the help-desk questions avoided, with the formula written under the number: baseline × share × 0.35. ← → still change slides; the audience (Teachers, Principals, ATA) only changes the baseline.',
  },
} satisfies Record<string, { it: string; en: string }>;
