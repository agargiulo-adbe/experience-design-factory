/**
 * rhythm-audit — il ritmo, la massa visiva e i deserti grafici di un deck HTML.
 *
 * Esiste per chiudere un'asimmetria misurata il 24 ott 2026: per i `.pptx` il
 * repo ha tre check nati apposta — `D` parole per slide, `V` quanta pagina è
 * coperta, `G` i deserti di sei slide senza un elemento grafico — e per le
 * experience HTML non ne aveva nessuno. Il risultato è stato un deck con tre
 * strutture ripetute sette volte, zero immagini, e tutti i gate verdi.
 *
 * Tre famiglie:
 *   R  ritmo        — due slide di contenuto consecutive dello stesso TIPO
 *   G  deserto      — N slide di fila senza un elemento visivo
 *   V  massa visiva — quanto della pagina è coperto da testo E da figure
 *
 * Perché una famiglia `V` separata e non una correzione del check `i` di
 * `audit:deck`: `i` misura la massa di TESTO ed è tarato su deck di prosa. Su
 * un deck ad ancore fallisce per costruzione (misurato: da 7 a 44 rilievi
 * MENTRE le slide miglioravano). Cambiarlo toccherebbe i verdetti di tutte le
 * app in un colpo; questo gate misura la cosa giusta accanto, e `i` resta la
 * misura storica finché i deck non sono passati.
 *
 *   DECK_URL=http://localhost:4520 pnpm audit:ritmo --app <alias> [--only <rotta>]
 *
 * Tutto SOFT: è un gate che insegna a comporre, non un cancello.
 *
 * ⚠️ LIMITE DICHIARATO del tipo. Il classificatore riconosce le strutture che
 * conosce — i blocchi del motore, le scene, e le classi del template. Un deck
 * con una pelle tutta sua (`.isu-*`, `.sd-*`, `.tdu-*`) cade in «testo» anche
 * dove è visivamente vario: «testo ×43» va letto come «43 slide che non uso
 * una struttura condivisa», non come «43 slide uguali». Il numero di cui
 * fidarsi è l'altro — **slide con un elemento visivo** — che conta `svg`,
 * `img`, `video` e `canvas` veri e non dipende da nessun selettore di pelle.
 * Misurato il 24 ott 2026 su nove deck: 26 slide su 213, il 12%.
 */
import { chromium } from 'playwright';
import { ROUTE_SETS, CWD_ALIAS, type Rotta } from './lib/deck-routes';

const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  ok: (s: string) => `\x1b[32m${s}\x1b[0m`,
  warn: (s: string) => `\x1b[33m${s}\x1b[0m`,
};

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const BASE = process.env.DECK_URL;
if (!BASE) {
  console.error('DECK_URL mancante. È l’ORIGIN (http://localhost:4520), non un percorso.');
  process.exit(2);
}
const app = arg('app') ?? CWD_ALIAS[process.cwd().split('/').pop() ?? ''] ?? '';
const rotte: Rotta[] = ROUTE_SETS[app] ?? [];
if (!rotte.length) {
  console.error(`Nessuna rotta per «${app}». Si dichiara in scripts/lib/deck-routes.ts.`);
  process.exit(2);
}
const solo = arg('only');
const daFare = solo ? rotte.filter((r) => solo.split(',').includes(r.name)) : rotte;
if (!daFare.length) { console.error(`--only «${solo}» non corrisponde a nessuna rotta.`); process.exit(2); }

const DESERTO = 4;          // slide di fila senza un elemento visivo
const COPERTURA_MIN = 0.38; // testo + figure, sull'altezza utile

interface Misura {
  rotta: string;
  id: string;
  tipo: string;
  visivo: boolean;
  copertura: number;
}

const browser = await chromium.launch();
const misure: Misura[] = [];

