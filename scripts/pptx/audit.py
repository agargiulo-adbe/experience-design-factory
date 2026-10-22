#!/usr/bin/env python3
"""
audit:pptx — il gate deterministico dei deck consegnati come file .pptx.

PERCHÉ ESISTE
`audit:deck` protegge le experience HTML. I deck .pptx erano l'unico artefatto
della Factory SENZA gate, e si vedeva: nel deck dell'8 ottobre 2026, 27 corpi
tipografici distinti su 14 slide, due rossi diversi nello stesso file, e quattro
slide che coprivano con un fondo pieno la banda rossa del template.

DA DOVE VENGONO LE REGOLE — non sono opinioni
1. Dal TEMPLATE STESSO. Il master del template di Brand Center porta la forma
   «Thread» (0,14 × 7,50 in, a sinistra, #EB1000) e il marchio Adobe in basso.
   Il gate LEGGE il template invece di fidarsi di valori a memoria.
2. Dalla guida del template (Inside Adobe › Brand Center › Presentation
   Template), riletta sulle fonti interne il 2026-10-08:
   · Adobe Red #EB1000; core: rosso, nero, bianco.
   · Il red thread non si ricolora, non si sposta, non si copre, non si rompe.
   · Solo Adobe Clean (Display Black titoli · Bold enfasi · Regular corpo).
   · Fondi delle slide di contenuto: nero o bianco. Il rosso su copertina e
     chiusura.
   · Titoli in sentence case, testo a bandiera sinistra.
   · Icone solo nere o bianche, solo dal set Adobe.
   · Grafici in prevalenza grigi, con pochi accenti.
   · «Use one template across the business and do not create your own.»

HARD = difetti veri: devono essere ZERO.   SOFT = segnali: si valutano.
Il gate misura e NON sostituisce il guardare: con `--render` rende le pagine.

Uso:
  python3 scripts/pptx/audit.py <deck.pptx> [--render [DIR]] [--json out.json]
  pnpm audit:pptx <deck.pptx>
"""
import collections, json, pathlib, re, shutil, subprocess, sys
from pptx import Presentation
from pptx.util import Emu, Inches, Pt
from pptx.enum.shapes import MSO_SHAPE, MSO_SHAPE_TYPE

ADOBE_RED_DEFAULT = "EB1000"
ROSSI_NOTI = {
    "FA0F00": "il rosso del logo corporate, non quello delle slide",
    "FF0000": "rosso puro", "ED1C24": "rosso generico",
    "E2001A": "rosso UniCredit", "DA291C": "rosso generico",
}
FONT_OK = re.compile(r"^adobe clean", re.I)
SEGNAPOSTO = re.compile(
    r"lorem|\bTODO\b|speaker name|speaker title|image placeholder|"
    r"click to edit|\bplaceholder\b|\[inserire|\bTBD\b", re.I)


def walk(shapes):
    for sh in shapes:
        yield sh
        if sh.shape_type == 6:
            yield from walk(sh.shapes)


def hexof(colore):
    try:
        if colore is not None and colore.type is not None and colore.rgb is not None:
            return str(colore.rgb).upper()
    except Exception:
        pass
    return None


def riempimento(sh):
    """Colore di riempimento, o None. Non tutte le forme hanno `fill`."""
    try:
        return hexof(sh.fill.fore_color)
    except Exception:
        return None


def thread_ereditato(slide, H):
    """La banda rossa arriva dal master (o dal layout): la trovo e la restituisco."""
    for contenitore in (slide.slide_layout, slide.slide_layout.slide_master):
        for sh in walk(contenitore.shapes):
            if sh.left is None or sh.width is None or sh.height is None:
                continue
            stretta = sh.width <= Emu(Pt(24))
            alta = sh.height >= H * 0.9
            a_sinistra = sh.left <= Emu(Pt(8))
            if stretta and alta and a_sinistra:
                return sh, riempimento(sh)
    return None, None


def marchio_ereditato(slide):
    for contenitore in (slide.slide_layout, slide.slide_layout.slide_master):
        for sh in walk(contenitore.shapes):
            if sh.shape_type == 13 and sh.top is not None and sh.left is not None:
                return sh
    return None


