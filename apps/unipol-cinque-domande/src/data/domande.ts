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
  num: string;
  /** La domanda come l'hanno fatta loro. */
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

export const DOMANDE: Domanda[] = [
  {
    slug: 'domanda-1',
    num: '02',
    domanda: {
      it: '«Quando possiamo chiudere un test?»',
      en: '“When can we close a test?”',
    },
    chi: {
      it: 'Digital Intelligence, 15 ottobre: è il punto su cui riceviamo più richieste.',
      en: 'Digital Intelligence, 15 October: this is the point we receive the most requests about.',
    },
    punto: {
      it: 'Il calcolo non è più una vostra opinione',
      en: 'The calculation stops being your opinion',
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
      it: 'La domanda arriva a voi e la risposta si costruisce a mano, una volta per test.',
      en: 'The question lands on you and the answer is rebuilt by hand, once per test.',
    },
    con: {
      it: 'Si chiede in italiano, e torna il numero con il motivo accanto.',
      en: 'You ask in plain language, and the figure comes back with its reason.',
    },
    ancore: [
      { it: 'Spedire, aspettare o fermare', en: 'Ship, wait or stop' },
      { it: 'Quanto traffico serve', en: 'How much traffic is needed' },
      { it: 'La configurazione ha un errore', en: 'The configuration has a flaw' },
    ],
    voci: [
      {
        figura: 'soglia',
        ancora: { it: 'Target Activity Verdict', en: 'Target Activity Verdict' },
        riga: {
          it: 'Quattro esiti possibili: pronta, in attesa di dati, da fermare, da correggere.',
          en: 'Four possible verdicts: ready to ship, waiting for data, to be stopped, to be fixed.',
        },
        livello: 'doc',
      },
      {
        figura: 'prima-dopo',
        ancora: { it: 'Target Test Calculator', en: 'Target Test Calculator' },
        riga: {
          it: 'Campione, durata e lift rilevabile, con correzione di Bonferroni sui confronti multipli.',
          en: 'Sample size, duration and detectable lift, with Bonferroni correction for multiple comparisons.',
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
      it: 'Lettura delle skill documentate di Adobe Target, pagina aggiornata il 27 ottobre 2026. Da correggere dove non corrisponde al vostro caso.',
      en: 'Read from the documented Adobe Target skills, page updated 27 October 2026. To be corrected wherever it does not match your case.',
    },
    fonti: [
      {
        label: { it: 'Coworker skills for Adobe Target', en: 'Coworker skills for Adobe Target' },
        url: EL_TARGET,
        aggiornata: '27.10.2026',
      },
    ],
  },

  {
    slug: 'domanda-2',
    num: '03',
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
      it: 'Tre strumenti per non ricominciare da capo',
      en: 'Three tools so you do not start over',
    },
    lead: {
      it: 'Lo storico si legge, e da lì esce l’ipotesi successiva.',
      en: 'The history gets read, and the next hypothesis comes out of it.',
    },
    oggi: {
      it: 'I committenti cambiano, i test restano nelle vostre teste e in un foglio.',
      en: 'The requesters change, the tests stay in your heads and in a spreadsheet.',
    },
    con: {
      it: 'Si chiede che cosa testare dopo, e la risposta cita i test da cui viene.',
      en: 'You ask what to test next, and the answer cites the tests it came from.',
    },
    ancore: [
      { it: 'Che cosa ha funzionato', en: 'What has worked' },
      { it: 'Il test successivo', en: 'The next test' },
      { it: 'La vista di tutto il programma', en: 'The whole programme at once' },
    ],
    voci: [
      {
        figura: 'catena',
        ancora: { it: 'Target Strategist', en: 'Target Strategist' },
        riga: {
          it: 'Analizza i dati storici, trova i pattern dei test migliori e raccomanda il prossimo.',
          en: 'Analyses historical data, finds the patterns among past winners and recommends the next one.',
        },
        livello: 'doc',
      },
      {
        figura: 'tetto',
        ancora: { it: 'Target Portfolio Report', en: 'Target Portfolio Report' },
        riga: {
          it: 'Rollup di programma in sola lettura: migliori e peggiori, tendenze, chi ha perso slancio.',
          en: 'Read-only programme rollups: best and worst, trends, which activities lost momentum.',
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
      it: 'Le tre skill stanno nella stessa pagina documentata, con i prompt di esempio. Il vostro storico non l’abbiamo visto: la resa dipende da quanto è leggibile.',
      en: 'The three skills sit in the same documented page, with example prompts. We have not seen your history: the result depends on how readable it is.',
    },
    fonti: [
      {
        label: { it: 'Coworker skills for Adobe Target', en: 'Coworker skills for Adobe Target' },
        url: EL_TARGET,
        aggiornata: '27.10.2026',
      },
    ],
  },

  {
    slug: 'domanda-3',
    num: '04',
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
      it: 'Undici skill, e i limiti scritti accanto',
      en: 'Eleven skills, with the limits written beside them',
    },
    lead: {
      it: 'Undici skill su Target, e tre cose che non fa.',
      en: 'Eleven skills on Target, and three things it will not do.',
    },
    oggi: {
      it: 'Senza mappa si prova a caso, e la prima cosa che non funziona diventa il giudizio.',
      en: 'With no map you try at random, and the first failure becomes the verdict.',
    },
    con: {
      it: 'Ogni skill è documentata con i suoi prompt, e i limiti stanno nella stessa tabella.',
      en: 'Every skill is documented with its prompts, and the limits sit in the same table.',
    },
    ancore: [
      { it: 'Undici skill, non una demo', en: 'Eleven skills, not a demo' },
      { it: 'Automated Personalization: no', en: 'Automated Personalization: no' },
      { it: 'Il Content Fragment AEM: sì', en: 'The AEM Content Fragment: yes' },
    ],
    voci: [
      {
        figura: 'tetto',
        ancora: { it: 'Il catalogo per intero', en: 'The whole catalogue' },
        riga: {
          it: 'Browse, Verdict, Design, VEC, Setup, Intelligence, Strategist, Calculator, Portfolio, Audience, Recommendations.',
          en: 'Browse, Verdict, Design, VEC, Setup, Intelligence, Strategist, Calculator, Portfolio, Audience, Recommendations.',
        },
        livello: 'doc',
      },
      {
        figura: 'una-esce',
        ancora: { it: 'Quello che non fa', en: 'What it will not do' },
        riga: {
          it: 'Non si crea, né da Coworker né dall’MCP. È scritto nella tabella di confronto.',
          en: 'Cannot be created, by Coworker or by the Target MCP. It is in the comparison table.',
        },
        livello: 'doc',
      },
      {
        figura: 'dentro-fuori',
        ancora: { it: 'Il Content Fragment AEM', en: 'The AEM Content Fragment' },
        riga: {
          it: 'In un’attività Target si usa da Coworker, non dall’MCP. È la riga del vostro AEM Cloud Service.',
          en: 'In a Target activity it works from Coworker, not the MCP. This is the line about your AEM Cloud Service.',
        },
        livello: 'doc',
      },
    ],
    nota: {
      it: 'Dato di adozione interno, non un impegno: chi prova più di un tipo di attività nella prima settimana torna con frequenza più alta.',
      en: 'Internal adoption figure, not a commitment: people who try more than one kind of task in week one come back at a higher rate.',
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
        aggiornata: '28.10.2026',
      },
    ],
  },

  {
    slug: 'domanda-4',
    num: '05',
    domanda: {
      it: '«Gli alert, e il muro di tabelle»',
      en: '“The alerts, and the wall of tables”',
    },
    chi: {
      it: 'Insight & Analytics, 28 ottobre: gli abbiamo chiesto di leggere i nostri alert, e ha detto che non può.',
      en: 'Insight & Analytics, 28 October: we asked it to read our alerts, and it said it could not.',
    },
    punto: {
      it: 'Il digest che chiedete esiste, e il perimetro va verificato',
      en: 'The digest you asked for exists, and its scope needs checking',
    },
    punto2: {
      it: 'Tre famiglie di skill, già disponibili',
      en: 'Three skill families, already available',
    },
    lead: {
      it: 'Una famiglia di skill sugli alert, una sulle cause, una sulle sintesi.',
      en: 'One skill family for alerts, one for causes, one for summaries.',
    },
    oggi: {
      it: 'L’alert arriva come mail, si incolla in chat e si chiede che cosa è successo.',
      en: 'The alert arrives as an email, gets pasted into chat, and you ask what happened.',
    },
    con: {
      it: 'Gli alert diventano un briefing operativo, con le risorse colpite accanto.',
      en: 'Alerts become an operational briefing, with the affected resources beside them.',
    },
    ancore: [
      { it: 'Dagli alert a un briefing', en: 'From alerts to a briefing' },
      { it: 'Perché è caduta, non solo che è caduta', en: 'Why it dropped, not just that it dropped' },
      { it: 'Dalla tabella alla slide', en: 'From the table to the slide' },
    ],
    voci: [
      {
        figura: 'filtro',
        ancora: { it: 'Customer Alert Skills', en: 'Customer Alert Skills' },
        riga: {
          it: 'Disponibili a tutti i clienti Coworker. Servono gli alert di Experience Platform e le risorse collegate.',
          en: 'Available to every Coworker customer. They require Experience Platform alerts and the linked resources.',
        },
        livello: 'doc',
      },
      {
        figura: 'imbuto',
        ancora: { it: 'Root cause analysis', en: 'Root cause analysis' },
        riga: {
          it: 'Perché una metrica è cambiata: cali, picchi e anomalie, con le skill di root cause su CJA.',
          en: 'Why a metric changed: drops, spikes and anomalies, with the CJA root cause skills.',
        },
        livello: 'doc',
      },
      {
        figura: 'tabella-a-grafico',
        ancora: { it: 'Sintesi e outline di slide', en: 'Summaries and slide outlines' },
        riga: {
          it: 'La famiglia executive summary produce sintesi per chi decide e scalette di presentazione.',
          en: 'The executive summary family produces stakeholder summaries and presentation outlines.',
        },
        livello: 'doc',
      },
    ],
    nota: {
      it: 'Il dubbio dichiarato: queste skill lavorano sugli alert di Experience Platform, i vostri sono di CJA su pannello. La copertura va verificata.',
      en: 'The stated open question: these skills work on Experience Platform alerts, yours are CJA panel alerts. The coverage needs verifying.',
    },
    fonti: [
      {
        label: { it: 'Customer Alert Skills', en: 'Customer Alert Skills' },
        url: EL_ALERTS,
      },
      {
        label: { it: 'Coworker Chat workflows', en: 'Coworker Chat workflows' },
        url: EL_WORKFLOWS,
        aggiornata: '28.10.2026',
      },
    ],
  },

  {
    slug: 'domanda-5',
    num: '06',
    domanda: {
      it: '«Cosa non sa di noi, e come glielo diciamo?»',
      en: '“What does it not know about us, and how do we tell it?”',
    },
    chi: {
      it: 'Insight & Analytics, 28 ottobre: basta un file buttato dentro, o serve altro?',
      en: 'Insight & Analytics, 28 October: is dropping in a file enough, or is there more?',
    },
    punto: {
      it: 'Il data dictionary non è la strada, e c’è scritto',
      en: 'The data dictionary is not the route, and it is documented',
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
      it: 'Un’analisi ricorrente diventa una skill pubblicata, con gli intervalli di date dinamici.',
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
          it: 'Coworker non vi è collegato e non usa quelle definizioni per spiegare metriche e dimensioni.',
          en: 'Coworker is not connected to it and does not use those definitions to explain metrics and dimensions.',
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
        ancora: { it: 'Il cancello prima di agire', en: 'The gate before acting' },
        riga: {
          it: 'Il pattern della quality gate skill: si valida prima di applicare, e la modifica si vede prima.',
          en: 'The quality gate skill pattern: validate before applying, and see the change before it lands.',
        },
        livello: 'doc',
      },
    ],
    nota: {
      it: 'Il business context non è ancora per tutti: prima versione attesa a inizio dicembre. Fino a lì il contesto sta in una skill.',
      en: 'Business context is not yet for everyone: first version expected early December. Until then context lives in a skill.',
    },
    fonti: [
      {
        label: {
          it: 'Coworker in Workspace: i limiti dichiarati',
          en: 'Coworker in Workspace: the stated limitations',
        },
        url: EL_WS_LIMITI,
        aggiornata: '16.10.2026',
      },
      {
        label: { it: 'Create your first Coworker skill', en: 'Create your first Coworker skill' },
        url: EL_SKILL,
      },
      {
        label: { it: 'Run a quality gate skill', en: 'Run a quality gate skill' },
        url: EL_GATE,
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
