/**
 * cut-audit — il taglio «In dieci minuti» resta allineato al percorso intero.
 *
 * PERCHÉ ESISTE
 * Molti deck hanno due percorsi: quello intero e il taglio corto per chi non ha
 * l'ora. Finché i due tengono due copie a mano degli stessi blocchi, divergono:
 * non è una possibilità, è una certezza, e diverge sempre il taglio corto, perché
 * le correzioni arrivano sul lungo. Su Intesa è successo nello stesso giro in cui
 * nei commenti del file c'era scritto «se divergono comanda il lungo»: una riga
 * che diceva il falso su Analytics era stata corretta solo nel percorso intero,
 * ed è uscita guardando uno screenshot. Una regola affidata alla memoria di chi
 * modifica non è una regola: è una speranza. Questo è il gate che la rende vera.
 *
 * CHE COSA CONTROLLA
 *   HARD · c1 copia a mano — un testo lungo che sta nella FONTE UNICA (src/data)
 *          e che la pagina del taglio riscrive dentro il proprio markup: lì nasce
 *          la divergenza. Lo stesso vale per un testo lungo presente sia nel
 *          taglio sia in una pagina del percorso intero e in nessuna fonte: due
 *          copie senza un padrone.
 *   HARD · c2 numero orfano — un numero che il taglio afferma e il percorso
 *          intero non contiene. O il lungo l'ha perso, o il corto se l'è
 *          inventato: in entrambi i casi uno dei due dice una cosa che l'altro
 *          non dice. Le deroghe si dichiarano in `cut-routes.ts`.
 *   HARD · c3 fonte orfana — un link che il taglio porta e il percorso intero no.
 *          Un taglio è la stessa fonte, più corta: non ha fonti proprie.
 *   SOFT · c4 lunghezza — più slide del massimo dichiarato: non è più un taglio.
 *
 * CHE COSA NON CONTROLLA
 * Che il taglio dica le cose GIUSTE. Verifica che non dica cose DIVERSE. Il
 * giudizio su quali tre temi entrano nei dieci minuti resta umano, e si prende
 * una volta, prima della riunione.
 *
 *   DECK_URL=http://localhost:4402 npx tsx scripts/cut-audit.ts --app <alias>
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import * as path from 'node:path';
import { ROUTE_SETS, CWD_ALIAS } from './lib/deck-routes';
import { CUT_SETS } from './lib/cut-routes';

const flag = (n: string): string | undefined => {
  const i = process.argv.indexOf(`--${n}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const asked = flag('app') ?? process.cwd().split('/').pop() ?? '';
const app = ROUTE_SETS[asked] ? asked : (CWD_ALIAS[asked] ?? asked);
const spec = CUT_SETS[app];
if (!spec) {
  console.log(`cut-audit · «${app}» non dichiara un taglio corto: niente da verificare.`);
  console.log(`(le app con un taglio: ${Object.keys(CUT_SETS).join(', ')})`);
  process.exit(0);
}
const ROUTE_SET = ROUTE_SETS[app];
const cutRoute = ROUTE_SET.find((r) => r.name === spec.taglio);
if (!cutRoute) throw new Error(`cut-audit: la rotta «${spec.taglio}» non è in ROUTE_SETS['${app}']`);
const masterRoutes = ROUTE_SET.filter((r) => r.name !== spec.taglio);
const BASE = process.env.DECK_URL ?? 'http://localhost:4321';
const APP_DIR = path.resolve('apps', app);

/* ── il testo e i link, come vengono resi ─────────────────────────────────── */
interface Reso { testo: string; link: string[]; slide: number }
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();

