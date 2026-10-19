#!/usr/bin/env python3
"""email — bozze di posta che sopravvivono al paste in Outlook.

PERCHÉ ESISTE
Il 15 ott 2026 una mail formattata a mano è uscita rotta nel compositore: la
tabella con i bordi aveva le righe doppie e disallineate, gli `<h3>` avevano
perso il grassetto, l'elenco numerato l'indentazione. Outlook rende con il
motore di Word, e quei costrutti non sopravvivono. Rifarla a mano ogni volta
vuol dire riscoprire gli stessi limiti ogni volta: meglio un generatore che li
conosce.

LA FORMA, DECISA DALL'OWNER (15 ott 2026)
Ogni mail: **corpo 11pt, interlinea 1,15**. Il carattere NON si dichiara, così
il corpo eredita il font di composizione di Outlook e combacia con la firma
invece di litigarci. Chi vuole forzarlo usa `--font`.

LE REGOLE CHE IL GENERATORE APPLICA DA SÉ
· niente `<h1>`–`<h6>`: i titoletti diventano paragrafi in grassetto;
· niente `<ol>`/`<ul>`: i numeri e i trattini si scrivono dentro il paragrafo;
· le tabelle sono **senza bordi** — allineano e basta, `border="0"` e padding
  nelle celle: con i bordi Word raddoppia le righe;
· tutto lo stile è inline, perché Outlook butta via il `<style>`.

SINTASSI DEL SORGENTE (un .md semplice)
    Hi Sal,                     → paragrafo
    ## What I need              → paragrafo in grassetto
    1. Prima domanda            → paragrafo con il numero in grassetto
    - Primo punto               → paragrafo con un trattino
    | Customer | Banca …  |     → riga di tabella senza bordi, 1ª colonna in neretto
    **grassetto** nel testo     → <b>

COME SI CONSEGNA — la bozza si apre formattata, non si incolla a mano
Il connettore Microsoft 365 **non** serve: ha `Mail.Read` ma non `Mail.ReadWrite`
(`outlook_create_draft` risponde 403) e per giunta rifiuta gli attributi
`style=`, quindi anche avendone il permesso il corpo uscirebbe senza il nostro
formato. La via che funziona, verificata il 19 ott 2026 guardando la finestra:
**AppleScript su Outlook, con l'HTML dentro la proprietà `content`**.

⚠️ Il readback inganna: `content of msg` restituisce i TAG, e sembra che Outlook
li tratti come testo. Non è così — li rende. L'unico modo di saperlo è
fotografare la finestra, ed è così che è stato deciso.

Due cose che Outlook fa da sé e di cui non ci si deve occupare: accoda la
**firma** (quindi nel sorgente non si mette) e salva la bozza.

USO
    python3 docs/Claude/email.py bozza.md
    → scrive bozza.html (da incollare) e bozza.txt (testo)

    python3 docs/Claude/email.py bozza.md --bozza \
        --a "destinatario@adobe.com" --cc "collega@adobe.com,altro@adobe.com" \
        --oggetto "Oggetto della mail"
    → apre in Outlook la bozza GIÀ FORMATTATA, destinatari compilati. Non invia.
In Outlook, se serve incollare a mano: Incolla speciale → Mantieni formattazione.
"""
import argparse
import html as H
import pathlib
import re

CORPO = "font-size:11pt;line-height:1.15"


def _inline(t):
    t = H.escape(t, quote=False)
    # [testo](url) -> link. Va prima del grassetto, cosi' un titolo puo' essere
    # anche un link senza che le due sostituzioni si pestino i piedi.
    t = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)",
               r'<a href="\2" style="color:#1F3864">\1</a>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = t.replace(" -- ", " &mdash; ").replace("—", "&mdash;")
    t = t.replace("'", "&rsquo;")
    return t


