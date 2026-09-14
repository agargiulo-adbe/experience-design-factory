/**
 * Lettura del design system PUBBLICO di un sito dal suo CSS di produzione.
 * Funzioni pure (analyzeCss) + una lettura via fetch (readBrandTokens), usate dal
 * CLI `pnpm brand:tokens` e dal tool MCP `brand_tokens`. Evidenza, non decisioni.
 */
export interface Hit { value: string; count: number }
export interface BrandTokens {
  hostname: string; sheets: number; cssKb: number;
  brand: Hit[]; framework: Hit[]; neutrals: Hit[]; customProperties: string[]; fonts: Hit[];
}

const FRAMEWORK_DEFAULTS = new Set([
  '#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107',
  '#198754', '#20c997', '#0dcaf0', '#6c757d', '#212529', '#0a58ca', '#157347',
  '#3b71ca', '#14a44d', '#dc4c64', '#e4a11b', '#54b4d3',
]);
const FRAMEWORK_VAR_PREFIXES = ['--bs-', '--tw-', '--mdc-', '--mat-', '--ion-', '--wp-', '--chakra-'];
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' } });
  if (!res.ok) throw new Error(`${res.status} su ${url}`);
  return res.text();
}

export function stylesheetUrls(html: string, base: string): string[] {
  const out = new Set<string>();
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/stylesheet/i.test(tag)) continue;
    const href = /href\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
    if (href) { try { out.add(new URL(href, base).href); } catch { /* href malformato */ } }
  }
  return [...out];
}

export function normalizeHex(h: string): string {
  let v = h.replace('#', '').toLowerCase();
  if (v.length === 3) v = v.split('').map((c) => c + c).join('');
  return `#${v}`;
}

export function isNeutral(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return Math.max(r, g, b) - Math.min(r, g, b) < 12;
}

function tally(re: RegExp, css: string, map: (m: RegExpExecArray) => string | null): Hit[] {
  const counts = new Map<string, number>();
  const rx = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  let m: RegExpExecArray | null;
  while ((m = rx.exec(css))) { const v = map(m); if (v) counts.set(v, (counts.get(v) ?? 0) + 1); }
  return [...counts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
}

export function analyzeCss(css: string, top = 12): Omit<BrandTokens, 'hostname' | 'sheets' | 'cssKb'> {
  const hexes = tally(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/, css, (m) => normalizeHex(m[0]));
  const chromatic = hexes.filter((h) => !isNeutral(h.value));
  const vars = tally(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,6})/i, css, (m) => `--${m[1]}: ${normalizeHex(m[2])}`);
  const fonts = tally(/font-family\s*:\s*([^;}]+)/i, css, (m) => {
    const first = m[1].split(',')[0].replace(/["']/g, '').trim();
    return /^(inherit|initial|unset|var\()/i.test(first) || !first ? null : first;
  });
  return {
    brand: chromatic.filter((h) => !FRAMEWORK_DEFAULTS.has(h.value)).slice(0, top),
    framework: chromatic.filter((h) => FRAMEWORK_DEFAULTS.has(h.value)).slice(0, 6),
    neutrals: hexes.filter((h) => isNeutral(h.value)).slice(0, 6),
    customProperties: vars.filter((v) => !FRAMEWORK_VAR_PREFIXES.some((p) => v.value.startsWith(p))).slice(0, 18).map((v) => v.value),
    fonts: fonts.slice(0, 10),
  };
}

export async function readBrandTokens(url: string, opts: { top?: number; fetchText?: (u: string) => Promise<string> } = {}): Promise<BrandTokens> {
  const get = opts.fetchText ?? fetchText;
  const html = await get(url);
  const sheets = stylesheetUrls(html, url);
  let css = (html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) ?? []).join('\n');
  let fetched = 0;
  for (const s of sheets.slice(0, 12)) { try { css += '\n' + (await get(s)); fetched++; } catch { /* un foglio in meno */ } }
  return { hostname: new URL(url).hostname, sheets: fetched, cssKb: Math.round(css.length / 1024), ...analyzeCss(css, opts.top) };
}
