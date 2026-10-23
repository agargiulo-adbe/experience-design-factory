# Blueprint animato — piano di implementazione

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** dare al motore un blocco che costruisce un'architettura a fasi dentro una sola slide, guidato dai dati e misurato dai gate, così che una spiegazione nasca mentre chi presenta parla invece di essere letta dalla pagina.

**Architecture:** un modulo di dati puro (`blueprint.ts`) tiene il contratto e il **layout deterministico**, quindi è interamente testabile senza DOM. `Blueprint.astro` lo rende: grafo in SVG, ancore in un layer HTML sopra (così la copia resta misurabile dai gate). Il motore delle fasi riusa il pattern già collaudato dei mockup — monkey-patch dell'istanza `window.__edfDeck`, reset su `playSlide` — ma con fasi **cumulative** animate da timeline GSAP invece di swap di `hidden`. Tre gate si estendono prima del primo uso reale.

**Tech Stack:** TypeScript strict, Astro, GSAP 3.15 (già dipendenza di `packages/core`; `DrawSVG` gratuito da apr 2025), vitest, Playwright per i gate.

**Spec:** `docs/superpowers/specs/2026-10-23-blueprint-animato-design.md`

## Global Constraints

- **Ancore, non prosa.** Ancora di un nodo **≤ 6 parole**; titolo di fase **≤ 8 parole**; **da 3 a 6 fasi** per blueprint. Verificato dal gate (Task 2), non dalla buona volontà.
- **Il grafo è SVG, il testo è HTML.** Nessuna ancora dentro l'SVG come `<text>`: uscirebbe da `copy-audit`, `audit:wrap` e `audit:ink`.
- **`prefers-reduced-motion` toglie il movimento, non l'informazione**: ogni fase rende istantaneamente il proprio stato finale e le frecce avanzano come sempre.
- **Un nodo del cliente non sparisce**: si attenua (`spenti`), mai rimosso. L'opacità attenuata non scende sotto la soglia di contrasto AA misurata da `audit:ink`.
- **`nostro?: boolean` ha default «del cliente»**: lo strato Adobe è l'eccezione dichiarata.
- **Bilingue**: ogni stringa visibile è `{ it, en? }`; `en` assente ricade su `it`.
- **Niente dipendenze runtime da API esterne durante la proiezione.**
- **TypeScript strict**; nessun colore o spaziatura hardcoded: solo custom property dei token (`--accent-primary`, `--ink-*`, `--line-subtle`, `--surface-*`).
- **Test**: `pnpm --filter @agargiulo-adbe/experience-core test` (vitest). Gate: `pnpm --silent exec tsx scripts/<gate>.ts`.
- **Conventional commits**, e si committa a ogni task.

---

### Task 1: Il contratto dati e il layout deterministico

Il cuore testabile. Tipi, validatore e **posizionamento** vivono qui come funzioni pure: nessun DOM, nessun Astro, quindi tutto verificabile con vitest.

**Files:**
- Create: `packages/core/src/data/blueprint.ts`
- Create: `packages/core/src/data/blueprint.test.ts`

**Interfaces:**
- Consumes: niente (primo task).
- Produces:
  - tipi `Testo`, `Nodo`, `Legame`, `Fase`, `Blueprint`
  - `validaBlueprint(b: Blueprint): string[]` — elenco di errori, vuoto se valido
  - `disponi(b: Blueprint): Disposizione` dove
    `Disposizione = { nodi: NodoPosto[]; legami: LegamePosto[]; viewBox: string }`,
    `NodoPosto = Nodo & { x: number; y: number; w: number; h: number }`,
    `LegamePosto = Legame & { d: string }`
  - `statoAllaFase(b: Blueprint, i: number): StatoFase` dove
    `StatoFase = { visibili: Set<string>; accesi: Set<string>; spenti: Set<string> }`
  - costanti `MAX_PAROLE_ANCORA = 6`, `MAX_PAROLE_TITOLO = 8`, `MIN_FASI = 3`, `MAX_FASI = 6`
  - `contaParole(t: string): number`

- [ ] **Step 1: Write the failing test**

```ts
// packages/core/src/data/blueprint.test.ts
import { describe, it, expect } from 'vitest';
import {
  validaBlueprint, disponi, statoAllaFase, contaParole,
  type Blueprint,
} from './blueprint';

const valido: Blueprint = {
  id: 'prova',
  nodi: [
    { id: 'crm', ancora: { it: 'CRM di filiale' }, gruppo: 'loro' },
    { id: 'analytics', ancora: { it: 'Analytics' }, gruppo: 'loro' },
    { id: 'arbitro', ancora: { it: 'Arbitro' }, gruppo: 'nostro', nostro: true },
  ],
  legami: [
    { da: 'crm', a: 'analytics' },
    { da: 'analytics', a: 'arbitro' },
  ],
  fasi: [
    { id: 'oggi', entrano: ['crm', 'analytics', 'crm>analytics'], titolo: { it: 'Quello che avete oggi' } },
    { id: 'limite', entrano: [], accesi: ['analytics'], titolo: { it: 'Dove si ferma' } },
    { id: 'innesto', entrano: ['arbitro', 'analytics>arbitro'], spenti: ['crm'], titolo: { it: 'Dove ci innestiamo' } },
  ],
};

describe('contaParole', () => {
  it('conta le parole ignorando la punteggiatura', () => {
    expect(contaParole('CRM di filiale')).toBe(3);
    expect(contaParole('  Analytics,  esteso ')).toBe(2);
    expect(contaParole('')).toBe(0);
  });
});

describe('validaBlueprint', () => {
  it('non trova errori su un blueprint valido', () => {
    expect(validaBlueprint(valido)).toEqual([]);
  });

  it('rifiuta un legame verso un nodo che non esiste', () => {
    const b = { ...valido, legami: [{ da: 'crm', a: 'fantasma' }] };
    expect(validaBlueprint(b)).toContain('legame crm>fantasma: nodo «fantasma» non esiste');
  });

  it('rifiuta un id di nodo duplicato', () => {
    const b = { ...valido, nodi: [...valido.nodi, { id: 'crm', ancora: { it: 'Altro' } }] };
    expect(validaBlueprint(b)).toContain('nodo «crm»: id duplicato');
  });

  it('rifiuta meno di 3 fasi e più di 6', () => {
    expect(validaBlueprint({ ...valido, fasi: valido.fasi.slice(0, 2) }))
      .toContain('fasi: 2 — ne servono da 3 a 6');
    const sette = Array.from({ length: 7 }, (_, i) => ({ id: `f${i}`, entrano: [], titolo: { it: 'Titolo' } }));
    expect(validaBlueprint({ ...valido, fasi: sette }))
      .toContain('fasi: 7 — ne servono da 3 a 6');
  });

  it('rifiuta un nodo che non entra in nessuna fase', () => {
    const b: Blueprint = {
      ...valido,
      nodi: [...valido.nodi, { id: 'orfano', ancora: { it: 'Orfano' } }],
    };
    expect(validaBlueprint(b)).toContain('nodo «orfano»: non entra in nessuna fase');
  });
});

describe('statoAllaFase', () => {
  it('è cumulativo: la fase 2 vede anche ciò che è entrato alla fase 0', () => {
    const s = statoAllaFase(valido, 2);
    expect(s.visibili.has('crm')).toBe(true);
    expect(s.visibili.has('arbitro')).toBe(true);
  });

  it('alla fase 0 non mostra ciò che entra dopo', () => {
    const s = statoAllaFase(valido, 0);
    expect(s.visibili.has('crm')).toBe(true);
    expect(s.visibili.has('arbitro')).toBe(false);
  });

  it('accesi e spenti valgono solo nella loro fase', () => {
    expect(statoAllaFase(valido, 1).accesi.has('analytics')).toBe(true);
    expect(statoAllaFase(valido, 2).accesi.has('analytics')).toBe(false);
    expect(statoAllaFase(valido, 2).spenti.has('crm')).toBe(true);
  });

  it('non spegne mai un nodo togliendolo dai visibili', () => {
    const s = statoAllaFase(valido, 2);
    expect(s.spenti.has('crm')).toBe(true);
    expect(s.visibili.has('crm')).toBe(true);
  });
});

describe('disponi', () => {
  it('mette i nodi dello stesso gruppo sulla stessa riga', () => {
    const d = disponi(valido);
    const crm = d.nodi.find(n => n.id === 'crm')!;
    const analytics = d.nodi.find(n => n.id === 'analytics')!;
    const arbitro = d.nodi.find(n => n.id === 'arbitro')!;
    expect(crm.y).toBe(analytics.y);
    expect(arbitro.y).not.toBe(crm.y);
  });

  it('non sovrappone due nodi della stessa riga', () => {
    const d = disponi(valido);
    const [a, b] = d.nodi.filter(n => n.gruppo === 'loro').sort((x, y) => x.x - y.x);
    expect(a.x + a.w).toBeLessThanOrEqual(b.x);
  });

  it('dà a ogni legame un percorso SVG non vuoto', () => {
    const d = disponi(valido);
    expect(d.legami).toHaveLength(2);
    for (const l of d.legami) expect(l.d).toMatch(/^M[\d.\s,LC-]+$/);
  });

  it('produce un viewBox che contiene tutti i nodi', () => {
    const d = disponi(valido);
    const [, , w, h] = d.viewBox.split(' ').map(Number);
    for (const n of d.nodi) {
      expect(n.x + n.w).toBeLessThanOrEqual(w);
      expect(n.y + n.h).toBeLessThanOrEqual(h);
    }
  });

  it('è deterministico', () => {
    expect(disponi(valido)).toEqual(disponi(valido));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @agargiulo-adbe/experience-core test -- blueprint`
