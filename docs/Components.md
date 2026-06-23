# Components

## TerminalOutput

Datei: `src/components/TerminalOutput.astro`

- Zweck: standardisierte Terminal-Ausgabe für Projekt-, Referenz- und Profiltexte.
- Eingaben:
  - `command`: angezeigter Terminal-Befehl.
  - `body`: der auszugebende Textblock.
  - `rows`: optionale strukturierte Ausgabe als Liste aus Label-/Value-Paaren.
  - `path`: optionaler Prompt-Pfad, Standard `~`.
- Ausgabe:
  - Ein `<article>` mit Promptzeile und entweder vorformatiertem Output oder semantischen `dl`-Paaren.
- Typische Nutzung:
  - Projektausgaben
  - Referenzen
  - Profil- und Ausbildungsblöcke
- Styling:
  - Values nutzen die Terminal-Akzentfarbe, Labels bleiben gedimmt.
  - Row-Labels sind linksbündig in einer `max-content`-Spalte ausgerichtet, damit Values auf gleicher Höhe beginnen und kürzere Labels sichtbaren Abstand zum Content behalten.

## TerminalTable

Datei: `src/components/TerminalTable.astro`

- Zweck: terminalartige Tabellen für strukturierte Listen wie Skills.
- Eingaben:
  - `command`: angezeigter Terminal-Befehl.
  - `columns`: Spaltendefinitionen mit `key` und `label`.
  - `rows`: Tabellenzeilen als einfache Key-Value-Objekte.
  - `path`: optionaler Prompt-Pfad, Standard `~`.
- Ausgabe:
  - Ein `<article>` mit Promptzeile und HTML-Tabelle.
- Styling:
  - Eine gestrichelte Linie trennt nur den Header von den Daten.
  - Es gibt keine vertikalen Linien und keine Trenner zwischen Datenzeilen.
  - Die Tabelle bleibt auf kleinen Viewports horizontal scrollbar.

## HeaderComponent

Datei: `src/components/HeaderComponent.astro`

- Zweck: globale Kopfzeile und Navigation über alle Seiten.
- Verantwortung:
  - aktuellen Seitentitel anzeigen
  - Navigation bereitstellen

## NavComponent

Datei: `src/components/NavComponent.astro`

- Zweck: Navigationslogik und Linkdarstellung aus einem zentralen Baustein.
- Verantwortung:
  - Seitenlinks bündeln
  - aktive bzw. wiederkehrende Navigationsmuster vereinheitlichen
- Datenquelle:
  - `src/config/navigation.ts`
- Base-URL:
  - berücksichtigt `import.meta.env.BASE_URL` für GitHub-Pages-Pfade.

## BaseLayout

Datei: `src/layouts/BaseLayout.astro`

- Zweck: globaler Seitenrahmen.
- Verantwortung:
  - HTML-Grundstruktur
  - Meta-Description
  - Seitentitel
  - konsistentes Top-Level-Markup sicherstellen
  - Header-Einbindung
  - globales CSS importieren

## Component Guidelines

- Komponenten sollen Präsentation und Content-Logik trennen.
- Content wird vor dem Rendern in den Seiten oder Utilities vorbereitet.
- Terminal-Komponenten bleiben bewusst simpel, damit ihre Ausgabe vorhersehbar bleibt.
- Wenn neue Komponenten entstehen, dokumentiere Zweck, Eingaben und typische Nutzung hier.
