# Experience Atelier — redesign sulle tre mosse · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rifare la tesi del deck Atelier (ogni opportunità ha la sua esperienza, viva fra i meeting, misurata, distribuita via MCP, conforme) con due prove funzionanti dentro il deck: la telemetria del deck stesso e un MCP server `atelier` con tre tool.

**Architecture:** Il deck resta un'app Astro sul motore `@edf/core` (7 capitoli + Overture, sistema loom, sponsor cut via `?s=`). La prova (a) è un blocco core opt-in `DeckTelemetry.astro` che ascolta `deck:change` e scrive su Supabase (`deck_events`, RLS anon insert-only, lettura anonima solo per l'Atelier via RPC security-definer). La prova (b) è un nuovo pacchetto `packages/mcp-atelier` (stdio, `@modelcontextprotocol/sdk`) i cui tool sono funzioni pure testate con vitest; la lettura del design system viene estratta da `scripts/brand-tokens.ts` in `scripts/lib/brand-tokens.ts`.

**Tech Stack:** Astro 6 · Tailwind v4 · `@edf/core` · Supabase (Postgres, RLS, REST) · vitest · tsx · `@modelcontextprotocol/sdk` · zod · Playwright (screenshot + `audit:deck`) · Firefly (backdrop via `assets:build`).

**Spec:** `docs/superpowers/specs/2026-09-14-atelier-redesign-tre-mosse-design.md` (leggerla prima; la critica con fonti è `docs/superpowers/research/2026-09-14-atelier-ambition-critique.md`).

## Global Constraints

- Trilingue **EN default / IT / FR** su ogni stringa visibile: `<T en it fr>`; FR idiomatico, mai eco letterale; IT senza «seller/intake/wizard».
- **Copy umano** (CLAUDE.md «Copy voice»): niente em-dash retorici, tricoloni, «non solo X ma Y», buzzword. Stringhe esistenti: ±10% di lunghezza.
- **Ogni numero con fonte e data sulla slide.** Lista **refuted** vincolante (`docs/superpowers/research/2026-07-17-atelier-comparables.md`): niente benchmark BDR/SDR, niente Walnut, niente «30% delle interazioni», niente Accenture come dato trimestrale, niente «bollino IA» italiano, niente «file firmato C2PA».
- **Zero cifre €** nella sezione asks. Nessun nome di persona/org interna Adobe.
- Nomi prodotto 2026: CX Enterprise · CX Enterprise Coworker · Brand Concierge · Agent Orchestrator · Agent Skills · Adobe Brand Visibility · GenStudio for Performance Marketing · Real-Time CDP Collaboration · Customer Journey Analytics · Firefly Custom Models (beta) · Firefly Foundry.
- **Type & legibility contract**: body ≥0.95rem, label ≥0.8rem (`.atl-label`), mai ridurre il tipo per far passare un check soft. Layout: `.atl-frame`, cover con `.atl-cover-num/.atl-cover-kicker/.slide-title/.atl-lede`, pannelli `.loom-panel/.loom-card/.loom-thread`.
- Colori: solo token/rgba espliciti (il parser di contrasto dell'audit non legge `oklab()`/`color-mix()`).
- **Gate prima di ogni push**: `pnpm --filter atelier build` · `pnpm typecheck` · `pnpm lint` (0 errori) · `npx tsx scripts/content-audit.ts` · `DECK_URL=http://localhost:4399 pnpm --filter atelier audit:deck` su **preview statica** (mai dev) → **0 HARD** (`b c d e g h j k m exp`); soft `a`/`i` accettati.
- Calendario (spec §Decisioni): decisione **31 ott 2026** · M1 **fine gen 2027** · M2 **Summit 22–25 mar 2027** (da confermare) · M3 **fine giu 2027**.
- Commit convenzionali in italiano, firma `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_017iAZaVotTf3QE3SByP7co3`; **push dopo ogni commit** (memoria `git-push-after-every-commit`). Mai committare `.env`, chiavi, mp4.
- Lavoro parallelo sulla stessa app → worktree isolati (`isolation: "worktree"`), un solo build+audit finale nel tree principale.

## File structure

**Nuovi**
- `supabase/migrations/0014_deck_events.sql` — tabella eventi, RLS, view, RPC anonima per l'Atelier.
- `packages/core/src/blocks/immersive/telemetry.ts` — helper puri (cut, session id, evento, opt-out). Test: `telemetry.test.ts`.
- `packages/core/src/blocks/immersive/DeckTelemetry.astro` — blocco montato una volta nel BaseLayout; script bundled che usa gli helper.
- `scripts/lib/brand-tokens.ts` — `analyzeCss()` + `readBrandTokens()` estratti dallo script CLI. Test: `scripts/lib/brand-tokens.test.ts`.
- `scripts/gen-experiences-registry.ts` — scrive `packages/mcp-atelier/src/registry.json` da `apps/factory-showcase/src/data/experiences.ts`.
- `packages/mcp-atelier/{package.json,tsconfig.json,vitest.config.ts,README.md,src/index.ts,src/tools.ts,src/tools.test.ts,src/registry.json}` — il server MCP.
- `skills/brand-tokens/SKILL.md`, `skills/open-experience/SKILL.md` — le due Agent Skills nuove.
- `apps/atelier/src/pages/gap.astro`, `apps/atelier/src/pages/moves.astro` — capitoli 03 e 04 nuovi.
- `apps/atelier/src/data/mcp-transcript.ts` — trascrizione reale della sessione MCP.
- `apps/atelier/src/components/TelemetryPanel.astro` — pannello a runtime della slide di prova (a).

**Modificati**
- `packages/core/src/blocks/i18n/LangToggle.astro` — legge `?lang=`.
- `scripts/brand-tokens.ts` — diventa un wrapper CLI di `scripts/lib/brand-tokens.ts`.
- `scripts/deck-audit.ts` — `ROUTE_SETS.atelier`: `gap`, `moves` al posto di `multiplication`, `frontiers`.
- `apps/atelier/src/pages/{index,method,capability,plan,asks,closing,admin}.astro`, `multiplication.astro` e `frontiers.astro` (→ redirect), `src/components/AtelierNavigation.astro`, `src/layouts/BaseLayout.astro` (SECTION_FLOW, DeckTelemetry, `pageSolutions`), `assets.manifest.ts` (+2 backdrop), `src/styles/global.css` (classi nuove `.gap-*`, `.mv-*`, `.proof-*`).
- Propagazione: `apps/unicredit-engagement/**`, `apps/agos-trait-dunion/**`, `apps/console/**` (6 file con «Experience Cloud»).
- Docs: `docs/HANDOVER-06.md` §21.8, `docs/HANDOVER-03.md` change log, `docs/HANDOVER-02.md` backlog, memoria `experience-atelier-deck`.

---

## Parte A — Prova (a): la telemetria del deck

### Task 1: Migrazione `0014_deck_events.sql`

**Files:**
- Create: `supabase/migrations/0014_deck_events.sql`

**Interfaces:**
- Produces: tabella `public.deck_events(project, route, slide_id, slide_index, cut, lang, session_id, dwell_ms, ts)`; view `public.deck_slide_stats`; RPC `public.atelier_slide_stats()` (anon).

- [ ] **Step 1: Scrivere la migrazione**

```sql
-- ── 0014 · Telemetria dei deck ─────────────────────────────────────────────
-- Un deck che misura se stesso: ogni attivazione di slide scrive una riga.
-- Niente dati personali: il session_id è casuale per scheda, non c'è cookie,
-- non c'è IP nella tabella. anon può solo INSERIRE; la lettura anonima esiste
-- per il solo progetto 'atelier' (la slide «This deck is watching itself»),
-- via una funzione security definer. Tutto il resto si legge da authenticated.

create table if not exists public.deck_events (
  id          bigint generated always as identity primary key,
  project     text not null,
  route       text not null,
  slide_id    text not null,
  slide_index int  not null default 0,
  cut         text not null default 'full',
  lang        text not null default 'en',
  session_id  text not null,
  dwell_ms    int  not null default 0,
  ts          timestamptz not null default now()
);
create index if not exists deck_events_project_route_slide on public.deck_events (project, route, slide_id);
create index if not exists deck_events_ts on public.deck_events (ts);

comment on table public.deck_events is
  'Attivazioni di slide dei deck. Nessun dato personale: session_id casuale per scheda.';

alter table public.deck_events enable row level security;

drop policy if exists deck_events_anon_insert on public.deck_events;
create policy deck_events_anon_insert on public.deck_events
  for insert to anon
  with check (
    char_length(project) between 1 and 40
    and char_length(route) between 1 and 60
    and char_length(slide_id) between 1 and 80
    and char_length(session_id) between 8 and 64
    and dwell_ms between 0 and 3600000
    and lang in ('en','it','fr')
  );

drop policy if exists deck_events_auth_select on public.deck_events;
create policy deck_events_auth_select on public.deck_events
  for select to authenticated using (true);

-- La view eredita le policy del chiamante (security_invoker): authenticated
-- legge tutto, anon niente.
create or replace view public.deck_slide_stats
  with (security_invoker = true) as
  select project, route, slide_id, cut, lang,
         count(*)::int                                   as views,
         count(distinct session_id)::int                 as sessions,
         percentile_cont(0.5) within group (order by dwell_ms)::int as median_dwell_ms,
         max(ts)                                         as last_seen
    from public.deck_events
   group by 1, 2, 3, 4, 5;

-- L'unica lettura anonima: le statistiche del deck Atelier, per la sua slide.
create or replace function public.atelier_slide_stats()
returns setof public.deck_slide_stats
language sql
security definer
set search_path = public
stable
as $$
  select * from public.deck_slide_stats where project = 'atelier';
$$;

revoke all on function public.atelier_slide_stats() from public;
grant execute on function public.atelier_slide_stats() to anon, authenticated;
grant select on public.deck_slide_stats to authenticated;
```

- [ ] **Step 2: Applicare al DB remoto e verificare**

Run: `supabase db query --linked -f supabase/migrations/0014_deck_events.sql`
Poi: `supabase db query --linked "select count(*) from public.atelier_slide_stats();"`
Expected: `0` (nessun errore; la funzione esiste).

- [ ] **Step 3: Verificare che anon non legga la tabella**

Run (con URL/chiave anon dal `.env` dell'Atelier):
```bash
set -a; source apps/atelier/.env; set +a
curl -s "$PUBLIC_SUPABASE_URL/rest/v1/deck_events?select=id&limit=1" -H "apikey: $PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $PUBLIC_SUPABASE_ANON_KEY"
curl -s -X POST "$PUBLIC_SUPABASE_URL/rest/v1/rpc/atelier_slide_stats" -H "apikey: $PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $PUBLIC_SUPABASE_ANON_KEY" -H "Content-Type: application/json" -d '{}'
```
Expected: la prima risposta è `[]` (RLS: nessuna riga leggibile); la seconda `[]` (RPC ok, tabella vuota).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0014_deck_events.sql
git commit -m "feat(supabase): eventi dei deck — il deck misura se stesso, senza dati personali"
git push origin main
```

### Task 2: Helper puri `telemetry.ts` (TDD)

**Files:**
- Create: `packages/core/src/blocks/immersive/telemetry.ts`
- Test: `packages/core/src/blocks/immersive/telemetry.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface TelemetryEvent { project: string; route: string; slide_id: string; slide_index: number; cut: string; lang: string; session_id: string; dwell_ms: number }
  export function cutFromSearch(search: string): string            // '' → 'full'; '?s=detail,asks' → 'asks,detail' (ordinato, dedup)
  export function trackingMode(search: string, stored: string | null): 'on' | 'off' | 'mock'
  export function makeSessionId(random?: () => number): string       // 16 caratteri [0-9a-f]
  export function routeFromPath(pathname: string): string            // '/x/atelier/' → 'index'; '/x/atelier/plan/' → 'plan'
  export function buildEvent(p: { project: string; pathname: string; search: string; slideId: string; slideIndex: number; lang: string; sessionId: string; dwellMs: number }): TelemetryEvent
  ```

- [ ] **Step 1: Scrivere i test (falliscono)**

```ts
// packages/core/src/blocks/immersive/telemetry.test.ts
import { describe, it, expect } from 'vitest';
import { cutFromSearch, trackingMode, makeSessionId, routeFromPath, buildEvent } from './telemetry';

describe('cutFromSearch', () => {
  it('is "full" without ?s=', () => { expect(cutFromSearch('')).toBe('full'); expect(cutFromSearch('?x=1')).toBe('full'); });
  it('sorts and dedups ids', () => { expect(cutFromSearch('?s=detail,asks,detail')).toBe('asks,detail'); });
  it('ignores blanks', () => { expect(cutFromSearch('?s=asks,,%20')).toBe('asks'); });
});

describe('trackingMode', () => {
  it('is on by default', () => { expect(trackingMode('', null)).toBe('on'); });
  it('is off with ?telemetry=0 or stored off', () => {
    expect(trackingMode('?telemetry=0', null)).toBe('off');
    expect(trackingMode('', 'off')).toBe('off');
  });
  it('is mock with ?telemetry=mock', () => { expect(trackingMode('?telemetry=mock', null)).toBe('mock'); });
});

describe('makeSessionId', () => {
  it('is 16 hex chars and deterministic for a given random', () => {
    const id = makeSessionId(() => 0.5);
    expect(id).toMatch(/^[0-9a-f]{16}$/);
    expect(makeSessionId(() => 0.5)).toBe(id);
  });
});

describe('routeFromPath', () => {
  it('maps the app home to index and a section to its slug', () => {
    expect(routeFromPath('/experience-design-factory/atelier/')).toBe('atelier');
    expect(routeFromPath('/experience-design-factory/atelier/plan/')).toBe('plan');
    expect(routeFromPath('/experience-design-factory/atelier/plan')).toBe('plan');
  });
});

describe('buildEvent', () => {
  it('assembles a clamped event', () => {
    const e = buildEvent({ project: 'atelier', pathname: '/x/atelier/plan/', search: '?s=asks', slideId: 'slide-m1', slideIndex: 3, lang: 'fr', sessionId: 'abcdef0123456789', dwellMs: 4_000_000 });
    expect(e).toEqual({ project: 'atelier', route: 'plan', slide_id: 'slide-m1', slide_index: 3, cut: 'asks', lang: 'fr', session_id: 'abcdef0123456789', dwell_ms: 3_600_000 });
  });
});
```

- [ ] **Step 2: Eseguire i test e vederli fallire**

Run: `pnpm --filter @agargiulo-adbe/experience-core test -- telemetry`
Expected: FAIL — `Cannot find module './telemetry'`.

- [ ] **Step 3: Implementare**

```ts
// packages/core/src/blocks/immersive/telemetry.ts
/**
 * Telemetria dei deck — helper puri, senza DOM, testati con vitest.
 * Il blocco DeckTelemetry.astro li usa dal browser. Niente dati personali:
 * il session id è casuale per scheda e non identifica nessuno.
 */
export interface TelemetryEvent {
  project: string; route: string; slide_id: string; slide_index: number;
  cut: string; lang: string; session_id: string; dwell_ms: number;
}

const MAX_DWELL_MS = 3_600_000;

/** Il taglio del deck: gli id di `?s=` ordinati e deduplicati, oppure 'full'. */
export function cutFromSearch(search: string): string {
  const raw = new URLSearchParams(search).get('s');
  if (!raw) return 'full';
  const ids = [...new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))].sort();
  return ids.length ? ids.join(',') : 'full';
}