def audit(path):
    prs = Presentation(str(path))
    W, H = prs.slide_width, prs.slide_height
    rilievi = []
    misure = {"corpi": collections.Counter(), "font": collections.Counter(),
              "colori_testo": collections.Counter(), "rossi": collections.Counter()}

    # il rosso di riferimento si LEGGE dal template, non si ricorda
    rosso_atteso = ADOBE_RED_DEFAULT
    for s in prs.slides:
        _, col = thread_ereditato(s, H)
        if col:
            rosso_atteso = col
            break

    def R(sev, slide, codice, dettaglio):
        rilievi.append({"severita": sev, "slide": slide, "codice": codice, "dettaglio": dettaglio})

    for i, s in enumerate(prs.slides, 1):
        forme = list(walk(s.shapes))
        testi = [sh for sh in forme if sh.has_text_frame and sh.text_frame.text.strip()]

        # --- che cosa copre tutta la slide ------------------------------------
        coperture = [sh for sh in forme
                     if sh.width and sh.height and sh.left is not None and sh.top is not None
                     and sh.left <= Emu(Pt(2)) and sh.top <= Emu(Pt(2))
                     and sh.width >= W * 0.97 and sh.height >= H * 0.97]

        thread, col_thread = thread_ereditato(s, H)
        thread_proprio = [sh for sh in forme
                          if sh.left is not None and sh.width and sh.height
                          and sh.left <= Emu(Pt(8)) and sh.width <= Emu(Pt(24))
                          and sh.height >= H * 0.9]
        marchio = marchio_ereditato(s)

        # --- T: il red thread --------------------------------------------------
        if not thread and not thread_proprio:
            R("HARD", i, "T", "la banda rossa non c'è né sulla slide né nel layout/master: "
                              "il red thread non si interrompe")
        elif coperture and thread and not thread_proprio:
            nomi = ", ".join(f"«{(c.name or '?')[:22]}»" for c in coperture[:2])
            R("HARD", i, "T", f"un fondo a tutta pagina ({nomi}) COPRE il red thread del template "
                              f"e il marchio in basso: il thread non si copre")
        for sh in thread_proprio:
            c = riempimento(sh)
            if c and c != rosso_atteso:
                R("HARD", i, "T", f"banda sinistra ridisegnata in #{c} invece di #{rosso_atteso}: "
                                  f"il thread non si ricolora")

        # --- B: fondo delle slide di contenuto --------------------------------
        for sh in coperture:
            c = riempimento(sh)
            if c and c not in ("000000", "FFFFFF", rosso_atteso):
                R("HARD", i, "B", f"fondo pieno #{c}: sulle slide di contenuto il fondo è nero o "
                                  f"bianco (il rosso solo su copertina e chiusura)")

        # --- R/F/S/J: colore, carattere, scala, allineamento -------------------
        for sh in testi:
            for p in sh.text_frame.paragraphs:
                if p.alignment is not None and str(p.alignment).startswith("CENTER"):
                    R("SOFT", i, "J", f"paragrafo centrato: il template allinea a bandiera sinistra "
                                      f"(«{sh.text_frame.text.strip()[:34]}»)")
                for r in p.runs:
                    if r.font.size:
                        pt = r.font.size.pt
                        misure["corpi"][pt] += 1
                        # Z — corpo minimo. Il canvas è 13,33 in: proiettato a 1920 px
                        # fanno 144 px/in, cioè 1pt ≈ 2px. Il contratto di leggibilità
                        # delle experience vuole il corpo ≥ 0,95rem ≈ 17px ≈ 8,5pt e le
                        # note ≥ 0,75rem ≈ 13,5px ≈ 6,75pt. Sotto non si legge in sala,
                        # e NON si risolve rimpicciolendo: si taglia o si cambia layout.
                        # la soglia severa vale per il testo di CORPO, non per
                        # le etichette e le righe di fonte: una nota a 10pt è
                        # una nota, un paragrafo a 10pt è un difetto
                        lungo = len(r.text.strip()) > 110
                        if pt < 8:
                            R("HARD", i, "Z", f"corpo {pt}pt (≈{pt*2:.0f}px proiettato): "
                                              f"illeggibile in sala a qualunque titolo")
                        elif lungo and pt < 12:
                            R("HARD", i, "Z", f"paragrafo di {len(r.text.strip())} caratteri "
                                              f"a {pt}pt (≈{pt*2:.0f}px proiettato): sotto il "
                                              f"minimo del contratto di leggibilità. Taglia "
                                              f"la copia o cambia layout, non rimpicciolire")
                        elif pt < 9:
                            R("SOFT", i, "Z", f"etichetta a {pt}pt (≈{pt*2:.0f}px proiettato): "
                                              f"al limite inferiore")
                        if abs(pt - round(pt)) > 1e-6:
                            R("SOFT", i, "S", f"corpo a mezzo punto {pt}pt: è il segno del testo "
                                              f"rimpicciolito finché entrava, non di una scala")
                    if r.font.name:
                        misure["font"][r.font.name] += 1
                        if not FONT_OK.match(r.font.name):
                            R("HARD", i, "F", f"carattere «{r.font.name}»: il template usa solo Adobe Clean")
                    c = hexof(r.font.color)
                    if c:
                        misure["colori_testo"][c] += 1
                        if c in ROSSI_NOTI and c != rosso_atteso:
                            misure["rossi"][c] += 1
                            R("HARD", i, "R", f"testo #{c} ({ROSSI_NOTI[c]}): in questo template "
                                              f"Adobe Red è #{rosso_atteso}")

        # --- P: segnaposto rimasti --------------------------------------------
        for sh in testi:
            t = sh.text_frame.text.strip()
            if SEGNAPOSTO.search(t):
                R("HARD", i, "P", f"segnaposto rimasto: «{t[:60]}»")

        # --- C: fuori foglio ---------------------------------------------------
        for sh in forme:
            if sh.left is None or sh.width is None:
                continue
            l, t, w, h = sh.left, sh.top or 0, sh.width, sh.height or 0
            if l < -Emu(Pt(4)) or t < -Emu(Pt(4)) or l + w > W + Emu(Pt(4)) or t + h > H + Emu(Pt(4)):
                R("HARD", i, "C", f"«{(sh.name or '?')[:26]}» esce dal foglio: "
                                  f"{Emu(l).inches:.2f},{Emu(t).inches:.2f} "
                                  f"{Emu(w).inches:.2f}×{Emu(h).inches:.2f} in")

        # --- X/G/O: zona del thread, gradienti, forme vietate -------------------
        # Dalla scheda «Adobe PPTX Brand Skill» (wiki adobedotcom), che conferma
        # indipendentemente la geometria letta nel master: il thread è x=0 w=0,14"
        # h=7,5" #EB1000, e il contenuto parte da x ≥ 0,45". Vietati: gradienti,
        # ombre, angoli arrotondati, icone colorate.
        for sh in s.shapes:                      # solo primo livello: i figli seguono il gruppo
            if sh.left is None or sh.width is None:
                continue
            pieno_schermo = sh.width >= W * 0.97 and (sh.height or 0) >= H * 0.97
            e_il_thread = sh.width <= Emu(Pt(24)) and (sh.height or 0) >= H * 0.9
            if not pieno_schermo and not e_il_thread and sh.left < Inches(0.45):
                R("SOFT", i, "X", f"«{(sh.name or '?')[:24]}» parte da {Emu(sh.left).inches:.2f}in: "
                                  f"il contenuto comincia a 0,45in per stare largo dal red thread")
            try:
                if sh.fill.type == 3:            # MSO_FILL.GRADIENT
                    R("HARD", i, "G", f"«{(sh.name or '?')[:24]}» ha un riempimento a gradiente: "
                                      f"il template non usa gradienti")
            except Exception:
                pass
            try:
                if sh.shape_type == 1 and sh.auto_shape_type == MSO_SHAPE.ROUNDED_RECTANGLE:
                    R("SOFT", i, "O", f"«{(sh.name or '?')[:24]}» è un rettangolo ad angoli "
                                      f"arrotondati: il template usa angoli vivi")
            except Exception:
                pass
            try:
                if sh._element.spPr is not None and sh._element.spPr.find(
                        "{http://schemas.openxmlformats.org/drawingml/2006/main}effectLst") is not None \
                   and len(sh._element.spPr.find(
                        "{http://schemas.openxmlformats.org/drawingml/2006/main}effectLst")):
                    R("SOFT", i, "O", f"«{(sh.name or '?')[:24]}» ha un effetto (ombra/bagliore): "
                                      f"il template non li usa")
            except Exception:
                pass

        # --- L: il marchio -----------------------------------------------------
        if not marchio and not any(re.search(r"logo|adobe", sh.name or "", re.I) for sh in forme):
            R("SOFT", i, "L", "nessun marchio Adobe trovato né sulla slide né nel layout/master")

        # --- E: riquadri accavallati (SEMPRE da confermare a occhio) ------------
        box = [(sh.left, sh.top, sh.width, sh.height, sh.text_frame.text.strip()[:30])
               for sh in testi if None not in (sh.left, sh.top, sh.width, sh.height)]
        for a in range(len(box)):
            for b in range(a + 1, len(box)):
                l1, t1, w1, h1, x1 = box[a]
                l2, t2, w2, h2, x2 = box[b]
                ox = min(l1 + w1, l2 + w2) - max(l1, l2)
                oy = min(t1 + h1, t2 + h2) - max(t1, t2)
                if ox > 0 and oy > 0:
                    q = ox * oy / max(1, min(w1 * h1, w2 * h2))
                    if q > 0.25:
                        R("SOFT", i, "E", f"riquadri sovrapposti al {int(q*100)}% — «{x1}» ⨯ «{x2}» — "
                                          f"i riquadri che si auto-dimensionano danno falsi allarmi: "
                                          f"CONFERMA guardando la pagina")

    n = len(misure["corpi"])
    if n > 8:
        R("SOFT", 0, "S", f"{n} corpi tipografici distinti su {len(prs.slides)} slide: "
                          f"una scala ne ha 5-7")
    return prs, rilievi, misure, rosso_atteso


