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
 * ⚠️ 11 NOV 2026 — LE SCENE DI GIULIA PASSANO A FIREFLY, e il perché.
 * Le otto foto stock erano otto mondi: un divano fotografato col
 * telefono e vignettato, uno studio grigio da catalogo, un flatlay
 * bianco, una tazza rossa satura, un ufficio di coworking col NOME di
 * uno studio sul muro (wrong-brand, nascosto con uno zoom al 180%), le
 * chiavi col portachiavi a casetta. Cinque temperature di luce, nessun
 * filo. Lo stock non sa dare UNA casa e UNA mano in otto scene; un
 * generatore sì, se il prompt fissa il mondo:
 *   · la casa di Giulia a Torino (velluto verde smeraldo, rovere, pothos,
 *     finestre alte, portici e tram fuori);
 *   · la stessa mano — giovane, sottile, anello d'oro sottile — nella
 *     stessa manica di maglia grigia del ritratto;
 *   · il telefono con la cover verde salvia, la tazza in terracotta;
 *   · la luce che segue il racconto: sera, mattino, sera, sera, mattino,
 *     il mercoledì in filiale, tre settimane dopo la firma.
 * La regola dell'unico volto resta: nessuna faccia nelle scene.
 * Guardate tutte a dimensione intera prima di posarle; scartate e
 * rigenerate quattro al primo giro (una mano maschile anziana, una
 * penna rotta con un'intestazione di lettere inventate, una torre al
 * neon che a Torino non c'è, una filiale spoglia). Sulla 07 due righe di
 * lettere generate sono coperte col colore della carta (provenance).
 * ⚠️ Lo script riscrive provenance.json INTERO: si genera in una
 * cartella a parte e si unisce, se no si perde la provenienza del resto.
 *
 * Perché il resto (ritratto, `lavoro-*`) resta stock licenziato: è la strada già sancita su
 * UniCredit (persona-marco → Pexels, poi scontorno via API Photoshop). Una
 * foto licenziata porta autore, licenza e URL in provenance.json, e la si
 * può mostrare a un cliente senza doverlo spiegare.
 *
 * `alt=''` sulle scene perché sono sfondi: il contenuto è nel testo della
 * slide, e un alt qui lo farebbe leggere due volte a un lettore di schermo.
 */
/* Le scene di Giulia — un mondo, una mano, una luce che segue il racconto. */
const STILE = ', candid 35mm film photograph, natural light, soft fine grain, shallow depth of field, muted warm palette of oak, linen and warm grey with deep emerald green accents, quiet and intimate, realistic, editorial lifestyle, the main subject in the centre of the frame';
const NO_1 = 'faces, face, head, portrait, eyes, people in background, text, letters, words, numbers on screen, readable screen, logos, brand names, signage, watermark, neon, oversaturated, harsh flash, cartoon, illustration, cgi, deformed hands, extra fingers';
/* Secondo giro: la mano esplicitata, e via torri, neon e intestazioni. */
const NO_2 = 'man, male hand, old hand, wrinkled hand, faces, face, head, portrait, eyes, people in background, text, letters, words, headline, title, numbers, readable screen, logos, brand names, signage, watermark, tower, neon, purple light, oversaturated, harsh flash, cartoon, illustration, cgi, deformed hands, extra fingers, broken pen';
const MANO = 'the slender hand of a young woman in her thirties with a thin gold ring, in a soft grey knit sweater sleeve';
const scena = (id: string, prompt: string, seed: number, negativePrompt: string): AssetSlot => ({
  id, type: 'firefly', contentClass: 'photo', prompt: prompt + STILE, negativePrompt,
  aspect: '16:9', width: 2400, grade: 'none', seed, alt: '',
});
const SCENE_GIULIA: AssetSlot[] = [
  scena('scena-01-divano', 'Evening in a young woman’s flat in Turin, close view of her hand in a soft grey knit sweater sleeve holding a smartphone with a sage green case, the screen glowing softly and turned away, resting on the arm of a deep emerald green velvet sofa, warm amber light from a brass floor lamp, a trailing pothos plant on a side table, tall old window with blue dusk behind, herringbone oak floor', 7417, NO_1),
  scena('scena-02-bar', `Morning at a traditional Turin café counter of white marble and walnut, a small green ceramic espresso cup on its saucer, ${MANO} holding a smartphone with a sage green case, an orange city tram passing softly blurred beyond the large window, porticoes of an old arcade, soft low morning sun`, 2611, NO_2),
  scena('scena-03-tavolo', 'Evening at a small oak kitchen table in a Turin flat, an open laptop seen from the side with a softly glowing screen turned away, a calculator, a pencil and a sheet of plain paper with handwritten pencil marks, a smartphone with a sage green case, a terracotta mug of tea, warm pendant lamp light, a pothos plant, blue dusk in the tall window', 7417, NO_1),
  scena('scena-04-documenti', 'Night at a writing desk in a Turin flat, a neat stack of plain paper folders and documents seen from above at an angle, a brass desk lamp casting a warm pool of light, a pen, a smartphone with a sage green case, a hand in a soft grey knit sweater sleeve placing a sheet on the pile, dark emerald green wall behind', 7417, NO_1),
  scena('scena-05-colazione', 'Bright morning breakfast by the tall window of a Turin flat, a terracotta mug of coffee, a plate with a croissant, a smartphone with a sage green case lying on the oak table, a hand in a soft grey knit sweater sleeve reaching for the mug, soft golden sunlight and long shadows, a pothos plant on the windowsill, Turin rooftops softly out of focus', 7417, NO_1),
  scena('scena-06-filiale', 'Daytime inside a calm, elegant contemporary Italian bank branch: a welcoming private meeting corner with a light oak round table and two upholstered armchairs in deep emerald green, a slim glass partition with soft frosting, a closed tablet and a plain closed folder on the table, a tall green plant, warm stone floor, large window with soft diffuse daylight and an old Turin arcade outside, warm and reassuring, empty room', 2611, NO_2),
  scena('scena-07-casa', `Late afternoon in a bank branch meeting room, close view of ${MANO} signing at the bottom of a plain white sheet of paper covered only by faint grey blurred lines, with an elegant intact dark fountain pen, a set of two brass house keys on a plain ring resting beside the papers on a light oak table, warm golden sunlight across the table, a deep emerald green armchair softly out of focus`, 2611, NO_2),
  scena('scena-08-tracce', 'Night, raindrops on the tall old window of a flat in Turin, warm amber street lamps and the lit arcades of an old Italian street blurred beyond the glass, low historic rooftops, a smartphone with a sage green case lying on the wooden windowsill with its screen glowing faintly, a pothos leaf in the corner, deep dark emerald tones, moody and calm', 2611, NO_2),
];

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

  // ── I luoghi di Giulia — senza volti, un mondo solo (11 nov 2026) ──
  // Generati con Firefly: vedi SCENE_GIULIA in fondo al file.
  ...SCENE_GIULIA,


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

