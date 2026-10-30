/**
 * LENTI · le misure che servono a UMANIZZARE una experience, e che nessun gate dà.
 *
 * Non è un gate e non deve diventarlo: non stampa pass/fail, stampa NUMERI da
 * confrontare prima e dopo un giro di riscrittura. Il motivo sta in
 * `skills/experience-design/references/umanizzazione.md`: un intervento che fa
 * scendere un contatore può aver SPOSTATO il marcatore invece di toglierlo, e
 * l'unico modo di saperlo è misurare anche quello che il gate non guarda.
 *
 * Il caso che l'ha generato (intesa-esperienza-cliente, 30 ott 2026): `copy-audit` segnalava
 * 8 trattini-perno. Sostituirli con i due punti avrebbe azzerato il check — ma
 * il deck aveva già 49 due-punti-perno, sei volte tanto. La «correzione» avrebbe
 * peggiorato il testo con tutti i gate verdi.
 *
 * CHE COSA STAMPA
 *   · stilometria PER PAGINA — frase media, burstiness, Gulpease, type-token.
 *     Le frasi si contano DENTRO ogni stringa: unirle salda i titoli, che non
 *     finiscono col punto, in una frase finta (misurato: frase media 50 parole
 *     e burstiness 0,0 su una pagina di sole ancore).
 *   · i PERNI — due punti usati come perno retorico, per pagina.
 *   · i TELAI — quante stringhe girano sulla stessa architettura di frase, e
 *     dove si concentrano. La concentrazione è il segnale, non il totale.
 *   · le APERTURE ripetute fra stringhe vicine nella stessa pagina.
 *
 * COME SI LEGGE
 * Nessuna soglia assoluta. Si guarda il DELTA fra due giri, e la colonna dove
 * un numero è fuori scala rispetto alle sorelle: su intesa-esperienza-cliente `scenario`
 * aveva 21 perni per 100 stringhe contro una media di 5.
 *
 *   pnpm lenti --app <alias> [--en] [--root <albero>]
 *
 * `--root` punta a un albero diverso (per esempio uno stato estratto con
 * `git archive <commit> apps/<app>/src`) per avere la baseline vera.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

const ROOT = process.argv.includes('--root') ? process.argv[process.argv.indexOf('--root')+1]
  : '/Users/agargiulo/Documents/progetti/Experience Design Factory';
const app = process.argv[process.argv.indexOf('--app') + 1];
const LANG = process.argv.includes('--en') ? 'en' : 'it';
const SRC = join(ROOT, 'apps', app, 'src');

const ATTR = /\b(it|en)\s*=\s*"([^"]{3,})"/g;
const FIELD = /\b(it|en)\s*:\s*(['"`])((?:(?!\2).){3,})\2/g;
const FIELD_ANY = /\b([a-zA-Z][\w]*)\s*:\s*(['"`])((?:(?!\2).){12,})\2/g;
const TESTO_MARKUP = />([^<>{}]{12,})</g;
const CAMPI_NON_RESI = /^(?:cosaDice|nota|note|why|data|url|href|id|slug|key|code|class|className|path|src)$/;
function èProsa(t: string): boolean {
  if (/\$\{|var\(|=>|&&|\|\||https?:|\.(?:ts|astro|css|json|webp|png|mp4)\b|^\/|#[0-9a-f]{3,}/i.test(t)) return false;
  if (!/[a-zà-ÿ]{3}/.test(t)) return false;
  const tok = t.trim().split(/\s+/);
  if (tok.length < 4) return false;
  return tok.filter((x) => /[-:/_]/.test(x) && !/[.,;:!?»']$/.test(x)).length / tok.length <= 0.3;
}
function walk(dir: string, out: string[] = []): string[] {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) { if (!/^(node_modules|dist|\.astro)$/.test(e.name)) walk(full, out); }
    else if (/\.(astro|ts)$/.test(e.name)) out.push(full);
  }
  return out;
}
type S = { lang: string; text: string; line: number; file: string };
function strings(src: string, file: string): S[] {
  if (/admin\.astro$/.test(file)) return [];
  const èPagina = /\.astro$/.test(file);
  const out: S[] = [];
  const lineOf = (i: number) => src.slice(0, i).split('\n').length;
  const pulito = src.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/^\s*\/\/.*$/gm, (c) => c.replace(/[^\n]/g, ' '));
  for (const re of [ATTR, FIELD, ...(èPagina ? [TESTO_MARKUP] : [FIELD_ANY])]) {
    re.lastIndex = 0; let m: RegExpExecArray | null;
    while ((m = re.exec(pulito))) {
      const bil = re === ATTR || re === FIELD;
      const lang = bil ? m[1] : 'it';
      const text = re === ATTR ? m[2] : (re === FIELD || re === FIELD_ANY) ? m[3] : m[1];
      if (re === FIELD_ANY && CAMPI_NON_RESI.test(m[1])) continue;
      if (!bil && !èProsa(text)) continue;
      if (/[\[\]{}=]|=>|\breturn\b|\bnull\b|\bconst\b/.test(text)) continue;
      const line = lineOf(m.index);
      if ((src.split('\n')[line - 1] ?? '').includes('copy-audit-ignore')) continue;
      out.push({ lang, text, line, file: relative(SRC, file) });
    }
  }
  const visti = new Set<string>();
  return out.filter((x) => { const k = `${x.file}·${x.line}·${x.text}`; if (visti.has(k)) return false; visti.add(k); return true; });
}

const frasi = (t: string) => t.split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter(Boolean);
const parole = (t: string) => t.match(/[A-Za-zÀ-ÿ’']+/g) ?? [];
const PERNO = /(?:[A-Za-zÀ-ÿ’']+[\s,]+){5,}[A-Za-zÀ-ÿ’']+:\s+(?:[a-zà-ÿA-ZÀ-Ý’']+\s+){3,}[A-Za-zÀ-ÿ’']/g;

const all: S[] = [];
for (const f of walk(SRC)) all.push(...strings(readFileSync(f, 'utf8'), f));
const mie = all.filter((s) => s.lang === LANG || (LANG === 'it' && s.lang === 'it'));

// raggruppo per pagina (i file di dati vanno in una riga a parte)
const perPagina = new Map<string, S[]>();
for (const s of mie) {
  const k = s.file.startsWith('pages/') ? basename(s.file, '.astro')
    : s.file.startsWith('data/') ? '· dati' : '· componenti';
  (perPagina.get(k) ?? perPagina.set(k, []).get(k)!).push(s);
}

function stilo(ss: S[]) {
  /* ATTENZIONE: le frasi si contano DENTRO ogni stringa, non su un blob unito.
     Unire i titoli (che non finiscono col punto) con uno spazio li salda in una
     frase finta: su questa app dava a `persona` una frase media di 50 parole e
     burstiness 0,0, e falsava il Gulpease, che dipende dal numero di frasi. */
  const lens: number[] = [];
  const pa: string[] = [];
  let nFrasi = 0;
  let perni = 0;
  for (const s of ss) {
    for (const f of frasi(s.text)) {
      const p = parole(f);
      if (!p.length) continue;
      lens.push(p.length); pa.push(...p); nFrasi++;
    }
    perni += (s.text.match(PERNO) ?? []).length;
  }
  if (!pa.length || !lens.length) return null;
  const mu = lens.reduce((a, b) => a + b, 0) / lens.length;
  const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mu) ** 2, 0) / lens.length);
  const lettere = pa.reduce((a, w) => a + w.length, 0);
  const gulp = 89 + (300 * nFrasi - 10 * lettere) / pa.length;
  const ttr = new Set(pa.map((w) => w.toLowerCase())).size / pa.length;
  return { n: ss.length, parole: pa.length, frasi: nFrasi, mu, sd, gulp, ttr, perni, perniPer100: (perni / ss.length) * 100 };
}

