// The six chapters of the workshop cut, in flow order (mirrors SECTION_FLOW and the nav).
export interface Chapter { n: string; slug: string; label: { en: string; it: string } }
export const CHAPTERS: Chapter[] = [
  { n: '00', slug: 'scenario', label: { en: 'Scenario', it: 'Scenario' } },
  { n: '01', slug: 'visibilita', label: { en: 'The Site', it: 'Il Sito' } },
  { n: '02', slug: 'contenuti', label: { en: 'Content', it: 'Contenuti' } },
  { n: '03', slug: 'analizza', label: { en: 'Analyze', it: 'Analizza' } },
  { n: '04', slug: 'coworker', label: { en: 'Coworker', it: 'Coworker' } },
  { n: '05', slug: 'risultati', label: { en: 'Results', it: 'Risultati' } },
];
