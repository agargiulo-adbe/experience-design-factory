/**
 * Il registro della SINTESI: quali experience hanno già «Il punto» in fondo a
 * ogni capitolo, e con che budget di lettura.
 *
 * PERCHÉ UN REGISTRO E NON «TUTTE»
 * Perché il 14 ott 2026, quando la regola è nata, nessun deck la rispettava: 27
 * capitoli su 114 portavano una sintesi esplicita. Un gate che il giorno uno
 * fallisce su quattordici app viene spento il giorno due — e un gate spento è
 * peggio di nessun gate (è la stessa ragione per cui `audit:fonti` mette i 403
 * in una lista a parte invece di chiamarli errori). Quindi: un'app entra qui
 * quando è stata migrata, e dal momento in cui entra non può più uscire.
 *
 * L'elenco delle app ANCORA DA MIGRARE non sta scritto a mano da nessuna parte:
 * lo stampa il gate confrontando questo registro con `ROUTE_SETS`. Così la lista
 * non può invecchiare.
 *
 * - `escluse`   — le rotte che NON sono capitoli, e che quindi non devono
 *                 chiudersi su un punto: la home (è una copertina più l'indice)
 *                 e il taglio «In dieci minuti» (è già tutto sintesi, e sette
 *                 punti in sette slide lo raddoppierebbero).
 * - `fonti`     — i file della FONTE UNICA dove vivono i messaggi. Il gate
 *                 verifica che la frase resa venga da lì e non dal markup.
 * - `paroleMax` — quante parole può avere un punto. Una frase, non un paragrafo:
 *                 25 è il tetto, non l'obiettivo.
 * - `budget`    — il carico di lettura per slide, misurato sul DOM reso: mediana
 *                 e novantesimo percentile. Sono SOFT: servono a vedere la coda
 *                 densa, non a tagliare copy a peso. La mediana dei quattordici
 *                 deck al 14 ott 2026 era 96 parole per slide.
 */
export interface SintesiSpec {
  escluse: string[];
  fonti: string[];
  paroleMax?: number;
  budget?: { mediana: number; p90: number };
}

export const PAROLE_MAX_DEFAULT = 25;
export const BUDGET_DEFAULT = { mediana: 70, p90: 120 };

export const SINTESI_SETS: Record<string, SintesiSpec> = {
  'trenitalia-prospettiva-sales': {
    escluse: ['home', 'dieci-minuti'],
    fonti: ['src/data/chapters.ts', 'src/data/contenuti.ts'],
    paroleMax: 25,
    // Budget di default (70/150 non è un numero rotondo scelto per passare: il
    // deck sta a 97 di mediana e 204 al novantesimo). Resta quello aspirazionale
    // apposta: la lista che il gate stampa È la lista delle slide da alleggerire.
  },
};
