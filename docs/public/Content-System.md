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
  - Genutzt für Dictionaries, Tabellen, Listen und die spezialisierte Projektliste.
  - YAML-Blockstrings wie `value: |` sind erlaubt, haben aber keine eigene Layout-Bedeutung.

## Collections

- `text`
  - Lädt `src/content/text/**/*.md`.
  - Wird über `getTextContent(src)` gelesen und mit Astro gerendert.
- `data`
  - Lädt `src/content/data/**/*.yaml`.
  - Unterstützt `rows`, `entries`, `items`, `columns` und Tabellen-`rows`.
  - `projects.yaml` nutzt ein spezialisiertes `projects`-Shape, damit Projektinhalte später mit GitHub-Daten gemerged werden können.

## Data Shapes

Dictionary:

```yaml
rows:
  - label: "name"
    value: "Valentin Dibbern"
  - label: "github"
    value: "GitHub"
    href: "https://github.com/valentindibbern"
    attributes:
      - "link"
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

Projektliste:

```yaml
projects:
  - id: "website"
    repo: "valentindibbern/valentindibbern.github.io"
    title: "Website"
    command: "open project Website"
    type: "persönliche Website"
    stack:
      - "Astro"
      - "TypeScript"
      - "Tailwind"
    summary: "statische Portfolio-Website im Terminal-/ASCII-Stil"
    source:
      label: "github.com/valentindibbern/valentindibbern.github.io"
      href: "https://github.com/valentindibbern/valentindibbern.github.io"
    featured: true
    order: 10
```

Liste:

```yaml
items:
  - "GitHub: github.com/valentindibbern"
  - label: "GitHub"
    value: "Profil"
    href: "https://github.com/valentindibbern"
    attributes:
      - "link"
```

Tabelle:

```yaml
columns:
  - key: "sprachen"
    label: "Sprachen"
  - key: "docs"
    label: "Docs"
rows:
  - sprachen: "Python"
    docs:
      value: "Python Docs"
      href: "https://docs.python.org"
      attributes:
        - "link"
```

## Value Attributes

- Dictionary-Werte, Listen-Werte und Tabellenzellen dürfen ein optionales `attributes`-Array haben.
- `attributes` ist Metadaten, wird nicht sichtbar ausgegeben und gilt nur für den Value, nicht für Labels oder Tabellen-Header.
- Aktuell ist im Schema nur `"link"` erlaubt. Weitere Attribute wie `"important"` müssen zuerst in `src/content.config.ts` ergänzt und in den Komponenten implementiert werden.
- `value` ist immer der sichtbare Text. `href` ist immer das technische Linkziel.
- `"link"` rendert den sichtbaren `value` als HTML-Link und verlangt ein nicht leeres `href`.
- Interne `href`-Werte mit einfachem `/` werden über die konfigurierte Base-URL gerendert; erlaubt sind außerdem `#`, `https:`, `mailto:` und `tel:`.
- Externe Weblinks müssen HTTPS verwenden; `http:` wird vom Schema und Renderer abgewiesen.
- Protokoll-relative Ziele wie `//example.com` werden abgewiesen, weil sie externe Links ohne explizit erlaubtes Scheme wären.
- Andere Schemes wie `javascript:` oder `data:` werden vom Schema abgewiesen.
- Unbekannte Felder werden bei Dictionary-Zeilen durch das strikte Schema abgewiesen.
- Sensible externe Ziele stehen nicht direkt in `links.yaml`. Solche Einträge verweisen auf lokale Gate-Routen wie `/application`.

## Loading Rules

- Terminal-Komponenten erhalten eine logische Quelle über `src`.
- `TerminalText src="abouttext"` liest `src/content/text/abouttext.md`.
- `TerminalDictionary src="profile"` liest `src/content/data/profile.yaml`.
- `TerminalTable src="skills"` liest `src/content/data/skills.yaml`.
- `TerminalDictionary src="links"` liest `src/content/data/links.yaml`.
- `projects.yaml` wird nicht über `TerminalDictionary` geladen, sondern über die spezialisierten Projektloader in `src/utils/content.ts`.
- Seiten setzen die Reihenfolge und rendern `TerminalCommand` vor der passenden Output-Komponente.
- Die Ausbildung- und Erfahrungseinträge auf `src/pages/about.astro` werden über einzelne Dictionary-Dateien wie `education-current.yaml`, `cobra-software.yaml` und `klixar-it.yaml` geladen. Ihre sichtbaren Terminal-Commands stehen direkt in der Seite.
- `education-previous.yaml` ist derzeit Content-Inventar, wird aber auf keiner öffentlichen Seite gerendert.
- `references.yaml` bleibt Content für den Entwurf `src/drafts/references.astro` und wird aktuell nicht auf einer öffentlichen Route gerendert.

## Current Inventory

- Texte:
  - `abouttext.md`
  - `home-lede.md`
- Daten:
  - `profile.yaml`
  - `projects.yaml`
  - `references.yaml`
  - `education-current.yaml`
  - `education-previous.yaml`
  - `cobra-software.yaml`
  - `klixar-it.yaml`
  - `skills.yaml`
  - `links.yaml`
  - `languages.yaml`
  - `hobbies.yaml`

## Editing Rules

- Fließtexte in `src/content/text/*.md` bearbeiten.
- Strukturierte Listen, Tabellen und Label-/Value-Daten in `src/content/data/*.yaml` bearbeiten.
- Projekte in `src/content/data/projects.yaml` über `projects` pflegen. `repo` ist immer `owner/name` und dient später als Merge-Key für GitHub-Daten.
- Projekt-Reihenfolge über `order` steuern. Genau ein Projekt darf `featured: true` setzen; dieses Projekt bestimmt die Home-Vorschau. `hidden: true` blendet ein Projekt aus.
- Reihenfolge innerhalb einer YAML-Liste ist die sichtbare Reihenfolge.
- Tabellenzeilen müssen exakt die Keys aus `columns` enthalten; fehlende oder unbekannte Keys brechen den Content-Check ab.
- Manuelle Zeilenumbrüche in Content-Dateien sind editorfreundlich, erzwingen aber keinen sichtbaren Umbruch.
- Neue Terminal-Ausgaben brauchen eine passende Output-Komponente oder eine bestehende Datenform.
- Keine großen Inhaltsblöcke in Markdown-Frontmatter verschieben.
