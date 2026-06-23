# Content System

## Goal

Die Content-Schicht hält redaktionelle Inhalte aus den Seiten heraus. Texte, Listen, Tabellen und Terminal-Zeilen werden in Markdown-Dateien gepflegt und über generische Content-Blöcke gerendert.

## Collections

- `profile`
  - Ein einzelner Profil-Eintrag mit `name`, `role` und `blocks`.
  - Der Markdown-Body enthält den öffentlichen About-Fließtext.
- `projects`
  - Mehrere Projekt-Einträge mit `title`, `command`, `order` und `blocks`.
  - Sichtbare Projektdetails sind Rows innerhalb von Blöcken, nicht feste Schemafelder.
- `references`
  - Mehrere Referenz- und Nachweis-Einträge mit `title`, `command`, `order` und `blocks`.
- `terminal`
  - Terminalartige Detailblöcke für Ausbildung und Erfahrung.
  - Zusätzliches Pflichtfeld: `group` mit `education` oder `experience`.
- `snippets`
  - Kleine wiederverwendbare Textbausteine, Listen, Skill-Gruppen und JSON-Entries.

## Block Types

Alle blockbasierten Collections nutzen denselben Vertrag:

- `type`
  - Erlaubte Werte: `rows`, `table`, `list`, `json`, `text`.
- `command`
  - Terminal-Befehl, der im Prompt angezeigt wird.
- `order`
  - Numerische Sortierung innerhalb eines Eintrags.
- `path`
  - Optionaler Prompt-Pfad, wenn ein Block vom Seitenpfad abweichen soll.

Typabhängige Daten:

- `rows`
  - `rows: [{ label, value, kind?, meta? }]`
  - Für Label-/Value-Ausgaben wie Profil, Projekte oder Nachweise.
- `table`
  - `columns: [{ key, label }]`
  - `rows: Record<string, string>[]`
  - Für Tabellen mit frei änderbaren Spalten und Zeilen.
- `list`
  - `items: string[]`
  - Für einfache zeilenweise Ausgaben.
- `json`
  - `entries: [{ key, value }]`
  - Für JSON-artige Terminalausgaben.
- `text`
  - `body: string`
  - Für freien Textoutput.

## Implementation Points

- `src/content.config.ts`
  - Definiert den gemeinsamen Blockvertrag mit Zod.
  - Validiert Blockformen, aber keine redaktionellen Feldnamen wie `workingStyle`, `stack` oder `summary`.
- `src/utils/content.ts`
  - Stellt Loader-Funktionen wie `getProfile`, `getProjects`, `getReferences`, `getTerminalEntries` und `getSnippets` bereit.
  - Enthält generische Block-Helper wie `getBlocks`, `getFirstBlock`, `createSkillTableBlock`, `createListBlock`, `createLinksBlock`, `blockToBody` und `formatJsonEntries`.
  - Sortiert Collections über Entry-`order` und Blöcke über Block-`order`.
- `src/components/TerminalBlock.astro`
  - Delegiert anhand von `block.type` an `TerminalOutput` oder `TerminalTable`.
- `src/content/*`
  - Enthält die eigentlichen Markdown-Dateien.
  - Ist die primäre Stelle für Inhaltsänderungen.

## Data Path To The Website

1. Markdown-Dateien liegen unter `src/content/*`.
2. Jede Datei gehört über ihren Ordner zu einer Collection, z. B. `src/content/projects/*` zu `projects`.
3. `src/content.config.ts` lädt die Dateien mit `glob()` aus dem passenden Ordner.
4. Das jeweilige Schema validiert die generische Blockstruktur beim Astro-Check oder Build.
5. Seiten und Utilities greifen über `getCollection()` und `render()` aus `astro:content` auf die Einträge zu.
6. `src/utils/content.ts` kapselt wiederverwendbare Zugriffe, Sortierung und Ausgabeformatierung.
7. Seiten unter `src/pages/*` laden die vorbereiteten Daten zur Build-Zeit.
8. `TerminalBlock.astro`, `TerminalOutput.astro` und `TerminalTable.astro` rendern die Daten in HTML.
9. `bun build` erzeugt daraus statische Dateien in `dist/`.
10. GitHub Pages liefert die statische Website unter der konfigurierten Base-URL aus.

## Current Content Inventory

- `src/content/profile/main.md`
  - Frontmatter: `name`, `role`, `blocks`.
  - Markdown-Body: öffentlicher About-Fließtext.
  - Profilzeilen sind ein `rows`-Block. Werden Rows entfernt, ergänzt oder umsortiert, ändert sich die Website ohne Codeänderung.
- `src/content/projects/*.md`
  - Dateien: `website.md`, `neovimconfig.md`, `jahr-java-3-aufgaben.md`, `cmd-rechner.md`, `buecherantiquariat.md`.
  - Frontmatter: `title`, `command`, `order`, `blocks`.
  - Projektdetails wie Quelle, Typ, Stack und Summary sind normale Rows im ersten Block.
- `src/content/references/*.md`
  - Dateien: `references.md`, `school-records.md`, `delf-b1.md`.
  - Frontmatter: `title`, `command`, `order`, `blocks`.
  - Der sichtbare Referenztext liegt in Rows oder anderen Blocktypen.
- `src/content/terminal/*.md`
  - Dateien: `education-current.md`, `education-previous.md`, `cobra-software.md`, `klixar-it.md`.
  - Frontmatter: `title`, `command`, `order`, `group`, `blocks`.
  - `group` ist entweder `education` oder `experience`.
- `src/content/snippets/*.md`
  - Enthält kurze wiederverwendbare Texte und Listen.
  - `links.md` nutzt strukturierte `{ key, value }`-Entries.
  - `skills.md` nutzt Skill-Gruppen mit `category` und `items`; daraus wird eine Tabelle erzeugt.

## Editing Rules

- Strukturelle Daten gehören in Frontmatter.
- Längere Fließtexte gehören in den Markdown-Body.
- Wiederverwendbare Texte werden als Snippets gepflegt, nicht doppelt in Seiten kopiert.
- Sortierung erfolgt explizit über `order`, nicht über Dateinamen.
- Neue sichtbare Rows, Listenpunkte, JSON-Entries oder Tabellenzeilen sollen in bestehenden Blöcken ergänzt werden.
- Neue Darstellungstypen brauchen zuerst einen neuen Blocktyp im Schema, Utility-Layer, Renderer und in der Dokumentation.

## Consumer Behavior

- `index.astro` nutzt pro Bereich den ersten passenden Block oder ersten sortierten Collection-Eintrag.
- Unterseiten nutzen vollständige Collections und rendern alle Blöcke in Reihenfolge.
- Terminal-Ausgaben bleiben einfache Build-Zeit-Daten und werden nicht im Browser rekonstruiert.
- Strukturierte Rows werden als `dl` mit getrennten Label-/Value-Elementen gerendert und behalten auf kleinen Viewports eine lineare Lesbarkeit.
- Tabellen werden aus Content-Spalten und Content-Zeilen gebaut; Zeilen und Spalten sind nicht im Code hartkodiert.

## Failure Modes

- Fehlt ein Pflichtfeld des Blockvertrags, scheitert der Astro-Check oder Build.
- Kein oder mehr als ein `profile`-Eintrag führt in `getProfile()` zu einem Fehler.
- Unsichtbare Sortierfehler entstehen meist durch fehlende oder doppelte `order`-Werte.
- Ein Tabellen-Row-Objekt ohne passenden Column-Key rendert für diese Zelle leer.
