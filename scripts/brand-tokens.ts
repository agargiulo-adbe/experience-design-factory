/**
 * brand-tokens — estrae il design system PUBBLICO di un cliente dal suo sito.
 *
 * Una experience design è una skin sopra il motore: se la skin non è quella vera
 * del cliente, tutto il resto non conta. E il modo sbagliato di ricavarla è
 * andare a memoria — «UniCredit è rossa», «Agos è blu» — perché a memoria si
 * sbaglia: la palette vera di UniCredit ha il **petrolio** come colore di sistema
 * e il rosso solo come marchio, e Agos non è blu e rosso ma petrolio e acqua.
 * Le due volte che è successo, la correzione è arrivata leggendo il CSS di
 * produzione. Questo script fa quella lettura, in modo ripetibile.
 *
 *   pnpm brand:tokens https://www.unicredit.it
 *   pnpm brand:tokens https://www.agos.it --top 14
 *
 * Cosa fa: scarica la pagina, segue i CSS che include, e conta. I colori che
 * ricorrono di più nel CSS di produzione SONO il design system, qualunque cosa
 * dica un brand book. Riporta anche le famiglie di carattere dichiarate e le
 * custom property `--*` che il sito espone (molti design system moderni le
 * pubblicano: quando ci sono, sono la risposta diretta).
 *
 * Cosa NON fa: non decide al posto tuo. Stampa l'evidenza; la mappatura sui token
 * semantici dell'experience (`--surface-*`, `--ink-*`, `--accent-*`) resta una
 * scelta di design, e va fatta guardando dove ogni colore è usato sul sito.
 *
 * Nota: alcuni siti bancari bloccano gli headless browser ma servono il CSS a una
 * GET semplice. Per questo si usa fetch, non un browser.
 */

interface Hit { value: string; count: number }

/**
 * Palette di default dei framework CSS diffusi (Bootstrap 5, Tailwind). Compaiono
 * in quasi ogni sito e non dicono NIENTE del brand: vanno mostrate a parte, non
 * nascoste — se un cliente usa davvero il blu di Bootstrap è bene vederlo.
 */
const FRAMEWORK_DEFAULTS = new Set([
  '#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107',
  '#198754', '#20c997', '#0dcaf0', '#6c757d', '#212529', '#0a58ca', '#157347',
  '#3b71ca', '#14a44d', '#dc4c64', '#e4a11b', '#54b4d3',
]);
const FRAMEWORK_VAR_PREFIXES = ['--bs-', '--tw-', '--mdc-', '--mat-', '--ion-', '--wp-', '--chakra-'];

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function get(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' } });
  if (!res.ok) throw new Error(`${res.status} su ${url}`);
  return res.text();
}

/** I <link rel=stylesheet> della pagina, risolti in URL assoluti. */
function stylesheetUrls(html: string, base: string): string[] {
  const out = new Set<string>();
  const linkRe = /<link\b[^>]*>/gi;
  for (const tag of html.match(linkRe) ?? []) {
    if (!/stylesheet/i.test(tag)) continue;
    const href = /href\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
    if (href) {
      try { out.add(new URL(href, base).href); } catch { /* href malformato */ }
    }
  }
  return [...out];
}

/** Colori normalizzati a #rrggbb minuscolo, così #FFF e #ffffff contano insieme. */
function normalizeHex(h: string): string {
  let v = h.replace('#', '').toLowerCase();
  if (v.length === 3) v = v.split('').map((c) => c + c).join('');
  return `#${v}`;
}

/** Il bianco, il nero e i grigi puri non dicono niente di un brand. */
function isNeutral(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return max - min < 12; // scarto di canale trascurabile = grigio
}