/** 'off' con ?telemetry=0 o localStorage edf:telemetry=off; 'mock' con ?telemetry=mock. */
export function trackingMode(search: string, stored: string | null): 'on' | 'off' | 'mock' {
  const q = new URLSearchParams(search).get('telemetry');
  if (q === '0' || q === 'off') return 'off';
  if (q === 'mock') return 'mock';
  if (stored === 'off') return 'off';
  return 'on';
}

/** 16 caratteri esadecimali, iniettabile per i test. */
export function makeSessionId(random: () => number = Math.random): string {
  let out = '';
  for (let i = 0; i < 16; i++) out += Math.floor(random() * 16).toString(16);
  return out;
}

/** L'ultimo segmento del path: 'atelier' sulla home dell'app, lo slug altrove. */
export function routeFromPath(pathname: string): string {
  const parts = pathname.replace(/\/+$/, '').split('/');
  return parts[parts.length - 1] || 'index';
}

export function buildEvent(p: {
  project: string; pathname: string; search: string; slideId: string; slideIndex: number;
  lang: string; sessionId: string; dwellMs: number;
}): TelemetryEvent {
  return {
    project: p.project,
    route: routeFromPath(p.pathname),
    slide_id: p.slideId,
    slide_index: p.slideIndex,
    cut: cutFromSearch(p.search),
    lang: p.lang,
    session_id: p.sessionId,
    dwell_ms: Math.max(0, Math.min(MAX_DWELL_MS, Math.round(p.dwellMs))),
  };
}
```

- [ ] **Step 4: Eseguire i test (passano)**

Run: `pnpm --filter @agargiulo-adbe/experience-core test -- telemetry`
Expected: 9 test PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/blocks/immersive/telemetry.ts packages/core/src/blocks/immersive/telemetry.test.ts
git commit -m "feat(core): helper della telemetria dei deck, puri e testati"
git push origin main
```

### Task 3: `DeckTelemetry.astro` e montaggio nell'Atelier

**Files:**
- Create: `packages/core/src/blocks/immersive/DeckTelemetry.astro`
- Modify: `apps/atelier/src/layouts/BaseLayout.astro` (body, dopo `<MadeWith />`)

**Interfaces:**
- Consumes: `deck:change` (detail `{ index, total, id, sectionSlug }`) da `deck.ts`; helper di Task 2; tabella di Task 1.
- Produces: prop `<DeckTelemetry project="atelier" url={SUPABASE_URL} anonKey={SUPABASE_ANON_KEY} />`; eventi scritti in `deck_events`.

- [ ] **Step 1: Scrivere il blocco**

```astro
---
/**
 * DeckTelemetry — il deck misura se stesso, in modo anonimo.
 * Montato UNA volta nel BaseLayout dell'app che opta. Ascolta `deck:change`,
 * misura quanto una slide è rimasta attiva e scrive una riga per attivazione
 * su Supabase (`deck_events`, anon insert-only). Niente cookie, niente dati
 * personali: session id casuale per scheda in sessionStorage.
 * Si spegne con `?telemetry=0` o `localStorage['edf:telemetry']='off'`;
 * `?telemetry=mock` non scrive (serve all'audit e alle prove).
 */
interface Props { project: string; url: string; anonKey: string }
const { project, url, anonKey } = Astro.props as Props;
---
<div data-edf-telemetry data-project={project} data-url={url} data-key={anonKey} hidden aria-hidden="true"></div>

<script>
  import { buildEvent, makeSessionId, trackingMode } from './telemetry';

  const el = document.querySelector<HTMLElement>('[data-edf-telemetry]');
  const w = window as Window & { __edfTelemetryBound?: boolean };
  if (el && !w.__edfTelemetryBound) {
    w.__edfTelemetryBound = true;
    const project = el.dataset.project || '';
    const endpoint = (el.dataset.url || '').replace(/\/$/, '') + '/rest/v1/deck_events';
    const key = el.dataset.key || '';
    let stored: string | null = null;
    try { stored = localStorage.getItem('edf:telemetry'); } catch { /* storage bloccato */ }
    const mode = trackingMode(location.search, stored);

    let sessionId = '';
    try { sessionId = sessionStorage.getItem('edf:telemetry:sid') || ''; } catch { /* ignore */ }
    if (!sessionId) { sessionId = makeSessionId(); try { sessionStorage.setItem('edf:telemetry:sid', sessionId); } catch { /* ignore */ } }

    let current: { id: string; index: number; since: number } | null = null;

    const send = (dwellMs: number) => {
      if (!current || mode !== 'on' || !key || !endpoint.startsWith('https://')) return;
      const lang = document.documentElement.getAttribute('data-lang') || 'en';
      const ev = buildEvent({ project, pathname: location.pathname, search: location.search, slideId: current.id, slideIndex: current.index, lang, sessionId, dwellMs });
      try {
        fetch(endpoint, {
          method: 'POST', keepalive: true,
          headers: { 'Content-Type': 'application/json', apikey: key, Authorization: 'Bearer ' + key, Prefer: 'return=minimal' },
          body: JSON.stringify(ev),
        }).catch(() => { /* la telemetria non deve mai rompere il deck */ });
      } catch { /* ignore */ }
    };

    const flush = () => { if (current) { send(performance.now() - current.since); current = { ...current, since: performance.now() }; } };

    document.addEventListener('deck:change', (e: Event) => {
      const d = (e as CustomEvent).detail as { index: number; id: string };
      if (current) send(performance.now() - current.since);
      current = { id: d.id || 'slide-' + d.index, index: d.index, since: performance.now() };
    });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
    window.addEventListener('pagehide', flush);
    document.addEventListener('astro:before-swap', flush);
  }
</script>
```

- [ ] **Step 2: Montarlo nell'Atelier**

In `apps/atelier/src/layouts/BaseLayout.astro`, frontmatter: `import DeckTelemetry from '@edf/core/blocks/immersive/DeckTelemetry.astro';`. Nel body, dopo `<MadeWith />`:
```astro
    <!-- Il deck misura se stesso, in modo anonimo (spec §2). -->
    <DeckTelemetry project={PROJECT_SLUG} url={SUPABASE_URL} anonKey={SUPABASE_ANON_KEY} />
```

- [ ] **Step 3: Build, preview e prova end-to-end**

Run:
```bash
pnpm --filter atelier build && (pnpm --filter atelier preview --port 4399 &) && sleep 3
node -e "
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:4399/experience-design-factory/atelier/', { waitUntil: 'networkidle' });
  for (let i = 0; i < 2; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(800); }
  await p.waitForTimeout(500); await b.close(); })();"
set -a; source apps/atelier/.env; set +a
curl -s -X POST "$PUBLIC_SUPABASE_URL/rest/v1/rpc/atelier_slide_stats" -H "apikey: $PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $PUBLIC_SUPABASE_ANON_KEY" -H "Content-Type: application/json" -d '{}'
```
Expected: la RPC restituisce righe con `route: "atelier"`, `slide_id` `slide-cover`/`slide-wall`, `sessions: 1`. Nota: la build locale legge `PUBLIC_SUPABASE_*` dal `.env` dell'app; senza chiavi il blocco non invia (fail-closed).

