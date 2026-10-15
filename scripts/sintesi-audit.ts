/**
 * sintesi-audit — ogni capitolo si chiude su una frase, e la frase dice che cosa
 * cambia per il cliente.
 *
 * PERCHÉ ESISTE
 * Perché i nostri dodici gate rispondono tutti alla stessa domanda — «si legge?»
 * — e nessuno rispondeva a quella che giudica il cliente: «che cosa mi porto
 * via?». Misurato il 14 ott 2026 sul DOM reso dei quattordici deck: 532 slide,
 * mediana 96 parole per slide, 32% oltre 120 parole, e **27 capitoli su 114** con
 * una sintesi esplicita. Un deck denso e perfetto passava tutto.
 *
 * La letteratura dice due cose che qui diventano check. La prima: si impara più
 * da grafica e voce che da grafica, voce e testo a schermo (principio di
 * ridondanza di Mayer, 16 esperimenti su 16) — quindi il carico di lettura per
 * slide è una misura, non un gusto. La seconda: un titolo che è una frase
 * assertiva si ricorda più dello stesso contenuto messo in elenco (Alley,
 * assertion-evidence) — quindi un titolo di due parole è un'etichetta, e si vede.
 *
 * CHE COSA CONTROLLA
 *   HARD · s1 capitolo senza punto — una rotta di capitolo che non porta UNA e una
 *          sola chiusura: `[data-punto]` (ChapterPoint) per i capitoli, e
 *          `[data-chiusura]` (DeckClose) per l'ULTIMO, che chiude il cerchio —
 *          la domanda d'apertura, la risposta in una riga, la richiesta. Due
 *          chiusure nello stesso capitolo sono una di troppo.
 *   HARD · s2 punto scritto a mano — la frase resa non si trova nella fonte unica
 *          dichiarata: una frase in due posti diverge, come il taglio corto.
 *   HARD · s3 punto non valido — oltre `paroleMax` parole non è una sintesi ma un
 *          paragrafo corto; e il segnaposto del generatore non è un punto.
 *   HARD · s4 punto non in chiusura — il punto c'è ma non è l'ultima slide del
 *          capitolo (la slide-firma, dove il contratto del co-brand la richiede,
 *          non conta: è un lockup, non un contenuto).
 *   SOFT · s5 budget di lettura — mediana e novantesimo percentile delle parole
 *          per slide oltre il budget, con l'elenco delle slide peggiori. È la
 *          lista di cosa alleggerire, e si alleggerisce TAGLIANDO o dividendo la
 *          slide: mai rimpicciolendo il tipo (contratto di leggibilità).
 *   SOFT · s6 titoli etichetta — titoli di tre parole o meno: un'etichetta non
 *          afferma niente, e il punto della slide torna a dipendere da chi parla.
 *
 * CHE COSA NON CONTROLLA
 * Che il messaggio sia GIUSTO, e che sia un beneficio per il cliente invece di
 * una proprietà del prodotto. Quello è il «So what?» del whiteboarding, e resta
 * un giudizio umano: lo chiede il panel (`/panel-review`), una persona per volta.
 * Il gate verifica che la frase esista, sia una frase, stia in fondo e venga da
 * un posto solo.
 *
 *   DECK_URL=http://localhost:4402 npx tsx scripts/sintesi-audit.ts --app <alias> [--only <rotta>]
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import * as path from 'node:path';
import { ROUTE_SETS, CWD_ALIAS } from './lib/deck-routes';
import { SINTESI_SETS, PAROLE_MAX_DEFAULT, BUDGET_DEFAULT } from './lib/sintesi-apps';

const flag = (n: string): string | undefined => {
  const i = process.argv.indexOf(`--${n}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};
const asked = flag('app') ?? process.cwd().split('/').pop() ?? '';
const app = ROUTE_SETS[asked] ? asked : (CWD_ALIAS[asked] ?? asked);
const spec = SINTESI_SETS[app];

if (!spec) {
  const daMigrare = Object.keys(ROUTE_SETS).filter((a) => !SINTESI_SETS[a]);
  console.log(`\nsintesi-audit · «${app}» non è ancora dichiarata: nessun capitolo viene verificato.`);
  console.log(`  dichiarate: ${Object.keys(SINTESI_SETS).join(', ') || '—'}`);
  console.log(`  da migrare: ${daMigrare.join(', ')}`);
  console.log(`  (si dichiara in scripts/lib/sintesi-apps.ts, dopo aver messo «Il punto» in fondo a ogni capitolo)`);
  process.exit(0);
}

/* ── DECK_URL è l'ORIGIN, non il percorso ─────────────────────────────────
   Le rotte nel route set sono già percorsi interi: con un DECK_URL che porta
   anche il percorso ogni pagina è un 404 e il gate misura il nulla. Qui si
   taglia e si dice che si è tagliato, invece di aspettare il timeout. */
