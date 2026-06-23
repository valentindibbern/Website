# Components

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

## TerminalDictionary

Datei: `src/components/TerminalDictionary.astro`

- Rendert Label-/Value-Daten als semantisches `dl`.
- Props:
  - `src`: YAML-Dateiname ohne `.yaml`.
  - `entry`: optionaler Eintrag in Dateien mit mehreren Dictionaries.
- Erwartet `rows` oder einen passenden Eintrag unter `entries`.

## TerminalTable

Datei: `src/components/TerminalTable.astro`

- Rendert Tabellen aus YAML.
- Props:
  - `src`: YAML-Dateiname ohne `.yaml`.
- Erwartet `columns` und `rows`.
- Tabellen bleiben auf kleinen Viewports horizontal scrollbar.

## TerminalList

Datei: `src/components/TerminalList.astro`

- Rendert einfache Listen aus YAML.
- Props:
  - `src`: YAML-Dateiname ohne `.yaml`.
- Erwartet `items`.
- Wird auch für ehemals JSON-artige Link-Ausgaben genutzt.

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
- Seiten bestimmen Reihenfolge und Kontext, nicht die Datenform.
- Neue Komponenten brauchen eine kurze Beschreibung in dieser Datei.
