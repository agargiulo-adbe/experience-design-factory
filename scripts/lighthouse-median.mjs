#!/usr/bin/env node
/**
 * lighthouse-median — la serie di Lighthouse che si può rifare.
 *
 * In pagina c'era una serie di punteggi senza il modo di riprodurla. Rigirata
 * il 3 ottobre 2026, lo stesso URL oscillava fino a 35 punti (Poste 64→98,
 * UniCredit 66→98): «solo UniCredit è sopra 90» si ribaltava da sé. Un numero
 * che oscilla così non è una misura, è un aneddoto.
 *
 * Quindi: tre giri per URL, si tiene la MEDIANA, e il risultato finisce in un
 * file nel repository con data, versione di Lighthouse e condizioni — così chi
 * legge la pagina può rifare esattamente la stessa misura.
 *
 * Uso:
 *   node scripts/lighthouse-median.mjs                 # il sito pubblicato
 *   node scripts/lighthouse-median.mjs --runs 5
 *   node scripts/lighthouse-median.mjs --base http://localhost:7731/experience-design-factory
 *
 * Scrive `apps/factory-showcase/src/data/lighthouse.json`, che la vetrina legge.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? dflt : argv[i + 1];
};

const BASE = flag('base', 'https://agargiulo-adbe.github.io/experience-design-factory');
const RUNS = Number(flag('runs', 3));

// Le pagine misurate sono le HOME: è la prima cosa che si apre, porta gli
// sfondi più pesanti e il runtime del deck intero.
const TARGETS = [
  ['vetrina', 'showcase/'],
  ['hub', ''],
  ['UniCredit', 'unicredit-engagement/'],
  ['Max Mara', 'generazioni-maxmara/'],
  ['Ferrari', 'ferrari-racing/'],
  ['FS Group', 'trenitalia-connessioni/'],
  ['Agos', 'agos-trait-dunion/'],
  ['Poste', 'poste-sei-domande/'],
  ['Isybank', 'isybank-momento/'],
  ['MIM', 'mim-alfabeti/'],
  ['Eni', 'eni-orbita/'],
  ['Intesa', 'intesa-scala-umana/'],
  ['Atelier', 'atelier/'],
];

const CATS = ['performance', 'accessibility', 'best-practices', 'seo'];
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[(s.length - 1) >> 1];
};

const dir = mkdtempSync(join(tmpdir(), 'lh-'));
const results = [];

for (const [label, path] of TARGETS) {
  const url = `${BASE}/${path}`;
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const out = join(dir, `${label.replace(/\W/g, '')}-${i}.json`);
    try {
      execFileSync(
        'npx',
        ['-y', 'lighthouse@12', url,
          '--quiet', '--output=json', `--output-path=${out}`,
          '--only-categories=' + CATS.join(','),
          '--form-factor=desktop', '--screenEmulation.disabled',
          '--throttling-method=simulate',
          '--chrome-flags=--headless=new --no-sandbox --disable-gpu'],
        { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' },
      );
      const j = JSON.parse(readFileSync(out, 'utf8'));
      runs.push(Object.fromEntries(CATS.map((c) => [c, Math.round((j.categories[c]?.score ?? 0) * 100)])));
    } catch (e) {
      console.error(`  ✗ ${label} giro ${i + 1}: ${String(e.message).split('\n')[0]}`);
    }
  }
  if (!runs.length) { console.error(`✗ ${label}: nessun giro riuscito`); continue; }
  const row = { label, url, runs: runs.length };
  for (const c of CATS) row[c] = median(runs.map((r) => r[c]));
  row.spread = Object.fromEntries(
    CATS.map((c) => [c, Math.max(...runs.map((r) => r[c])) - Math.min(...runs.map((r) => r[c]))]),
  );
  results.push(row);
  console.log(
    `${label.padEnd(10)} perf ${String(row.performance).padStart(3)} ` +
    `(oscilla ${row.spread.performance})  a11y ${String(row.accessibility).padStart(3)}  ` +
    `bp ${String(row['best-practices']).padStart(3)}  seo ${String(row.seo).padStart(3)}`,
  );
}

const doc = {
  misurato: new Date().toISOString().slice(0, 10),
  come: `mediana di ${RUNS} giri per URL`,
  strumento: 'Lighthouse 12 via npx, Chrome headless',
  condizioni: 'form factor desktop, emulazione schermo disattivata, throttling simulato, rete di casa',
  perche:
    "Un singolo giro di Lighthouse su queste pagine oscilla di decine di punti: la serie che stava in pagina non era riproducibile. Qui c'è la mediana di più giri, con l'oscillazione misurata accanto, così si sa quanto vale il numero.",
  base: BASE,
  pagine: results,
};
const out = 'apps/factory-showcase/src/data/lighthouse.json';
writeFileSync(out, JSON.stringify(doc, null, 2) + '\n');
console.log(`\n→ ${out} (${results.length} pagine, mediana di ${RUNS} giri)`);
