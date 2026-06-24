# Components

## TerminalHeading

Datei: `src/components/TerminalHeading.astro`

- Rendert ASCII-Überschriften mit `figlet`.
- Props:
  - `text`: sichtbarer Klartext und Eingabe für die ASCII-Ausgabe.
  - `size`: erlaubte Figlet-Fonts `Big` oder `Small`.
  - `id`: optionaler Anker für `aria-labelledby`.
  - `level`: optionale HTML-Überschriftenebene `1`, `2` oder `3`, Standard `1`.
- Ausgabe:
  - semantisches `h1`, `h2` oder `h3`
  - Klartext für Screenreader
  - sichtbare ASCII-Ausgabe in einem horizontal scrollbar gehaltenen Span
- Typische Nutzung:
  - Home nutzt `size="Big"`.
  - Unterseiten nutzen `size="Small"`.

## TerminalCommand

Datei: `src/components/TerminalCommand.astro`

- Rendert nur die Bash-artige Prompt- und Command-Zeile.
- Props:
  - `command`: sichtbarer Befehl.
  - `path`: optionaler Pfad, Standard `~`.
- Ausgabeformat: `visitor@portfolio:~/about$ cat profile.yaml`.
- Lädt keinen Content.

## TerminalText

Datei: `src/components/TerminalText.astro`

- Rendert Markdown-Text aus `src/content/text/*.md`.
- Props:
  - `src`: Dateiname ohne `.md`.
- Beispiel: `src="abouttext"` lädt `src/content/text/abouttext.md`.
- Macht keine eigene Textformatierungslogik.
- Zeilenumbrüche folgen dem normalen Browser-Wrap.

## TerminalDictionary

Datei: `src/components/TerminalDictionary.astro`

- Rendert Label-/Value-Daten als semantisches `dl`.
- Props:
  - `src`: YAML-Dateiname ohne `.yaml`.
  - `entry`: optionaler Eintrag in Dateien mit mehreren Dictionaries.
- Erwartet `rows` oder einen passenden Eintrag unter `entries`.
- Values folgen dem normalen Browser-Wrap; Zeilenumbrüche in YAML sind keine Layout-Anweisung.

## TerminalTable

Datei: `src/components/TerminalTable.astro`

- Rendert Tabellen aus YAML.
- Props:
  - `src`: YAML-Dateiname ohne `.yaml`.
- Erwartet `columns` und `rows`.
- Tabellenzellen dürfen normal umbrechen; horizontaler Scroll bleibt nur ein Fallback.

## TerminalList

Datei: `src/components/TerminalList.astro`

- Rendert einfache Listen aus YAML.
- Props:
  - `src`: YAML-Dateiname ohne `.yaml`.
- Erwartet `items`.
- Wird auch für ehemals JSON-artige Link-Ausgaben genutzt.
- Listeneinträge folgen dem normalen Browser-Wrap.

## HeaderComponent

Datei: `src/components/HeaderComponent.astro`

- Globale Kopfzeile.
- Zeigt den aktuellen Seitentitel im Terminal-Stil.
- Bindet die Navigation ein.

## NavComponent

Datei: `src/components/NavComponent.astro`

- Rendert Navigationslinks aus `src/config/navigation.ts`.
- Markiert den aktuellen Link.
- Nutzt `withBase()` für GitHub-Pages-kompatible URLs.

## BaseLayout

Datei: `src/layouts/BaseLayout.astro`

- Globaler Seitenrahmen.
- Setzt HTML-Grundstruktur, Meta-Tags, Header und globales CSS.

## Component Guidelines

- Terminal-Ausgaben werden flach komponiert: erst `TerminalCommand`, dann genau eine Output-Komponente.
- Output-Komponenten laden ihre Inhalte selbst über `src`.
- Content-Ausgaben überlassen den sichtbaren Zeilenumbruch dem Browser; vorformatierte Ausgabe ist nur für bewusst generierte ASCII-Elemente wie `TerminalHeading` vorgesehen.
- Seiten bestimmen Reihenfolge und Kontext, nicht die Datenform.
- Vertikale Abstände werden in `src/styles/global.css` über gemeinsame Terminal-Klassen gesteuert; Blöcke sollen als durchlaufender Terminal-Textfluss wirken, nicht als voneinander getrennte Karten.
- Neue Komponenten brauchen eine kurze Beschreibung in dieser Datei.
