/**
 * deck-video.ts — UNICO punto di configurazione della consultazione del deck.
 *
 * La LP `/maxmara-adobe/` mostra la presentazione MaxMara_Adobe come player video
 * cinematografico on-brand (le animazioni del PPTX si preservano perché il sorgente
 * è un MP4 esportato da PowerPoint). Media pesanti ospitati su Supabase Storage
 * (bucket pubblico) — qui vanno gli URL pubblici.
 *
 * SEQUENCING: l'MP4 arriva dopo. Finché `src === null` la LP renderizza lo stato
 * "video in arrivo" (poster + download .pptx) e tutto buildà comunque. Quando il
 * video è pronto: 1) carica l'MP4 su Supabase, 2) incolla l'URL in `src`,
 * 3) riconcilia i `start` dei capitoli con i tempi reali del montaggio.
 */

export interface Chapter {
  /** id stabile, usato dal walkthrough per il deep-link (seekToChapter). */
  id: string;
  /** etichetta breve mostrata nella rail capitoli. */
  label: string;
  /** secondo d'inizio nel video. Placeholder finché l'MP4 non è montato. */
  start: number;
  /** slide del PPTX coperte (solo documentazione/orientamento). */
  slideRange?: string;
}

export interface DeckVideoConfig {
  /** URL pubblico dell'MP4 (Supabase). `null` → stato "video in arrivo". */
  src: string | null;
  /** Poster 16:9: URL esplicito; se vuoto la LP usa il fallback on-brand (slot `deck-poster`). */
  poster?: string | null;
  /** URL del file .vtt captions IT, oppure null. */
  captionsSrc?: string | null;
  /**
   * Link al deck originale da APRIRE in una nuova scheda (non un download):
   * visualizzatore Adobe Acrobat. Risolve il problema dei 122 MB — il file non
   * vive nel repo. (X-Frame-Options SAMEORIGIN → non incorporabile, solo link-out.)
   */
  deckUrl: string;
  /** Durata stimata in secondi: layout proporzionale della rail prima di `loadedmetadata`. */
  durationHint?: number;
  chapters: Chapter[];
}

/**
 * Gli 8 capitoli rispecchiano l'arco reale del deck (56 slide):
 * Content · Data · People, amplificati da Gen AI — narrati attraverso Chiara, 42, Milano.
 * I `start` sono placeholder proporzionati su `durationHint`; vanno corretti a MP4 pronto.
 */
export const deckVideo: DeckVideoConfig = {
  // ⤵︎ Incolla qui l'URL pubblico Supabase dell'MP4 quando è pronto.
  src: null,
  // ⤵︎ Poster Supabase opzionale; lasciando null si usa lo slot `deck-poster`.
  poster: null,
  captionsSrc: null,
  // Visualizzatore Adobe Acrobat del deck — si apre in una nuova scheda.
  deckUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:VA6C2:f8e7b07a-b243-4883-9c34-b1a4ffde6385',
  durationHint: 480, // ~8 min — stima, corregge da sé al loadedmetadata
  chapters: [
    { id: 'visione',    label: 'La visione 1-to-1',            start: 0,   slideRange: '1–3' },
    { id: 'pilastri',   label: 'Content · Data · People',      start: 40,  slideRange: '4–7' },
    { id: 'chiara',     label: 'Conosci Chiara',               start: 75,  slideRange: '8' },
    { id: 'content',    label: 'Content: on-brand a scala',    start: 105, slideRange: '9–27' },
    { id: 'data',       label: 'Data: un profilo, real-time',  start: 215, slideRange: '28–44' },
    { id: 'people',     label: 'People: il Journey di Chiara', start: 320, slideRange: '45–54' },
    { id: 'fisico',     label: 'Fisico + digitale',            start: 430, slideRange: '55' },
    { id: 'sintesi',    label: 'The bigger picture',           start: 460, slideRange: '56' },
  ],
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