const dato = process.env.DECK_URL ?? 'http://localhost:4321';
const u = new URL(dato);
const BASE = `${u.protocol}//${u.host}`;
if (u.pathname !== '/' && u.pathname !== '') {
  console.log(`sintesi-audit · DECK_URL è l'origin: ignoro il percorso «${u.pathname}» e uso ${BASE}`);
}

const APP_DIR = path.resolve('apps', app);
const paroleMax = spec.paroleMax ?? PAROLE_MAX_DEFAULT;
const budget = spec.budget ?? BUDGET_DEFAULT;
const only = flag('only');
const tutte = ROUTE_SETS[app];
const capitoli = tutte
  .filter((r) => !spec.escluse.includes(r.name))
  .filter((r) => !only || r.name === only);
if (!capitoli.length) {
  console.error(`sintesi-audit: nessuna rotta da verificare (--only «${only}»?). Rotte: ${tutte.map((r) => r.name).join(', ')}`);
  process.exit(2);
}

/* Normalizza anche la SCRITTURA dello spazio unificatore: in pagina è il carattere,
   nel sorgente può essere l'escape `\u00a0` (che si vede e non si perde copiando).
   Senza questa riga il gate dichiara «non viene dalla fonte unica» una frase che
   viene esattamente da lì — ed è il tipo di falso positivo che fa spegnere un gate. */
