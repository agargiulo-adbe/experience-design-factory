#!/usr/bin/env python3
"""
Il mio render del .pptx è fedele, o sto guardando un carattere sostituito?

PERCHÉ ESISTE
Il gate e gli screenshot del .pptx passano da LibreOffice. Se Adobe Clean non è
installato, LibreOffice sostituisce in silenzio e il PNG che guardo NON è quello
che vedrà la sala: dire «l'ho guardata» sarebbe falso. Questo controllo lo
accerta con una prova, non con un elenco di cartelle.

COME
Compone una slide con la stessa frase in Adobe Clean e in DUE riferimenti: un
carattere che di sicuro non esiste, e Helvetica (che c'è sempre su macOS). Rende
e confronta pixel per pixel. Se la riga Adobe Clean è identica a UNO DEI DUE
riferimenti, è stata sostituita. Serve il doppio riferimento: LibreOffice può
mappare un nome ignoto su un ripiego diverso da quello che userebbe per un nome
a caso, e un confronto solo contro il finto darebbe un falso «disponibile» —
è successo davvero, l'8 ottobre 2026, e si è visto solo guardando il PNG.

Uso:  pnpm pptx:fonts        /  python3 scripts/pptx/check-fonts.py
"""
import pathlib, shutil, subprocess, sys, tempfile
from pptx import Presentation
from pptx.util import Inches, Pt
from PIL import Image, ImageChops

FRASE = "Handgloves 123 — Adobe"
FAMIGLIE = ["Adobe Clean", "Adobe Clean Bold", "Adobe Clean Display Black"]
FINTO = "Zzxq Nonexistent Face"
NOTO = "Helvetica"


def prova(tmp):
    prs = Presentation()
    prs.slide_width, prs.slide_height = Inches(13.333), Inches(7.5)
    s = prs.slides.add_slide(prs.slide_layouts[6])
    righe = FAMIGLIE + [FINTO, NOTO]
    for i, fam in enumerate(righe):
        tb = s.shapes.add_textbox(Inches(0.5), Inches(0.5 + i * 1.2), Inches(12), Inches(1.0))
        p = tb.text_frame.paragraphs[0]
        r = p.add_run(); r.text = FRASE
        r.font.name, r.font.size = fam, Pt(40)
    f = tmp / "prova.pptx"; prs.save(str(f))
    subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(tmp), str(f)],
                   check=True, capture_output=True)
    subprocess.run(["pdftoppm", "-png", "-r", "100", str(tmp / "prova.pdf"), str(tmp / "p")], check=True)
    img = Image.open(sorted(tmp.glob("p-*.png"))[0]).convert("L")
    larghezza = img.width
    bande = []
    for i in range(len(righe)):
        y0 = int((0.5 + i * 1.2) * 100); y1 = y0 + 90
        bande.append(img.crop((40, y0, min(larghezza, 900), y1)))
    return righe, bande


def main():
    if not shutil.which("soffice"):
        sys.exit("soffice non trovato: senza LibreOffice non posso rendere né verificare.")
    with tempfile.TemporaryDirectory() as d:
        tmp = pathlib.Path(d)
        righe, bande = prova(tmp)
        rif_finto, rif_noto = bande[-2], bande[-1]
        print(f"\nverifica di fedeltà del rendering .pptx (LibreOffice)")
        print(f"riferimenti: «{FINTO}» (ripiego) e «{NOTO}» (installato)\n")
        mancanti = []
        for fam, banda in zip(righe[:-2], bande[:-2]):
            come_finto = ImageChops.difference(banda, rif_finto).getbbox() is None
            come_noto = ImageChops.difference(banda, rif_noto).getbbox() is None
            ok = not (come_finto or come_noto)
            perche = " (reso come il ripiego)" if come_finto else (f" (reso come {NOTO})" if come_noto else "")
            print(f"  {'✓ disponibile ' if ok else '✗ SOSTITUITO  '} {fam}{perche}")
            if not ok:
                mancanti.append(fam)
        if mancanti:
            print(f"\n⚠️  {len(mancanti)} carattere/i sostituito/i: i PNG di `audit:pptx` sono\n"
                  f"    APPROSSIMAZIONI. Si può misurare, non si può dire «l'ho guardata».\n"
                  f"    Rimedio: Creative Cloud desktop › Font › Adobe Clean › «Install family»\n"
                  f"    (sincronizzazione, non download manuale), poi riavvia LibreOffice.\n")
            sys.exit(1)
        print("\n✓ Adobe Clean è disponibile a LibreOffice: il render è fedele.\n")


if __name__ == "__main__":
    main()
