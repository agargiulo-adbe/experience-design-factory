/**
 * accounts — una riga per conto: dove siamo, chi ha la palla, da quanto è fermo.
 *
 * PERCHÉ ESISTE
 * I `CONTO.md` risolvono «dove eravamo rimasti su questo conto». Non risolvono
 * «su quale dei sedici conti si è fermato qualcosa»: per saperlo bisognerebbe
 * aprirli tutti, e nessuno lo fa. Con una quindicina di conti la cosa che manca non è il
 * dettaglio, è la vista d'insieme — e soprattutto l'avviso sui conti che nessuno
 * tocca da settimane, che sono quelli che fanno danno.
 *
 * CHE COSA STAMPA
 *   · i conti con un registro, ordinati per quanto tempo è passato;
 *   · i passi SCADUTI (c'è una data «entro» ed è passata);
 *   · i conti FERMI da più di tre settimane;
 *   · le cartelle SENZA registro, perché il primo `/account-open` lo crea.
 *
 * CHE COSA NON FA
 * Non legge la posta e non giudica il contenuto: legge i registri. Se un registro
 * è vecchio, lo dice; se è sbagliato, non può saperlo — quello lo scopre
 * l'apertura di `/account-open`, che confronta con i thread.
 *
 *   pnpm accounts            tutto
 *   pnpm accounts --fermi    solo ciò che chiede attenzione
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const DOCS = join(ROOT, 'docs');
const SOLO_FERMI = process.argv.includes('--fermi');
const GIORNI_FERMO = 21;

/* I documenti della Factory stanno in piano in docs/; le cartelle sono i conti, meno i
   depositi di materiale. `Adobe` (senza «Material») È un conto: ci sta il lavoro non
   legato a un cliente, e va nella vista d'insieme come tutti gli altri. */
const DEPOSITI = new Set(['superpowers', 'Adobe Material', 'Factory', 'Claude']);

const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

/** Accetta «12 ott 2026» e «2026-10-12»: nel registro le date sono in chiaro. */
const data = (s: string): Date | undefined => {
  const iso = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);
  const it = s.match(/(\d{1,2})\s+([a-zà]{3})\w*\s+(\d{4})/i);
  if (it) {
    const m = MESI.indexOf(it[2].toLowerCase().slice(0, 3));
    if (m >= 0) return new Date(+it[3], m, +it[1]);
  }
  return undefined;
};

const oggi = new Date();
const giorni = (d: Date): number => Math.floor((+oggi - +d) / 86_400_000);

interface Caso { nome: string; palla?: string; dal?: Date; passo?: string; scadenza?: Date; chiuso?: Date }
interface Conto { cliente: string; aggiornato?: Date; senzaRegistro?: boolean; casi: Caso[]; illeggibile?: string }

const conti: Conto[] = [];

