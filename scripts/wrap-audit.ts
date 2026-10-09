/**
 * `audit:wrap` — gli a capo che si vedono.
 *
 * PERCHÉ ESISTE. `text-wrap: balance` e `pretty` risolvono due cose (righe
 * finali squilibrate, parola sola a fine paragrafo) e NON risolvono quella che
 * si nota di più in proiezione: la **parola di servizio appesa**. «…alla scala
 * della Banca dei Territori. In / cinque pagine.» — «In» resta aggrappata alla
 * riga di sopra, lontana dal suo complemento, e l'occhio inciampa. Nessun
 * check dell'audit di layout la vede: le scatole sono a posto, il contrasto è
 * a posto, è il testo che si rompe nel punto sbagliato.
 *
 * COME MISURA. Per ogni blocco di testo di ogni slide usa la Range API per
 * ricavare le righe REALMENTE RESE (non il sorgente: dipendono da larghezza,
 * carattere e viewport) e guarda l'ultima parola di ciascuna, tranne
 * l'ultima. Se è una parola di servizio — preposizione, articolo,
 * congiunzione — la segnala con la riga intera, così si vede subito dove.
 *
 * DOVE CONTA, E DOVE NO. Un «a» a fine riga dentro un paragrafo di corpo è
 * tipografia normale: segnalarlo vorrebbe dire riempire di legature un testo
 * che nessuno legge riga per riga. Si vede, e dà fastidio, nel testo GRANDE e
 * CORTO — titoli, occhielli, lead, la frase che chiude una slide — dove le
 * righe sono poche e l'occhio le prende intere. Il controllo guarda lì:
 * corpo ≥ 18px (al viewport di riferimento) oppure blocchi sotto i 160
 * caratteri. Con `--tutto` mostra anche il resto, da leggere come indicazione
 * e non come difetto.
 *
 * COME SI RISOLVE: si lega la parola di servizio a quella che segue con uno
 * spazio unificatore (` `), mai riscrivendo la frase per far tornare i
 * conti e MAI rimpicciolendo il tipo (vale il contratto di leggibilità).
 * Legarne due di fila («In cinque pagine.») tiene insieme una coda
 * breve; su stringhe lunghe si lega solo la coppia che serve, se no la riga
 * non può più andare a capo e sborda sui viewport stretti.
 *
 * Esce 0 se non trova niente, 1 se trova qualcosa: è un controllo di qualità
 * tipografica, non un gate di rendering — si legge e si decide, perché un
 * «di» appeso in una nota di fonte non vale una slide rifatta.
 *
 * Uso:
 *   DECK_URL=http://localhost:4431 npx tsx scripts/wrap-audit.ts --app intesa-scala-umana
 *   …aggiungi --tv per includere i viewport da muro.
 */
import { chromium, type Page } from 'playwright';
import { ROUTE_SETS, type Rotta } from './lib/deck-routes';

/* Parole che non devono restare a fine riga: reggono quella dopo, non stanno
   in piedi da sole. Elenco chiuso e corto di proposito — un filtro «parole
   fino a 3 lettere» segnalerebbe anche «non», «già», «più», che a fine riga
   stanno benissimo. */
const SERVIZIO_IT = new Set([
  'a','ad','al','allo','alla','ai','agli','alle','con','col','coi','da','dal','dallo','dalla',
  'dai','dagli','dalle','di','del','dello','della','dei','degli','delle','e','ed','fra','in',
  'nel','nello','nella','nei','negli','nelle','o','od','per','su','sul','sullo','sulla','sui',
  'sugli','sulle','tra','il','lo','la','i','gli','le','un','uno','una',"un'",'che','se','come',
  'ogni','ma','né','il','dove',
]);
const SERVIZIO_EN = new Set([
  'a','an','the','of','to','in','on','at','by','for','from','with','and','or','as','is','are',
  'was','were','that','which','into','over','under','per','than','but','if','when','its','it',
]);

interface Rilievo {
  rotta: string;
  viewport: string;
  slide: string;
  parola: string;
  riga: string;
  /** true = testo grande o corto, dove l'a capo storto si vede. */
  forte: boolean;
}

