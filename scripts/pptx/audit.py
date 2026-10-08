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
from pptx.enum.shapes import MSO_SHAPE

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
                        if pt < 7:
                            R("HARD", i, "Z", f"corpo {pt}pt (≈{pt*2:.0f}px proiettato): "
                                              f"illeggibile in sala. Taglia la copia o "
                                              f"cambia layout, non rimpicciolire")
                        elif pt < 9:
                            R("SOFT", i, "Z", f"corpo {pt}pt (≈{pt*2:.0f}px proiettato): "
                                              f"sotto il minimo del contratto di leggibilità")
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