def componi(sorgente, font=None, larghezze=None):
    stile = CORPO + (f";font-family:{font}" if font else "")
    out, righe_tab = [], []

    def chiudi_tabella():
        """Tabella leggibile anche nel motore di Word.

        Lezione del 19 ott 2026: senza respiro verticale le righe si fondono e
        la tabella diventa un muro. Separano davvero tre cose, e nessuna usa
        bordi pieni (che in Word raddoppiano le righe): il padding generoso,
        lo zebrato leggero sulle righe, e una riga sola sotto l'intestazione.
        """
        if not righe_tab:
            return
        ncol = max(len(c) for c in righe_tab)
        larg = larghezze if larghezze and len(larghezze) == ncol else None
        out.append('<table border="0" cellspacing="0" cellpadding="0" '
                   'style="border:none;border-collapse:collapse;width:100%">')
        for n, celle in enumerate(righe_tab):
            intestazione = (n == 0)
            fondo = "" if intestazione or n % 2 else "background-color:#F6F8FA;"
            out.append("<tr>")
            for i, c in enumerate(celle):
                destra = "0" if i == ncol - 1 else "22px"
                pad = f"8px {destra} 8px 0"
                bordo = ("border-bottom:1.5pt solid #1F3864;"
                         if intestazione else "border:none;")
                w = f"width:{larg[i]}%;" if larg else ""
                testo = f"<b>{c}</b>" if (intestazione or i == 0) else c
                colore = "color:#1F3864;" if intestazione else ""
                out.append(f'<td style="{bordo}{fondo}{w}{colore}padding:{pad};'
                           f'vertical-align:top;{stile}">{testo}</td>')
            out.append("</tr>")
        out.append("</table>")
        out.append(f'<p style="{stile}">&nbsp;</p>')
        righe_tab.clear()

    for riga in sorgente.splitlines():
        r = riga.rstrip()
        if r.startswith("|"):
            celle = [_inline(c.strip()) for c in r.strip("|").split("|")]
            if all(set(c) <= set("-: ") for c in celle):
                continue                      # riga di separazione markdown
            righe_tab.append(celle)
            continue
        chiudi_tabella()
        if not r.strip():
            continue
        if r.startswith("## "):
            out.append(f'<p style="{stile}"><b>{_inline(r[3:].strip())}</b></p>')
        elif re.match(r"^\d+\.\s", r):
            n, testo = r.split(".", 1)
            out.append(f'<p style="{stile}"><b>{n}.</b>&nbsp; '
                       f'{_inline(testo.strip())}</p>')
        elif r.startswith("- "):
            out.append(f'<p style="{stile}">&ndash;&nbsp; '
                       f'{_inline(r[2:].strip())}</p>')
        else:
            out.append(f'<p style="{stile}">{_inline(r.strip())}</p>')
    chiudi_tabella()
    return "<div>\n" + "\n".join(out) + "\n</div>\n"


def testo_semplice(sorgente):
    fuori, tab = [], []

    def chiudi():
        if not tab:
            return
        w = max(len(c[0]) for c in tab)
        for c in tab:
            fuori.append((c[0] + ":").ljust(w + 2) + " ".join(c[1:]))
        fuori.append("")
        tab.clear()

    for riga in sorgente.splitlines():
        r = riga.rstrip()
        if r.startswith("|"):
            celle = [c.strip() for c in r.strip("|").split("|")]
            if not all(set(c) <= set("-: ") for c in celle):
                tab.append(celle)
            continue
        chiudi()
        if r.startswith("## "):
            fuori += ["", r[3:].strip(), ""]
        else:
            fuori.append(re.sub(r"\*\*(.+?)\*\*", r"\1", r))
    chiudi()
    t = "\n".join(fuori).replace(" -- ", " \u2014 ")
    return re.sub(r"\n{3,}", "\n\n", t).strip() + "\n"


def _as_str(t):
    """Una stringa AppleScript: si scappano backslash e virgolette, e basta."""
    return '"' + t.replace("\\", "\\\\").replace('"', '\\"') + '"'