Expected: FAIL — `Cannot find module './blueprint'`

- [ ] **Step 3: Write the implementation**

```ts
// packages/core/src/data/blueprint.ts
/**
 * Il contratto del blueprint che si costruisce.
 *
 * Tutto qui è PURO: nessun DOM, nessun Astro. Il layout è deterministico perché
 * un blueprint che si dispone diversamente a ogni build non si può auditare.
 *
 * Regola di contenuto, non di codice: sullo schermo vanno ANCORE, non frasi.
 * I tetti qui sotto sono quella regola resa meccanica; il gate `copy-audit`
 * (famiglia B) la verifica sui file di dati delle app.
 */

export interface Testo { it: string; en?: string }

export interface Nodo {
  id: string;
  ancora: Testo;
  /** Raggruppa i nodi su una riga. Nodi senza gruppo finiscono in «_». */
  gruppo?: string;
  /** true = strato Adobe. Il default è «del cliente»: il suo patrimonio viene prima. */
  nostro?: boolean;
  /** Slot del manifest asset dell'app, opzionale. */
  immagine?: string;
}

export interface Legame { da: string; a: string; tratteggiato?: boolean }

export interface Fase {
  id: string;
  /** id di nodi e di legami («da>a») che COMPAIONO in questa fase. */
  entrano: string[];
  accesi?: string[];
  /** Attenuati, mai rimossi: restano visibili. */
  spenti?: string[];
  titolo: Testo;
  /** Versione per il taglio «in dieci minuti»: stessa fonte, più corta. */
  titoloBreve?: Testo;
  /** Il caso nel vocabolario del cliente. */
  esempio?: Testo;
}

export interface Blueprint {
  id: string;
  nodi: Nodo[];
  legami: Legame[];
  fasi: Fase[];
}

export const MAX_PAROLE_ANCORA = 6;
export const MAX_PAROLE_TITOLO = 8;
export const MIN_FASI = 3;
export const MAX_FASI = 6;

export function contaParole(t: string): number {
  return (t.match(/[\wÀ-ÿ’']+/g) ?? []).length;
}

export function idLegame(l: Legame): string { return `${l.da}>${l.a}`; }

export function validaBlueprint(b: Blueprint): string[] {
  const errori: string[] = [];
  const visti = new Set<string>();

  for (const n of b.nodi) {
    if (visti.has(n.id)) errori.push(`nodo «${n.id}»: id duplicato`);
    visti.add(n.id);
    const p = contaParole(n.ancora.it);
    if (p > MAX_PAROLE_ANCORA) {
      errori.push(`nodo «${n.id}»: ancora di ${p} parole, il tetto è ${MAX_PAROLE_ANCORA}`);
    }
  }

  for (const l of b.legami) {
    for (const capo of [l.da, l.a]) {
      if (!visti.has(capo)) errori.push(`legame ${idLegame(l)}: nodo «${capo}» non esiste`);
    }
  }

  if (b.fasi.length < MIN_FASI || b.fasi.length > MAX_FASI) {
    errori.push(`fasi: ${b.fasi.length} — ne servono da ${MIN_FASI} a ${MAX_FASI}`);
  }

  const entrati = new Set<string>();
  for (const f of b.fasi) {
    const p = contaParole(f.titolo.it);
    if (p > MAX_PAROLE_TITOLO) {
      errori.push(`fase «${f.id}»: titolo di ${p} parole, il tetto è ${MAX_PAROLE_TITOLO}`);
    }
    for (const e of f.entrano) entrati.add(e);
    for (const rif of [...(f.accesi ?? []), ...(f.spenti ?? [])]) {
      if (!visti.has(rif) && !b.legami.some(l => idLegame(l) === rif)) {
        errori.push(`fase «${f.id}»: riferimento «${rif}» non esiste`);
      }
    }
  }

  for (const n of b.nodi) {
    if (!entrati.has(n.id)) errori.push(`nodo «${n.id}»: non entra in nessuna fase`);
  }

  return errori;
}

export interface StatoFase {
  visibili: Set<string>;
  accesi: Set<string>;
  spenti: Set<string>;
}

/** Lo stato cumulativo fino alla fase `i` compresa. */
export function statoAllaFase(b: Blueprint, i: number): StatoFase {
  const visibili = new Set<string>();
  for (let k = 0; k <= i && k < b.fasi.length; k++) {
    for (const e of b.fasi[k].entrano) visibili.add(e);
  }
  const f = b.fasi[i];
  return {
    visibili,
    accesi: new Set(f?.accesi ?? []),
    spenti: new Set(f?.spenti ?? []),
  };
}

// ── Layout ───────────────────────────────────────────────────────────────────
// Una riga per gruppo, nell'ordine di prima comparsa; i nodi del gruppo in
// colonna da sinistra. Numeri in unità di viewBox, non pixel: la slide scala.

const NODO_W = 200;
const NODO_H = 72;
const GAP_X = 40;
const GAP_Y = 96;
const BORDO = 24;

export type NodoPosto = Nodo & { x: number; y: number; w: number; h: number };
export type LegamePosto = Legame & { d: string };
export interface Disposizione { nodi: NodoPosto[]; legami: LegamePosto[]; viewBox: string }

export function disponi(b: Blueprint): Disposizione {
  const ordine: string[] = [];
  const perGruppo = new Map<string, Nodo[]>();
  for (const n of b.nodi) {
    const g = n.gruppo ?? '_';
    if (!perGruppo.has(g)) { perGruppo.set(g, []); ordine.push(g); }
    perGruppo.get(g)!.push(n);
  }

  const nodi: NodoPosto[] = [];
  let larghezzaMax = 0;
  ordine.forEach((g, riga) => {
    const gruppo = perGruppo.get(g)!;
    const y = BORDO + riga * (NODO_H + GAP_Y);
    gruppo.forEach((n, col) => {
      const x = BORDO + col * (NODO_W + GAP_X);
      nodi.push({ ...n, x, y, w: NODO_W, h: NODO_H });
      larghezzaMax = Math.max(larghezzaMax, x + NODO_W);
    });
  });

  const perId = new Map(nodi.map(n => [n.id, n]));
  const legami: LegamePosto[] = b.legami.map(l => {
    const a = perId.get(l.da)!;
    const z = perId.get(l.a)!;
    const x1 = a.x + a.w / 2;
    const y1 = a.y + a.h;
    const x2 = z.x + z.w / 2;
    const y2 = z.y;
    // Curva verticale: stessa riga → arco basso; righe diverse → S dolce.
    const my = (y1 + y2) / 2;
    return { ...l, d: `M${x1} ${y1} C${x1} ${my}, ${x2} ${my}, ${x2} ${y2}` };
  });

  const altezza = BORDO * 2 + ordine.length * NODO_H + Math.max(0, ordine.length - 1) * GAP_Y;
  return { nodi, legami, viewBox: `0 0 ${larghezzaMax + BORDO} ${altezza}` };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @agargiulo-adbe/experience-core test -- blueprint`
