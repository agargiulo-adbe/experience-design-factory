/** Trascrizione REALE di una sessione Claude Code con il server MCP «atelier»,
 *  catturata il 2026-09-14. Non inventare righe: si ricattura, non si ritocca. */
export interface TranscriptLine { role: 'user' | 'tool' | 'assistant'; tool?: string; text: string }
export const MCP_TRANSCRIPT_DATE = '2026-09-14';
export const MCP_TRANSCRIPT: TranscriptLine[] = [
  { role: 'user', text: 'List the experiences, then give me Pole Position in Italian, then read the brand tokens of agos.it.' },
  { role: 'tool', tool: 'list_experiences', text: '[\n  {"slug":"generazioni-maxmara","name":"Generazioni","client":"Max Mara","url":"https://agargiulo-adbe.github.io/experience-design-factory/generazioni-maxmara/","sections":7,"tag":"Quiet-luxury · IT · the first instance"},\n  {"slug":"unicredit-engagement","name":"Engagement Unlimited","client":"UniCredit","url":"https://agargiulo-adbe.github.io/experience-design-factory/unicredit-engagement/","sections":6,"tag":"Bilingual EN/IT · six chapters · the most mature"},\n  {"slug":"ferrari-racing","name":"Pole Position","client":"Ferrari Racing","url":"https://agargiulo-adbe.github.io/experience-design-factory/ferrari-racing/","sections":9,"tag":"Bilingual EN/IT · motorsport · live product mockups"},\n  … 7 more\n]' },
  { role: 'tool', tool: 'open_experience', text: '{ "url": "https://agargiulo-adbe.github.io/experience-design-factory/ferrari-racing/?lang=it", "name": "Pole Position" }' },
  { role: 'tool', tool: 'brand_tokens', text: '{\n  "hostname":"www.agos.it","sheets":2,"cssKb":119,\n  "brand":[{"value":"#05636b","count":31},{"value":"#a6dde1","count":15},{"value":"#008590","count":10},{"value":"#06abb8","count":9},{"value":"#024c44","count":6}],' },
  { role: 'assistant', text: 'The Agos result matches the palette already recorded in the project guide: petrolio and acqua dominate, with Montserrat as the declared face.' },
];