const norm = (s: string) =>
  s.replace(/\u00a0/g, ' ').replace(/\\u00a0/g, ' ').replace(/\s+/g, ' ').replace(/[\u2018\u2019\u2032']/g, "'").replace(/[\u201c\u201d]/g, '"').trim();
let fonte = '';
for (const f of spec.fonti) {
  const p = path.join(APP_DIR, f);
  if (!existsSync(p)) {
    console.error(`sintesi-audit: la fonte dichiarata non esiste: ${path.relative(process.cwd(), p)}`);
    process.exit(2);
  }
  fonte += '\n' + norm(readFileSync(p, 'utf8'));
}

/* ── che cosa si misura in pagina ─────────────────────────────────────────── */
interface SlideReso { id: string; parole: number; titolo: string; punto: string | null; domanda: string | null; risposta: string | null; firma: boolean }

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();

const rese: Array<{ rotta: string; slide: SlideReso[] }> = [];
for (const r of capitoli) {
  await page.goto(BASE + r.route, { waitUntil: 'networkidle' });
  // Niente funzioni con nome dentro evaluate: tsx le trasforma in qualcosa che
  // nel browser non esiste (`__name is not defined`). Solo callback anonime.
  const slide: SlideReso[] = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-slide]')).map((s) => {
      // Testo come lo vede chi guarda: si salta quello che non è reso (la lingua
      // inattiva di un deck bilingue rende entrambe le stringhe nel DOM) e quello
      // che è decorativo (i numeri degli elenchi, marcati aria-hidden).
      // Tutto in linea: una funzione con un nome, qui dentro, tsx la trasforma in
      // qualcosa che nel browser non esiste.
      const h = s.querySelector('h1, h2');
      const p = s.querySelector('[data-punto] .edf-punto-t, .edf-punto-t');
      const cq = s.querySelector('.edf-close-q');
      const ca = s.querySelector('.edf-close-a');
      return {
        id: s.id || '(senza id)',
        // Un deck bilingue tiene ENTRAMBE le lingue nel DOM (contratto `<T>`): si
        // legge solo quella resa, se no la frase risulta doppia e il confronto
        // con la fonte unica fallisce su una copia che è giusta.
        domanda: s.hasAttribute('data-chiusura') ? (cq ? (((Array.from(cq.querySelectorAll('[data-lang-it],[data-lang-en],[data-lang-fr]')).filter((x) => x.getClientRects().length > 0)[0] || cq)).textContent || '').replace(/\s+/g, ' ').trim() : '') : null,
        risposta: s.hasAttribute('data-chiusura') ? (ca ? (((Array.from(ca.querySelectorAll('[data-lang-it],[data-lang-en],[data-lang-fr]')).filter((x) => x.getClientRects().length > 0)[0] || ca)).textContent || '').replace(/\s+/g, ' ').trim() : '') : null,
        parole: [s, ...Array.from(s.querySelectorAll('*'))]
          // Decorativo = un `aria-hidden` DENTRO la slide (i numeri degli
          // elenchi). La slide stessa è aria-hidden quando non è quella attiva,
          // e scartarla per quello voleva dire misurare zero parole su tutto il
          // deck e stampare un PASS: il filtro deve fermarsi al confine della
          // slide. (`getClientRects` non basta a vedere i pannelli richiusi:
          // quelli sono fuori misura, e giustamente — nessuno li legge.)
          .filter((el) => {
            if (el.getClientRects().length === 0) return false;
            const dec = el.closest('[aria-hidden="true"]');
            return !(dec && dec !== s && s.contains(dec));
          })
          .flatMap((el) =>
            Array.from(el.childNodes)
              .filter((n) => n.nodeType === 3)
              .map((n) => (n.nodeValue || '').trim()))
          .filter(Boolean)
          .join(' ')
          .split(/\s+/)
          .filter((w) => /[\p{L}\p{N}]/u.test(w)).length,
        titolo: h ? (((Array.from(h.querySelectorAll('[data-lang-it],[data-lang-en],[data-lang-fr]')).filter((x) => x.getClientRects().length > 0)[0] || h).textContent) || '').replace(/\s+/g, ' ').trim() : '',
        punto: s.hasAttribute('data-punto') ? (p ? (((Array.from(p.querySelectorAll('[data-lang-it],[data-lang-en],[data-lang-fr]')).filter((x) => x.getClientRects().length > 0)[0] || p)).textContent || '').replace(/\s+/g, ' ').trim() : '') : null,
        firma: /signature|firma/i.test(s.id || '') || s.hasAttribute('data-signature'),
      };
    }));
  rese.push({ rotta: r.name, slide });
}
await browser.close();

/* ── i check ──────────────────────────────────────────────────────────────── */
const s1: string[] = [];
const s2: string[] = [];
const s3: string[] = [];
const s4: string[] = [];
const s6: string[] = [];
const paroleTutte: Array<{ rotta: string; id: string; parole: number }> = [];

