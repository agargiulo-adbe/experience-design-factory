#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
#  compose.py — il motore di composizione dei deck .pptx sul template Adobe.
#
#  PERCHÉ ESISTE. Un deck Adobe non si disegna: si COMPONE riempiendo uno dei
#  166 layout approvati di Brand Center. Questo file porta la grammatica di
#  quella composizione — la scala tipografica, gli indici dei layout, e i
#  trattamenti — così che ogni deck, per ogni cliente, parta dallo stesso
#  motore invece di reinventarlo. Qui dentro NON c'è contenuto di nessun
#  cliente: solo la grammatica. Il contenuto vive nel builder del singolo deck.
#
#  I TRATTAMENTI, cioè i modi di dire una cosa su una slide:
#    cover · divisore · colonne · piena · affermazione · flusso
#    citazione ......... una frase sola, grande quanto la pagina (Large Quote)
#    meta_immagine ..... mezza o un terzo di pagina d'immagine
#    numeri ............ le cifre a 34pt: una slide di numeri in cui i numeri
#                        non sono grandi è una slide sprecata
#    obiezioni ......... le frasi del cliente come virgolettati, la risposta sotto
#    strati ............ un'architettura a strati, con l'innesto acceso
#    linea_del_tempo ... le date su un asse in scala, quando la sequenza informa
#    grafico_barre ..... barre grigie con un accento sul dato che conta
#    colonne_nel_tempo . una serie nel tempo con la SOGLIA disegnata
#    calcolo ........... l'aritmetica mostrata termine per termine
#    finestra .......... la finestra mobile di dato, a caselle
#
#  LA REGOLA CHE SI DIMENTICA PIÙ SPESSO. Prima di comporre si apre il catalogo
#  visivo dei 166 layout (`pnpm pptx:layouts` → docs/Factory/pptx-layouts/) e si
#  SCEGLIE la famiglia per ogni slide. Cinquantotto layout portano un'area
#  immagine, una citazione a tutta pagina o una struttura da caso studio: un
#  deck che esce «muro di testo» quasi sempre ha usato solo quelli a colonne.
#
#  Uso dal builder di un deck:
#      import sys, pathlib
#      sys.path.insert(0, str(RADICE / "scripts/pptx"))
#      from compose import *
#      apri(TEMPLATE)            # carica i 166 layout
#      ... i trattamenti ...
#      salva(USCITA)             # salva, rende il PDF e passa i controlli
# ─────────────────────────────────────────────────────────────────────────────
import pathlib
from pptx import Presentation
from pptx.util import Pt, Inches, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR
from pptx.oxml.ns import qn
from lxml import etree

# lo stato del documento in composizione: lo apre `apri()`, non il modulo
prs = None
LAYOUTS = []
IMG = None

A = "http://schemas.openxmlformats.org/drawingml/2006/main"
FONT = "Adobe Clean"
INK = RGBColor(0x1A, 0x1A, 0x1A)
INK2 = RGBColor(0x6E, 0x6E, 0x6E)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
RED = RGBColor(0xEB, 0x10, 0x00)

# la scala, dichiarata e non negoziabile
# La scala, dichiarata e non negoziabile. Alzata il 16 ott 2026 dopo aver guardato
# le 49 pagine rese tutte insieme: il contenuto stava nella metà alta e la metà
# bassa era bianca, cioè tipo piccolo su una pagina grande — il contrario di ciò
# che serve proiettato. Restano quattro corpi, tutti interi.
BIG, H, P, S = 26, 17, 13, 10

# layout usati, per indice nel template
LAY_COVER = 21      # Title Slide — fondo #EB1000
LAY_DIV = 53        # Section Divider Dark — fondo nero
LAY_END = 23        # Title Slide - Dark
LAY_FULL = 26       # White - Bottom Graphic — un blocco a tutta larghezza
LAY_META = 3        # Title and Content 1/2 Image — testo a sinistra, immagine a destra
LAY_TERZO = 28      # Title and Content 1/3 Image — colonna larga, immagine stretta
LAY_CITA = 93       # Large Quote — la frase occupa la pagina
LAY_COL3IMG = 34    # Three Columns - Image and Content — immagine sopra, testo sotto
LAY_2COL = 29       # Two Columns - Content
LAY_3COL = 30       # Three Columns - Content
LAY_4COL = 31       # Four Columns - Content



# ── impianto ────────────────────────────────────────────────────────────────
def bullet(p, on):
    """Accende o spegne il punto elenco rispettando l'ordine dello schema."""
    pPr = p._p.get_or_add_pPr()
    for t in ("a:buNone", "a:buChar", "a:buAutoNum"):
        for e in pPr.findall(qn(t)):
            pPr.remove(e)
    if on:
        return
    el = etree.SubElement(pPr, qn("a:buNone"))
    pPr.remove(el)
    coda = None
    for t in ("a:tabLst", "a:defRPr", "a:extLst"):
        trovato = pPr.find(qn(t))
        if trovato is not None:
            coda = trovato
            break
    if coda is None:
        pPr.append(el)
    else:
        coda.addprevious(el)
    pPr.set("marL", "0")
    pPr.set("indent", "0")


def riga(tf, testo, size, *, bold=False, color=INK, first=False,
         bul=False, before=0, after=4, spacing=1.18):
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    p.alignment = PP_ALIGN.LEFT
    p.line_spacing = spacing
    if before:
        p.space_before = Pt(before)
    p.space_after = Pt(after)
    bullet(p, bul)
    r = p.add_run()
    r.text = testo
    f = r.font
    f.name = FONT
    f.size = Pt(size)
    f.bold = bold
    f.color.rgb = color
    return p


def blocchi(tf, voci, *, scuro=False):
    """voci = lista di (tipo, testo). h=occhiello · p=corpo · b=elenco · s=fonte"""
    ink = WHITE if scuro else INK
    ink2 = RGBColor(0xBB, 0xBB, 0xBB) if scuro else INK2
    tf.word_wrap = True
    primo = True
    for tipo, testo in voci:
        if tipo == "h":
            riga(tf, testo, H, bold=True, color=ink, first=primo,
                 before=0 if primo else 12, after=3)
        elif tipo == "p":
            riga(tf, testo, P, color=ink, first=primo, after=6)
        elif tipo == "b":
            riga(tf, testo, P, color=ink, first=primo, bul=True, after=5)
        elif tipo == "big":
            riga(tf, testo, BIG, bold=True, color=ink, first=primo,
                 after=14, spacing=1.12)
        elif tipo == "s":
            # Una nota lunga NON è una nota: è un paragrafo vestito da didascalia,
            # e a 10pt proiettati (≈20px) non si legge. Sopra i 110 caratteri
            # scende al corpo, restando nell'inchiostro secondario perché il
            # ruolo — cautela, non argomento — resta quello.
            corpo = P if len(testo) > 110 else S
            riga(tf, testo, corpo, color=ink2, first=primo, before=12, after=0)
        elif tipo == "link":
            p = riga_fonti(tf, testo, first=primo)
            p.space_before = Pt(0 if primo else 2)
            p.space_after = Pt(6)
        primo = False


