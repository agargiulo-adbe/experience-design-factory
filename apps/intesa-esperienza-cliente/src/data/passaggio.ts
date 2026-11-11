/**
 * IL PASSAGGIO DA ADOBE ANALYTICS A CUSTOMER JOURNEY ANALYTICS.
 *
 * ⚠️ Stava fra gli approfondimenti; dall'11 nov 2026 è nel capitolo 04, subito
 * dopo «Quattro domande», perché l'invito chiedeva «particolare attenzione
 * alla Web Analytics» (panel dell'11 nov). I dati stanno qui e non nel
 * frontmatter della pagina che li rende.
 *
 * Experience League, «feature support» riletta l'11 nov 2026:
 * · Data Warehouse Reporting → «Full Table Export is the evolution of Data
 *   Warehouse reports» (supported in a new way);
 * · Data Feeds → «data export of datasets is available through the Experience
 *   Platform Data Access API» (supported in a new way);
 * · Activity Map → «No support, not yet planned».
 * La durata della convivenza delle licenze NON è un dato pubblico: si decide
 * in fase 0, e la slide lo dice invece di stimarla.
 */
type Testo = { it: string; en: string };
export type Voce = { da: Testo | null; a: Testo };

const AW = { it: 'Analysis Workspace', en: 'Analysis Workspace' };
const SM = { it: 'Segmenti e metriche calcolate', en: 'Segments and calculated metrics' };

export const PASSAGGIO: { stato: string; t: Testo; v: Voce[] }[] = [
  { stato: 'resta', t: { it: 'Resta', en: 'Stays' }, v: [
    { da: { it: 'Dati della report suite', en: 'Report suite data' }, a: { it: 'Entrano via connettore', en: 'Come in via connector' } },
    { da: AW, a: AW },
    { da: SM, a: SM },
  ] },
  { stato: 'cambia', t: { it: 'Cambia nome', en: 'Gets renamed' }, v: [
    { da: { it: 'Report suite', en: 'Report suite' }, a: { it: 'Data view', en: 'Data view' } },
    { da: { it: 'eVar e prop', en: 'eVars and props' }, a: { it: 'Dimensioni senza limiti', en: 'Unlimited dimensions' } },
  ] },
  { stato: 'nuovo', t: { it: 'Si aggiunge', en: 'Gets added' }, v: [
    { da: null, a: { it: 'Filiale, Filiale Digitale e CRM', en: 'Branch, Filiale Digitale and CRM' } },
    { da: null, a: { it: 'Anonimo e noto ricuciti', en: 'Anonymous and known stitched' } },
  ] },
];

export const DETTAGLI_PASSAGGIO: { segno: string; ancora: Testo; riga: Testo }[] = [
  { segno: 'archivio', ancora: { it: 'Migrazione', en: 'Migration' },
    riga: { it: 'Progetti, segmenti e metriche si migrano con lo strumento dedicato. Persistenza e attribuzione diventano retroattive.', en: 'Projects, segments and metrics migrate with the dedicated tool. Persistence and attribution become retroactive.' } },
  { segno: 'esito', ancora: { it: 'Esportazioni', en: 'Exports' },
    riga: { it: 'Data Warehouse passa a Full Table Export; i Data Feeds diventano esportazioni di dataset da Experience Platform.', en: 'Data Warehouse moves to Full Table Export; Data Feeds become dataset exports from Experience Platform.' } },
  { segno: 'bordo', ancora: { it: 'Activity Map', en: 'Activity Map' },
    riga: { it: 'Activity Map non è supportato, e oggi non è in roadmap.', en: 'Activity Map is not supported, and is not on the roadmap today.' } },
  { segno: 'canali', ancora: { it: 'Convivenza, storico, formazione', en: 'Overlap, history, training' },
    riga: { it: 'Convivenza delle licenze e storico si decidono in fase 0. Per Workspace la guida dà da tre a sei mesi.', en: 'Licence overlap and history get decided in phase 0. For Workspace the guide gives three to six months.' } },
];
