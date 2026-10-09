#!/usr/bin/env node
/**
 * provenance-count — conta i file di asset e i record di provenance, per app.
 *
 * In vetrina c'erano tre numeri scritti a mano e tutti e tre sbagliati: «11 su
 * 11» erano i record presentati come file, «35 asset su 113» non corrisponde a
 * nessuna delle due letture, e «sette clip» ne ignorava cinque. Un numero
 * ricopiato a mano in due sezioni diverge dalla realtà al primo asset nuovo.
 *
 * Qui si contano **due cose diverse**, e si dicono con il loro nome:
 *   · i FILE di immagine o video sotto `src/assets/generated/`;
 *   · i RECORD nei `provenance*.json`, distinti fra stock e generati.
 * La differenza fra i due è il buco del registro, ed è il numero che conta.
 *
 * Scrive `apps/factory-showcase/src/data/provenance.json`, che la vetrina legge.
 * Uso: `pnpm provenance:count`.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const MEDIA = /\.(png|jpe?g|webp|avif|gif|svg|mp4|mov|webm)$/i;

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** I provenance hanno due forme in giro per il repo: una lista di record, o
 *  `{tool, slots:[…]}`. Si leggono entrambe invece di normalizzarle a forza. */
function recordsOf(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.slots)) {
    return json.slots.map((s) => ({ ...s, type: s.type || (json.tool ? 'generated' : 'unknown'), tool: json.tool }));
  }
  return [];
}

const apps = readdirSync('apps').filter((a) => {
  try { return statSync(join('apps', a, 'src/assets/generated')).isDirectory(); } catch { return false; }
});

const rows = [];
for (const app of apps) {
  const base = join('apps', app, 'src/assets/generated');
  const all = walk(base);
  const files = all.filter((p) => MEDIA.test(p)).length;
  let stock = 0, generated = 0;
  for (const p of all.filter((p) => /provenance[^/]*\.json$/i.test(p))) {
    for (const r of recordsOf(JSON.parse(readFileSync(p, 'utf8')))) {
      if (String(r.type).toLowerCase() === 'stock' || String(r.source).toLowerCase() === 'pexels') stock++;
      else generated++;
    }
  }
  rows.push({ app, files, records: stock + generated, stock, generated });
}

// Le clip stanno fuori da src/assets: vivono in public/media con il loro registro.
let clips = 0, clipRecords = 0;
for (const app of readdirSync('apps')) {
  const media = join('apps', app, 'public/media');
  const all = walk(media);
  // Si conta la clip, non le sue versioni: `x.mp4` e `x.loop.mp4` sono la
  // stessa clip, ricucita. Il registro ne tiene una.
  const names = new Set(all.filter((p) => /\.(mp4|mov|webm)$/i.test(p))
    .map((p) => p.split('/').pop().replace(/\.loop(?=\.[a-z0-9]+$)/i, '')));
  clips += names.size;
  for (const p of all.filter((p) => /provenance\.video[^/]*\.json$/i.test(p))) {
    clipRecords += recordsOf(JSON.parse(readFileSync(p, 'utf8'))).length;
  }
}

const tot = (k) => rows.reduce((s, r) => s + r[k], 0);
const senzaRegistro = rows.filter((r) => r.records < r.files);
const doc = {
  contato: new Date().toISOString().slice(0, 10),
  come: 'file multimediali sotto apps/*/src/assets/generated/ contro i record nei provenance*.json; le clip sono contate a parte, in public/media',
  perche:
    'I numeri in pagina erano scritti a mano e divergevano dalla realtà: «11 su 11» erano record presentati come file, e «35 su 113» non corrispondeva a nessuna delle due letture. Qui si contano file e record separatamente, e la differenza è il buco del registro.',
  totali: {
    file: tot('files'),
    record: tot('records'),
    stock: tot('stock'),
    generati: tot('generated'),
    fileSenzaRecord: rows.reduce((s, r) => s + Math.max(0, r.files - r.records), 0),
    clip: clips,
    clipConRecord: clipRecords,
  },
  senzaRegistro: senzaRegistro.map((r) => ({ app: r.app, file: r.files, record: r.records })),
  perApp: rows,
};

const out = 'apps/factory-showcase/src/data/provenance.json';
writeFileSync(out, JSON.stringify(doc, null, 2) + '\n');
console.log(`${rows.length} app · ${doc.totali.file} file · ${doc.totali.record} record ` +
  `(${doc.totali.stock} stock, ${doc.totali.generati} generati) · ${doc.totali.fileSenzaRecord} file senza record`);
console.log(`clip: ${clips}, con record ${clipRecords}`);
for (const r of senzaRegistro) console.log(`  ⚠ ${r.app}: ${r.records} record su ${r.files} file`);
console.log(`→ ${out}`);
