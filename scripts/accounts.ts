/**
 * accounts — gli account in una schermata: cosa scade, cosa è fermo, cosa non è coperto,
 * e quanto di tutto questo conta per il piano.
 *
 * PERCHÉ ESISTE
 * Gli `ACCOUNT.md` risolvono «dove eravamo rimasti su questo account». Non risolvono «su
 * quale degli account si è fermato qualcosa», e soprattutto non sanno due cose che nessun registro
 * può sapere da sé: quali account del **book** non hanno nemmeno una cartella, e quali
 * scadenze contano davvero per il piano. Quelle due stanno nel **Radar**
 * (`docs/Adobe/Radar/`), alimentato a mano da PanoAI, e questo script le mette insieme.
 *
 * LA DIVISIONE DEL LAVORO (la ragione per cui non c'è un doppione)
 * Radar      → i NUMERI e la STRUTTURA: book, ARR, rinnovi, opportunità, prodotti
 *              eleggibili per il piano. Fonte di verità, aggiornata da PanoAI.
 * ACCOUNT.md → la STORIA: dove siamo, chi ha la palla, i blocchi, i fatti detti in
 *              riunione. Niente di questo è nel Radar, e nessun PanoAI lo sa.
 * Due copie a mano degli stessi numeri divergono sempre: il registro non li ricopia.
 *
 * CHE COSA STAMPA
 *   · SCADUTI    — un passo del registro con una data «entro» già passata
 *   · RINNOVI    — dal Radar, entro N giorni, con la marca «conta per il piano» o no
 *   · FERMI      — account con il registro vecchio di più di tre settimane
 *   · COPERTURA  — account del book senza registro (e cartelle fuori dal book)
 *   · tutti gli account, con l'ARR dal book dove l'abbinamento è certo
 *
 * CHE COSA NON FA
 * Non legge la posta e non giudica il contenuto. E **non indovina gli abbinamenti**: i nomi
 * del book non coincidono con quelli delle cartelle (`Telecom Italia`/`TIM`,
 * `FS Technology`/`Ferrovie`), quindi stanno dichiarati in `Radar/alias_cartelle.md`;
 * quello che non si abbina viene **elencato**, non accoppiato a caso.
 *
 *   pnpm accounts            tutto
 *   pnpm accounts --fermi    solo ciò che chiede attenzione
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

// `pnpm accounts | head` chiude la pipe a metà: senza questo, Node butta uno stack trace
// EPIPE addosso a chi voleva solo le prime righe.
process.stdout.on('error', (e: NodeJS.ErrnoException) => { if (e.code !== 'EPIPE') throw e; });

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const DOCS = join(ROOT, 'docs');
const RADAR = join(DOCS, 'Adobe/Radar');
const SOLO_FERMI = process.argv.includes('--fermi');
/* --rilievi: stampa SOLO le righe che meritano una notifica, al massimo cinque, e
   NIENTE se non c'è nulla. È il contratto con il cron: output vuoto = silenzio. */
const SOLO_RILIEVI = process.argv.includes('--rilievi');
const GIORNI_FERMO = 21;
const GIORNI_RINNOVO = 120;
const GIORNI_SNAPSHOT_VECCHIO = 45;
const GIORNI_RINNOVO_NOTIFICA = 30;   // nella notifica si guarda vicino, non a 120 gg
const GIORNI_EVENTO = 14;             // un evento entro due settimane
const GIORNI_ISCRIZIONE = 3;          // una scadenza d'isciizione è più urgente dell'evento
const GIORNI_GIRO_FERMO = 2;          // oltre questo, il cron potrebbe essere morto
const MAX_RIGHE_NOTIFICA = 5;

/* I documenti della Factory stanno in piano in docs/; le cartelle sono gli account, meno i
   depositi di materiale. `Adobe` (senza «Material») È un account: ci sta il lavoro non
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
const taglia = (s: string, n: number): string => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const norm = (s: string): string =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const soldi = (n: number): string =>
  n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${Math.round(n / 1e3)}K` : `$${Math.round(n)}`;
/** «$11.2M», «$267.4K» → numero */
const importo = (s: string): number => {
  const m = s.match(/\$?\s*([\d.,]+)\s*([KM])?/i);
  if (!m) return 0;
  const v = parseFloat(m[1].replace(/,/g, ''));
  const u = m[2]?.toUpperCase();
  return u === 'M' ? v * 1e6 : u === 'K' ? v * 1e3 : v;
};

