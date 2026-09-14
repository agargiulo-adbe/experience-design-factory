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