# Ereditate da «FSI Use Case Library.pptx», materiale industry di Adobe: la
# provenienza (file + numero di slide) sta in immagini/provenienza.json, come
# vuole la regola sulle slide ereditate. Niente marchi di terzi, niente
# repertorio generico: ogni immagine è il soggetto di cui parla la pagina.


def slide(lay):
    return prs.slides.add_slide(LAYOUTS[lay])


def immagine(s, idx_ph, nome):
    """Riempie un segnaposto immagine ritagliando al centro, perché il
    segnaposto ha le sue proporzioni e una foto schiacciata si vede."""
    from PIL import Image as _Im
    ph = s.placeholders[idx_ph]
    f = IMG / f"{nome}.jpg"
    w_ph, h_ph = ph.width, ph.height
    with _Im.open(f) as im:
        w_im, h_im = im.size
    r_ph, r_im = w_ph / h_ph, w_im / h_im
    pic = ph.insert_picture(str(f))
    # insert_picture ritaglia già al riempimento: si centra il ritaglio
    if r_im > r_ph:
        taglio = (1 - (r_ph / r_im)) / 2
        pic.crop_left = pic.crop_right = taglio
        pic.crop_top = pic.crop_bottom = 0
    else:
        taglio = (1 - (r_im / r_ph)) / 2
        pic.crop_top = pic.crop_bottom = taglio
        pic.crop_left = pic.crop_right = 0
    return pic


def immagine_contenuta(s, idx_ph, nome, margine=0.30):
    """Posa un'immagine SENZA ritagliarla, dentro il riquadro del segnaposto.

    `insert_picture` ritaglia sempre al riempimento: per una fotografia va
    bene, per una SCHERMATA no — taglia un grafico a metà e mostra mezza
    interfaccia. Qui si calcola la taglia che entra, si centra, e il
    segnaposto si rimuove perché ha già fatto il suo lavoro: dire dove.
    """
    from PIL import Image as _Im
    ph = s.placeholders[idx_ph]
    f = IMG / f"{nome}.jpg"
    L, T, W, H_ = ph.left, ph.top, ph.width, ph.height
    m = Inches(margine)
    Wd, Hd = W - 2 * m, H_ - 2 * m
    with _Im.open(f) as im:
        w_im, h_im = im.size
    scala = min(Wd / w_im, Hd / h_im)
    w, h = int(w_im * scala), int(h_im * scala)
    ph._element.getparent().remove(ph._element)
    return s.shapes.add_picture(str(f), L + (W - w) // 2, T + (H_ - h) // 2, w, h)


def meta_immagine(titolo_, voci, nome, fonte=None, *, terzo=False, schermata=False):
    """Mezza pagina di testo, mezza di immagine. È il layout che il template
    porta per questo e che il primo giro non aveva nemmeno aperto. Con
    `terzo=True` l'immagine si stringe a un terzo: serve quando il contenuto
    non entra in mezza pagina, e tagliarlo ancora lo svuoterebbe."""
    s = slide(LAY_TERZO if terzo else LAY_META)
    titolo(s, titolo_)
    blocchi(s.placeholders[1].text_frame, voci)
    if schermata:
        immagine_contenuta(s, 10, nome)
    else:
        immagine(s, 10, nome)
    pulisci(s, {0, 1, 10})
    if fonte:
        nota_fonte(s, fonte)
    return s


def numeri(titolo_, voci, fonte=None):
    """Una pagina di cifre: il numero grande quanto un titolo, l'etichetta
    sotto. Una slide di numeri in cui i numeri non sono grandi è una slide
    sprecata — e questa lo era, con le cifre allo stesso corpo dei cappelli."""
    lay = {2: LAY_2COL, 3: LAY_3COL, 4: LAY_4COL}[len(voci)]
    s = slide(lay)
    titolo(s, titolo_)
    idx = {LAY_2COL: [1, 13], LAY_3COL: [1, 13, 14], LAY_4COL: [1, 13, 14, 15]}[lay]
    for i, (cifra, etichetta, testo) in zip(idx, voci):
        tf = s.placeholders[i].text_frame
        tf.word_wrap = True
        riga(tf, cifra, 34, bold=True, color=INK, first=True, spacing=1.0, after=2)
        riga(tf, etichetta, S, bold=True, color=INK2, after=9)
        riga(tf, testo, P, color=INK, after=0)
    pulisci(s, {0, *idx})
    centra(s, idx)
    if fonte:
        nota_fonte(s, fonte)
    return s


def linea_del_tempo(titolo_, tappe, *, da, a, coda=None, fonte=None):
    """Le date su un asse, in scala. Qui la sequenza porta informazione — che
    cosa è già in vigore e che cosa arriva — e un elenco in due colonne quella
    informazione la nasconde. Le etichette si alternano sopra e sotto l'asse,
    se no a due date vicine i testi si siedono uno sull'altro."""
    from datetime import date as _d
    s = slide(LAY_FULL)
    titolo(s, titolo_)
    pulisci(s, {0})
    x0, span, y = 0.90, 11.80, 3.55
    CODA_Y = 5.18
    giorni = (a - da).days
    # l'asse
    asse = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x0), Inches(y),
                              Inches(span), Pt(1.2))
    asse.fill.solid(); asse.fill.fore_color.rgb = RGBColor(0xCC, 0xCC, 0xCC)
    asse.line.fill.background(); asse.shadow.inherit = False
    for k, (quando, etichetta, testo, acceso) in enumerate(tappe):
        # UNA TAPPA PUÒ SAPERE IL MESE E NON IL GIORNO, e allora deve poterlo
        # dire. `quando` accetta anche una coppia (data, «come si scrive»): la
        # data serve solo a collocare il segno sull'asse, l'etichetta è quella
        # che si legge. Senza questa via d'uscita si finisce a scegliere un
        # giorno a caso per far girare lo strftime — ed è successo il 20 ott
        # 2026, con un «15.06.2026» inventato in un deck che per il resto
        # porta solo date verificate sui ticket. Una precisione che non si ha
        # non si stampa.
        mostra = None
        if isinstance(quando, tuple):
            quando, mostra = quando
        fx = x0 + span * ((quando - da).days / giorni)
        # il segno sull'asse
        d = 0.17 if acceso else 0.13
        seg = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(fx - d / 2),
                                 Inches(y - d / 2 + 0.008), Inches(d), Inches(d))
        seg.fill.solid(); seg.fill.fore_color.rgb = RED if acceso else INK
        seg.line.fill.background(); seg.shadow.inherit = False
        sopra = k % 2 == 0
        larg = 2.70
        bx = min(max(fx - larg / 2, 0.67), 13.33 - 0.67 - larg)
        by = y - 1.62 if sopra else y + 0.34
        # L'ALTEZZA DELLA SCHEDA SI RICAVA, NON SI SCRIVE A MANO. Una scheda
        # sotto l'asse alta 1,50in finisce a 5,39in, cioè DENTRO la coda che
        # parte a 5,18in: oggi non si vede perché il testo è più corto della
        # scatola, ma è una collisione che aspetta una riga in più. Il gate
        # non la coglieva — la soglia di «E» è al 25% dell'area e qui siamo
        # al 14%. Si chiude alla fonte: la scatola arriva fin dove può.
        alt = 1.50 if sopra else max(0.60, (CODA_Y - 0.12) - by if coda else 1.50)
        tb = s.shapes.add_textbox(Inches(bx), Inches(by), Inches(larg), Inches(alt))
        tf = tb.text_frame; tf.word_wrap = True
        riga(tf, mostra or quando.strftime("%d.%m.%Y").lstrip("0"), S, bold=True,
             color=RED if acceso else INK2, first=True, after=2)
        riga(tf, etichetta, P, bold=True, color=INK, after=2)
        riga(tf, testo, S, color=INK2, after=0)
    if coda:
        # la coda si ferma sopra la riga delle fonti, che vive a 6,42in: un
        # riquadro che la scavalca è il rilievo «E» del gate
        tb = s.shapes.add_textbox(Inches(0.90), Inches(CODA_Y), Inches(11.80), Inches(1.10))
        tb.text_frame.word_wrap = True
        blocchi(tb.text_frame, coda)
    if fonte:
        nota_fonte(s, fonte)
    return s


