#!/usr/bin/env python3
"""
Estrae slide da una libreria .pptx in un file nuovo, e le RENDE in PNG.

Serve per guardarle prima di decidere se ereditarle, e per lavorarci sopra
(tradurre, ricontestualizzare, togliere quello che è fuori perimetro) senza
aprire un file da 600 MB.

Uso:  python3 scripts/pptx/extract.py "<libreria.pptx>" 151 98 77 [--out DIR]
"""
import pathlib, shutil, subprocess, sys
from pptx import Presentation

RID = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"


def estrai(src, numeri, dest):
    prs = Presentation(str(src))
    tieni = set(numeri)
    lst = prs.slides._sldIdLst
    for i, el in enumerate(list(lst), 1):
        if i not in tieni:
            prs.part.drop_rel(el.get(RID))
            lst.remove(el)
    prs.save(str(dest))
    return dest


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 2:
        sys.exit(__doc__)
    src = pathlib.Path(args[0])
    numeri = [int(a) for a in args[1:]]
    out = pathlib.Path(sys.argv[sys.argv.index("--out") + 1]) if "--out" in sys.argv \
        else pathlib.Path("/tmp") / f"estratto_{src.stem[:24]}"
    out.mkdir(parents=True, exist_ok=True)
    dest = out / f"{src.stem[:40]}_slide_{'-'.join(map(str, numeri))}.pptx"
    estrai(src, numeri, dest)
    print(f"estratte {len(numeri)} slide → {dest}  ({dest.stat().st_size/1e6:.1f} MB)")
    if shutil.which("soffice"):
        subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(out), str(dest)],
                       check=True, capture_output=True)
        pdf = out / (dest.stem + ".pdf")
        subprocess.run(["pdftoppm", "-png", "-r", "100", str(pdf), str(out / "p")], check=True)
        pagine = sorted(out.glob("p-*.png"))
        print(f"rese {len(pagine)} pagine → {out}")
        for p, n in zip(pagine, numeri):
            print(f"   slide {n:>3} → {p}")
    print("\n⚠️  Una slide ereditata si CITA (file + numero) e si ricontestualizza.\n"
          "    Ricolorare alla cieca distrugge le illustrazioni: guarda il render dopo ogni modifica.")


if __name__ == "__main__":
    main()
