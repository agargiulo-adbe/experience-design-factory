# Dalle aperture, non dai fatti — design

**Data:** 13 ott 2026 · **Stato:** approvato nello scope, **non implementato**

## Il problema

Il radar produce **fatti su un account**: «Enel AAM è a rischio», «Banca Generali chiude
tre trattative fra otto giorni». Il titolare l'ha chiamato per quello che è — «una sorta di
task manager» — e ha chiesto un'altra cosa: un sistema che, leggendo fonti interne ed
esterne, dica **avvia una conversazione con questo contatto di questo cliente per proporre
questo prodotto, questa iniziativa, questo evento**.

La differenza non è di presentazione. Un fatto su un account non dice **a chi scrivere**,
e tre dimensioni mancano del tutto:

1. **la persona** — il Radar porta il team **Adobe** (AE, CSM, SC), non i contatti del
   cliente. Nei registri ci sono **23 righe** di «chi è chi» su otto account, più nomi
   sparsi dentro dossier e personas: magro e disomogeneo;
2. **la cosa da proporre** — i prodotti solo come mappa di caselle vuote (e giustamente
   dietro la regola del segnale), gli eventi a mano, le iniziative per niente;
3. **le fonti esterne** — zero.

## Lo scopo, e perché decide la forma

Il ruolo è **Product Specialist in overlay**: misurato **70% su M1** (Gross New ARR sui
prodotti assegnati, $2.715.158 FY26, di cui **$1.113.215 nel solo Q4**, che chiude il **27
novembre**) e **30% su M2** (tasso di rinnovo al 90%). L'account resta dell'**Account
Executive**: lui fa crescere il suo prodotto *dentro* l'account, non in parallelo.

Quindi l'obiettivo non è «più conversazioni»: è **chiudere ARR eleggibile e difendere i
rinnovi**, con un trimestre che vale il 41% dell'anno. Un sistema che serve a questo deve
parlare la lingua della misura, e il radar attuale non la parla.

## Le decisioni

| Decisione | Alternative scartate | Perché |
| --- | --- | --- |
| **Lo slice sottile**: grafo dei contatti + **una** apertura al giorno + il giro di ritorno | il disegno intero con quattro livelli e quattro fonti esterne | costruire quattro livelli prima di sapere se **una** apertura viene lavorata è come è morto il radar del 2 ott, solo con più strati. Il giro di ritorno dirà cosa aggiungere |
| **Una apertura al giorno**, e dice cosa ha scartato | tre al giorno | tre al giorno fanno sessanta al mese: non si lavorano. La risorsa scarsa è l'attenzione, non i segnali |
| Il destinatario si decide **caso per caso e si dichiara** | sempre tramite l'AE; sempre diretto | il dato per deciderlo esiste già (chi ha scritto a chi, quando, su che tema); «sempre tramite l'AE» aggiunge un passaggio inutile sui contatti già suoi, e un sistema che aggiunge passaggi si smette di usare |
| Il grafo dei contatti si **ricava** da Outlook | una rubrica compilata a mano | una rubrica a mano diverge in tre settimane, come ogni cosa che dipende da chi si ricorda di aggiornarla. Una ricerca per dominio dà già nome, data e tema: su Enel **sei persone in una chiamata** |
| **Fonti esterne fuori da questo slice** | accenderle subito tutte e quattro | le quattro sono state approvate, ma annunci di lavoro e mosse dei concorrenti sono le più care per unità di segnale (indiretto il primo, difensivo il secondo). Si accendono quando il giro di ritorno mostra che le aperture si lavorano |
| «**Non conosciamo nessuno**» esce dalle aperture | tenerlo nella stessa lista | è un **compito di ricerca**, non un'apertura: nella stessa lista diluisce quella che si può lavorare oggi |

## A · Il grafo dei contatti

**Come si ricava.** Una ricerca Outlook per **dominio del cliente** (`sender: enel.com`)
restituisce nome, indirizzo, data e **tema** dell'ultimo scambio. Verificato il 13 ott su
Enel: sei contatti in una chiamata — contratti, IT, cybersecurity, «Piano attività Adobe».

**Dove si deposita.** Nella sezione **«Chi è chi»** del registro dell'account, come fatti
datati: `ruolo/funzione · nome · ultimo scambio <data> · tema`. Una passata **a settimana**
per account, non al giorno: il grafo cambia lentamente.

**La regola del destinatario**, calcolata dal dato e non indovinata:

- **scrivi tu** — il contatto ha scritto *a te* o tu *a lui* negli ultimi ~120 giorni, su un
  tema che tocca i tuoi prodotti;
- **passa dall'AE** — il contatto è nei thread dell'account ma non nei tuoi, o è freddo, o
  è di una funzione che non compra i tuoi prodotti (acquisti, cybersecurity, legale).

⚠️ La regola **si dichiara sempre** nell'apertura, con il motivo: «ultimo scambio a luglio,
non tuo» è l'informazione che fa decidere.

## B · L'apertura

**Quattro campi obbligatori.** Se ne manca uno, l'apertura **non esce**: meglio una riga in
meno che una riga senza destinatario.

| Campo | Che cos'è |
| --- | --- |
| **A CHI** | nome, funzione, e «scrivi tu» o «passa da \<AE\>» con il motivo |
| **PROPONI** | il prodotto, l'iniziativa o l'evento. Uno, non tre |
| **PERCHÉ ORA** | il segnale che la giustifica, **con la fonte e la data** |
| **MUOVE** | M1, M2, o «relazione» — così si vede se tocca il piano |

Più due marche brevi: **Q4?** (sì se può plausibilmente chiudere entro il 27 nov, altrimenti
«costruisce il Q1» — etichettato, non mescolato) e un **id** (`A-AAAAMMGG-N`) che serve al
giro di ritorno.

