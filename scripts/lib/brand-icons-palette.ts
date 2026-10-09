/**
 * La palette dell'anteprima di un link, letta dal marchio e **misurata**.
 *
 * Sta qui, e non dentro `brand-icons.ts`, perché una scelta di contrasto è un
 * numero: va provata senza avviare un browser. Il motivo per cui esiste è un
 * errore vero — la prima versione prendeva il fondo dal primo `fill` e
 * l'accento dall'ultimo, con il titolo bianco per contratto, e sul marchio
 * della vetrina (gradiente più `fill="#fff"` di dettaglio) usciva
 * un'anteprima bianca su bianco. Invisibile, e nessuno se ne accorge finché
 * non incolla il link in chat.
 */

export function hex2rgb(hex: string): [number, number, number] {
  let s = hex.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

/** Luminanza relativa WCAG. */
export function luminance(hex: string): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = hex2rgb(hex).map(f);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Rapporto di contrasto WCAG, da 1 (uguali) a 21 (nero su bianco). */
export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Un passo verso `to`: serve a schiarire o scurire un colore che non stacca. */
export function mix(from: string, to: string, t: number): string {
  const [a, b] = [hex2rgb(from), hex2rgb(to)];
  return '#' + a.map((c, i) => Math.round(c + (b[i] - c) * t).toString(16).padStart(2, '0')).join('');
}

export interface IconPalette {
  /** Il fondo dell'anteprima: il colore da cui parte il marchio. */
  bg: string;
  /** Il titolo: bianco o quasi-nero, quello dei due che stacca di più. */
  ink: string;
  /** La riga sotto il titolo: un colore del marchio, ma solo se si legge. */
  accent: string;
}

const NEAR_BLACK = '#101114';
const WHITE = '#ffffff';
/** Soglia WCAG AA per il testo normale. La riga sotto il titolo è piccola. */
const AA = 4.5;

export function paletteFromSvg(svg: string): IconPalette {
  const fills = [...svg.matchAll(/fill="(#[0-9a-fA-F]{3,8})"/g)].map((m) => m[1]);
  const strokes = [...svg.matchAll(/stroke="(#[0-9a-fA-F]{3,8})"/g)].map((m) => m[1]);
  const stops = [...svg.matchAll(/stop-color="(#[0-9a-fA-F]{3,8})"/g)].map((m) => m[1]);

  // Il fondo è il fill della PRIMA forma dichiarata: in ogni marchio di casa è
  // la tessera che sta sotto a tutto. Se quella tessera è dipinta con un
  // gradiente, vale la sua prima fermata — il colore da cui il marchio parte.
  // ⚠️ Non si sceglie per contrasto («salta i bianchi»): su un marchio a
  // dominante chiara quel criterio scarta proprio il fondo giusto.
  const firstFill = svg.match(/fill="(url\(#[^)]+\)|#[0-9a-fA-F]{3,8})"/)?.[1];
  const bg = (firstFill?.startsWith('url(') ? stops[0] : firstFill) ?? stops[0] ?? '#111111';

  const ink = contrast(WHITE, bg) >= contrast(NEAR_BLACK, bg) ? WHITE : NEAR_BLACK;

  // L'accento è un colore del marchio, ma solo se misura. Se nessuno ci arriva
  // si parte dall'inchiostro e lo si avvicina al fondo quanto basta: una riga
  // più quieta del titolo, mai una riga invisibile.
  const accent =
    [...strokes, ...fills, ...stops].filter((c) => c !== bg).find((c) => contrast(c, bg) >= AA)
    ?? [0.3, 0.25, 0.2, 0.15, 0].map((t) => mix(ink, bg, t)).find((c) => contrast(c, bg) >= AA)
    ?? ink;

  return { bg, ink, accent };
}
