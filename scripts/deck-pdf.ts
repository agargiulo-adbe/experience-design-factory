/**
 * deck-pdf — il deck come file, una pagina per slide.
 *
 * PERCHÉ ESISTE
 * Un'experience è una pagina web, e questo è il suo pregio: si naviga, si
 * apre un affondo, si cambia lingua. Ma nel momento in cui conta può non
 * esserci — la condivisione schermo si inchioda (è successo in revisione il
 * 20 ott 2026, in diretta), la rete dell'ospite non collabora, o chi ha
 * ricevuto il link lo deve girare a chi non apre link. Serve il paracadute,
 * e il paracadute è un PDF: una pagina per slide, in ordine, come si vedono.
 *
 * COME LO FA, E PERCHÉ COSÌ
 * Non stampa la pagina: la FOTOGRAFA. Un deck è `fixed inset-0` con una slide
 * sola visibile alla volta, e `page.pdf()` di un documento così produce una
 * pagina sola e il resto sparito. Quindi: si naviga slide per slide con il
 * controller del deck (lo stesso che usano le frecce), si cattura ogni slide
 * a 1920×1080, e si impaginano gli scatti in un HTML di servizio — una
 * immagine per pagina — che viene reso in PDF. Quello che finisce nel file è
 * esattamente quello che si vedrebbe in proiezione, font e sfondi compresi.
 *
 * I SOTTO-PASSI SI APRONO TUTTI, e questa non è una scelta grafica. Un deck
 * ha DUE assi: le slide, e dentro una slide i blocchi `[data-substep]` che
 * si rivelano uno alla volta con ↓ — la chat che arriva battuta per battuta,
 * l'imbuto che compare sotto il titolo. Chi percorre il solo primo asse
 * fotografa ogni slide allo stato 0, e in pagina resta il titolo con sotto
 * il vuoto: il contenuto c'è, ma è `visibility: hidden`. Un PDF non ha un ↓
 * da premere, quindi ogni slide si apre fino in fondo (`revealSubstep()`
 * finché risponde) e si scatta a racconto completo.
 * La via breve — emulare «Riduci movimento», che il CSS rende mostrando ogni
 * passo — è stata provata e scartata: sotto quella preferenza il motore
 * manda la clip di sfondo a `display: none` (copertina e chiusura perdono il
 * video) e accende la pillola «Attiva il movimento», che nel PDF è un
 * comando inerte stampato sopra la slide. Due difetti nuovi per uno risolto.
 *
 * LA LINGUA È UN PARAMETRO, non un caso: `<T>` rende ENTRAMBE le lingue e il
 * CSS mostra quella attiva, quindi senza dichiararla si ottiene il PDF nella
 * lingua di default dell'app. `--lang en` produce l'altro.
 *
 *   DECK_URL=http://localhost:4766 npx tsx scripts/deck-pdf.ts --app <alias> \
 *     [--out <file.pdf>] [--lang it|en] [--only <rotta,rotta>]
 */
import { chromium, type Page } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { ROUTE_SETS, CWD_ALIAS } from './lib/deck-routes';

const flag = (n: string): string | undefined => {
  const i = process.argv.indexOf(`--${n}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};

const asked = flag('app') ?? process.cwd().split('/').pop() ?? '';
const app = ROUTE_SETS[asked] ? asked : (CWD_ALIAS[asked] ?? '');
const ROUTE_SET = ROUTE_SETS[app];
if (!ROUTE_SET) {
  throw new Error(`deck-pdf: nessun route set per «${asked}». Validi: ${Object.keys(ROUTE_SETS).join(', ')}`);
}
const only = flag('only');
const ROUTES = only ? ROUTE_SET.filter((r) => only.split(',').includes(r.name)) : ROUTE_SET;
if (!ROUTES.length) throw new Error(`deck-pdf: --only ${only} non seleziona nessuna rotta`);

const BASE = process.env.DECK_URL ?? 'http://localhost:4321';
const LANG = flag('lang');
const OUT = resolve(flag('out') ?? `${app}${LANG ? `-${LANG}` : ''}.pdf`);
const W = 1920;
const H = 1080;

/** Quante slide ha la pagina, contate come le conta il deck. */
async function contaSlide(page: Page): Promise<number> {
  return page.evaluate(() => document.querySelectorAll('[data-slide]').length);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

const scatti: string[] = [];
for (const rotta of ROUTES) {
  await page.goto(BASE + rotta.route, { waitUntil: 'networkidle' });
  if (LANG) {
    await page.evaluate((l) => {
      document.documentElement.setAttribute('data-lang', l);
      try { localStorage.setItem('edf:lang', l); } catch { /* finestra privata */ }
    }, LANG);
  }
  const n = await contaSlide(page);
  let apertiInRotta = 0;
  for (let i = 0; i < n; i++) {
    await page.evaluate((k) => {
      const d = (window as unknown as { __edfDeck?: { goTo(i: number): void } }).__edfDeck;
      if (d) d.goTo(k);
    }, i);
    // Il tempo serve: le clip di sfondo hanno un poster che arriva dopo, e le
    // slide che si animano all'ingresso vanno fotografate a transizione finita.
    await page.waitForTimeout(900);
    // Poi si apre il racconto: i sotto-passi si rivelano DOPO l'attesa, cioè a
    // slide già entrata e attivata (`goTo` rimanda `playSlide` di mezzo
    // secondo, e l'ingresso li aveva comunque riazzerati).
    const passi = await page.evaluate(() => {
      const d = (window as unknown as { __edfDeck?: { revealSubstep(): boolean } }).__edfDeck;
      if (!d) return 0;
      let aperti = 0;
      while (d.revealSubstep()) aperti++;
      return aperti;
    });
    // Ogni passo entra in 320ms, e partono tutti insieme: un'attesa sola basta.
    if (passi) await page.waitForTimeout(450);
    apertiInRotta += passi;
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    scatti.push(`data:image/jpeg;base64,${buf.toString('base64')}`);
  }
  process.stdout.write(`  ${rotta.name}: ${n} slide${apertiInRotta ? ` · ${apertiInRotta} sotto-passi aperti` : ''}\n`);
}

/* L'HTML di servizio: una immagine per pagina, nessun margine, nessuna
   intestazione. È un contenitore, non un documento — tutto quello che si
   vede nel PDF viene dagli scatti. */
const html = `<!doctype html><meta charset="utf-8"><style>
  @page { size: ${W}px ${H}px; margin: 0; }
  html, body { margin: 0; padding: 0; background: #000; }
  figure { margin: 0; width: ${W}px; height: ${H}px; break-after: page; }
  figure:last-child { break-after: auto; }
  img { display: block; width: ${W}px; height: ${H}px; }
</style>${scatti.map((s) => `<figure><img src="${s}"></figure>`).join('')}`;

const stampa = await ctx.newPage();
await stampa.setContent(html, { waitUntil: 'load' });
await mkdir(dirname(OUT), { recursive: true });
await stampa.pdf({ path: OUT, width: `${W}px`, height: `${H}px`, printBackground: true, pageRanges: `1-${scatti.length}` });
await browser.close();

console.log(`\ndeck-pdf · ${app}${LANG ? ` · ${LANG}` : ''} — ${scatti.length} pagine\n→ ${OUT}`);