def obiezioni(titolo_, voci, fonte=None):
    """Tre obiezioni sono tre frasi dette da qualcuno: si trattano come
    virgolettati, non come paragrafi. La voce del cliente grande, la nostra
    risposta sotto, in tondo."""
    s = slide(LAY_3COL)
    titolo(s, titolo_)
    for i, (dove, frase, risposta) in zip([1, 13, 14], voci):
        tf = s.placeholders[i].text_frame
        tf.word_wrap = True
        riga(tf, dove, S, bold=True, color=INK2, first=True, after=10)
        riga(tf, f"«{frase}»", 22, bold=True, color=INK, spacing=1.12, after=12)
        riga(tf, risposta, P, color=INK, after=0)
    pulisci(s, {0, 1, 13, 14})
    if fonte:
        accorcia(s, [1, 13, 14])
        nota_fonte(s, fonte)
    return s


def citazione(frase, nota=None):
    """La frase da sola, grande, su tutta la pagina. Il template ha un layout
    apposta: una pagina che dice una cosa sola si ricorda.

    LA NOTA STA FUORI DAL SEGNAPOSTO, e non per gusto. Dentro il segnaposto di
    «Large Quote» finisce sotto l'autofit del layout: il 16 ott 2026 è uscita
    compressa e rimpicciolita al punto che le parole si toccavano, e nel PDF si
    leggeva «€481,45124» invece di «€481,451.24». Una casella di testo normale
    non ha quel trattamento, e i due motori la rendono uguale.
    """
    s = slide(LAY_CITA)
    tf = s.placeholders[15].text_frame
    tf.word_wrap = True
    riga(tf, frase, 34, bold=True, color=INK, first=True, spacing=1.14, after=0)
    pulisci(s, {15})
    centra(s, [15], alto=2.60)
    if nota:
        # LA NOTA VA SOTTO LA FRASE, non a un'ordinata scritta a mano. Con
        # `centra(alto=2.60)` la scatola della citazione finisce a 5,16in e il
        # 5,10in di prima la faceva accavallare: invisibile finché la frase sta
        # in tre righe, collisione alla quarta. Si legge dove finisce davvero.
        ph = s.placeholders[15]
        giu = Emu(ph.top + ph.height).inches + 0.14
        tb = s.shapes.add_textbox(Inches(0.67), Inches(giu), Inches(11.60),
                                  Inches(0.90))
        tb.text_frame.word_wrap = True
        riga(tb.text_frame, nota, P, color=INK2, first=True, after=0,
             spacing=1.25)
    return s


def titolo(s, testo):
    ph = s.placeholders[0]
    ph.text_frame.word_wrap = True
    p = ph.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    r = p.add_run()
    r.text = testo
    r.font.name = FONT
    return s


def pulisci(s, tenuti):
    """Toglie i segnaposto non riempiti: un segnaposto vuoto resta un invito."""
    for ph in list(s.placeholders):
        if ph.placeholder_format.idx not in tenuti:
            ph._element.getparent().remove(ph._element)


def link(run, url):
    """Rende cliccabile un run. Una fonte senza link chiede di fidarsi."""
    if url:
        run.hyperlink.address = url
    return run


def riga_fonti(tf, voci, *, first=True):
    """voci = lista di (etichetta, url|None). Le etichette con url sono cliccabili."""
    p = tf.paragraphs[0] if first else tf.add_paragraph()
    p.alignment = PP_ALIGN.LEFT
    p.line_spacing = 1.2
    p.space_after = Pt(0)
    bullet(p, False)
    for i, (testo, url) in enumerate(voci):
        if i:
            sep = p.add_run()
            sep.text = "  ·  "
            sep.font.name, sep.font.size = FONT, Pt(S)
            sep.font.color.rgb = INK2
        r = p.add_run()
        r.text = testo
        r.font.name, r.font.size = FONT, Pt(S)
        r.font.color.rgb = INK2
        link(r, url)
    return p