def apri_bozza(html, oggetto, a, cc=(), ccn=(), allegati=()):
    """Apre in Outlook una bozza con il corpo GIÀ formattato. Non invia.

    L'HTML va nella proprietà `content`: Outlook lo rende (verificato a schermo
    il 19 ott 2026). Niente `save`: su Mac vuole un percorso file e fallisce con
    -1701 — `open` basta, la bozza la salva Outlook da sé.
    """
    import subprocess
    import tempfile

    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False,
                                     encoding="utf-8") as f:
        f.write(html)
        percorso = f.name

    def destinatari(tipo, elenco):
        return "\n".join(
            f'\tmake new {tipo} recipient at msg with properties '
            f'{{email address:{{address:{_as_str(x.strip())}}}}}'
            for x in elenco if x.strip())

    righe = [
        "set corpo to (read POSIX file " + _as_str(percorso) + " as \u00abclass utf8\u00bb)",
        'tell application "Microsoft Outlook"',
        "\tactivate",
        "\tset msg to make new outgoing message with properties {subject:"
        + _as_str(oggetto) + ", content:corpo}",
    ]
    righe += [destinatari("to", a), destinatari("cc", cc), destinatari("bcc", ccn)]
    # GLI ALLEGATI VANNO ATTACCATI PRIMA DI `open`. Una volta che la finestra
    # di composizione è aperta, Outlook non espone più il messaggio allo
    # scripting: `window` non ha una proprietà che ci riporti al `msg`, e
    # `outgoing message` non lo elenca. Verificato il 19 ott 2026 sondando
    # tutte e nove le finestre aperte. Quindi o si allega adesso, o si
    # ricompone la bozza da capo.
    for f in allegati:
        q = pathlib.Path(f).expanduser().resolve()
        if not q.exists():
            raise FileNotFoundError(f"allegato non trovato: {q}")
        righe.append('\tmake new attachment at msg with properties '
                     '{file:POSIX file ' + _as_str(str(q)) + '}')
    righe += ["\topen msg", "end tell"]
    scpt = "\n".join(r for r in righe if r)
    r = subprocess.run(["osascript", "-e", scpt], capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"Outlook non ha aperto la bozza: {r.stderr.strip()}")
    return percorso


if __name__ == "__main__":
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("sorgente", help="il .md con il corpo della mail")
    ap.add_argument("--font", default=None,
                    help="forza il carattere; di norma NON si dichiara")
    ap.add_argument("--widths", default=None,
                    help="larghezze colonne in %%, es. 26,30,44")
    ap.add_argument("--bozza", action="store_true",
                    help="apre la bozza formattata in Outlook (non invia)")
    ap.add_argument("--a", default="", help="destinatari, separati da virgola")
    ap.add_argument("--cc", default="", help="in copia, separati da virgola")
    ap.add_argument("--ccn", default="", help="in copia nascosta")
    ap.add_argument("--oggetto", default="", help="oggetto della mail")
    ap.add_argument("--allega", default="",
                    help="file da allegare, separati da virgola")
    a = ap.parse_args()
    p = pathlib.Path(a.sorgente)
    s = p.read_text(encoding="utf-8")
    p.with_suffix(".html").write_text(componi(s, a.font, [int(x) for x in a.widths.split(',')] if a.widths else None), encoding="utf-8")
    p.with_suffix(".txt").write_text(testo_semplice(s), encoding="utf-8")
    print(f"scritti: {p.with_suffix('.html').name} · {p.with_suffix('.txt').name}")
    print(f"corpo {CORPO}" + (f" · font {a.font}" if a.font else " · font ereditato"))
    if a.bozza:
        if not a.a or not a.oggetto:
            ap.error("--bozza vuole almeno --a e --oggetto")
        apri_bozza(p.with_suffix(".html").read_text(encoding="utf-8"),
                   a.oggetto, a.a.split(","), a.cc.split(","), a.ccn.split(","),
                   [x for x in a.allega.split(",") if x.strip()])
        n = len([x for x in a.allega.split(",") if x.strip()])
        print("bozza aperta in Outlook, formattata e NON inviata"
              + (f" · {n} allegati" if n else ""))
