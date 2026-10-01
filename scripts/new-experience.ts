/**
 * new-experience — da una decisione a una skin COSTRUIBILE e AUDIT-CLEAN, in un comando.
 *
 *   pnpm new:experience --slug <kebab> --name "<Nome>" --client "<Cliente>" \
 *     --type <prospettiva|storia|blueprint|playbook> [--accent #hex] [--lang it|bilingual] [--dry-run]
 *
 * Fa due cose, entrambe idempotenti:
 *  (a) copia `templates/experience/` in `apps/<slug>/` espandendo i segnaposto
 *      (`__SLUG__`, `__NAME__`, …) e genera una pagina per ogni capitolo dello
 *      scheletro del tipo (`EXPERIENCE_TYPES[type].skeleton`), l'ultima con la
 *      slide-firma;
 *  (b) registra l'app dove un'app nuova DEVE essere registrata: deploy.yml (merge +
 *      verifica), hub, showcase, package.json di radice (dev:<slug> + audit:deck:all),
 *      scripts/deck-audit.ts (ROUTE_SETS + CWD_ALIAS) e una migrazione seed Supabase.
 *      Ogni modifica è chirurgica (ancore nel testo, formattazione preservata) e
 *      rilanciare con lo stesso slug non duplica nulla.
 *
 * Quello che resta UMANO lo stampa alla fine: leggere il design system vero del
 * cliente (`pnpm brand:tokens`), l'SVG ufficiale del marchio, le personas, CLAUDE.md,
 * la migrazione da applicare. `--dry-run` stampa ogni modifica senza scrivere.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXPERIENCE_TYPES, type ExperienceType } from '../packages/core/src/data/experienceTypes';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEMPLATE_DIR = path.join(ROOT, 'templates', 'experience');
const CLIENT_TYPES: ExperienceType[] = ['prospettiva', 'storia', 'blueprint', 'playbook'];
const DEFAULT_ACCENT = '#2563eb';

// ── CLI ──────────────────────────────────────────────────────────────────
function usage(msg?: string): never {
  if (msg) console.error(`\n✗ ${msg}\n`);
  console.error(
    'Uso: pnpm new:experience --slug <kebab> --name "<Nome>" --client "<Cliente>" ' +
      '--type <prospettiva|storia|blueprint|playbook> [--accent #hex] [--lang it|bilingual] [--dry-run]',
  );
  process.exit(2);
}

function parseArgs(argv: string[]) {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) usage(`argomento inatteso: ${a}`);
    const eq = a.indexOf('=');
    if (eq !== -1) { out[a.slice(2, eq)] = a.slice(eq + 1); continue; }
    const key = a.slice(2);
    if (key === 'dry-run' || key === 'help') { out[key] = true; continue; }
    const v = argv[i + 1];
    if (v === undefined || v.startsWith('--')) usage(`--${key} richiede un valore`);
    out[key] = v; i++;
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) usage();
const slug = String(args.slug ?? '');
const name = String(args.name ?? '').trim();
const client = String(args.client ?? '').trim();
const typeId = String(args.type ?? '') as ExperienceType;
const accent = String(args.accent ?? DEFAULT_ACCENT).trim().toLowerCase();
const langMode = String(args.lang ?? 'bilingual');
const dryRun = args['dry-run'] === true;

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) usage('--slug deve essere kebab-case (es. acme-prospettiva)');
if (!name) usage('--name mancante');
if (!client) usage('--client mancante');
if (!CLIENT_TYPES.includes(typeId)) usage(`--type deve essere uno di: ${CLIENT_TYPES.join(' | ')}`);
if (!/^#[0-9a-f]{6}$/.test(accent)) usage('--accent deve essere un esadecimale a 6 cifre (es. #007a91)');
if (langMode !== 'it' && langMode !== 'bilingual') usage('--lang deve essere `it` o `bilingual`');

const type = EXPERIENCE_TYPES[typeId];
if (!type.skeleton.length) usage(`il tipo «${typeId}» non ha uno scheletro di capitoli`);

// ── Colore: derivati dell'accento che reggono WCAG AA ───────────────────
type RGB = [number, number, number];
const hexToRgb = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgbToHex = (c: RGB) => '#' + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const lum = ([r, g, b]: RGB) => {
  const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a: RGB, b: RGB) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const WHITE: RGB = [255, 255, 255];
const INK: RGB = hexToRgb('#1b1d21');
const NIGHT: RGB = hexToRgb('#111318');
/** Sposta `c` verso `toward` finché il contrasto con `against` regge 4.5:1 (minimo `floor` di spostamento). */
function reach(c: RGB, toward: RGB, against: RGB, floor: number): RGB {
  let t = floor;
  let out = mix(c, toward, t);
  while (contrast(out, against) < 4.5 && t < 1) { t = Math.min(1, t + 0.04); out = mix(c, toward, t); }
  return out;
}
const accentRgb = hexToRgb(accent);
const accentDeep = rgbToHex(reach(accentRgb, [0, 0, 0], WHITE, 0.15));   // inchiostro d'accento su chiaro, hover
const accentSoft = rgbToHex(reach(accentRgb, WHITE, NIGHT, 0.25));       // inchiostro d'accento su scuro
const onAccent = contrast(WHITE, accentRgb) >= contrast(INK, accentRgb) ? '#ffffff' : '#1b1d21';
const onAccentOk = contrast(hexToRgb(onAccent), accentRgb) >= 4.5;
const ctaBg = onAccentOk ? accent : accentDeep;                            // bottone pieno: accento o accento scurito
const onCta = onAccentOk ? onAccent : '#ffffff';

