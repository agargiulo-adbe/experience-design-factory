#!/usr/bin/env python3
"""
account-tidy — la cartella di un account, riordinata secondo una tassonomia sola.

PERCHÉ ESISTE
Il 23 ott 2026 la cartella Enel aveva 27 elementi in radice: contratti firmati,
export di sistema, analisi nostre, consegnati al cliente e screenshot, tutti
allo stesso livello, con quattro convenzioni di nome diverse. E la copia su
Teams di un file era più nuova di quella in locale senza che nulla lo dicesse.
Una cartella così si legge solo se la si è costruita; chiunque altro — o noi
fra un mese — ci perde mezz'ora.

LA TASSONOMIA
  ACCOUNT.md         il registro: resta in radice, è il punto d'ingresso
  01-contratti/      GFA, Sales Order, DX firmati, Product Description
  02-dati/           export di sistema, footprint, fatture, demand plan
  03-analisi/        i nostri .md e .xlsx di lavoro, non usciti
  05-fonti/          trascrizioni, allegati ricevuti, screenshot
  _superato/<anno>/  ciò che non vale più e non si cancella
  build/             i generatori — nome invariato
  output/           ⚠️ È il «04-consegnato» della tassonomia approvata, ma il
                     nome resta `output` perché è il percorso che i generatori
                     in build/ hanno scritto dentro (`QUI.parent / "output"`).
                     Rinominarlo romperebbe ogni builder di ogni account per
                     guadagnare una parola. La cartella è quella: cambia solo
                     l'etichetta.

IL NOME DEI FILE
  AAAAMMGG_<Account>_<Perimetro>_<oggetto>[_vN].<est>
  - la data è quella del CONTENUTO, non del salvataggio;
  - il perimetro viene da un elenco chiuso (vedi PERIMETRI);
  - l'oggetto è in minuscolo con trattini: niente spazi, niente accenti,
    niente emoji — spezzano gli URL di SharePoint.

LA REGOLA CHE PROTEGGE I LINK GIÀ GIRATI
Rinominare un file già sincronizzato su SharePoint ne crea uno nuovo e rompe i
link condivisi con i colleghi. Quindi: si rinomina solo ciò che su Teams NON
c'è. Ciò che c'è si segnala e si lascia stare.

IL TAG BLU
Blu = esiste anche nella cartella Teams. Si applica da entrambi i lati. Dove i
due file differiscono per data o dimensione, non si tagga: si segnala, perché
un tag che dice «sincronizzato» su due file diversi è peggio di nessun tag.

USO
  python3 scripts/account-tidy.py Enel              # dry-run, non tocca niente
  python3 scripts/account-tidy.py Enel --esegui     # sposta e rinomina
  python3 scripts/account-tidy.py Enel --esegui --tag
  python3 scripts/account-tidy.py --tutti           # dry-run su ogni account
"""
import argparse
import pathlib
import plistlib
import re
import shutil
import subprocess
import sys
import unicodedata
from datetime import datetime

RADICE = pathlib.Path(__file__).resolve().parents[1]
DOCS = RADICE / "docs"
ONEDRIVE = pathlib.Path.home() / "Library/CloudStorage/OneDrive-Adobe"

# Cartelle sotto docs/ che NON sono account: depositi e materiale di lavoro.
NON_ACCOUNT = {"Adobe Material", "Factory", "Claude", "superpowers"}

CARTELLE = ["01-contratti", "02-dati", "03-analisi", "05-fonti"]

PERIMETRI = ["CJA", "AA", "RTCDP", "AT", "Sites", "Commerce", "Campaign",
             "AJO", "AEM", "Gruppo", "Endesa", "LATAM", "Contratto"]

NOME_OK = re.compile(
    r"^(\d{8})_([A-Za-z0-9]+)_([A-Za-z0-9]+)_([a-z0-9-]+)(_v\d+)?\.[a-z0-9]+$")

