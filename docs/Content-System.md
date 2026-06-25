# Content System

## Goal

Die Content-Schicht trennt frei editierbare Inhalte von Seiten- und Komponentenlogik. Texte liegen als Markdown-Dateien vor, strukturierte Terminal-Daten als YAML-Dateien.

## Folders

- `src/content/text/`
  - Freie Texte als `.md`.
  - Der sichtbare Text steht im Markdown-Body.
  - Die Dateien setzen keine inhaltlichen Frontmatter-Felder voraus.
  - Zeilenumbrüche dürfen für die Bearbeitung gesetzt werden; der sichtbare Umbruch folgt dem Browser.
- `src/content/data/`
  - Strukturierte Daten als `.yaml`.
  - Genutzt für Dictionaries, Tabellen und Listen.
  - YAML-Blockstrings wie `value: |` sind erlaubt, haben aber keine eigene Layout-Bedeutung.

## Collections

- `text`
  - Lädt `src/content/text/**/*.md`.
  - Wird über `getTextContent(src)` gelesen und mit Astro gerendert.
- `data`
  - Lädt `src/content/data/**/*.yaml`.
  - Unterstützt `rows`, `entries`, `items`, `columns` und Tabellen-`rows`.

## Data Shapes

Dictionary:

```yaml
rows:
  - label: "name"
    value: "Valentin Dibbern"
```

Mehrere Dictionaries in einer Datei:

```yaml
entries:
  - id: "website"
    command: "open project Website"
    rows:
      - label: "stack"
        value: "Astro, TypeScript, Tailwind"
```

Liste:

```yaml
items:
  - "GitHub: github.com/valentindibbern"
```

Tabelle:

```yaml
columns:
  - key: "sprachen"
    label: "Sprachen"
rows:
  - sprachen: "Python"
```

## Loading Rules

- Terminal-Komponenten erhalten eine logische Quelle über `src`.
- `TerminalText src="abouttext"` liest `src/content/text/abouttext.md`.
- `TerminalDictionary src="profile"` liest `src/content/data/profile.yaml`.
- `TerminalTable src="skills"` liest `src/content/data/skills.yaml`.
- `TerminalList src="links"` liest `src/content/data/links.yaml`.
- Seiten setzen die Reihenfolge und rendern `TerminalCommand` vor der passenden Output-Komponente.
- Die Ausbildung- und Erfahrungseinträge auf `src/pages/about.astro` sind statisches HTML. Ihre Commands sind bewusst leer, damit sie direkt im Markup ergänzt werden können.

## Current Inventory

- Texte:
  - `abouttext.md`
  - `home-lede.md`
- Daten:
  - `profile.yaml`
  - `projects.yaml`
  - `references.yaml`
  - `terminal.yaml`
  - `skills.yaml`
  - `links.yaml`
  - `languages.yaml`
  - `hobbies.yaml`

## Editing Rules

- Fließtexte in `src/content/text/*.md` bearbeiten.
- Strukturierte Listen, Tabellen und Label-/Value-Daten in `src/content/data/*.yaml` bearbeiten.
- Reihenfolge innerhalb einer YAML-Liste ist die sichtbare Reihenfolge.
- Manuelle Zeilenumbrüche in Content-Dateien sind editorfreundlich, erzwingen aber keinen sichtbaren Umbruch.
- Neue Terminal-Ausgaben brauchen eine passende Output-Komponente oder eine bestehende Datenform.
- Keine großen Inhaltsblöcke in Markdown-Frontmatter verschieben.