for (const r of daFare) {
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  // esbuild inietta `__name` nelle funzioni compilate: senza questo, ogni
  // page.evaluate esplode con «__name is not defined». Stessa riga di deck-audit.
  await page.addInitScript(() => { (window as unknown as { __name: (f: unknown) => unknown }).__name = (f) => f; });
  await page.goto(BASE + r.route, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => (window as unknown as { __edfDeck?: unknown }).__edfDeck !== undefined, { timeout: 15000 }).catch(() => undefined);
  await page.evaluate(() => document.fonts.ready.then(() => undefined)).catch(() => undefined);

  const perSlide = await page.evaluate(() => {
    const H = window.innerHeight;
    const W = window.innerWidth;
    const out: Array<{ id: string; tipo: string; visivo: boolean; copertura: number }> = [];

    for (const slide of Array.from(document.querySelectorAll<HTMLElement>('[data-slide]'))) {
      // ── Che TIPO di slide è: dalla sua struttura, non da una dichiarazione.
      const ha = (sel: string) => !!slide.querySelector(sel);
      // Lo sfondo non conta come figura: è atmosfera, non informazione.
      const figure = Array.from(slide.querySelectorAll<Element>('svg, img, video, canvas'))
        .filter((e) => !e.closest('[slot="backdrop"]') && !e.closest('.ex-nav') && e.clientWidth > 40 && e.clientHeight > 40);

      let tipo = 'testo';
      if (ha('[data-cobrand][data-variant="hero"], .ex-cover, .ex-sig-line')) tipo = 'copertina';
      else if (ha('[data-count-up]')) tipo = 'numeri';
      else if (ha('figure svg, [data-blueprint]')) tipo = 'figura';
      // Una scena vince sul riquadro media, e porta il PROPRIO nome: due scene
      // diverse sono due strutture diverse, non due «slide con una scena».
      else if (ha('[data-personalize]')) tipo = 'scena:personalize';
      else if (ha('[data-datalake]')) tipo = 'scena:datalake';
      else if (ha('[data-converse]')) tipo = 'scena:converse';
      else if (ha('[data-stack-assemble]')) tipo = 'scena:stack';
      else if (ha('[data-lifecycle]')) tipo = 'scena:lifecycle';
      else if (ha('[data-media-slot], [data-demo-flex]')) tipo = 'schermo';
      else if (ha('.ex-ch')) tipo = 'apri-capitolo';
      else if (slide.querySelectorAll('.ii-due-col, .ii-conf-col').length >= 2) tipo = 'confronto';
      else if (slide.querySelectorAll('.ex-ancora, .ii-domanda, .ex-card, .ii-chip, .ii-ref-b').length >= 3) tipo = 'blocchi';
      else if (ha('.ii-aff-t')) tipo = 'affermazione';

      // ── La copertura: testo E figure, unione delle aree, non somma.
      const box: Array<{ t: number; l: number; b: number; r: number }> = [];
      const push = (e: Element) => {
        const b = e.getBoundingClientRect();
        if (b.width < 8 || b.height < 8) return;
        if (b.bottom < 0 || b.top > H) return;
        box.push({ t: Math.max(0, b.top), l: Math.max(0, b.left), b: Math.min(H, b.bottom), r: Math.min(W, b.right) });
      };
      for (const e of figure) push(e);
      for (const e of Array.from(slide.querySelectorAll<HTMLElement>('p, h1, h2, h3, li, span[data-el]'))) {
        if (!e.textContent?.trim()) continue;
        const cs = getComputedStyle(e);
        if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) continue;
        if (e.querySelector('p, h1, h2, h3, li')) continue; // solo le foglie
        push(e);
      }
      // Unione approssimata per bande orizzontali di 10px: evita di contare
      // due volte un'etichetta sovrapposta a una figura.
      const banda = new Map<number, Array<[number, number]>>();
      for (const b of box) {
        for (let y = Math.floor(b.t / 10) * 10; y < b.b; y += 10) {
          const arr = banda.get(y) ?? [];
          arr.push([b.l, b.r]);
          banda.set(y, arr);
        }
      }
      let area = 0;
      for (const [, segs] of banda) {
        segs.sort((x, y) => x[0] - y[0]);
        let fine = -1;
        for (const [l, r] of segs) {
          const da = Math.max(l, fine);
          if (r > da) { area += (r - da) * 10; fine = r; }
        }
      }
      out.push({ id: slide.id || '(senza id)', tipo, visivo: figure.length > 0, copertura: area / (W * H) });
    }
    return out;
  });

  for (const s of perSlide) misure.push({ rotta: r.name, ...s });
  await ctx.close();
}
await browser.close();