const ultimoCapitolo = capitoli[capitoli.length - 1]?.name;
for (const { rotta, slide } of rese) {
  const punti = slide.filter((s) => s.punto !== null);
  const chiusure = slide.filter((s) => s.risposta !== null);
  const tutte = [...punti, ...chiusure];
  if (tutte.length === 0) {
    s1.push(`«${rotta}» chiude su «${slide[slide.length - 1]?.id ?? '—'}» e non porta nessun punto`);
  } else if (tutte.length > 1) {
    s1.push(`«${rotta}» porta ${tutte.length} chiusure (${tutte.map((p) => p.id).join(', ')}): un capitolo ne ha una sola`);
  }
  // L'ultimo capitolo chiude il cerchio; gli altri no.
  if (rotta === ultimoCapitolo && chiusure.length === 0 && !only) {
    s1.push(`«${rotta}» è l'ultimo capitolo e non chiude il cerchio: lì va DeckClose (domanda d'apertura + risposta + richiesta), non un punto`);
  }
  if (rotta !== ultimoCapitolo && chiusure.length > 0) {
    s1.push(`«${rotta}» porta la chiusura del deck ma non è l'ultimo capitolo`);
  }
  for (const c of chiusure) {
    const q = norm(c.domanda ?? '');
    const a = norm(c.risposta ?? '');
    if (!q) s2.push(`«${rotta}» · ${c.id}: la chiusura non rende la domanda d'apertura`);
    else if (!fonte.includes(q)) s2.push(`«${rotta}» · ${c.id}: la domanda d'apertura non viene dalla fonte unica — «${q.slice(0, 70)}…»`);
    if (!a) s2.push(`«${rotta}» · ${c.id}: la chiusura non rende la risposta`);
    else {
      if (!fonte.includes(a)) s2.push(`«${rotta}» · ${c.id}: la risposta non viene dalla fonte unica — «${a.slice(0, 70)}…»`);
      const n = a.split(/\s+/).filter(Boolean).length;
      if (n > paroleMax) s3.push(`«${rotta}» · la risposta è di ${n} parole (il tetto è ${paroleMax})`);
    }
  }

  for (const p of punti) {
    const frase = norm(p.punto ?? '');
    if (!frase) {
      s2.push(`«${rotta}» · ${p.id}: la slide è marcata come punto ma non rende nessuna frase`);
      continue;
    }
    if (!fonte.includes(frase)) {
      s2.push(`«${rotta}» · ${p.id}: la frase non viene dalla fonte unica — «${frase.slice(0, 80)}…»`);
    }
    const n = frase.split(/\s+/).filter(Boolean).length;
    if (n > paroleMax) s3.push(`«${rotta}» · ${n} parole (il tetto è ${paroleMax}) — «${frase.slice(0, 80)}…»`);
    // Il segnaposto che il generatore scrive È nella fonte unica ed È corto:
    // passerebbe s2 e s3 senza dire niente. Un capitolo con il segnaposto non è
    // un capitolo con un punto.
    if (/^(da scrivere|todo|segnaposto)\b/i.test(frase)) {
      s3.push(`«${rotta}»: è ancora il segnaposto del generatore — «${frase.slice(0, 60)}…»`);
    }
  }

  // Il punto chiude il capitolo: in coda, o appena prima della slide-firma.
  const coda = [...slide].reverse();
  const primoUtile = coda.find((s) => !s.firma);
  if (tutte.length === 1 && primoUtile && primoUtile.punto === null && primoUtile.risposta === null) {
    s4.push(`«${rotta}»: la chiusura è «${tutte[0].id}» ma il capitolo finisce su «${primoUtile.id}»`);
  }

  for (const s of slide) {
    paroleTutte.push({ rotta, id: s.id, parole: s.parole });
    const tw = s.titolo.split(/\s+/).filter(Boolean).length;
    if (s.titolo && tw <= 3) s6.push(`«${rotta}» · ${s.id}: «${s.titolo}»`);
  }
}

/* ── il gate ha misurato davvero? ─────────────────────────────────────────
   Un giro che non misura niente non è un PASS. Al primo tentativo questo check
   contava zero parole su 31 slide su 32 — il deck marca `aria-hidden` la slide
   non attiva e il filtro del decorativo le cancellava tutte — e il gate stampava
   «SINTETICO» soddisfatto. Qui si ferma, con codice 2, come fa `deck-audit`
   quando una rotta non esiste. */