// ── Dati derivati ─────────────────────────────────────────────────────────
const chapters = type.skeleton.map((c, i) => ({ slug: c.slug, num: String(i + 1).padStart(2, '0'), title: c.title }));
const n = chapters.length;
const langs: Array<'it' | 'en'> = langMode === 'it' ? ['it'] : ['it', 'en'];
const today = new Date().toISOString().slice(0, 10);

/** Colonne della roadmap: griglia bilanciata, mai un'ultima riga zoppa (regola CLAUDE.md). */
function balancedCols(count: number): number {
  if (count <= 5) return count;
  for (const c of [3, 4, 5]) if (count % c === 0) return c;
  return Math.ceil(count / 2);
}

const jsStr = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const sqlStr = (s: string) => `'${s.replace(/'/g, "''")}'`;
const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const chaptersLiteral = chapters
  .map((c) => `  { slug: ${jsStr(c.slug)}, num: '${c.num}', title: { it: ${jsStr(c.title.it)}, en: ${jsStr(c.title.en)} } },`)
  .join('\n');

const pageRegistry = [
  `  { slug: 'index', label: ${jsStr(`${name} (00)`)}, slides: [`,
  `    { id: 'slide-cover',    label: ${jsStr(`Cover — ${name}`)} },`,
  `    { id: 'slide-percorso', label: ${jsStr(`Il percorso — ${n} capitoli`)} },`,
  `  ]},`,
  ...chapters.flatMap((c, i) => [
    `  { slug: ${jsStr(c.slug)}, label: ${jsStr(`${c.title.it} (${c.num})`)}, slides: [`,
    `    { id: 'slide-cover',     label: ${jsStr(`Cover — ${c.title.it}`)} },`,
    `    { id: 'slide-contenuto', label: ${jsStr(`${c.title.it} — contenuto`)} },`,
    ...(i === n - 1 ? [`    { id: 'slide-signature', label: ${jsStr(`La firma — Adobe × ${client}`)} },`] : []),
    `  ]},`,
  ]),
].join('\n');

const VARS: Record<string, string> = {
  __SLUG__: slug,
  __NAME__: name,
  __CLIENT__: client,
  __TYPE__: typeId,
  __ACCENT__: accent,
  __ACCENT_RGB__: accentRgb.join(', '),
  __ACCENT_DEEP__: accentDeep,
  __ACCENT_SOFT__: accentSoft,
  __ON_ACCENT__: onAccent,
  __CTA_BG__: ctaBg,
  __ON_CTA__: onCta,
  __LANGS__: `[${langs.map((l) => `'${l}'`).join(', ')}]`,
  __DEFAULT_LANG__: 'it',
  __DATE__: today,
  __ROADMAP_COLS__: String(balancedCols(n)),
  __CHAPTERS__: chaptersLiteral,
  __PAGE_REGISTRY__: pageRegistry,
  __PAGES_LIST__: chapters.map((c) => `'${c.slug}'`).join(', '),
  __FIRST_CHAPTER__: chapters[0].slug,
  __APPEARS_IN__: chapters.map((c) => jsStr(c.title.it)).join(', '),
};

