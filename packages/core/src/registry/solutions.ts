export type SolutionPillar =
  | 'foundation'
  | 'data'
  | 'journeys'
  | 'content'
  | 'analytics'
  | 'personalization'
  | 'b2b';

export interface AdobeSolution {
  id: string;
  name: string;
  shortName: string;
  pillar: SolutionPillar;
  description: { it: string; en: string };
}

/** Map of solutionId → enabled. Serialised to localStorage / URL params. */
export type SolutionsConfig = Record<string, boolean>;