- [ ] **Step 4: Verificare l'opt-out**

Aprire `http://localhost:4399/experience-design-factory/atelier/?telemetry=0`, avanzare 2 slide, rilanciare la RPC: le `views` non cambiano.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/blocks/immersive/DeckTelemetry.astro apps/atelier/src/layouts/BaseLayout.astro
git commit -m "feat(core): DeckTelemetry — il deck misura se stesso; montato sull'Atelier"
git push origin main
```

---

## Parte B — Prova (b): il MCP server `atelier`

### Task 4: Estrarre `scripts/lib/brand-tokens.ts` (TDD)

**Files:**
- Create: `scripts/lib/brand-tokens.ts`, `scripts/lib/brand-tokens.test.ts`
- Modify: `scripts/brand-tokens.ts` (diventa un wrapper CLI)
- Modify: `package.json` (script `test:scripts`)

**Interfaces:**
- Produces:
  ```ts
  export interface Hit { value: string; count: number }
  export interface BrandTokens { hostname: string; sheets: number; cssKb: number; brand: Hit[]; framework: Hit[]; neutrals: Hit[]; customProperties: string[]; fonts: Hit[] }
  export function analyzeCss(css: string, top?: number): Omit<BrandTokens, 'hostname' | 'sheets' | 'cssKb'>
  export function stylesheetUrls(html: string, base: string): string[]
  export async function readBrandTokens(url: string, opts?: { top?: number; fetchText?: (u: string) => Promise<string> }): Promise<BrandTokens>
  ```

- [ ] **Step 1: Scrivere il test (fallisce)**

```ts
// scripts/lib/brand-tokens.test.ts
import { describe, it, expect } from 'vitest';
import { analyzeCss, stylesheetUrls, readBrandTokens } from './brand-tokens';

const CSS = `
  :root { --uc-petrolio: #007A91; --bs-primary: #0d6efd; }
  a { color: #007a91; } .tab.active { border-color: #007A91; } .btn { background: #E2001A; }
  body { font-family: "unicredit-regular", Arial, sans-serif; } h1 { font-family: Manrope, sans-serif; }
  .x { color: #fff; } .y { color: #ffffff; } .z { color: #0d6efd; }
`;

describe('analyzeCss', () => {
  it('ranks brand colours by frequency, merging #FFF/#ffffff and 3/6-digit forms', () => {
    const r = analyzeCss(CSS, 5);
    expect(r.brand[0]).toEqual({ value: '#007a91', count: 3 });
    expect(r.brand[1]).toEqual({ value: '#e2001a', count: 1 });
    expect(r.neutrals[0]).toEqual({ value: '#ffffff', count: 2 });
  });
  it('separates framework defaults and own custom properties', () => {
    const r = analyzeCss(CSS, 5);
    expect(r.framework).toEqual([{ value: '#0d6efd', count: 2 }]);
    expect(r.customProperties).toEqual(['--uc-petrolio: #007a91']);
  });
  it('lists declared font families, first of each stack', () => {
    expect(analyzeCss(CSS).fonts.map((f) => f.value)).toEqual(['unicredit-regular', 'Manrope']);
  });
});

describe('stylesheetUrls', () => {
  it('resolves relative hrefs against the page', () => {
    const html = '<link rel="stylesheet" href="/css/main.css"><link rel="icon" href="/x.ico">';
    expect(stylesheetUrls(html, 'https://www.example.it/home')).toEqual(['https://www.example.it/css/main.css']);
  });
});

describe('readBrandTokens', () => {
  it('fetches the page and its sheets through the injected fetcher', async () => {
    const pages: Record<string, string> = {
      'https://www.example.it/': '<link rel="stylesheet" href="/a.css"><style>.i{color:#123456}</style>',
      'https://www.example.it/a.css': CSS,
    };
    const r = await readBrandTokens('https://www.example.it/', { fetchText: async (u) => pages[u] ?? '' });
    expect(r.hostname).toBe('www.example.it');
    expect(r.sheets).toBe(1);
    expect(r.brand[0].value).toBe('#007a91');
  });
});
```

- [ ] **Step 2: Aggiungere lo script di test per `scripts/` e vederlo fallire**

In `package.json` (root) aggiungere a `scripts`: `"test:scripts": "vitest run --dir scripts"`.
Run: `pnpm test:scripts`
Expected: FAIL — `Cannot find module './brand-tokens'`.

- [ ] **Step 3: Implementare la lib spostando le funzioni dallo script**

```ts
// scripts/lib/brand-tokens.ts
/**
 * Lettura del design system PUBBLICO di un sito dal suo CSS di produzione.
 * Funzioni pure (analyzeCss) + una lettura via fetch (readBrandTokens), usate dal
 * CLI `pnpm brand:tokens` e dal tool MCP `brand_tokens`. Evidenza, non decisioni.
 */
export interface Hit { value: string; count: number }
export interface BrandTokens {
  hostname: string; sheets: number; cssKb: number;
  brand: Hit[]; framework: Hit[]; neutrals: Hit[]; customProperties: string[]; fonts: Hit[];
}

const FRAMEWORK_DEFAULTS = new Set([
  '#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107',
  '#198754', '#20c997', '#0dcaf0', '#6c757d', '#212529', '#0a58ca', '#157347',
  '#3b71ca', '#14a44d', '#dc4c64', '#e4a11b', '#54b4d3',
]);
const FRAMEWORK_VAR_PREFIXES = ['--bs-', '--tw-', '--mdc-', '--mat-', '--ion-', '--wp-', '--chakra-'];
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' } });
  if (!res.ok) throw new Error(`${res.status} su ${url}`);
  return res.text();
}

export function stylesheetUrls(html: string, base: string): string[] {
  const out = new Set<string>();
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    if (!/stylesheet/i.test(tag)) continue;
    const href = /href\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
    if (href) { try { out.add(new URL(href, base).href); } catch { /* href malformato */ } }
  }
  return [...out];
}

export function normalizeHex(h: string): string {
  let v = h.replace('#', '').toLowerCase();
  if (v.length === 3) v = v.split('').map((c) => c + c).join('');
  return `#${v}`;
}

export function isNeutral(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return Math.max(r, g, b) - Math.min(r, g, b) < 12;
}

