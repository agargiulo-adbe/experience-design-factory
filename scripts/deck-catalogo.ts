/**
 * deck-catalogo — il catalogo dei blocchi e delle scene del motore.
 *
 * Esiste per una ragione misurata: per i `.pptx` il repo impone di aprire il
 * catalogo dei 166 layout PRIMA di comporre, perché «un deck che esce muro di
 * testo quasi sempre ha usato solo quelli a colonne». Per le experience HTML
 * quel catalogo non esisteva, e infatti il 24 ott 2026 un deck nuovo è uscito
 * con tre strutture ripetute sette volte, mentre nel motore c'erano undici
 * scene di meccanismo e tredici blocchi mai aperti.
 *
 * Legge la verità dal SORGENTE (docblock, `interface Props`, i commenti che
 * dichiarano il contratto di markup delle scene) e scrive un catalogo
 * leggibile. Non inventa: se un blocco non è documentato, lo dice.
 *
 *   pnpm deck:catalogo            → docs/Factory/deck-catalogo/CATALOGO.md
 *   pnpm deck:catalogo --stdout   → lo stampa e basta
 */
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BLOCKS = join(ROOT, 'packages/core/src/blocks');
const ANIM = join(BLOCKS, 'immersive/animations.ts');
const OUT_DIR = join(ROOT, 'docs/Factory/deck-catalogo');

const c = {
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  ok: (s: string) => `\x1b[32m${s}\x1b[0m`,
  warn: (s: string) => `\x1b[33m${s}\x1b[0m`,
};

// ── Le famiglie, perché un elenco alfabetico non aiuta a comporre ───────────
// L'ordine è quello in cui servono mentre si costruisce un capitolo.
const FAMIGLIE: Array<{ id: string; titolo: string; quando: string; membri: string[] }> = [
  {
    id: 'apertura',
    titolo: 'Aperture e chiusure',
    quando: 'la prima e l’ultima slide di un percorso o di un capitolo',
    membri: ['CoverHero', 'CoverSlide', 'Hero', 'CoBrand', 'CoBrandSignature'],
  },
  {
    id: 'meccanismo',
    titolo: 'Figure di meccanismo',
    quando: 'quando la slide deve mostrare COME funziona una cosa, non nominarla',
    membri: ['AdobeStackReveal', 'FrontBackStageSplit', 'JourneyPhase', 'Timeline', 'ProductGateway'],
  },
  {
    id: 'misura',
    titolo: 'Numeri e affermazioni',
    quando: 'una cifra che deve pesare, una frase che deve stare da sola',
    membri: ['MetricCallout', 'NarrativeSection'],
  },
  {
    id: 'schermo',
    titolo: 'Schermi e mock di prodotto',
    quando: 'far vedere il prodotto senza inventarne l’interfaccia',
    membri: ['immersive/GenstudioMockup', 'immersive/RtcdpMockup', 'immersive/MockupSlide', 'immersive/MediaDemoSlot', 'InstagramPost', 'PersonaCard'],
  },
  {
    id: 'atmosfera',
    titolo: 'Sfondo, movimento, suono',
    quando: 'il guscio sensoriale: si vede prima che si legga una riga',
    membri: ['SlideBackdrop', 'MediaSlot', 'immersive/LoopVideo', 'DeckAudio'],
  },
  {
    id: 'dettaglio',
    titolo: 'Dettaglio a richiesta e crediti',
    quando: 'la prosa che non deve stare in pagina, e i fatti che la slide dichiara',
    membri: ['HowItWorks', 'MadeWith', 'SocialMeta'],
  },
];

interface Blocco {
  nome: string;
  file: string;
  righe: number;
  doc: string;
  props: string[];
}

