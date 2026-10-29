import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Gli asset della Storia — ritratto e scene.
 *
 * Perché stock licenziato e non generato: è la strada già sancita su
 * UniCredit (persona-marco → Pexels, poi scontorno via API Photoshop). Una
 * foto licenziata porta autore, licenza e URL in provenance.json, e la si
 * può mostrare a un cliente senza doverlo spiegare.
 *
 * Le scene NON sono decorazione: ognuna dice che cosa sta facendo la
 * persona in quel momento, e sta nello SFONDO della slide — così la pagina
 * si riempie e il momento si capisce prima di leggere.
 *
 * Due famiglie, perché i due lati devono distinguersi a colpo d'occhio:
 *   `scena-*`  la vita di Giulia — divano, bar, cucina, filiale
 *   `lavoro-*` la stanza di chi prepara — schermi, riunioni, scrivanie
 *
 * `alt=''` perché sono sfondi: il contenuto è nel testo della slide, e un
 * alt qui lo farebbe leggere due volte a un lettore di schermo.
 */
export const assets: AssetSlot[] = [
  // ── La protagonista ───────────────────────────────────────────────
  {
    id: 'persona-giulia',
    type: 'stock',
    query: 'young italian woman portrait 34 years natural light casual confident indoor',
    aspect: '4:5',
    width: 1400,
    grade: 'editorial',
    alt: 'Giulia Marchetti, 34 anni, cliente Intesa Sanpaolo da sei anni',
  },

  // ── Le scene di Giulia ────────────────────────────────────────────
  {
    id: 'scena-01-divano',
    type: 'stock',
    query: 'woman relaxing on sofa at night using smartphone warm lamp light living room',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-02-bar',
    type: 'stock',
    query: 'woman standing at cafe counter looking at phone morning coffee city',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-03-tavolo',
    type: 'stock',
    query: 'woman at kitchen table with laptop and phone calculating home budget evening',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-04-documenti',
    type: 'stock',
    query: 'woman looking at paperwork documents at home desk tired evening lamp',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-05-colazione',
    type: 'stock',
    query: 'woman having breakfast at home checking phone bright morning light kitchen',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-06-filiale',
    type: 'stock',
    query: 'bank advisor and client talking at desk modern branch office meeting',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-07-casa',
    type: 'stock',
    query: 'woman holding keys in front of new apartment door happy moving day',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },

  // ── Le scene di chi prepara ───────────────────────────────────────
  {
    id: 'lavoro-01-ricerca',
    type: 'stock',
    query: 'marketing analyst reviewing website search analytics on large monitor office',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-02-contenuti',
    type: 'stock',
    query: 'creative team reviewing digital content layouts on screens studio workspace',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-03-dati',
    type: 'stock',
    query: 'data analyst looking at customer data dashboard dual monitors dark office',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-04-decisione',
    type: 'stock',
    query: 'two colleagues discussing in front of screen making decision modern office',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-05-orchestrazione',
    type: 'stock',
    query: 'marketing operations team planning customer journey on whiteboard screens',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-06-filiale-back',
    type: 'stock',
    query: 'bank employee at desk using computer terminal office back office',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-07-misura',
    type: 'stock',
    query: 'business team reviewing performance results charts meeting room screen',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
];