def pagine_rese(path):
    """Rende il deck una volta sola e restituisce (pdf, [png per pagina]).
    Tutti i controlli che guardano il RESO condividono questa passata."""
    if not (shutil.which("soffice") and shutil.which("pdftoppm")):
        return None, []
    import tempfile
    import time
    tmp = pathlib.Path(tempfile.mkdtemp(prefix="auditpptx_"))
    pdf = tmp / (pathlib.Path(path).stem + ".pdf")
    # soffice non regge due istanze insieme, e il builder lo chiama un istante
    # prima del gate: il primo tentativo fallisce in silenzio. Si riprova, invece
    # di scaricare sull'utente un «rilancia».
    for tentativo in range(3):
        subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir",
                        str(tmp), str(path)], capture_output=True)
        if pdf.exists():
            break
        time.sleep(3 + 3 * tentativo)
    if not pdf.exists():
        return None, []
    subprocess.run(["pdftoppm", "-png", "-r", "80", str(pdf), str(tmp / "s")],
                   capture_output=True)
    return pdf, sorted(tmp.glob("s-*.png"))


def qualita_visiva(prs, png, R):
    """I controlli che nessuno faceva, ed è il motivo per cui un deck può
    passare il gate ed essere un muro di testo.

    `audit:pptx` nasce come gate di MARCHIO: filo rosso, fondi, caratteri,
    rossi. Niente di tutto questo vede quanto testo c'è su una pagina, quanta
    pagina resta vuota, o se in venti slide non compare un solo elemento
    grafico. I deck HTML della Factory hanno quei controlli da sempre
    (`audit:deck`, banda di lettura e uso dello spazio); il .pptx no, e si è
    visto: 16 ott 2026, mediana 134 parole per slide e 46 pagine su 49 senza
    un disegno, con il gate verde.

    Le soglie non sono opinioni: vengono dalla stessa misura fatta sui deck
    HTML del repo (mediana 96 parole, un terzo oltre 120 già giudicato denso)
    e dal contratto di leggibilità, che proietta a 1920.
    """
    from PIL import Image

    senza_grafica = 0
    for i, s in enumerate(prs.slides, 1):
        # ── D · densità: quante parole chiede una pagina sola ───────────────
        parole = sum(len(sh.text_frame.text.split()) for sh in walk(s.shapes)
                     if sh.has_text_frame and sh.text_frame.text.strip())
        if parole > 190:
            R("HARD", i, "D", f"{parole} parole su una slide: a proiezione non si legge, "
                              f"si ascolta chi parla. Si taglia o si divide (soglia 190)")
        elif parole > 130:
            R("SOFT", i, "D", f"{parole} parole: sopra le 130 la pagina diventa un "
                              f"documento da leggere, non una slide da guardare")

        # ── G · elementi grafici: un deck tutto testo è un difetto, non uno stile
        grafici = 0
        for sh in walk(s.shapes):
            if sh.shape_type == MSO_SHAPE_TYPE.PICTURE:
                grafici += 1
            elif getattr(sh, "has_chart", False):
                grafici += 1
            elif sh.shape_type == MSO_SHAPE_TYPE.AUTO_SHAPE and not (
                    sh.has_text_frame and len(sh.text_frame.text) > 120):
                grafici += 1
        if grafici == 0 and parole > 60:
            senza_grafica += 1
            if senza_grafica == 6:
                R("SOFT", i, "G", "sei slide di fila senza un elemento grafico: qui il deck "
                                  "è diventato un documento. Una figura, un grafico, una "
                                  "citazione a tutta pagina rompono il muro")
        else:
            senza_grafica = 0

    # ── V · quanta pagina è usata, misurata sull'inchiostro vero ────────────
    #  Si misura sul RESO, non sulle scatole: un segnaposto grande e mezzo
    #  vuoto conta come pieno se si guarda l'XML. Basta una miniatura — la
    #  domanda è «quanta pagina è coperta», non «di che colore è quel pixel».
    for i, f in enumerate(png, 1):
        im = Image.open(f).convert("L")
        im = im.resize((200, int(200 * im.height / im.width)))
        w, h = im.size
        px = im.load()
        y0, y1 = int(h * 0.06), int(h * 0.88)      # senza intestazione e piede
        x0, x1 = int(w * 0.04), int(w * 0.98)      # senza la banda rossa
        righe_piene, inchiostro, totale = [], 0, 0
        for y in range(y0, y1):
            piena = False
            for x in range(x0, x1):
                totale += 1
                if px[x, y] < 230:
                    inchiostro += 1
                    piena = True
            righe_piene.append(piena)
        copertura = inchiostro / max(totale, 1)
        if copertura < 0.035:
            R("SOFT", i, "V", f"la pagina è coperta al {copertura*100:.1f}%: contenuto "
                              f"appeso in alto e mezzo foglio vuoto. Si riempie, si fonde "
                              f"con la pagina accanto, o si sceglie un layout più stretto")
        vuote = massimo = 0
        for piena in righe_piene:
            vuote = 0 if piena else vuote + 1
            massimo = max(massimo, vuote)
        if massimo > len(righe_piene) * 0.34:
            R("SOFT", i, "V", f"fascia vuota alta il {massimo/len(righe_piene)*100:.0f}% "
                              f"della pagina: il contenuto sta tutto da una parte")