console.log(`misura — ${app} (${LANG}) · ${mie.length} stringhe\n`);
console.log(`${'pagina'.padEnd(16)}${'str'.padStart(5)}${'parole'.padStart(8)}${'frase μ'.padStart(9)}${'burst σ'.padStart(9)}${'Gulpease'.padStart(10)}${'TTR'.padStart(6)}${'perni/100str'.padStart(14)}`);
const righe = [...perPagina.entries()].map(([k, v]) => [k, stilo(v)] as const).filter(([, s]) => s);
righe.sort((a, b) => a![1]!.gulp - b![1]!.gulp);
for (const [k, s] of righe) {
  console.log(`${k.padEnd(16)}${String(s!.n).padStart(5)}${String(s!.parole).padStart(8)}${s!.mu.toFixed(1).padStart(9)}${s!.sd.toFixed(1).padStart(9)}${s!.gulp.toFixed(1).padStart(10)}${s!.ttr.toFixed(2).padStart(6)}${s!.perniPer100.toFixed(0).padStart(14)}`);
}
const tot = stilo(mie)!;
console.log(`${'TUTTO'.padEnd(16)}${String(tot.n).padStart(5)}${String(tot.parole).padStart(8)}${tot.mu.toFixed(1).padStart(9)}${tot.sd.toFixed(1).padStart(9)}${tot.gulp.toFixed(1).padStart(10)}${tot.ttr.toFixed(2).padStart(6)}${tot.perniPer100.toFixed(0).padStart(14)}`);

