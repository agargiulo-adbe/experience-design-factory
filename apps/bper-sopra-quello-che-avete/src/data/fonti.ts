/**
 * Le fonti, in un posto solo.
 *
 * REGOLA (CLAUDE.md → «Le fonti pubbliche portano il link, e il link
 * risponde»): ogni fonte pubblica citata in slide porta il SUO link, prodotti
 * Adobe compresi. Chi riceve il documento quasi sempre non era in sala, e quel
 * controllo lo fa davvero. Quello che è nostro e non è pubblico — una misura
 * fatta da noi, una call, un documento di lavoro — si cita SENZA link, dicendo
 * che cosa è.
 *
 * Il gate è `DECK_URL=<origin> pnpm audit:fonti --app bper-sopra-quello-che-avete`:
 * HARD sui link che non rispondono. Verifica che il link RISPONDA, non che sia
 * quello giusto per quella frase — quello resta un controllo umano, fatto una
 * volta per fonte quando la si cita.
 */
export interface Fonte { url: string; etichetta: string }

export const F = {
  /* ── Federated Audience Composition ─────────────────────────────────── */
  facOverview: {
    url: 'https://experienceleague.adobe.com/en/docs/federated-audience-composition/using/overview',
    etichetta: 'Federated Audience Composition, panoramica',
  },
  facPrerequisiti: {
    url: 'https://experienceleague.adobe.com/en/docs/federated-audience-composition/using/start/access-prerequisites',
    etichetta: 'prerequisiti e guardrail',
  },
  facFaq: {
    url: 'https://experienceleague.adobe.com/en/docs/federated-audience-composition/using/faq',
    etichetta: 'domande frequenti',
  },
  facConnessioni: {
    url: 'https://experienceleague.adobe.com/en/docs/federated-audience-composition/using/connections/integrated',
    etichetta: 'database supportati',
  },
  facPrivata: {
    url: 'https://experienceleague.adobe.com/en/docs/federated-audience-composition/using/connections/private-connection',
    etichetta: 'connessione privata',
  },

  /* ── I prodotti nominati ────────────────────────────────────────────── */
  ajo: {
    url: 'https://experienceleague.adobe.com/en/docs/journey-optimizer/using/ajo-home',
    etichetta: 'Adobe Journey Optimizer',
  },
  rtcdp: {
    url: 'https://experienceleague.adobe.com/en/docs/experience-platform/rtcdp/home',
    etichetta: 'Real-Time CDP',
  },
  segmentazione: {
    url: 'https://experienceleague.adobe.com/en/docs/experience-platform/segmentation/home',
    etichetta: 'servizio di segmentazione',
  },
  decisioning: {
    url: 'https://experienceleague.adobe.com/en/docs/journey-optimizer/using/decisioning/experience-decisioning/gs-experience-decisioning',
    etichetta: 'Decisioning',
  },
  cja: {
    url: 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-landing',
    etichetta: 'Customer Journey Analytics',
  },
  target: {
    url: 'https://experienceleague.adobe.com/en/docs/target/using/target-home',
    etichetta: 'Adobe Target',
  },
} as const satisfies Record<string, Fonte>;

/** Compone la riga di fonte: «etichetta · etichetta». Il link lo mette la
 *  pagina, perché il markup di un <a> dentro una stringa non si traduce. */
export function fonti(...k: Array<keyof typeof F>): Fonte[] {
  return k.map((x) => F[x]);
}
