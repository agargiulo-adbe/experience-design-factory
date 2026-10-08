/**
 * copy-audit — lo STRATO 1 della catena di qualità sulla copia.
 *
 * PERCHÉ ESISTE
 * Due regole di `CLAUDE.md` sono BINDING da mesi e non le misura nessuno: la
 * rubrica «la copia è umana, non AI» e la voce al plurale istituzionale. Sono
 * regole che un `grep` sa controllare, e finché restano solo scritte dipendono
 * da quanto bene chi scrive se le ricorda mentre scrive. Questo gate le rende
 * un fatto, come `audit:deck` ha reso un fatto la resa delle slide.
 *
 * COSA NON FA
 * Non giudica il tono, non riscrive, non sa se una frase è bella. Trova i
 * SEGNI: i tic che tradiscono il testo generato e le violazioni della voce.
 * Il giudizio resta umano — e lo strato 2 (un servizio di governance della
 * voce di marchio) è un'altra cosa ancora, che NON gira su copia di cliente
 * finché Legal non ha risposto.
 *
 * COSA LEGGE
 * I sorgenti, non il `dist`: le stringhe visibili sono gli attributi `it=` /
 * `en=` di `<T>` e i campi `it:` / `en:` nei file di dati. Così il rilievo
 * arriva con file e riga, cioè dove si corregge.
 *
 * SEVERITÀ
 *   HARD — contratto, deve essere zero: voce alla seconda persona singolare,
 *          tipografia (apostrofi e virgolette dritti nel testo visibile).
 *   SOFT — rubrica de-AI: sono segni, non sentenze. Si guardano uno per uno.
 *
 * Uso:  pnpm audit:copy                 (tutte le app)
 *       pnpm audit:copy --app <slug>    (una sola)
 *       pnpm audit:copy --hard-only
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath, non `.pathname`: il percorso di questo repo contiene spazi e
// `pathname` li restituisce come %20 — la cartella non esiste, la lista di app
// esce vuota e il gate stampa un PASS senza aver misurato niente. È la stessa
// trappola già vista su `audit:deck --only`.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const APPS = join(ROOT, 'apps');

type Sev = 'HARD' | 'SOFT';
interface Finding {
  sev: Sev;
  code: string;
  file: string;
  line: number;
  lang: string;
  text: string;
  why: string;
}

// ── Le regole ────────────────────────────────────────────────────────────────
// Ogni regola porta il PERCHÉ, perché un gate che dice solo «no» non insegna.

interface Rule {
  code: string;
  sev: Sev;
  langs?: Array<'it' | 'en'>;
  re: RegExp;
  why: string;
}

const RULES: Rule[] = [
  // ── HARD · la voce parla all'organizzazione, non alla persona in sala ──────
  {
    code: 'V1',
    sev: 'HARD',
    langs: ['it'],
    re: /\b(?:tu|tuo|tuoi|tua|tue|tuoi)\b/gi,
    why: 'seconda persona singolare: il deck gira ai colleghi e deve reggere senza chi l’ha presentato. Plurale istituzionale («la vostra istanza», «decidete voi») o impersonale.',
  },
  {
    code: 'V2',
    sev: 'HARD',
    langs: ['it'],
    // SOLO le forme non ambigue. Fuori di proposito: «sei» (è anche il
    // numerale — «Sei domande», «sei mesi»), «prova» e «guarda» (anche nomi o
    // impersonali: «la prova», «si guarda»), «vedi» (anche rimando: «vedi §»),
    // «hai/fai/sai» (frequenti dentro altre parole o in citazioni). Un gate che
    // grida al lupo viene spento, e allora non serve più a niente.
    re: /\b(?:puoi|devi|vuoi|scopri|immagina|clicca|registrati|provaci)\b/gi,
    why: 'verbo alla seconda persona singolare: stessa regola della voce. Eccezioni legittime: mock di chat e messaggi d’interfaccia, che vanno esclusi con `copy-audit-ignore`.',
  },

  // ── HARD · tipografia ─────────────────────────────────────────────────────
  {
    code: 'T1',
    sev: 'HARD',
    re: /[a-zàèéìòùA-ZÀÈÉÌÒÙ]'[a-zàèéìòùA-ZÀÈÉÌÒÙ]/g,
    why: 'apostrofo dritto nel testo visibile: in pagina va quello tipografico (’).',
  },
  {
    code: 'T2',
    sev: 'HARD',
    re: /"[^"]{2,}"/g,
    why: 'virgolette dritte nel testo visibile: in italiano si usano le caporali («»), in inglese le curve.',
  },

  // ── SOFT · la rubrica de-AI ───────────────────────────────────────────────
  {
    code: 'D1',
    sev: 'SOFT',
    re: /\S\s+—\s+\S/g,
    why: 'trattino lungo usato come stampella retorica. Quasi sempre si risolve con un punto o una virgola.',
  },
  {
    code: 'D2',
    sev: 'SOFT',
    langs: ['it'],
    re: /non\s+solo\b[^.!?]{0,80}?\bma\b/gi,
    why: 'costruzione simmetrica «non solo X, ma Y»: è il tic più riconoscibile del testo generato.',
  },
  {
    code: 'D2',
    sev: 'SOFT',
    langs: ['en'],
    re: /not\s+just\b[^.!?]{0,80}?\b(?:but|it[’']s)\b/gi,
    why: 'symmetrical “not just X — but Y”: the most recognisable tell of generated text.',
  },
  {
    code: 'D3',
    sev: 'SOFT',
    re: /(?:^|[.!?]\s)(?:\w+\s){0,2}\w+\.\s(?:\w+\s){0,2}\w+\.\s(?:\w+\s){0,2}\w+\./g,
    why: 'tricolon staccato (tre frammenti brevi di fila): ritmo da slogan, non da prosa. Variare la lunghezza delle frasi.',
  },
  {
    code: 'D4',
    sev: 'SOFT',
    langs: ['it'],
    re: /\b(?:crea(?:re|no)?\s+valore|valore\s+aggiunto|un['’]unica\s+visione|visione\s+unica|a\s+360|end[-\s]to[-\s]end|best[-\s]in[-\s]class|game\s+changer|all['’]avanguardia|sinergi[ae]|leva\s+strategica|abilitante|rivoluzion\w+)\b/gi,
    why: 'value-speak: dice di valere senza dire che cosa fa. Sostituire con il fatto concreto.',
  },
  {
    code: 'D4',
    sev: 'SOFT',
    langs: ['en'],
    re: /\b(?:create\s+value|added\s+value|a\s+single\s+view\s+of|end[-\s]to[-\s]end|best[-\s]in[-\s]class|game[-\s]chang\w+|cutting[-\s]edge|synerg\w+|unlock\w*\s+(?:value|potential))\b/gi,
    why: 'value-speak: claims worth without naming the thing it does. Replace with the concrete fact.',
  },
  {
    code: 'D5',
    sev: 'SOFT',
    langs: ['it'],
    re: /(?:^|[.!?]\s|»\s)(?:Inoltre|Infatti|In\s+un\s+mondo\s+in\s+cui|Non\s+si\s+tratta\s+solo|Di\s+conseguenza|In\s+definitiva)\b/g,
    why: 'connettore da testo generato: nel parlato di un deck non ci va. Togliere o riscrivere.',
  },
  {
    code: 'D5',
    sev: 'SOFT',
    langs: ['en'],
    re: /(?:^|[.!?]\s)(?:Moreover|Furthermore|In\s+a\s+world\s+where|It[’']s\s+not\s+just\s+about|Ultimately|Additionally)\b/g,
    why: 'generated-text connector: it does not belong in deck copy. Cut or rewrite.',
  },
  {
    code: 'D6',
    sev: 'SOFT',
    langs: ['it'],
    re: /\b(?:il\s+miglior\w*|unico\s+nel\s+suo\s+genere|senza\s+precedenti|straordinari\w+|rivoluzionari\w+|incredibil\w+|il\s+più\s+avanzat\w+)\b/gi,
    why: 'superlativo vuoto: un numero con la fonte convince, un superlativo no.',
  },
  {
    code: 'D6',
    sev: 'SOFT',
    langs: ['en'],
    re: /\b(?:the\s+best[-\s]\w+|one\s+of\s+a\s+kind|unprecedented|revolutionary|groundbreaking|the\s+most\s+advanced)\b/gi,
    why: 'empty superlative: a sourced number persuades, a superlative does not.',
  },
];

// ── Estrazione delle stringhe visibili ───────────────────────────────────────
// `it="…"` / `en="…"` degli <T>, e `it: '…'` / `en: '…'` nei file di dati.
// Niente altro: i commenti e il codice non vanno in pagina, e misurarli
// produrrebbe solo rumore.
const ATTR = /\b(it|en)\s*=\s*"([^"]{3,})"/g;
const FIELD = /\b(it|en)\s*:\s*(['"`])((?:(?!\2).){3,})\2/g;

function visibleStrings(src: string): Array<{ lang: 'it' | 'en'; text: string; line: number }> {
  const out: Array<{ lang: 'it' | 'en'; text: string; line: number }> = [];
  const lineOf = (i: number) => src.slice(0, i).split('\n').length;
  for (const re of [ATTR, FIELD]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      const lang = m[1] as 'it' | 'en';
      const text = re === ATTR ? m[2] : m[3];
      const line = lineOf(m.index);
      // riga marcata a mano come eccezione (mock di chat, messaggi d'interfaccia)
      const lineSrc = src.split('\n')[line - 1] ?? '';
      if (lineSrc.includes('copy-audit-ignore')) continue;
      out.push({ lang, text, line });
    }
  }
  return out;
}

function walk(dir: string, out: string[] = []): string[] {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist' || e.name === '.astro') continue;
      walk(full, out);
    } else if (/\.(astro|ts)$/.test(e.name)) out.push(full);
  }
  return out;
}

// ── Giro ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const appFlag = argv.includes('--app') ? argv[argv.indexOf('--app') + 1] : null;
const hardOnly = argv.includes('--hard-only');

const apps = (appFlag ? [appFlag] : readdirSync(APPS)).filter((a) =>
  existsSync(join(APPS, a, 'src')),
);

if (apps.length === 0) {
  console.error(
    appFlag
      ? `copy-audit: nessuna app «${appFlag}» con una cartella src/. Un giro che non misura niente non è un PASS.`
      : 'copy-audit: nessuna app trovata sotto apps/. Un giro che non misura niente non è un PASS.',
  );
  process.exit(2);
}

const findings: Finding[] = [];

for (const app of apps) {
  for (const file of walk(join(APPS, app, 'src'))) {
    const src = readFileSync(file, 'utf8');
    for (const { lang, text, line } of visibleStrings(src)) {
      for (const rule of RULES) {
        if (rule.langs && !rule.langs.includes(lang)) continue;
        rule.re.lastIndex = 0;
        const m = rule.re.exec(text);
        if (!m) continue;
        findings.push({
          sev: rule.sev,
          code: rule.code,
          file: relative(ROOT, file),
          line,
          lang,
          text: m[0].trim().slice(0, 70),
          why: rule.why,
        });
      }
    }
  }
}

const hard = findings.filter((f) => f.sev === 'HARD');
const soft = findings.filter((f) => f.sev === 'SOFT');

function report(title: string, group: Finding[]) {
  console.log(`\n${title}: ${group.length}`);
  const byCode = new Map<string, Finding[]>();
  for (const f of group) byCode.set(f.code, [...(byCode.get(f.code) ?? []), f]);
  for (const [code, list] of [...byCode].sort()) {
    console.log(`\n  [${code}] ${list[0].why}`);
    for (const f of list.slice(0, 12)) {
      console.log(`     ${f.file}:${f.line} (${f.lang})  «${f.text}»`);
    }
    if (list.length > 12) console.log(`     … e altri ${list.length - 12}`);
  }
}

console.log(`copy-audit — ${apps.length} app, rubrica de-AI + voce istituzionale + tipografia`);
report('HARD — devono essere zero', hard);
if (!hardOnly) report('SOFT — segni da guardare uno per uno', soft);

console.log(
  `\n⚠️  Il gate trova i SEGNI, non giudica il tono. Una riga che passa non è per questo scritta bene.`,
);
process.exit(hard.length > 0 ? 2 : 0);
