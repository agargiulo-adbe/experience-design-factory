#!/usr/bin/env python3
"""posta — cercare nella posta locale di Outlook senza sbagliare il verdetto.

PERCHÉ ESISTE
Il connettore Microsoft 365 non è sempre raggiungibile, e lo store legacy di
Outlook si è fermato al 2023: la posta recente vive in `HxStore.hxd`, che è un
flusso **LZ4 a blocchi**. Il 15 ottobre 2026 ho cercato una stringa con un
`grep` sui byte grezzi di quel file, ho contato le occorrenze e ho concluso che
una mail non era mai partita. Era partita. Due cause, tutte e due strutturali:

1. **Cercare nei byte compressi non trova il testo, trova i residui.** In LZ4
   una stringa è nei byte solo se cade **tutta dentro un run di letterali**.
   Tutto ciò che il compressore ha codificato come riferimento a un'occorrenza
   precedente sparisce, e sparisce **proprio ciò che si ripete** — i nomi dei
   destinatari ripetuti lungo un thread sono il caso peggiore. Anche la prima
   occorrenza può sparire, se una sua sottostringa era già comparsa: la frase
   «one question still open», presente in una mail inviata, dà **zero** hit sui
   byte grezzi. Contare le occorrenze lì non misura niente.

2. **Lo store è vivo.** Fra due letture distanti pochi minuti il file è passato
   da 40,7 MB a 88,9 MB e i conteggi sono cambiati sotto mano. Una ricerca su
   un file che Outlook sta scrivendo non è una fotografia.

E una causa di metodo, la peggiore: ho usato **assenza di prova come prova di
assenza** su una fonte che sapevo lossy — contro una regola già scritta nel
repo (`fonti-cliente-gerarchia`).

LA REGOLA
Sul contenuto della posta non si risponde mai dai byte grezzi. Si decomprime,
si cerca nel testo, e il verdetto porta sempre con sé la data e la dimensione
dello store su cui è stato dato.

USO
    python3 docs/Claude/posta.py indicizza
    python3 docs/Claude/posta.py cerca "Sal Daoud"
    python3 docs/Claude/posta.py cerca "Intermonte" --contesto 600

L'indice sta nella cache di sessione, non nel repo. `cerca` reindicizza da sé
se lo store è cambiato di dimensione dall'ultima volta.
"""
import argparse
import hashlib
import json
import os
import pathlib
import re
import sys
import time

STORE = pathlib.Path(os.path.expanduser(
    "~/Library/Group Containers/UBF8T346G9.Office/Outlook/"
    "Outlook 15 Profiles/Main Profile/HxStore.hxd"))
CACHE = pathlib.Path(os.path.expanduser("~/.cache/posta-outlook"))
INDICE = CACHE / "indice.txt"
META = CACHE / "indice.json"


def lz4_decode(src, pos, limit_out=400_000):
    """Blocco LZ4 grezzo. Ritorna (output, posizione finale, motivo di stop)."""
    out = bytearray()
    n = len(src)
    while pos < n:
        tok = src[pos]; pos += 1
        ll = tok >> 4
        if ll == 15:
            while True:
                if pos >= n:
                    return out, pos, "eof"
                b = src[pos]; pos += 1; ll += b
                if b != 255:
                    break
        if pos + ll > n:
            return out, pos, "eof"
        out += src[pos:pos + ll]; pos += ll
        if pos + 2 > n:
            return out, pos, "fine"
        off = src[pos] | (src[pos + 1] << 8); pos += 2
        if off == 0 or off > len(out):
            return out, pos, "off"
        ml = tok & 0xF
        if ml == 15:
            while True:
                if pos >= n:
                    return out, pos, "eof"
                b = src[pos]; pos += 1; ml += b
                if b != 255:
                    break
        ml += 4
        start = len(out) - off
        for k in range(ml):
            out.append(out[start + k])
        if len(out) > limit_out:
            return out, pos, "limite"
    return out, pos, "fine"