def nota_fonte(s, testo):
    """Riga di fonte sotto il contenuto.

    Sta a 6,42in e non più in fondo: la banda sotto i 6,9in è del marchio Adobe
    e della riga di copyright del template, e scriverci sopra li copre. Il gate
    non lo vede — misura le scatole, non che cosa finisce sopra che cosa — e si
    è visto solo rendendo le pagine.
    """
    tb = s.shapes.add_textbox(Inches(0.67), Inches(6.42), Inches(12.0), Inches(0.46))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    if isinstance(testo, str):
        riga(tf, testo, S, color=INK2, first=True, after=0)
    else:
        riga_fonti(tf, testo)


def accorcia(s, idx):
    """Alza il fondo dei segnaposto di contenuto per liberare la riga di fonte.

    Scrive la geometria INTERA presa dal layout: un segnaposto eredita posizione
    e dimensione, e scrivere la sola altezza lascia un xfrm senza offset. Il file
    resta valido, il gate non se ne accorge, e la slide si rende vuota.
    """
    geo = {ph.placeholder_format.idx: (ph.left, ph.top, ph.width)
           for ph in s.slide_layout.placeholders}
    for i in idx:
        try:
            ph = s.placeholders[i]
        except KeyError:
            continue
        l, t, w = geo.get(i, (ph.left, ph.top, ph.width))
        ph.left, ph.top, ph.width, ph.height = l, t, w, Inches(4.80)


def centra(s, idx, *, alto=3.40, ancora=None):
    """Porta il contenuto nella fascia centrale della pagina.

    PIÙ COLONNE → SI ANCORA IN ALTO, E NON È UN DETTAGLIO. Con l'ancora al
    centro ogni colonna si centra dentro la PROPRIA scatola: due colonne di
    lunghezza diversa partono allora da due altezze diverse, e su una slide
    di cifre si vedono quattro numeri su quattro linee di base. È l'equivalente
    verticale del check «m» dei deck HTML — i blocchi che condividono il bordo
    — e qui non lo misura nessun gate: si vede solo guardando la pagina, ed è
    così che è uscito il 20 ott 2026. Con una colonna sola il centro resta la
    scelta giusta, e resta il default.

    PERCHÉ NON BASTA L'ANCORAGGIO. Mettere `anchor="ctr"` sul segnaposto è
    corretto e PowerPoint lo rispetta — ma **LibreOffice lo ignora sui
    segnaposto ereditati** (lo onora sulle caselle di testo normali: provato il
    16 ott 2026 affiancandone una). Siccome il giro di qualità si guarda nel
    PDF reso da LibreOffice, affidarsi all'ancora vorrebbe dire rivedere una
    pagina diversa da quella che apre il cliente — e una pagina che non si può
    rivedere non si può garantire.

    Quindi si fa l'unica cosa che i due motori leggono uguale: si SPOSTA la
    scatola. Alta `alto` pollici e centrata nella fascia utile (1,46 → 6,26),
    il contenuto cade nella parte centrale sia allineato in alto sia centrato,
    e i due render convergono. L'ancora resta, perché in PowerPoint migliora
    ancora un po'.
    """
    banda_da, banda_a = 1.46, 6.26
    anc = ancora or (MSO_ANCHOR.TOP if len(idx) > 1 else MSO_ANCHOR.MIDDLE)
    # LA SCATOLA NON SI SPOSTA: CAMBIA SOLO L'ANCORA. Spingere giù il blocco
    # per riempire la striscia vuota in fondo è la prima idea e va rifiutata.
    # Misurato il 20 ott 2026: uno scostamento di alto*0,17 azzera i rilievi
    # «V» del deck su cui lo si tara, e manda il testo di un ALTRO deck —
    # dove il contenuto già sborda dalla scatola — dentro la fascia del piè
    # di pagina, che è un HARD. Un SOFT di riempimento non si compra mai con
    # un HARD di marchio. Ancorare in alto può solo ALZARE il contenuto,
    # quindi è una modifica che nessun deck esistente può pagare.
    top = banda_da + ((banda_a - banda_da) - alto) / 2
    geo = {ph.placeholder_format.idx: (ph.left, ph.width)
           for ph in s.slide_layout.placeholders}
    for i in idx:
        try:
            ph = s.placeholders[i]
        except KeyError:
            continue
        l, w = geo.get(i, (ph.left, ph.width))
        # la geometria si scrive INTERA: un xfrm senza offset rende la slide
        # vuota e il gate non se ne accorge
        ph.left, ph.top, ph.width, ph.height = l, Inches(top), w, Inches(alto)
        ph.text_frame.vertical_anchor = anc


def cover(titolo_, sottotitolo):
    s = slide(LAY_COVER)
    titolo(s, titolo_)
    tf = s.placeholders[1].text_frame
    tf.word_wrap = True
    primo = True
    for t in sottotitolo:
        riga(tf, t, H, color=WHITE, first=primo, after=4)
        primo = False
    pulisci(s, {0, 1})
    return s


def divisore(testo):
    s = slide(LAY_DIV)
    titolo(s, testo)
    pulisci(s, {0})
    return s


def piena(titolo_, voci, fonte=None):
    """Una sola affermazione a tutta larghezza. Solo per frasi brevi: a 11pt la
    riga da 12 pollici arriva a 150 caratteri e non si legge."""
    s = slide(LAY_FULL)
    titolo(s, titolo_)
    blocchi(s.placeholders[1].text_frame, voci)
    pulisci(s, {0, 1})
    if fonte:
        accorcia(s, [1])
        nota_fonte(s, fonte)
    return s


def colonne(lay, titolo_, cols, fonte=None):
    s = slide(lay)
    titolo(s, titolo_)
    idx = {LAY_2COL: [1, 13], LAY_3COL: [1, 13, 14], LAY_4COL: [1, 13, 14, 15]}[lay]
    for i, voci in zip(idx, cols):
        blocchi(s.placeholders[i].text_frame, voci)
    pulisci(s, {0, *idx})
    centra(s, idx)
    if fonte:
        nota_fonte(s, fonte)
    return s


def affermazione(titolo_, frase, dettaglio, *, sotto=None, fonte=None):
    """Affermazione a sinistra, dettaglio a destra: la misura resta leggibile e
    la slide non resta vuota per due terzi. `sotto` scende sotto l'affermazione,
    perché una colonna carica e una vuota sono una pagina sbilanciata."""
    prima = [("big", frase)] + (sotto or [])
    return colonne(LAY_2COL, titolo_, [prima, dettaglio], fonte=fonte)