Expected: PASS, 15 test.

- [ ] **Step 5: Typecheck**

Run: `pnpm --filter @agargiulo-adbe/experience-core typecheck`
Expected: nessun errore.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/data/blueprint.ts packages/core/src/data/blueprint.test.ts
git commit -m "feat(core): il contratto del blueprint, con layout deterministico e tetti sulle ancore"
```

---

### Task 2: `copy-audit` famiglia B — il tetto diventa un gate

Il tetto va prima del componente: se arriva dopo, la prima scadenza lo trova già sfondato. Il controllo è **a funzione**, non a regex, perché deve sapere quale campo sta leggendo — come già fa la famiglia `L`.

**Files:**
- Modify: `scripts/copy-audit.ts`
- Create: `scripts/copy-audit.blueprint.test.ts`

**Interfaces:**
- Consumes: da Task 1 — `MAX_PAROLE_ANCORA`, `MAX_PAROLE_TITOLO`, `MIN_FASI`, `MAX_FASI`, `contaParole`.
- Produces: `controllaBlueprint(sorgente: string, file: string): Finding[]` esportata da `scripts/copy-audit.ts`, con codici `B1`, `B2`, `B3`, severità `HARD`.

- [ ] **Step 1: Write the failing test**

```ts
// scripts/copy-audit.blueprint.test.ts
import { describe, it, expect } from 'vitest';
import { controllaBlueprint } from './copy-audit';

