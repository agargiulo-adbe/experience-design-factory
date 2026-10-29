/**
 * «Cinque domande» — la FONTE UNICA della copia dei capitoli.
 *
 * Perché sta qui e non nelle pagine: cinque capitoli che tengono cinque copie a
 * mano divergono, e divergono sempre nel posto che si corregge meno. Le pagine
 * in src/pages/domanda-*.astro sono renderer sottili: leggono da qui.
 *
 * LE CINQUE DOMANDE SONO LORO, ALLA LETTERA.
 * Non sono il nostro catalogo di skill. Vengono da:
 *  · Digital Intelligence — chi possiede Adobe Target — mail del 15 ott 2026 (domande 1 e 2);
 *  · Insight & Analytics — chi presidia CJA e gli alert — mail del 16 ott e call
 *    del 28 ott (domande 4 e 5);
 *  · i due team insieme, kick-off del 28 ott (domanda 3).
 * IL REPO È PUBBLICO: qui, e in slide, vanno i RUOLI — mai i nomi dei referenti
 * (memoria `client-names-public-repo`). I nomi stanno in `docs/Unipol/ACCOUNT.md`,
 * che è git-ignorato. Vale anche per la voce del deck: un capitolo intestato a una
 * persona diventa suo e muore con lei (`deck-voice-institutional`).
 *
 * I TRE LIVELLI DI FONTE — la regola che protegge questo documento.
 * Ogni affermazione porta un livello, e il livello si vede:
 *   `doc`   documentato da Adobe, con link a Experience League e data di
 *           ultimo aggiornamento. Si può citare, si può verificare.
 *   `la`    disponibilità limitata, non ancora GA, o roadmap. Si dice che cos'è
 *           e non si usa come base di pianificazione.
 *   `campo` esperienza di altri clienti, anonima. Non è un impegno di Adobe.
 * Mescolare roadmap e GA nello stesso registro visivo è il modo più rapido di
 * perdere la fiducia di chi legge, e qui il lettore è già scettico.
 */

export type Livello = 'doc' | 'la' | 'campo';

export interface Voce {
  figura: string;
  ancora: { it: string; en: string };
  riga: { it: string; en: string };
  livello: Livello;
}

export interface Fonte {
  label: { it: string; en: string };
  url?: string;
  /** Data di ultimo aggiornamento della pagina, letta sulla pagina stessa. */
  aggiornata?: string;
}

export interface Domanda {
  slug: string;
  /** Il numero della DOMANDA (1-5), non quello del capitolo: in sala «la domanda
      uno» dev'essere la prima domanda, non la seconda pagina. */
  num: string;
  /** La domanda come l'hanno fatta loro. */
  domanda: { it: string; en: string };
  /** Chi l'ha fatta, e quando. */
  chi: { it: string; en: string };
  /** Il titolo della slide È il punto, non l'etichetta del capitolo. */
  punto: { it: string; en: string };
  /** Il titolo della terza slide: non può ripetere `punto`, o la stessa frase
      compare due volte di fila e la slide sembra un refuso. */
  punto2: { it: string; en: string };
  lead: { it: string; en: string };
  oggi: { it: string; en: string };
  con: { it: string; en: string };
  ancore: Array<{ it: string; en: string }>;
  voci: Voce[];
  /** La nota del drill-down: la provenienza della lettura, e il dubbio aperto. */
  nota: { it: string; en: string };
  fonti: Fonte[];
}

const EL_TARGET =
  'https://experienceleague.adobe.com/en/docs/target/using/introduction/coworker-skills';
const EL_WORKFLOWS =
  'https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows';
const EL_ALERTS =
  'https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/alerts/customer-alerts';
const EL_WS_LIMITI =
  'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/coworker';
const EL_SKILL =
  'https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/create-your-first-skill';
const EL_GATE =
  'https://experienceleague.adobe.com/en/docs/coworker/content/customizations/skills/run-a-quality-gate-skill';
const EL_NOTIFICHE =
  'https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/notifications/notification-skills';