# ── grafici e diagrammi ─────────────────────────────────────────────────────
# Regola di marchio: grafici in prevalenza GRIGI, con l'accento rosso solo sul
# dato che porta il messaggio. Mai due serie colorate che competono.
GRIGI = [RGBColor(0x6E, 0x6E, 0x6E), RGBColor(0xCC, 0xCC, 0xCC),
         RGBColor(0x1A, 0x1A, 0x1A), RGBColor(0x99, 0x99, 0x99)]


def grafico_barre(s, categorie, valori, *, evidenzia=None, x=0.67, y=1.6,
                  w=7.4, h=4.5, etichette=None):
    """Barre orizzontali: l'etichetta lunga si legge, e l'ordine è quello dato."""
    from pptx.chart.data import CategoryChartData
    from pptx.enum.chart import XL_CHART_TYPE, XL_LABEL_POSITION
    dati = CategoryChartData()
    dati.categories = list(reversed(categorie))
    dati.add_series("v", list(reversed(valori)))
    gf = s.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Inches(x), Inches(y),
                            Inches(w), Inches(h), dati)
    ch = gf.chart
    ch.has_legend = False
    ch.has_title = False
    pl = ch.plots[0]
    pl.gap_width = 60
    pl.vary_by_categories = False
    serie = pl.series[0]
    for i, punto in enumerate(serie.points):
        idx = len(categorie) - 1 - i
        punto.format.fill.solid()
        punto.format.fill.fore_color.rgb = RED if idx == evidenzia else GRIGI[0]
        punto.format.line.fill.background()
    pl.has_data_labels = True
    dl = pl.data_labels
    dl.position = XL_LABEL_POSITION.OUTSIDE_END
    dl.font.size, dl.font.name, dl.font.bold = Pt(P), FONT, True
    dl.font.color.rgb = INK
    if etichette:
        for i, punto in enumerate(serie.points):
            idx = len(categorie) - 1 - i
            tf = punto.data_label.text_frame
            tf.text = etichette[idx]
            r = tf.paragraphs[0].runs[0]
            r.font.size, r.font.name, r.font.bold = Pt(P), FONT, True
            r.font.color.rgb = RED if idx == evidenzia else INK
    va = ch.value_axis
    va.visible = False
    va.has_major_gridlines = False
    ca = ch.category_axis
    ca.has_major_gridlines = False
    ca.format.line.color.rgb = RGBColor(0xDD, 0xDD, 0xDD)
    ca.tick_labels.font.size, ca.tick_labels.font.name = Pt(P), FONT
    ca.tick_labels.font.color.rgb = INK
    return gf


def box(s, x, y, w, h, *, fill=None, bordo=RGBColor(0xDD, 0xDD, 0xDD)):
    """Un rettangolo. Il template disegna con rettangoli, linee e cerchi."""
    sh = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y),
                            Inches(w), Inches(h))
    if fill is None:
        sh.fill.background()
    else:
        sh.fill.solid()
        sh.fill.fore_color.rgb = fill
    if bordo is None:
        sh.line.fill.background()
    else:
        sh.line.color.rgb = bordo
        sh.line.width = Pt(1)
    sh.shadow.inherit = False
    sh.text_frame.word_wrap = True
    sh.text_frame.vertical_anchor = MSO_ANCHOR.TOP
    sh.text_frame.margin_left = sh.text_frame.margin_right = Inches(0.12)
    sh.text_frame.margin_top = sh.text_frame.margin_bottom = Inches(0.10)
    return sh


def passo(s, x, y, w, h, occhiello, testo, *, acceso=False):
    """Un riquadro del diagramma: occhiello sopra, una riga di spiegazione sotto."""
    sh = box(s, x, y, w, h, fill=RED if acceso else None,
             bordo=None if acceso else RGBColor(0xDD, 0xDD, 0xDD))
    tf = sh.text_frame
    ink = WHITE if acceso else INK
    riga(tf, occhiello, P, bold=True, color=ink, first=True, after=3, spacing=1.1)
    riga(tf, testo, S, color=WHITE if acceso else INK2, after=0, spacing=1.2)
    return sh


def congiunzione(s, x, y, w=0.30):
    """Il filetto che lega due riquadri. Grigio: non deve rubare lo sguardo."""
    sh = s.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                            Inches(x), Inches(y), Inches(w), Pt(1.5))
    sh.fill.solid()
    sh.fill.fore_color.rgb = RGBColor(0xCC, 0xCC, 0xCC)
    sh.line.fill.background()
    sh.shadow.inherit = False
    return sh