# ── classificazione ─────────────────────────────────────────────────────────
# L'ordine conta: la prima regola che aggancia vince. Le regole guardano il
# nome, non il contenuto: un file si classifica da come è stato chiamato, e
# quando il nome non basta finisce in 03-analisi, che è il default onesto.
REGOLE = [
    ("_superato", lambda n: bool(re.search(r"\.pre\d|\.bak$|~$|\.old$", n))),
    ("01-contratti", lambda n: any(k in n.lower() for k in (
        "gfa", "signed", "firma", "contratto", "proposta_contratto",
        "sales order", "salesorder", "dx for", "product description"))),
    ("02-dati", lambda n: any(k in n.lower() for k in (
        "usage", "dashboard", "invoice", "fattur", "demand", "entitlement",
        "footprint", "_data", "export")) or n.lower().endswith((".xlsm",))),
    ("05-fonti", lambda n: any(k in n.lower() for k in (
        "screenshot", "trascrizione", "transcript", "riunione", "call_",
        "plaud")) or n.lower().endswith((".png", ".jpg", ".jpeg", ".eml",
                                         ".msg", ".txt", ".mp4", ".m4a"))),
    ("03-analisi", lambda n: True),
]


def classifica(nome: str) -> str:
    for dest, prova in REGOLE:
        if prova(nome):
            return dest
    return "03-analisi"


def ascii_piano(s: str) -> str:
    """Toglie accenti ed emoji: restano lettere, cifre e trattini."""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.encode("ascii", "ignore").decode()
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return re.sub(r"-{2,}", "-", s)


def plausibile(otto: str) -> bool:
    """Otto cifre non sono una data: `01164971` e' il numero di contratto del
    GFA, e letto come data darebbe l'anno 0116. Si accetta solo cio' che e'
    davvero una data di questo secolo."""
    try:
        datetime.strptime(otto, "%Y%m%d")
    except ValueError:
        return False
    return 2000 <= int(otto[:4]) <= 2099


def proponi_nome(f: pathlib.Path, account: str) -> str | None:
    """Il nome secondo la convenzione, o None se già conforme."""
    if NOME_OK.match(f.name):
        return None
    testo = f.stem
    m = re.match(r"^(\d{8})[_\- ]*(.*)$", testo)
    if m and plausibile(m.group(1)):
        data, resto = m.group(1), m.group(2)
    else:
        data = datetime.fromtimestamp(f.stat().st_mtime).strftime("%Y%m%d")
        resto = testo
    # il perimetro, se compare nel nome; altrimenti Gruppo, che è il default
    # meno sbagliato: dice «riguarda l'account», non «riguarda questo prodotto»
    perimetro = "Gruppo"
    for p in PERIMETRI:
        if re.search(rf"(?<![A-Za-z]){re.escape(p)}(?![A-Za-z])", resto, re.I):
            perimetro = p
            resto = re.sub(rf"(?<![A-Za-z]){re.escape(p)}(?![A-Za-z])", "",
                           resto, flags=re.I)
            break
    resto = re.sub(rf"^{re.escape(account)}[_\- ]*", "", resto, flags=re.I)
    oggetto = ascii_piano(resto) or "senza-titolo"
    return f"{data}_{account}_{perimetro}_{oggetto}{f.suffix.lower()}"


# ── Teams ───────────────────────────────────────────────────────────────────
def cartella_teams(account: str) -> pathlib.Path | None:
    """La cartella Teams di un account si DICHIARA, non si indovina: il nome
    su OneDrive non somiglia a quello in docs/ (Enel sta sotto
    «🇮🇹  Italy Team - IL-ENEL»). La mappa vive accanto ad alias_cartelle.md."""
    mappa = DOCS / "Adobe/Radar/teams_cartelle.md"
    if not mappa.exists():
        return None
    for riga in mappa.read_text(encoding="utf-8").splitlines():
        if "=" not in riga or riga.strip().startswith("#"):
            continue
        sx, dx = (p.strip() for p in riga.split("=", 1))
        if sx.lower() == account.lower():
            p = ONEDRIVE / dx
            return p if p.exists() else None
    return None


def indice_teams(radice: pathlib.Path) -> dict[str, pathlib.Path]:
    out = {}
    if not radice:
        return out
    for f in radice.rglob("*"):
        if f.is_file() and not f.name.startswith("."):
            out.setdefault(f.name, f)
    return out


OFFICE = {".pptx", ".docx", ".xlsx"}


