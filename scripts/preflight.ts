/**
 * PREFLIGHT — che cosa va verificato PRIMA di una stanza, non dopo.
 *
 * Perché esiste. Il 9 novembre, a poche ore dalla sala, la Prospettiva Sales
 * aveva tre cose vere insieme: il deck era cambiato due volte dopo il panel,
 * il lavoro non era committato, e in rete c'era lo stato di due giorni prima.
 * Nessuna delle tre era nascosta — erano tutte visibili a `git status` e a
 * `ls docs/<Cliente>/`. Quello che mancava era qualcuno che le guardasse
 * insieme, alla stessa ora. `/handover` le trova, ma a valle.
 *
 * Fail-closed, come `docs/.gitignore`: quello che non si riesce a verificare
 * si dichiara ROSSO, non VERDE. Un preflight che tace quando non sa è peggio
 * di nessun preflight, perché autorizza.
 *
 * Il verdetto del panel NON si attribuisce dalla cartella del cliente: su
 * Ferrovie ci sono due experience e su Intesa quattro, e i file del verdetto
 * si distinguono solo per data. Si attribuisce leggendo dentro il file, che
 * nomina `apps/<slug>`. È l'unico modo che non dia un verde falso.
 *
 * Uso:  pnpm preflight <slug>        (o dalla cartella dell'app, senza argomenti)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');

type Stato = 'verde' | 'giallo' | 'rosso';
interface Esito {
  voce: string;
  stato: Stato;
  dettaglio: string;
}

const SEMAFORO: Record<Stato, string> = { verde: '🟢', giallo: '🟡', rosso: '🔴' };

function git(...args: string[]): string {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

/** Lo slug dell'app: argomento, oppure dedotto dalla cwd se sei dentro apps/<slug>. */
function slugDaContesto(): string | null {
  const arg = process.argv[2]?.replace(/^apps\//, '').replace(/\/$/, '');
  if (arg) return arg;
  const parti = process.cwd().split('/');
  const i = parti.lastIndexOf('apps');
  return i >= 0 && parti[i + 1] ? parti[i + 1] : null;
}

/**
 * Tutti i verdetti di panel del repo, con le app che nominano. Si legge il
 * CONTENUTO: il nome del file porta solo la data, e su una cartella con
 * quattro experience la data non basta a dire di chi è il verdetto.
 */
function verdetti(): { data: string; file: string; apps: Set<string> }[] {
  const docs = join(ROOT, 'docs');
  if (!existsSync(docs)) return [];
  const out: { data: string; file: string; apps: Set<string> }[] = [];
  for (const cartella of readdirSync(docs)) {
    const dir = join(docs, cartella);
    let voci: string[];
    try {
      if (!statSync(dir).isDirectory()) continue;
      voci = readdirSync(dir);
    } catch {
      continue;
    }
    for (const f of voci) {
      if (!/^PANEL-VERDICT-.*\.md$/.test(f)) continue;
      const data = /(\d{4}-\d{2}-\d{2})/.exec(f)?.[1];
      if (!data) continue;
      let testo = '';
      try {
        testo = readFileSync(join(dir, f), 'utf8');
      } catch {
        continue;
      }
      const apps = new Set([...testo.matchAll(/apps\/([a-z0-9-]+)/g)].map((m) => m[1]));
      out.push({ data, file: `docs/${cartella}/${f}`, apps });
    }
  }
  return out;
}

/**
 * L'ultimo commit che ha cambiato CONTENUTO. Build, lockfile e CSS puro non
 * contano: il panel giudica quello che la slide dice, non come è impaginata.
 * Nel dubbio si conta — meglio un giallo di troppo che un verde falso.
 */
function ultimoCommitContenuto(slug: string): { sha: string; data: string; titolo: string } | null {
  const righe = git(
    'log', '--format=%H|%ad|%s', '--date=format:%Y-%m-%d', '--name-only',
    '--', `apps/${slug}/`,
  );
  if (!righe) return null;
  let corrente: { sha: string; data: string; titolo: string } | null = null;
  for (const riga of righe.split('\n')) {
    if (riga.includes('|')) {
      const [sha, data, ...resto] = riga.split('|');
      corrente = { sha: sha.slice(0, 7), data, titolo: resto.join('|') };
      continue;
    }
    if (!riga.trim() || !corrente) continue;
    const soloStile = /\.(css|scss)$/.test(riga) || /\/(assets|public)\//.test(riga);
    if (!soloStile) return corrente;
  }
  return corrente;
}

function main(): void {
  const slug = slugDaContesto();
  if (!slug) {
    console.error('preflight: manca lo slug. Uso: pnpm preflight <slug>');
    process.exit(2);
  }
  if (!existsSync(join(ROOT, 'apps', slug))) {
    console.error(`preflight: apps/${slug} non esiste.`);
    process.exit(2);
  }

  const esiti: Esito[] = [];

  // ── 1. Il panel copre quello che si proietta? ──────────────────────────
  const miei = verdetti()
    .filter((v) => v.apps.has(slug))
    .sort((a, b) => a.data.localeCompare(b.data));
  const ultimoPanel = miei.at(-1);
  const contenuto = ultimoCommitContenuto(slug);

  // Il tree sporco si legge PRIMA del panel: un verdetto non può coprire
  // quello che non è ancora stato scritto. Senza questo, un'app con il
  // panel di stamattina e mezza giornata di riscritture addosso esce VERDE
  // — ed è esattamente il caso del 9 novembre.
  const sporchi = git('status', '--porcelain', '--', `apps/${slug}/`)
    .split('\n')
    .filter(Boolean);
  const sporchiContenuto = sporchi.filter((r) => {
    const p = r.slice(3);
    return !/\.(css|scss)$/.test(p) && !/\/(assets|public)\//.test(p);
  });

  if (!ultimoPanel) {
    esiti.push({
      voce: 'Panel review',
      stato: 'rosso',
      dettaglio: `nessun verdetto nomina apps/${slug}. Comando: /panel-review apps/${slug}`,
    });
  } else if (contenuto && ultimoPanel.data < contenuto.data) {
    esiti.push({
      voce: 'Panel review',
      stato: 'rosso',
      dettaglio:
        `verdetto del ${ultimoPanel.data}, ultimo contenuto del ${contenuto.data} ` +
        `(${contenuto.sha} «${contenuto.titolo}»). Serve un giro delta.`,
    });
  } else if (sporchiContenuto.length) {
    esiti.push({
      voce: 'Panel review',
      stato: 'rosso',
      dettaglio:
        `verdetto del ${ultimoPanel.data}, ma ${sporchiContenuto.length} file di contenuto ` +
        `non sono committati: nessuna persona li ha visti. Giro delta sulle slide toccate.`,
    });
  } else {
    esiti.push({
      voce: 'Panel review',
      stato: 'verde',
      dettaglio: `verdetto del ${ultimoPanel.data} (${miei.length} file), posteriore all'ultimo contenuto.`,
    });
  }

  // ── 2. Il working tree ─────────────────────────────────────────────────
  esiti.push(
    sporchi.length
      ? {
          voce: 'Working tree',
          stato: 'rosso',
          dettaglio: `${sporchi.length} file non committati su questa app. Niente di questo è in rete.`,
        }
      : { voce: 'Working tree', stato: 'verde', dettaglio: 'pulito su questa app.' },
  );

  // ── 3. Quello che è pubblicato ─────────────────────────────────────────
  // Senza rete: se sei avanti a origin, o hai roba non committata, allora
  // quello che gira sul link NON è quello che hai davanti. Non serve curl.
  // Si contano solo i commit non pushati che toccano QUESTA app: un commit
  // di soli `docs/` non cambia niente del deck, e un rosso che si accende
  // sempre è un rosso che si impara a ignorare.
  const avanti = git('rev-list', '--count', '@{u}..HEAD', '--', `apps/${slug}/`) || '0';
  const indietro = git('rev-list', '--count', 'HEAD..@{u}', '--', `apps/${slug}/`) || '0';
  if (!git('rev-parse', '--abbrev-ref', '@{u}')) {
    esiti.push({ voce: 'In rete', stato: 'giallo', dettaglio: 'nessun upstream: non verificabile.' });
  } else if (sporchi.length || Number(avanti) > 0) {
    esiti.push({
      voce: 'In rete',
      stato: 'rosso',
      dettaglio:
        `il link pubblico serve un build più vecchio di quello che hai ` +
        `(${avanti} commit non pushati su questa app, ${sporchi.length} file non committati).`,
    });
  } else {
    esiti.push({
      voce: 'In rete',
      stato: 'verde',
      dettaglio: `allineato a origin${Number(indietro) ? ` (${indietro} dietro, da verificare)` : ''}.`,
    });
  }

  // ── 4. I gate ──────────────────────────────────────────────────────────
  // Non li lancia questo script: alcuni aprono un browser e costano minuti.
  // Li lancia il comando /preflight-sala, che sa aspettare.
  esiti.push({
    voce: 'Gate',
    stato: 'giallo',
    dettaglio: `da lanciare: pnpm --filter ${slug} audit:deck · pnpm audit:ink · audit:wrap · audit:copy · audit:fonti`,
  });

  // ── Esito ──────────────────────────────────────────────────────────────
  console.log(`\n  PREFLIGHT · ${slug}\n`);
  for (const e of esiti) {
    console.log(`  ${SEMAFORO[e.stato]}  ${e.voce.padEnd(14)} ${e.dettaglio}`);
  }
  const rossi = esiti.filter((e) => e.stato === 'rosso');
  console.log(
    rossi.length
      ? `\n  ${rossi.length} punti rossi: o si chiudono, o si mette agli atti che la stanza li accetta.\n`
      : `\n  Nessun punto rosso. Restano i gate da lanciare.\n`,
  );
  process.exit(rossi.length ? 1 : 0);
}

main();
