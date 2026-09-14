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