def _pulisci(blob):
    """Da byte decompressi a testo leggibile, senza perdere gli a capo."""
    testo = blob.decode("utf-8", "replace")
    #  I campi di sistema sono UTF-16: si appiattiscono togliendo i NUL.
    testo = testo.replace("\x00", "")
    testo = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", testo, flags=re.S | re.I)
    testo = re.sub(r"<br\s*/?>", "\n", testo, flags=re.I)
    testo = re.sub(r"</(p|div|li|tr|h[1-6])>", "\n", testo, flags=re.I)
    testo = re.sub(r"<[^>]{0,400}>", " ", testo)
    testo = re.sub(r"[^\S\n]{2,}", " ", testo)
    testo = re.sub(r"\n{3,}", "\n\n", testo)
    return testo


def indicizza(verboso=True):
    if not STORE.exists():
        sys.exit(f"store non trovato: {STORE}")
    dati = STORE.read_bytes()
    t0 = time.time()
    ancora = "IPM.".encode("utf-16-le")
    ancore, i = [], 0
    while True:
        i = dati.find(ancora, i)
        if i < 0:
            break
        ancore.append(i); i += 1

    CACHE.mkdir(parents=True, exist_ok=True)
    visti, pezzi = set(), []
    for a in ancore:
        migliore = None
        for s in range(max(0, a - 3000), a + 1):
            out, endpos, _ = lz4_decode(dati, s, limit_out=400_000)
            if len(out) > 2000 and endpos > a:
                if migliore is None or len(out) > migliore[0]:
                    migliore = (len(out), s, bytes(out))
        if not migliore:
            continue
        _, s, blob = migliore
        h = hashlib.md5(blob).hexdigest()
        if h in visti:
            continue
        visti.add(h)
        pezzi.append(f"\n\n===== blocco @{s} =====\n{_pulisci(blob)}")

    INDICE.write_text("".join(pezzi), encoding="utf-8")
    META.write_text(json.dumps({
        "store_bytes": len(dati),
        "indicizzato": time.strftime("%Y-%m-%d %H:%M:%S"),
        "ancore": len(ancore),
        "blocchi": len(pezzi),
        "indice_bytes": INDICE.stat().st_size,
    }, indent=2), encoding="utf-8")
    if verboso:
        print(f"store {len(dati):,} byte · {len(ancore)} ancore · "
              f"{len(pezzi)} blocchi · indice {INDICE.stat().st_size:,} byte · "
              f"{time.time() - t0:.1f}s".replace(",", "."))


def _indice_fresco():
    if not INDICE.exists() or not META.exists():
        return False
    m = json.loads(META.read_text())
    return m.get("store_bytes") == STORE.stat().st_size


def cerca(ago, contesto):
    if not _indice_fresco():
        print("indice assente o vecchio: reindicizzo", file=sys.stderr)
        indicizza(verboso=True)
    m = json.loads(META.read_text())
    testo = INDICE.read_text(encoding="utf-8")
    trovati = [x.start() for x in re.finditer(re.escape(ago), testo, re.I)]
    print(f"«{ago}» · {len(trovati)} occorrenze nel testo decompresso")
    print(f"indice del {m['indicizzato']} su uno store di "
          f"{m['store_bytes']:,} byte".replace(",", "."))
    if not trovati:
        print("\nATTENZIONE: zero occorrenze NON vuol dire che la mail non esista.\n"
              "L'indice copre i blocchi ancorati a IPM.*; lo store è vivo e cresce.\n"
              "Prima di dire «non è mai partita», guarda in Outlook.")
    for k, i in enumerate(trovati[:12], 1):
        frammento = testo[max(0, i - contesto // 2): i + contesto // 2]
        frammento = re.sub(r"\n+", " ⏎ ", frammento)
        print(f"\n--- {k} ---\n{frammento}")
    if len(trovati) > 12:
        print(f"\n… e altre {len(trovati) - 12}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("indicizza")
    c = sub.add_parser("cerca")
    c.add_argument("ago")
    c.add_argument("--contesto", type=int, default=420)
    a = ap.parse_args()
    if a.cmd == "indicizza":
        indicizza()
    else:
        cerca(a.ago, a.contesto)