async function rendi(route: string): Promise<Reso> {
  await page.goto(BASE + route, { waitUntil: 'networkidle' });
  return page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('[data-slide]'));
    // I nodi di testo si raccolgono UNO PER UNO e si uniscono con uno spazio: con
    // `textContent` due elementi adiacenti si fondono («…2029.» + «2.5 million» =
    // «2029.2.5») e il confronto dei numeri inventa differenze che non ci sono —
    // è successo al primo giro su Intesa, e un gate che grida al lupo è peggio di
    // nessun gate.
    // (niente funzione con nome qui dentro: tsx la trasforma in qualcosa che nel
    // browser non esiste — `__name is not defined`. Si scrive in linea.)
    const testo = slides.map((el) => {
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const out: string[] = [];
      while (w.nextNode()) out.push((w.currentNode.nodeValue || '').trim());
      return out.filter(Boolean).join(' ');
    }).join('\n');
    const link = slides.flatMap((s) =>
      Array.from(s.querySelectorAll('a[href]'))
        .map((a) => (a as HTMLAnchorElement).href)
        .filter((h) => /^https?:/i.test(h) && !h.includes(location.host)));
    return { testo, link, slide: slides.length };
  });
}

const taglio = await rendi(cutRoute.route);
const lungo: Reso = { testo: '', link: [], slide: 0 };
for (const r of masterRoutes) {
  const x = await rendi(r.route);
  lungo.testo += '\n' + x.testo;
  lungo.link.push(...x.link);
  lungo.slide += x.slide;
}
await browser.close();

/* ── c1 · copia a mano ────────────────────────────────────────────────────── */
const norm = (s: string) => s.replace(/\s+/g, ' ').replace(/[‘’′]/g, "'").replace(/[“”]/g, '"').trim();
/**
 * Le stringhe lunghe di un sorgente: letterali fra apici e testo fra tag — ma
 * solo quelle che sono COPIA. Un elenco di classi Tailwind e un'espressione di
 * template sono lunghi quanto una frase e non dicono niente al cliente: se li si
 * conta, il gate segnala dieci difetti che non lo sono e viene ignorato al primo
 * giro (è esattamente come muore un gate).
 */