function docblock(src: string): string {
  const m = src.match(/\/\*\*([\s\S]*?)\*\//);
  if (!m) return '';
  return m[1]
    .split('\n')
    .map((l) => l.replace(/^\s*\*ue?\s?/, '').replace(/^\s*\*\s?/, '').trimEnd())
    .filter((l, i, a) => !(l === '' && (i === 0 || i === a.length - 1)))
    .join('\n')
    .trim();
}

function props(src: string): string[] {
  const m = src.match(/interface Props\s*\{([\s\S]*?)\n\}/);
  if (!m) return [];
  return m[1]
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*'))
    .map((l) => l.replace(/;$/, ''));
}

function walkAstro(dir: string, base = ''): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (['admin', 'doc', 'i18n', 'scoping'].includes(e.name)) continue; // non sono blocchi di slide
      out.push(...walkAstro(full, base ? `${base}/${e.name}` : e.name));
    } else if (e.name.endsWith('.astro')) {
      out.push(base ? `${base}/${e.name}` : e.name);
    }
  }
  return out;
}

function leggiBlocchi(): Map<string, Blocco> {
  const map = new Map<string, Blocco>();
  for (const rel of walkAstro(BLOCKS)) {
    const full = join(BLOCKS, rel);
    const src = readFileSync(full, 'utf8');
    const nome = rel.replace(/\.astro$/, '');
    map.set(nome, {
      nome,
      file: relative(ROOT, full),
      righe: src.split('\n').length,
      doc: docblock(src),
      props: props(src),
    });
  }
  return map;
}

interface Scena {
  fn: string;
  titolo: string;
  descrizione: string;
  markup: string;
}

/**
 * Le scene stanno tutte in `animations.ts`, ciascuna preceduta da un commento
 * `// ── Nome: che cosa mostra ──` e, dove c'è, da una riga `Markup: …` che
 * dichiara gli attributi da mettere in pagina. È quella riga che rende la
 * scena usabile senza leggere l'implementazione.
 */
function leggiScene(): Scena[] {
  const src = readFileSync(ANIM, 'utf8');
  const out: Scena[] = [];
  const re = /\/\/ ── ([^─\n]+?)\s*─+\n([\s\S]*?)export async function (init\w+)/g;
  for (const m of src.matchAll(re)) {
    const intestazione = m[1].trim();
    const corpo = m[2];
    const fn = m[3];
    if (fn === 'initAllAnimations') continue;
    const [titolo, ...resto] = intestazione.split(':');
    const righe = corpo
      .split('\n')
      .map((l) => l.replace(/^\s*\/\/\s?/, '').trimEnd())
      .filter((l) => l.trim() && !l.startsWith('export'));
    const markupRiga = righe.filter((l) => /^Markup:/.test(l) || /^\s{2,}/.test(l) && righe.some((r) => /^Markup:/.test(r)));
    const iM = righe.findIndex((l) => /^Markup:/.test(l));
    const markup = iM >= 0 ? righe.slice(iM).join(' ').replace(/^Markup:\s*/, '') : '';
    const descrizione = (resto.join(':').trim() || (iM >= 0 ? righe.slice(0, iM) : righe).join(' ')).trim();
    out.push({ fn, titolo: titolo.trim(), descrizione, markup });
    void markupRiga;
  }
  return out;
}

