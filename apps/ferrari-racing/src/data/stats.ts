// Single source of truth for Ferrari Racing headline figures.
// Every numeric claim used as a stat card value must come from here.
// Inline narrative references must interpolate STATS.x.value — never re-type literals.

export interface Stat {
  id: string;
  value: string;
  en: string;
  it: string;
  sourceIds: string[];
}

export const STATS: Record<string, Stat> = {
  tifosi: {
    id: 'tifosi',
    value: '~400M',
    en: 'Tifosi worldwide — the most-followed team in Formula 1',
    it: 'Tifosi nel mondo — la squadra più seguita della Formula 1',
    sourceIds: ['ibm_case_study'],
  },
  sponsorship: {
    id: 'sponsorship',
    value: '€800M+',
    en: 'FY2025 sponsorship, commercial & brand revenue',
    it: 'Ricavi FY2025 sponsorship, commercial & brand',
    sourceIds: ['ferrari_fy2025'],
  },
  growth: {
    id: 'growth',
    value: '+22%',
    en: 'year-over-year growth (FY2025)',
    it: 'crescita anno su anno (FY2025)',
    sourceIds: ['ferrari_fy2025'],
  },
  raceday: {
    id: 'raceday',
    value: '+56%',
    en: 'race-day active users since the May 2025 app relaunch',
    it: 'utenti attivi race-day dal rilancio app di maggio 2025',
    sourceIds: ['ibm_ferrari_2026'],
  },
  downloads: {
    id: 'downloads',
    value: '+35%',
    en: 'app downloads since relaunch',
    it: "download dell'app dal rilancio",
    sourceIds: ['ibm_ferrari_2026'],
  },
  mau: {
    id: 'mau',
    value: '+36%',
    en: 'average monthly active users',
    it: 'utenti attivi mensili medi',
    sourceIds: ['ibm_ferrari_2026'],
  },
};