function èCopia(s: string): boolean {
  if (s.length < 40) return false;
  if (/\$\{|var\(|[<>={}[\]]|&&|\|\||=>/.test(s)) return false;          // codice, non copia
  if (!/[a-zà-ÿ]{3}/.test(s)) return false;
  const tokens = s.split(/\s+/);
  if (tokens.length < 6) return false;
  const tecnici = tokens.filter((t) => /[-:/_.]/.test(t) && !/[.,;:!?»']$/.test(t)).length;
  if (tecnici / tokens.length > 0.3) return false;                        // classi, percorsi
  return true;
}
function stringheLunghe(src: string): string[] {
  const out: string[] = [];
  const letterali = src.match(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g) ?? [];
  for (const l of letterali) out.push(norm(l.slice(1, -1)));
  for (const t of src.replace(/<!--[\s\S]*?-->/g, '').match(/>[^<>{}]{40,}</g) ?? []) out.push(norm(t.slice(1, -1)));
  return out.filter(èCopia);
}
const leggi = (p: string) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const cutSrcPath = path.join(APP_DIR, 'src/pages', `${spec.taglio}.astro`);
const cutSrc = leggi(cutSrcPath);
if (!cutSrc) throw new Error(`cut-audit: non trovo il sorgente del taglio: ${cutSrcPath}`);
const cutStr = stringheLunghe(cutSrc);
const cutSrcNorm = norm(cutSrc);

const fonteStr = new Set<string>();
for (const f of spec.fonti) for (const s of stringheLunghe(leggi(path.join(APP_DIR, f)))) fonteStr.add(s);

const c1: string[] = [];
/* La fonte unica riscritta a mano: nella pagina del taglio (dove nasce la
   divergenza) e nelle pagine del percorso intero (dove la divergenza nasce al
   contrario — il taglio prende dalla fonte, il lungo no, e la correzione arriva
   solo su uno dei due). Successo sul campo: la testa della mappa e la riga della
   firma di Trenitalia erano tornate a mano nel percorso lungo mentre il taglio le
   leggeva dai dati, e il gate non le vedeva perché guardava solo il taglio. */
const masterSrcPerFile = masterRoutes.map((r) => ({
  nome: r.name,
  src: norm(leggi(path.join(APP_DIR, 'src/pages', `${r.name === 'home' ? 'index' : r.name}.astro`))),
}));
for (const s of fonteStr) {
  if (cutSrcNorm.includes(s)) c1.push(`sta nella fonte unica ED è riscritta nella pagina del taglio — «${s.slice(0, 96)}…»`);
  for (const m of masterSrcPerFile) {
    if (m.src.includes(s)) c1.push(`sta nella fonte unica ED è riscritta a mano in «${m.nome}» — «${s.slice(0, 96)}…»`);
  }
}
/* Lo stesso testo in due pagine e in nessuna fonte: due copie senza un padrone. */
const masterSrc = masterSrcPerFile.map((m) => m.src).join('\n');
for (const s of cutStr) {
  if (fonteStr.has(s)) continue;
  if (masterSrc.includes(s)) c1.push(`scritta a mano in due pagine, e in nessuna fonte unica — «${s.slice(0, 96)}…»`);
}

/* ── c2 · numeri orfani ───────────────────────────────────────────────────── */
const numeri = (t: string) => (norm(t).match(/\d[\d.,]*\s?%?/g) ?? []).map((n) => n.replace(/\s/g, '').replace(/[.,]$/, ''));
const nelLungo = new Set(numeri(lungo.testo));
const deroghe = new Set(spec.numeriSoloNelTaglio ?? []);
const c2 = [...new Set(numeri(taglio.testo))].filter((n) => !nelLungo.has(n) && !deroghe.has(n));

/* ── c3 · fonti orfane ────────────────────────────────────────────────────── */
const nelLungoLink = new Set(lungo.link);
const c3 = [...new Set(taglio.link)].filter((h) => !nelLungoLink.has(h));

/* ── esito ────────────────────────────────────────────────────────────────── */
console.log(`\ncut-audit · ${app} · taglio «${spec.taglio}» (${taglio.slide} slide) contro il percorso intero (${lungo.slide} slide su ${masterRoutes.length} pagine)`);
if (c1.length) {
  console.log(`\nHARD c1 — copia a mano: ${c1.length}`);
  for (const x of c1) console.log(`  ✗ ${x}`);
  console.log('  (si importa dalla fonte unica in src/data; dove il taglio ha bisogno di meno parole, si aggiunge un campo breve ACCANTO a quello lungo)');
}
if (c2.length) {
  console.log(`\nHARD c2 — numeri che il taglio afferma e il percorso intero no: ${c2.length}`);
  console.log(`  ✗ ${c2.join(' · ')}`);
  console.log('  (o il lungo ha perso un fatto, o il corto se n\'è inventato uno: si guarda quale dei due. Le deroghe vere si dichiarano in scripts/lib/cut-routes.ts)');
}
if (c3.length) {
  console.log(`\nHARD c3 — fonti che solo il taglio porta: ${c3.length}`);
  for (const h of c3) console.log(`  ✗ ${h}`);
  console.log('  (un taglio è la stessa fonte, più corta: se quel link serve, serve anche al percorso intero)');
}
if (taglio.slide > spec.slideMax) {
  console.log(`\nSOFT c4 — ${taglio.slide} slide, il massimo dichiarato è ${spec.slideMax}: non è più un taglio da dieci minuti.`);
}
const hard = c1.length + c2.length + c3.length;
if (!hard) console.log(`\nALLINEATO — il taglio non riscrive niente a mano, non afferma numeri che il lungo non ha, non porta fonti sue.`);
console.log(`\n⚠️  Il gate verifica che i due percorsi non dicano cose DIVERSE, non che dicano le cose giuste: quello resta un controllo umano.`);
process.exit(hard ? 1 : 0);
