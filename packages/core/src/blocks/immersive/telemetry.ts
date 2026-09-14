/**
 * Telemetria dei deck — helper puri, senza DOM, testati con vitest.
 * Il blocco DeckTelemetry.astro li usa dal browser. Niente dati personali:
 * il session id è casuale per scheda e non identifica nessuno.
 */
export interface TelemetryEvent {
  project: string; route: string; slide_id: string; slide_index: number;
  cut: string; lang: string; session_id: string; dwell_ms: number;
}

const MAX_DWELL_MS = 3_600_000;

/** Il taglio del deck: gli id di `?s=` ordinati e deduplicati, oppure 'full'. */
export function cutFromSearch(search: string): string {
  const raw = new URLSearchParams(search).get('s');
  if (!raw) return 'full';
  const ids = [...new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))].sort();
  return ids.length ? ids.join(',') : 'full';
}

/** 'off' con ?telemetry=0 o localStorage edf:telemetry=off; 'mock' con ?telemetry=mock. */
export function trackingMode(search: string, stored: string | null): 'on' | 'off' | 'mock' {
  const q = new URLSearchParams(search).get('telemetry');
  if (q === '0' || q === 'off') return 'off';
  if (q === 'mock') return 'mock';
  if (stored === 'off') return 'off';
  return 'on';
}

/** 16 caratteri esadecimali, iniettabile per i test. */
export function makeSessionId(random: () => number = Math.random): string {
  let out = '';
  for (let i = 0; i < 16; i++) out += Math.floor(random() * 16).toString(16);
  return out;
}

/** L'ultimo segmento del path: 'atelier' sulla home dell'app, lo slug altrove. */
export function routeFromPath(pathname: string): string {
  const parts = pathname.replace(/\/+$/, '').split('/');
  return parts[parts.length - 1] || 'index';
}

export function buildEvent(p: {
  project: string; pathname: string; search: string; slideId: string; slideIndex: number;
  lang: string; sessionId: string; dwellMs: number;
}): TelemetryEvent {
  const dwell = Number.isFinite(p.dwellMs) ? Math.round(p.dwellMs) : 0;
  return {
    project: p.project,
    route: routeFromPath(p.pathname),
    slide_id: p.slideId,
    slide_index: p.slideIndex,
    cut: cutFromSearch(p.search),
    lang: p.lang,
    session_id: p.sessionId,
    dwell_ms: Math.max(0, Math.min(MAX_DWELL_MS, dwell)),
  };
}
