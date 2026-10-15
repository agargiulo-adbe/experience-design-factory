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
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
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
/* --cross: la mappa del cross-sell, SOLO a richiesta. Una casella vuota non è
   un'opportunità: le fonti interne del ruolo sono esplicite — si parte da un segnale
   del cliente, non dallo SKU che manca, e proporre un upgrade senza un caso d'uso è
   un approccio debole. Quindi è una mappa da incrociare, non un elenco da lavorare,
   e per questo non entra nella notifica. */
const SOLO_CROSS = process.argv.includes('--cross');
/* --apertura: UNA conversazione da avviare oggi, scelta in modo deterministico fra i
   segnali del Radar incrociati col grafo dei contatti. Costa zero token: è selezione, non
   giudizio. Con --deposita scrive la riga nel Registro opportunità, perché la decisione
   abbia dove andare; senza, stampa e non tocca niente. */
const SOLO_APERTURA = process.argv.includes('--apertura');
const DEPOSITA = process.argv.includes('--deposita');
const I_DECIDI = process.argv.indexOf('--decidi');
const GIORNI_FERMO = 21;
const GIORNI_RINNOVO = 120;
const GIORNI_SNAPSHOT_VECCHIO = 45;
const GIORNI_RINNOVO_NOTIFICA = 30;   // nella notifica si guarda vicino, non a 120 gg
const GIORNI_EVENTO = 14;             // un evento entro due settimane
const GIORNI_ISCRIZIONE = 3;          // una scadenza d'isciizione è più urgente dell'evento
const GIORNI_GIRO_FERMO = 2;          // oltre questo, il cron potrebbe essere morto
const GIORNI_GRAFO = 7;               // il grafo dei contatti cambia lentamente: una passata a settimana
const MAX_RIGHE_NOTIFICA = 5;
const GIORNI_OPP_VICINA = 21;      // una trattativa che chiude entro tre settimane
const MESI_OPP_FERMA = 18;         // oltre, è residuo di dati e non una trattativa
const GIORNI_DOPO = 21;            // «DOPO» vuol dire tre settimane, non «mai più»
/* Un'apertura senza risposta non si ripropone il giorno dopo (sarebbe rumore) ma nemmeno
   per sempre (una proposta non risposta è più spesso persa che rifiutata): dopo una
   settimana ritorna, con lo STESSO id, così non nascono righe doppie. */
const GIORNI_APERTURA_ATTESA = 7;
/* IL RITORNO DI UN DECK. Una settimana è il tempo in cui un deck o è stato girato ai
   colleghi o è morto nella casella: prima è presto per chiedere, dopo la risposta non
   è più fresca. Vale anche quando la riunione è andata bene — anzi, soprattutto. */
const GIORNI_RITORNO = 7;

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
/** ⚠️ NON si usa `toISOString()`: le date nascono come mezzanotte LOCALE e in UTC
    diventano il giorno prima (CEST = +2), quindi ogni scadenza veniva stampata con un
    giorno di anticipo — una chiusura del 21 si leggeva 20. Un errore di un
    giorno su una data di chiusura è esattamente il genere di cosa che fa perdere una
    scadenza. Qui si formatta dai componenti locali. */
const iso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

/** Raggruppa righe in paragrafi: una riga a indentazione zero apre, le righe indentate
    continuano. Serve perché un elenco scritto a mano va a capo dove capita. */