def colonne_nel_tempo(titolo_, serie, *, soglia=None, nota_soglia=None,
                      nota=None, fonte=None, y=1.95, alt=2.95):
    """Una serie nel tempo, a colonne, con la SOGLIA disegnata come linea.

    PERCHÉ DISEGNATA E NON UN GRAFICO NATIVO. Il racconto di una licenza è
    sempre «una serie contro un limite», e in un grafico di PowerPoint la
    linea di soglia non si può posare dove serve: l'area di tracciato ha
    margini che l'API non espone, quindi la riga finisce qualche decimo
    sopra o sotto il valore vero. Qui ogni pixel è calcolato, la soglia sta
    esattamente al suo posto, e le colonne sopra il limite si tingono di
    rosso da sole. È la stessa famiglia di `strati` e `linea_del_tempo`:
    il template disegna con rettangoli e linee.

    serie = [(etichetta, valore), ...] — etichetta vuota = tacca senza testo
    """
    s = slide(LAY_FULL)
    titolo(s, titolo_)
    pulisci(s, {0})
    x0, span = 0.67, 12.0
    n = len(serie)
    gap = 0.06 if n > 15 else 0.12
    larg = (span - (n - 1) * gap) / n
    vmax = max(v for _, v in serie)
    if soglia:
        vmax = max(vmax, soglia)
    vmax *= 1.12                                   # aria sopra la colonna più alta
    base = y + alt

    def h_di(v):
        return max(0.02, alt * v / vmax)

    for i, (et, v) in enumerate(serie):
        xi = x0 + i * (larg + gap)
        h = h_di(v)
        sopra = soglia is not None and v > soglia
        c = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(xi),
                               Inches(base - h), Inches(larg), Inches(h))
        c.fill.solid()
        c.fill.fore_color.rgb = RED if sopra else RGBColor(0xCC, 0xCC, 0xCC)
        c.line.fill.background()
        c.shadow.inherit = False
        if et:
            # a bandiera sinistra, ancorata alla colonna: il template
            # allinea a sinistra e il gate lo misura. Centrare le tacche
            # sarebbe prassi di grafico, ma qui sono caselle di testo vere.
            tb = s.shapes.add_textbox(Inches(xi), Inches(base + 0.06),
                                      Inches(larg + 0.46), Inches(0.26))
            tf = tb.text_frame
            tf.word_wrap = False
            tf.margin_left = tf.margin_right = 0
            tf.margin_top = tf.margin_bottom = 0
            riga(tf, et, S, color=INK2, first=True, after=0)

    # l'asse dei mesi
    asse = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x0), Inches(base),
                              Inches(span), Pt(1))
    asse.fill.solid(); asse.fill.fore_color.rgb = RGBColor(0xDD, 0xDD, 0xDD)
    asse.line.fill.background(); asse.shadow.inherit = False

    # LA SOGLIA. Sta sopra le colonne, e porta la sua etichetta a sinistra
    # perché a destra finirebbe fuori dalla safe-area.
    if soglia is not None:
        ys = base - h_di(soglia)
        ln = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x0), Inches(ys),
                                Inches(span), Pt(1.6))
        ln.fill.solid(); ln.fill.fore_color.rgb = INK
        ln.line.fill.background(); ln.shadow.inherit = False
        if nota_soglia:
            tb = s.shapes.add_textbox(Inches(x0), Inches(ys - 0.33),
                                      Inches(span), Inches(0.28))
            tf = tb.text_frame
            tf.word_wrap = False
            tf.margin_left = tf.margin_right = 0
            tf.margin_top = tf.margin_bottom = 0
            riga(tf, nota_soglia, S, bold=True, color=INK, first=True, after=0)

    if nota:
        tb = s.shapes.add_textbox(Inches(x0), Inches(base + 0.46),
                                  Inches(span), Inches(1.10))
        tb.text_frame.word_wrap = True
        blocchi(tb.text_frame, nota)
    if fonte:
        nota_fonte(s, fonte)
    return s


def calcolo(titolo_, passi, *, nota=None, fonte=None):
    """L'aritmetica mostrata, non affermata.

    Un importo che compare già fatto si prende per buono o si rifiuta; un
    importo che si vede nascere si verifica. Ogni riquadro è un termine,
    fra i riquadri sta l'operatore, e l'ultimo — il risultato — è acceso.

    passi = [(termine, didascalia), ...] con gli operatori come termini
            di una sola riga: ("−", ""), ("×", ""), ("=", "")
    """
    s = slide(LAY_FULL)
    titolo(s, titolo_)
    pulisci(s, {0})
    x0, span, y, alt = 0.67, 12.0, 2.30, 1.55
    # gli operatori sono stretti, i termini larghi: le larghezze si derivano
    op = [i for i, (t, _) in enumerate(passi) if t in "+−-×÷=*/"]
    n_op, n_t = len(op), len(passi) - len(op)
    w_op, gap = 0.46, 0.16
    w_t = (span - n_op * w_op - (len(passi) - 1) * gap) / n_t
    x = x0
    for i, (termine, didascalia) in enumerate(passi):
        if i in op:
            # LA CASELLA SI STRINGE SUL GLIFO invece di centrarlo dentro una
            # larga. Un operatore DEVE stare in mezzo ai due termini, ma il
            # template allinea a bandiera sinistra e il gate misura anche
            # questo: una casella larga quanto il segno risolve l'uno senza
            # violare l'altro, e toglie sei rilievi di rumore.
            glifo = 0.26
            tb = s.shapes.add_textbox(Inches(x + (w_op - glifo) / 2),
                                      Inches(y + alt / 2 - 0.26),
                                      Inches(glifo), Inches(0.52))
            tf = tb.text_frame
            tf.word_wrap = False
            tf.margin_left = tf.margin_right = 0
            riga(tf, termine, 22, bold=True, color=INK2, first=True, after=0)
            x += w_op + gap
            continue
        ultimo = i == len(passi) - 1
        box(s, x, y, w_t, alt, fill=RED if ultimo else None,
            bordo=None if ultimo else RGBColor(0xDD, 0xDD, 0xDD))
        tb = s.shapes.add_textbox(Inches(x + 0.14), Inches(y + 0.22),
                                  Inches(w_t - 0.28), Inches(alt - 0.34))
        tf = tb.text_frame
        tf.word_wrap = True
        ink = WHITE if ultimo else INK
        riga(tf, termine, 22, bold=True, color=ink, first=True, after=4,
             spacing=1.08)
        if didascalia:
            riga(tf, didascalia, S, color=WHITE if ultimo else INK2, after=0,
                 spacing=1.2)
        x += w_t + gap
    if nota:
        tb = s.shapes.add_textbox(Inches(x0), Inches(y + alt + 0.44),
                                  Inches(span), Inches(1.30))
        tb.text_frame.word_wrap = True
        blocchi(tb.text_frame, nota)
    if fonte:
        nota_fonte(s, fonte)
    return s


