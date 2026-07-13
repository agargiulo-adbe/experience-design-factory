/**
 * deck-video.ts — UNICA configurazione della consultazione del deck nella LP
 * `/maxmara-adobe/`.
 *
 * Il deck è consultato come player video cinematografico on-brand: le animazioni
 * del PPTX si preservano perché il sorgente è un MP4 esportato da PowerPoint.
 * L'MP4 (64 MB) è ospitato come asset di GitHub Release del repo (gratis, fino a
 * 2 GB/file, URL diretto con range-requests → streaming e seeking) per non gonfiare
 * il repo. Il poster è il frame di copertina estratto dal video (public/deck-poster.jpg).
 */

export interface Chapter {
  /** id stabile, usato dal walkthrough per il deep-link (seekToChapter). */
  id: string;
  /** etichetta breve mostrata nella rail capitoli. */
  label: string;
  /** secondo d'inizio nel video (calibrato sulla struttura reale del montaggio). */
  start: number;
  /** slide del PPTX coperte (solo documentazione/orientamento). */
  slideRange?: string;
}

export interface DeckVideoConfig {
  /** URL diretto dell'MP4 (GitHub Release). `null` → stato "in arrivo". */
  src: string | null;
  /** Poster 16:9 del player (frame di copertina). Se null, fallback dalla pagina. */
  poster?: string | null;
  /**
   * Presentazione HTML5 self-hosted con animazioni (entry index.html in public/deck/),
   * iframe SAME-ORIGIN. Ha precedenza su `src`. Non in uso (si usa l'MP4).
   */
  embedUrl?: string | null;
  /** URL del file .vtt captions IT, oppure null. */
  captionsSrc?: string | null;
  /** Durata in secondi: layout proporzionale della rail prima di `loadedmetadata`. */
  durationHint?: number;
  chapters: Chapter[];
}

/**
 * Capitoli mappati sull'arco del deck (Content · Data · People + Gen AI, narrato
 * attraverso Chiara, 42, Milano). I `start` sono calibrati sulla struttura reale
 * del video (durata 3:10): intro 0–38s · Content ~38–105s · Data ~105–167s ·
 * People/Journey ~167s+ · chiusura ~182s. Ritoccabili qui se serve precisione al secondo.
 */
export const deckVideo: DeckVideoConfig = {
  src: 'https://github.com/agargiulo-adbe/experience-design-factory/releases/download/media/Adobe_x_Max_Mara.mp4',
  // Served from public/ under the app base — kept base-relative so the deck
  // survives a base change (e.g. root → /generazioni-maxmara/).
  poster: `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}deck-poster.jpg`,
  embedUrl: null,
  captionsSrc: null,
  durationHint: 190,
  chapters: [
    { id: 'visione',  label: 'La visione 1-to-1',            start: 0,   slideRange: '1–3' },
    { id: 'pilastri', label: 'Content · Data · People',      start: 10,  slideRange: '4–7' },
    { id: 'chiara',   label: 'Conosci Chiara',               start: 30,  slideRange: '8' },
    { id: 'content',  label: 'Content: on-brand a scala',    start: 38,  slideRange: '9–27' },
    { id: 'data',     label: 'Data: un profilo, real-time',  start: 105, slideRange: '28–44' },
    { id: 'people',   label: 'People: il Journey di Chiara', start: 167, slideRange: '45–54' },
    { id: 'fisico',   label: 'Fisico + digitale',            start: 182, slideRange: '55' },
    { id: 'sintesi',  label: 'The bigger picture',           start: 186, slideRange: '56' },
  ],
};

/**
 * Versione PDF del deck — stessa presentazione, formato leggibile / stampabile /
 * condivisibile. Ospitata come asset della stessa GitHub Release `media` (come l'MP4),
 * per non gonfiare il repo. `url: null` → la CTA di download non viene renderizzata.
 */
export const deckPdf: { url: string | null; pages: number; sizeLabel: string; fileName: string } = {
  url: 'https://github.com/agargiulo-adbe/experience-design-factory/releases/download/media/Adobe_x_Max_Mara.pdf',
  pages: 54,
  sizeLabel: '6,9 MB',
  fileName: 'Adobe_x_Max_Mara.pdf',
};

/** Trova l'id del capitolo attivo per un dato istante (l'ultimo con start ≤ t). */
export function activeChapterId(t: number, chapters: Chapter[] = deckVideo.chapters): string | null {
  let active: string | null = chapters.length ? chapters[0].id : null;
  for (const c of chapters) {
    if (t + 0.001 >= c.start) active = c.id;
    else break;
  }
  return active;
}

/** Formatta i secondi come m:ss (o h:mm:ss). */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const ss = String(s).padStart(2, '0');
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${ss}`;
  return `${m}:${ss}`;
}
