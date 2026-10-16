/**
 * audit:og — l'anteprima del link c'è, ed è dichiarata.
 *
 * PERCHÉ. Prima di questo gate, il 16 ott 2026, il repo stava così: quattro app
 * su diciannove avevano un `og.png`, tre layout su venti lo dichiaravano, e
 * `trenitalia-prospettiva-sales` aveva il file generato e **mai dichiarato** —
 * l'immagine c'era, e nessuno la vedeva mai. Sono due difetti diversi e nessuno
 * dei due si vede guardando la pagina: il primo si vede solo incollando il link
 * in una chat, il secondo nemmeno lì, perché il riquadro resta grigio come se
 * l'immagine non esistesse.
 *
 * CHE COSA CONTROLLA, sul `dist/` costruito (non sui sorgenti: conta ciò che
 * finisce in pagina):
 *   a  `og.png` esiste in `public/` ed è davvero **1200×630**
 *   b  ogni pagina HTML dichiara `og:image`
 *   c  l'URL è **ASSOLUTO** — i crawler non risolvono i percorsi relativi, ed è
 *      il modo più silenzioso di avere tutto a posto e nessuna anteprima
 *   d  il file puntato dall'URL **esiste** nel dist
 *   e  `og:title` e `twitter:card` ci sono (senza card, X e altri non mostrano
 *      l'immagine grande)
 *   f  niente meta **duplicati**: due `og:image` sono una lotteria su quale vince
 *
 * USO
 *   pnpm build && pnpm audit:og
 *   pnpm audit:og --app <alias>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

interface Rilievo { check: string; app: string; dove: string; cosa: string }

function png(file: string): { w: number; h: number } | null {
  try {
    const b = fs.readFileSync(file);
    if (b.length < 24 || b.toString('ascii', 1, 4) !== 'PNG') return null;
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  } catch { return null; }
}

function htmlFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) out.push(p);
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return out;
}

const args = process.argv.slice(2);
const only = args.includes('--app') ? args[args.indexOf('--app') + 1] : null;

const apps = fs
  .readdirSync(path.join(REPO, 'apps'), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .filter((a) => !only || a === only);

const rilievi: Rilievo[] = [];
let pagine = 0;
let conImmagine = 0;

for (const app of apps) {
  const pub = path.join(REPO, 'apps', app, 'public', 'og.png');
  const dist = path.join(REPO, 'apps', app, 'dist');

  // a — il file, e le sue dimensioni
  const dim = png(pub);
  if (!dim) {
    rilievi.push({ check: 'a', app, dove: 'public/og.png', cosa: 'manca o non è un PNG — si genera con `pnpm og --app ' + app + '`' });
  } else if (dim.w !== 1200 || dim.h !== 630) {
    rilievi.push({ check: 'a', app, dove: 'public/og.png', cosa: `${dim.w}×${dim.h} invece di 1200×630 — sotto i 600×315 molte chat degradano a riquadro piccolo` });
  }

  if (!fs.existsSync(dist)) {
    rilievi.push({ check: 'b', app, dove: 'dist/', cosa: 'non costruita: `pnpm build` prima dell\'audit, se no questo gate non misura niente' });
    continue;
  }

  for (const f of htmlFiles(dist)) {
    pagine++;
    const rel = path.relative(dist, f);
    const s = fs.readFileSync(f, 'utf8');

    const imgs = [...s.matchAll(/<meta\s+property="og:image"\s+content="([^"]*)"/g)].map((m) => m[1]);
    if (!imgs.length) {
      rilievi.push({ check: 'b', app, dove: rel, cosa: 'nessun og:image — in chat resta il riquadro grigio' });
      continue;
    }
    conImmagine++;
    if (imgs.length > 1) {
      rilievi.push({ check: 'f', app, dove: rel, cosa: `${imgs.length} og:image dichiarati — quale vince è una lotteria` });
    }
    const url = imgs[0];
    // c — assoluto
    if (!/^https?:\/\//.test(url)) {
      rilievi.push({ check: 'c', app, dove: rel, cosa: `og:image relativo («${url}») — i crawler non lo risolvono e l'anteprima resta vuota` });
    } else {
      // d — e il file c'è davvero?
      const u = new URL(url);
      // il percorso servito è <base>/<file>; nel dist il file sta alla radice dell'app
      const nome = path.basename(u.pathname);
      if (!fs.existsSync(path.join(dist, nome))) {
        rilievi.push({ check: 'd', app, dove: rel, cosa: `og:image punta a ${nome}, che non è nel dist` });
      }
    }
    // e — titolo e card
    if (!/<meta\s+property="og:title"/.test(s)) {
      rilievi.push({ check: 'e', app, dove: rel, cosa: 'manca og:title' });
    }
    if (!/<meta\s+name="twitter:card"\s+content="summary_large_image"/.test(s)) {
      rilievi.push({ check: 'e', app, dove: rel, cosa: 'manca twitter:card=summary_large_image — senza, l\'immagine esce piccola di lato' });
    }
  }
}

// ── esito ────────────────────────────────────────────────────────────────────
const perApp = new Map<string, Rilievo[]>();
for (const r of rilievi) {
  if (!perApp.has(r.app)) perApp.set(r.app, []);
  perApp.get(r.app)!.push(r);
}
console.log(`\n${apps.length} app · ${pagine} pagine · ${conImmagine} con anteprima\n`);
if (!rilievi.length) {
  console.log('PASS — ogni pagina dichiara la sua anteprima, con URL assoluto e file presente.\n');
  process.exit(0);
}
for (const [app, rs] of perApp) {
  console.log(`FAIL  ${app} — ${rs.length} rilievi`);
  const visti = new Set<string>();
  for (const r of rs) {
    const k = `${r.check}|${r.cosa}`;
    if (visti.has(k)) continue;
    visti.add(k);
    const altre = rs.filter((x) => `${x.check}|${x.cosa}` === k).length;
    console.log(`        [${r.check}] ${r.dove}${altre > 1 ? ` (+${altre - 1} pagine)` : ''}: ${r.cosa}`);
  }
}
console.log(`\n${rilievi.length} rilievi complessivi\n`);
process.exit(1);
