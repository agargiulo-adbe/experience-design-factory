#!/usr/bin/env node
/**
 * tracked-leaks-audit — il gate che impedisce di pubblicare materiale riservato.
 *
 * `agargiulo-adbe/experience-design-factory` è un repository PUBBLICO: ogni file
 * tracciato è leggibile da chiunque su raw.githubusercontent.com, senza login.
 * Tre volte, nel giro del 9 ottobre 2026, materiale riservato è finito lì dentro
 * per tre vie diverse — e nessuna delle tre era «un nome in un documento»:
 *
 *   1. due pagine di dossier con il renderer copiato nell'app e il CONTENUTO
 *      scritto nel file `.astro`, quindi compilato nel bundle e pubblicato;
 *   2. una migrazione tracciata che portava dentro di sé il seed di un dossier,
 *      con otto persone del cliente e l'URL del loro profilo LinkedIn;
 *   3. lo slug di una riga `restricted_docs` col cognome del referente, stampato
 *      nell'HTML pubblico dal wrapper (il gate protegge il contenuto, non la
 *      pagina che lo va a prendere).
 *
 * Questo script cerca le FORME, non i nomi: un elenco di cognomi dentro un repo
 * pubblico sarebbe esattamente il problema che vuole evitare. I nomi stanno in
 * `docs/.names-watchlist.txt`, git-ignorato: se il file c'è lo usa, se non c'è
 * lo dice e va avanti.
 *
 * Uso: `pnpm audit:leaks` · esce 1 al primo rilievo.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const findings = [];
const add = (file, what) => findings.push({ file, what });

const TEXT = /\.(md|sql|astro|ts|tsx|js|mjs|json|yml|yaml|css|html|txt)$/;
const textFiles = tracked.filter((f) => TEXT.test(f) && existsSync(f));

// ── 1 · profili di persone ────────────────────────────────────────────────
// Un URL di profilo LinkedIn in un file tracciato è un dato personale di una
// persona identificabile, pubblicato sul dominio di un repo che porta un
// marchio aziendale. Vive nel dossier dietro il gate, non qui.
for (const f of textFiles) {
  const txt = readFileSync(f, 'utf8');
  const m = txt.match(/linkedin\.com\/in\/[A-Za-z0-9._-]+/g);
  if (m) add(f, `${m.length} URL di profilo LinkedIn`);
}

// ── 2 · seed di dossier dentro una migrazione tracciata ───────────────────
// Una migrazione tracciata porta SCHEMA e POLICY. Il contenuto di un dossier
// sta in `docs/<Cliente>/`, git-ignorata, e nel database.
for (const f of tracked.filter((f) => f.startsWith('supabase/migrations/') && f.endsWith('.sql'))) {
  if (!existsSync(f)) continue;
  const txt = readFileSync(f, 'utf8');
  if (/insert\s+into\s+public\.restricted_docs/i.test(txt) && txt.includes('$doc$')) {
    add(f, 'seed di `restricted_docs` dentro una migrazione tracciata');
  }
}

// ── 3 · renderer del dossier copiato dentro un'app ────────────────────────
// Il motore è uno: `@edf/core/blocks/doc/DossierPage.astro`. Una pagina di
// dossier che non lo importa sta rendendo il contenuto da sé — e quel
// contenuto, allora, sta nel bundle statico.
for (const f of tracked.filter((f) => /\/src\/pages\/dossier[^/]*\.astro$/.test(f))) {
  if (!existsSync(f)) continue;
  const txt = readFileSync(f, 'utf8');
  if (!txt.includes('DossierPage')) {
    add(f, 'pagina di dossier che NON usa il motore condiviso (contenuto nel bundle)');
  }
}

// ── 4 · lo slug del dossier non prende il nome di una persona ─────────────
// `docSlug` finisce nell'HTML pubblico. Deve essere il nome dell'experience.
for (const f of tracked.filter((f) => /\/src\/pages\/dossier[^/]*\.astro$/.test(f))) {
  if (!existsSync(f)) continue;
  const txt = readFileSync(f, 'utf8');
  const slug = txt.match(/docSlug="([^"]+)"/)?.[1];
  const app = f.split('/')[1];
  if (slug && !slug.startsWith(app.split('-')[0])) {
    add(f, `docSlug "${slug}" non parte dal nome dell'experience "${app}" — da verificare a mano`);
  }
}

// ── 5 · la watchlist dei cognomi, se c'è ──────────────────────────────────
const WATCH = 'docs/.names-watchlist.txt';
let watchNote = `nessuna watchlist (${WATCH} assente): il controllo sui cognomi non è stato fatto`;
if (existsSync(WATCH)) {
  const names = readFileSync(WATCH, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
  let hits = 0;
  let allowed = 0;
  for (const f of textFiles) {
    const txt = readFileSync(f, 'utf8');
    // Il nome di una persona si può citare come AUTORE di una frase pubblica,
    // con la fonte accanto: quella è un'attribuzione, non un ritratto. Ma
    // l'eccezione si DICHIARA nel file, non la si indovina da un'euristica —
    // il marcatore sotto va messo a mano, così ogni eccezione è una scelta
    // visibile in diff e non un effetto collaterale di una regex.
    const declared = txt.includes('leaks-audit: attribuzione pubblica');
    const found = names.filter((n) => txt.includes(n));
    if (!found.length) continue;
    if (declared) { allowed++; continue; }
    add(f, `${found.length} cognome/i in watchlist, senza il marcatore «leaks-audit: attribuzione pubblica»`);
    hits++;
  }
  watchNote = `watchlist: ${names.length} nomi · ${hits} file da sistemare · ${allowed} attribuzioni dichiarate`;
}

// ── esito ─────────────────────────────────────────────────────────────────
console.log(`${textFiles.length} file tracciati esaminati · ${watchNote}`);
if (!findings.length) {
  console.log('PASS — nessuna fuga strutturale nei file tracciati');
  process.exit(0);
}
console.log(`FAIL — ${findings.length} rilievi:`);
for (const { file, what } of findings) console.log(`  · ${file}\n      ${what}`);
process.exit(1);