describe('controllaBlueprint', () => {
  it('non segnala nulla quando ancore e titoli stanno nei tetti', () => {
    const src = `
export const bp = {
  nodi: [{ id: 'a', ancora: { it: 'CRM di filiale' } }],
  fasi: [
    { id: 'f1', entrano: ['a'], titolo: { it: 'Quello che avete oggi' } },
    { id: 'f2', entrano: [], titolo: { it: 'Dove si ferma' } },
    { id: 'f3', entrano: [], titolo: { it: 'Dove ci innestiamo' } },
  ],
};`;
    expect(controllaBlueprint(src, 'bp.ts')).toEqual([]);
  });

  it('B1 — ancora oltre sei parole', () => {
    const src = `ancora: { it: 'il motore che decide quale offerta esce adesso' }`;
    const f = controllaBlueprint(src, 'bp.ts');
    expect(f.map(x => x.code)).toContain('B1');
    expect(f[0].sev).toBe('HARD');
    expect(f[0].why).toMatch(/nome, non una frase/);
  });

  it('B2 — titolo di fase oltre otto parole', () => {
    const src = `titolo: { it: 'come il nostro strato si appoggia sopra quello che avete già oggi' }`;
    expect(controllaBlueprint(src, 'bp.ts').map(x => x.code)).toContain('B2');
  });

  it('B3 — più di sei fasi', () => {
    const fasi = Array.from({ length: 7 }, (_, i) => `{ id: 'f${i}', entrano: [], titolo: { it: 'Titolo' } }`).join(',');
    const src = `fasi: [${fasi}]`;
    expect(controllaBlueprint(src, 'bp.ts').map(x => x.code)).toContain('B3');
  });

  it('B3 — meno di tre fasi', () => {
    const src = `fasi: [{ id: 'a', entrano: [], titolo: { it: 'Uno' } }, { id: 'b', entrano: [], titolo: { it: 'Due' } }]`;
    expect(controllaBlueprint(src, 'bp.ts').map(x => x.code)).toContain('B3');
  });

  it('riporta la riga vera del sorgente', () => {
    const src = `riga uno\nriga due\nancora: { it: 'una ancora decisamente troppo lunga per stare nel tetto' }`;
    expect(controllaBlueprint(src, 'bp.ts')[0].line).toBe(3);
  });

  it('rispetta copy-audit-ignore sulla riga', () => {
    const src = `ancora: { it: 'una ancora decisamente troppo lunga per il tetto' } // copy-audit-ignore`;
    expect(controllaBlueprint(src, 'bp.ts')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --silent exec vitest run scripts/copy-audit.blueprint.test.ts`
Expected: FAIL — `controllaBlueprint is not exported`

- [ ] **Step 3: Write the implementation**

Aggiungi in `scripts/copy-audit.ts`, dopo le regole esistenti (la famiglia `L` è il modello: un controllo a funzione, non una regex nell'array `RULES`):

```ts
import {
  MAX_PAROLE_ANCORA, MAX_PAROLE_TITOLO, MIN_FASI, MAX_FASI, contaParole,
} from '../packages/core/src/data/blueprint';

/**
 * Famiglia B — «ancore, non prosa».
 *
 * Legge i file di dati di un blueprint e misura i campi per NOME, perché una
 * regex non sa distinguere un'ancora da un paragrafo. Un tetto scritto in un
 * commento non è un tetto: è una buona intenzione.
 */
export function controllaBlueprint(sorgente: string, file: string): Finding[] {
  const out: Finding[] = [];
  const righe = sorgente.split('\n');

  const campo = (nome: string, tetto: number, code: 'B1' | 'B2', why: string) => {
    const re = new RegExp(`${nome}\\s*:\\s*\\{[^}]*?\\bit\\s*:\\s*(['"\`])([^'"\`]*)\\1`, 'g');
    righe.forEach((riga, i) => {
      if (riga.includes('copy-audit-ignore')) return;
      for (const m of riga.matchAll(re)) {
        const testo = m[2];
        const p = contaParole(testo);
        if (p > tetto) {
          out.push({ sev: 'HARD', code, file, line: i + 1, lang: 'it', text: testo, why: `${p} parole, il tetto è ${tetto}: ${why}` });
        }
      }
    });
  };

  campo('ancora', MAX_PAROLE_ANCORA, 'B1', 'un’ancora è un nome, non una frase. La spiegazione sta nella voce di chi presenta.');
  campo('titolo', MAX_PAROLE_TITOLO, 'B2', 'il titolo di una fase nomina il passo, non lo riassume.');
  campo('titoloBreve', MAX_PAROLE_TITOLO, 'B2', 'il titolo di una fase nomina il passo, non lo riassume.');

  const mFasi = sorgente.match(/\bfasi\s*:\s*\[/);
  if (mFasi) {
    const da = sorgente.indexOf('[', mFasi.index!);
    let liv = 0, fine = da;
    for (let i = da; i < sorgente.length; i++) {
      if (sorgente[i] === '[') liv++;
      else if (sorgente[i] === ']') { liv--; if (liv === 0) { fine = i; break; } }
    }
    const blocco = sorgente.slice(da, fine);
    const n = (blocco.match(/\bid\s*:/g) ?? []).length;
    if (n > 0 && (n < MIN_FASI || n > MAX_FASI)) {
      const line = sorgente.slice(0, mFasi.index!).split('\n').length;
      out.push({
        sev: 'HARD', code: 'B3', file, line, lang: 'it', text: `${n} fasi`,
        why: `${n} fasi: ne servono da ${MIN_FASI} a ${MAX_FASI}. Oltre sei non è una slide, è un capitolo.`,
      });
    }
  }

  return out;
}
```

Poi, nel giro principale che già scorre i file di `src/data/`, chiama `controllaBlueprint` sui file che contengono `fasi:` e `ancora:`, e somma i `Finding` a quelli esistenti. L'intestazione che stampa quante stringhe ha misurato va aggiornata contando anche queste.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --silent exec vitest run scripts/copy-audit.blueprint.test.ts`
Expected: PASS, 7 test.

- [ ] **Step 5: Verifica che il gate non sia regredito sulle app esistenti**

Run: `pnpm --silent exec tsx scripts/copy-audit.ts --app intesa-scala-umana`
Expected: lo stesso esito di prima della modifica, **0 HARD**, e l'intestazione stampa il numero di stringhe misurate.

- [ ] **Step 6: Commit**

```bash
git add scripts/copy-audit.ts scripts/copy-audit.blueprint.test.ts
git commit -m "feat(audit): famiglia B — ancore e titoli di fase hanno un tetto, e ora lo misura un gate"
```

---

### Task 3: `Blueprint.astro` — la resa statica

Prima si rende, poi si anima. Questo task produce un blueprint **fermo allo stato finale**, già corretto nei token, nei contrasti e negli allineamenti. È lo stato che la preferenza `prefers-reduced-motion` vedrà per sempre, quindi deve essere buono da solo.

**Files:**
- Create: `packages/core/src/blocks/immersive/Blueprint.astro`
- Modify: `packages/core/src/blocks/immersive/index.ts` (se esiste un barrel; altrimenti salta)

**Interfaces:**
- Consumes: da Task 1 — `disponi`, `validaBlueprint`, `statoAllaFase`, `idLegame`, tipo `Blueprint`.
- Produces: componente Astro con props `{ bp: Blueprint; id: string; breve?: boolean }`. Emette un `<div data-blueprint data-fasi="N">` contenente un `<svg>` e un layer `.bp-ancore`. Ogni nodo porta `data-nodo="<id>"`, ogni legame `data-legame="<da>><a>"`, ogni ancora `data-ancora="<id>"`.

- [ ] **Step 1: Scrivi il componente**

```astro
---
import { disponi, validaBlueprint, idLegame, type Blueprint } from '../../data/blueprint';
import T from '../i18n/T.astro';

interface Props { bp: Blueprint; id: string; breve?: boolean }
const { bp, id, breve = false } = Astro.props;

// Un blueprint non valido non si rende a metà: rompe la build, dove costa poco.
const errori = validaBlueprint(bp);
if (errori.length) {
  throw new Error(`Blueprint «${bp.id}» non valido:\n  - ${errori.join('\n  - ')}`);
}

const d = disponi(bp);
const fasi = bp.fasi;
---

<div class="bp" data-blueprint={id} data-fasi={fasi.length}>
  <div class="bp-titoli">
    {fasi.map((f, i) => (
      <p class="bp-titolo" data-fase-titolo={i} hidden={i !== 0}>
        <T it={(breve && f.titoloBreve?.it) || f.titolo.it}
           en={(breve && f.titoloBreve?.en) || f.titolo.en || f.titolo.it} />
      </p>
    ))}
  </div>

  <div class="bp-scena">
    <svg class="bp-svg" viewBox={d.viewBox} role="presentation" aria-hidden="true">
      {d.legami.map(l => (
        <path class="bp-legame" data-legame={idLegame(l)} d={l.d}
              stroke-dasharray={l.tratteggiato ? '6 6' : undefined} />
      ))}
      {d.nodi.map(n => (
        <rect class={`bp-nodo${n.nostro ? ' bp-nodo--nostro' : ''}`} data-nodo={n.id}
              x={n.x} y={n.y} width={n.w} height={n.h} rx="8" />
      ))}
    </svg>

    <!-- Le ancore stanno FUORI dall'SVG: così restano DOM e i gate le misurano. -->
    <div class="bp-ancore">
      {d.nodi.map(n => (
        <span class={`bp-ancora${n.nostro ? ' bp-ancora--nostro' : ''}`} data-ancora={n.id}
              style={`left:${(n.x + n.w / 2) / parseFloat(d.viewBox.split(' ')[2]) * 100}%;top:${(n.y + n.h / 2) / parseFloat(d.viewBox.split(' ')[3]) * 100}%`}>
          <T it={n.ancora.it} en={n.ancora.en || n.ancora.it} />
        </span>
      ))}
    </div>
  </div>

  <div class="bp-esempi">
    {fasi.map((f, i) => f.esempio && (
      <p class="bp-esempio" data-fase-esempio={i} hidden={i !== 0}>
        <T it={f.esempio.it} en={f.esempio.en || f.esempio.it} />
      </p>
    ))}
  </div>
</div>

<style is:global>
  .bp { display: flex; flex-direction: column; gap: 1.25rem; width: 100%; }
  .bp-titoli, .bp-esempi { min-height: 2.5rem; }
  .bp-titolo { font-size: 1.5rem; line-height: 1.3; font-family: var(--font-display); margin: 0; }
  .bp-esempio { font-size: 1rem; line-height: 1.5; color: var(--ink-secondary); margin: 0; }

  .bp-scena { position: relative; width: 100%; }
  .bp-svg { display: block; width: 100%; height: auto; overflow: visible; }

  .bp-legame { fill: none; stroke: var(--line-subtle); stroke-width: 2; }
  .bp-nodo { fill: none; stroke: var(--line-subtle); stroke-width: 1.5; }
  .bp-nodo--nostro { stroke: var(--accent-primary); stroke-width: 2; }

  .bp-ancore { position: absolute; inset: 0; pointer-events: none; }
  .bp-ancora {
    position: absolute; transform: translate(-50%, -50%);
    /* Ancora = nome. Il minimo del contratto di leggibilità, non meno. */
    font-size: 1rem; line-height: 1.4; text-align: center;
    max-width: 11rem; color: var(--ink-primary);
  }
  .bp-ancora--nostro { color: var(--ink-accent, var(--accent-primary)); font-weight: 600; }

  /* Lo stato «spento»: attenuato, MAI nascosto, e mai sotto la soglia AA. */
  .bp [data-spento] { opacity: 0.55; }
</style>
```

- [ ] **Step 2: Monta il componente su una slide di prova e costruisci**

Crea temporaneamente una rotta di prova in un'app (es. `apps/intesa-scala-umana/src/pages/_bp-prova.astro`) con una `<Slide>` che contiene `<Blueprint bp={…} id="prova" />` e un blueprint minimo a tre fasi.

Run: `pnpm --filter intesa-scala-umana build`
Expected: build verde. Se il blueprint è invalido, la build fallisce con l'elenco degli errori — è il comportamento voluto.

- [ ] **Step 3: Guarda uno screenshot a 1920 e leggilo**

```bash
pnpm --filter intesa-scala-umana preview --port 4501 &
npx playwright screenshot --viewport-size=1920,1080 \
  http://localhost:4501/experience-design-factory/intesa-scala-umana/_bp-prova/ /tmp/bp.png
```
Expected: le ancore sono leggibili, centrate sui nodi, non si sovrappongono. Se si sovrappongono, il problema è in `disponi` (Task 1): si allarga `GAP_X`, non si rimpicciolisce il tipo.

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/blocks/immersive/Blueprint.astro
git commit -m "feat(core): Blueprint.astro rende il grafo — SVG per le forme, HTML per le ancore"
```

---

### Task 4: Il motore delle fasi

Riusa il pattern dei mockup senza inventare nulla. La differenza: le fasi sono cumulative e animate.

**Files:**
- Modify: `packages/core/src/blocks/immersive/Blueprint.astro` (aggiunge lo `<script>`)

**Interfaces:**
- Consumes: da Task 3 — gli attributi `data-blueprint`, `data-fasi`, `data-nodo`, `data-legame`, `data-ancora`, `data-fase-titolo`, `data-fase-esempio`. Da Task 1 — `statoAllaFase`, serializzato nel markup come JSON per non reimportare il modulo a runtime.
- Produces: l'elemento `[data-blueprint]` espone `__bpFase` (numero) e `__bpVaiA(i: number)`; emette l'evento `bp:fase` con `detail { id, fase, totale }` — il Task 5 lo ascolta.

- [ ] **Step 1: Serializza gli stati nel markup**

In `Blueprint.astro`, nel frontmatter, aggiungi:

```ts
import { statoAllaFase } from '../../data/blueprint';

const stati = bp.fasi.map((_, i) => {
  const s = statoAllaFase(bp, i);
  return { visibili: [...s.visibili], accesi: [...s.accesi], spenti: [...s.spenti] };
});
```

e nel markup, dentro `<div class="bp" …>`:

```astro
<script type="application/json" data-bp-stati set:html={JSON.stringify(stati)} />
```

- [ ] **Step 2: Scrivi lo script delle fasi**

```astro
<script>
  type Stato = { visibili: string[]; accesi: string[]; spenti: string[] };

  const RIDOTTO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function montaBlueprint(root: HTMLElement) {
    const slide = root.closest('[data-slide]') as HTMLElement | null;
    if (!slide) return;

    const stati: Stato[] = JSON.parse(
      root.querySelector<HTMLElement>('[data-bp-stati]')!.textContent || '[]'
    );
    const totale = stati.length;
    let fase = 0;
    let gsap: typeof import('gsap').gsap | null = null;

    const el = (sel: string) => Array.from(root.querySelectorAll<HTMLElement | SVGElement>(sel));
    const perRif = (rif: string) =>
      el(`[data-nodo="${rif}"], [data-legame="${rif}"], [data-ancora="${rif}"]`);

    // Tutto parte invisibile: lo stato finale lo porta la fase.
    for (const e of el('[data-nodo], [data-legame], [data-ancora]')) {
      (e as HTMLElement).style.opacity = '0';
    }

    async function assicuraGsap() {
      if (gsap || RIDOTTO) return;
      gsap = (await import('gsap')).gsap;
      const { DrawSVGPlugin } = await import('gsap/DrawSVGPlugin');
      gsap.registerPlugin(DrawSVGPlugin);
    }

    function applicaSubito(i: number) {
      const s = stati[i];
      const vis = new Set(s.visibili);
      for (const e of el('[data-nodo], [data-legame], [data-ancora]')) {
        const rif = (e as HTMLElement).dataset.nodo
          ?? (e as HTMLElement).dataset.legame
          ?? (e as HTMLElement).dataset.ancora!;
        const dentro = vis.has(rif);
        (e as HTMLElement).style.opacity = dentro ? '1' : '0';
        e.toggleAttribute('data-spento', dentro && s.spenti.includes(rif));
        e.toggleAttribute('data-acceso', dentro && s.accesi.includes(rif));
      }
      mostraTesti(i);
    }

    function mostraTesti(i: number) {
      for (const p of el('[data-fase-titolo]')) {
        (p as HTMLElement).hidden = Number((p as HTMLElement).dataset.faseTitolo) !== i;
      }
      for (const p of el('[data-fase-esempio]')) {
        (p as HTMLElement).hidden = Number((p as HTMLElement).dataset.faseEsempio) !== i;
      }
    }

    async function vaiA(i: number) {
      fase = Math.max(0, Math.min(totale - 1, i));
      if (RIDOTTO) { applicaSubito(fase); emetti(); return; }
      await assicuraGsap();
      const s = stati[fase];
      const tl = gsap!.timeline();
      const vis = new Set(s.visibili);
      for (const e of el('[data-nodo], [data-legame], [data-ancora]')) {
        const he = e as HTMLElement;
        const rif = he.dataset.nodo ?? he.dataset.legame ?? he.dataset.ancora!;
        const dentro = vis.has(rif);
        const spento = dentro && s.spenti.includes(rif);
        he.toggleAttribute('data-acceso', dentro && s.accesi.includes(rif));
        he.toggleAttribute('data-spento', spento);
        const target = dentro ? (spento ? 0.55 : 1) : 0;
        if (he.dataset.legame && dentro && Number(getComputedStyle(he).opacity) === 0) {
          tl.fromTo(he, { drawSVG: '0%' }, { drawSVG: '100%', opacity: 1, duration: 0.5, ease: 'power2.out' }, 0);
        } else {
          tl.to(he, { opacity: target, duration: 0.35, ease: 'power2.out' }, 0);
        }
      }
      mostraTesti(fase);
      emetti();
    }

    function emetti() {
      root.dispatchEvent(new CustomEvent('bp:fase', {
        bubbles: true,
        detail: { id: root.dataset.blueprint, fase, totale },
      }));
    }

    (root as any).__bpFase = () => fase;
    (root as any).__bpVaiA = vaiA;

    // Il deck chiama next()/prev() da TUTTE le vie d'ingresso (tasti, frecce del
    // chrome, click sulle metà, swipe): non c'è un hook unico, quindi si
    // intercetta l'ISTANZA. Vedi la memoria `mockup-navigation-patterns`.
    document.addEventListener('astro:page-load', function patch() {
      const deck = (window as any).__edfDeck;
      if (!deck) return;
      const origNext = deck.next.bind(deck);
      const origPrev = deck.prev.bind(deck);
      deck.next = function () {
        if (deck.slides[deck.index] === slide && fase < totale - 1) { vaiA(fase + 1); return; }
        origNext();
      };
      deck.prev = function () {
        if (deck.slides[deck.index] === slide && fase > 0) { vaiA(fase - 1); return; }
        origPrev();
      };
    }, { once: true });

    slide.addEventListener('playSlide', () => { vaiA(0); });
    applicaSubito(0);
  }

  function monta() {
    document.querySelectorAll<HTMLElement>('[data-blueprint]').forEach(montaBlueprint);
  }
  monta();
  document.addEventListener('astro:after-swap', monta);
</script>
```

- [ ] **Step 3: Verifica a mano le quattro cose che possono rompersi**

Con `pnpm --filter intesa-scala-umana preview`:
1. freccia destra avanza di fase e **non** salta slide fino all'ultima fase;
2. freccia sinistra torna di fase, e dalla fase 0 esce dalla slide;
3. uscire dalla slide e rientrare riporta alla fase 0;
4. un nodo `spenti` resta **visibile** e attenuato, non sparisce.

- [ ] **Step 4: Verifica nelle condizioni di chi guarda**

```bash
npx playwright screenshot --viewport-size=1920,1080 \
  --reduced-motion=reduce \
  http://localhost:4501/experience-design-factory/intesa-scala-umana/_bp-prova/ /tmp/bp-ridotto.png
```
Expected: con il movimento ridotto la fase 0 è **già allo stato finale** (nodi visibili, non trasparenti) e le frecce avanzano. Una misura fatta senza quella preferenza non prova niente: vedi `misurare-nelle-condizioni-utente`.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/blocks/immersive/Blueprint.astro
git commit -m "feat(core): le fasi del blueprint sono cumulative e animate, e il movimento ridotto non toglie informazione"
```

---

### Task 5: L'indicatore di fase nel contorno

Serve a chi guarda (c'è ancora qualcosa) e a chi presenta (so dove sono). È **chrome**: sta fuori dal flusso della slide, quindi fuori dal conteggio e dalle misure dell'audit, come la firma co-brand.

**Files:**
- Modify: `packages/core/src/blocks/immersive/DeckContainer.astro`

**Interfaces:**
- Consumes: da Task 4 — l'evento `bp:fase` con `detail { fase, totale }`.
- Produces: un `<div class="edf-fase-ind" hidden>` nel contorno, e `html[data-bp-fasi]` quando un blueprint è attivo.

- [ ] **Step 1: Aggiungi l'indicatore al contorno**

Nel markup di `DeckContainer.astro`, accanto agli altri comandi:

```astro
<div class="edf-fase-ind" aria-live="polite" hidden>
  <span data-fase-ora>1</span><span class="edf-fase-sep">/</span><span data-fase-tot>1</span>
</div>
```

```css
.edf-fase-ind {
  position: fixed; left: 50%; transform: translateX(-50%);
  bottom: calc(var(--deck-chrome-safe) * 0.35);
  font-size: 0.75rem; letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.78); /* rgba esplicito: il parser di contrasto non legge oklab/color-mix */
  z-index: 40; pointer-events: none;
}
html:not([data-on-dark]) .edf-fase-ind { color: rgba(0, 0, 0, 0.62); }
@media (max-width: 640px) { .edf-fase-ind { display: none; } }
```

- [ ] **Step 2: Aggiungi il runtime, accanto a quello del co-brand**

```ts
const ind = document.querySelector<HTMLElement>('.edf-fase-ind');
document.addEventListener('bp:fase', (e) => {
  const { fase, totale } = (e as CustomEvent).detail as { fase: number; totale: number };
  if (!ind) return;
  ind.hidden = totale < 2;
  ind.querySelector('[data-fase-ora]')!.textContent = String(fase + 1);
  ind.querySelector('[data-fase-tot]')!.textContent = String(totale);
  document.documentElement.toggleAttribute('data-bp-fasi', totale > 1);
});
document.addEventListener('deck:change', () => {
  if (!document.querySelector('[data-slide][data-active] [data-blueprint]') && ind) {
    ind.hidden = true;
    document.documentElement.removeAttribute('data-bp-fasi');
  }
});
```

- [ ] **Step 3: Verifica che non collida con gli altri comandi**

Il check `b` dell'audit guarda i comandi del deck, **non** la firma co-brand né il credito «creato con» né il comando audio — e adesso nemmeno questo. Quindi si guarda a occhio su uno schermo basso: `--viewport-size=1280,720`, con un `HowItWorks` aperto. Se collide, la pelle fa arretrare il contorno su `html[data-bp-fasi]`, come già fa per `data-hiw-open`.

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/blocks/immersive/DeckContainer.astro
git commit -m "feat(core): l'indicatore di fase sta nel contorno, non nel contenuto"
```

---

### Task 6: `audit:deck` consapevole delle fasi

Il pezzo che non si rimanda. Oggi il gate misura la slide nello stato in cui la trova — la fase 1 — e una sbordatura che nasce alla fase 3 partirebbe invisibile. Vale `audit-deck-false-pass`: un gate che non misura non è un PASS.

**Files:**
- Modify: `scripts/deck-audit.ts`

**Interfaces:**
- Consumes: da Task 3/4 — `[data-blueprint][data-fasi]` e `__bpVaiA(i)` sull'elemento.
- Produces: i rilievi portano `fase` nel contesto; il riepilogo stampa `<rotta> · <slide> · fase k/N`.

- [ ] **Step 1: Scrivi il test del gate (una rotta di prova che sborda alla fase 3)**

Crea `apps/intesa-scala-umana/src/pages/_bp-sborda.astro` con un blueprint a tre fasi in cui la terza fa entrare un nodo con un'ancora che **esce dalla safe-area** (es. una riga di nodi in più del dovuto). Serve a provare che il gate fallisce dove deve.

- [ ] **Step 2: Verifica che il gate ATTUALE la lasci passare (il difetto da chiudere)**

Run: `DECK_URL=http://localhost:4501 pnpm --filter intesa-scala-umana audit:deck -- --only _bp-sborda`
Expected: **PASS** — ed è esattamente il bug. Annota l'esito: è la prova che l'estensione serve.

- [ ] **Step 3: Implementa il giro per fase**

Nel punto in cui `deck-audit.ts` esegue i check su una slide, avvolgi con:

```ts
// Una slide con blueprint ha più stati. Misurarne uno solo è il modo di
// spedire un HARD invisibile: si itera, pilotando l'avanzamento con la STESSA
// via che usa il deck, non toccando il DOM a mano (se no si misura uno stato
// che nessuno vedrà mai).
const fasi = await page.evaluate((sel) => {
  const bp = document.querySelector(`${sel} [data-blueprint]`) as HTMLElement | null;
  return bp ? Number(bp.dataset.fasi || '1') : 1;
}, selettoreSlide);

for (let f = 0; f < fasi; f++) {
  if (f > 0) {
    await page.evaluate((sel) => {
      const bp = document.querySelector(`${sel} [data-blueprint]`) as any;
      bp?.__bpVaiA(bp.__bpFase() + 1);
    }, selettoreSlide);
    // La timeline dura 0.5s al massimo: si attende la fine, non un tempo a caso.
    await page.waitForFunction((sel) => {
      const els = document.querySelectorAll(`${sel} [data-nodo], ${sel} [data-legame]`);
      return Array.from(els).every(e => {
        const o = getComputedStyle(e).opacity;
        return o === '0' || o === '1' || o === '0.55';
      });
    }, selettoreSlide, { timeout: 3000 });
  }

  const rilievi = await eseguiCheck(page, selettoreSlide);   // c, e, j, k, m
  for (const r of rilievi) {
    r.contesto = fasi > 1 ? `${r.contesto} · fase ${f + 1}/${fasi}` : r.contesto;
    out.push(r);
  }
}

// Si rimette alla fase 0: la slide successiva non deve eredirare uno stato.
await page.evaluate((sel) => {
  const bp = document.querySelector(`${sel} [data-blueprint]`) as any;
  bp?.__bpVaiA(0);
}, selettoreSlide);
```

I check che si rieseguono per fase sono **`c` `e` `j` `k` `m`** (geometria e sovrapposizioni). Non si rieseguono `a`, `g`, `i` (banda e ritmo): sono SOFT e su una composizione che cresce a fasi darebbero rumore senza informazione.

- [ ] **Step 4: Verifica che ora il gate FALLISCA sulla rotta di prova**

Run: `DECK_URL=http://localhost:4501 pnpm --filter intesa-scala-umana audit:deck -- --only _bp-sborda`
Expected: **FAIL** con un rilievo `c` che nomina `fase 3/3`.

- [ ] **Step 5: Verifica che non sia regredito niente**

Run: `DECK_URL=http://localhost:4501 pnpm --filter intesa-scala-umana audit:deck`
Expected: lo stesso insieme di rilievi di prima (0 HARD), e il numero di rotte auditate **stampato e contato** — un PASS che arriva troppo in fretta va contato, non creduto.

- [ ] **Step 6: Commit**

```bash
git add scripts/deck-audit.ts apps/intesa-scala-umana/src/pages/_bp-sborda.astro
git commit -m "fix(audit): deck-audit misura ogni fase del blueprint, non solo la prima"
```

---

### Task 7: `audit:ink` per fase

Un'ancora leggibile alla fase 1 può finire su un nodo acceso alla fase 3, e i nodi `spenti` sono il punto di rottura più probabile: attenuare è una scelta grafica che diventa un difetto di contrasto.

**Files:**
- Modify: `scripts/ink-audit.ts`

**Interfaces:**
- Consumes: da Task 4 — `__bpVaiA`, `__bpFase`.
- Produces: i rilievi nominano la fase.

- [ ] **Step 1: Estrai il giro per fase**

Riusa **la stessa** funzione di avanzamento del Task 6: estraila in `scripts/lib/bp-fasi.ts` ed esporta `numeroFasi(page, sel)`, `vaiAFase(page, sel, i)`, `attendiFase(page, sel)`. Importala in entrambi i gate — due copie a mano divergono sempre.

- [ ] **Step 2: Applica il giro in `ink-audit.ts`**

Dove il gate ritaglia il rettangolo di ogni blocco di testo e misura i pixel, avvolgi nello stesso ciclo `for (let f = 0; f < fasi; f++)`, e nel rilievo aggiungi `· fase k/N`.

- [ ] **Step 3: Verifica che trovi un'attenuazione troppo spinta**

Porta temporaneamente `.bp [data-spento] { opacity: 0.25 }` e lancia:
Run: `DECK_URL=http://localhost:4501 pnpm audit:ink --app intesa-scala-umana --only _bp-prova`
Expected: **FAIL** su un'ancora attenuata, con la fase nominata. Riporta l'opacità a `0.55` e rilancia: **PULITO**.

- [ ] **Step 4: Commit**

```bash
git add scripts/ink-audit.ts scripts/deck-audit.ts scripts/lib/bp-fasi.ts
git commit -m "feat(audit): audit:ink misura gli inchiostri in ogni fase, e il giro delle fasi è condiviso fra i due gate"
```

---

### Task 8: Il primo uso reale, e il delta sul motore

Il componente ha senso quando una slide vera lo usa. E una modifica a `packages/core` arriva a tutte le experience: si misura il delta prima di dichiarare chiuso.

**Files:**
- Create: `apps/<app>/src/data/architettura.ts`
- Modify: la pagina dell'app che ospita la slide
- Modify: l'`admin.astro` dell'app (registra la nuova `<Slide id>` nel `PAGE_REGISTRY`)
- Delete: `apps/intesa-scala-umana/src/pages/_bp-prova.astro`, `_bp-sborda.astro`

- [ ] **Step 1: Scrivi il blueprint reale come dati**

Tre fasi, e la regola di ammissione: **una fase entra se cambia la conclusione di chi guarda.** Se togliendola l'argomento regge uguale, non era una fase.

- [ ] **Step 2: Monta la slide e registra l'id nel PAGE_REGISTRY**

Senza la registrazione, il tab «Capitoli e slide» dell'admin non la vede: ogni slide nuova si registra.

- [ ] **Step 3: Togli le rotte di prova e costruisci**

Run: `pnpm --filter <app> build`
Expected: verde.

- [ ] **Step 4: I gate dell'app, nell'ordine giusto**

```bash
pnpm --silent exec tsx scripts/copy-audit.ts --app <app>          # 0 HARD, e CONTA le stringhe
DECK_URL=http://localhost:4501 pnpm audit:wrap --app <app>
DECK_URL=http://localhost:4501 pnpm audit:taglio --app <app>
DECK_URL=http://localhost:4501 pnpm audit:ink --app <app>          # PULITO
DECK_URL=http://localhost:4501 pnpm --filter <app> audit:deck      # 0 HARD
DECK_URL=http://localhost:4501 pnpm audit:fonti --app <app>
pnpm audit:sintesi
```

- [ ] **Step 5: Il delta sul motore, su TUTTE le app**

Run: `pnpm build && pnpm audit:og`
Poi la sonda che confronta il verdetto vecchio e nuovo su ogni slide di ogni app (vedi `core-change-measure-the-delta`). Expected: **zero slide cambiate** fuori dall'app che usa il blueprint. Se cambia qualcosa altrove, lo stile globale del componente sta sfuggendo: va messo sotto `[data-blueprint]`.

- [ ] **Step 6: Screenshot di ogni fase a 1920, e leggili**

Il gate misura le scatole; la leggibilità la si guarda. Una fase per immagine.

- [ ] **Step 7: Commit**

```bash
git add apps/<app> packages/core
git commit -m "feat(<app>): l'architettura si costruisce in tre fasi invece di arrivare tutta insieme"
```

---

### Task 9: `generateVideo` accetta un keyframe (image-to-video)

Famiglia 2. Il gancio è già previsto: `scripts/lib/firefly.ts:225` dice *«structured to later accept an image-conditioning ref (image-to-video) without changing callers»*.

⚠️ **Prima di scrivere codice, riverifica la forma dell'API**: la fonte interna è del **5 giu 2026**, quindi datata. Se la forma è cambiata, vince la fonte nuova e questo task si riscrive.

**Files:**
- Modify: `scripts/lib/firefly.ts`
- Create: `scripts/lib/firefly.test.ts`

**Interfaces:**
- Produces:
  - `caricaImmagine(token: string, bytes: Buffer): Promise<string>` — l'id di storage
  - `generateVideo(creds, opts)` accetta `opts.primoFotogramma?: Buffer` e `opts.ultimoFotogramma?: Buffer`
  - `payloadVideo(opts): object` — **funzione pura**, è quella che si testa

- [ ] **Step 1: Write the failing test**

```ts
// scripts/lib/firefly.test.ts
import { describe, it, expect } from 'vitest';
import { payloadVideo } from './firefly';

describe('payloadVideo', () => {
  it('mette width, height e numFrames in sizes[], e non usa aspectRatio', () => {
    const p = payloadVideo({ prompt: 'x', size: { width: 1920, height: 1080 }, seconds: 5 }) as any;
    expect(p.sizes).toEqual([{ width: 1920, height: 1080, numFrames: 120 }]);
    expect(p).not.toHaveProperty('aspectRatio');
  });

  it('accetta duration solo su video1_foundry, e altrove la rifiuta a voce alta', () => {
    expect(() => payloadVideo({ prompt: 'x', seconds: 3, model: 'video1_standard' }))
      .toThrow(/duration .* solo con video1_foundry/);
    const p = payloadVideo({ prompt: 'x', seconds: 3, model: 'video1_foundry' }) as any;
    expect(p.duration).toBe(3);
  });

  it('rifiuta una durata che il modello non conosce', () => {
    expect(() => payloadVideo({ prompt: 'x', seconds: 4, model: 'video1_foundry' }))
      .toThrow(/3 o 5 secondi/);
  });

  it('passa i keyframe come id di storage, primo e ultimo', () => {
    const p = payloadVideo({ prompt: 'x', idPrimo: 'abc', idUltimo: 'def' }) as any;
    expect(p.image.conditions).toEqual([
      { source: { uploadId: 'abc' }, placement: { position: 0 } },
      { source: { uploadId: 'def' }, placement: { position: -1 } },
    ]);
  });

  it('senza keyframe non emette il blocco image', () => {
    expect(payloadVideo({ prompt: 'x' })).not.toHaveProperty('image');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --silent exec vitest run scripts/lib/firefly.test.ts`
Expected: FAIL — `payloadVideo is not exported`

- [ ] **Step 3: Write the implementation**

```ts
/**
 * Il corpo della richiesta video, come funzione PURA — così si testa senza rete.
 *
 * Forma verificata su fonte interna Adobe del 5 giu 2026: la richiesta è
 * size-driven (`sizes[]` con width/height/numFrames) e NON esiste un campo
 * `aspectRatio`. `duration` vale 3 o 5 secondi e solo con `video1_foundry`.
 * Un parametro ignorato in silenzio è un difetto che si scopre guardando la
 * clip e chiedendosi perché dura altro: qui si fallisce a voce alta.
 */
export interface OpzioniVideo {
  prompt: string;
  negativePrompt?: string;
  size?: { width: number; height: number };
  seconds?: number;
  seed?: number;
  model?: string;
  idPrimo?: string;
  idUltimo?: string;
}

const FPS = 24;
const DURATE_AMMESSE = [3, 5];

export function payloadVideo(o: OpzioniVideo): Record<string, unknown> {
  const model = o.model ?? process.env.FIREFLY_VIDEO_MODEL ?? 'video1_standard';
  const p: Record<string, unknown> = { prompt: o.prompt };
  if (o.negativePrompt) p.negativePrompt = o.negativePrompt;
  if (typeof o.seed === 'number') p.seeds = [o.seed];

  if (o.size) {
    const numFrames = (o.seconds ?? 5) * FPS;
    p.sizes = [{ width: o.size.width, height: o.size.height, numFrames }];
  }

  if (typeof o.seconds === 'number') {
    if (model !== 'video1_foundry') {
      throw new Error(
        `duration è accettata solo con video1_foundry (modello richiesto: ${model}). ` +
        'Togli seconds, oppure dichiara il modello nel manifest.'
      );
    }
    if (!DURATE_AMMESSE.includes(o.seconds)) {
      throw new Error(`duration ${o.seconds}: sono ammessi 3 o 5 secondi.`);
    }
    p.duration = o.seconds;
  }

  const conditions: unknown[] = [];
  if (o.idPrimo) conditions.push({ source: { uploadId: o.idPrimo }, placement: { position: 0 } });
  if (o.idUltimo) conditions.push({ source: { uploadId: o.idUltimo }, placement: { position: -1 } });
  if (conditions.length) p.image = { conditions };

  return p;
}

/** Carica i byte di un'immagine e restituisce l'id di storage da usare come keyframe. */
export async function caricaImmagine(token: string, bytes: Buffer, clientId: string): Promise<string> {
  const res = await fetch(`${API_URL}/v2/storage/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-key': clientId,
      'Content-Type': 'image/png',
    },
    body: bytes,
  });
  if (!res.ok) throw new Error(`Firefly upload immagine: ${res.status} ${await res.text()}`);
  const j = await res.json() as { images?: Array<{ id?: string }> };
  const id = j.images?.[0]?.id;
  if (!id) throw new Error('Firefly upload immagine: nessun id nella risposta');
  return id;
}
```

Poi fai usare `payloadVideo` dentro `generateVideo`, caricando i keyframe con `caricaImmagine` quando `opts.primoFotogramma` / `opts.ultimoFotogramma` sono presenti.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --silent exec vitest run scripts/lib/firefly.test.ts`
Expected: PASS, 5 test.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/firefly.ts scripts/lib/firefly.test.ts
git commit -m "feat(firefly): il video accetta un keyframe, e un parametro che il modello ignora ora fallisce a voce alta"
```

---

### Task 10: Il manifest dichiara il keyframe, e la provenienza lo registra

**Files:**
- Modify: `scripts/build-video.ts`
- Modify: `apps/<app>/video.manifest.ts`

**Interfaces:**
- Consumes: da Task 9 — `payloadVideo`, `caricaImmagine`, `generateVideo` con i keyframe.
- Produces: lo slot del manifest accetta `model`, `primoFotogramma?: string`, `ultimoFotogramma?: string` (percorsi relativi all'app); `provenance.video.json` guadagna `keyframes: { primo?: string; ultimo?: string }`.

- [ ] **Step 1: Estendi il tipo dello slot e la lettura dei file**

```ts
interface SlotVideo {
  id: string;
  prompt: string;
  negativePrompt?: string;
  aspect: string;
  size?: { width: number; height: number };
  seconds?: number;
  seed?: number;
  /** Obbligatorio quando si usa `seconds`: il modello decide se la durata vale. */
  model?: string;
  /** Un fermo reso dal deck nella palette del cliente: così la clip è on-brand per costruzione. */
  primoFotogramma?: string;
  ultimoFotogramma?: string;
}
```

e, prima della chiamata, leggi i byte con `fs.readFileSync(path.resolve(cwd, slot.primoFotogramma))`.

- [ ] **Step 2: Registra la provenienza**

Nel record che `build-video.ts` scrive, aggiungi:

```ts
keyframes: {
  primo: slot.primoFotogramma ?? null,
  ultimo: slot.ultimoFotogramma ?? null,
},
```

Un credito è un fatto: senza la sorgente del keyframe scritta, fra un mese nessuno sa da dove veniva quella clip.

- [ ] **Step 3: Genera una clip vera e guardala**

```bash
pnpm --filter <app> video:build
pnpm loop:seamless apps/<app>/public/media/<id>.mp4 --poster
pnpm loop:seamless --check apps/<app>/public/media/<id>.loop.mp4
```
Expected: il PSNR del giro entro 6 dB dal riferimento. Poi si **guarda la clip** col titolo sopra: una clip generata è quasi sempre più luminosa del fermo che sostituisce, e lo scrim va ricalibrato. Vale «il velo si misura»: differenza fra fotogrammi a qualche secondo di distanza, e contrasto nel **caso peggiore**, non in media.

- [ ] **Step 4: Dichiara il credito sulla slide**

`data-made-with="Firefly"` + `data-made-with-for="clip"` sulla slide che la ospita. Solo lì: mettere «Adobe Firefly» su una slide con una foto stock è una dichiarazione falsa.

- [ ] **Step 5: Commit**

```bash
git add scripts/build-video.ts apps/<app>/video.manifest.ts apps/<app>/public/media
git commit -m "feat(video): il manifest dichiara i keyframe, e la provenienza li registra"
```

---

## Note di esecuzione

- **L'ordine fra 6/7 e 8 non è negoziabile**: i gate per fase atterrano **prima** del primo uso reale. Un blocco animato senza gate per fase è un generatore di HARD invisibili.
- **Fra 1-7 e 8 c'è un'attesa voluta**: si estrae l'astrazione quando si ha un caso, non prima. Se il primo caso serve con urgenza, si fa **a mano dentro l'app** e si torna qui dopo — è la strada raccomandata nella spec, §10 punto 1.
- **Task 9-10 sono indipendenti** da 1-8: si possono eseguire in parallelo, in un worktree separato, perché toccano file diversi (`scripts/lib/firefly.ts`, `scripts/build-video.ts`) e non condividono `dist/`.
