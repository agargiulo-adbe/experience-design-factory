#!/usr/bin/env node
/**
 * deck-audit-ci — il gate dei deck, nella forma che può stare in CI.
 *
 * Perché serve: `audit:deck` si lanciava **a mano, prima di pubblicare**, e
 * così sei fallimenti HARD sono rimasti aperti per settimane su due deck senza
 * che nessuno se ne accorgesse. Un gate che nessuno impone non è un gate.
 *
 * Due cose lo rendevano impossibile da mettere in CI, e sono risolte:
 *   1. **Serviva un preview per app.** Qui i `dist` già costruiti si uniscono
 *      in un albero solo — lo stesso che il deploy pubblica — servito da un
 *      unico server statico. Un'origine sola, tutti i percorsi veri.
 *   2. **Il totale mescolava HARD e soft.** Nessun deck del monorepo è a zero
 *      fallimenti: il residuo fisiologico è tutto soft, e farlo fallire
 *      avrebbe tinto la CI di rosso permanente — che si smette di guardare.
 *      `--hard-only` esce ≠0 solo sui HARD.
 *
 * Uso: `pnpm audit:deck:ci` (dopo `pnpm build`).
 */
import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname } from 'node:path';

// app → nome del route set in scripts/deck-audit.ts
const DECKS = [
  ['generazioni-maxmara', 'generazioni-maxmara'],
  ['unicredit-engagement', 'unicredit-engagement'],
  ['ferrari-racing', 'ferrari-racing'],
  ['trenitalia-connessioni', 'trenitalia-connessioni'],
  ['agos-trait-dunion', 'agos-trait-dunion'],
  ['atelier', 'atelier'],
  ['mim-alfabeti', 'mim-alfabeti'],
  ['isybank-momento', 'isybank-momento'],
  ['poste-sei-domande', 'poste-sei-domande'],
  ['eni-orbita', 'eni-orbita'],
  ['intesa-scala-umana', 'intesa-scala-umana'],
];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

const root = mkdtempSync(join(tmpdir(), 'deck-ci-'));
const site = join(root, 'experience-design-factory');
let staged = 0;
for (const [app] of DECKS) {
  const dist = join(process.cwd(), 'apps', app, 'dist');
  if (!existsSync(dist)) { console.error(`· ${app}: nessun dist, saltato (serve \`pnpm build\`)`); continue; }
  cpSync(dist, join(site, app), { recursive: true });
  staged++;
}
if (!staged) { console.error('Nessun dist trovato: lancia `pnpm build` prima.'); process.exit(2); }

const server = createServer(async (req, res) => {
  try {
    let p = join(root, decodeURIComponent(req.url.split('?')[0]));
    if ((await stat(p).catch(() => null))?.isDirectory()) p = join(p, 'index.html');
    const body = await readFile(p);
    // `content-length` NON è un dettaglio: senza, Node risponde in chunked e
    // il browser tiene le connessioni aperte — `waitUntil: 'networkidle'`,
    // che è come l'audit aspetta la pagina, non si assesta mai e ogni rotta
    // va in timeout. Misurato: 982ms con la lunghezza, 30s di timeout senza.
    res.writeHead(200, {
      'content-type': MIME[extname(p)] || 'application/octet-stream',
      'content-length': body.length,
    });
    res.end(body);
  } catch {
    const body = '404';
    res.writeHead(404, { 'content-type': 'text/plain', 'content-length': body.length });
    res.end(body);
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
console.log(`${staged} deck serviti da ${origin}\n`);

// ATTENZIONE: il server statico vive in QUESTO processo, quindi gli audit si
// lanciano in modo ASINCRONO. Con `execFileSync` l'event loop resta bloccato
// per tutta la durata del figlio e il server non risponde più — il browser
// aspetta, `networkidle` non arriva mai e ogni rotta va in timeout. Il sintomo
// (timeout su tutte le rotte) somiglia a un sito rotto, la causa è qui.
function runAudit(routeSet) {
  return new Promise((resolve) => {
    const ch = spawn('npx', ['tsx', 'scripts/deck-audit.ts', '--app', routeSet, '--hard-only'], {
      env: { ...process.env, DECK_URL: origin },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    ch.stdout.on('data', (d) => { out += d; });
    ch.stderr.on('data', (d) => { out += d; });
    ch.on('close', (code) => resolve({ code, out }));
  });
}

const failed = [];
for (const [app, routeSet] of DECKS) {
  if (!existsSync(join(process.cwd(), 'apps', app, 'dist'))) continue;
  process.stdout.write(`━━━ ${app} `);
  {
    const { code, out } = await runAudit(routeSet);
    // Si CONTANO le rotte auditate. «Se un PASS arriva sospettosamente in
    // fretta, contare le rotte stampate»: un gate che non guarda niente
    // stampa comunque un verde, ed è già successo due volte in questo
    // repository — una con `--only`, una con un `--app` che ricadeva in
    // silenzio su un altro deck.
    const audited = (out.match(/^━━━ /gm) || []).length;
    if (code === 0) {
      if (audited === 0) {
        console.log('→ nessuna rotta auditata: il PASS non vale, è un gate che non ha guardato niente');
        failed.push(app);
        continue;
      }
      const line = out.split('\n').find((l) => l.startsWith('PASS (--hard-only)')) || '';
      console.log(`→ ${audited} rotte · ${line.replace('PASS (--hard-only) — ', '').trim() || 'ok'}`);
      continue;
    }
    const e = { status: code };
    const hard = out.split('\n').filter((l) => /\b(b|c|d|e|h|j|k|m|exp):F/.test(l));
    if (hard.length) {
      console.log('→ HARD aperti:');
      for (const l of hard) console.log('    ' + l.trim());
    } else {
      // Uscita ≠1 senza HARD = l'audit non è riuscito a girare (pagina che non
      // carica, rotta assente). È un fallimento del gate, non del deck, e va
      // detto come tale invece di essere scambiato per un difetto di resa.
      console.log(`→ l'audit non ha potuto girare (uscita ${e.status}):`);
      for (const l of out.split('\n').filter(Boolean).slice(-6)) console.log('    ' + l.trim());
    }
    failed.push(app);
  }
}
server.close();
rmSync(root, { recursive: true, force: true });

if (failed.length) {
  console.log(`\nFAIL — HARD aperti su: ${failed.join(', ')}`);
  process.exit(1);
}
console.log('\nPASS — 0 HARD su tutti i deck. I soft restano: si chiudono tagliando copy o dividendo la slide, mai rimpicciolendo il tipo.');