function tally(re: RegExp, css: string, map: (m: RegExpExecArray) => string | null): Hit[] {
  const counts = new Map<string, number>();
  let m: RegExpExecArray | null;
  const rx = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  while ((m = rx.exec(css))) {
    const v = map(m);
    if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return [...counts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
}

/** Quadratino di colore nel terminale — vedere il colore vale più che leggerlo. */
function swatch(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `\x1b[48;2;${r};${g};${b}m   \x1b[0m`;
}

async function main() {
  const argv = process.argv.slice(2);
  const site = argv.find((a) => !a.startsWith('-'));
  const topIdx = argv.indexOf('--top');
  const TOP = topIdx !== -1 && argv[topIdx + 1] ? parseInt(argv[topIdx + 1], 10) : 12;
  if (!site) {
    console.error('uso: pnpm brand:tokens <https://sito-del-cliente> [--top 12]');
    process.exit(2);
  }
  const url = /^https?:\/\//.test(site) ? site : `https://${site}`;

  console.log(`\nLeggo il design system pubblico di ${new URL(url).hostname}\n`);
  const html = await get(url);
  const sheets = stylesheetUrls(html, url);
  console.log(`  ${sheets.length} fogli di stile collegati`);

  let css = '';
  const inline = html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) ?? [];
  css += inline.join('\n');
  let fetched = 0;
  for (const s of sheets.slice(0, 12)) {
    try { css += '\n' + (await get(s)); fetched++; } catch { /* un foglio in meno, non è un errore */ }
  }
  console.log(`  ${fetched} scaricati · ${(css.length / 1024).toFixed(0)} KB di CSS analizzati\n`);
  if (css.length < 2000) {
    console.log('  Poco CSS: il sito potrebbe servirlo via JS. Prova l\'URL di un CSS specifico.\n');
  }

  // — colori
  const hexes = tally(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/, css, (m) => normalizeHex(m[0]));
  const chromatic = hexes.filter((h) => !isNeutral(h.value));
  const brand = chromatic.filter((h) => !FRAMEWORK_DEFAULTS.has(h.value)).slice(0, TOP);
  const framework = chromatic.filter((h) => FRAMEWORK_DEFAULTS.has(h.value)).slice(0, 6);
  console.log('COLORI DI MARCA — per frequenza nel CSS di produzione');
  console.log('  (il più frequente è quasi sempre il colore di SISTEMA, non il marchio)\n');
  for (const h of brand) console.log(`  ${swatch(h.value)}  ${h.value}   ${String(h.count).padStart(4)} occorrenze`);
  if (framework.length) {
    console.log('\n  ↓ default di framework (Bootstrap/Tailwind): quasi mai scelte di brand');
    for (const h of framework) console.log(`  ${swatch(h.value)}  ${h.value}   ${String(h.count).padStart(4)} occorrenze`);
  }

  const neutrals = hexes.filter((h) => isNeutral(h.value)).slice(0, 6);
  console.log('\nNEUTRI\n');
  for (const h of neutrals) console.log(`  ${swatch(h.value)}  ${h.value}   ${String(h.count).padStart(4)} occorrenze`);

  // — custom property: quando ci sono, sono il design system dichiarato
  const vars = tally(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,6})/i, css, (m) => `--${m[1]}: ${normalizeHex(m[2])}`);
  const ownVars = vars.filter((v) => !FRAMEWORK_VAR_PREFIXES.some((p) => v.value.startsWith(p)));
  if (ownVars.length) {
    console.log('\nCUSTOM PROPERTY DICHIARATE DAL SITO — se ci sono, vincono su tutto\n');
    for (const v of ownVars.slice(0, 18)) console.log(`  ${swatch(v.value.split(': ')[1])}  ${v.value}`);
  }

  // — tipografia
  const fams = tally(/font-family\s*:\s*([^;}]+)/i, css, (m) => {
    const first = m[1].split(',')[0].replace(/["']/g, '').trim();
    return /^(inherit|initial|unset|var\()/i.test(first) || !first ? null : first;
  });
  console.log('\nCARATTERI DICHIARATI\n');
  for (const f of fams.slice(0, 10)) console.log(`  ${String(f.count).padStart(4)}×  ${f.value}`);

  console.log(`
COSA FARNE
  Questi sono FATTI, non ancora decisioni. Prima di scrivere il global.css:
  · guarda DOVE ogni colore è usato sul sito — il più frequente è il colore di
    sistema (link, stati, tab); il marchio spesso è raro ma inconfondibile;
  · un carattere proprietario non è distribuibile: scegli la sostituta più vicina
    e scrivi nel global.css perché l'hai scelta;
  · mappa sui token semantici (--surface-*, --ink-*, --accent-*) tenendo
    primary/secondary chiari e inverse scuro, se no i blocchi condivisi si rompono.
`);
}

main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
