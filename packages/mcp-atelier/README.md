# `@agargiulo-adbe/mcp-atelier`

Server MCP (stdio) «atelier»: il motore della Experience Design Factory, chiamabile
da Claude, Copilot o qualsiasi client MCP. Espone tre tool sopra il registro delle
experience (`src/registry.json`, generato da `pnpm mcp:registry`) e sopra il lettore
di design system pubblico (`scripts/lib/brand-tokens.ts`, Task 4).

## Tool

### `list_experiences`

Elenca le Experience Design live della Factory: slug, nome, cliente, URL, numero
di capitoli, tag (EN).

```json
{}
```

→

```json
[
  { "slug": "atelier", "name": "Experience Atelier", "client": "Adobe Italy",
    "url": "https://agargiulo-adbe.github.io/experience-design-factory/atelier/",
    "sections": 7, "tag": "Trilingual EN/IT/FR · the Factory's own growth plan" }
]
```

### `open_experience`

Costruisce l'URL per aprire una experience, opzionalmente nel taglio sponsor
(`cut: "sponsor"`, solo per `atelier` → `?s=asks`) e in una lingua (`lang: "en"|"it"|"fr"`).

```json
{ "slug": "ferrari-racing", "lang": "it" }
```

→

```json
{ "url": "https://agargiulo-adbe.github.io/experience-design-factory/ferrari-racing/?lang=it",
  "name": "Pole Position" }
```

Slug sconosciuto o taglio sponsor fuori da `atelier` → `{ "error": "...", "known": [...] }`.

**Limite v0.** Il tool apre sempre la **home** della experience: non conosce i capitoli
e non accetta una sezione. Per aprire un capitolo si appende il suo slug all'URL
restituito — `.../atelier/` + `gap/` → `https://…/atelier/gap/?lang=fr`. Gli slug dei
capitoli sono quelli del `PAGE_REGISTRY` di ogni app; esporli come argomento del tool
è un'evoluzione, non un difetto di questa versione.

### `brand_tokens`

Legge il design system pubblico di un sito dal suo CSS di produzione: colori per
frequenza, custom property, caratteri. Evidenza, non decisioni — vedi
`pnpm brand:tokens` in radice.

```json
{ "url": "https://www.agos.it", "top": 5 }
```

→ un oggetto `BrandTokens` (`hostname`, `sheets`, `cssKb`, `brand`, `framework`,
`neutrals`, `customProperties`, `fonts`).

## Installazione

```bash
pnpm --filter @agargiulo-adbe/mcp-atelier build
claude mcp add atelier -- node "$PWD/packages/mcp-atelier/dist/packages/mcp-atelier/src/index.js"
```

Il registro (`src/registry.json`, copiato in `dist` dallo script `build`) va
rigenerato con `pnpm mcp:registry` (radice del monorepo) quando cambia l'elenco
delle experience, poi ribuildato.