async function misuraPagina(page: Page, rotta: string, viewport: string, tutto: boolean): Promise<Rilievo[]> {
  return page.evaluate(
    ({ it, en, rotta, viewport, tutto }) => {
      const servizio = new Set([...it, ...en]);
      /* La soglia è RELATIVA al corpo di base della pagina, non assoluta: a
         dimensione muro la radice sale a 24-28px e un «≥18px» promuoverebbe
         a titolo ogni paragrafo. Sopra il 15% del corpo normale c'è quello
         che l'occhio legge intero — occhielli, titoli, lead, la frase che
         chiude. */
      const base = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const soglia = base * 1.15;
      const out: Array<{ rotta: string; viewport: string; slide: string; parola: string; riga: string; forte: boolean }> = [];

      const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-slide]'));
      for (const slide of slides) {
        const visibile = getComputedStyle(slide).display !== 'none';
        if (!visibile) continue;

        const blocchi = Array.from(
          slide.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4, li, figcaption, blockquote'),
        );
        for (const el of blocchi) {
          // Solo quello che si legge davvero: niente testo nascosto dal
          // bilinguismo, niente corpi microscopici, niente blocchi vuoti.
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          const corpo = parseFloat(cs.fontSize);
          if (corpo < 12) continue;
          const testo = (el.textContent || '').trim();
          if (testo.length < 12) continue;
          // Solo il testo GRANDE: titoli, occhielli, lead, la frase che
          // chiude. Lì le righe sono poche e l'occhio le prende intere, e una
          // preposizione appesa si vede dall'ultima fila. Dentro una card di
          // corpo la stessa rottura non la nota nessuno — e legarla tutta
          // vorrebbe dire un testo pieno di vincoli che poi sborda sui
          // viewport stretti.
          const conta = corpo >= soglia;
          if (!conta && !tutto) continue;

          // Le righe rese: si raccolgono i rettangoli dei nodi di testo e si
          // raggruppano per ordinata. È l'unico modo di sapere dove il browser
          // ha davvero mandato a capo.
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          const righe = new Map<number, string>();
          let n: Node | null;
          while ((n = walker.nextNode())) {
            const txt = n.nodeValue || '';
            if (!txt.trim()) continue;
            const parent = n.parentElement;
            if (parent && getComputedStyle(parent).display === 'none') continue;
            for (let i = 0; i < txt.length; i++) {
              const r = document.createRange();
              r.setStart(n, i);
              r.setEnd(n, i + 1);
              const box = r.getBoundingClientRect();
              if (!box.height) continue;
              const chiave = Math.round(box.top / 2) * 2;   // tollera il subpixel
              righe.set(chiave, (righe.get(chiave) || '') + txt[i]);
            }
          }
          const ordinate = Array.from(righe.keys()).sort((a, b) => a - b);
          if (ordinate.length < 2) continue;               // una riga sola non va a capo

          // Tutte tranne l'ultima: l'ultima riga non ha un «a capo dopo».
          for (let k = 0; k < ordinate.length - 1; k++) {
            const riga = (righe.get(ordinate[k]) || '').trim();
            if (!riga) continue;
            const parole = riga.split(/\s+/);
            const ultima = parole[parole.length - 1]
              .toLowerCase()
              .replace(/^[«"'(\[]+|[»"'),.;:!?\]]+$/g, '');
            if (!ultima) continue;
            if (servizio.has(ultima)) {
              out.push({ rotta, viewport, slide: slide.id || '(senza id)', parola: ultima, riga, forte: conta });
            }
          }
        }
      }
      return out;
    },
    { it: [...SERVIZIO_IT], en: [...SERVIZIO_EN], rotta, viewport, tutto },
  );
}

async function main() {
  const argv = process.argv.slice(2);
  const valore = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const app = valore('--app') ?? 'intesa-scala-umana';
  const soloRotta = valore('--only');
  const tv = argv.includes('--tv');
  const tutto = argv.includes('--tutto');
  const origin = process.env.DECK_URL ?? 'http://localhost:4321';

  const set: Rotta[] | undefined = ROUTE_SETS[app];
  if (!set) {
    console.error(`App sconosciuta: ${app}. Note: ${Object.keys(ROUTE_SETS).join(', ')}`);
    process.exit(2);
  }
  const rotte = soloRotta ? set.filter((r) => soloRotta.split(',').includes(r.name)) : set;
  if (!rotte.length) {
    console.error('Nessuna rotta da controllare: un giro che non controlla niente non è un PASS.');
    process.exit(2);
  }

  const viewports = [
    { w: 1920, h: 1080 },
    { w: 1440, h: 900 },
    { w: 1280, h: 800 },
    ...(tv ? [{ w: 2560, h: 1440 }, { w: 3840, h: 2160 }] : []),
  ];

  const browser = await chromium.launch();
  const rilievi: Rilievo[] = [];
  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    for (const r of rotte) {
      await page.goto(origin + r.route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(350);
      rilievi.push(...(await misuraPagina(page, r.name, `${vp.w}×${vp.h}`, tutto)));
    }
    await page.close();
  }
  await browser.close();

  console.log(`\nA capo controllati: ${rotte.length} rotte × ${viewports.length} viewport\n`);
  if (!rilievi.length) {
    console.log('PULITO — nessuna parola di servizio appesa a fine riga.');
    process.exit(0);
  }
  // Una stessa frase si rompe su più viewport: si raggruppa, se no l'elenco
  // è lungo tre volte e nessuno lo legge.
  const gruppi = new Map<string, Rilievo[]>();
  for (const x of rilievi) {
    const k = `${x.rotta}|${x.slide}|${x.riga}`;
    gruppi.set(k, [...(gruppi.get(k) ?? []), x]);
  }
  const forti = [...gruppi.values()].filter((g) => g[0].forte);
  const deboli = [...gruppi.values()].filter((g) => !g[0].forte);

  const stampa = (g: Rilievo[], segno: string) => {
    const a = g[0];
    const dove = [...new Set(g.map((x) => x.viewport))].join(', ');
    console.log(`${segno} ${a.rotta} · ${a.slide} — «${a.parola}» appesa a fine riga  [${dove}]`);
    console.log(`     …${a.riga.slice(-64)}⏎`);
  };
  forti.forEach((g) => stampa(g, '✗'));
  if (tutto && deboli.length) {
    console.log('\n— sotto: testo di corpo, dove un a capo così è tipografia normale —\n');
    deboli.forEach((g) => stampa(g, '·'));
  }

  if (!forti.length) {
    console.log('PULITO sul testo che si vede.' + (deboli.length ? ` (${deboli.length} nel corpo, con --tutto)` : ''));
    process.exit(0);
  }
  console.log(`\n${forti.length} punto/i da legare con uno spazio unificatore.`);
  process.exit(1);
}

main();
