/**
 * Le card per funzione dell'edizione da distribuire (spec
 * 2026-11-20-funzioni-e-domande): un indice filtrato, non un percorso. Una riga
 * e al massimo quattro tappe, ognuna una slide che esiste già, con il SUO
 * titolo (lo verifica `check:edizione funzioni`). Mai una slide di riserva
 * (`data-riserva`): in lettura non c'è. Due card non condividono più
 * di una tappa. Le chiavi sono quelle di `@edf/core/utils/contributi`.
 */
import type { CardFunzione } from '@edf/core/blocks/immersive/CardFunzioni.astro';

/** Il capitolo di una tappa, letto dalla pagina: lo vede chi sceglie, sopra il titolo. */
const CAPITOLO: Record<string, string> = {
  momenti: 'Giulia',
  'messa-a-terra': 'Dove ci innestiamo',
  approfondimenti: 'Approfondimento',
  risultati: 'Referenze',
  adobe: 'Adobe, chi siamo',
  coworker: 'Coworker',
};
/** 'messa-a-terra/#slide-chiave' → 'messa-a-terra--slide-chiave.jpg' (scripts/funzioni-miniature.ts). */
export const nomeMiniatura = (href: string) => href.replace('/#', '--') + '.jpg';

const TAPPE_GREZZE: CardFunzione[] = [
  { k: 'direzione', riga: 'Che cosa cambia nei risultati, e chi l’ha già fatto.', tappe: [
    { href: 'risultati/#slide-credit-agricole', t: 'Crédit Agricole Italia: +15% al primo acquisto' },
    { href: 'messa-a-terra/#slide-attribuzione', t: 'Quanto pesa il digitale sulle firme in filiale? Con l’ultimo clic, un quinto.' },
    { href: 'approfondimenti/#slide-domanda-misura', t: 'Dalla persona al budget: quanto vale ogni canale, anche offline' },
    { href: 'risultati/#slide-santander', t: 'Santander Brasil: reagire entro 15 minuti' },
  ] },
  { k: 'marketing', riga: 'Farsi trovare, parlare al momento giusto, sapere che cosa ha funzionato.', tappe: [
    { href: 'momenti/#slide-m-01', t: 'Chiede a un assistente AI quale mutuo scegliere e trova Intesa Sanpaolo' },
    { href: 'momenti/#slide-m-02', t: 'Vede un annuncio sul mutuo per la prima casa a Torino' },
    { href: 'approfondimenti/#slide-brand-visibility', t: 'Come si misura e si corregge il modo in cui comparite' },
    { href: 'messa-a-terra/#slide-attribuzione', t: 'Quanto pesa il digitale sulle firme in filiale? Con l’ultimo clic, un quinto.' },
  ] },
  { k: 'dati', riga: 'Un’identità sola dal sito alla filiale, e la misura che ne segue.', tappe: [
    { href: 'messa-a-terra/#slide-chiave', t: 'Più identificativi, una persona sola: dal sito alla filiale e oltre la firma' },
    { href: 'messa-a-terra/#slide-cja-banca', t: 'Quattro domande a cui Customer Journey Analytics risponde' },
    { href: 'messa-a-terra/#slide-flusso', t: 'Dalla email allo sportello: da dove passa chi compra' },
    { href: 'approfondimenti/#slide-passaggio', t: 'Passando a Customer Journey Analytics restano dati, Workspace e segmenti' },
  ] },
  { k: 'tecnologia', riga: 'Dove ci appoggiamo, che cosa si collega, dove sta ogni dato.', tappe: [
    { href: 'messa-a-terra/#slide-innesto', t: 'Riconoscere, ingaggiare e misurare anche chi non è ancora cliente' },
    { href: 'approfondimenti/#slide-integrazioni', t: 'I collegamenti per partire, e quelli che arrivano dopo' },
    { href: 'approfondimenti/#slide-integrazioni-dati', t: 'Dove gira, e dove sta ogni dato' },
    { href: 'approfondimenti/#slide-integrazioni-crm', t: 'Il lead arriva al CRM di filiale, e quattro punti si fissano prima' },
  ] },
  /* Chi costruisce i target, il CRM e la pianificazione commerciale (panel del
     20 nov 2026): chi gira il link è il Targeting, e senza una porta sua finiva
     in «Dati e analisi». */
  { k: 'targeting', riga: 'Che cosa resta vostro, dove entrano score e segmenti, e chi porta che cosa.', tappe: [
    { href: 'approfondimenti/#slide-ingaggio-mappa', t: 'Che cosa avete, che cosa si aggiunge, che cosa resta vostro' },
    { href: 'messa-a-terra/#slide-innesto', t: 'Riconoscere, ingaggiare e misurare anche chi non è ancora cliente' },
    { href: 'coworker/#slide-video', t: 'Un’iniziativa sul mutuo preparata in una sessione' },
    { href: 'approfondimenti/#slide-serve', t: 'Le cinque cose da portare alla prima sessione, e chi le porta' },
  ] },
  { k: 'digitale', riga: 'Il simulatore, la richiesta interrotta e l’app dopo la firma.', tappe: [
    { href: 'momenti/#slide-m-03', t: 'Simula 180.000 euro su 25 anni e lascia l’email per salvare il risultato' },
    { href: 'momenti/#slide-m-04', t: 'Si ferma perché le mancano le buste paga' },
    { href: 'momenti/#slide-m-07', t: 'Firma la richiesta e apre il conto: da oggi la pratica è nell’app' },
    { href: 'approfondimenti/#slide-ingaggio-regia', t: 'Tre modi di eseguire la stessa decisione' },
  ] },
  { k: 'rete', riga: 'Il cliente che arriva in filiale già conosciuto, e il valore della filiale nella vendita.', tappe: [
    { href: 'momenti/#slide-m-06', t: 'In filiale il gestore ha già aperta la sua simulazione' },
    { href: 'approfondimenti/#slide-integrazioni-crm', t: 'Il lead arriva al CRM di filiale, e quattro punti si fissano prima' },
    { href: 'messa-a-terra/#slide-attribuzione', t: 'Quanto pesa il digitale sulle firme in filiale? Con l’ultimo clic, un quinto.' },
    { href: 'risultati/#slide-unipol', t: 'Unipol: 17,6 milioni di clienti e 2.035 agenzie' },
  ] },
  { k: 'compliance', riga: 'Dove sta il consenso, chi lo governa, dove sta ogni dato.', tappe: [
    { href: 'approfondimenti/#slide-domanda-consenso', t: 'Il consenso di chi non è ancora cliente: dove sta, chi lo governa' },
    { href: 'approfondimenti/#slide-integrazioni-dati', t: 'Dove gira, e dove sta ogni dato' },
    { href: 'approfondimenti/#slide-ingaggio-profilo', t: 'Il profilo collega pseudonimo, telefono e codice cliente alla stessa persona' },
  ] },
];

export const CARD_FUNZIONI: CardFunzione[] = TAPPE_GREZZE.map((c) => ({
  ...c,
  tappe: c.tappe.map((t) => ({ ...t, cap: CAPITOLO[t.href.split('/')[0]] ?? '', img: `miniature/funzioni/${nomeMiniatura(t.href)}` })),
}));