function tally(re: RegExp, css: string, map: (m: RegExpExecArray) => string | null): Hit[] {
  const counts = new Map<string, number>();
  const rx = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  let m: RegExpExecArray | null;
  while ((m = rx.exec(css))) { const v = map(m); if (v) counts.set(v, (counts.get(v) ?? 0) + 1); }
  return [...counts.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
}

export function analyzeCss(css: string, top = 12): Omit<BrandTokens, 'hostname' | 'sheets' | 'cssKb'> {
  const hexes = tally(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/, css, (m) => normalizeHex(m[0]));
  const chromatic = hexes.filter((h) => !isNeutral(h.value));
  const vars = tally(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,6})/i, css, (m) => `--${m[1]}: ${normalizeHex(m[2])}`);
  const fonts = tally(/font-family\s*:\s*([^;}]+)/i, css, (m) => {
    const first = m[1].split(',')[0].replace(/["']/g, '').trim();
    return /^(inherit|initial|unset|var\()/i.test(first) || !first ? null : first;
  });
  return {
    brand: chromatic.filter((h) => !FRAMEWORK_DEFAULTS.has(h.value)).slice(0, top),
    framework: chromatic.filter((h) => FRAMEWORK_DEFAULTS.has(h.value)).slice(0, 6),
    neutrals: hexes.filter((h) => isNeutral(h.value)).slice(0, 6),
    customProperties: vars.filter((v) => !FRAMEWORK_VAR_PREFIXES.some((p) => v.value.startsWith(p))).slice(0, 18).map((v) => v.value),
    fonts: fonts.slice(0, 10),
  };
}

export async function readBrandTokens(url: string, opts: { top?: number; fetchText?: (u: string) => Promise<string> } = {}): Promise<BrandTokens> {
  const get = opts.fetchText ?? fetchText;
  const html = await get(url);
  const sheets = stylesheetUrls(html, url);
  let css = (html.match(/<style\b[^>]*>([\s\S]*?)<\/style>/gi) ?? []).join('\n');
  let fetched = 0;
  for (const s of sheets.slice(0, 12)) { try { css += '\n' + (await get(s)); fetched++; } catch { /* un foglio in meno */ } }
  return { hostname: new URL(url).hostname, sheets: fetched, cssKb: Math.round(css.length / 1024), ...analyzeCss(css, opts.top) };
}
```

Poi `scripts/brand-tokens.ts` mantiene SOLO: il commento di testa (invariato), `swatch()`, e un `main()` che fa parsing degli argomenti, chiama `readBrandTokens(url, { top: TOP })` e stampa le stesse sezioni di oggi (COLORI DI MARCA, default di framework, NEUTRI, CUSTOM PROPERTY, CARATTERI, COSA FARNE) leggendo dal risultato. Rimuovere da `scripts/brand-tokens.ts` le funzioni `get`, `stylesheetUrls`, `normalizeHex`, `isNeutral`, `tally` e le costanti `FRAMEWORK_*`, `UA`; importarle da `./lib/brand-tokens`.

- [ ] **Step 4: Test verdi e CLI invariato**

Run: `pnpm test:scripts` → Expected: 5 PASS.
Run: `pnpm brand:tokens https://www.agos.it | head -12` → Expected: le stesse sezioni di prima, con `#05636b` in testa ai colori di marca.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/brand-tokens.ts scripts/lib/brand-tokens.test.ts scripts/brand-tokens.ts package.json
git commit -m "refactor(scripts): brand-tokens diventa una lib testata, il CLI la usa"
git push origin main
```

### Task 5: Registry delle experience per il server MCP

**Files:**
- Create: `scripts/gen-experiences-registry.ts`
- Create (generato): `packages/mcp-atelier/src/registry.json`
- Modify: `package.json` (script `mcp:registry`)

**Interfaces:**
- Consumes: `EXPERIENCES` da `apps/factory-showcase/src/data/experiences.ts`.
- Produces: `registry.json` = `Array<{ slug, name, client, url, sections, tag: {en,it}, desc: {en,it} }>` + `generatedAt`.

- [ ] **Step 1: Scrivere il generatore**

```ts
// scripts/gen-experiences-registry.ts
/**
 * Genera packages/mcp-atelier/src/registry.json dal registry dello showcase
 * (l'unica fonte di verità per nomi, clienti, URL e conteggi). Rilanciare a ogni
 * nuova experience:  pnpm mcp:registry
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { EXPERIENCES } from '../apps/factory-showcase/src/data/experiences';

const out = path.resolve('packages/mcp-atelier/src/registry.json');
const registry = {
  generatedAt: new Date().toISOString(),
  experiences: EXPERIENCES.map((e) => ({
    slug: e.slug, name: e.name, client: e.client, url: e.url, sections: e.sections, tag: e.tag, desc: e.desc,
  })),
};
await writeFile(out, JSON.stringify(registry, null, 2) + '\n');
console.log(`${registry.experiences.length} experience → ${path.relative(process.cwd(), out)}`);
```

In `package.json` root, `scripts`: `"mcp:registry": "tsx scripts/gen-experiences-registry.ts"`.

- [ ] **Step 2: Generare e verificare**

Run: `mkdir -p packages/mcp-atelier/src && pnpm mcp:registry && node -e "const r=require('./packages/mcp-atelier/src/registry.json');console.log(r.experiences.length, r.experiences.map(e=>e.slug).join(' '))"`
Expected: `10 generazioni-maxmara unicredit-engagement ferrari-racing trenitalia-connessioni agos-trait-dunion atelier eni-orbita mim-alfabeti isybank-momento aperture-email`.

- [ ] **Step 3: Commit**

```bash
git add scripts/gen-experiences-registry.ts packages/mcp-atelier/src/registry.json package.json
git commit -m "feat(mcp): registry delle experience generato dallo showcase"
git push origin main
```

### Task 6: Pacchetto `packages/mcp-atelier` (TDD sui tool)

**Files:**
- Create: `packages/mcp-atelier/package.json`, `tsconfig.json`, `vitest.config.ts`, `README.md`, `src/tools.ts`, `src/tools.test.ts`, `src/index.ts`

**Interfaces:**
- Consumes: `registry.json` (Task 5), `readBrandTokens` (Task 4).
- Produces:
  ```ts
  export type Cut = 'full' | 'sponsor';
  export function listExperiences(reg: Registry): Array<{ slug: string; name: string; client: string; url: string; sections: number; tag: string }>
  export function openExperience(reg: Registry, args: { slug: string; cut?: Cut; lang?: 'en' | 'it' | 'fr' }): { url: string; name: string } | { error: string; known: string[] }
  export async function brandTokens(args: { url: string; top?: number }, read?: typeof readBrandTokens): Promise<BrandTokens>
  ```
  Server MCP `atelier` (stdio) con i tre tool `list_experiences`, `open_experience`, `brand_tokens`.

- [ ] **Step 1: Scaffold del pacchetto**

`packages/mcp-atelier/package.json`:
```json
{
  "name": "@agargiulo-adbe/mcp-atelier",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "bin": { "mcp-atelier": "./dist/index.js" },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "vitest run",
    "start": "node dist/index.js",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.20.0",
    "zod": "^3.25.0"
  },
  "devDependencies": { "typescript": "^5.8.3", "vitest": "^2.1.8" }
}
```
`packages/mcp-atelier/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "NodeNext", "moduleResolution": "NodeNext",
    "strict": true, "esModuleInterop": true, "skipLibCheck": true, "resolveJsonModule": true,
    "outDir": "./dist", "rootDir": "./src", "declaration": false, "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts"]
}
```
`packages/mcp-atelier/vitest.config.ts`: copia di `packages/core/vitest.config.ts`.
Run: `pnpm install` (aggiunge il workspace e la SDK). Expected: nessun errore; `ls node_modules/@modelcontextprotocol/sdk` esiste.

- [ ] **Step 2: Test dei tool (falliscono)**

```ts
// packages/mcp-atelier/src/tools.test.ts
import { describe, it, expect } from 'vitest';
import { listExperiences, openExperience, brandTokens, type Registry } from './tools';

const reg: Registry = { generatedAt: '2026-09-14T00:00:00Z', experiences: [
  { slug: 'atelier', name: 'Experience Atelier', client: 'Adobe Italy', url: 'https://x.test/experience-design-factory/atelier/', sections: 7, tag: { en: 'Trilingual', it: 'Trilingue' }, desc: { en: 'd', it: 'd' } },
  { slug: 'ferrari-racing', name: 'Pole Position', client: 'Ferrari Racing', url: 'https://x.test/experience-design-factory/ferrari-racing/', sections: 9, tag: { en: 'Bilingual', it: 'Bilingue' }, desc: { en: 'd', it: 'd' } },
] };

describe('listExperiences', () => {
  it('returns one compact row per experience, EN tag', () => {
    expect(listExperiences(reg)).toEqual([
      { slug: 'atelier', name: 'Experience Atelier', client: 'Adobe Italy', url: reg.experiences[0].url, sections: 7, tag: 'Trilingual' },
      { slug: 'ferrari-racing', name: 'Pole Position', client: 'Ferrari Racing', url: reg.experiences[1].url, sections: 9, tag: 'Bilingual' },
    ]);
  });
});

describe('openExperience', () => {
  it('builds the plain URL by default', () => {
    expect(openExperience(reg, { slug: 'ferrari-racing' })).toEqual({ url: reg.experiences[1].url, name: 'Pole Position' });
  });
  it('adds the sponsor cut and the language for the atelier', () => {
    expect(openExperience(reg, { slug: 'atelier', cut: 'sponsor', lang: 'fr' })).toEqual({ url: reg.experiences[0].url + '?s=asks&lang=fr', name: 'Experience Atelier' });
  });
  it('rejects a sponsor cut outside the atelier and unknown slugs', () => {
    expect(openExperience(reg, { slug: 'ferrari-racing', cut: 'sponsor' })).toEqual({ error: 'the sponsor cut exists only for "atelier"', known: ['atelier', 'ferrari-racing'] });
    expect(openExperience(reg, { slug: 'nope' })).toEqual({ error: 'unknown experience "nope"', known: ['atelier', 'ferrari-racing'] });
  });
});

describe('brandTokens', () => {
  it('delegates to the reader and returns its result', async () => {
    const fake = async (url: string) => ({ hostname: new URL(url).hostname, sheets: 1, cssKb: 3, brand: [{ value: '#05636b', count: 9 }], framework: [], neutrals: [], customProperties: [], fonts: [] });
    const r = await brandTokens({ url: 'https://www.agos.it' }, fake as never);
    expect(r.hostname).toBe('www.agos.it'); expect(r.brand[0].value).toBe('#05636b');
  });
});
```
Run: `pnpm --filter @agargiulo-adbe/mcp-atelier test` → Expected: FAIL (`./tools` mancante).

- [ ] **Step 3: Implementare i tool**

```ts
// packages/mcp-atelier/src/tools.ts
import { readBrandTokens, type BrandTokens } from '../../../scripts/lib/brand-tokens.js';

export interface RegistryEntry { slug: string; name: string; client: string; url: string; sections: number; tag: { en: string; it: string }; desc: { en: string; it: string } }
export interface Registry { generatedAt: string; experiences: RegistryEntry[] }
export type Cut = 'full' | 'sponsor';
export type Lang = 'en' | 'it' | 'fr';

/** Il taglio sponsor è un contratto del solo deck Atelier (solution ids del suo admin). */
const SPONSOR_CUT: Record<string, string> = { atelier: 'asks' };

export function listExperiences(reg: Registry) {
  return reg.experiences.map((e) => ({ slug: e.slug, name: e.name, client: e.client, url: e.url, sections: e.sections, tag: e.tag.en }));
}

export function openExperience(reg: Registry, args: { slug: string; cut?: Cut; lang?: Lang }) {
  const known = reg.experiences.map((e) => e.slug);
  const e = reg.experiences.find((x) => x.slug === args.slug);
  if (!e) return { error: `unknown experience "${args.slug}"`, known };
  const params = new URLSearchParams();
  if (args.cut === 'sponsor') {
    const ids = SPONSOR_CUT[e.slug];
    if (!ids) return { error: `the sponsor cut exists only for "${Object.keys(SPONSOR_CUT).join('", "')}"`, known };
    params.set('s', ids);
  }
  if (args.lang) params.set('lang', args.lang);
  const q = params.toString();
  return { url: e.url + (q ? `?${q}` : ''), name: e.name };
}

export async function brandTokens(args: { url: string; top?: number }, read: typeof readBrandTokens = readBrandTokens): Promise<BrandTokens> {
  const url = /^https?:\/\//.test(args.url) ? args.url : `https://${args.url}`;
  return read(url, { top: args.top ?? 12 });
}
```
Nota: l'import relativo a `scripts/lib` con estensione `.js` è richiesto da `NodeNext`; `tsc` compila anche quel file dentro `dist` perché è fuori da `rootDir` → per evitarlo, aggiungere in `tsconfig.json` `"rootDir": "../.."` e `"outDir": "./dist"`, e in `package.json` `"bin": { "mcp-atelier": "./dist/packages/mcp-atelier/src/index.js" }`, `"start": "node dist/packages/mcp-atelier/src/index.js"`. Verificare con `pnpm --filter @agargiulo-adbe/mcp-atelier build && ls dist/packages/mcp-atelier/src`.

- [ ] **Step 4: Test verdi**

Run: `pnpm --filter @agargiulo-adbe/mcp-atelier test` → Expected: 5 PASS.

- [ ] **Step 5: Il server stdio**

```ts
// packages/mcp-atelier/src/index.ts
#!/usr/bin/env node
/**
 * MCP server «atelier» — il motore della Factory, chiamabile da Claude, Copilot
 * o qualsiasi client MCP. Tre tool: elenca le experience, apri una experience
 * (taglio + lingua), leggi il design system pubblico di un sito.
 *   claude mcp add atelier -- node <repo>/packages/mcp-atelier/dist/packages/mcp-atelier/src/index.js
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { listExperiences, openExperience, brandTokens, type Registry } from './tools.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(readFileSync(path.join(here, 'registry.json'), 'utf8')) as Registry;
const text = (v: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(v, null, 2) }] });

const server = new McpServer({ name: 'atelier', version: '0.1.0' });

server.registerTool('list_experiences',
  { description: 'The live Experience Designs of the Factory: slug, name, client, URL, chapters.', inputSchema: {} },
  async () => text(listExperiences(registry)));

server.registerTool('open_experience',
  { description: 'URL to open one experience, optionally in the sponsor cut and in a given language (en|it|fr).',
    inputSchema: { slug: z.string(), cut: z.enum(['full', 'sponsor']).optional(), lang: z.enum(['en', 'it', 'fr']).optional() } },
  async (args) => text(openExperience(registry, args)));

server.registerTool('brand_tokens',
  { description: 'Read a site\'s public design system from its production CSS: colours by frequency, custom properties, fonts. Evidence, not decisions.',
    inputSchema: { url: z.string(), top: z.number().int().min(3).max(30).optional() } },
  async (args) => text(await brandTokens(args)));

await server.connect(new StdioServerTransport());
```
Se la SDK installata non espone `registerTool`, usare la forma `server.tool(name, description, shape, handler)` con gli stessi argomenti. Copiare `registry.json` in `dist` nello script `build`: `"build": "tsc -p tsconfig.json && cp src/registry.json dist/packages/mcp-atelier/src/registry.json"`.

- [ ] **Step 6: README e prova reale da Claude Code**

`packages/mcp-atelier/README.md`: cosa fa, i tre tool con un esempio di chiamata ciascuno, installazione (`pnpm --filter @agargiulo-adbe/mcp-atelier build`, poi `claude mcp add atelier -- node "$PWD/packages/mcp-atelier/dist/packages/mcp-atelier/src/index.js"`), nota «rigenerare il registry con `pnpm mcp:registry`».
Run:
```bash
pnpm --filter @agargiulo-adbe/mcp-atelier build
claude mcp add atelier -- node "$PWD/packages/mcp-atelier/dist/packages/mcp-atelier/src/index.js"
claude -p "Use the atelier MCP server: list the experiences, then give me the URL of Pole Position in Italian, then read the brand tokens of https://www.agos.it (top 5). Reply with the three raw results." > /tmp/mcp-transcript.txt
```
Expected: `/tmp/mcp-transcript.txt` contiene i 10 slug, l'URL `.../ferrari-racing/?lang=it`, e `#05636b` fra i colori Agos. Salvare la trascrizione (Task 7).

- [ ] **Step 7: Lint/typecheck e commit**

Run: `pnpm typecheck && pnpm lint` → 0 errori (aggiungere `packages/mcp-atelier/dist/**` è già coperto da `**/dist/**`).
```bash
git add packages/mcp-atelier
git commit -m "feat(mcp): il server atelier — tre tool per aprire e leggere la Factory da Claude"
git push origin main
```

### Task 7: `?lang=` nel core, Agent Skills e trascrizione versionata

**Files:**
- Modify: `packages/core/src/blocks/i18n/LangToggle.astro` (script inline, prima di `apply(current());`)
- Create: `skills/brand-tokens/SKILL.md`, `skills/open-experience/SKILL.md`
- Create: `apps/atelier/src/data/mcp-transcript.ts`

**Interfaces:**
- Produces: `?lang=en|it|fr` applicato e persistito su tutte le app; `MCP_TRANSCRIPT: Array<{ role: 'user' | 'tool' | 'assistant'; tool?: string; text: string }>`.

- [ ] **Step 1: `?lang=` nel LangToggle**

Nello script inline di `LangToggle.astro`, subito prima della riga `apply(current());`, inserire:
```js
    // Un link può portare la lingua: ?lang=it. Vale solo se questa pagina la offre,
    // e viene persistita come una scelta dal toggle.
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q && KNOWN[q] && offered()[q]) setLang(q);
    } catch (e) {}
```
Verifica: `pnpm --filter atelier build && pnpm --filter atelier preview --port 4399` e aprire `.../atelier/?lang=fr` → la nav è in francese; `.../ferrari-racing/?lang=it` (build ferrari) → IT. Le altre app non cambiano senza il parametro.

- [ ] **Step 2: Le due Agent Skills**

`skills/brand-tokens/SKILL.md` (frontmatter `name: brand-tokens`, `description: Read a client's public design system from its production CSS before designing anything for them; use the atelier MCP tool brand_tokens or pnpm brand:tokens.`) con: quando usarla (primo passo di ogni experience), come leggere l'evidenza (il più frequente è il colore di sistema, il marchio è raro), cosa NON fare (decidere token dal brand book a memoria), l'output atteso (tabella colori/font + proposta di mapping `--surface/--ink/--accent`).
`skills/open-experience/SKILL.md` (frontmatter `name: open-experience`, `description: Find and open a Factory experience for a meeting — right cut, right language — via the atelier MCP tools list_experiences and open_experience.`) con: come scegliere l'experience per cliente/settore, quando usare il taglio sponsor, come passare la lingua, cosa condividere (link, mai screenshot).

- [ ] **Step 3: La trascrizione reale**

Da `/tmp/mcp-transcript.txt` (Task 6) comporre:
```ts
// apps/atelier/src/data/mcp-transcript.ts
/** Trascrizione REALE di una sessione Claude Code con il server MCP «atelier»,
 *  catturata il <data>. Non inventare righe: si ricattura, non si ritocca. */
export interface TranscriptLine { role: 'user' | 'tool' | 'assistant'; tool?: string; text: string }
export const MCP_TRANSCRIPT_DATE = '<YYYY-MM-DD>';
export const MCP_TRANSCRIPT: TranscriptLine[] = [
  { role: 'user', text: 'List the experiences, then give me Pole Position in Italian, then read the brand tokens of agos.it.' },
  { role: 'tool', tool: 'list_experiences', text: '<prime 3 righe del JSON reale, poi "… 7 more"' },
  { role: 'tool', tool: 'open_experience', text: '{ "url": "https://agargiulo-adbe.github.io/experience-design-factory/ferrari-racing/?lang=it", "name": "Pole Position" }' },
  { role: 'tool', tool: 'brand_tokens', text: '<le prime 3 righe brand del JSON reale>' },
  { role: 'assistant', text: '<la risposta finale di Claude, accorciata a 2 righe, verbatim>' },
];
```
I segnaposto `<…>` vanno sostituiti con il testo reale della cattura (è l'unico punto del piano dove il contenuto viene da un'esecuzione, non da questo documento).

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/blocks/i18n/LangToggle.astro skills/brand-tokens skills/open-experience apps/atelier/src/data/mcp-transcript.ts
git commit -m "feat: ?lang= nei deck, due Agent Skills e la trascrizione reale della sessione MCP"
git push origin main
```

---

## Parte C — Il deck

> Regola per il copy in questa parte: le stringhe **EN** sono il testo del deck e vanno usate
> verbatim; **IT** e **FR** dove non date vanno rese idiomatiche (mai eco letterale, regola
> de-AI, stessa lunghezza ±10%). Ogni fonte va sulla slide con data. Le classi CSS nuove
> stanno in `apps/atelier/src/styles/global.css` sotto il commento `/* ═══ 2026-09-14 tre mosse ═══ */`.
> Ogni task di questa parte finisce con `pnpm --filter atelier build` verde e uno screenshot
> 1920 EN+FR delle slide toccate, letto a occhio (script: vedi Task 16 Step 2).

### Task 8: Le due slide di prova in The capability + ritocchi ad anatomy e adobe-stack

**Files:**
- Create: `apps/atelier/src/components/TelemetryPanel.astro`
- Modify: `apps/atelier/src/pages/capability.astro` (dopo `slide-console`), `apps/atelier/src/styles/global.css`, `apps/atelier/src/pages/admin.astro` (PAGE_REGISTRY capability)

**Interfaces:**
- Consumes: RPC `atelier_slide_stats` (Task 1), `MCP_TRANSCRIPT` (Task 7), `trackingMode` semantics (`?telemetry=mock` → il pannello mostra dati di esempio etichettati).
- Produces: slide `slide-proof-telemetry`, `slide-proof-mcp`; classi `.proof-*`.

- [ ] **Step 1: `TelemetryPanel.astro`** — pannello con 4 tessere (Sessions · Slides seen · Median dwell · Most seen slide) + una lista «by cut» (full/sponsor) e «by language». Script bundled:
```astro
---
interface Props { url: string; anonKey: string }
const { url, anonKey } = Astro.props as Props;
---
<div class="proof-telemetry loom-panel" data-telemetry-panel data-url={url} data-key={anonKey} aria-live="polite">
  <div class="loom-panel-head"><p class="loom-tag"><span data-lang-en>Live · this deck, right now</span><span data-lang-it>Dal vivo · questo deck, adesso</span><span data-lang-fr>En direct · ce deck, maintenant</span></p><p class="atl-label" data-telemetry-status>—</p></div>
  <div class="proof-tiles">
    {[['sessions','Sessions','Sessioni','Sessions'],['slides','Slides seen','Slide viste','Slides vues'],['dwell','Median dwell','Permanenza mediana','Temps médian'],['top','Most seen slide','Slide più vista','Slide la plus vue']].map(([k,en,it,fr]) => (
      <div class="proof-tile"><p class="loom-figure" data-telemetry={k}>—</p><p class="atl-label"><span data-lang-en>{en}</span><span data-lang-it>{it}</span><span data-lang-fr>{fr}</span></p></div>
    ))}
  </div>
  <p class="proof-foot"><span data-lang-en>Anonymous: a random id per tab, no cookies, no personal data. Switch it off with ?telemetry=0.</span><span data-lang-it>Anonima: un id casuale per scheda, niente cookie, niente dati personali. Si spegne con ?telemetry=0.</span><span data-lang-fr>Anonyme&nbsp;: un identifiant aléatoire par onglet, ni cookie ni donnée personnelle. Désactivable avec ?telemetry=0.</span></p>
</div>
<script>
  const el = document.querySelector<HTMLElement>('[data-telemetry-panel]');
  type Row = { route: string; slide_id: string; cut: string; lang: string; views: number; sessions: number; median_dwell_ms: number };
  const MOCK: Row[] = [
    { route: 'atelier', slide_id: 'slide-cover', cut: 'full', lang: 'en', views: 40, sessions: 28, median_dwell_ms: 9000 },
    { route: 'capability', slide_id: 'slide-toggle-demo', cut: 'full', lang: 'en', views: 31, sessions: 24, median_dwell_ms: 42000 },
    { route: 'plan', slide_id: 'slide-roadmap', cut: 'asks', lang: 'fr', views: 12, sessions: 9, median_dwell_ms: 38000 },
  ];
  async function load(): Promise<Row[] | null> {
    if (!el) return null;
    if (new URLSearchParams(location.search).get('telemetry') === 'mock') return MOCK;
    const url = (el.dataset.url || '').replace(/\/$/, ''); const key = el.dataset.key || '';
    if (!url || !key) return null;
    try {
      const r = await fetch(url + '/rest/v1/rpc/atelier_slide_stats', { method: 'POST', headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: '{}' });
      return r.ok ? (await r.json()) as Row[] : null;
    } catch { return null; }
  }
  function render(rows: Row[] | null) {
    if (!el) return;
    const set = (k: string, v: string) => { const n = el.querySelector<HTMLElement>(`[data-telemetry="${k}"]`); if (n) n.textContent = v; };
    const status = el.querySelector<HTMLElement>('[data-telemetry-status]');
    if (!rows || !rows.length) { if (status) status.textContent = rows ? 'no data yet' : 'offline'; return; }
    const sessions = new Set<string>(); // sessions are already distinct per row; approximate as max per route
    const bySlide = new Map<string, number>(); let dwell: number[] = []; let maxSessions = 0;
    for (const r of rows) { bySlide.set(r.route + '/' + r.slide_id, (bySlide.get(r.route + '/' + r.slide_id) ?? 0) + r.views); dwell.push(r.median_dwell_ms); maxSessions = Math.max(maxSessions, r.sessions); }
    dwell.sort((a, b) => a - b);
    const top = [...bySlide.entries()].sort((a, b) => b[1] - a[1])[0];
    set('sessions', String(maxSessions)); set('slides', String(bySlide.size));
    set('dwell', Math.round(dwell[Math.floor(dwell.length / 2)] / 1000) + ' s'); set('top', top ? top[0].split('/')[1].replace('slide-', '') : '—');
    if (status) status.textContent = new URLSearchParams(location.search).get('telemetry') === 'mock' ? 'sample data' : 'live';
    void sessions;
  }
  load().then(render);
  document.addEventListener('astro:page-load', () => load().then(render));
</script>
```
CSS in `global.css`: `.proof-tiles { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: .9rem; }`, `.proof-tile { text-align:center; padding: .6rem 0; }`, `.proof-foot { color: var(--color-sabbia-300); font-size: .85rem; line-height: 1.5; margin-top: .9rem; max-width:none; }`, `@media (max-width: 767px) { .proof-tiles { grid-template-columns: repeat(2, minmax(0,1fr)); } }`.

- [ ] **Step 2: `slide-proof-telemetry`** (in `capability.astro`, dopo `slide-console`, `bg="primary"`, `align="left"`, `data-made-with=""`):
   - eyebrow `Proof · v0 built in N days` (N reale) · h2 EN «This deck is watching itself» · IT «Questo deck si guarda da solo» · FR «Ce deck s'observe lui-même» · lede EN «Every slide activation of this deck writes an anonymous event. Not a promise: the numbers below are from the deck you are looking at.» · `<TelemetryPanel url={SUPABASE_URL} anonKey={SUPABASE_ANON_KEY} />` (passare le env dal frontmatter come in `admin.astro`).
- [ ] **Step 3: `slide-proof-mcp`** (`bg="secondary"`, `align="left"`, `data-made-with=""`): eyebrow `Proof · v0 built in N days` · h2 EN «The engine, from inside Claude» · IT «Il motore, da dentro Claude» · FR «Le moteur, depuis Claude» · sinistra: lede EN «Three tools, one MCP server. A seller lists the live experiences, opens one in the right cut and language, or reads a client's design system from its production CSS, without leaving the assistant they already use.» + riga `.atl-label` «claude mcp add atelier — packages/mcp-atelier» · destra: pannello `.proof-transcript loom-panel` che mappa `MCP_TRANSCRIPT` (riga `user` in avorio, righe `tool` con tag champagne del nome tool e testo mono ≥0.85rem, riga `assistant` in sabbia-200) con data `MCP_TRANSCRIPT_DATE` in `.atl-label`. Font mono: `ui-monospace, SFMono-Regular, Menlo, monospace` (nessun font nuovo).
- [ ] **Step 4: Ritocchi** — `slide-anatomy` primo pannello fondazioni: titolo EN «Callable from Claude and Copilot» · body EN «An MCP server and Agent Skills expose the engine where sellers already work; the Admin Console configures each experience at runtime.» (IT/FR resi). `slide-adobe-stack` card 01 body: aggiungere in coda EN « A private Custom Model per client brand is in public beta: about an hour of training.» (IT/FR resi; ±10% del corpo complessivo → tagliare «never a stock photo of the wrong brand» se sfora).
- [ ] **Step 5: Registry admin** — in `admin.astro` sotto capability aggiungere `{ id: 'slide-proof-telemetry', label: 'Proof — this deck is watching itself (live telemetry)' }` e `{ id: 'slide-proof-mcp', label: 'Proof — the engine from inside Claude (MCP transcript)' }` dopo `slide-console`.
- [ ] **Step 6: Build + screenshot + commit**

Run: `pnpm --filter atelier build` → verde. Screenshot EN+FR di capability slide 6 e 7 a 1920 (script Task 16 Step 2, `--only capability`): tipo ≥0.95rem, pannello telemetria con `?telemetry=mock` che mostra «sample data».
```bash
git add apps/atelier
git commit -m "feat(atelier): le due prove — il deck che si guarda e il motore da dentro Claude"
git push origin main
```

### Task 9: Tesi, metodo e conformità

**Files:**
- Modify: `apps/atelier/src/pages/index.astro` (`slide-thesis`), `apps/atelier/src/pages/method.astro` (`evidence[3]`), `apps/atelier/src/layouts/BaseLayout.astro` (default `description`)

- [ ] **Step 1: Tesi** — sostituire l'h2 di `slide-thesis`:
   - EN «Every opportunity deserves its own experience: alive between meetings, measured, made with the products it sells. One person working with AI has shown it eight times in three months. This plan makes it an Adobe capability.»
   - IT «Ogni opportunità merita la sua esperienza: viva tra un meeting e l'altro, misurata, fatta con i prodotti che vende. Una persona che lavora con l'AI l'ha dimostrato otto volte in tre mesi. Questo piano ne fa una capacità di Adobe.»
   - FR «Chaque opportunité mérite son expérience&nbsp;: vivante entre deux réunions, mesurée, faite avec les produits qu'elle vend. Une personne travaillant avec l'IA l'a prouvé huit fois en trois mois. Ce plan en fait une capacité d'Adobe.»
   - `.thesis-title` resta `clamp(1.9rem, 2.9vw, 2.9rem)`; se a 1280×800 sfora (audit `c`/`k`), portare `max-width` a 58rem, non ridurre il tipo.
- [ ] **Step 2: Conformità** — in `method.astro`, `evidence[3]` diventa: claim EN «AI as a process rule, and AI Act art. 50 since 2 August 2026» · proof EN «Claude Enterprise within its approved data classes; no client data in prompts; every generated asset carries its record today, and an exportable art. 50 disclosure record by January 2027.» (IT/FR resi). Aggiornare `mth-foot` con «… audit scripts, and the transparency obligations of Regulation (EU) 2024/1689, art. 50.»
- [ ] **Step 3: description** del BaseLayout: «Experience Atelier — every opportunity deserves its own experience. The factory behind the Experience Designs, and the plan to make it an Adobe capability.»
- [ ] **Step 4: Build, screenshot (home 3, method 4), commit** `feat(atelier): la tesi nuova e la riga sull'art. 50`.

### Task 10: Capitolo 03 «The gap» + redirect di `multiplication`

**Files:**
- Create: `apps/atelier/src/pages/gap.astro`
- Modify: `apps/atelier/src/pages/multiplication.astro` (→ redirect), `apps/atelier/assets.manifest.ts` (+ `bg-gap`), `global.css` (`.gap-*`)

**Interfaces:**
- Produces: rotta `/gap/` con `slide-cover`(detail) · `slide-buyers` · `slide-market`(detail) · `slide-adobe` · `slide-precedent`(detail); `prevHref` `/capability`, `nextHref` `/moves`.

- [ ] **Step 1: Backdrop Firefly** — in `assets.manifest.ts` aggiungere `loom('bg-gap', 'a wide dark loom seen from above with one narrow gap where the golden threads stop and the warm darkness shows through, soft raking light, generous empty dark space', 504, 'A loom with one gap in the golden threads, warm darkness showing through.')` e `loom('bg-moves', 'three golden threads of light leaving a dark loom and moving forward together toward a distant warm glow, soft haze, generous empty dark space', 505, 'Three golden threads moving forward together toward a warm glow.')`. Run `pnpm --filter atelier assets:build` (rigenera tutti e 5; i seed 501–503 riproducono gli attuali). Verificare a occhio le due nuove.
- [ ] **Step 2: `gap.astro`** — copiare la struttura di `multiplication.astro` (imports, nav, `DeckContainer nextHref={href(base,'/moves')} prevHref={href(base,'/capability')}`). Cover: num `03`, kicker EN «The gap» IT «Il divario» FR «L'écart», h1 EN «What buyers want now.» IT «Cosa vogliono i buyer, adesso.» FR «Ce que veulent les acheteurs, aujourd'hui.», lede EN «Four numbers from 2025 and 2026, and where the category, and Adobe, moved because of them.», backdrop `bg-gap` a `opacity-[0.22]`, `data-made-with="Firefly" data-made-with-for="backdrop"`.
   - `slide-buyers` (`bg="secondary"`, 4 `.loom-panel` in griglia 2×2 con `.loom-figure` + body + `.mult-src`):
     1. `67%` — EN «of B2B buyers prefer a rep-free experience; 70% prefer fully digital self-service.» src «Gartner, 9 Mar 2026 (n=646)»
     2. `60/40` — EN «research versus engagement: buyers now spend 60% of the cycle without a vendor.» src «6sense, 12 Nov 2025 (4,000+ buyers)»
     3. `18%` — EN «name “their demo blew us away” as a deciding factor, up from 13%; demos and trials outrank every other content.» src «TrustRadius, 15 Jul 2026 (1,862 buyers)»
     4. `69%` — EN «turn to a human to validate AI-generated insights.» src «Gartner, 20 May 2026 (n=645)»
     Chiusura `.mult-close` EN «They want to move without us, and they trust what a person can vouch for.»
   - `slide-market` (`detail`, `bg="primary"`): h2 EN «The category converged on the deal workspace»; 4 `.loom-thread` (rail che si allarga): «Consensus acquires Peel and Saleo — “agentic product experience platform”» src «PR Newswire, 9 Jun 2026» · «Seismic and Highspot merge — 2,500 customers, 3.5M users» src «Seismic newsroom, 18 Aug 2026» · «Aligned raises $60M to become an “AI Deal Workspace”» src «GlobeNewswire, 1 Jul 2026» · «Mutiny retires an eight-figure SaaS product and relaunches as an agent that generates deal rooms» src «Forbes, 15 Apr 2026». `.loom-quote` EN «All of them ship engagement analytics and an AI rep. None of them ships a bespoke, brand-exact experience.»
   - `slide-adobe` (`bg="secondary"`): eyebrow EN «Adobe's own move», h2 EN «CX Enterprise: agents, skills and MCP endpoints», 3 `.loom-card`: «Experience Cloud became CX Enterprise: Agent Orchestrator, Brand Intelligence, an Agent Skills Catalog and MCP endpoints.» src «Adobe Summit, 20–22 Apr 2026» · «The Marketing Agent runs inside Microsoft 365 Copilot, Claude Enterprise, ChatGPT Enterprise and Gemini Enterprise.» src «Adobe newsroom, 20 Apr 2026» · «Adobe ships first-party MCP servers (Target, Analytics, Real-Time CDP, AEM) and the “Adobe for creativity” connector in Claude — the one this Factory is built with.» src «Adobe blog, 28 Apr 2026». `.mult-close` EN «We build in Adobe's grain. This deck is the proof.»
   - `slide-precedent` (`detail`, `bg="primary"`): h2 EN «The ones who got value industrialised a pattern»; 4 `.loom-card` 2×2: Moderna «3,000+ custom GPTs across ~5,000 employees» src «UNLEASH, 27 Jun 2025 (vendor-reported)» · JPMorgan «230,000+ employees on the LLM Suite, now configuring their own assistants» src «The Digital Banker, 6 Mar 2026» · Cisco «an agent for all 90,000 employees» src «PYMNTS, 27 Aug 2026» · MIT «95% of organisations report zero return on $30–40B of GenAI spend» src «MIT NANDA, Jul 2025 (not peer-reviewed)». `.loom-quote` EN «A pilot is not a programme. The asset is the pattern, not the eight decks.»
- [ ] **Step 3: Redirect** — `multiplication.astro` diventa una pagina minima: `<BaseLayout title="The gap">` con `<meta http-equiv="refresh" content={`0; url=${href(base,'/gap')}`} />` in uno slot `head`? Il BaseLayout non ha slot head: usare uno script inline nel body `location.replace(...)` + un `<a>` di fallback «Moved to The gap». Stessa cosa per `frontiers.astro` → `/moves` in Task 11.
- [ ] **Step 4: Build, audit `--only gap`, screenshot EN+FR delle 5 slide, commit** `feat(atelier): il capitolo The gap — cosa vogliono i buyer, dove si è mossa la categoria, dove si è mossa Adobe`.

### Task 11: Capitolo 04 «The three moves» + la simulazione + redirect di `frontiers`

**Files:**
- Create: `apps/atelier/src/pages/moves.astro`
- Modify: `apps/atelier/src/pages/frontiers.astro` (→ redirect `/moves`), `global.css` (`.mv-*`)

**Interfaces:**
- Produces: rotta `/moves/` con `slide-cover`(detail) · `slide-move-1` · `slide-move-2` · `slide-move-3` · `slide-simulation`(`data-solution="simulation"`); `prevHref` `/gap`, `nextHref` `/plan`.

- [ ] **Step 1: Cover** — num `04`, kicker EN «The three moves» IT «Le tre mosse» FR «Les trois mouvements», h1 EN «From pitch to buying surface.» IT «Dal pitch alla superficie d'acquisto.» FR «Du pitch à la surface d'achat.», lede EN «Three moves turn eight bespoke decks into a capability: alive between meetings, delivered where sellers already are, compliant by construction.», backdrop `bg-moves` 0.22 + `data-made-with`.
- [ ] **Step 2: `slide-move-1`** (`bg="secondary"`, split testo sinistra / mock destra `lg:grid-cols-[1fr_1.1fr]`): eyebrow `01`, h2 EN «Alive between meetings», body EN «The same experience keeps working after the room empties: every slide and every stakeholder measured; a buyer-facing agent grounded only in that build, answering at two in the morning; the engagement back to the account team. The agent is Brand Concierge, so Adobe is its own customer zero.» Mock (`.mv-mock loom-panel`, CSS puro): una miniatura di slide con a destra un pannello «Ask this experience» con 2 scambi di esempio etichettati «example» e sotto una timeline `.mv-timeline` con 3 tacche (Meeting · Reopened by CFO · Shared to 2 colleagues) etichettata «illustrative». `.mult-src` EN «Gated links per audience and the console already exist; telemetry v0 is live on this deck.»
- [ ] **Step 3: `slide-move-2`** (`bg="primary"`): eyebrow `02`, h2 EN «An experience per opportunity, in 24 hours, where sellers are», 4 `.loom-thread`: «Read the brand from its production CSS» (`pnpm brand:tokens`, exists) · «Brief with the guided intake; a private Firefly Custom Model per client (beta)» · «Build on the engine: images generated live, video pre-warmed» · «Deliver from inside Claude, Copilot or ChatGPT: the atelier MCP server and Agent Skills; scoping and configuration as MCP Apps in the client's assistant». `.loom-quote` EN «Never “video generated in the room”: the honest promise is images live, clips ready before the meeting.»
- [ ] **Step 4: `slide-move-3`** (`bg="secondary"`): eyebrow `03`, h2 EN «Provenance as compliance», 3 `.loom-card`: «Keep the C2PA manifest through the build (today it is lost in crop and convert)» · «Export an art. 50 disclosure record from provenance.json for every deck shown to a bank or a ministry — the obligation applies since 2 August 2026» src «Regulation (EU) 2024/1689 art. 50; Reg. (EU) 2026/1744» · «A credit on every slide, read from provenance». `.mult-src` EN «Adobe signs on the C2PA Interim Trust List; we say “provenance on record”, not “verified”.»
- [ ] **Step 5: `slide-simulation`** (`bg="primary"`, `data-solution="simulation"`, split testo/mock): eyebrow EN «The buying surface becomes a game», h2 EN «The simulation», body EN «The board is the client's real funnel, from the scoping model already in the engine. Each executive plays one division on their own device; an AI facilitator runs the clock; Adobe products are the tools that unlock what one division cannot. The closing artefact is a costed roadmap they built themselves.» `.mult-src` EN «Facilitated board games in pre-sales are SAP's format since 2018 (S/4HANA board game, BTP Diamond Game; SAP News 2020–2023). What is ours is what the board is made of.» Mock (`.mv-board loom-panel`): tavolo 3×3 di tessere con etichette funnel (Traffic · Leads · Meetings · Offers · Deals · Retention · NPS · Cost · Risk) e 5 pedine colorate (le tinte AA delle skin), badge «example data». Niente pixel-art.
- [ ] **Step 6: Redirect** `frontiers.astro` → `/moves` (come Task 10 Step 3).
- [ ] **Step 7: Build, audit `--only moves` (con `?s=asks,simulation,detail` di default: nessun gating attivo), screenshot EN+FR delle 5 slide, commit** `feat(atelier): le tre mosse e la simulazione`.

### Task 12: Il piano — Gantt a sei corsie, milestone, KPI

**Files:**
- Modify: `apps/atelier/src/pages/plan.astro` (dati in frontmatter: `milestones`, `ganttMonths`, `ganttMilestoneLabels`, `ganttMarkers`, `ganttRows`, `ganttMoments`, `kpiSlides`; cover copy), `apps/atelier/src/pages/admin.astro` (label plan)

- [ ] **Step 1: Asse** — 8 mesi: `ganttMonths` = Nov 2026, Dec, Jan 2027, Feb, Mar, Apr, May, Jun (8 mesi × 2 = 16 colonne dopo la corsia: `grid-template-columns: minmax(0, 10.5rem) repeat(16, minmax(0, 1fr))`; i mesi occupano `grid-column: ${2 + i*2} / span 2`). Marker: `{ col: '2', edge: 'start', today: true }` (Decision 31 Oct = inizio Nov) · M1 `{ col: '7', edge: 'end' }` (fine gen) · M2 `{ col: '11', edge: 'end' }` (fine mar) · M3 `{ col: '17', edge: 'end' }`. Label: «Decision · 31 Oct» col `1` right · «M1 · end Jan» col `5 / 9` · «M2 · Summit · 22–25 Mar» col `9 / 13` · «M3 · end Jun» col `14 / 18` right. Fasi: `P1 = '2 / 8'` (Nov → end Jan), `P2 = '8 / 12'` (Feb → Mar), `P3 = '12 / 18'` (Apr → Jun); `whenP1` «Nov → end Jan», `whenP2` «Feb → Mar», `whenP3` «Apr → Jun».
- [ ] **Step 2: Corsie** (`ganttRows`, in quest'ordine; testi EN, IT/FR resi):
   1. Trust & compliance — P1 «Telemetry, art. 50 record, C2PA kept, secrets out of the repo» · P2 «Security review» · P3 «Enterprise-managed auth via MCP»
   2. Buying surface — P1 «Telemetry live on 3 experiences» · P2 «Buyer agent (Brand Concierge) on 3» · P3 «On every experience»
   3. Distribution — P1 «MCP server v1 + 3 Agent Skills» · P2 «In the Agent Skills Catalog · MCP Apps for scoping» · P3 «Brief → experience in 24 h»
   4. Enablement — P1 «Pilot: 5–10 sellers» · P2 «Gallery + guided flow · 25–40» · P3 «100+ · EMEA, live translation»
   5. Ecosystem — P2 «2–3 partners co-build» · P3 «Partner pipeline · lighthouse client»
   6. Simulation (`solution: 'simulation'`) — P1 «Multiplayer skeleton on real funnel data» · P2 «Facilitated beta, first workshop» · P3 «Second industry pack»
   Grid rows: `grid-template-rows: auto auto repeat(6, auto) auto`; le linee verticali `grid-row: 3 / 9`; la riga «Key moments» `grid-row: 9`. `ganttMoments`: Decision 31 Oct 2026 · Hackathon day Feb 2027 · Adobe Summit, Las Vegas 22–25 Mar 2027. `pln-gantt-mobile-ms`: «M1 end of January 2027 · M2 22–25 March 2027 (Adobe Summit) · M3 end of June 2027».
- [ ] **Step 3: Milestone** — riscrivere `milestones[]`:
   - M1 kicker EN «Milestone 1 · by end of January 2027» title «Foundations» intro EN «From one person's project to a measured, compliant, callable platform.» work: «Pilot: five to ten Adobe Italia sellers build their first experience through the guided intake» · «Telemetry live on three experiences; art. 50 disclosure record exported from provenance; C2PA manifest kept through the build» · «MCP server v1 with three Agent Skills, used by the pilot from Claude Enterprise» · «One private Firefly Custom Model for one client brand (beta)» · «Simulation: multiplayer skeleton on real funnel data» targets EN «Brief to experience under one week · at least three pilot experiences in deals, with engagement data · zero art. 50 incidents · MCP server used by every pilot seller».
   - M2 kicker «Milestone 2 · by Adobe Summit, Las Vegas, 22–25 March 2027» title «Scale and open» intro EN «The buying surface gets its agent, and the Atelier takes its public stage.» work: «Buyer-facing agent (Brand Concierge) on three live experiences» · «Atelier in the Agent Skills Catalog; scoping and configuration as MCP Apps» · «Template gallery and guided flow; 25 to 40 active users» · «Two to three Adobe partners co-build joint experiences» · «Simulation: facilitated beta and first real workshop» · «Hackathon day, February 2027 · Summit demo pod and speaking submission» targets EN «Ten or more experiences in active deals, measured · influenced pipeline reported per deal · at least two partner co-signed experiences · Summit demo pod confirmed».
   - M3 kicker «Milestone 3 · by end of June 2027» title «Enterprise and lighthouse» intro EN «The capability becomes infrastructure, with a first EMEA client to show for it.» work: «Enterprise-managed authorization via MCP, audit logs, security review» · «Brief to experience in under 24 hours; agent on every experience» · «Expansion across EMEA with live translation in the room» · «Lighthouse: the first partner co-built experience live for an EMEA client» · «Simulation: second industry pack» targets EN «One hundred or more enabled users · one lighthouse experience live with an EMEA client · 100% of shipped assets with provenance and C2PA · the project institutionalised with a team and a budget line».
- [ ] **Step 4: KPI** — `kpiCols`: «M1 · end Jan 2027», «M2 · 22–25 Mar 2027», «M3 · end Jun 2027». `slide-kpi` (label «KPI scorecard · families 1–2 of 4», title EN «Targets at every milestone: buying surface and speed»): famiglia **Buying surface** (owner sponsor + project lead): «Influenced pipeline, measured» [baseline / reported per deal / reported per deal] · «Experiences reopened by the client after the meeting» [tracked / 50% / 70%] · «Buyer questions answered by the agent» [— / on 3 experiences / on all]; famiglia **Speed** (project lead): «Brief to first experience» [< 1 week / < 2 days / < 24 hours] · «Experiences in active deals» [3 (pilot) / 10+ / 25+] · «How people create» [guided / self-service / self-service]. `slide-kpi-2` (title EN «Targets at every milestone: trust and people»): **Trust** (project lead): «Art. 50 incidents» [0/0/0] · «Shipped assets with provenance and C2PA» [50% / 100% / 100%] · «Access and audit» [telemetry, secrets out of repo / security review / enterprise-managed auth + audit logs]; **People & ecosystem** (sponsor + project lead): «Enabled Adobians» [5–10 / 25–40 / 100+] · «Partner co-signed experiences» [0 / 2 / 5] · «Lighthouse client experience» [— / scoped / live, EMEA].
- [ ] **Step 5: Cover** — h1 EN «Eight months, three milestones.» IT «Otto mesi, tre milestone.» FR «Huit mois, trois jalons.»; label «Plan as of September 2026 · decision by 31 October 2026». Admin labels: `slide-roadmap` «Roadmap — Gantt Nov 2026 → Jun 2027 (6 workstreams)», `slide-m1` «M1 Foundations (end Jan 2027)», `slide-kpi` «KPI 1/2 (buying surface, speed)», `slide-kpi-2` «KPI 2/2 (trust, people & ecosystem)».
- [ ] **Step 6: Build, audit `--only plan` (0 HARD; il Gantt a 1280×800 con 6 corsie: se `k`/`c` fallisce ridurre `padding` dei segmenti a `.34rem .6rem .34rem .9rem` e `margin` a `.22rem 2px`, MAI il tipo), screenshot EN+FR, commit** `feat(atelier): il piano a otto mesi — sei corsie, trust a M1, KPI misurati`.

### Task 13: Le richieste e la chiusura

**Files:**
- Modify: `apps/atelier/src/pages/asks.astro` (`decisions[]`, data), `apps/atelier/src/pages/closing.astro` (`recap[]`, `slide-next` body), `apps/atelier/src/pages/admin.astro` (label asks)

- [ ] **Step 1: Decisione** — `decisions[]`: (1) name EN «Yes to the pilot» body EN «Five to ten sellers, a guided intake, twelve weeks from November: M1 Foundations by end of January 2027. Envelope as sized in Annex A.» · (2) «A sponsor at leadership level» body invariato · (3) name EN «Customer zero with CX Enterprise» IT «Customer zero con CX Enterprise» FR «Client zéro avec CX Enterprise» body EN «Brand Concierge and Coworker on the experiences, and a place for the Atelier in the Agent Skills Catalog.» Riga finale «Decision requested by 31 October 2026.» (IT/FR). Description della pagina aggiornata. Admin label `slide-sponsor` «What we ask you to decide (by 31 Oct 2026)».
- [ ] **Step 2: Chiusura** — `recap[]` a 4 righe: «01 · The method» «Eight live experiences, each built the same way.» · «02 · The capability» «One engine, measured and callable, toggled live in front of you.» · «04 · The three moves» «Alive between meetings, delivered where sellers are, compliant by construction.» · «05 · The plan» «Eight months with a measured number at each milestone.» `.close-recap` gap a `1.1rem` se a 1280 non entra. `slide-next` body EN «Five to ten sellers, one guided intake, twelve weeks from November. By the end of January there are measured experiences in the field and a baseline to judge everything that follows.»
- [ ] **Step 3: Build, audit `--only asks,closing`, screenshot, commit** `feat(atelier): la terza richiesta è customer zero, e la chiusura riprende le mosse`.

### Task 14: Navigazione, flussi, gating e audit

**Files:**
- Modify: `apps/atelier/src/components/AtelierNavigation.astro` (`sections[]`), `apps/atelier/src/layouts/BaseLayout.astro` (`SECTION_FLOW`), `apps/atelier/src/pages/admin.astro` (PAGE_REGISTRY per `gap`/`moves`, `SOLUTIONS`: `simulation` al posto di `quest`, description di `detail`), `scripts/deck-audit.ts` (`ROUTE_SETS.atelier`), `apps/atelier/src/pages/closing.astro` (bottone «Copy full link» → `data-share="asks,simulation,detail"`)

- [ ] **Step 1: Nav** — `sections[]`: `gap` EN «The gap» IT «Il divario» FR «L'écart»; `moves` EN «The three moves» IT «Le tre mosse» FR «Les trois mouvements», al posto di `multiplication`/`frontiers`, stesso ordine.
- [ ] **Step 2: SECTION_FLOW** in BaseLayout: `method, capability, gap, moves, plan, asks(gate ['asks']), closing`.
- [ ] **Step 3: Admin** — PAGE_REGISTRY: `{ slug: 'gap', label: 'The gap (03)', slides: [cover, slide-buyers, slide-market, slide-adobe, slide-precedent] }`, `{ slug: 'moves', label: 'The three moves (04)', slides: [cover, slide-move-1, slide-move-2, slide-move-3, slide-simulation] }` con label parlanti; SOLUTIONS: sostituire `quest` con `{ id: 'simulation', name: 'The simulation (buying surface as a game)', shortName: 'Simulation', pillar: 'audience', description: 'The simulation slide in The three moves and its lane in the Gantt. Turn off for audiences that should see the moves without the game.', appearsIn: ['The three moves', 'The plan'] }`; `detail.appearsIn` aggiornato ai nomi nuovi; description di `detail`: «… Turn off for the ~16-slide sponsor cut.»
- [ ] **Step 4: Audit routes** — in `scripts/deck-audit.ts` `ROUTE_SETS.atelier`: sostituire le voci `multiplication` e `frontiers` con `{ name: 'gap', route: '/experience-design-factory/atelier/gap/' }` e `{ name: 'moves', route: '/experience-design-factory/atelier/moves/' }`.
- [ ] **Step 5: Link** — closing: `data-share="asks,simulation,detail"` per il link pieno; lo sponsor resta `asks`.
- [ ] **Step 6: Verifica gating** — build + preview; aprire `/atelier/?s=asks` e avanzare con → fino alla fine: nessuna slide `detail`/`simulation` compare, la nav mostra i capitoli nuovi, `/multiplication/` e `/frontiers/` rimandano. Conteggio slide del taglio sponsor annotato (atteso ≈16). Commit `feat(atelier): capitoli nuovi in nav, flusso, admin e audit; la simulazione è il gate`.

### Task 15: Propagazione «Experience Cloud» → CX Enterprise

**Files:**
- Modify: i 6 file trovati con `grep -rl "Experience Cloud" apps/*/src packages/core/src` (UniCredit ×4, Agos ×1, Console ×1)

- [ ] **Step 1: Elencare le occorrenze** — `grep -rn "Experience Cloud" apps/*/src packages/core/src`. Per ciascuna decidere: se è un nome di prodotto/suite corrente → «Adobe CX Enterprise» (o «CX Enterprise» se «Adobe» è già nella frase); se è una citazione storica o un titolo di documento datato (es. il nome di un deck Summit 2026 nei commenti) → lasciare e annotare.
- [ ] **Step 2: Sostituire** con `Edit` singoli (mai `sed` cieco: le stringhe `<T en it>` hanno due lingue), mantenendo ±10% di lunghezza.
- [ ] **Step 3: Build + audit delle app toccate** — `pnpm --filter unicredit-engagement build && pnpm --filter agos-trait-dunion build && pnpm --filter console build`; `audit:deck` UniCredit `--only home` e Agos `--only home` (0 HARD). Commit `fix: Experience Cloud è diventato CX Enterprise, propagato a UniCredit, Agos e Console`.

---

## Parte D — Verifica finale e consegna

### Task 16: Gate completi, screenshot, docs, memoria

**Files:**
- Modify: `docs/HANDOVER-06.md` (nuovo §21.8), `docs/HANDOVER-03.md` (change log in cima), `docs/HANDOVER-02.md` (chiudere la voce P1 «DECISIONE DELL'OWNER…», aggiornare «confermare le assunzioni»: date nuove), `docs/HANDOVER.md` e `docs/README.md` (data), memoria `~/.claude/projects/.../memory/experience-atelier-deck.md` + riga in `MEMORY.md`

- [ ] **Step 1: Gate** —
```bash
pnpm build && pnpm typecheck && pnpm lint && npx tsx scripts/content-audit.ts
pnpm --filter @agargiulo-adbe/experience-core test && pnpm test:scripts && pnpm --filter @agargiulo-adbe/mcp-atelier test
(pnpm --filter atelier preview --port 4399 &) ; sleep 3
DECK_URL=http://localhost:4399 pnpm --filter atelier audit:deck            # EN, 8 rotte
DECK_LANG=fr DECK_URL=http://localhost:4399 pnpm --filter atelier audit:deck   # FR, 8 rotte
DECK_LANG=it DECK_URL=http://localhost:4399 pnpm --filter atelier audit:deck --only gap,moves,plan
```
Expected: build/typecheck/lint/content-audit verdi; test verdi; audit: 8 rotte stampate per giro, **0 righe con `(b|c|d|e|g|h|j|k|m|exp):F`** (`grep -E '✗ [0-9]{2}' log | grep -E '(b|c|d|e|g|h|j|k|m|exp):F' | wc -l` → 0). I soft `a`/`i` vanno contati e riportati.
- [ ] **Step 2: Screenshot letti** — script Playwright (viewport 1920×1080, `addInitScript` che imposta `edf:lang`, `?telemetry=mock` sulla home di capability) che cattura **tutte le 36 slide** in EN e le 14 nuove/riscritte in FR e IT; comporre contact sheet 2×2 con sharp e **leggerle**: tipo ≥0.95rem, nessun overflow, mock UI leggibili, nessuna slide «vuota in alto».
- [ ] **Step 3: Prove end-to-end** — telemetria: dopo il giro di audit la RPC `atelier_slide_stats` mostra le rotte nuove (`gap`, `moves`); MCP: `claude -p "Use the atelier MCP server to open The gap in French"` → URL `.../atelier/gap/?lang=fr`... (nota: `open_experience` apre la home; per una sezione basta appendere lo slug: documentarlo nel README come limite v0).
- [ ] **Step 4: Docs** — `HANDOVER-06.md` §21.8 «Redesign sulle tre mosse (data)»: struttura nuova (slug, slide id, gating), le due prove (tabella, RPC, pacchetto, comandi), calendario, KPI, propagazione, esito gate con i numeri veri, residui soft, cosa resta fuori (spec §7). `HANDOVER-03.md`: voce in cima con i commit. `HANDOVER-02.md`: chiudere/riscrivere le due voci Atelier. Rispettare il contratto ≤48 KB/≤1500 righe/≤1800 caratteri-riga per file (`wc -lc`, `awk 'length>1800'`); se `HANDOVER-06.md` supera 48 KB, spostare §21 intero in un nuovo `HANDOVER-09.md` e aggiornare il manifest `HANDOVER.md` + `README.md`.
- [ ] **Step 5: Memoria** — aggiornare `experience-atelier-deck.md` (struttura, prove, calendario, gate) e la riga in `MEMORY.md`.
- [ ] **Step 6: Commit finale, push, deploy verificato** — `git commit -m "docs(atelier): handover e memoria dopo il redesign sulle tre mosse"`, push; `gh run watch` su Deploy e CI; `curl -I` su `/atelier/`, `/atelier/gap/`, `/atelier/moves/`, `/atelier/multiplication/` (200, e quest'ultima rimanda); `grep` di «Every opportunity deserves» nell'HTML live.

## Self-review (fatto scrivendo il piano)
- **Copertura della spec**: §Decisioni 1 → Task 11 (simulazione) + Task 12 (corsia) + Task 14 (gate `simulation`); 2 → Task 12/13; 3 → Task 1–3 (telemetria), 4–7 (MCP), 8 (slide). §1 struttura → Task 8–14. §2 → Task 1–3. §3 → Task 4–7. §4 copy/fatti → vincoli globali + Task 15. §5 asset → Task 10 Step 1. §6 verifica → Task 16. §7 fuori scope: nessun task li tocca.
- **Segnaposto**: gli unici `<…>` sono nella trascrizione MCP (Task 7 Step 3), per costruzione riempiti da un'esecuzione reale, e l'`N days` delle etichette «v0», da sostituire col numero vero.
- **Coerenza dei nomi**: `deck_events`/`deck_slide_stats`/`atelier_slide_stats` (Task 1, 3, 8, 16); `trackingMode`/`buildEvent`/`makeSessionId` (Task 2, 3); `readBrandTokens`/`analyzeCss`/`stylesheetUrls` (Task 4, 6); `listExperiences`/`openExperience`/`brandTokens` (Task 6); `MCP_TRANSCRIPT`/`MCP_TRANSCRIPT_DATE` (Task 7, 8); solution id `simulation` (Task 11, 12, 14); slug `gap`/`moves` (Task 10, 11, 14, 16).