function expand(text: string, vars: Record<string, string>, where: string): string {
  const out = text.replace(/__[A-Z][A-Z0-9_]*__/g, (m) => (m in vars ? vars[m] : m));
  const left = out.match(/__[A-Z][A-Z0-9_]*__/g);
  if (left) throw new Error(`segnaposto non espansi in ${where}: ${[...new Set(left)].join(', ')}`);
  return out;
}

// ── Piano delle scritture ─────────────────────────────────────────────────
type Write = { file: string; content: string; kind: 'create' | 'edit'; note: string; snippet?: string };
const plan: Write[] = [];
const notes: string[] = [];
const rel = (p: string) => path.relative(ROOT, p);

// (a) la skin
const appDir = path.join(ROOT, 'apps', slug);
if (existsSync(appDir)) {
  if (!dryRun) usage(`apps/${slug} esiste già: il generatore non sovrascrive una skin. Rimuoverla o scegliere un altro slug.`);
  notes.push(`apps/${slug} esiste già — con --dry-run mostro comunque il piano`);
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

for (const src of walk(TEMPLATE_DIR)) {
  const r = path.relative(TEMPLATE_DIR, src);
  if (r.endsWith('.tpl')) continue;
  const content = expand(readFileSync(src, 'utf8'), VARS, `templates/experience/${r}`);
  plan.push({ file: path.join(appDir, r), content, kind: 'create', note: 'dal template' });
}

const chapterTpl = readFileSync(path.join(TEMPLATE_DIR, 'src/pages/_chapter.astro.tpl'), 'utf8');
const signatureTpl = readFileSync(path.join(TEMPLATE_DIR, 'src/pages/_signature.partial.tpl'), 'utf8');
const coverLead = (i: number) => {
  if (i === 0) return {
    it: 'Il primo capitolo apre la porta: dice al cliente da dove si parte e perché vale la pena girare pagina. Una frase sola, con le sue parole.',
    en: 'The first chapter opens the door: it tells the client where we start and why the next page is worth turning. One sentence, in their own words.',
  };
  if (i === n - 1) return {
    it: 'L’ultimo capitolo chiude il percorso: cosa resta sul tavolo e chi decide. Dopo c’è solo la firma.',
    en: 'The last chapter closes the path: what stays on the table and who decides. After it, only the signature.',
  };
  return {
    it: 'Questa copertina apre il capitolo. Una frase che dica cosa si trova nelle slide che seguono, con le parole del cliente.',
    en: 'This cover opens the chapter. One sentence saying what the following slides hold, in the client’s own words.',
  };
};
chapters.forEach((c, i) => {
  const isLast = i === n - 1;
  const lead = coverLead(i);
  const chVars: Record<string, string> = {
    ...VARS,
    __CH_SLUG__: c.slug,
    __CH_COVER_LEAD_IT__: attr(lead.it),
    __CH_COVER_LEAD_EN__: attr(lead.en),
    __CH_FRONTMATTER_EXTRA__: isLast
      ? [
          "import CoBrand from '../components/CoBrand.astro';",
          "import { EXPERIENCE_TYPES } from '@edf/core/data/experienceTypes';",
          "import { SITE } from '../data/site';",
          'const type = EXPERIENCE_TYPES[SITE.type];',
          'const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);',
        ].join('\n')
      : '',
    __SIGNATURE_SLIDE__: isLast ? signatureTpl.replace(/\n$/, '') : '',
  };
  const content = expand(chapterTpl, chVars, `pagina ${c.slug}`).replace(/\n{3,}/g, '\n\n');
  plan.push({ file: path.join(appDir, 'src/pages', `${c.slug}.astro`), content, kind: 'create', note: `capitolo ${c.num} · ${c.title.it}` });
});

// (b) registrazioni — ognuna legge il file, decide se ha già la riga, e ritorna il nuovo testo
function register(file: string, note: string, fn: (text: string) => { text: string; snippet: string } | null) {
  const abs = path.join(ROOT, file);
  const text = readFileSync(abs, 'utf8');
  const res = fn(text);
  if (!res) { notes.push(`${file}: già registrata, nessuna modifica`); return; }
  plan.push({ file: abs, content: res.text, kind: 'edit', note, snippet: res.snippet });
}

// deploy.yml — blocco di merge + lista di verifica
register('.github/workflows/deploy.yml', 'merge del dist + verifica index.html', (text) => {
  const marker = `pages/${slug}/index.html`;
  if (text.includes(marker)) return null;
  const cpRe = /^( {10})cp -r apps\/[^/\n]+\/dist\/\. pages\/[^/\n]+\/\n/gm;
  let lastEnd = -1, indent = '          ';
  for (const m of text.matchAll(cpRe)) { lastEnd = m.index! + m[0].length; indent = m[1]; }
  if (lastEnd === -1) throw new Error('deploy.yml: non trovo il blocco di merge dei dist');
  const block = `${indent}mkdir -p pages/${slug}\n${indent}cp -r apps/${slug}/dist/. pages/${slug}/\n`;
  let out = text.slice(0, lastEnd) + block + text.slice(lastEnd);
  const forRe = /(for f in [^\n]*?)(; do)/;
  if (!forRe.test(out)) throw new Error('deploy.yml: non trovo la lista `for f in … ; do`');
  out = out.replace(forRe, (_m, a: string, b: string) => `${a} ${marker}${b}`);
  return { text: out, snippet: `mkdir -p pages/${slug}\ncp -r apps/${slug}/dist/. pages/${slug}/\n+ ${marker} nella lista di verifica` };
});

// hub — una card
register('apps/factory-hub/src/pages/index.astro', 'card nella landing della Factory', (text) => {
  const marker = `href: \`\${b}${slug}/\``;
  if (text.includes(marker)) return null;
  const anchor = '\n];\n\nconst secondary';
  const i = text.indexOf(anchor);
  if (i === -1) throw new Error('hub index.astro: non trovo la fine dell’array `experiences`');
  const tagline = `${type.question.it} Scheletro «${type.label.it}» generato il ${today}, da scrivere con il brief.`;
  const card = [
    '  {',
    `    name: ${jsStr(name)},`,
    `    client: ${jsStr(client)},`,
    `    accent: '${accent}',`,
    `    tagline: ${jsStr(tagline)},`,
    `    type: ${jsStr(type.label.it)},`,
    `    ${marker},`,
    '  },',
  ].join('\n');
  return { text: text.slice(0, i) + '\n' + card + text.slice(i), snippet: card };
});

// showcase — registry data-driven (defaultPublished: false → fail-closed)
register('apps/factory-showcase/src/data/experiences.ts', 'voce del registry dello showcase', (text) => {
  if (new RegExp(`slug: ${jsStr(slug).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},`).test(text)) return null;
  const start = text.indexOf('export const EXPERIENCES: Experience[] = [');
  const end = text.indexOf('\n];', start);
  if (start === -1 || end === -1) throw new Error('experiences.ts: non trovo l’array EXPERIENCES');
  const langTag = langs.length > 1 ? 'IT/EN' : 'IT';
  const entry = [
    '  {',
    `    slug: ${jsStr(slug)},`,
    `    name: ${jsStr(name)},`,
    `    client: ${jsStr(client)},`,
    `    type: ${jsStr(typeId)},`,
    `    brandLabel: ${jsStr(client)},`,
    `    url: \`\${LIVE}/${slug}/\`,`,
    `    shot: 'shots/${slug}.webp',`,
    `    accent: '${accent}',`,
    `    sections: ${n},`,
    '    defaultPublished: false,',
    '    tag: {',
    `      en: ${jsStr(`${n} chapters · ${langTag} · scaffold`)},`,
    `      it: ${jsStr(`${n} capitoli · ${langTag} · scaffold`)},`,
    '    },',
    '    desc: {',
    `      en: ${jsStr(`Generated from the «${type.label.en}» skeleton: ${n} chapters, a cover and a signature. Copy and design system still come from the brief.`)},`,
    `      it: ${jsStr(`Generata dallo scheletro «${type.label.it}»: ${n} capitoli, una copertina e una firma. Copy e design system arrivano ancora dal brief.`)},`,
    '    },',
    '  },',
  ].join('\n');
  return { text: text.slice(0, end) + '\n' + entry + text.slice(end), snippet: entry };
});

// package.json di radice — dev:<slug> + audit:deck:all (il file fa round-trip esatto con JSON.stringify)
register('package.json', 'script dev:<slug> + audit:deck:all', (text) => {
  const pkg = JSON.parse(text) as { scripts: Record<string, string> };
  const devKey = `dev:${slug}`;
  const auditCmd = `pnpm --filter ${slug} audit:deck`;
  const hasDev = devKey in pkg.scripts;
  const hasAudit = (pkg.scripts['audit:deck:all'] ?? '').includes(auditCmd);
  if (hasDev && hasAudit) return null;
  const scripts: Record<string, string> = {};
  const keys = Object.keys(pkg.scripts);
  const lastDev = keys.filter((k) => k.startsWith('dev')).pop();
  for (const k of keys) {
    scripts[k] = pkg.scripts[k];
    if (!hasDev && k === lastDev) scripts[devKey] = `pnpm --filter ${slug} dev`;
  }
  if (!hasAudit) scripts['audit:deck:all'] = `${scripts['audit:deck:all']} && ${auditCmd}`;
  pkg.scripts = scripts;
  return { text: JSON.stringify(pkg, null, 2) + '\n', snippet: `"${devKey}": "pnpm --filter ${slug} dev"\n"audit:deck:all": … && ${auditCmd}` };
});

// deck-audit.ts — ROUTE_SETS + CWD_ALIAS
register('scripts/deck-audit.ts', 'ROUTE_SETS (ogni rotta) + CWD_ALIAS', (text) => {
  const routeKey = `  ${jsStr(slug)}: [`;
  const aliasLine = `  ${jsStr(slug)}: ${jsStr(slug)},`;
  const hasRoutes = text.includes(routeKey);
  const hasAlias = text.includes(aliasLine);
  if (hasRoutes && hasAlias) return null;
  let out = text;
  const pad = Math.max('home'.length, ...chapters.map((c) => c.slug.length)) + 1;
  const routes = [
    routeKey,
    `    { name: ${('\'home\',').padEnd(pad + 3)} route: '/experience-design-factory/${slug}/' },`,
    ...chapters.map((c) => `    { name: ${(jsStr(c.slug) + ',').padEnd(pad + 3)} route: '/experience-design-factory/${slug}/${c.slug}/' },`),
    '  ],',
  ].join('\n');
  if (!hasRoutes) {
    const s = out.indexOf('const ROUTE_SETS');
    const e = out.indexOf('\n};', s);
    if (s === -1 || e === -1) throw new Error('deck-audit.ts: non trovo ROUTE_SETS');
    out = out.slice(0, e) + '\n' + routes + out.slice(e);
  }
  if (!hasAlias) {
    const s = out.indexOf('const CWD_ALIAS');
    const e = out.indexOf('\n};', s);
    if (s === -1 || e === -1) throw new Error('deck-audit.ts: non trovo CWD_ALIAS');
    out = out.slice(0, e) + '\n' + aliasLine + out.slice(e);
  }
  return { text: out, snippet: `${routes}\n${aliasLine}` };
});

// migrazione seed — numero libero successivo, modellata su 0015
{
  const migDir = path.join(ROOT, 'supabase', 'migrations');
  const files = readdirSync(migDir);
  const existing = files.find((f) => f.includes(`_seed_${slug.replace(/-/g, '_')}.sql`));
  if (existing) notes.push(`supabase/migrations/${existing}: esiste già, non la riscrivo`);
  else {
    const max = files.map((f) => /^(\d{4})_/.exec(f)?.[1]).filter(Boolean).map(Number).reduce((a, b) => Math.max(a, b), 0);
    const num = String(max + 1).padStart(4, '0');
    const description = `${type.question.it} ${type.label.it} per ${client}: scheletro generato il ${today}, da scrivere con il brief.`;
    const sql = [
      '-- ════════════════════════════════════════════════════════════════════',
      `--  ${num} · seed «${name}» (${client}) into the Console registry`,
      '--  Registers the experience (card in Super Admin, FK for restricted_docs).',
      '--  Starts as DRAFT and OFF the showcase (show_in_showcase=false): switching',
      '--  it on makes it public on a page without login — a human decision.',
      `--  Generated by \`pnpm new:experience\` on ${today}. Idempotent.`,
      '--  Apply once (human action): supabase db query --linked',
      '-- ════════════════════════════════════════════════════════════════════',
      '',
      'insert into public.experiences (slug, name, client, description, base_url, status, show_in_showcase, type)',
      'values (',
      `  ${sqlStr(slug)},`,
      `  ${sqlStr(name)},`,
      `  ${sqlStr(client)},`,
      `  ${sqlStr(description)},`,
      `  ${sqlStr(`/experience-design-factory/${slug}/`)},`,
      "  'draft',",
      '  false,',
      `  ${sqlStr(typeId)}`,
      ')',
      'on conflict (slug) do update',
      '   set name             = excluded.name,',
      '       client           = excluded.client,',
      '       description      = excluded.description,',
      '       base_url         = excluded.base_url,',
      '       status           = excluded.status,',
      '       show_in_showcase = excluded.show_in_showcase,',
      '       type             = excluded.type,',
      '       updated_at       = now();',
      '',
    ].join('\n');
    plan.push({ file: path.join(migDir, `${num}_seed_${slug.replace(/-/g, '_')}.sql`), content: sql, kind: 'create', note: 'seed del registry Console' });
  }
}

// ── Esecuzione ────────────────────────────────────────────────────────────
const creates = plan.filter((w) => w.kind === 'create');
const edits = plan.filter((w) => w.kind === 'edit');

console.log(`\n${dryRun ? '[dry-run] ' : ''}new:experience · ${name} · Adobe × ${client} · tipo ${type.label.it} · ${n} capitoli`);
console.log(`  accento ${accent} → deep ${accentDeep} · soft ${accentSoft} · cta ${ctaBg}/${onCta} · lingue ${langs.join('/')}`);
console.log(`\nFile creati (${creates.length}):`);
for (const w of creates) console.log(`  + ${rel(w.file)}  — ${w.note}`);
console.log(`\nFile condivisi modificati (${edits.length}):`);
for (const w of edits) {
  console.log(`  ~ ${rel(w.file)}  — ${w.note}`);
  if (dryRun && w.snippet) console.log(w.snippet.split('\n').map((l) => `      ${l}`).join('\n'));
}
for (const nte of notes) console.log(`  · ${nte}`);

if (!dryRun) {
  for (const w of plan) {
    mkdirSync(path.dirname(w.file), { recursive: true });
    writeFileSync(w.file, w.content);
  }
}

console.log(`
Resta da fare a mano (nell'ordine):
  1. pnpm install                      → collega il workspace apps/${slug}
  2. pnpm brand:tokens <url-cliente>   → leggere il design system VERO e incollare i valori
     in apps/${slug}/src/styles/global.css (colore di sistema ≠ marchio; scrivere PERCHÉ
     il carattere sostituto è stato scelto). Ricalcolare deep/soft/cta per WCAG AA.
  3. SVG ufficiale del marchio (solo quello distribuito dal cliente, a currentColor)
     in apps/${slug}/src/components/CoBrand.astro — altrimenti resta il wordmark.
  4. docs/${client}/PANEL-PERSONAS.md  → personas cieche per il panel review.
  5. CLAUDE.md → aggiungere la riga dell'app in «Experiences today» e nei Commands.
  6. supabase db query --linked < supabase/migrations/<nn>_seed_${slug.replace(/-/g, '_')}.sql
  7. apps/factory-showcase/public/shots/${slug}.webp (1200×750) quando la cover è vera;
     \`pnpm mcp:registry\` per rigenerare il registry dell'Atelier.
  8. Verifica: pnpm --filter ${slug} build && pnpm --filter ${slug} preview --port 4520
     DECK_URL=http://localhost:4520 pnpm --filter ${slug} audit:deck   (0 HARD: b c d e h j k m exp)
     poi screenshot a 1920 letti con gli occhi (apps/${slug}/scripts/shots.mjs).
`);
