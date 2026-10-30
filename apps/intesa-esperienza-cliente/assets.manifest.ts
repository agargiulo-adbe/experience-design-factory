import type { AssetSlot } from '@edf/core/assets/types';

/**
 * Gli asset della Storia — un volto solo, e scene senza volti.
 *
 * ⚠️ LA REGOLA CHE GOVERNA QUESTO FILE (memoria `giulia-single-journey-portrait-reuse`,
 * nata su Max Mara e riconfermata qui il 29 ott 2026).
 *
 * Lo stock licenziato non sa darti la stessa persona in sette scene: ogni
 * foto è una donna diversa, e il racconto si rompe proprio dove deve
 * reggere — «questa è Giulia» detto sopra sette facce diverse diventa
 * «questa è una qualunque». La soluzione non è cercare meglio: è
 * **togliere i volti dalle scene**.
 *
 *   `persona-giulia`  UN ritratto, scontornato, riusato dove lei è nominata.
 *                     È l'unico volto della Storia, quindi è coerente per
 *                     costruzione.
 *   `scena-*`         i LUOGHI dei suoi momenti — divano, bancone, tavolo,
 *                     filiale, porta di casa. Nessuna faccia riconoscibile:
 *                     mani, oggetti, luce, spazio. Una scena senza volto non
 *                     contraddice mai il ritratto.
 *   `lavoro-*`        la stanza di chi prepara: schermi, scrivanie, sale.
 *                     Anche qui niente primi piani: il marketer non è un
 *                     personaggio, è un mestiere.
 *
 * Perché stock licenziato e non generato: è la strada già sancita su
 * UniCredit (persona-marco → Pexels, poi scontorno via API Photoshop). Una
 * foto licenziata porta autore, licenza e URL in provenance.json, e la si
 * può mostrare a un cliente senza doverlo spiegare.
 *
 * `alt=''` sulle scene perché sono sfondi: il contenuto è nel testo della
 * slide, e un alt qui lo farebbe leggere due volte a un lettore di schermo.
 */
export const assets: AssetSlot[] = [
  // ── L'unico volto della Storia ────────────────────────────────────
  {
    id: 'persona-giulia',
    type: 'stock',
    query: 'young italian woman portrait 34 years natural light casual confident indoor',
    aspect: '4:5',
    width: 1400,
    grade: 'editorial',
    alt: 'Giulia Marchetti, 34 anni, non ancora cliente di Intesa Sanpaolo',
  },

  // ── I luoghi di Giulia — senza volti ──────────────────────────────
  {
    id: 'scena-01-divano',
    type: 'stock',
    query: 'empty living room sofa at night warm lamp light cosy interior no people',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-02-bar',
    type: 'stock',
    query: 'cafe counter morning coffee cup close up hands only city light no faces',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-03-tavolo',
    type: 'stock',
    query: 'kitchen table with open laptop and notebook evening light empty no people',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-04-documenti',
    type: 'stock',
    query: 'desk with paperwork documents and desk lamp at night overhead no people',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-05-colazione',
    type: 'stock',
    query: 'breakfast table morning light coffee and phone on table overhead no people',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-06-filiale',
    type: 'stock',
    query: 'modern bank branch interior empty meeting desk glass office daylight',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-07-casa',
    type: 'stock',
    query: 'house keys in hand close up new apartment door blurred background',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },

  // ── Le scene di chi prepara — schermi e spazi, non facce ──────────
  {
    id: 'lavoro-01-ricerca',
    type: 'stock',
    query: 'search analytics dashboard on large monitor office desk close up screen',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-02-contenuti',
    type: 'stock',
    query: 'creative studio desk with design layouts on screen and printed proofs',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-03-dati',
    type: 'stock',
    query: 'data dashboard charts on dual monitors dark office desk no people',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-04-decisione',
    type: 'stock',
    query: 'meeting room table with laptops and notes decision workspace empty',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-05-orchestrazione',
    type: 'stock',
    query: 'whiteboard with flow diagram sticky notes planning wall office',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-06-filiale-back',
    type: 'stock',
    query: 'office desk computer terminal keyboard back office workplace no people',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'lavoro-07-misura',
    type: 'stock',
    query: 'meeting room screen showing performance charts empty conference table',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },

  // ── Gli sfondi dei capitoli ───────────────────────────────────────
  // Senza questi, cinque slide restano testo su fondo pieno: misurato
  // guardando le pagine, non dedotto.
  {
    id: 'fondo-apertura',
    type: 'stock',
    query: 'Turin city skyline at dusk italian architecture warm light aerial',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'fondo-scenario',
    type: 'stock',
    query: 'abstract dark data network light lines technology minimal depth',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-08-tracce',
    type: 'stock',
    query: 'scattered city lights at night bokeh dark abstract separated points',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'scena-09-lista',
    type: 'stock',
    query: 'long printed spreadsheet list on desk paperwork overhead no people',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
  {
    id: 'fondo-risultati',
    type: 'stock',
    query: 'modern bank branch glass architecture facade bright daylight exterior',
    aspect: '16:9', width: 2400, grade: 'editorial', alt: '',
  },
];