def piede(path):
    """Il controllo che la lettura dell'XML non può fare.

    Tutto il resto di questo gate misura le SCATOLE: dove stanno i segnaposti,
    di che colore sono i fondi, quali corpi e caratteri porta il testo. Nessuna
    di quelle misure vede il testo RESO, e un paragrafo che sborda dal suo
    segnaposto resta dentro il foglio mentre si siede sopra il marchio Adobe e
    la riga di copyright. Successo il 16 ott 2026 alzando una scala tipografica:
    quattro pagine su 49, gate verde, difetto visibile solo guardando.

    Qui si rende il PDF e si legge il riquadro di ogni parola. Serve `soffice`
    e `pdftotext`: dove non ci sono, il controllo si dichiara saltato e non
    finge di essere passato.
    """
    if not (shutil.which("soffice") and shutil.which("pdftotext")):
        return None
    import tempfile
    import html as _h
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir",
                        str(tmp), str(path)], capture_output=True)
        pdf = tmp / (pathlib.Path(path).stem + ".pdf")
        if not pdf.exists():
            return None
        box = tmp / "box.html"
        subprocess.run(["pdftotext", "-bbox", str(pdf), str(box)], capture_output=True)
        testo = box.read_text(encoding="utf-8", errors="replace")
    # il copyright del template si riconosce dalle PAROLE, non dall'ascissa:
    # su un layout con immagine a destra si sposta, e una regola posizionale
    # lo scambierebbe per un difetto
    CHROME = {"©", "2024", "2025", "2026", "2027", "Adobe", "All", "Rights",
              "Reserved", "Confidential"}
    guai = []
    for n_, (alt, corpo) in enumerate(re.findall(
            r'<page width="[\d.]+" height="([\d.]+)">(.*?)</page>', testo, re.S), 1):
        soglia = float(alt) - 60
        parole = []
        for m in re.finditer(r'<word xMin="([\d.]+)" yMin="[\d.]+" xMax="[\d.]+" '
                             r'yMax="([\d.]+)">(.*?)</word>', corpo):
            x0, y1, parola = float(m.group(1)), float(m.group(2)), _h.unescape(m.group(3))
            if y1 <= soglia or (y1 > soglia + 35 and x0 < 120):
                continue
            if parola.strip("·.,") in CHROME:
                continue
            parole.append(parola)
        if parole:
            guai.append((n_, parole))
    return guai


