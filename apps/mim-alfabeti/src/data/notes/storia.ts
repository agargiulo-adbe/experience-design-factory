/**
 * Presenter notes — «La storia di Giulia» (storia.astro).
 * Keyed by slide id. Each note: what to say, when to press ↓ (sub-steps), the
 * transition to the next slide. IT default, EN for the bilingual run.
 */
export interface SlideNote {
  it: string;
  en: string;
}

const notes: Record<string, SlideNote> = {
  'slide-ponte': {
    it: 'Silenzio: il video parte da solo e dura pochi secondi. Non commentare le immagini. Quando la didascalia in basso compare («Una docente tra 234.576»), leggila e passa oltre con →. La transizione: «Questa è Giulia».',
    en: 'Stay silent: the clip starts on its own and lasts a few seconds. Do not narrate the imagery. When the caption appears («One teacher among 234,576»), read it aloud and move on with →. Transition: «This is Giulia».',
  },
  'slide-ritratto': {
    it: 'Presenta Giulia come persona, non come categoria: nove anni di scuola, nessun contratto oltre l’anno. La scheda a destra è la sola cifra della sezione: 234.576 supplenti nel 2022/23, fonte Tuttoscuola su dati MIM, consultata il 4 settembre. Se chiedono, di’ subito cosa NON copre: ATA e dirigenti. Chiudi con la domanda di ogni estate: «dove sarò a settembre?» e passa con →.',
    en: 'Introduce Giulia as a person, not a category: nine years in schools, never a contract beyond one year. The card on the right is the section’s only figure: 234,576 substitutes in 2022/23, Tuttoscuola on MIM data, accessed 4 September. If asked, say straight away what it does NOT cover: ATA staff and principals. Close on the question of every summer, «where will I be in September?», then →.',
  },
  'slide-notte': {
    it: 'Tre battute, tre pressioni di ↓. All’apertura il telefono mostra le 23:40 e il bollettino: lascia leggere, poi ↓ per «La domanda al buio». Secondo ↓: la chat delle 00:12, dove l’esito si cerca nei gruppi («Il bollettino altrove»). Terzo ↓: le 07:30, la rettifica e la revoca. Ricorda che il telefono è un esempio illustrativo, nessun dato reale. Le fonti in basso sono tre articoli pubblici. Transizione: «Ora la stessa notte, con una voce che la raggiunge».',
    en: 'Three beats, three presses of ↓. On entry the phone shows 23:40 and the bulletin: let them read, then ↓ for «Ranking in the dark». Second ↓: the 00:12 group chat, where the outcome is hunted in the groups («The result lands elsewhere»). Third ↓: 07:30, the correction and the revocation. Remind the room the phone is an illustrative example, no real data. The sources at the bottom are three public articles. Transition: «Now the same night, with a voice that reaches her».',
  },
  'slide-evolve': {
    it: 'Prima il paragrafo: profilo per ruolo, non un database di marketing; avvisi di procedura che il Ministero già deve, sul canale istituzionale, senza dati sensibili nel messaggio. Poi ↓ tre volte per far comparire i tre passi del journey: finestra aperta (recapitato), scadenza (aperto), esito pubblicato (azione). La citazione in basso a sinistra è la chiusura: «lascia una traccia che il Ministero può leggere». Poi → verso «La voce».',
    en: 'Paragraph first: a role-based profile, not a marketing database; procedural notices the Ministry already owes, on the institutional channel, no sensitive data in the message. Then ↓ three times to bring in the journey steps: window open (delivered), deadline (opened), outcome published (acted on). The quote bottom-left is the close: «leaving a trace the Ministry can read». Then → into «The voice».',
  },
};

export default notes;