def finestra(titolo_, righe_, *, celle=16, estremi=("← il dato meno recente",
                                                 "oggi →"),
             nota=None, fonte=None):
    """La finestra mobile, disegnata: quante caselle di dato restano dentro.

    Serve a spiegare in un colpo d'occhio perché accorciare la finestra
    abbassa il numero — la cosa che in prosa non arriva mai.

    righe_ = [(etichetta, quante_piene, acceso), ...]

    LE ETICHETTE DELL'ASSE SONO UN PARAMETRO, non una costante. Scritte dentro
    il motore erano in italiano, e il 20 ott 2026 sono uscite così in fondo a
    una pagina di un deck interno **in inglese**: il gate non legge la lingua,
    e a quel corpo non le si nota rileggendo. Un motore condiviso da deck in
    più lingue non può portare parole proprie.
    """
    s = slide(LAY_FULL)
    titolo(s, titolo_)
    pulisci(s, {0})
    x0, span = 2.95, 9.70
    gap, alt = 0.08, 0.62
    larg = (span - (celle - 1) * gap) / celle
    y = 2.25
    for et, piene, acceso in righe_:
        tb = s.shapes.add_textbox(Inches(0.67), Inches(y + 0.12),
                                  Inches(2.10), Inches(0.46))
        tb.text_frame.word_wrap = True
        riga(tb.text_frame, et, P, bold=True, color=INK, first=True, after=0)
        for k in range(celle):
            dentro = k >= celle - piene
            c = s.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                   Inches(x0 + k * (larg + gap)), Inches(y),
                                   Inches(larg), Inches(alt))
            c.fill.solid()
            c.fill.fore_color.rgb = ((RED if acceso else RGBColor(0x6E, 0x6E, 0x6E))
                                     if dentro else RGBColor(0xEE, 0xEE, 0xEE))
            c.line.fill.background()
            c.shadow.inherit = False
        y += alt + 0.34
    # le due estremità si etichettano separate: una stringa sola con gli spazi
    # dentro si allinea dove capita, e a 10pt il divario non si vede
    # due MEZZI campi, non due fasce a tutta larghezza una sopra l'altra:
    # sovrapposte danno il rilievo «E» e non si capisce se è vero
    for testo, ax, allin in ((estremi[0], x0, PP_ALIGN.LEFT),
                             (estremi[1], x0 + span / 2, PP_ALIGN.RIGHT)):
        tb = s.shapes.add_textbox(Inches(ax), Inches(y - 0.20),
                                  Inches(span / 2), Inches(0.30))
        tf = tb.text_frame
        tf.word_wrap = False
        tf.margin_left = tf.margin_right = 0
        par = riga(tf, testo, S, color=INK2, first=True, after=0)
        par.alignment = allin
    if nota:
        tb = s.shapes.add_textbox(Inches(0.67), Inches(y + 0.30),
                                  Inches(12.0), Inches(1.30))
        tb.text_frame.word_wrap = True
        blocchi(tb.text_frame, nota)
    if fonte:
        nota_fonte(s, fonte)
    return s


def flusso(titolo_, passi, *, nota=None, fonte=None):
    """Diagramma a catena: N riquadri in riga, legati, l'ultimo acceso."""
    s = slide(LAY_FULL)
    titolo(s, titolo_)
    pulisci(s, {0})
    n = len(passi)
    # la larghezza si DERIVA dallo spazio disponibile: fissarla manda i riquadri
    # fuori foglio appena i passi diventano cinque, ed è un HARD del gate.
    SPAN, x0 = 12.0, 0.67
    gap = 0.30 if n <= 4 else 0.22
    larg = (SPAN - (n - 1) * gap) / n
    y, alt = 2.10, 1.70 if n >= 5 else 1.60
    for i, (occh, txt) in enumerate(passi):
        xi = x0 + i * (larg + gap)
        passo(s, xi, y, larg, alt, occh, txt, acceso=(i == n - 1))
        if i < n - 1:
            congiunzione(s, xi + larg, y + alt / 2, gap)
    if nota:
        tb = s.shapes.add_textbox(Inches(0.67), Inches(4.20), Inches(12.0), Inches(1.6))
        tb.text_frame.word_wrap = True
        riga(tb.text_frame, nota, H, color=INK, first=True, after=0, spacing=1.25)
    if fonte:
        nota_fonte(s, fonte)
    return s


def strati(titolo_, piani, *, innesto, nota=None, fonte=None):
    """Un'architettura a strati si disegna a strati. Dal basso in alto, con la
    fascia dell'innesto accesa: è l'unico punto che ci riguarda, e vederlo
    toglie l'obiezione prima che venga formulata."""
    s = slide(LAY_FULL)
    titolo(s, titolo_)
    pulisci(s, {0})
    x, larg = 0.67, 7.40
    alt, gap = 0.74, 0.14
    y = 1.58
    for nome, dettaglio in piani:
        acceso = nome == innesto
        box(s, x, y, larg, alt,
            fill=RED if acceso else None,
            bordo=None if acceso else RGBColor(0xDD, 0xDD, 0xDD))
        tb = s.shapes.add_textbox(Inches(x + 0.26), Inches(y + 0.09),
                                  Inches(larg - 0.52), Inches(alt - 0.18))
        tf = tb.text_frame
        tf.word_wrap = True
        ink = WHITE if acceso else INK
        riga(tf, nome, P, bold=True, color=ink, first=True, after=1)
        riga(tf, dettaglio, S, color=WHITE if acceso else INK2, after=0)
        y += alt + gap
    # la colonna di destra dice perché la pila conta
    tb = s.shapes.add_textbox(Inches(8.60), Inches(1.58), Inches(4.07), Inches(4.60))
    tb.text_frame.word_wrap = True
    blocchi(tb.text_frame, nota or [])
    if fonte:
        nota_fonte(s, fonte)
    return s


