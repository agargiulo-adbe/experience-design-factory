/**
 * panel-evidence — il pacchetto d'evidenza che leggono le personas del panel.
 *
 * Una sola regola, e viene da un errore già pagato: le attese CORTE producono
 * scatti di slide non ancora composte, e le personas segnalano «slide vuota»
 * su slide che si vedono benissimo. È costato un giro intero di panel. Qui si
 * aspetta `networkidle`, poi la transizione, poi si verifica che la slide
 * attiva abbia davvero del testo prima di fotografarla.
 *
 *   DECK_URL=http://localhost:4788 node scripts/panel-evidence.mjs \
 *     --app <alias> --out "<dir>"
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROUTE_SETS, CWD_ALIAS } from './lib/deck-routes.ts';

const flag = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const asked = flag('app') ?? '';
const app = ROUTE_SETS[asked] ? asked : (CWD_ALIAS[asked] ?? '');
const ROUTES = ROUTE_SETS[app];
if (!ROUTES) throw new Error(`panel-evidence: nessun route set per «${asked}»`);
const BASE = process.env.DECK_URL ?? 'http://localhost:4321';
const OUT = flag('out') ?? `panel-evidence-${app}`;

await mkdir(join(OUT, 'content'), { recursive: true });
await mkdir(join(OUT, 'shots'), { recursive: true });

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();

const indice = [];
for (const rotta of ROUTES) {
  await page.goto(BASE + rotta.route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const n = await page.evaluate(() => document.querySelectorAll('[data-slide]').length);
  for (let i = 0; i < n; i++) {
    await page.evaluate((k) => window.__edfDeck && window.__edfDeck.goTo(k), i);
    // 2200 e non 1400: una slide con sei card a scaglioni (`data-stagger`)
    // più un blocco in ritardo di 0,3 s non ha finito a 1,4 s, e lo scatto
    // mostrava le ultime card a metà dissolvenza (30 ott 2026).
    await page.waitForTimeout(2200);
    // I SOTTO-PASSI SI APRONO TUTTI prima di leggere e di fotografare: un deck
    // ha due assi (le slide, e dentro una slide i `[data-substep]` che si
    // rivelano col ↓), e fermarsi al primo dà alle personas una slide col solo
    // titolo. Trovato il 30 ott 2026 sul PDF di Intesa: 103 blocchi invisibili.
    // Stessa via di `deck-pdf.ts`: l'API del motore, non «Riduci movimento».
    const passi = await page.evaluate(() => {
      const d = window.__edfDeck; let n = 0;
      if (d && d.revealSubstep) while (d.revealSubstep()) n++;
      return n;
    });
    if (passi) await page.waitForTimeout(450);
    const dati = await page.evaluate((k) => {
      const s = document.querySelectorAll('[data-slide]')[k];
      if (!s) return null;
      // il testo ESATTO della lingua attiva, non entrambe: `<T>` rende tutte e due
      const attiva = document.documentElement.getAttribute('data-lang') || 'it';
      const spenta = attiva === 'it' ? '[data-lang-en]' : '[data-lang-it]';
      const clone = s.cloneNode(true);
      clone.querySelectorAll(spenta).forEach((e) => e.remove());
      // `innerText` raccoglie anche gli <script> inline: sulle slide con una
      // clip in loop il testo d'evidenza usciva per il 90% fatto di
      // JavaScript, e le personas lo leggevano come se fosse contenuto della
      // slide. Trovato il 21 ott 2026, presente in tutti e due i giri.
      clone.querySelectorAll('script, style, noscript').forEach((e) => e.remove());
      const testo = (clone.innerText || '').split('\n').map((r) => r.trim()).filter(Boolean).join('\n');
      // Il dettaglio dietro «Scopri come» è chiuso in proiezione ma viaggia
      // con il deck: chi lo riceve lo apre. Va nel pacchetto, marcato come
      // contenuto a richiesta, se no il fact-checker non lo vede.
      const dettagli = [...clone.querySelectorAll('[data-hiw-region]')].map((r) =>
        (r.textContent || '').split('\n').map((x) => x.trim()).filter(Boolean).join('\n')).filter(Boolean);
      const link = [...s.querySelectorAll('a[href^="http"]')].map((a) => `${a.textContent.trim()} → ${a.href}`);
      return { id: s.id || `(slide ${k + 1})`, testo, link, dettagli };
    }, i);
    if (!dati) continue;
    // la rete di sicurezza: una slide senza testo è quasi sempre uno scatto
    // preso troppo presto, non una slide vuota.
    if (dati.testo.length < 10) {
      await page.waitForTimeout(2000);
    }
    const nome = `${rotta.name}--${dati.id}`;
    /* `animations: 'disabled'` non è un vezzo: senza, lo scatto di una slide
       con una clip in riproduzione aspetta una stabilità che non arriva mai e
       va in timeout — e un timeout qui uccide tutta la cattura. Se una slide
       proprio non si lascia fotografare, si annota e si va avanti: meglio un
       pacchetto con uno scatto in meno che nessun pacchetto. */
    try {
      await page.screenshot({ path: join(OUT, 'shots', `${nome}.png`), animations: 'disabled', timeout: 20000 });
    } catch {
      process.stdout.write(`  ⚠️  scatto saltato: ${nome}\n`);
    }
    await writeFile(
      join(OUT, 'content', `${nome}.md`),
      `# ${rotta.name} · ${dati.id}\n\nURL: ${BASE}${rotta.route}\n\n## Testo esatto\n\n${dati.testo}\n\n## Dettaglio a richiesta («Scopri come», chiuso in proiezione)\n\n${dati.dettagli.length ? dati.dettagli.map((d) => d).join('\n\n---\n\n') : '(nessuno)'}\n\n## Link esterni\n\n${dati.link.length ? dati.link.map((l) => `- ${l}`).join('\n') : '(nessuno)'}\n`,
    );
    indice.push({ rotta: rotta.name, id: dati.id, parole: dati.testo.split(/\s+/).length });
  }
  process.stdout.write(`  ${rotta.name}: ${n} slide\n`);
}
await browser.close();

await writeFile(
  join(OUT, 'README.md'),
  `# Pacchetto d'evidenza — ${app}\n\n` +
    `Catturato il ${new Date().toISOString().slice(0, 10)} da ${BASE}, viewport 1920×1080, lingua attiva del deck.\n\n` +
    `**Che cos'è.** Un'experience immersiva: una slide per schermata, si avanza con le frecce.\n` +
    `Il percorso intero sta nelle rotte \`home → apertura → domanda → idee → rotta\`; \`exec\` è il\n` +
    `taglio corto che gira per primo; \`decisioning\` è un affondo che si apre da una slide e\n` +
    `non è una tappa del percorso.\n\n` +
    `**Come si legge.** \`content/<rotta>--<id-slide>.md\` porta il testo esatto e i link di quella\n` +
    `slide; \`shots/<rotta>--<id-slide>.png\` è come si vede. Il locator da citare è \`<rotta>/<id-slide>\`.\n\n` +
    `## Indice\n\n` +
    indice.map((r) => `- \`${r.rotta}/${r.id}\` — ${r.parole} parole`).join('\n') + '\n',
);
console.log(`\npanel-evidence · ${app} — ${indice.length} slide\n→ ${OUT}`);