function componi(blocchi: Map<string, Blocco>, scene: Scena[]): string {
  const usati = new Set<string>();
  const L: string[] = [];

  L.push('# Catalogo dei blocchi e delle scene del motore');
  L.push('');
  L.push('> Generato da `pnpm deck:catalogo` dal sorgente di `packages/core/src/blocks/`.');
  L.push('> **Si apre PRIMA di comporre un capitolo**, come `pnpm pptx:layouts` per i .pptx:');
  L.push('> comporre a memoria produce tre strutture ripetute, ed è già successo.');
  L.push('> Questo file è rigenerabile e git-ignorato: la verità sta nel codice.');
  L.push('');
  L.push(`**${blocchi.size} blocchi · ${scene.length} scene di meccanismo.**`);
  L.push('');
  L.push('## Come si sceglie');
  L.push('');
  L.push('Una slide di contenuto porta **ancore, non prosa** (CLAUDE.md → «Ancore, non prosa»).');
  L.push('La domanda da farsi non è «quale componente uso» ma **«che cosa deve vedere chi guarda»**:');
  L.push('');
  L.push('| Se la slide deve… | Famiglia |');
  L.push('|---|---|');
  for (const f of FAMIGLIE) L.push(`| ${f.quando} | **${f.titolo}** |`);
  L.push('');
  L.push('E **mai due slide consecutive dello stesso tipo**: è la regola di ritmo. Una partitura,');
  L.push('non un formato.');
  L.push('');

  for (const f of FAMIGLIE) {
    L.push(`## ${f.titolo}`);
    L.push('');
    L.push(`*${f.quando}*`);
    L.push('');
    for (const nome of f.membri) {
      const b = blocchi.get(nome);
      if (!b) { L.push(`- ⚠️ \`${nome}\` dichiarato nella famiglia ma non trovato nel sorgente`); continue; }
      usati.add(nome);
      L.push(`### \`${basename(nome)}\``);
      L.push('');
      L.push(`\`${b.file}\` · ${b.righe} righe`);
      L.push('');
      if (b.doc) { L.push(b.doc.split('\n').map((l) => '> ' + l).join('\n')); L.push(''); }
      else { L.push('> ⚠️ Nessun docblock: che cosa fa si capisce solo leggendo il file.'); L.push(''); }
      if (b.props.length) {
        L.push('```ts');
        L.push('interface Props {');
        for (const p of b.props) L.push('  ' + p + ';');
        L.push('}');
        L.push('```');
        L.push('');
      }
    }
  }

  const orfani = [...blocchi.keys()].filter((k) => !usati.has(k)).sort();
  if (orfani.length) {
    L.push('## Non ancora catalogati');
    L.push('');
    L.push('Blocchi che esistono nel motore e non stanno in nessuna famiglia. Vanno messi in una,');
    L.push('se no restano invisibili a chi compone — che è il difetto che questo catalogo chiude.');
    L.push('');
    for (const o of orfani) {
      const b = blocchi.get(o)!;
      const prima = b.doc.split('\n')[0] || '—';
      L.push(`- \`${o}\` · ${b.righe} righe · ${prima}`);
    }
    L.push('');
  }

  L.push('## Scene di meccanismo');
  L.push('');
  L.push('Sono **dichiarative**: si mette l\'attributo in pagina e il motore le fa partire su');
  L.push('`playSlide`, con `prefers-reduced-motion` già gestito. Non si riscrivono a mano —');
  L.push('è già successo di rifarne una peggiore.');
  L.push('');
  L.push('Vivono in `packages/core/src/blocks/immersive/animations.ts` e si accendono tutte con');
  L.push('`initAllAnimations(container)`, che il deck chiama da sé.');
  L.push('');
  for (const s of scene) {
    L.push(`### ${s.titolo}`);
    L.push('');
    L.push(`\`${s.fn}()\` — ${s.descrizione || '—'}`);
    L.push('');
    if (s.markup) { L.push('**Markup:** ' + s.markup); L.push(''); }
    else { L.push('⚠️ Il contratto di markup non è dichiarato nel commento: va letto nel codice.'); L.push(''); }
  }

  return L.join('\n') + '\n';
}

const blocchi = leggiBlocchi();
const scene = leggiScene();
const md = componi(blocchi, scene);

if (process.argv.includes('--stdout')) {
  process.stdout.write(md);
} else {
  mkdirSync(OUT_DIR, { recursive: true });
  const out = join(OUT_DIR, 'CATALOGO.md');
  writeFileSync(out, md, 'utf8');
  const senzaDoc = [...blocchi.values()].filter((b) => !b.doc).length;
  const senzaMarkup = scene.filter((s) => !s.markup).length;
  console.log('');
  console.log(c.bold('deck:catalogo') + c.dim(' · il catalogo dei blocchi e delle scene'));
  console.log('');
  console.log(`  ${c.ok(String(blocchi.size))} blocchi · ${c.ok(String(scene.length))} scene di meccanismo`);
  if (senzaDoc) console.log(`  ${c.warn(String(senzaDoc))} blocchi senza docblock: chi compone non sa che esistono`);
  if (senzaMarkup) console.log(`  ${c.warn(String(senzaMarkup))} scene senza contratto di markup dichiarato`);
  console.log('');
  console.log('  ' + c.dim(relative(ROOT, out)));
  console.log('');
  console.log(c.dim('  Si apre PRIMA di comporre, come pptx:layouts. Comporre a memoria'));
  console.log(c.dim('  produce tre strutture ripetute: è già successo.'));
  console.log('');
}