/* ── i registri di account ──────────────────────────────────────────────────────── */
interface Caso { nome: string; palla?: string; dal?: Date; passo?: string; scadenza?: Date; chiuso?: Date }
interface Conto { cliente: string; aggiornato?: Date; senzaRegistro?: boolean; casi: Caso[]; illeggibile?: string }

const conti: Conto[] = [];
for (const cliente of readdirSync(DOCS).sort()) {
  const dir = join(DOCS, cliente);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
  if (cliente.startsWith('.') || DEPOSITI.has(cliente)) continue;

  const registro = join(dir, 'ACCOUNT.md');
  if (!existsSync(registro)) { conti.push({ cliente, senzaRegistro: true, casi: [] }); continue; }

  const righe = readFileSync(registro, 'utf8').split('\n');
  const conto: Conto = { cliente, casi: [] };

  for (const r of righe.slice(0, 12)) {
    const a = r.match(/aggiornato\s+(.+?)\s*$/i);
    if (a && !conto.aggiornato) { conto.aggiornato = data(a[1]); break; }
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

/* ── il Radar ─────────────────────────────────────────────────────────────────── */
interface Rinnovo { account: string; prodotto: string; quando: Date; rbob: number; rischio: string; eleggibile?: boolean }
const radar = {
  presente: existsSync(RADAR),
  snapshot: undefined as Date | undefined,
  book: [] as { account: string; arr: number }[],
  rinnovi: [] as Rinnovo[],
  eleggibili: [] as string[],
  fineQuarter: undefined as Date | undefined,
  avvisi: [] as string[],
};

const piuRecente = (dir: string, re: RegExp): string | undefined => {
  if (!existsSync(dir)) return undefined;
  const f = readdirSync(dir).filter((x) => re.test(x)).sort();
  return f.length ? join(dir, f[f.length - 1]) : undefined;
};

if (radar.presente) {
  const MAPPA = join(RADAR, 'Mappa_Account');

  // Anagrafica: la tabella P0 è il book, e l'intestazione porta la data di estrazione
  const anag = join(MAPPA, 'Anagrafica_account.md');
  if (existsSync(anag)) {
    const s = readFileSync(anag, 'utf8');
    const testa = s.slice(0, 800);
    radar.snapshot = data(testa.match(/aggiornati al\s+(\S+)/)?.[1] ?? testa.match(/PanoAI il\s+(\S+)/)?.[1] ?? '');
    const i0 = s.indexOf('## Elenco account');
    const i1 = s.indexOf('## P1');
    if (i0 >= 0) {
      for (const r of s.slice(i0, i1 > i0 ? i1 : undefined).split('\n')) {
        const c = r.split('|').map((x) => x.trim());
        if (c.length < 4 || !c[1] || c[1] === 'Account' || /^-+$/.test(c[1])) continue;
        radar.book.push({ account: c[1], arr: importo(c[2]) });
      }
    }
    if (!radar.book.length) radar.avvisi.push('Anagrafica_account.md c\'è ma la tabella del book non si legge');
  } else radar.avvisi.push('manca Mappa_Account/Anagrafica_account.md: niente book, niente copertura');

  // Goal Sheet: quali prodotti contano per il piano, e quando chiude il quarter
  const goal = piuRecente(MAPPA, /^Goal_Sheet_FY\d+\.md$/);
  if (goal) {
    const s = readFileSync(goal, 'utf8');
    const i0 = s.indexOf('## Prodotti eleggibili');
    const i1 = s.indexOf('## Prodotti NON');
    if (i0 >= 0 && i1 > i0) {
      const corpo = s.slice(s.indexOf('\n', i0), i1).replace(/\n/g, ' ');
      radar.eleggibili = corpo.split(';').map((x) => norm(x)).filter((x) => x.length > 1);
    }
    radar.fineQuarter = data(s.match(/chiude il\s+(\S+)/)?.[1] ?? '');
  } else radar.avvisi.push('manca Goal_Sheet_FY*.md: i rinnovi non si possono pesare sul piano');

  // Panorama: P3 sono i rinnovi, in blocchi `;`-separati, uno per trimestre
  const pano = piuRecente(MAPPA, /^Panorama_\d{8}\.md$/);
  if (pano) {
    const s = readFileSync(pano, 'utf8');
    const i0 = s.indexOf('## P3');
    const i1 = s.indexOf('## P4');
    const p3 = i0 >= 0 ? s.slice(i0, i1 > i0 ? i1 : undefined) : '';
    for (const r of p3.split('\n')) {
      const c = r.split(';').map((x) => x.trim());
      if (c.length < 7 || c[0] === 'Account' || !c[2]) continue;
      const quando = data(c[2]);
      if (!quando) continue;
      const rin: Rinnovo = { account: c[0], prodotto: c[1], quando, rbob: parseFloat(c[4]) || 0, rischio: c[6] };
      if (radar.eleggibili.length) rin.eleggibile = radar.eleggibili.includes(norm(rin.prodotto));
      radar.rinnovi.push(rin);
    }
    if (!radar.rinnovi.length) radar.avvisi.push('Panorama c\'è ma le righe P3 non si leggono');
  } else radar.avvisi.push('manca Panorama_AAAAMMGG.md: niente rinnovi');
}

/* ── gli eventi ───────────────────────────────────────────────────────────────
   `Radar/eventi.md`: una tabella `data | evento | account | iscrizione | note`.
   Il calendario costerebbe token e, soprattutto, un invito non dice chi è iscritto
   a un evento — la guest list dell'AI Forum stava in Teams, non in un invito. */
interface Evento { quando?: Date; nome: string; account: string; iscrizione?: Date; note: string }
const eventi: Evento[] = [];
const fileEventi = join(RADAR, 'eventi.md');
if (existsSync(fileEventi)) {
  for (const r of readFileSync(fileEventi, 'utf8').split('\n')) {
    if (!r.trim().startsWith('|')) continue;
    const c = r.split('|').map((x) => x.trim());
    if (c.length < 5 || !c[1] || /^-+$/.test(c[1]) || /^data$/i.test(c[1])) continue;
    const acc = (c[3] ?? '').replace(/^[—–-]$/, '');   // «—» vuol dire «non si sa», non è un valore
    eventi.push({ quando: data(c[1]), nome: c[2], account: acc, iscrizione: data(c[4] ?? ''), note: c[5] ?? '' });
  }
}

/* ── il battito del cron ──────────────────────────────────────────────────────
   Il giro automatico scrive un file ogni mattina anche quando non trova niente.
   Se il più recente è vecchio, il cron è fermo — e il 2 ott 2026 un sistema è morto
   senza che nessuno se ne accorgesse per dieci giorni, perché l'unico modo di
   vederlo era aprire una cartella vuota. */
const dirGiri = join(RADAR, 'giri');
let ultimoGiro: Date | undefined;
if (existsSync(dirGiri)) {
  const f = readdirSync(dirGiri).filter((x) => /^\d{8}-\d{4}\.md$/.test(x)).sort();
  if (f.length) ultimoGiro = data(f[f.length - 1].slice(0, 4) + '-' + f[f.length - 1].slice(4, 6) + '-' + f[f.length - 1].slice(6, 8));
}

/* ── la deriva fra sorgente e copia installata ────────────────────────────────
   launchd non riesce a eseguire uno script che sta in ~/Documents, quindi la copia
   che gira vive in ~/.local/bin: due file sono due file, e se divergono gira il
   vecchio senza che nessuno lo sappia. Il confronto sta QUI e non nello script perché
   zsh lanciato da launchd non riesce ad aprire i file del repo («operation not
   permitted»), mentre node sì — verificato il 13 ott 2026. */
let deriva = false;
try {
  const sorgente = join(ROOT, 'scripts/radar-giro.sh');
  const installata = join(process.env.HOME ?? '', '.local/bin/radar-giro');
  if (existsSync(sorgente) && existsSync(installata)) {
    deriva = readFileSync(sorgente, 'utf8') !== readFileSync(installata, 'utf8');
  }
} catch { /* se non si riesce a confrontare, non si inventa un allarme */ }

/* ── abbinamento book ↔ cartella ──────────────────────────────────────────────
   Dichiarato in `Radar/alias_cartelle.md` (`nome nel book = cartella`), perché i nomi
   non si possono indovinare: `Telecom Italia` è `TIM`. In un posto solo, e nel Radar,
   perché è una proprietà della mappatura fra i due registri, non della storia di un
   account. Chi non è dichiarato si abbina solo per nome identico, e se non si abbina
   viene ELENCATO, non accoppiato a caso. */
const alias = new Map<string, string>();
const fileAlias = join(RADAR, 'alias_cartelle.md');
if (existsSync(fileAlias)) {
  for (const r of readFileSync(fileAlias, 'utf8').split('\n')) {
    const m = r.match(/^\s*([^=#`|]+?)\s*=\s*([^=#`|]+?)\s*$/);
    if (m) alias.set(norm(m[1]), norm(m[2]));
  }
}
const perCartella = new Map<string, Conto>(conti.map((c) => [norm(c.cliente), c]));
const contoDi = (account: string): Conto | undefined =>
  perCartella.get(alias.get(norm(account)) ?? norm(account));

const bookScoperti = radar.book
  .filter((b) => { const c = contoDi(b.account); return !c || c.senzaRegistro; })
  .sort((a, b) => b.arr - a.arr);
const cartelleCoperte = new Set(radar.book.map((b) => contoDi(b.account)?.cliente).filter(Boolean));
const fuoriBook = conti.filter((c) => c.cliente !== 'Adobe' && !cartelleCoperte.has(c.cliente));

/* ── esito ───────────────────────────────────────────────────────────────────── */
const conRegistro = conti.filter((c) => !c.senzaRegistro)
  .sort((a, b) => (b.aggiornato ? giorni(b.aggiornato) : 9e9) - (a.aggiornato ? giorni(a.aggiornato) : 9e9));
const senza = conti.filter((c) => c.senzaRegistro);
const aperti = (c: Conto): Caso[] => c.casi.filter((k) => !k.chiuso);
const scaduti = conRegistro.flatMap((c) => aperti(c).filter((k) => k.scadenza && giorni(k.scadenza) > 0).map((k) => ({ c, k })));
const fermi = conRegistro.filter((c) => c.aggiornato && giorni(c.aggiornato) > GIORNI_FERMO);
const rinnoviVicini = radar.rinnovi
  .filter((r) => giorni(r.quando) > -GIORNI_RINNOVO && giorni(r.quando) <= 0)
  .sort((a, b) => +a.quando - +b.quando);

/* ── i rilievi ─────────────────────────────────────────────────────────────────
   Quattro soglie e nessuna in più: ogni soglia extra diluisce la notifica, e una
   notifica diluita viene ignorata. Stesso elenco per la notifica e per la testa
   dell'output umano, così non possono divergere. */
const rinnoviNotifica = radar.rinnovi
  .filter((r) => giorni(r.quando) > -GIORNI_RINNOVO_NOTIFICA && giorni(r.quando) <= 0)
  .filter((r) => { const c = contoDi(r.account); return r.eleggibile || !c || c.senzaRegistro; })
  .sort((a, b) => +a.quando - +b.quando);
const eventiVicini = eventi.filter((e) =>
  (e.quando && giorni(e.quando) > -GIORNI_EVENTO && giorni(e.quando) <= 0) ||
  (e.iscrizione && giorni(e.iscrizione) > -GIORNI_ISCRIZIONE && giorni(e.iscrizione) <= 0));

const rilievi: string[] = [];
if (deriva) rilievi.push('il giro installato è divergente dalla sorgente: pnpm radar:install');
for (const { c, k } of scaduti) rilievi.push(`${c.cliente}: «${taglia(k.nome, 30)}» scaduto da ${giorni(k.scadenza!)} gg`);
for (const e of eventiVicini) {
  const q = e.quando ? `fra ${-giorni(e.quando)} gg` : '';
  const i = e.iscrizione && giorni(e.iscrizione) > -GIORNI_ISCRIZIONE ? ` · iscrizioni chiudono fra ${-giorni(e.iscrizione)} gg` : '';
  rilievi.push(`${e.nome} ${q}${i}${e.account ? ` · ${taglia(e.account, 24)}` : ''}`);
}
/* Una riga per ACCOUNT, non per riga di rinnovo: Acea da sola ne aveva due, su
   prodotti che non contano per il piano, e finivano in testa alla notifica.
   Quando un account ha più rinnovi vicini si somma il RBOB e si prende la data
   prima; il simbolo «€» dice se almeno uno conta per M1/M2. */
const perAccount = new Map<string, Rinnovo[]>();
for (const r of rinnoviNotifica) {
  const k = r.account;
  perAccount.set(k, [...(perAccount.get(k) ?? []), r]);
}
for (const [account, righe] of [...perAccount].sort((a, b) => +a[1][0].quando - +b[1][0].quando)) {
  const c = contoDi(account);
  const tot = righe.reduce((t, r) => t + r.rbob, 0);
  const conta = righe.some((r) => r.eleggibile);
  const che = righe.length === 1 ? righe[0].prodotto : `${righe.length} rinnovi`;
  rilievi.push(`${conta ? '€ ' : ''}${account} · ${che} ${soldi(tot)} fra ${-giorni(righe[0].quando)} gg${!c || c.senzaRegistro ? ' · senza registro' : ''}`);
}
for (const c of fermi) rilievi.push(`${c.cliente} fermo da ${giorni(c.aggiornato!)} gg · ${aperti(c).length} aperti`);

if (SOLO_RILIEVI) {
  // Contratto col cron: niente da dire = nessun output = nessuna notifica.
  for (const r of rilievi.slice(0, MAX_RIGHE_NOTIFICA)) console.log(r);
  if (rilievi.length > MAX_RIGHE_NOTIFICA) console.log(`e altre ${rilievi.length - MAX_RIGHE_NOTIFICA} cose`);
  process.exit(0);
}

console.log(`\naccounts · ${conRegistro.length} account con registro · ${senza.length} ancora senza · ${new Date().toLocaleDateString('it-IT')}`);
if (radar.presente) {
  const eta = radar.snapshot ? giorni(radar.snapshot) : undefined;
  console.log(`Radar · book di ${radar.book.length} account · snapshot di ${eta === undefined ? 'data ignota' : `${eta} gg`}` +
    (radar.fineQuarter ? ` · il quarter chiude fra ${-giorni(radar.fineQuarter)} gg` : ''));
  if (eta !== undefined && eta > GIORNI_SNAPSHOT_VECCHIO) {
    console.log(`  ⚠️  Lo snapshot ha ${eta} giorni: i rinnovi e la priorità qui sotto sono vecchi di altrettanto.`);
    console.log('      Si rinfresca coi prompt in Radar/Mappa_Account/_PROMPT_PanoAI.md (~10 minuti).');
  }
  for (const a of radar.avvisi) console.log(`  ⚠️  ${a}`);
} else {
  console.log('Radar assente (docs/Adobe/Radar/): niente book, niente rinnovi, niente peso sul piano.');
}

if (deriva) {
  console.log('\n⚠️  `~/.local/bin/radar-giro` è divergente da `scripts/radar-giro.sh`: gira la copia vecchia.');
  console.log('    Si riallinea con `pnpm radar:install`.');
}

if (ultimoGiro === undefined) {
  console.log(`\n⚠️  Nessun giro automatico ha ancora scritto in Radar/giri/: il cron non è installato o non ha mai girato.`);
} else if (giorni(ultimoGiro) > GIORNI_GIRO_FERMO) {
  console.log(`\n⚠️  L'ultimo giro automatico è di ${giorni(ultimoGiro)} giorni fa — il cron potrebbe essere fermo.`);
  console.log('    Si controlla con `launchctl list | grep com.gargiulo.radar`.');
}

if (eventiVicini.length) {
  console.log(`\nEVENTI entro ${GIORNI_EVENTO} gg: ${eventiVicini.length}`);
  for (const e of eventiVicini) {
    const q = e.quando ? `fra ${String(-giorni(e.quando)).padStart(2)} gg` : '      ?';
    const i = e.iscrizione ? ` · iscrizioni ${giorni(e.iscrizione) > 0 ? 'CHIUSE' : `fra ${-giorni(e.iscrizione)} gg`}` : '';
    console.log(`  · ${q}  ${taglia(e.nome, 30).padEnd(30)} ${taglia(e.account, 28)}${i}`);
  }
}

if (scaduti.length) {
  console.log(`\nSCADUTI — il passo aveva una data, ed è passata: ${scaduti.length}`);
  for (const { c, k } of scaduti.sort((a, b) => giorni(b.k.scadenza!) - giorni(a.k.scadenza!))) {
    console.log(`  ! ${c.cliente} · ${taglia(k.nome, 42)} — ${taglia(k.passo ?? '', 52)} (${giorni(k.scadenza!)} gg)`);
  }
}

if (rinnoviVicini.length) {
  const conta = rinnoviVicini.filter((r) => r.eleggibile);
  console.log(`\nRINNOVI entro ${GIORNI_RINNOVO} gg: ${rinnoviVicini.length}` +
    (radar.eleggibili.length ? ` · di cui ${conta.length} su prodotti che contano per il piano` : ''));
  for (const r of rinnoviVicini) {
    const c = contoDi(r.account);
    const stato = !c ? '· NESSUNA CARTELLA' : c.senzaRegistro ? '· senza registro' : '';
    const peso = r.eleggibile === undefined ? ' ' : r.eleggibile ? '€' : '·';
    const rischio = /not at risk|^n\/a$|^$/i.test(r.rischio) ? '' : ` · ${r.rischio}`;
    console.log(`  ${peso} ${r.quando.toISOString().slice(0, 10)}  ${taglia(r.account, 24).padEnd(24)} ${taglia(r.prodotto, 26).padEnd(26)} ${soldi(r.rbob).padStart(7)} ${stato}${rischio}`);
  }
  if (radar.eleggibili.length) console.log('  («€» = il prodotto conta per M1/M2 del Goal Sheet · «·» = relazione, non attainment)');
}

if (fermi.length) {
  console.log(`\nFERMI da più di ${GIORNI_FERMO} giorni: ${fermi.length}`);
  for (const c of fermi) console.log(`  · ${c.cliente} — fermo da ${giorni(c.aggiornato!)} gg · ${aperti(c).length} ${aperti(c).length === 1 ? 'caso aperto' : 'casi aperti'}`);
}

if (bookScoperti.length) {
  const tot = bookScoperti.reduce((s, b) => s + b.arr, 0);
  console.log(`\nCOPERTURA — account del book senza registro: ${bookScoperti.length} su ${radar.book.length}, ${soldi(tot)} di ARR`);
  for (const b of bookScoperti.slice(0, 12)) {
    const rin = radar.rinnovi.filter((r) => norm(r.account) === norm(b.account) && giorni(r.quando) > -GIORNI_RINNOVO && giorni(r.quando) <= 0);
    const nota = rin.length ? ` · ${rin.length} rinnov${rin.length === 1 ? 'o' : 'i'} entro ${GIORNI_RINNOVO} gg` : '';
    console.log(`  · ${taglia(b.account, 26).padEnd(26)} ${soldi(b.arr).padStart(7)}${nota}`);
  }
  if (bookScoperti.length > 12) console.log(`  … e altri ${bookScoperti.length - 12}`);
  console.log('  (il registro lo crea il primo `/account-open <Account>`)');
}

if (fuoriBook.length) {
  console.log(`\nFUORI DAL BOOK — cartelle che non corrispondono a un account del Radar: ${fuoriBook.length}`);
  console.log('  ' + fuoriBook.map((c) => c.cliente).join(' · '));
  console.log('  (lavoro fuori dai tuoi account, oppure un nome che non combacia: in quel caso si aggiunge una riga a Radar/alias_cartelle.md)');
}

if (!SOLO_FERMI) {
  console.log('\nTutti gli account:');
  for (const c of conRegistro) {
    const eta = c.aggiornato ? `${giorni(c.aggiornato)} gg` : '?';
    const righe = radar.book.filter((x) => contoDi(x.account) === c);
    const somma = righe.reduce((t, x) => t + x.arr, 0);
    const arr = righe.length ? ` · ${soldi(somma)}${righe.length > 1 ? ` (${righe.length} entità)` : ''}` : '';
    console.log(`  ${c.cliente.padEnd(24)} agg. ${eta.padStart(6)}   ${aperti(c).length} aperti${arr}` + (c.illeggibile ? `   ⚠ ${c.illeggibile}` : ''));
    for (const k of aperti(c)) {
      const palla = k.palla ? ` · palla: ${taglia(k.palla, 28)}` : '';
      const da = k.dal ? ` (da ${giorni(k.dal)} gg)` : '';
      console.log(`      ${taglia(k.nome, 44)}${palla}${da}`);
    }
  }
  if (senza.length) {
    console.log('\nCartelle senza registro — il primo `/account-open` lo crea:');
    console.log('  ' + senza.map((c) => c.cliente).join(' · '));
  }
}

if (!scaduti.length && !fermi.length && !rinnoviVicini.length) console.log('\nNiente scaduto, niente fermo da settimane, nessun rinnovo vicino.');
console.log('\n⚠️  Legge i registri e il Radar, non la posta: un registro vecchio lo segnala, un registro sbagliato no. Quello lo scopre `/account-open`.');
