#!/usr/bin/env node
/**
 * La mappa delle slide (`src/data/slides.ts`) deve corrispondere alle slide vere.
 *
 * Serve perché quella mappa alimenta due cose che si notano solo quando sono
 * sbagliate: il tab «Capitoli e slide» della Console e l'anteprima rapida. Una
 * slide aggiunta e non mappata sparisce dall'indice senza errori; una tolta e
 * non rimossa porta a una slide che non c'è.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pagesDir = join(root, 'src/pages');
const SKIP = new Set(['admin.astro', 'dossier.astro']);

const map = readFileSync(join(root, 'src/data/slides.ts'), 'utf8');
const mapped = new Map();
let slug = null;
for (const line of map.split('\n')) {
  const s = line.match(/^\s*slug: '([^']+)',/);
  if (s) { slug = s[1]; mapped.set(slug, []); continue; }
  const id = line.match(/\{ id: '([^']+)'/);
  if (id && slug) mapped.get(slug).push(id[1]);
}

let bad = 0;
for (const file of readdirSync(pagesDir).filter((f) => f.endsWith('.astro') && !SKIP.has(f))) {
  const slugName = file.replace(/\.astro$/, '');
  const src = readFileSync(join(pagesDir, file), 'utf8');
  const real = [...src.matchAll(/<Slide id="([^"]+)"/g)].map((m) => m[1]);
  const listed = mapped.get(slugName);
  if (!listed) {
    console.error(`✗ ${slugName}: la rotta esiste ma non è in slides.ts`);
    bad++; continue;
  }
  const missing = real.filter((id) => !listed.includes(id));
  const extra = listed.filter((id) => !real.includes(id));
  if (missing.length || extra.length) {
    bad++;
    console.error(`✗ ${slugName}:`);
    missing.forEach((id) => console.error(`    manca in slides.ts   → ${id}`));
    extra.forEach((id) => console.error(`    in slides.ts ma non in pagina → ${id}`));
  } else {
    console.log(`✓ ${slugName} — ${real.length} slide`);
  }
}
if (bad) { console.error(`\nFAIL — ${bad} rotta/e fuori sincrono con src/data/slides.ts`); process.exit(1); }
console.log('\nPASS — la mappa delle slide corrisponde alle slide vere');