for (const cliente of readdirSync(DOCS).sort()) {
  const dir = join(DOCS, cliente);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
  if (cliente.startsWith('.') || DEPOSITI.has(cliente)) continue;

  const registro = join(dir, 'CONTO.md');
  if (!existsSync(registro)) {
    conti.push({ cliente, senzaRegistro: true, casi: [] });
    continue;
  }

  const righe = readFileSync(registro, 'utf8').split('\n');
  const conto: Conto = { cliente, casi: [] };

  // la data di aggiornamento sta nell'intestazione, nelle prime righe
  for (const r of righe.slice(0, 6)) {
    const m = r.match(/aggiornato\s+(.+?)\s*$/i);
    if (m) { conto.aggiornato = data(m[1]); break; }
  }
  if (!conto.aggiornato) conto.illeggibile = 'manca il campo «aggiornato» nell\'intestazione';

  let corrente: Caso | undefined;
  for (const r of righe) {
    const caso = r.match(/^##\s*Caso\s*[·:]\s*(.+?)\s*$/i);
    if (caso) { corrente = { nome: caso[1] }; conto.casi.push(corrente); continue; }
    if (r.startsWith('## ')) { corrente = undefined; continue; }
    if (!corrente) continue;

    const chiuso = r.match(/Dove siamo\s*[—-]\s*chiuso il\s+(.+?)\s*$/i);
    if (chiuso) { corrente.chiuso = data(chiuso[1]); continue; }
    const palla = r.match(/^Palla a\s*[—-]\s*(.+?)\s*$/i);
    if (palla) {
      // «<chi> · dal <data>»: la data è il numero che conta davvero — da quanto
      // è su quella persona — e nel nome non ci deve finire.
      const [chi, da] = palla[1].split(/\s*·\s*dal\s+/i);
      corrente.palla = chi.trim();
      if (da) corrente.dal = data(da);
      continue;
    }
    const passo = r.match(/^Prossimo passo\s*[—-]\s*(.+?)\s*$/i);
    if (passo) {
      corrente.passo = passo[1];
      const entro = passo[1].match(/entro\s+(.+?)\s*$/i);
      if (entro) corrente.scadenza = data(entro[1]);
    }
  }
  conti.push(conto);
}

/* ordine: il più fermo in testa; chi non ha registro va in fondo, a parte */
const conRegistro = conti.filter((c) => !c.senzaRegistro)
  .sort((a, b) => (b.aggiornato ? giorni(b.aggiornato) : 9e9) - (a.aggiornato ? giorni(a.aggiornato) : 9e9));
const senza = conti.filter((c) => c.senzaRegistro);

const aperti = (c: Conto): Caso[] => c.casi.filter((k) => !k.chiuso);
const scaduti = conRegistro.flatMap((c) => aperti(c).filter((k) => k.scadenza && giorni(k.scadenza) > 0).map((k) => ({ c, k })));
const fermi = conRegistro.filter((c) => c.aggiornato && giorni(c.aggiornato) > GIORNI_FERMO);

const taglia = (s: string, n: number): string => (s.length > n ? s.slice(0, n - 1) + '…' : s);

console.log(`\naccounts · ${conRegistro.length} conti con registro · ${senza.length} ancora senza · ${new Date().toLocaleDateString('it-IT')}`);

if (scaduti.length) {
  console.log(`\nSCADUTI — il passo aveva una data, ed è passata: ${scaduti.length}`);
  for (const { c, k } of scaduti.sort((a, b) => giorni(a.k.scadenza!) - giorni(b.k.scadenza!)).reverse()) {
    console.log(`  ! ${c.cliente} · ${taglia(k.nome, 44)} — ${taglia(k.passo ?? '', 56)} (${giorni(k.scadenza!)} gg)`);
  }
}

if (fermi.length) {
  console.log(`\nFERMI da più di ${GIORNI_FERMO} giorni: ${fermi.length}`);
  for (const c of fermi) console.log(`  · ${c.cliente} — fermo da ${giorni(c.aggiornato!)} gg · ${aperti(c).length} ${aperti(c).length === 1 ? 'caso aperto' : 'casi aperti'}`);
}

if (!SOLO_FERMI) {
  console.log('\nTutti i conti:');
  for (const c of conRegistro) {
    const eta = c.aggiornato ? `${giorni(c.aggiornato)} gg` : '?';
    console.log(`  ${c.cliente.padEnd(26)} agg. ${eta.padStart(6)}   ${aperti(c).length} aperti` + (c.illeggibile ? `   ⚠ ${c.illeggibile}` : ''));
    for (const k of aperti(c)) {
      const palla = k.palla ? ` · palla: ${taglia(k.palla, 28)}` : '';
      const da = k.dal ? ` (da ${giorni(k.dal)} gg)` : '';
      console.log(`      ${taglia(k.nome, 44)}${palla}${da}`);
    }
  }
  if (senza.length) {
    console.log('\nSenza registro — il primo `/account-open` lo crea:');
    console.log('  ' + senza.map((c) => c.cliente).join(' · '));
  }
}

if (!scaduti.length && !fermi.length) console.log('\nNiente scaduto e niente fermo da settimane.');
console.log('\n⚠️  Legge i registri, non la posta: un registro vecchio lo segnala, un registro sbagliato no. Quello lo scopre `/account-open`.');