**Una al giorno.** E una riga finale: **cosa ha scartato e perché** — «scartate 2 (Enel,
Intesa): più lontane dalla data, o senza contatto noto». La scelta deve essere visibile, se
no è un oracolo.

## C · Il giro di ritorno — il pezzo che vale più di tutti

È l'unico che **migliora da sé**: tutto il resto resta come è stato costruito.

Ogni apertura diventa una riga in **`docs/Adobe/Radar/Registro_opportunita.md`**, nella
tabella che quel file ha già, con la colonna **«Decisione Antonio» vuota**. Quella colonna
esiste dal 2 ottobre e **nessuno l'ha mai scritta**: è esattamente il posto previsto.

La decisione si dà in due modi, e il primo deve bastare:

1. **a mano**, scrivendo `SÌ` / `NO` / `DOPO` nella colonna;
2. per comodità, `accounts --decidi A-20261015-1 no`.

**Come la legge il sistema:**

- **NO** → quella combinazione (account + contatto + cosa) **non si ripropone più**;
- **DOPO** → si ripropone dopo **21 giorni**, non prima;
- **SÌ** → resta aperta e il sistema chiede l'esito alla chiusura dell'account
  (`/account-close`), così la riga non muore nel limbo.

⚠️ **La colonna non si riscrive mai**, nemmeno per «aggiornarla»: è la regola già scritta
per quel file, e vale a maggior ragione adesso che qualcuno la usa.

**Che cosa ne ricaviamo dopo un mese**: quali *tipi* di segnale diventano conversazioni
(rinnovo in rosso? trattativa vicina? evento?) e quali no. È il dato che dirà se accendere
le fonti esterne, e quali.

## D · I guardrail

- **Niente nome inventato.** Un contatto entra solo se è stato **visto** in un thread. Se
  non c'è, l'apertura non esce e il caso finisce nella lista dei compiti di ricerca.
- **Niente apertura senza segnale.** Vale la regola già in vigore: una casella vuota nella
  mappa del cross-sell non è un'opportunità. Il segnale è un fatto datato, non un'ipotesi.
- **Decide l'AE dove è il suo.** Il sistema propone l'apertura, non la esegue: **non manda
  posta**, scrive bozze.
- **Dati personali.** Il grafo contiene nomi e indirizzi di persone reali dei clienti. Vive
  nei registri, che sono **ignorati da git** e stanno solo sul disco di lavoro. È un
  perimetro che si allarga, e va saputo prima di accendere, non dopo.
- **Le dichiarazioni invecchiano.** Ogni segnale porta la data; oltre una certa età si marca
  «da riverificare» invece di essere ricitato.

## E · Quello che questo slice NON fa

- **Nessuna fonte esterna** (lavoro successivo).
- **Nessun piano in testa**: richiede l'attainment, che **non esiste in nessuna fonte
  disponibile** — il Goal Sheet porta i bersagli, non il raggiunto, e nel Radar non c'è.
- **Nessun aggancio agli asset della Factory** (lavoro successivo, e di valore alto).
- Non apre il caso «non conosciamo nessuno»: va in una lista di ricerche, separata.

## F · Le due incognite aperte, e cosa cambiano

1. **Il raggiunto su M1 e M2.** Senza, il sistema sa dove deve arrivare e non dove è, e «su
   cosa lavorare» resta un giudizio su rischio × valore invece di una risposta su cosa chiude
   la quota. Da prendere da Panorama o dal titolare.
2. **Un rinnovo con aumento conta per M1, o solo per M2?** Il Goal Sheet non lo dice — zero
   occorrenze di «net-new», «expansion», «uplift» — e in Teams risulta un «sales order con
   il 5% increase» su Unipol Target. **Se l'aumento conta anche per M1**, difendere-e-aumentare
   un rinnovo vale **doppio** e i sette rinnovi eleggibili diventano la strada più breve verso
   il numero, non solo la difesa del 30%. L'ordine delle priorità cambia.

Entrambe sono domande per una persona, non per il sistema.

## G · Come si verifica

```bash
# il grafo si ricava e si deposita
/account-open Enel          # deve scrivere «Chi è chi» con nomi, date e temi veri
grep -c "ultimo scambio" "docs/Enel/ACCOUNT.md"

# l'apertura ha i quattro campi, o non esce
pnpm accounts --apertura    # zero campi mancanti; se manca il contatto, nessuna apertura

# il giro di ritorno chiude il cerchio
#   scrivere NO su una riga → l'apertura non ricompare il giorno dopo
#   scrivere DOPO → non ricompare per 21 giorni
#   la colonna «Decisione Antonio» non viene mai riscritta dal sistema

# e il gate di sempre
pnpm audit:docs             # 0 rilievi: nessun nome di cliente in un file tracciato
```

**La verifica vera non è tecnica**: due settimane di aperture e la colonna delle decisioni.
Se nessuna diventa `SÌ`, il problema non è il codice — è il segnale, e si cambia quello.

## Lavoro successivo, in ordine di valore

- **Il piano in testa**, appena esiste il raggiunto: il salto da feed a piano.
- **Gli asset della Factory agganciati all'apertura** — «e qui c'è il capitolo
  sull'attribution dell'experience UniCredit». È il valore che nessun altro sistema può
  dare, perché quegli asset esistono solo qui.
- **Le fonti esterne**, nell'ordine che il giro di ritorno indicherà: prima la **superficie
  digitale del cliente** (misurata, non opinione — i tre precedenti che hanno funzionato nel
  repo sono tutti di quella famiglia) e le **notizie**; poi, solo se servono, annunci di
  lavoro e mosse dei concorrenti.
- **La lista dei compiti di ricerca**, per i casi «non conosciamo nessuno che compri questo».