export const DOMANDE: Domanda[] = [
  {
    slug: 'domanda-1',
    num: '01',
    domanda: {
      it: '«Quando possiamo chiudere un test?»',
      en: '“When can we close a test?”',
    },
    chi: {
      it: 'Digital Intelligence, 15 ottobre: è il punto su cui riceviamo più richieste.',
      en: 'Digital Intelligence, 15 October: this is the point we receive the most requests about.',
    },
    punto: {
      it: 'Dimensionamento e verdetto li calcola la skill',
      en: 'The skill does the sizing and the verdict',
    },
    punto2: {
      it: 'Due skill, e una revisione che resta vostra',
      en: 'Two skills, and a review that stays yours',
    },
    lead: {
      it: 'Due skill documentate fanno il verdetto e il dimensionamento.',
      en: 'Two documented skills deliver the verdict and the sizing.',
    },
    oggi: {
      it: 'La domanda arriva a voi e la risposta si costruisce a mano, una volta per test.',
      en: 'The question lands on you and the answer is rebuilt by hand, once per test.',
    },
    con: {
      it: 'Si chiede in italiano, e torna il numero con il motivo accanto.',
      en: 'You ask in plain language, and the figure comes back with its reason.',
    },
    ancore: [
      { it: 'Significatività su conteggi grezzi', en: 'Significance on raw counts' },
      { it: 'Campione e durata, calcolati', en: 'Sample and duration, calculated' },
      { it: 'Mai prima del campione', en: 'Never before the sample' },
    ],
    voci: [
      {
        figura: 'soglia',
        ancora: { it: 'Target Activity Verdict', en: 'Target Activity Verdict' },
        riga: {
          it: 'Quattro esiti: pronta, attendere, fermare, correggere. Li calcola la significatività a due proporzioni sui conteggi grezzi.',
          en: 'Four verdicts: ship, wait, stop, fix. They come from two-proportion significance on raw counts.',
        },
        livello: 'doc',
      },
      {
        figura: 'prima-dopo',
        ancora: { it: 'Target Test Calculator', en: 'Target Test Calculator' },
        riga: {
          it: 'Campione, durata e lift rilevabile, con correzione di Bonferroni. Dipendono dal vostro tasso di partenza, che non abbiamo visto.',
          en: 'Sample size, duration and detectable lift, with Bonferroni correction. They depend on your baseline rate, which we have not seen.',
        },
        livello: 'doc',
      },
      {
        figura: 'una-esce',
        ancora: { it: 'La revisione resta vostra', en: 'The review stays yours' },
        riga: {
          it: 'La pagina chiede di rivedere analisi e configurazione prima di agire. Il calcolo non decide.',
          en: 'The page asks you to review the analysis and configuration before acting. The maths does not decide.',
        },
        livello: 'doc',
      },
    ],
    nota: {
      it: 'A quale soglia il verdetto dica «pronta» non è pubblicato: è nel registro. La regola resta vostra: non si chiude prima del campione.',
      en: 'The threshold at which the verdict says «ship» is not published: it is in the log. The rule stays yours: do not close before the sample.',
    },
    fonti: [
      {
        label: { it: 'Coworker skills for Adobe Target', en: 'Coworker skills for Adobe Target' },
        url: EL_TARGET,
        aggiornata: '27.10.2026',
      },
      {
        label: { it: 'Coworker Chat workflows', en: 'Coworker Chat workflows' },
        url: EL_WORKFLOWS,
        aggiornata: '29.10.2026',
      },
    ],
  },

  {
    slug: 'domanda-2',
    num: '02',
    domanda: {
      it: '«Come colleghiamo i test che abbiamo già fatto?»',
      en: '“How do we connect the tests we have already run?”',
    },
    chi: {
      it: 'Digital Intelligence, 15 ottobre: oggi la memoria storica siamo noi.',
      en: 'Digital Intelligence, 15 October: today the historical memory is us.',
    },
    punto: {
      it: 'La memoria dei test può smettere di essere voi',
      en: 'The memory of past tests can stop being you',
    },
    punto2: {
      it: 'Quattro strumenti, e non si ricomincia da capo',
      en: 'Four tools, and you do not start over',
    },
    lead: {
      it: 'Lo storico si legge, e da lì esce l’ipotesi successiva.',
      en: 'The history gets read, and the next hypothesis comes out of it.',
    },
    oggi: {
      it: 'I committenti cambiano, i test restano nelle vostre teste e in un foglio.',
      en: 'The requesters change, the tests stay in your heads and in a spreadsheet.',
    },
    con: {
      it: 'Si chiede che cosa testare dopo, e la risposta cita i test da cui viene.',
      en: 'You ask what to test next, and the answer cites the tests it came from.',
    },
    ancore: [
      { it: 'Che cosa ha funzionato', en: 'What has worked' },
      { it: 'Il test successivo', en: 'The next test' },
      { it: 'Il programma visto intero', en: 'The whole programme at once' },
    ],
    voci: [
      {
        figura: 'catena',
        ancora: { it: 'Target Strategist', en: 'Target Strategist' },
        riga: {
          it: 'Trova i pattern dei test migliori e raccomanda il prossimo.',
          en: 'Finds the patterns among past winners and recommends the next one.',
        },
        livello: 'doc',
      },
      {
        figura: 'tetto',
        ancora: { it: 'Target Portfolio Report', en: 'Target Portfolio Report' },
        riga: {
          it: 'Rollup di programma in sola lettura: migliori, peggiori, chi ha perso slancio.',
          en: 'Read-only programme rollups: best, worst, which activities lost momentum.',
        },
        livello: 'doc',
      },
      {
        figura: 'catena',
        ancora: { it: 'Experiment Knowledge Base', en: 'Experiment Knowledge Base' },
        riga: {
          it: 'Ingerisce un vostro CSV e restituisce ipotesi, esiti e apprendimenti dei test passati.',
          en: 'Ingests a CSV of yours and returns hypotheses, outcomes and learnings from past tests.',
        },
        livello: 'doc',
      },
      {
        figura: 'una-esce',
        ancora: { it: 'Target Intelligence', en: 'Target Intelligence' },
        riga: {
          it: 'Collisioni fra attività, configurazioni a rischio e igiene del programma.',
          en: 'Collisions between activities, configuration risks and programme hygiene.',
        },
        livello: 'doc',
      },
    ],
    nota: {
      it: 'Il foglio che avete lo si dà in pasto alla Knowledge Base: è la riga «Ingest this CSV» della pagina workflows. Il vostro storico non l’abbiamo visto.',
      en: 'The spreadsheet you have goes into the Knowledge Base: it is the «Ingest this CSV» line on the workflows page. We have not seen your history.',
    },
    fonti: [
      {
        label: { it: 'Coworker skills for Adobe Target', en: 'Coworker skills for Adobe Target' },
        url: EL_TARGET,
        aggiornata: '27.10.2026',
      },
      {
        label: { it: 'Coworker Chat workflows', en: 'Coworker Chat workflows' },
        url: EL_WORKFLOWS,
        aggiornata: '29.10.2026',
      },
    ],
  },

  {
    slug: 'domanda-3',
    num: '03',
    domanda: {
      it: '«Dove è già forte, e dove no?»',
      en: '“Where is it already strong, and where is it not?”',
    },
    chi: {
      it: 'I due team, kick-off del 28 ottobre: serve una bussola, non un giro turistico.',
      en: 'Both teams, kick-off of 28 October: we need a compass, not a guided tour.',
    },
    punto: {
      it: 'Il confine lo dichiariamo noi, prima che lo chiediate',
      en: 'We declare the boundary ourselves, before you ask',
    },
    punto2: {
      it: 'Il catalogo per nome, e due limiti',
      en: 'The catalogue by name, and two limits',
    },
    lead: {
      it: 'Dodici skill nel plugin, più la famiglia Optimization, e due limiti.',
      en: 'Twelve skills in the plugin, plus the Optimization family, and two limits.',
    },
    oggi: {
      it: 'Senza mappa si prova a caso, e la prima cosa che non funziona diventa il giudizio.',
      en: 'With no map you try at random, and the first failure becomes the verdict.',
    },
    con: {
      it: 'Ogni skill è documentata con i suoi prompt, e i limiti stanno nella stessa tabella.',
      en: 'Every skill is documented with its prompts, and the limits sit in the same table.',
    },
    ancore: [
      { it: 'Un catalogo, non una demo', en: 'A catalogue, not a demo' },
      { it: 'Automated Personalization non si crea', en: 'Automated Personalization is not created' },
      { it: 'Il Content Fragment AEM, da confermare', en: 'The AEM Content Fragment, to confirm' },
    ],
    voci: [
      {
        figura: 'tetto',
        ancora: { it: 'Il catalogo del plugin Target', en: 'The Target plugin catalogue' },
        riga: {
          it: 'Dodici nel plugin, più la famiglia Optimization: explorer, analysis, strategist, knowledge base.',
          en: 'Twelve in the plugin, plus the Optimization family: explorer, analysis, strategist, knowledge base.',
        },
        livello: 'doc',
      },
      {
        figura: 'una-esce',
        ancora: { it: 'Automated Personalization', en: 'Automated Personalization' },
        riga: {
          it: 'La creazione di attività di questo tipo non è supportata, né da Coworker né dall’MCP di Target.',
          en: 'Creating activities of this kind is not supported, by Coworker or by the Target MCP.',
        },
        livello: 'doc',
      },
      {
        figura: 'dentro-fuori',
        ancora: { it: 'Il Content Fragment AEM', en: 'The AEM Content Fragment' },
        riga: {
          it: 'In un’attività Target si usa da Coworker, non dall’MCP. Se usate AEM Cloud Service, la riga è questa: da confermare col vostro IT.',
          en: 'In a Target activity it works from Coworker, not the MCP. If you run AEM Cloud Service this is the line: to confirm with your IT.',
        },
        livello: 'doc',
      },
    ],
    nota: {
      it: 'Il catalogo e i limiti stanno nella stessa pagina documentata, con i prompt di esempio. Quello che non è scritto lì, non lo diamo per vero.',
      en: 'Catalogue and limits sit on the same documented page, with the example prompts. What is not written there, we do not take as true.',
    },
    fonti: [
      {
        label: { it: 'Coworker skills for Adobe Target', en: 'Coworker skills for Adobe Target' },
        url: EL_TARGET,
        aggiornata: '27.10.2026',
      },
      {
        label: { it: 'Coworker Chat workflows', en: 'Coworker Chat workflows' },
        url: EL_WORKFLOWS,
        aggiornata: '29.10.2026',
      },
    ],
  },

  {
    slug: 'domanda-4',
    num: '04',
    domanda: {
      it: '«Gli alert, e il muro di tabelle»',
      en: '“The alerts, and the wall of tables”',
    },
    chi: {
      it: 'Insight & Analytics, 28 ottobre: gli abbiamo chiesto di leggere i nostri alert, e ha detto che non può.',
      en: 'Insight & Analytics, 28 October: we asked it to read our alerts, and it said it could not.',
    },
    punto: {
      it: 'Il digest è documentato. Resta da vedere se i vostri ci entrano',
      en: 'The digest exists and is documented. What is left is whether yours fit in',
    },
    punto2: {
      it: 'Tre skill, e un perimetro da verificare',
      en: 'Three skills, and a scope to verify',
    },
    lead: {
      it: 'Digest giornaliero o settimanale, su quello che arriva nel pannello delle notifiche.',
      en: 'A daily or weekly digest, over what lands in the notifications panel.',
    },
    oggi: {
      it: 'L’alert arriva come mail, si incolla in chat e si chiede che cosa è successo.',
      en: 'The alert arrives as an email, gets pasted into chat, and you ask what happened.',
    },
    con: {
      it: 'Sugli alert di piattaforma arriva un briefing con accanto che cosa è stato toccato.',
      en: 'On platform alerts you get a briefing with what was affected beside it.',
    },
    ancore: [
      { it: 'Il digest, giornaliero o settimanale', en: 'The digest, daily or weekly' },
      { it: 'Perché è caduta, non solo che è caduta', en: 'Why it dropped, not just that it dropped' },
      { it: 'Dalla tabella alla slide', en: 'From the table to the slide' },
    ],
    voci: [
      {
        figura: 'imbuto',
        ancora: { it: 'Notification Skills', en: 'Notification Skills' },
        riga: {
          it: 'Digest giornaliero o settimanale, per tutti i clienti Coworker e senza configurazione.',
          en: 'A daily or weekly digest, for every Coworker customer and with no setup.',
        },
        livello: 'doc',
      },
      {
        figura: 'imbuto',
        ancora: { it: 'Root cause analysis', en: 'Root cause analysis' },
        riga: {
          it: 'Perché una metrica è cambiata: cali, picchi e anomalie. Da verificare che cosa serve già attivo sulla data view.',
          en: 'Why a metric changed: drops, spikes and anomalies. To verify what must already be active on the data view.',
        },
        livello: 'doc',
      },
      {
        figura: 'tabella-a-grafico',
        ancora: { it: 'Sintesi e outline di slide', en: 'Summaries and slide outlines' },
        riga: {
          it: 'La famiglia executive summary produce sintesi e scalette di presentazione.',
          en: 'The executive summary family produces summaries and presentation outlines.',
        },
        livello: 'doc',
      },
    ],
    nota: {
      it: 'Le Customer Alert Skills lavorano sugli alert di Experience Platform; i vostri sono di CJA su pannello, e la copertura va provata.',
      en: 'Customer Alert Skills work on Experience Platform alerts; yours are CJA panel alerts, and the coverage has to be tried.',
    },
    fonti: [
      {
        label: { it: 'Notification Skills', en: 'Notification Skills' },
        url: EL_NOTIFICHE,
        aggiornata: '28.10.2026',
      },
      {
        label: { it: 'Customer Alert Skills', en: 'Customer Alert Skills' },
        url: EL_ALERTS,
        aggiornata: '28.10.2026',
      },
      {
        label: { it: 'Coworker Chat workflows', en: 'Coworker Chat workflows' },
        url: EL_WORKFLOWS,
        aggiornata: '29.10.2026',
      },
    ],
  },

  {
    slug: 'domanda-5',
    num: '05',
    domanda: {
      it: '«Cosa non sa di noi, e come glielo diciamo?»',
      en: '“What does it not know about us, and how do we tell it?”',
    },
    chi: {
      it: 'Insight & Analytics, 28 ottobre: basta un file buttato dentro, o serve altro?',
      en: 'Insight & Analytics, 28 October: is dropping in a file enough, or is there more?',
    },
    punto: {
      it: 'Oggi il dizionario non è collegato, e c’è scritto',
      en: 'Today the dictionary is not connected, and it is documented',
    },
    punto2: {
      it: 'Due limiti documentati, e una strada',
      en: 'Two documented limits, and one route',
    },
    lead: {
      it: 'Il contesto si mette dentro una skill, non dentro il dizionario.',
      en: 'Context goes inside a skill, not inside the dictionary.',
    },
    oggi: {
      it: 'Il contesto vive nelle teste e in Notion, e si ricopia in chat ogni volta.',
      en: 'Context lives in people’s heads and in Notion, and gets retyped into chat each time.',
    },
    con: {
      it: 'Un’analisi ricorrente diventa una skill pubblicata, con gli intervalli di date dinamici.',
      en: 'A recurring analysis becomes a published skill, with dynamic date ranges.',
    },
    ancore: [
      { it: 'Il Data Dictionary non è collegato', en: 'The Data Dictionary is not connected' },
      { it: 'I segmenti citati per nome', en: 'Segments referred to by name' },
      { it: 'La skill come contenitore', en: 'The skill as the container' },
    ],
    voci: [
      {
        figura: 'una-esce',
        ancora: { it: 'Il Data Dictionary', en: 'The Data Dictionary' },
        riga: {
          it: 'Oggi non vi è collegato. La stessa pagina dichiara il supporto per una release futura, senza data.',
          en: 'Today it is not connected. The same page states support is planned for a future release, with no date.',
        },
        livello: 'doc',
      },
      {
        figura: 'due-non-legati',
        ancora: { it: 'Un segmento citato per nome', en: 'A segment named, not defined' },
        riga: {
          it: 'Coworker ne deduce la definizione dal nome. La pagina dice di verificarla prima di fidarsi.',
          en: 'Coworker does not know the definition and infers it from the name. The page says to verify before relying on it.',
        },
        livello: 'doc',
      },
      {
        figura: 'conferma',
        ancora: { it: 'Il cancello prima dell’attivazione', en: 'The gate before activation' },
        riga: {
          it: 'Valida la conformità di un’audience prima dell’attivazione, in sola lettura: non attiva, non modifica, non copia nulla.',
          en: 'It validates an audience’s readiness before activation, read-only: it never activates, mutates or copies anything.',
        },
        livello: 'doc',
      },
    ],
    nota: {
      it: 'Il business context non è ancora per tutti e non ha una data pubblica. Fino ad allora il contesto sta in una skill.',
      en: 'Business context is not yet for everyone and has no public date. Until then context lives in a skill.',
    },
    fonti: [
      {
        label: {
          it: 'Coworker in Workspace, in test limitato: i limiti dichiarati',
          en: 'Coworker in Workspace, in limited testing: the stated limitations',
        },
        url: EL_WS_LIMITI,
        aggiornata: '29.10.2026',
      },
      {
        label: { it: 'Create your first Coworker skill', en: 'Create your first Coworker skill' },
        url: EL_SKILL,
        aggiornata: '28.10.2026',
      },
      {
        label: { it: 'Run a quality gate skill', en: 'Run a quality gate skill' },
        url: EL_GATE,
        aggiornata: '26.09.2026',
      },
    ],
  },
];

export function domanda(slug: string): Domanda {
  const d = DOMANDE.find((x) => x.slug === slug);
  if (!d) throw new Error(`Domanda non trovata: ${slug}`);
  return d;
}

/** Etichette dei tre livelli, rese accanto a ogni voce. */
export const LIVELLI: Record<Livello, { it: string; en: string }> = {
  doc: { it: 'Documentato', en: 'Documented' },
  la: { it: 'Non ancora per tutti', en: 'Not yet for everyone' },
  campo: { it: 'Dal campo', en: 'From the field' },
};
