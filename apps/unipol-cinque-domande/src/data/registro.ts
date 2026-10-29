/**
 * «Il registro» — LO STRATO DINAMICO di questo Playbook.
 *
 * Perché esiste separato dai capitoli, e perché è una tabella e non un racconto.
 * Un Playbook è un artefatto one-shot: cinque domande, cinque risposte, e si
 * consegna. Un programma di otto settimane invece produce voci nuove ogni
 * mercoledì. Fondere le due cose dà un documento senza spina dorsale che
 * nessuno rilegge, più un compito settimanale che duplica la minuta.
 *
 * Quindi: i capitoli restano fermi e si riscrivono a due traguardi (metà
 * programma e chiusura). Qui si appende una riga per voce, con la data. Niente
 * narrazione, niente copertina: è un log e si legge come un log.
 *
 * COME SI AGGIUNGE UNA RIGA
 * Dopo ogni sessione, dalla minuta: una voce per punto aperto o chiuso, con il
 * livello di fonte e chi ce l'ha. `stato` si muove, la riga non si riscrive.
 */

export type Stato = 'risposto' | 'aperto' | 'verificare';
export type Livello = 'doc' | 'la' | 'campo' | 'noi';

export interface Voce {
  /** Data in chiaro, mai relativa: «la settimana scorsa» non si legge a gennaio. */
  data: string;
  tema: { it: string; en: string };
  esito: { it: string; en: string };
  stato: Stato;
  livello: Livello;
  chi: string;
}

export const STATI: Record<Stato, { it: string; en: string }> = {
  risposto: { it: 'Risposto', en: 'Answered' },
  aperto: { it: 'Aperto', en: 'Open' },
  verificare: { it: 'Da verificare', en: 'To verify' },
};

export const LIVELLI_REG: Record<Livello, { it: string; en: string }> = {
  doc: { it: 'Documentato', en: 'Documented' },
  la: { it: 'Non ancora per tutti', en: 'Not yet for everyone' },
  campo: { it: 'Dal campo', en: 'From the field' },
  noi: { it: 'Detto da noi', en: 'Said by us' },
};

export const REGISTRO: Voce[] = [
  {
    data: '28.10.2026',
    tema: { it: 'Gli alert di CJA non si leggono', en: 'CJA alerts cannot be read' },
    esito: {
      it: 'Esiste una famiglia di skill sugli alert, documentata e disponibile a tutti. Lavora sugli alert di Experience Platform: la copertura dei vostri, che sono di CJA su pannello, va verificata.',
      en: 'A documented alert skill family exists, available to all. It works on Experience Platform alerts: coverage of yours, which are CJA panel alerts, needs verifying.',
    },
    stato: 'verificare',
    livello: 'doc',
    chi: 'Adobe',
  },
  {
    data: '28.10.2026',
    tema: { it: 'Il digest invece della mail secca', en: 'A digest instead of the bare email' },
    esito: {
      it: 'Un progetto chiamato Proactive Insights fa quello che avete descritto. Non ha documentazione pubblica: resta un’indicazione, non una data.',
      en: 'A project called Proactive Insights does what you described. It has no public documentation: it stays an indication, not a date.',
    },
    stato: 'aperto',
    livello: 'noi',
    chi: 'Adobe',
  },
  {
    data: '28.10.2026',
    tema: { it: 'La modifica in blocco dei segmenti', en: 'The bulk segment edit' },
    esito: {
      it: 'Non era un difetto: citando un segmento per nome Coworker non ne conosce la definizione e la deduce. La pagina dei limiti dice di verificare prima di fidarsi.',
      en: 'Not a defect: named by name, Coworker does not know a segment’s definition and infers it. The limitations page says to verify before relying on it.',
    },
    stato: 'risposto',
    livello: 'doc',
    chi: 'Unipol',
  },
  {
    data: '28.10.2026',
    tema: { it: 'La conferma prima di applicare', en: 'Confirmation before applying' },
    esito: {
      it: 'Oggi si ottiene con una skill che fa da cancello: valida prima, mostra la modifica, poi applica. Come comportamento di default del prodotto è una richiesta aperta.',
      en: 'Today it is achieved with a skill acting as a gate: validate, show the change, then apply. As default product behaviour it remains an open request.',
    },
    stato: 'aperto',
    livello: 'doc',
    chi: 'Adobe',
  },
  {
    data: '28.10.2026',
    tema: { it: 'Caricare il data dictionary', en: 'Loading the data dictionary' },
    esito: {
      it: 'Strada chiusa, ed è documentata: Coworker non è collegato al Data Dictionary di CJA. Il contesto si mette dentro una skill.',
      en: 'A closed route, and documented: Coworker is not connected to CJA’s Data Dictionary. Context goes inside a skill.',
    },
    stato: 'risposto',
    livello: 'doc',
    chi: 'Unipol',
  },
  {
    data: '28.10.2026',
    tema: { it: 'Business context, e cosa si vede in interfaccia', en: 'Business context, and what the interface shows' },
    esito: {
      it: 'In interfaccia compare Experience context, un oggetto diverso che riguarda il marchio sul lato contenuti. Il business context non è ancora per tutti: prima versione attesa a inizio dicembre.',
      en: 'What you see is Experience context, a different thing about brand on the content side. Business context is not yet for everyone: first version expected early December.',
    },
    stato: 'aperto',
    livello: 'la',
    chi: 'Adobe',
  },
  {
    data: '28.10.2026',
    tema: { it: 'Da tabella a visualizzazione', en: 'From table to visualisation' },
    esito: {
      it: 'La famiglia executive summary produce sintesi per chi decide e scalette di slide. È un caso d’uso sensato, non un vicolo cieco.',
      en: 'The executive summary family produces stakeholder summaries and slide outlines. It is a sensible use case, not a dead end.',
    },
    stato: 'risposto',
    livello: 'doc',
    chi: 'Unipol',
  },
  {
    data: '28.10.2026',
    tema: { it: 'Perché una variante vince, non solo che vince', en: 'Why a variant wins, not just that it wins' },
    esito: {
      it: 'Le skill di oggi leggono i dati, non la creatività. Il piano per portare l’analisi di contenuto dentro Target è da confermare.',
      en: 'Today’s skills read the data, not the creative. The plan to bring content analysis into Target is to be confirmed.',
    },
    stato: 'aperto',
    livello: 'noi',
    chi: 'Adobe',
  },
  {
    data: '28.10.2026',
    tema: { it: 'Da stage a prod sulle data view', en: 'Stage to prod on data views' },
    esito: {
      it: 'Una skill non è possibile adesso: Coworker legge le data view e non le modifica. Si attende il supporto amministrativo.',
      en: 'A skill is not possible yet: Coworker reads data views and does not edit them. Waiting on admin support.',
    },
    stato: 'aperto',
    livello: 'doc',
    chi: 'Adobe',
  },
  {
    data: '28.10.2026',
    tema: { it: 'Migrare i progetti da Analytics a CJA', en: 'Migrating projects from Analytics to CJA' },
    esito: {
      it: 'La skill esiste, chiede la mappatura la prima volta, la ricorda e la si può correggere. Attenzione: è a disponibilità limitata, non per tutti.',
      en: 'The skill exists, asks for the mapping the first time, remembers it and lets you correct it. Note: limited availability, not for everyone.',
    },
    stato: 'verificare',
    livello: 'la',
    chi: 'Unipol',
  },
];