def testo_office(f: pathlib.Path):
    """Il testo dentro un pacchetto Office, o None se non si riesce a leggerlo.

    Un .pptx è uno zip di XML: il contenuto che conta sono le stringhe fra
    <a:t> (slide), <w:t> (Word) e <t> (celle di Excel). Tutto il resto —
    ordine dei file nello zip, metadati, timestamp interni, perfino la
    compressione — cambia a ogni salvataggio senza che il documento cambi."""
    import re
    import zipfile
    try:
        z = zipfile.ZipFile(f)
    except Exception:
        return None
    pezzi = []
    for n in sorted(z.namelist()):
        if not re.match(r"(ppt/slides/slide|word/document|xl/sharedStrings)", n):
            continue
        if not n.endswith(".xml"):
            continue
        try:
            x = z.read(n).decode("utf8", "replace")
        except Exception:
            return None
        pezzi += re.findall(r"<(?:a:t|w:t|t)[^>]*>([^<]*)</(?:a:t|w:t|t)>", x)
    # Lo spazio NON conta: PowerPoint riscrive la spaziatura interna dei run a
    # ogni salvataggio, e un «Portiamo  il  cumulato» contro «Portiamo il
    # cumulato» è lo stesso documento. Misurato il 24 ott 2026 su due slide su
    # tre di un deck dove l'unica differenza vera stava sulla terza.
    return " ".join(" ".join(pezzi).split())


def allineati(a: pathlib.Path, b: pathlib.Path) -> bool:
    """Due copie sono la stessa cosa? Né la dimensione né la data lo dicono.

    SharePoint RISCRIVE i pacchetti Office quando li riceve: aggiunge i propri
    metadati dentro lo zip, e un .pptx appena caricato torna più grande di
    qualche KB senza che una virgola del contenuto sia cambiata. Misurato il
    24 ott 2026: tre .pptx su tre, sempre Teams più grande, uno dei quali
    copiato trenta secondi prima.

    La prima versione guardava allora la DATA, dentro una finestra di cinque
    minuti. Anche quella sbagliava, e nello stesso giro: un deck ricostruito in
    locale diciassette ore dopo il caricamento usciva «divergente» pur avendo
    le undici slide identiche parola per parola. Data e dimensione sono indizi;
    il contenuto è la prova, e su un pacchetto Office si legge.

    Quindi: sui formati Office si confronta IL TESTO. Altrove resta la
    dimensione, che per un PDF o un CSV è un proxy onesto."""
    if a.suffix.lower() in OFFICE and b.suffix.lower() in OFFICE:
        ta, tb = testo_office(a), testo_office(b)
        if ta is not None and tb is not None:
            return ta == tb
    sa, sb = a.stat(), b.stat()
    if abs(sa.st_mtime - sb.st_mtime) <= 300:
        return True
    return sa.st_size == sb.st_size


def togli_tag(f: pathlib.Path) -> None:
    """Un file divergente NON deve restare blu: il blu dice «le due copie sono
    la stessa», e su due copie diverse è un'informazione falsa. Si toglie."""
    subprocess.run(["xattr", "-d", "com.apple.metadata:_kMDItemUserTags",
                    str(f)], check=False, capture_output=True)


def tag_blu(f: pathlib.Path) -> None:
    """Il tag blu di Finder è un plist binario in un attributo esteso."""
    dati = plistlib.dumps(["Blu\n4"], fmt=plistlib.FMT_BINARY)
    subprocess.run(["xattr", "-wx", "com.apple.metadata:_kMDItemUserTags",
                    dati.hex(), str(f)], check=False,
                   capture_output=True)