def tabella(titolo_, righe, *, pesi=None, rilievo=None, accento=None,
            barrate=None, allinea=None, coda=None, fonte=None, corpo=None):
    """Una griglia di numeri, composta con le primitive invece che con una
    tabella nativa.

    PERCHÉ NON LA TABELLA DI POWERPOINT. Una `graphicFrame` eredita lo stile di
    tabella del tema: porta caratteri che non sono quelli del template, e il
    gate non riesce a leggerne i run — quindi un corpo fuori scala lì dentro
    passerebbe invisibile. Con rettangoli e caselle il controllo è completo.

    L'ALTEZZA DELLE RIGHE SI DERIVA dallo spazio disponibile, non si fissa: una
    tabella di nove righe a 0,40in lascia mezza pagina bianca, ed è il rilievo
    «V» del gate. Qui riempie la fascia fra il titolo e la riga delle fonti.

    pesi      proporzioni delle colonne (default: prima doppia, resto uguali)
    barrate   insieme di (riga, colonna) da mostrare barrate: la voce c'era e
              viene tolta — un trattino direbbe «non c'e», che e un'altra cosa
    accento   la cella da mettere in rosso, come (riga, colonna), OPPURE un
              insieme di celle. Il rosso e informazione, non decorazione:
              marca UNA cosa sola per tabella — un totale, oppure il blocco
              di voci che quel totale compongono. Due rossi diversi nella
              stessa tabella e chi guarda non sa quale leggere.
    corpo     corpo del testo nelle celle, in punti. Default: quello del
              motore. Si alza solo quando la tabella ha POCHE colonne e poche
              righe, perche c'e spazio: non e una scorciatoia per far entrare
              il testo, che resta vietata dal contratto di leggibilita.
    """
    s = slide(LAY_FULL)
    titolo(s, titolo_)
    pulisci(s, {0})
    rilievo, barrate = set(rilievo or ()), set(barrate or ())
    # `accento` nasce come singola cella e resta compatibile: una tupla di due
    # interi e una cella, qualunque altro iterabile e un insieme di celle.
    if accento is None:
        accenti = set()
    elif (isinstance(accento, tuple) and len(accento) == 2
          and all(isinstance(v, int) for v in accento)):
        accenti = {accento}
    else:
        accenti = set(accento)
    corpo = corpo or P
    n_col = len(righe[0])
    pesi = pesi or [2.0] + [1.0] * (n_col - 1)
    allinea = allinea or ["l"] + ["r"] * (n_col - 1)

    X0, SPAN = 0.67, 12.0
    tot = sum(pesi)
    larghezze = [SPAN * w / tot for w in pesi]

    alto = 6.26 - 1.58 - (0.60 if coda else 0.0)
    # Il tetto si alza quando le righe sono poche: una tabella di tre righe a
    # 0,62in lascia due terzi di pagina bianchi, ed è il rilievo «V» del gate.
    tetto = 0.62 if len(righe) > 5 else 0.92
    h_riga = min(tetto, alto / len(righe))
    y = 1.58
    for ri, riga_ in enumerate(righe):
        testata = ri == 0
        x = X0
        for ci, cella in enumerate(riga_):
            w = larghezze[ci]
            fill = (RGBColor(0xE6, 0xE6, 0xE6) if testata
                    else RGBColor(0xF4, 0xF4, 0xF4) if ri in rilievo else None)
            box(s, x, y, w, h_riga, fill=fill)
            tb = s.shapes.add_textbox(Inches(x + 0.16), Inches(y),
                                      Inches(w - 0.32), Inches(h_riga))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.vertical_anchor = MSO_ANCHOR.MIDDLE
            tf.margin_left = tf.margin_right = 0
            tf.margin_top = tf.margin_bottom = 0
            ink = INK
            bold = testata or ri in rilievo
            if (ri, ci) in accenti:
                ink, bold = RED, True
            if (ri, ci) in barrate:
                ink = INK2
            par = riga(tf, cella or "", S if testata else corpo, bold=bold,
                       color=ink, first=True, after=0, spacing=1.12)
            par.alignment = PP_ALIGN.RIGHT if allinea[ci] == "r" else PP_ALIGN.LEFT
            if (ri, ci) in barrate:
                for r_ in par.runs:
                    r_.font._rPr.set("strike", "sngStrike")
            x += w
        y += h_riga

    if coda:
        tb = s.shapes.add_textbox(Inches(X0), Inches(y + 0.14), Inches(SPAN),
                                  Inches(0.60))
        tb.text_frame.word_wrap = True
        riga(tb.text_frame, coda, P, color=INK, first=True, after=0, spacing=1.22)
    if fonte:
        nota_fonte(s, fonte)
    return s


# ── apertura e chiusura ─────────────────────────────────────────────────────
def apri(template, immagini=None):
    """Carica il template approvato e i suoi 166 layout. `immagini` è la
    cartella da cui `meta_immagine` pesca: ogni deck ha la sua, con la
    provenienza accanto, perché una slide ereditata si cita."""
    global prs, LAYOUTS, IMG
    prs = Presentation(str(template))
    LAYOUTS = [L for m in prs.slide_masters for L in m.slide_layouts]
    IMG = pathlib.Path(immagini) if immagini else None
    if len(LAYOUTS) < 100:
        raise SystemExit(f"template con {len(LAYOUTS)} layout: non è quello di Brand Center")
    return prs


def fascia_del_piede(pdf):
    """Il controllo che `audit:pptx` non può fare: quel gate misura le SCATOLE,
    non il testo RESO. Un paragrafo che sborda dal suo segnaposto resta dentro
    il foglio mentre si siede sopra il marchio Adobe. Qui si rende il PDF e si
    legge il riquadro di ogni parola."""
    import html as _h
    import re as _re
    import shutil
    import subprocess
    import tempfile
    import os
    if not shutil.which("pdftotext"):
        return []
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False) as f:
        box = f.name
    subprocess.run(["pdftotext", "-bbox", str(pdf), box], check=True, capture_output=True)
    testo = pathlib.Path(box).read_text(encoding="utf-8", errors="replace")
    os.unlink(box)
    # il copyright del template si riconosce dalle PAROLE: cambia posto secondo
    # il layout, e una regola posizionale lo scambia per un difetto
    CHROME = {"©", "2025", "2026", "Adobe", "All", "Rights", "Reserved", "Confidential"}
    guai = []
    pagine = _re.findall(r'<page width="[\d.]+" height="([\d.]+)">(.*?)</page>', testo, _re.S)
    for n, (altezza, corpo) in enumerate(pagine, 1):
        soglia = float(altezza) - 60          # 60pt ≈ 0,83in di fascia bassa
        parole = []
        for m in _re.finditer(r'<word xMin="([\d.]+)" yMin="[\d.]+" xMax="[\d.]+" '
                              r'yMax="([\d.]+)">(.*?)</word>', corpo):
            x0, y1, parola = float(m.group(1)), float(m.group(2)), _h.unescape(m.group(3))
            if y1 <= soglia:
                continue
            if y1 > soglia + 35 and x0 < 120:          # il marchio, che sta lì di suo
                continue
            if parola.strip("·.,") in CHROME:
                continue
            parole.append(parola)
        if parole:
            guai.append((n, parole))
    return guai


def salva(uscita, *, pdf=True):
    """Salva, rende il PDF e passa il controllo del piè di pagina. Se il testo
    entra nella fascia bassa, la consegna si rifiuta: si taglia la copia o si
    cambia layout, mai si rimpicciolisce il tipo."""
    import shutil
    import subprocess
    uscita = pathlib.Path(uscita)
    prs.save(str(uscita))
    n = len(prs.slides._sldIdLst)
    print(f"{n} slide · salvato in {uscita}")
    if not (pdf and shutil.which("soffice")):
        print("piè di pagina: controllo saltato (soffice non c'è) — guarda le pagine")
        return uscita
    subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir",
                    str(uscita.parent), str(uscita)], capture_output=True)
    f = uscita.with_suffix(".pdf")
    guai = fascia_del_piede(f)
    if guai:
        righe = "\n".join(f"  slide {k:02d} · " + " ".join(w[:12]) for k, w in guai)
        raise SystemExit("testo nella fascia del piè di pagina — si taglia la copia, "
                         "non si rimpicciolisce il tipo:\n" + righe)
    print(f"piè di pagina: libero su tutte le pagine · PDF rifatto ({f.name})")
    return uscita