const paragrafi = (righe: string[]): string[] => {
  const out: string[] = [];
  for (const r of righe) {
    if (!r.trim() || /^#{1,6}\s/.test(r.trim())) { continue; }
    if (/^\s{2,}\S/.test(r) && out.length) out[out.length - 1] += ' ' + r.trim();
    else out.push(r.trim());
  }
  return out;
};

/* ── i registri di account ──────────────────────────────────────────────────────── */
/** `consegnato`/`ritorno`: che cosa è uscito verso il cliente e che cosa ne è tornato.
    Non è burocrazia — è l'unica misura che abbiamo su ciò che resta in testa a chi
    riceve un deck, e finché non c'è, ogni discussione su come si chiude un deck è
    una partita fra opinioni. Si scrivono nel registro così:
      Consegnato — «Dove può arrivare il viaggio» · il 16 ott 2026
      Ritorno — hanno capito che chiediamo mezza giornata sui dati agenzie · il 23 ott 2026 */
interface Caso {
  nome: string; palla?: string; dal?: Date; passo?: string; scadenza?: Date; chiuso?: Date;
  consegnato?: { cosa: string; quando: Date }; ritorno?: Date;
}
/* contatti/tuoi: il grafo dei contatti vive nella sezione «Chi è chi» del registro, e lo
   ricava `/account-open` dalla posta (regola e limiti misurati in docs/CLAUDE.md). Qui si
   LEGGE soltanto — a costo zero — per sapere a quali account manca il contatto: senza un
   contatto noto un'apertura non si costruisce, e questo è l'unico modo di accorgersene
   senza aprirli tutti a mano. */
/** Una riga del grafo. `verdetto` manca quando il grafo è nel formato vecchio (prosa senza
    verdetto): non è un errore ed è diverso da «nessun contatto», ma un'apertura non può
    dichiarare «scrivi tu» su una riga che non lo dice. */
interface Contatto { funzione: string; nome: string; ultimo?: Date; tema?: string; verdetto?: 'tu' | 'ae'; motivo?: string; daRifare?: boolean }
interface Conto {
  cliente: string; aggiornato?: Date; senzaRegistro?: boolean; casi: Caso[]; illeggibile?: string;
  dominio?: string; grafo?: Date; contatti: Contatto[];
}

const conti: Conto[] = [];
for (const cliente of readdirSync(DOCS).sort()) {
  const dir = join(DOCS, cliente);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
  if (cliente.startsWith('.') || DEPOSITI.has(cliente)) continue;

  const registro = join(dir, 'ACCOUNT.md');
  if (!existsSync(registro)) { conti.push({ cliente, senzaRegistro: true, casi: [], contatti: [] }); continue; }

  const righe = readFileSync(registro, 'utf8').split('\n');
  const conto: Conto = { cliente, casi: [], contatti: [] };

  for (const r of righe.slice(0, 12)) {
    const a = r.match(/aggiornato\s+(.+?)\s*$/i);
    if (a && !conto.aggiornato) { conto.aggiornato = data(a[1]); break; }
  }
  if (!conto.aggiornato) conto.illeggibile = 'manca il campo «aggiornato» nell\'intestazione';

  let corrente: Caso | undefined;
  let inChiEChi = false;
  const righeChiEChi: string[] = [];
  for (const r of righe) {
    const caso = r.match(/^##\s*Caso\s*[·:]\s*(.+?)\s*$/i);
    if (caso) { corrente = { nome: caso[1] }; conto.casi.push(corrente); inChiEChi = false; continue; }
    if (r.startsWith('## ')) { corrente = undefined; inChiEChi = /^##\s*Chi\s+è\s+chi/i.test(r); continue; }
    if (inChiEChi) {
      const dom = r.match(/^Dominio:\s*([^\s·]+)/i);
      if (dom) {
        conto.dominio = dom[1];
        const g = r.match(/grafo aggiornato\s+(.+?)\s*$/i);
        if (g) conto.grafo = data(g[1]);
        continue;
      }
      righeChiEChi.push(r);
      continue;
    }
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
    const cons = r.match(/^Consegnat[oa]\s*[—-]\s*(.+?)\s*$/i);
    if (cons) {
      const [cosa, quando] = cons[1].split(/\s*·\s*il\s+/i);
      const d = quando ? data(quando) : undefined;
      if (d) corrente.consegnato = { cosa: cosa.replace(/^[«"]|[»"]$/g, '').trim(), quando: d };
      continue;
    }
    const rit = r.match(/^Ritorno\s*[—-]\s*(?:.+?·\s*il\s+|.*?)\s*$/i);
    if (rit) {
      const q = r.match(/·\s*il\s+(.+?)\s*$/i);
      corrente.ritorno = (q ? data(q[1]) : undefined) ?? new Date();
      continue;
    }
    const passo = r.match(/^Prossimo passo\s*[—-]\s*(.+?)\s*$/i);
    if (passo) {
      corrente.passo = passo[1];
      const entro = passo[1].match(/entro\s+(.+?)\s*$/i);
      if (entro) corrente.scadenza = data(entro[1]);
    }
  }

  /* I contatti si leggono a PARAGRAFI, non a righe: un bullet che va a capo tiene la data
     sulla riga di continuazione, e tre formati diversi convivono nei registri scritti prima
     di questa regola. Si legge in modo strutturato **solo** il formato corrente; gli altri
     si contano e si marcano «da rifare», perché indovinare quale metà di «X — Y» sia il
     nome è esattamente il genere di scorciatoia che mette la persona sbagliata in
     un'apertura. */
  for (const par of paragrafi(righeChiEChi)) {
    if (!/·\s*ultimo scambio\s/i.test(par)) continue;
    const corpo = par.replace(/^[-*]\s+/, '');
    const campi = corpo.split(/\s+·\s+/);
    const iUlt = campi.findIndex((x) => /^ultimo scambio\s/i.test(x));
    const ultimo = iUlt >= 0 ? data(campi[iUlt].replace(/^ultimo scambio\s+/i, '')) : undefined;
    const coda = campi.slice(iUlt + 1).join(' · ');
    const verdetto = /scrivi tu/i.test(coda) ? 'tu' as const : /passa dall'AE/i.test(coda) ? 'ae' as const : undefined;
    if (iUlt >= 3 && verdetto) {
      conto.contatti.push({
        funzione: campi[0] ?? '', nome: campi[1] ?? '', ultimo,
        tema: campi[iUlt + 1], verdetto,
        motivo: coda.split(/\s+—\s+/).slice(1).join(' — ') || undefined,
      });
    } else {
      conto.contatti.push({ funzione: '', nome: '', ultimo, daRifare: true });
    }
  }
  conti.push(conto);
}

/* ── il Radar ─────────────────────────────────────────────────────────────────── */
interface Rinnovo { account: string; prodotto: string; quando: Date; rbob: number; rischio: string; eleggibile?: boolean }
interface Opportunita { account: string; nome: string; prodotto: string; stage: string; valore: number; chiude: Date; eleggibile?: boolean }
interface Salute { account: string; solution: string; stato: string; ragione: string }
const radar = {
  presente: existsSync(RADAR),
  snapshot: undefined as Date | undefined,
  book: [] as { account: string; arr: number }[],
  rinnovi: [] as Rinnovo[],
  opportunita: [] as Opportunita[],
  salute: [] as Salute[],
  posseduti: new Map<string, Set<string>>(),
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

    /* P2: che cosa ogni account POSSIEDE — serve alla mappa del cross-sell.
       ⚠️ Il file ha DUE blocchi P2 con formati diversi, e leggerne uno solo lascia
       nove account con la casella «ha» vuota pur avendo milioni di ARR (visto su
       Amplifon): uno **aggregato** `Account;Solution;ARR;…` (23 account) e uno
       **per SKU** `Account; Prodotto (SIGLA); Edition; ARR;…` (9). Quindi l'ARR non
       sta a un indice fisso: si cerca la prima colonna numerica dopo il prodotto. */
    const j0 = s.indexOf('## P2 Prodotti');
    if (j0 >= 0) {
      for (const r of s.slice(j0).split('\n')) {
        const c = r.split(';').map((x) => x.trim());
        if (c.length < 4 || !c[0] || c[0] === 'Account' || c[0].startsWith('#') || c[0].startsWith('|')) continue;
        if (!c[1] || /^Product/i.test(c[1])) continue;
        const arr = c.slice(2).findIndex((x) => /^[\d][\d.,]*$/.test(x));
        if (arr < 0) continue;                       // nessuna colonna numerica: non è una riga di prodotto
        const set = radar.posseduti.get(c[0]) ?? new Set<string>();
        set.add(norm(c[1]));                         // il nome come scritto
        const sigla = c[1].match(/\(([^)]+)\)/);     // …e la sigla fra parentesi, che è la chiave vera
        if (sigla) set.add(norm(sigla[1]));
        radar.posseduti.set(c[0], set);
      }
    }
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

    // P4: le opportunità aperte. Sono segnali GIÀ qualificati — una trattativa con una
    // data esiste, non va inventata — e per questo entrano nel giro del mattino.
    const q0 = s.indexOf('## P4');
    const q1 = s.indexOf('## P5');
    if (q0 >= 0) {
      for (const r of s.slice(q0, q1 > q0 ? q1 : undefined).split('\n')) {
        const c = r.split(';').map((x) => x.trim());
        if (c.length < 6 || !c[0] || c[0] === 'Account' || /Opportunity name/.test(r)) continue;
        const chiude = data(c[5] ?? '');
        if (!chiude) continue;
        const o: Opportunita = {
          account: c[0], nome: c[1] ?? '', prodotto: c[2] ?? '', stage: c[3] ?? '',
          valore: parseFloat((c[4] ?? '').replace(/,/g, '')) || 0, chiude,
        };
        if (radar.eleggibili.length) o.eleggibile = radar.eleggibili.includes(norm(o.prodotto));
        radar.opportunita.push(o);
      }
    }

    // P5: salute e rischi, con la RAGIONE dichiarata — è quella che rende la riga utile
    const h0 = s.indexOf('## P5');
    const h1 = s.indexOf('## P6');
    if (h0 >= 0) {
      for (const r of s.slice(h0, h1 > h0 ? h1 : undefined).split('\n')) {
        const c = r.split(';').map((x) => x.trim());
        if (c.length < 5 || !c[0] || c[0] === 'Account' || /Current health/.test(r)) continue;
        if (!/^(Yellow|Red)$/i.test(c[2] ?? '')) continue;
        radar.salute.push({ account: c[0], solution: c[1], stato: c[2], ragione: c[4] ?? '' });
      }
    }
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

/* opportunità: quelle con una data davanti, e quelle ferme (data passata). Oltre i
   18 mesi non sono trattative ferme: sono residui di dati, e vanno contati a parte
   invece di gonfiare l'elenco. */
const oppVicine = radar.opportunita
  .filter((o) => giorni(o.chiude) <= 0 && giorni(o.chiude) > -GIORNI_OPP_VICINA)
  .sort((a, b) => +a.chiude - +b.chiude);
const oppFerme = radar.opportunita
  .filter((o) => giorni(o.chiude) > 0 && giorni(o.chiude) < MESI_OPP_FERMA * 30)
  .sort((a, b) => giorni(b.chiude) - giorni(a.chiude));
const oppResidui = radar.opportunita.filter((o) => giorni(o.chiude) >= MESI_OPP_FERMA * 30);
const oppFuture = radar.opportunita.filter((o) => giorni(o.chiude) <= 0).sort((a, b) => +a.chiude - +b.chiude);

/* salute: 30 righe Yellow/Red non stanno in una notifica. Entrano le ROSSE, e le
   gialle solo se quell'account ha un rinnovo entro 120 gg — cioè quando il rischio
   ha una data. Il resto si legge nella vista intera. */
const conRinnovoVicino = new Set(radar.rinnovi
  .filter((r) => giorni(r.quando) > -GIORNI_RINNOVO && giorni(r.quando) <= 0)
  .map((r) => norm(r.account)));
const saluteUrgente = radar.salute.filter((h) =>
  /red/i.test(h.stato) || conRinnovoVicino.has(norm(h.account)));

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
/* una trattativa che chiude fra pochi giorni viene prima di un rinnovo fra un mese:
   l'ordine dei rilievi è una scala di urgenza, non la somma di tre elenchi. */
const perAccountOpp = new Map<string, Opportunita[]>();
for (const o of oppVicine) perAccountOpp.set(o.account, [...(perAccountOpp.get(o.account) ?? []), o]);
for (const [account, righe] of [...perAccountOpp].sort((a, b) => +a[1][0].chiude - +b[1][0].chiude)) {
  const tot = righe.reduce((t, o) => t + o.valore, 0);
  const conta = righe.some((o) => o.eleggibile);
  const che = righe.length === 1 ? taglia(righe[0].prodotto, 20) : `${righe.length} trattative`;
  rilievi.push(`${conta ? '€ ' : ''}${account} · ${che} ${soldi(tot)} chiude fra ${-giorni(righe[0].chiude)} gg`);
}
/* anche qui una riga per ACCOUNT: tre righe rosse dello stesso cliente sono una
   notizia sola, e otto righe di salute su quindici rilievi affogavano tutto il resto.
   La ragione mostrata è quella della prima, con il conteggio delle altre. */
const perAccountSalute = new Map<string, Salute[]>();
for (const h of saluteUrgente.filter((x) => /red/i.test(x.stato))) {
  perAccountSalute.set(h.account, [...(perAccountSalute.get(h.account) ?? []), h]);
}
for (const [account, righe] of perAccountSalute) {
  const che = righe.length === 1 ? righe[0].solution : `${righe.length} solution`;
  rilievi.push(`${account} · ${che} in ROSSO — ${taglia(righe[0].ragione.replace(/^(Commercial|Product|Usage\/Adoption):\s*/, ''), 40)}`);
}

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
if (oppFerme.length) {
  const tot = oppFerme.reduce((t, o) => t + o.valore, 0);
  rilievi.push(`${oppFerme.length} trattative con la data già passata · ${soldi(tot)}`);
}
for (const c of fermi) rilievi.push(`${c.cliente} fermo da ${giorni(c.aggiornato!)} gg · ${aperti(c).length} aperti`);

/* Un account che ha un segnale e NESSUN contatto noto: lì un'apertura non si costruisce,
   e la cosa da fare non è «proporre qualcosa», è «chiedere all'AE chi conosciamo». Senza
   questa riga il buco resta invisibile finché non si apre l'account a mano — ed è il buco
   che rende inutile tutto il resto, perché un segnale senza destinatario non si lavora. */
const conSegnale = new Set<string>(conRegistro.filter((c) => aperti(c).length).map((c) => c.cliente));
for (const r of rinnoviNotifica) { const c = contoDi(r.account); if (c && !c.senzaRegistro) conSegnale.add(c.cliente); }
for (const o of oppVicine) { const c = contoDi(o.account); if (c && !c.senzaRegistro) conSegnale.add(c.cliente); }
/* UNA riga, non una per account: sette righe dello stesso tipo affogano la notifica, ed è
   lo stesso errore già corretto su salute e rinnovi. E `Adobe` resta fuori: non è un
   cliente, non ha contatti di cliente, e chiederne all'AE non vuol dire niente. */
const senzaContatto = conRegistro.filter((c) =>
  c.cliente !== 'Adobe' && conSegnale.has(c.cliente) && !c.contatti.length);
if (senzaContatto.length) {
  const quali = senzaContatto.slice(0, 3).map((c) => c.cliente).join(', ');
  rilievi.push(`${senzaContatto.length} account con un segnale e nessun contatto noto (${quali}${senzaContatto.length > 3 ? '…' : ''}) · il grafo lo ricava /account-open`);
}

/* ── le aperture: una conversazione da avviare, non un fatto da leggere ───────────
   Il resto di questo script dice che cosa sta succedendo. Questo pezzo dice **a chi
   scrivere, per proporre che cosa, e perché oggi** — che è la domanda da cui è nato.
   Quattro campi obbligatori: se ne manca uno l'apertura NON esce, perché una riga senza
   destinatario fa perdere tempo invece di farlo risparmiare. */
interface Apertura {
  conto: Conto; contatto: Contatto;
  /** `cosa` è la CHIAVE (il prodotto o l'evento), quella che il giro di ritorno confronta;
      `proposta` è la frase che si legge. Separarle serve perché la chiave deve restare
      stabile anche se un giorno si cambia come la frase è scritta. */
  cosa: string; proposta: string; perche: string; fonte: string;
  muove: 'M1' | 'M2' | 'relazione'; chiude?: Date;
}
const CHIUSURA_Q4 = radar.fineQuarter;
const chiaveAp = (account: string, cosa: string, nome: string): string =>
  `${norm(account)}|${norm(cosa)}|${norm(nome)}`;

/* Le decisioni già prese, lette dal Registro opportunità. La colonna «Decisione Antonio»
   è di una persona: qui si LEGGE e non si riscrive mai — è la regola scritta in testa a
   quel file, e vale a maggior ragione adesso che qualcuno la usa. */
interface RigaReg { id: string; celle: string[]; iRiga: number }
const FILE_REG = join(RADAR, 'Registro_opportunita.md');
const righeReg: RigaReg[] = [];
const testoReg = existsSync(FILE_REG) ? readFileSync(FILE_REG, 'utf8').split('\n') : [];
testoReg.forEach((r, i) => {
  if (!r.startsWith('|')) return;
  const celle = r.split('|').slice(1, -1).map((x) => x.trim());
  if (celle.length < 9 || !/^A-\d{8}-\d+$/.test(celle[0])) return;
  righeReg.push({ id: celle[0], celle, iRiga: i });
});
const nomeDaRiga = (opportunita: string): string =>
  opportunita.match(/A CHI\s+([^·]+)/)?.[1]?.trim() ?? '';
/** Perché questa combinazione non si ripropone oggi — o `undefined` se si può. */
const bloccata = (ch: string): string | undefined => {
  for (const r of righeReg) {
    if (chiaveAp(r.celle[2], r.celle[4], nomeDaRiga(r.celle[3])) !== ch) continue;
    const dec = r.celle[8];
    const agg = data(r.celle[6]);
    const eta = agg ? giorni(agg) : 0;
    if (/^no\b/i.test(dec)) return 'già detto NO';
    if (/^dopo\b/i.test(dec)) return eta < GIORNI_DOPO ? `DOPO, fra ${GIORNI_DOPO - eta} gg` : undefined;
    if (/^s[iì]\b/i.test(dec)) return 'già SÌ, conversazione in corso';
    if (!dec) return eta < GIORNI_APERTURA_ATTESA ? `proposta ${eta} gg fa, ${r.id}` : undefined;
    return `nota in colonna: ${taglia(dec, 20)}`;   // una nota libera vale come decisione
  }
  return undefined;
};

/* I candidati, nello stesso ordine di urgenza dei rilievi — meno i passi scaduti, che
   sono compiti tuoi e non conversazioni da aprire con un cliente. */
const candidati: Apertura[] = [];
const scartate: string[] = [];
const senzaContattoAp: string[] = [];
const aggiungi = (account: string, cosa: string, proposta: string, perche: string,
                  fonte: string, muove: Apertura['muove'], chiude?: Date): void => {
  const conto = contoDi(account);
  if (!conto || conto.senzaRegistro) { senzaContattoAp.push(`${account} (senza registro)`); return; }
  /* Si sceglie il contatto, non si somma: prima chi ti ha scritto lui e di recente. Le
     righe «da rifare» non si usano — su quelle il nome non è stato letto, è stato visto. */
  const usabili = conto.contatti.filter((x) => !x.daRifare && x.nome);
  const tuoi = usabili.filter((x) => x.verdetto === 'tu');
  const pool = tuoi.length ? tuoi : usabili;
  const contatto = [...pool].sort((a, b) => +(b.ultimo ?? 0) - +(a.ultimo ?? 0))[0];
  if (!contatto) {
    senzaContattoAp.push(conto.contatti.length ? `${conto.cliente} (grafo da rifare)` : conto.cliente);
    return;
  }
  candidati.push({ conto, contatto, cosa, proposta, perche, fonte, muove, chiude });
};

/* ⚠️ Il campo PROPONI dice **di che cosa si parla**, non «vendi questo prodotto». La prima
   versione stampava «PROPONI AAM» su un account che da AAM sta migrando: il segnale era il
   rischio sul rinnovo, e letto come proposta commerciale diventava falso. Il nome del
   prodotto resta la chiave (serve al giro di ritorno); la frase dice il suo verso. */
for (const e of eventiVicini) {
  if (!e.account) continue;
  for (const a of e.account.split(/\s*,\s*/).filter(Boolean)) {
    aggiungi(a, e.nome, `invitarlo a «${e.nome}»`, `l'evento è fra ${-giorni(e.quando!)} gg`,
      'Radar/eventi.md', 'relazione', e.quando);
  }
}
for (const o of oppVicine) {
  aggiungi(o.account, o.prodotto, `far avanzare la trattativa su ${o.prodotto}`,
    `${soldi(o.valore)} chiude fra ${-giorni(o.chiude)} gg · ${o.stage}`,
    'Radar/Panorama', o.eleggibile ? 'M1' : 'relazione', o.chiude);
}
/* Salute rossa e rinnovo sullo stesso prodotto sono UNA notizia, non due: si fondono, e
   la fusione è anche ciò che dà al segnale di salute la data e l'eleggibilità del rinnovo
   — senza, un rischio su un rinnovo eleggibile veniva marcato «relazione». */
for (const h of saluteUrgente.filter((x) => /red/i.test(x.stato))) {
  const ragione = taglia(h.ragione.replace(/^(Commercial|Product|Usage\/Adoption):\s*/, ''), 60);
  const rin = radar.rinnovi.find((r) => norm(r.account) === norm(h.account) && norm(r.prodotto) === norm(h.solution)
    && giorni(r.quando) <= 0 && giorni(r.quando) > -GIORNI_RINNOVO);
  if (rin) {
    aggiungi(h.account, h.solution, `difendere il rinnovo di ${h.solution}`,
      `salute ROSSA (${ragione}) e rinnovo ${soldi(rin.rbob)} fra ${-giorni(rin.quando)} gg`,
      'Radar/Anagrafica + Panorama', rin.eleggibile ? 'M2' : 'relazione', rin.quando);
  } else {
    aggiungi(h.account, h.solution, `capire il rischio su ${h.solution}`,
      `salute in ROSSO — ${ragione}`, 'Radar/Anagrafica', 'relazione');
  }
}
/* IL RITORNO. Un deck consegnato e mai richiesto indietro è l'unico punto in cui questo
   sistema può misurare che cosa resta in testa a chi riceve — e costa una domanda. Entra
   fra i candidati dell'APERTURA e NON fra i rilievi: le soglie della notifica restano
   quattro, perché ogni soglia in più la diluisce (è scritto dove si costruiscono). */
const senzaRitorno = conti.flatMap((c) =>
  c.casi
    .filter((k) => k.consegnato && !k.ritorno && !k.chiuso && giorni(k.consegnato.quando) >= GIORNI_RITORNO)
    .map((k) => ({ conto: c, caso: k })));
for (const { conto, caso } of senzaRitorno) {
  aggiungi(conto.cliente, caso.consegnato!.cosa,
    `chiedere che cosa è rimasto di «${taglia(caso.consegnato!.cosa, 34)}»`,
    `consegnato ${giorni(caso.consegnato!.quando)} gg fa, nessun ritorno registrato`,
    `${conto.cliente}/ACCOUNT.md`, 'relazione');
}

for (const r of rinnoviNotifica) {
  aggiungi(r.account, r.prodotto, `difendere il rinnovo di ${r.prodotto}`,
    `${soldi(r.rbob)} fra ${-giorni(r.quando)} gg${r.rischio ? ` · ${r.rischio}` : ''}`,
    'Radar/Panorama', r.eleggibile ? 'M2' : 'relazione', r.quando);
}

const ammesse: Apertura[] = [];
for (const a of candidati) {
  const perche = bloccata(chiaveAp(a.conto.cliente, a.cosa, a.contatto.nome));
  if (perche) { scartate.push(`${a.conto.cliente}/${taglia(a.cosa, 14)} (${perche})`); continue; }
  if (ammesse.some((x) => chiaveAp(x.conto.cliente, x.cosa, x.contatto.nome) === chiaveAp(a.conto.cliente, a.cosa, a.contatto.nome))) continue;
  ammesse.push(a);
}

/** L'id è per data e progressivo: serve al giro di ritorno, e deve stare in una notifica. */
const prossimoId = (): string => {
  const pre = `A-${iso(oggi).replace(/-/g, '')}-`;
  const n = righeReg.filter((r) => r.id.startsWith(pre)).length + 1;
  return pre + n;
};
const idEsistente = (a: Apertura): string | undefined =>
  righeReg.find((r) => chiaveAp(r.celle[2], r.celle[4], nomeDaRiga(r.celle[3]))
    === chiaveAp(a.conto.cliente, a.cosa, a.contatto.nome))?.id;

if (I_DECIDI >= 0) {
  const [id, verdetto] = process.argv.slice(I_DECIDI + 1, I_DECIDI + 3);
  const ammessi = ['si', 'sì', 'no', 'dopo'];
  if (!id || !verdetto || !ammessi.includes(verdetto.toLowerCase())) {
    console.log('uso: pnpm accounts --decidi <A-AAAAMMGG-N> <si|no|dopo>');
    process.exit(2);
  }
  const riga = righeReg.find((r) => r.id === id);
  if (!riga) { console.log(`apertura ${id} non trovata in Registro_opportunita.md`); process.exit(2); }
  if (riga.celle[8]) {
    // La colonna non si riscrive mai, nemmeno per «aggiornarla»: è la regola di quel file.
    console.log(`${id} ha già una decisione: «${riga.celle[8]}». Non la riscrivo — si cambia a mano.`);
    process.exit(2);
  }
  const v = verdetto.toLowerCase() === 'no' ? 'NO' : verdetto.toLowerCase() === 'dopo' ? 'DOPO' : 'SÌ';
  riga.celle[8] = v;
  riga.celle[6] = iso(oggi);
  testoReg[riga.iRiga] = `| ${riga.celle.join(' | ')} |`;
  writeFileSync(FILE_REG, testoReg.join('\n'));
  console.log(`${id} → ${v}` + (v === 'NO' ? ' · non si ripropone più'
    : v === 'DOPO' ? ` · torna fra ${GIORNI_DOPO} gg` : ' · l\'esito si chiede a /account-close'));
  process.exit(0);
}

if (SOLO_APERTURA) {
  /* UNA al giorno, per davvero: se oggi una è già stata proposta e non ha ancora una
     decisione, si rimostra quella invece di aggiungerne un'altra. Due lanci nello stesso
     giorno producevano due aperture — e tre al giorno fanno sessanta al mese, che è
     esattamente la quantità che non si lavora e per cui questo sistema è stato scelto
     sottile. Dopo una decisione, la prossima esce. */
  const oggiPre = `A-${iso(oggi).replace(/-/g, '')}-`;
  const giaOggi = righeReg.find((r) => r.id.startsWith(oggiPre) && !r.celle[8]);
  if (giaOggi) {
    /* Si ristampa nello STESSO formato a etichette, non come riga compressa: la notifica
       della mattina ricava «scrivi a X — per Y» da quelle etichette, e un giorno con
       l'apertura pendente perdeva proprio la riga più utile. */
    const op = giaOggi.celle[3];
    const chi = op.match(/A CHI\s+(.*?)(?=\s·\sPROPONI\s|$)/)?.[1] ?? op;
    const prop = op.match(/·\s*PROPONI\s+(.*?)(?=\s·\sPERCHÉ ORA\s|$)/)?.[1] ?? '';
    const perche = op.match(/·\s*PERCHÉ ORA\s+(.*?)(?=\s·\sMUOVE\s|$)/)?.[1] ?? '';
    const muove = op.match(/·\s*MUOVE\s+(.*)$/)?.[1] ?? '';
    console.log(`APERTURA ${giaOggi.id} · già proposta oggi, in attesa di decisione`);
    console.log(`A CHI       ${chi}`);
    if (prop) console.log(`PROPONI     ${prop}  ·  ${giaOggi.celle[2]}`);
    if (perche) console.log(`PERCHÉ ORA  ${perche}`);
    console.log(`MUOVE       ${muove || '—'} · ${giaOggi.celle[5].replace(/^Apertura proposta dal radar · /, '')}`);
    console.log(`\nDecidi:  pnpm accounts --decidi ${giaOggi.id} si|no|dopo   ·  poi esce la prossima`);
    process.exit(0);
  }
  const a = ammesse[0];
  if (!a) {
    console.log('Nessuna apertura oggi.');
    if (senzaContattoAp.length) console.log(`Senza contatto noto: ${[...new Set(senzaContattoAp)].join(' · ')} — chiedi all'AE`);
    if (scartate.length) console.log(`Scartate ${scartate.length}: ${scartate.slice(0, 4).join(' · ')}`);
    process.exit(0);
  }
  const id = idEsistente(a) ?? prossimoId();
  if (DEPOSITA && !idEsistente(a)) {
    const op = `A CHI ${a.contatto.nome} · ${a.contatto.funzione} · ${a.contatto.verdetto === 'tu' ? 'scrivi tu' : "passa dall'AE"}${a.contatto.motivo ? ` — ${a.contatto.motivo}` : ''} · PROPONI ${a.proposta} · PERCHÉ ORA ${a.perche} · MUOVE ${a.muove}`;
    const q4 = CHIUSURA_Q4 && a.chiude ? (+a.chiude <= +CHIUSURA_Q4 ? 'Q4 sì' : 'costruisce il Q1') : 'Q4 da valutare';
    const celle = [id, iso(oggi), a.conto.cliente, op.replace(/\|/g, '/'), a.cosa.replace(/\|/g, '/'),
      `Apertura proposta dal radar · ${q4} · in attesa di decisione`, iso(oggi), a.fonte, ''];
    writeFileSync(FILE_REG, testoReg.join('\n').replace(/\n*$/, '\n') + `| ${celle.join(' | ')} |\n`);
  }
  const q4 = CHIUSURA_Q4 && a.chiude
    ? (+a.chiude <= +CHIUSURA_Q4 ? `sì, chiude entro il ${a.chiude.getDate()}/${a.chiude.getMonth() + 1}` : 'no — costruisce il Q1')
    : 'da valutare';
  console.log(`APERTURA ${id}`);
  console.log(`A CHI       ${a.contatto.nome} · ${a.contatto.funzione}`);
  console.log(`            ${a.contatto.verdetto === 'tu' ? 'scrivi tu' : "passa dall'AE"}${a.contatto.motivo ? ` — ${a.contatto.motivo}` : ''}`);
  console.log(`PROPONI     ${a.proposta}  ·  ${a.conto.cliente}`);
  console.log(`PERCHÉ ORA  ${a.perche} · ${a.fonte}`);
  console.log(`MUOVE       ${a.muove} · Q4? ${q4}`);
  if (ammesse.length > 1) {
    console.log(`\nScartate ${ammesse.length - 1 + scartate.length}, più lontane dalla data o già decise:`);
    console.log('  ' + [...ammesse.slice(1, 4).map((x) => `${x.conto.cliente}/${taglia(x.cosa, 14)}`), ...scartate.slice(0, 3)].join(' · '));
  }
  if (senzaContattoAp.length) {
    console.log(`\nSenza contatto noto, quindi fuori dalle aperture: ${[...new Set(senzaContattoAp)].slice(0, 6).join(' · ')}`);
    console.log("  Non vuol dire «nessuna opportunità»: vuol dire chiedere all'AE chi conosciamo, o rifare il grafo con /account-open.");
  }
  console.log(`\nDecidi:  pnpm accounts --decidi ${id} si|no|dopo   ·  NO = mai più · DOPO = fra ${GIORNI_DOPO} gg · SÌ = l'esito a /account-close`);
  process.exit(0);
}

if (SOLO_RILIEVI) {
  // Contratto col cron: niente da dire = nessun output = nessuna notifica.
  for (const r of rilievi.slice(0, MAX_RIGHE_NOTIFICA)) console.log(r);
  if (rilievi.length > MAX_RIGHE_NOTIFICA) console.log(`e altre ${rilievi.length - MAX_RIGHE_NOTIFICA} cose`);
  process.exit(0);
}

if (SOLO_CROSS) {
  /* La mappa, non un elenco di cose da fare. Si legge così: a sinistra quello che
     l'account ha fra i prodotti che contano per il piano, a destra quello che non ha.
     Una casella vuota diventa un'opportunità SOLO incrociata con un segnale — una
     frase del cliente, uno sforamento, un rinnovo, un evento. Senza quel segnale,
     proporre il prodotto che manca è l'approccio che le fonti interne giudicano debole. */
  const CHIAVE = ['analytics', 'cja', 'target', 'rtcdp', 'journey ajo', 'campaign',
    'marketo engage', 'content analytics', 'aep add on data distiller',
    'agent orchestrator cx enterprise coworker'];
  /* Le sigle del footprint non sono i nomi del Goal Sheet: la mappa è dichiarata qui
     invece di essere indovinata, perché un abbinamento mancato fa sembrare scoperto
     un prodotto che l'account ha già — il peggiore degli errori su una mappa di
     cross-sell, perché porta a proporre quello che il cliente ha comprato. */
  const SIGLE: Record<string, string> = {
    aa: 'analytics', at: 'target', aepcdp: 'rtcdp', ajo: 'journey ajo', ac: 'campaign',
    rtcdp: 'rtcdp', cja: 'cja', aam: 'aam', 'genstudio modules': 'genstudio',
    sites: 'sites', assets: 'assets',
  };
  const ha = (acc: string): Set<string> => {
    const out = new Set<string>();
    for (const x of radar.posseduti.get(acc) ?? []) out.add(SIGLE[x] ?? x);
    return out;
  };
  console.log(`\naccounts --cross · la mappa del cross-sell su ${radar.book.length} account del book`);
  console.log('Fonte: Radar/Mappa_Account (PanoAI) × i prodotti eleggibili del Goal Sheet.\n');
  let vuote = 0;
  for (const b of radar.book) {
    const p = ha(b.account);
    const presenti = CHIAVE.filter((k) => p.has(k));
    const manca = CHIAVE.filter((k) => !p.has(k));
    vuote += manca.length;
    const c = contoDi(b.account);
    const reg = !c ? ' ·senza cartella' : c.senzaRegistro ? ' ·senza registro' : '';
    console.log(`  ${taglia(b.account, 24).padEnd(24)} ${soldi(b.arr).padStart(7)}${reg}`);
    console.log(`      ha      ${presenti.length ? presenti.map((x) => taglia(x, 16)).join(' · ') : '— (niente fra i prodotti che contano per il piano)'}`);
    console.log(`      non ha  ${manca.map((x) => taglia(x, 16)).join(' · ')}`);
  }
  console.log(`\nCaselle vuote su prodotti che contano per il piano: ${vuote}`);
  console.log('\n⚠️  Questa è una MAPPA, non un elenco di cose da fare. Una casella vuota diventa');
  console.log('    un\'opportunità solo incrociata con un segnale del cliente: proporre il prodotto');
  console.log('    che manca senza un caso d\'uso è l\'approccio che le fonti interne del ruolo');
  console.log('    giudicano debole. Il segnale lo trova `/account-open`, non questo elenco.');
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

if (senzaRitorno.length) {
  console.log(`\nCONSEGNATI SENZA RITORNO — è uscito qualcosa e non sappiamo che cosa è rimasto: ${senzaRitorno.length}`);
  for (const { conto, caso } of senzaRitorno.sort((a, b) => +a.caso.consegnato!.quando - +b.caso.consegnato!.quando)) {
    console.log(`  ? ${taglia(conto.cliente, 20).padEnd(20)} ${taglia(caso.consegnato!.cosa, 40).padEnd(40)} ${giorni(caso.consegnato!.quando)} gg fa`);
  }
  console.log('  (una domanda sola: «che cosa vi è rimasto?» — poi la riga «Ritorno — … · il <data>» nel registro)');
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
    console.log(`  ${peso} ${iso(r.quando)}  ${taglia(r.account, 24).padEnd(24)} ${taglia(r.prodotto, 26).padEnd(26)} ${soldi(r.rbob).padStart(7)} ${stato}${rischio}`);
  }
  if (radar.eleggibili.length) console.log('  («€» = il prodotto conta per M1/M2 del Goal Sheet · «·» = relazione, non attainment)');
}

if (oppFuture.length) {
  const tot = oppFuture.reduce((t, o) => t + o.valore, 0);
  const conta = oppFuture.filter((o) => o.eleggibile);
  console.log(`\nTRATTATIVE APERTE con una data davanti: ${oppFuture.length} · ${soldi(tot)}` +
    (radar.eleggibili.length ? ` · di cui ${conta.length} su prodotti che contano (${soldi(conta.reduce((t, o) => t + o.valore, 0))})` : ''));
  for (const o of oppFuture) {
    const c = contoDi(o.account);
    const stato = !c ? '· NESSUNA CARTELLA' : c.senzaRegistro ? '· senza registro' : '';
    const peso = o.eleggibile === undefined ? ' ' : o.eleggibile ? '€' : '·';
    console.log(`  ${peso} ${iso(o.chiude)}  ${taglia(o.account, 22).padEnd(22)} ${taglia(o.prodotto, 20).padEnd(20)} ${soldi(o.valore).padStart(7)}  ${taglia(o.stage, 22).padEnd(22)} ${stato}`);
  }
}

if (oppFerme.length || oppResidui.length) {
  if (oppFerme.length) {
    console.log(`\nTRATTATIVE FERME — la data di chiusura è passata e sono ancora aperte: ${oppFerme.length} · ${soldi(oppFerme.reduce((t, o) => t + o.valore, 0))}`);
    for (const o of oppFerme) {
      console.log(`  ! ${iso(o.chiude)}  ${taglia(o.account, 22).padEnd(22)} ${taglia(o.prodotto, 20).padEnd(20)} ${soldi(o.valore).padStart(7)}  da ${giorni(o.chiude)} gg`);
    }
  }
  if (oppResidui.length) {
    console.log(`  (più ${oppResidui.length} con data oltre i ${MESI_OPP_FERMA} mesi: non sono trattative ferme, sono residui di dati — si ripuliscono nel CRM, non qui)`);
  }
}

if (radar.salute.length) {
  const rosse = radar.salute.filter((h) => /red/i.test(h.stato));
  const gialleUrgenti = saluteUrgente.filter((h) => !/red/i.test(h.stato));
  console.log(`\nSALUTE — ${radar.salute.length} solution in Yellow o Red` +
    (saluteUrgente.length ? ` · ${saluteUrgente.length} con una data vicina o in rosso` : ''));
  for (const h of [...rosse, ...gialleUrgenti]) {
    const c = contoDi(h.account);
    const stato = !c ? '· NESSUNA CARTELLA' : c.senzaRegistro ? '· senza registro' : '';
    console.log(`  ${/red/i.test(h.stato) ? '!' : '·'} ${taglia(h.account, 22).padEnd(22)} ${taglia(h.solution, 16).padEnd(16)} ${h.stato.padEnd(6)} ${taglia(h.ragione, 50).padEnd(50)} ${stato}`);
  }
  const altre = radar.salute.length - rosse.length - gialleUrgenti.length;
  if (altre > 0) console.log(`  (più ${altre} in Yellow senza una data vicina: croniche, si guardano quando si apre l'account)`);
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
    /* «grafo —» non vuol dire che non conosciamo nessuno: vuol dire che il grafo non è
       stato ancora ricavato (lo fa `/account-open`). I due casi si confondono facilmente
       ed è la confusione che porterebbe a scrivere «nessun contatto» in un'apertura. */
    const tuoi = c.contatti.filter((x) => x.verdetto === 'tu').length;
    const rifare = c.contatti.filter((x) => x.daRifare).length;
    const grafo = c.contatti.length
      ? ` · ${c.contatti.length} contatti${tuoi ? ` (${tuoi} tuoi)` : ''}${rifare ? ` · ${rifare} da rifare` : ''}${c.grafo && giorni(c.grafo) > GIORNI_GRAFO ? ` · grafo di ${giorni(c.grafo)} gg` : ''}`
      : ' · grafo —';
    console.log(`  ${c.cliente.padEnd(24)} agg. ${eta.padStart(6)}   ${aperti(c).length} aperti${arr}${grafo}` + (c.illeggibile ? `   ⚠ ${c.illeggibile}` : ''));
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