# ── il giro ─────────────────────────────────────────────────────────────────
def giro(account: str, esegui: bool, tag: bool) -> int:
    base = DOCS / account
    if not base.is_dir():
        print(f"{account}: cartella inesistente")
        return 1
    teams = cartella_teams(account)
    idx = indice_teams(teams)
    slug = ascii_piano(account).replace("-", "").capitalize() or account

    print(f"\n{'═' * 72}\n{account}" + (
        f"  ·  Teams: {teams.name}" if teams else "  ·  Teams: non dichiarato"))
    sposta, rinomina, blu, divergenti, fermi = [], [], [], [], []

    for f in sorted(base.iterdir()):
        if f.name.startswith(".") or f.is_dir():
            continue
        if f.name in ("ACCOUNT.md", "CLAUDE.md"):
            continue
        dest = classifica(f.name)
        if dest == "_superato":
            anno = datetime.fromtimestamp(f.stat().st_mtime).strftime("%Y")
            dest = f"_superato/{anno}"
        if dest.startswith("_superato"):
            sposta.append((f, dest, None))
            continue
        gemello = idx.get(f.name)
        if gemello:
            a, b = f.stat(), gemello.stat()
            if not allineati(f, gemello):
                divergenti.append((f, gemello, a.st_size, b.st_size))
            else:
                blu.append((f, gemello))
            fermi.append(f.name)          # su Teams: non si rinomina
            nuovo = None
        else:
            nuovo = proponi_nome(f, slug)
        sposta.append((f, dest, nuovo))
        if nuovo:
            rinomina.append((f.name, nuovo))

    for f, dest, nuovo in sposta:
        freccia = f"{dest}/{nuovo or f.name}"
        nota = "  ← su Teams, nome invariato" if f.name in fermi else ""
        print(f"  {f.name[:46]:<48} → {freccia}{nota}")

    if divergenti:
        print("\n  ⚠️  DIVERGENTI da Teams — non taggo, decide una persona:")
        for f, g, sa, sb in divergenti:
            print(f"     {f.name}: locale {sa:,} B · Teams {sb:,} B "
                  f"({'Teams più grande' if sb > sa else 'locale più grande'})")
    if blu:
        print(f"\n  tag blu: {len(blu)} file presenti su entrambi i lati")

    cons = base / "output"
    if teams and cons.is_dir():
        extra_blu, extra_div = [], []
        for f in sorted(cons.iterdir()):
            g = idx.get(f.name) if f.is_file() else None
            if not g:
                continue
            (extra_blu if allineati(f, g) else extra_div).append((f, g))
        if extra_div:
            print("\n  ⚠️  output/ DIVERGENTE da Teams:")
            from datetime import datetime as _dt
            for f, g in extra_div:
                ql = _dt.fromtimestamp(f.stat().st_mtime).strftime("%d/%m %H:%M")
                qt = _dt.fromtimestamp(g.stat().st_mtime).strftime("%d/%m %H:%M")
                piu = "Teams più recente" if g.stat().st_mtime > f.stat().st_mtime \
                      else "locale più recente"
                print(f"     {f.name}: locale {ql} · Teams {qt} — {piu}")
        if extra_blu:
            print(f"  output/: {len(extra_blu)} file allineati con Teams")
        if esegui and tag:
            for f, g in extra_blu:
                tag_blu(f); tag_blu(g)
            for f, g in extra_div:
                togli_tag(f); togli_tag(g)

    if not esegui:
        print("\n  (dry-run: non ho toccato niente. --esegui per applicare)")
        return 0

    for cart in CARTELLE:
        (base / cart).mkdir(exist_ok=True)
    for f, dest, nuovo in sposta:
        d = base / dest
        d.mkdir(parents=True, exist_ok=True)
        destinazione = d / (nuovo or f.name)
        if destinazione.exists():
            print(f"  ! esiste già, salto: {destinazione.name}")
            continue
        shutil.move(str(f), str(destinazione))
        if tag and f.name in fermi and idx.get(f.name):
            tag_blu(destinazione)
            tag_blu(idx[f.name])
    print(f"\n  fatto: {len(sposta)} file, {len(rinomina)} rinominati"
          + (f", {len(blu)} taggati" if tag else ""))
    return 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("account", nargs="?")
    ap.add_argument("--tutti", action="store_true")
    ap.add_argument("--esegui", action="store_true")
    ap.add_argument("--tag", action="store_true")
    a = ap.parse_args()
    if a.tutti:
        for d in sorted(DOCS.iterdir()):
            if d.is_dir() and d.name not in NON_ACCOUNT \
                    and (d / "ACCOUNT.md").exists():
                giro(d.name, False, False)
        return 0
    if not a.account:
        ap.error("serve un account, oppure --tutti")
    return giro(a.account, a.esegui, a.tag)


if __name__ == "__main__":
    sys.exit(main())
