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
 *
 * E UNA COSA CHE NON CI VA MAI: il nome in codice di un progetto interno. Qui
 * dentro c'era «Proactive Insights», che vive solo sul wiki Adobe e su una
 * roadmap marcata Confidential. Un livello di fonte onesto («detto da noi»,
 * senza documentazione pubblica) dice che cos'è, e non serve nominarlo: il
 * cliente inoltra questo documento, e un nome in codice non si può ritirare.
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
  /** Chi la CHIUDE — un ruolo, non un'azienda. «Adobe» e «Unipol» dicevano chi
      l'aveva sollevata, che è un'altra informazione e non serve a nessuno:
      una voce aperta senza un titolare torna identica alla sessione dopo. */
  chi: { it: string; en: string };
  /** Entro quando. Vuoto = ancora da assegnare, e si rende così: una data
      inventata è peggio di una casella onestamente vuota. */
  entro?: { it: string; en: string };
  /** La pagina pubblica, dove c'è. Il deck dichiara che «Documentato» vuol dire
      pagina pubblica con link: una riga marcata `doc` senza link si contraddice
      da sola, ed è esattamente quello che il fact-check ha trovato. */
  fonte?: { label: string; url: string };
}

const EL_ALERTS = 'https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/alerts/customer-alerts';
const EL_NOTIFICHE = 'https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/notifications/notification-skills';
const EL_WS = 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/cja-workspace/coworker';
const EL_WORKFLOWS = 'https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows';

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
    chi: { it: 'Team di prodotto Adobe', en: 'Adobe product team' },
    entro: { it: 'Sessione del 5 novembre', en: 'Session of 5 November' },
    fonte: { label: 'Customer Alert Skills', url: EL_ALERTS },
  },
  {
    data: '28.10.2026',
    tema: { it: 'Il digest invece della mail secca', en: 'A digest instead of the bare email' },
    esito: {
      it: 'Notification Skills lo documenta ed è disponibile a tutti i clienti Coworker: digest giornaliero o settimanale, nessuna configurazione. Resta da provare se gli alert di CJA su pannello ci entrano.',
      en: 'Notification Skills documents it and it is available to every Coworker customer: a daily or weekly digest, no setup. What is left is trying whether CJA panel alerts land in it.',
    },
    stato: 'verificare',
    livello: 'doc',
    chi: { it: 'Team di prodotto Adobe', en: 'Adobe product team' },
    entro: { it: 'Chiusura del programma, fine novembre', en: 'Programme close, end of November' },
    fonte: { label: 'Notification Skills', url: EL_NOTIFICHE },
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
    chi: { it: 'Insight & Analytics', en: 'Insight & Analytics' },
    fonte: { label: 'Coworker in Workspace: i limiti', url: EL_WS },
  },
  {
    data: '28.10.2026',
    tema: { it: 'La conferma prima di applicare', en: 'Confirmation before applying' },
    esito: {
      it: 'Sulle cancellazioni esiste già: Coworker elenca i pannelli che intende cancellare e aspetta la conferma. Come default su ogni modifica resta una richiesta aperta.',
      en: 'On deletions it already exists: Coworker lists the panels it plans to delete and waits for confirmation. As a default on every change it remains an open request.',
    },
    stato: 'aperto',
    livello: 'doc',
    chi: { it: 'Team di prodotto Adobe', en: 'Adobe product team' },
    entro: { it: 'Sessione del 12 novembre', en: 'Session of 12 November' },
    fonte: { label: 'Coworker in Workspace: i limiti', url: EL_WS },
  },
  {
    data: '28.10.2026',
    tema: { it: 'Caricare il data dictionary', en: 'Loading the data dictionary' },
    esito: {
      it: 'Oggi Coworker non è collegato al Data Dictionary di CJA, e la stessa pagina dichiara il supporto per una release futura, senza data. Fino ad allora il contesto sta in una skill.',
      en: 'Today Coworker is not connected to CJA’s Data Dictionary, and the same page states support is planned for a future release, with no date. Until then context lives in a skill.',
    },
    stato: 'risposto',
    livello: 'doc',
    chi: { it: 'Insight & Analytics', en: 'Insight & Analytics' },
    fonte: { label: 'Coworker in Workspace: i limiti', url: EL_WS },
  },
  {
    data: '28.10.2026',
    tema: { it: 'Business context, e cosa si vede in interfaccia', en: 'Business context, and what the interface shows' },
    esito: {
      it: 'In interfaccia compare Experience context, un oggetto diverso che riguarda il marchio sul lato contenuti. Il business context non è ancora per tutti e non ha una data pubblica.',
      en: 'What you see is Experience context, a different thing about brand on the content side. Business context is not yet for everyone and has no public date.',
    },
    stato: 'aperto',
    livello: 'la',
    chi: { it: 'Team di prodotto Adobe', en: 'Adobe product team' },
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
    chi: { it: 'Insight & Analytics', en: 'Insight & Analytics' },
    fonte: { label: 'Coworker Chat workflows', url: EL_WORKFLOWS },
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
    chi: { it: 'Digital Intelligence', en: 'Digital Intelligence' },
    entro: { it: 'Sessione del 12 novembre', en: 'Session of 12 November' },
  },
  {
    data: '28.10.2026',
    tema: { it: 'Da stage a prod sulle data view', en: 'Stage to prod on data views' },
    esito: {
      it: 'Per quanto ne sappiamo una skill non è possibile adesso: la modifica di una data view è trattata come un caso d’uso da amministratore. Non c’è una pagina pubblica che lo dica.',
      en: 'As far as we know a skill is not possible yet: editing a data view is treated as an admin use case. No public page states it.',
    },
    stato: 'aperto',
    livello: 'noi',
    chi: { it: 'Team di prodotto Adobe', en: 'Adobe product team' },
    entro: { it: 'Sessione del 5 novembre', en: 'Session of 5 November' },
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
    chi: { it: 'Insight & Analytics', en: 'Insight & Analytics' },
    entro: { it: 'Chiusura del programma, fine novembre', en: 'Programme close, end of November' },
  },
  {
    data: '28.10.2026',
    tema: { it: 'Permessi, sandbox e perimetro dei dati', en: 'Permissions, sandbox and data scope' },
    esito: {
      it: 'Tre cose da mettere per iscritto prima del primo caso d’uso. Su quale sandbox e quale data view gira Coworker da voi. Chi può eseguire una skill pubblicata. Che cosa dei vostri dati esce verso il modello.',
      en: 'Three things to put in writing before the first use case. Which sandbox and data view Coworker runs on at your end. Who can run a published skill. What of your data leaves towards the model.',
    },
    stato: 'aperto',
    livello: 'noi',
    chi: { it: 'Team di prodotto Adobe', en: 'Adobe product team' },
    entro: { it: 'Sessione del 12 novembre', en: 'Session of 12 November' },
  },
  {
    data: '28.10.2026',
    tema: { it: 'Chi apre l’accesso su Target', en: 'Who opens access on Target' },
    esito: {
      it: 'Su CJA l’accesso c’è e si usa. Su Target va verificato chi lo abilita e con quale profilo, prima di provare il primo caso.',
      en: 'On CJA access is there and in use. On Target it has to be verified who enables it and with which profile, before the first case is tried.',
    },
    stato: 'aperto',
    livello: 'noi',
    chi: { it: 'Team di prodotto Adobe', en: 'Adobe product team' },
    entro: { it: 'Sessione del 5 novembre', en: 'Session of 5 November' },
  },
];