// ── I rilievi ───────────────────────────────────────────────────────────────
interface Rilievo { code: string; dove: string; why: string }
const rilievi: Rilievo[] = [];

// R1 — due slide di CONTENUTO consecutive dello stesso tipo.
// Copertine e aperture di capitolo sono esenti: si ripetono per contratto.
const ESENTI = new Set(['copertina', 'apri-capitolo']);
for (let i = 1; i < misure.length; i++) {
  const a = misure[i - 1], b = misure[i];
  if (ESENTI.has(a.tipo) || ESENTI.has(b.tipo)) continue;
  if (a.tipo !== b.tipo) continue;
  rilievi.push({
    code: 'R1',
    dove: `${a.rotta} · ${a.id} → ${b.rotta} · ${b.id}`,
    why: `due slide di contenuto consecutive dello stesso tipo («${a.tipo}»): un deck è una partitura, non un formato. Si cambia struttura, o si fondono.`,
  });
}

// G1 — deserti grafici.
let run = 0, inizio = '';
for (const m of misure) {
  if (m.visivo) { run = 0; continue; }
  if (run === 0) inizio = `${m.rotta} · ${m.id}`;
  run++;
  if (run === DESERTO) {
    rilievi.push({
      code: 'G1',
      dove: `da ${inizio}`,
      why: `${DESERTO} slide di fila senza un elemento visivo. Dove si spiega un meccanismo si disegna, e il catalogo (pnpm deck:catalogo) dice con che cosa.`,
    });
  }
}

// V1 — massa visiva: testo E figure insieme.
for (const m of misure) {
  if (m.tipo === 'copertina') continue; // la firma è volutamente ariosa
  if (m.copertura >= COPERTURA_MIN) continue;
  rilievi.push({
    code: 'V1',
    dove: `${m.rotta} · ${m.id}`,
    why: `la pagina è coperta al ${(m.copertura * 100).toFixed(0)}% da testo e figure (soglia ${(COPERTURA_MIN * 100).toFixed(0)}%): la slide è vuota, non asciutta. Si aggiunge una figura, non del testo.`,
  });
}

// ── Esito ───────────────────────────────────────────────────────────────────
const tipi = new Map<string, number>();
for (const m of misure) tipi.set(m.tipo, (tipi.get(m.tipo) ?? 0) + 1);

console.log('');
console.log(c.bold('audit:ritmo') + c.dim(` · ${app} · ${misure.length} slide su ${daFare.length} rotte a 1920×1080`));
console.log('');
console.log('  ' + c.dim('tipi usati: ') + [...tipi.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ×${n}`).join(' · '));
const visivi = misure.filter((m) => m.visivo).length;
console.log('  ' + c.dim(`slide con un elemento visivo: ${visivi}/${misure.length}`));
console.log('');

if (!rilievi.length) {
  console.log(c.ok('PULITO') + ' — il deck alterna le strutture, non ha deserti grafici e riempie la pagina.');
} else {
  const perCode = new Map<string, Rilievo[]>();
  for (const r of rilievi) perCode.set(r.code, [...(perCode.get(r.code) ?? []), r]);
  for (const [code, list] of perCode) {
    console.log(c.warn(`  [${code}]`) + ' ' + list[0].why);
    for (const r of list.slice(0, 10)) console.log('     ' + c.dim(r.dove));
    if (list.length > 10) console.log('     ' + c.dim(`… e altri ${list.length - 10}`));
    console.log('');
  }
  console.log(c.warn(`${rilievi.length} rilievi`) + c.dim(' — tutti SOFT: questo gate insegna a comporre, non è un cancello.'));
}
console.log('');
console.log(c.dim('  Il catalogo delle strutture disponibili: pnpm deck:catalogo'));
console.log('');
