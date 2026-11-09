/**
 * HANDOVER-CHECK — l'aritmetica del contratto di dimensione, fatta dalla macchina.
 *
 * Perché esiste. Il contratto di `/handover` è ≤1500 righe, ≤48 KB, ≤1800 char
 * per riga, su 21 parti. Quando una parte tocca il tetto, la voce più vecchia
 * scende nella parte successiva, che a sua volta ne cede una — la catena
 * 3 → 4 → 14 → 17 → 20 per il change log, 2 → 10 per il backlog. Finora quel
 * conto si è fatto a mano, ogni due o tre giornate di lavoro, e ogni volta
 * bisognava ricordarsi quali parti erano a filo.
 *
 * Questo script misura e dice **quale catena serve e quanto spazio libera**.
 * Non sposta niente: spostare è una decisione editoriale (una voce è una riga,
 * una sezione non si spezza a metà) e resta a chi scrive.
 *
 * ⚠️ Le soglie sono le stesse del comando `/handover`. Se cambiano lì,
 * cambiano qui: sono dichiarate una volta sola, subito sotto.
 *
 * Uso:  pnpm handover:check
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const MAX_RIGHE = 1500;
const MAX_BYTE = 49152; // 48 KB
const MAX_RIGA = 1800;

/** Riserva sotto la quale una parte è «a filo»: non è fuori contratto, ma il
 *  prossimo giro la sfonda. È il segnale che fa partire la catena. */
const RISERVA = 2560; // 2,5 KB

const DOCS = resolve(import.meta.dirname, '..', 'docs');

interface Misura {
  file: string;
  righe: number;
  byte: number;
  rigaMax: number;
  margine: number;
}

function misura(file: string): Misura {
  const testo = readFileSync(join(DOCS, file), 'utf8');
  const righe = testo.split('\n');
  const byte = Buffer.byteLength(testo, 'utf8');
  return {
    file,
    righe: righe.length,
    byte,
    rigaMax: Math.max(...righe.map((r) => [...r].length)),
    margine: MAX_BYTE - byte,
  };
}

function kb(n: number): string {
  return (n / 1024).toFixed(1);
}

function main(): void {
  const parti = readdirSync(DOCS)
    .filter((f) => /^HANDOVER(-\d{2})?\.md$/.test(f))
    .sort();
  const file = ['README.md', ...parti];

  const misure = file.map(misura);
  const fuori = misure.filter(
    (m) => m.righe > MAX_RIGHE || m.byte > MAX_BYTE || m.rigaMax > MAX_RIGA,
  );
  const aFilo = misure.filter((m) => !fuori.includes(m) && m.margine < RISERVA);

  console.log('\n  HANDOVER · contratto di dimensione\n');
  console.log(`  ${'file'.padEnd(20)}${'righe'.padStart(7)}${'KB'.padStart(8)}${'riga'.padStart(7)}${'margine'.padStart(10)}`);
  for (const m of misure) {
    const segno = fuori.includes(m) ? '❌' : m.margine < RISERVA ? '⚠️ ' : '  ';
    console.log(
      `  ${segno} ${m.file.padEnd(17)}${String(m.righe).padStart(7)}${kb(m.byte).padStart(8)}${String(m.rigaMax).padStart(7)}${(kb(m.margine) + ' KB').padStart(10)}`,
    );
  }

  // ── Che cosa serve fare ──────────────────────────────────────────────────
  console.log('');
  if (fuori.length) {
    console.log(`  ❌ ${fuori.length} file FUORI CONTRATTO: ${fuori.map((m) => m.file).join(', ')}`);
    for (const m of fuori) {
      if (m.byte > MAX_BYTE) console.log(`     ${m.file}: ${kb(m.byte - MAX_BYTE)} KB di troppo`);
      if (m.rigaMax > MAX_RIGA) console.log(`     ${m.file}: una riga di ${m.rigaMax} char (tetto ${MAX_RIGA}) — si ACCORCIA, non si spezza: una voce è una riga`);
      if (m.righe > MAX_RIGHE) console.log(`     ${m.file}: ${m.righe - MAX_RIGHE} righe di troppo`);
    }
  }

  // Le due catene di scarico, dichiarate: sono struttura del documento, non
  // deduzione. Se cambiano, si cambiano qui.
  const CATENE: { nome: string; anelli: string[] }[] = [
    { nome: 'change log', anelli: ['HANDOVER-03.md', 'HANDOVER-04.md', 'HANDOVER-14.md', 'HANDOVER-17.md', 'HANDOVER-20.md'] },
    { nome: 'backlog', anelli: ['HANDOVER-02.md', 'HANDOVER-10.md'] },
  ];

  for (const c of CATENE) {
    const m = c.anelli.map((a) => misure.find((x) => x.file === a)).filter(Boolean) as Misura[];
    const stretti = m.filter((x) => x.margine < RISERVA);
    const coda = m.at(-1);
    if (!stretti.length) {
      console.log(`  🟢 catena ${c.nome}: nessun anello a filo (il più stretto ha ${kb(Math.min(...m.map((x) => x.margine)))} KB).`);
      continue;
    }
    const capienza = coda && coda.margine >= RISERVA;
    console.log(
      `  ⚠️  catena ${c.nome}: ${stretti.map((x) => x.file.replace('HANDOVER-', 'Parte ').replace('.md', '')).join(', ')} ` +
        `sotto i ${kb(RISERVA)} KB di riserva.`,
    );
    console.log(
      capienza
        ? `     La coda (${coda!.file}) ha ${kb(coda!.margine)} KB: la catena ${c.anelli.map((a) => a.replace('HANDOVER-', '').replace('.md', '')).join(' → ')} si chiude.`
        : `     ⚠️ La coda NON ha capienza: la catena non si chiude, serve una PARTE NUOVA in coda alla numerazione.`,
    );
  }

  console.log('');
  process.exit(fuori.length ? 1 : 0);
}

main();
