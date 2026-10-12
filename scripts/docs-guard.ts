/**
 * docs-guard — sotto docs/ non esce materiale di cliente, e il meccanismo che lo
 * impedisce è ancora al suo posto.
 *
 * PERCHÉ ESISTE
 * docs/ ospita due cose che non possono stare sullo stesso piano: la
 * documentazione della Factory, tracciata in un repo PUBBLICO, e il materiale
 * d'account dei clienti — footprint, consumi, contratti, profili di persone
 * reali — che non si pubblica mai. Fino al 12 ott 2026 la separazione era un
 * elenco a mano nel .gitignore di root, una riga per cliente: ogni cliente nuovo
 * nasceva ESPOSTO finché qualcuno non si ricordava di aggiungere la sua riga, e
 * con «Banca Generali» — arrivata quel giorno con footprint e dashboard di
 * consumo — non se n'era ricordato nessuno. Niente era stato committato, ma
 * bastava un `git add -A`.
 * Ora la regola è fail-closed in docs/.gitignore. Questo gate verifica che lo sia
 * ancora: una protezione che nessuno misura è una protezione che prima o poi
 * qualcuno rimuove senza accorgersene.
 *
 * CHE COSA CONTROLLA — tutto HARD, perché qui non esiste il «quasi»
 *   1 · docs/.gitignore esiste e contiene la riga fail-closed (un `*` secco).
 *   2 · nessun file sotto docs/ è TRACCIATO fuori dall'elenco della Factory.
 *   3 · nessun file sotto docs/ è tracciabile, cioè né tracciato né ignorato:
 *       è quello che un `git add -A` raccoglierebbe senza chiedere niente.
 *   4 · la direzione opposta: nessuna riammissione (`!`) in docs/.gitignore che
 *       assomigli a una cartella cliente. L'errore inverso — «riammetto questo
 *       documento del cliente, serve al team» — è l'altro modo di aprire la falla.
 *
 * CHE COSA NON CONTROLLA
 * Che dentro un file TRACCIATO della Factory non ci sia un nome di persona o un
 * dato riservato copiato a mano da un CONTO.md. Un `git check-ignore` non legge
 * il contenuto. Quello resta una regola di scrittura (docs/CLAUDE.md) e un
 * controllo umano.
 *
 *   pnpm audit:docs
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const GITIGNORE = join(ROOT, 'docs/.gitignore');

const git = (...args: string[]): string[] =>
  execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

const rilievi: string[] = [];
const nota = (s: string) => rilievi.push(s);

/* 1 — il meccanismo è al suo posto ------------------------------------------ */
if (!existsSync(GITIGNORE)) {
  nota('docs/.gitignore NON ESISTE. Senza quel file ogni cartella cliente è tracciabile: va ripristinato prima di qualunque commit.');
}
const righe = existsSync(GITIGNORE)
  ? readFileSync(GITIGNORE, 'utf8').split('\n').map((l) => l.trim())
  : [];
if (righe.length && !righe.includes('*')) {
  nota('docs/.gitignore ha perso la riga fail-closed (un `*` da solo). Senza quella, le righe `!` non proteggono niente: riammettono dentro un elenco che non ignora più nulla.');
}

/* l'elenco della Factory si LEGGE dal .gitignore, non si duplica qui -------- */
const riammessi = righe
  .filter((l) => l.startsWith('!') && !l.startsWith('!#'))
  .map((l) => l.slice(1));

/* 4 — la direzione opposta: una riammissione che sa di cliente -------------- */
// I documenti della Factory sono markdown, più la cartella superpowers/ delle
// spec. Qualunque altra riammissione va guardata: è il modo in cui si riapre la
// falla "dal lato buono", aggiungendo invece di togliere.
const AMMESSI_NON_MD = new Set(['.gitignore', 'superpowers/', 'superpowers/**']);
for (const r of riammessi) {
  if (AMMESSI_NON_MD.has(r)) continue;
  if (/\.md$/.test(r) || /^[A-Z-]+\*?\.md$/.test(r)) continue;
  nota(`docs/.gitignore riammette «!${r}», che non è un documento markdown della Factory né superpowers/. Se è materiale di un cliente, non va nel repo: togli la riga.`);
}

/* 2 — niente di cliente è tracciato ----------------------------------------- */
const tracciati = git('ls-files', 'docs');
const ammesso = (p: string): boolean => {
  const rel = p.replace(/^docs\//, '');
  if (rel.startsWith('superpowers/')) return true;
  if (!rel.includes('/') && /\.md$/.test(rel)) return true; // i doc della Factory stanno in piano
  if (rel === '.gitignore') return true;
  return false;
};
for (const p of tracciati) {
  if (!ammesso(p)) nota(`TRACCIATO fuori dall'elenco della Factory: ${p} — se è materiale di un cliente è già nella storia del repo pubblico, e togliergli il tracciamento non basta.`);
}

/* 3 — niente è "tracciabile": né tracciato né ignorato ---------------------- */
// È il caso che il 12 ott 2026 era aperto: il file non è committato, nessuno lo
// vede in `git status` se non guarda, e un `git add -A` lo porta dentro.
// NON si usa `git()`: fa trim() sulle righe, e il prefisso di stato di porcelain è
// larghezza fissa — « M path» trimmato diventa «M path» e il prefisso finisce dentro
// il percorso. Il gate se n'è accorto segnalando «M docs/README.md» come file sospetto.
const nonIgnorati = execFileSync('git', ['-C', ROOT, 'status', '--porcelain', '--untracked-files=all', '--', 'docs'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  .split('\n')
  .filter((l) => l.length > 3)
  .map((l) => l.slice(3).replace(/^"|"$/g, '').trim())
  .filter((p) => p && !ammesso(p));
for (const p of nonIgnorati) {
  nota(`TRACCIABILE (né ignorato né tracciato): ${p} — un \`git add -A\` lo committerebbe su un repo pubblico senza chiedere niente.`);
}

/* esito --------------------------------------------------------------------- */
console.log(`\ndocs-guard · ${tracciati.length} file tracciati sotto docs/ · ${riammessi.length} riammissioni dichiarate`);
if (!rilievi.length) {
  console.log('\nPULITO — la regola fail-closed è al suo posto, e sotto docs/ non c\'è materiale di cliente né tracciato né tracciabile.');
  console.log('\n⚠️  Il gate guarda i PERCORSI, non il contenuto: che in un file tracciato non sia finito a mano un nome o un dato riservato resta un controllo umano.');
  process.exit(0);
}
// Un rilievo di struttura (il `*` perduto, il file cancellato) rende tracciabile
// l'intero albero: la prima prova ne ha stampati 1066 su 400 KB. Un gate che
// vomita non lo legge nessuno, quindi si elencano i primi e si conta il resto.
const MOSTRATI = 20;
console.log(`\nHARD — ${rilievi.length} ${rilievi.length === 1 ? 'rilievo' : 'rilievi'}:`);
for (const r of rilievi.slice(0, MOSTRATI)) console.log(`  ✗ ${r}`);
if (rilievi.length > MOSTRATI) {
  console.log(`  … e altri ${rilievi.length - MOSTRATI}. Un numero di questo ordine non è un file sfuggito: è la regola fail-closed che non c'è più. Si guarda docs/.gitignore, non i singoli file.`);
}
console.log('\nIl repo è PUBBLICO e `main` fa deploy automatico: questi rilievi si chiudono prima del prossimo commit.');
process.exit(1);