# i caratteri che il template porta per disegno: Adobe Clean in tutte le sue
# incisioni, più Wingdings, che è il carattere dei punti elenco dei layout
CARATTERI_DEL_TEMPLATE = re.compile(r"(AdobeClean|Adobe\s*Clean|Wingdings)", re.I)


def caratteri_resi(pdf, R):
    """Che cosa il motore di rendering ha DAVVERO usato per disegnare il testo.

    Il controllo «F» legge il carattere DICHIARATO nell'XML, e per questo non
    vede la classe di difetto più insidiosa: un glifo che Adobe Clean non ha.
    L'XML continua a dire «Adobe Clean», il renderer sostituisce in silenzio, e
    sulla pagina compare un carattere che nessuno ha scelto.

    Successo il 17 ott 2026 sul deck KB FSI: un «⚠️» in una nota di cautela
    (il selettore U+FE0F forza la resa a emoji) usciva **giallo** su un deck la
    cui tavolozza è nero, bianco e Adobe Red — l'unico colore fuori marchio in
    cinquanta pagine. Gate verde su tutte e tre le famiglie di controlli.

    Si misura dalla prova vera: i caratteri che il PDF reso ha incorporato.
    Così il controllo non dipende da un elenco di codepoint indovinato a mano —
    prende qualunque sostituzione, compresa quella che non ho previsto.
    """
    if not shutil.which("pdffonts"):
        return False
    out = subprocess.run(["pdffonts", str(pdf)], capture_output=True, text=True).stdout
    estranei = set()
    for riga_ in out.splitlines()[2:]:
        nome = riga_.split()[0] if riga_.split() else ""
        if not nome:
            continue
        nome = nome.split("+", 1)[-1]          # via il prefisso di sottoinsieme
        if not CARATTERI_DEL_TEMPLATE.search(nome):
            estranei.add(nome)
    for nome in sorted(estranei):
        R("HARD", 0, "U", f"il reso incorpora «{nome}», che non è del template: "
                          f"un glifo che Adobe Clean non ha viene sostituito dal "
                          f"renderer, e la sostituzione porta forma e COLORE suoi "
                          f"(un'emoji esce a colori). Si toglie il glifo e lo si "
                          f"dice a parole, o si usa una forma disegnata")
    return True