const vuote = paroleTutte.filter((x) => x.parole === 0).length;
if (paroleTutte.length === 0 || vuote > paroleTutte.length / 2) {
  console.error(`\nsintesi-audit: misura implausibile — ${vuote} slide su ${paroleTutte.length} a zero parole.`);
  console.error('  Non è un PASS: è il gate che non sta leggendo la pagina. Si guarda il selettore prima di fidarsi dell\'esito.');
  process.exit(2);
}

const ordinate = paroleTutte.map((x) => x.parole).sort((a, b) => a - b);
const perc = (q: number) => ordinate[Math.min(ordinate.length - 1, Math.floor(ordinate.length * q))] ?? 0;
const mediana = perc(0.5);
const p90 = perc(0.9);
const sopra = paroleTutte.filter((x) => x.parole > budget.p90).sort((a, b) => b.parole - a.parole);

/* ── esito ────────────────────────────────────────────────────────────────── */
console.log(`\nsintesi-audit · ${app} · ${capitoli.length} capitoli, ${paroleTutte.length} slide misurate`);

if (s1.length) {
  console.log(`\nHARD s1 — capitoli senza «Il punto»: ${s1.length}`);
  for (const x of s1) console.log(`  ✗ ${x}`);
  console.log('  (si chiude con <ChapterPoint messaggio={ch.messaggio} />, e si registra la slide nel PAGE_REGISTRY)');
}
if (s2.length) {
  console.log(`\nHARD s2 — punti che non vengono dalla fonte unica: ${s2.length}`);
  for (const x of s2) console.log(`  ✗ ${x}`);
  console.log(`  (il messaggio sta in ${spec.fonti.join(', ')} e la pagina lo legge: una frase in due posti diverge)`);
}
if (s3.length) {
  console.log(`\nHARD s3 — punti non validi (segnaposto o troppo lunghi): ${s3.length}`);
  for (const x of s3) console.log(`  ✗ ${x}`);
  console.log('  (una sintesi lunga non è una sintesi: si taglia la frase, non il corpo del testo)');
}
if (s4.length) {
  console.log(`\nHARD s4 — punti che non chiudono il capitolo: ${s4.length}`);
  for (const x of s4) console.log(`  ✗ ${x}`);
  console.log('  (l\'ultima impressione del capitolo è la sua ultima slide: il punto va in coda, prima della sola slide-firma)');
}

const budgetFuori = mediana > budget.mediana || p90 > budget.p90;
if (budgetFuori) {
  console.log(`\nSOFT s5 — budget di lettura: mediana ${mediana} parole/slide (budget ${budget.mediana}), novantesimo ${p90} (budget ${budget.p90})`);
  for (const x of sopra.slice(0, 12)) console.log(`  · ${String(x.parole).padStart(4)} parole — «${x.rotta}» ${x.id}`);
  if (sopra.length > 12) console.log(`  · … e altre ${sopra.length - 12} slide oltre ${budget.p90} parole`);
  console.log('  (si taglia la copia o si divide la slide. MAI rimpicciolire il tipo: vale il contratto di leggibilità)');
}
if (s6.length) {
  console.log(`\nSOFT s6 — titoli etichetta (tre parole o meno): ${s6.length}`);
  for (const x of s6.slice(0, 12)) console.log(`  · ${x}`);
  if (s6.length > 12) console.log(`  · … e altri ${s6.length - 12}`);
  console.log('  (un titolo che afferma si ricorda, un\'etichetta no: «La domanda» → «Allora dove si perdono le vendite?»)');
}

const hard = s1.length + s2.length + s3.length + s4.length;
if (!hard) {
  console.log(`\nSINTETICO — ogni capitolo chiude su una frase sola, presa dalla fonte unica, entro ${paroleMax} parole.`);
  if (!budgetFuori && !s6.length) console.log('E il carico di lettura sta nel budget, senza titoli etichetta.');
}
console.log(`\n⚠️  Il gate verifica che il punto ESISTA, sia uno, stia in fondo e venga da un posto solo. Che dica la cosa giusta — un beneficio del cliente, non una proprietà del prodotto — lo giudica il panel.`);
process.exit(hard ? 1 : 0);
