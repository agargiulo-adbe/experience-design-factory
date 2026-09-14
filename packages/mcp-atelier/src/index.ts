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
