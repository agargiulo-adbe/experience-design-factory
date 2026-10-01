/**
 * experienceTypes.ts — la tassonomia dei deliverable della Factory (decisa il 1 ott 2026).
 *
 * Quattro tipi rivolti al cliente, nominati per la DOMANDA a cui rispondono, più un tipo
 * interno. Il tipo è ciò che il cliente legge in copertina accanto al titolo; «experience»
 * resta il nome del formato, non del contenuto. Niente «demo» nei nomi: il software dal
 * vivo è una proprietà di Storia e Playbook, non il loro nome.
 *
 * Ogni app dichiara il proprio tipo una volta (`const TYPE: ExperienceType = '…'`) e la
 * copertina lo rende da qui; showcase, hub, console e il router di intake leggono la stessa
 * mappa. Lo `skeleton` è la sequenza di capitoli osservata nelle experience esistenti di
 * quel tipo: è il punto di partenza del generatore (`pnpm new:experience`), non un vincolo.
 */

export type ExperienceType = 'prospettiva' | 'storia' | 'blueprint' | 'playbook' | 'interno';

export interface Bilingual { it: string; en: string }

export interface ExperienceTypeDef {
  id: ExperienceType;
  /** nome che il cliente legge in copertina */
  label: Bilingual;
  /** riga di copertina: «<label> preparata dal team Adobe Italia» (accordo di genere incluso) */
  coverLine: Bilingual;
  /** la domanda del cliente a cui il tipo risponde */
  question: Bilingual;
  /** chi è in sala e in quale momento del ciclo */
  audience: Bilingual;
  /** il passo successivo che il tipo chiede alla fine */
  nextStep: Bilingual;
  /** capitoli tipici, in ordine (slug, titolo) — base del generatore */
  skeleton: Array<{ slug: string; title: Bilingual }>;
}

export const EXPERIENCE_TYPES: Record<ExperienceType, ExperienceTypeDef> = {
  prospettiva: {
    id: 'prospettiva',
    label: { it: 'Prospettiva', en: 'Perspective' },
    coverLine: { it: 'Prospettiva preparata dal team Adobe Italia', en: 'A perspective prepared by the Adobe Italy team' },
    question: { it: 'Dove potremmo arrivare?', en: 'Where could we get to?' },
    audience: { it: 'C-level, prima della discovery', en: 'C-level, before discovery' },
    nextStep: { it: 'Un tavolo di lavoro sulle domande aperte', en: 'A working table on the open questions' },
    skeleton: [
      { slug: 'apertura', title: { it: 'Il vostro anno, visto da fuori', en: 'Your year, seen from outside' } },
      { slug: 'domanda', title: { it: 'La domanda', en: 'The question' } },
      { slug: 'idee', title: { it: 'Le idee', en: 'The ideas' } },
      { slug: 'rotta', title: { it: 'La rotta', en: 'The route' } },
    ],
  },
  storia: {
    id: 'storia',
    label: { it: 'Storia', en: 'Customer story' },
    coverLine: { it: 'Storia preparata dal team Adobe Italia', en: 'A customer story prepared by the Adobe Italy team' },
    question: { it: 'Come funzionerebbe per un nostro cliente?', en: 'How would it work for one of our customers?' },
    audience: { it: 'Business e marketing, spesso con il partner, dopo un workshop', en: 'Business and marketing, often with the partner, after a workshop' },
    nextStep: { it: 'Vederla sui vostri dati', en: 'See it on your data' },
    skeleton: [
      { slug: 'scenario', title: { it: 'Scenario', en: 'Scenario' } },
      { slug: 'persona', title: { it: 'La persona', en: 'The persona' } },
      { slug: 'momenti', title: { it: 'I momenti della storia', en: 'The moments of the story' } },
      { slug: 'motore', title: { it: 'Il motore dietro la storia', en: 'The engine behind the story' } },
      { slug: 'risultati', title: { it: 'Risultati', en: 'Results' } },
    ],
  },
  blueprint: {
    id: 'blueprint',
    label: { it: 'Blueprint', en: 'Blueprint' },
    coverLine: { it: 'Blueprint preparato dal team Adobe Italia', en: 'A blueprint prepared by the Adobe Italy team' },
    question: { it: 'Come si collega a quello che abbiamo?', en: 'How does it connect to what we already have?' },
    audience: { it: 'CDO, CIO e architettura, con il business owner, dopo la discovery', en: 'CDO, CIO and architecture, with the business owner, after discovery' },
    nextStep: { it: 'Perimetrare una fase', en: 'Scope a phase' },
    skeleton: [
      { slug: 'scenario', title: { it: 'Scenario', en: 'Scenario' } },
      { slug: 'fondamenta', title: { it: 'Le fondamenta', en: 'The foundations' } },
      { slug: 'use-case', title: { it: 'Gli use case', en: 'The use cases' } },
      { slug: 'convergenza', title: { it: 'La convergenza', en: 'The convergence' } },
      { slug: 'valore', title: { it: 'Il valore', en: 'The value' } },
      { slug: 'rotta', title: { it: 'La rotta', en: 'The route' } },
    ],
  },
  playbook: {
    id: 'playbook',
    label: { it: 'Playbook', en: 'Playbook' },
    coverLine: { it: 'Playbook preparato dal team Adobe Italia', en: 'A playbook prepared by the Adobe Italy team' },
    question: { it: 'Come lo uso da lunedì?', en: 'How do I use it from Monday?' },
    audience: { it: 'Chi possiede lo strumento, prima del go-live', en: 'The owner of the tool, before go-live' },
    nextStep: { it: 'Accenderlo', en: 'Switch it on' },
    skeleton: [
      { slug: 'partenza', title: { it: 'Il punto di partenza', en: 'The starting point' } },
      { slug: 'domanda-1', title: { it: 'Domanda 1', en: 'Question 1' } },
      { slug: 'domanda-2', title: { it: 'Domanda 2', en: 'Question 2' } },
      { slug: 'domanda-3', title: { it: 'Domanda 3', en: 'Question 3' } },
      { slug: 'casa', title: { it: 'Cosa ti porti a casa', en: 'What you take home' } },
    ],
  },
  interno: {
    id: 'interno',
    label: { it: 'Interno', en: 'Internal' },
    coverLine: { it: 'Documento interno Adobe', en: 'Adobe internal document' },
    question: { it: 'Cosa stiamo costruendo e perché?', en: 'What are we building and why?' },
    audience: { it: 'Team e leadership Adobe', en: 'Adobe team and leadership' },
    nextStep: { it: 'Una decisione interna', en: 'An internal decision' },
    skeleton: [],
  },
};

export const EXPERIENCE_TYPE_IDS = Object.keys(EXPERIENCE_TYPES) as ExperienceType[];

/** Etichetta breve per liste e badge (hub, showcase, console). */
export function typeLabel(id: ExperienceType | string | null | undefined, lang: 'it' | 'en' = 'it'): string {
  const def = EXPERIENCE_TYPES[(id ?? '') as ExperienceType];
  return def ? def.label[lang] : '';
}