def rendi(path, out_dir):
    if not shutil.which("soffice"):
        print("  soffice non trovato: niente rendering")
        return []
    out_dir.mkdir(parents=True, exist_ok=True)
    subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir",
                    str(out_dir), str(path)], check=True, capture_output=True)
    pdf = out_dir / (pathlib.Path(path).stem + ".pdf")
    subprocess.run(["pdftoppm", "-png", "-r", "100", str(pdf), str(out_dir / "s")], check=True)
    return sorted(out_dir.glob("s-*.png"))


def main():
    argv = sys.argv[1:]
    if not argv:
        sys.exit(__doc__)
    path = pathlib.Path(argv[0])
    if not path.exists():
        sys.exit(f"non trovato: {path}")

    prs, rilievi, misure, rosso = audit(path)

    # i controlli che guardano il RESO: una sola passata di rendering, che
    # serve sia alla qualità visiva sia al piè di pagina
    pdf_reso, png_resi = pagine_rese(path)
    visivi_fatti = False
    if png_resi:
        try:
            qualita_visiva(prs, png_resi, lambda sev, sl, c, d: rilievi.append(
                {"severita": sev, "slide": sl, "codice": c, "dettaglio": d}))
            visivi_fatti = True
        except ImportError:
            pass
    # i caratteri DAVVERO usati dal renderer: si legge dallo stesso PDF
    caratteri_fatti = False
    if pdf_reso:
        caratteri_fatti = caratteri_resi(pdf_reso, lambda sev, sl, c, d: rilievi.append(
            {"severita": sev, "slide": sl, "codice": c, "dettaglio": d}))
    if not caratteri_fatti:
        rilievi.append({"severita": "HARD", "slide": 0, "codice": "!",
                        "dettaglio": "il controllo «U» (caratteri sostituiti al rendering) "
                                     "NON è girato: manca pdffonts o il rendering non è "
                                     "riuscito. Questo esito non vale come verde"})

    if not visivi_fatti:
        # Un controllo saltato NON è un controllo passato. Il rendering può
        # fallire per contesa su soffice, e un gate che in quel caso stampa
        # zero mente: è la stessa trappola già vista su audit:deck, dove
        # «--only a,b» non auditava niente e dichiarava PASS.
        rilievi.append({"severita": "HARD", "slide": 0, "codice": "!",
                        "dettaglio": "i controlli di qualità visiva (D, Z sul reso, V, G) "
                                     "NON sono girati: rendering non riuscito o Pillow "
                                     "assente. Questo esito non vale come verde — "
                                     "rilancia, e se soffice è occupato aspetta che finisca"})

    hard = [r for r in rilievi if r["severita"] == "HARD"]
    soft = [r for r in rilievi if r["severita"] == "SOFT"]
    estranei = {f for f in misure["font"] if not FONT_OK.match(f)}

    print(f"\n{path.name} · {len(prs.slides)} slide · Adobe Red letto dal template: #{rosso}\n")
    print(f"corpi tipografici: {len(misure['corpi'])} distinti → {sorted(misure['corpi'])}")
    print(f"caratteri: {dict(misure['font'])}" + (f"   ⚠️ estranei: {estranei}" if estranei else ""))
    print(f"colori di testo: {len(misure['colori_testo'])} distinti"
          + (f"   ⚠️ rossi fuori norma: {dict(misure['rossi'])}" if misure["rossi"] else "") + "\n")

    for titolo, gruppo in (("HARD — devono essere zero", hard),
                           ("SOFT — segnali da valutare", soft)):
        print(f"{titolo}: {len(gruppo)}")
        visti = collections.Counter()
        for r in gruppo:
            visti[r["codice"]] += 1
            if visti[r["codice"]] <= 5:
                dove = f"slide {r['slide']:>2}" if r["slide"] else "  deck  "
                print(f"   {dove}  {r['codice']}  {r['dettaglio']}")
        for c, k in visti.items():
            if k > 5:
                print(f"   … e altri {k-5} rilievi «{c}»")
        print()

    guai = piede(path)
    if guai is None:
        print("piè di pagina: controllo saltato (serve soffice e pdftotext)\n")
    elif guai:
        print(f"PIÈ DI PAGINA — il testo entra dove vivono marchio e copyright: "
              f"{len(guai)} pagine")
        for k, w in guai[:6]:
            print(f"   slide {k:>2}  {' '.join(w[:10])}")
        if len(guai) > 6:
            print(f"   … e altre {len(guai)-6} pagine")
        print("   Si taglia la copia o si cambia layout, mai si rimpicciolisce il tipo.\n")
        # `hard` è la LISTA dei rilievi, non un conteggio: sommarci un intero
        # alzava TypeError e il gate moriva DOPO aver stampato tutto, con un
        # codice d'uscita che non voleva dire quello che sembrava.
        hard += [{"severita": "HARD", "slide": k, "codice": "Q",
                  "dettaglio": "il testo entra nel piè di pagina"} for k, _ in guai]
    else:
        print("piè di pagina: libero su tutte le pagine\n")

    if "--render" in argv:
        j = argv.index("--render")
        out = (pathlib.Path(argv[j + 1]) if len(argv) > j + 1 and not argv[j + 1].startswith("--")
               else path.parent / f"audit_{path.stem[:24]}")
        print(f"pagine rese: {len(rendi(path, out))} → {out}")

    print("⚠️  Il gate misura. NON sostituisce il guardare: apri le pagine e leggile.\n")

    if "--json" in argv:
        dest = pathlib.Path(argv[argv.index("--json") + 1])
        dest.write_text(json.dumps(
            {"file": path.name, "slide": len(prs.slides), "adobe_red": rosso,
             "rilievi": rilievi, "corpi": sorted(misure["corpi"]),
             "font": dict(misure["font"])}, ensure_ascii=False, indent=2), "utf-8")

    sys.exit(2 if hard else 0)


if __name__ == "__main__":
    main()
