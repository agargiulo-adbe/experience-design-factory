# Il contatto facoltativo nel modulo delle domande — design

Data: 20 novembre 2026 · Edizione da distribuire, versione B (`/intesa-storia-insieme/`)
Prevale, sul contatto, su `2026-11-19-edizione-lettura-design.md` («Revisione del 19 nov sera»), che voleva il modulo anonimo per costruzione.

## Perché

Una domanda che arriva dal modulo si legge, se ne valuta il peso, si confronta con le altre, e poi prende una di tre strade:

1. una risposta per email a chi l'ha scritta;
2. una call di approfondimento con quella persona;
3. quando più domande sono simili o collegate, una sessione allargata proposta al referente della banca.

Il modulo anonimo rende possibile solo la terza strada. Il contatto serve alle altre due.

## Che cosa cambia

- **Un campo «Email per la risposta», facoltativo.** Chi non lo compila resta anonimo come prima: la riga inviata è identica a quella di oggi (sei campi).
- **Chi vede l'email lo dice il modulo, accanto al campo:** il team Adobe dell'account e il referente della banca per questo progetto. Non entra nel riepilogo. Si cancella dopo la risposta, e comunque dopo 90 giorni.
- **Il referente vede i contatti in un posto separato:** una pagina `contatti/` che si apre con un suo link personale (`contatti_token`, distinto da quello del riepilogo). Elenca solo le domande con l'email. Il riepilogo e il suo PDF, che salgono ai vertici della banca, non portano mai un indirizzo.
- **Nella console** l'email compare sulla scheda del contributo. Un pulsante registra che abbiamo risposto e cancella l'email.
- **I testi si riallineano.** Nessun «anonimo» assoluto dove non è più vero; nessun rimando a Parliamone per avere una risposta, perché ora la risposta passa dal modulo. Parliamone resta per chi preferisce scrivere a una persona.

## Vincoli

- L'email è un dato personale di un dipendente della banca. Il database la valida, la limita a 200 caratteri, la cancella a 90 giorni (al primo invio o alla prima lettura dei contatti dopo la scadenza) e la rende leggibile solo ai membri del progetto e a chi ha il link dei contatti.
- `_riepilogo` non legge mai la colonna. Il trigger di curatela permette di cambiare l'email solo per cancellarla.
- Il referente non riceve notifiche: l'avviso sul Mac resta solo nostro.
- Un campo solo, niente telefono: se serve, lo si chiede rispondendo.

## Scelte prese in sessione

- Dell'owner: il contatto lo vedono il team Adobe **e** il referente; per il referente, un posto separato che vede solo lui.
- Nostre, confermabili: cancellazione dopo la risposta o a 90 giorni; niente notifiche al referente; un campo solo; la pagina dei contatti non stampa in PDF e non porta la filigrana.