// ── aperture ripetute fra stringhe adiacenti nella stessa pagina
console.log('\naperture ripetute (stringhe vicine nella stessa pagina che iniziano con la stessa parola)');
for (const [k, v] of perPagina) {
  const seq = v.slice().sort((a, b) => a.line - b.line);
  for (let i = 1; i < seq.length; i++) {
    const w = (t: string) => (parole(t)[0] ?? '').toLowerCase();
    if (w(seq[i].text) && w(seq[i].text) === w(seq[i - 1].text) && parole(seq[i].text).length > 3)
      console.log(`   ${k}:${seq[i-1].line}+${seq[i].line} «${w(seq[i].text)}…» → «${seq[i-1].text.slice(0,42)}» / «${seq[i].text.slice(0,42)}»`);
  }
}

/* ── I TELAI ──────────────────────────────────────────────────────────────────
   Non il segno: la FORMA della frase. Una stessa architettura retorica ricorre
   sempre in un documento con una tesi; il difetto è la concentrazione. Su
   intesa-esperienza-cliente il telaio della negazione («non X: Y», «X, non Y») stava in 33
   stringhe su 513, e lette una per una erano quasi tutte guadagnate — perché
   l'argomento del deck È «quello che date per fatto non succede». Ma cinque
   identiche dentro lo stesso componente, lette in fila, erano un tic.
   ⚠️ Un terzo circa sono falsi positivi: i due punti che introducono una
   citazione o un elenco non sono un perno. Si leggono, non si contano. */
const TELAI: Array<{ id: string; desc: string; re: RegExp }> = [
  { id: 'negazione + perno', desc: '«non X: Y» / «X: non Y» — la riformulazione dopo il perno',
    re: /\bnon\b[^.!?]{0,70}[:—][^.!?]{3,}|[^.!?]{6,}[:—]\s*non\b/gi },
  { id: 'negazione in coda', desc: '«X, non Y» — la negazione come coda di frase',
    re: /,\s*non\s+(?:[a-zà-ÿ’']+\s+){0,4}[a-zà-ÿ’']+[.!?]?$/gi },
  { id: 'definizione per esclusione', desc: '«X non vuol dire Y. Vuol dire Z»',
    re: /non\s+vuol\s+dire|non\s+significa|doesn[’']t\s+mean/gi },
  { id: 'perno + elenco di tre', desc: 'due punti seguiti da tre voci',
    re: /:\s*[^.!?]{3,30},[^.!?]{3,30},[^.!?]{3,30}/g },
];
console.log('\ntelai — la forma della frase. Il segnale è la CONCENTRAZIONE, non il totale.');
let telaioTot = 0;
for (const t of TELAI) {
  const hit = mie.filter((s) => { t.re.lastIndex = 0; return t.re.test(s.text); });
  telaioTot += hit.length;
  const perFile = new Map<string, number>();
  for (const h of hit) perFile.set(h.file, (perFile.get(h.file) ?? 0) + 1);
  const top = [...perFile.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([f, n]) => `${f}×${n}`).join(' · ');
  console.log(`   ${t.id.padEnd(28)}${String(hit.length).padStart(4)}  ${t.desc}`);
  if (hit.length) console.log(`   ${''.padEnd(28)}      ${top}`);
}
console.log(`   ${'TOTALE'.padEnd(28)}${String(telaioTot).padStart(4)}  su ${mie.length} stringhe (${(telaioTot / mie.length * 100).toFixed(1)}%)`);
console.log('\n⚠️  Non è un gate: nessuna di queste righe è un difetto finché non la si legge.');
