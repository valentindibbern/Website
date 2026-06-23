# Refactoring-Plan: Content-Pipeline und Terminal-Komponenten

## Summary

Die Website soll eine verständlichere Pipeline bekommen, bei der Content-Dateien direkt und nachvollziehbar von Terminal-Komponenten gelesen werden. Die aktuelle Struktur mit vielen Content-Subdirectories, großen Frontmatter-Blöcken und generischen Terminal-Blöcken wird ersetzt.

Neuer Grundfluss:

`src/content/text/*.md` oder `src/content/data/*.yaml` -> Astro Content Collections via `glob()` -> kleine Loader-/Parser-Helfer -> Terminal-Komponente wählt Quelle über `src` -> HTML-Ausgabe.

Leitentscheidungen:

- Markdown wird nur für freie Texte verwendet.
- YAML wird für Listen, Tabellen, Key-Value-Daten und bisher JSON-artige Inhalte verwendet.
- Content liegt in genau zwei Unterordnern:
  - `src/content/text/`
  - `src/content/data/`
- Terminal-Komponenten wählen ihre Quelle selbst über ein `src`-Prop.
- Keine großen Inhaltsdaten im Markdown-Frontmatter.
- JSON-Ausgaben werden in Listen überführt.
- Terminal-Ausgaben werden aus klaren Komponenten aufgebaut:
  - `TerminalCommand`
  - `TerminalText`
  - `TerminalDictionary`
  - `TerminalTable`
  - `TerminalList`

## Content-Struktur

Die neue Content-Struktur wird:

```text
src/content/
  text/
    abouttext.md
    home-lede.md
  data/
    profile.yaml
    projects.yaml
    references.yaml
    terminal.yaml
    skills.yaml
    links.yaml
    languages.yaml
    hobbies.yaml
```

Markdown-Regeln:

- `.md` wird für freie Textinhalte genutzt.
- Der sichtbare Text steht im Markdown-Body.
- Der Refactor setzt keine Attribute im Markdown-Frontmatter voraus.
- Falls Astro technisch leeres Frontmatter verlangt, wird nur ein leerer Header verwendet, keine inhaltlichen Metadaten.

YAML-Regeln:

- `.yaml` wird für strukturierte Inhalte genutzt.
- Listen bleiben echte YAML-Listen.
- Key-Value-Daten werden als YAML-Listen mit `label` und `value` modelliert.
- Tabellen werden als `columns` plus `rows` modelliert.
- Bisher JSON-artige Inhalte, z. B. Links, werden in eine Liste umgewandelt.
- Die sichtbare Reihenfolge innerhalb einer YAML-Datei entspricht der Reihenfolge der YAML-Liste. Kein `order`-Feld im ersten Refactor.

Beispiel für Dictionary-Daten:

```yaml
rows:
  - label: name
    value: Valentin Dibbern
  - label: role
    value: Informatikschüler
```

Beispiel für Listen-Daten:

```yaml
items:
  - GitHub
  - LinkedIn
  - Email
```

Beispiel für Tabellen-Daten:

```yaml
columns:
  - key: language
    label: Sprachen
  - key: tool
    label: Tools
rows:
  - language: Python
    tool: Git
  - language: Java
    tool: GitHub
```

## Astro Collections und Loader

`src/content.config.ts` wird auf zwei Collections vereinfacht:

- `text`
  - lädt `src/content/text/**/*.md`
  - erwartet keine verpflichtenden Frontmatter-Felder
  - stellt Markdown-Body zum Rendern bereit
- `data`
  - lädt `src/content/data/**/*.yaml`
  - validiert grob unterstützte Datenformen für Listen, Dictionaries und Tabellen

Der Refactor soll keinen großen eigenen Dateisystem-Parser bauen. Astro übernimmt weiterhin das Laden und Basis-Parsen über `glob()`.

Zusätzlich entstehen kleine Utility-Funktionen, z. B. in `src/utils/content.ts` oder aufgeteilt nach Bedarf:

- `getTextContent(src: string)`
  - lädt `src/content/text/${src}.md`
  - rendert Markdown über Astro
- `getDataContent(src: string)`
  - lädt `src/content/data/${src}.yaml`
  - gibt validierte YAML-Daten zurück
- `getListContent(src: string)`
  - gibt `items` zurück
- `getDictionaryContent(src: string)`
  - gibt `rows` zurück
- `getTableContent(src: string)`
  - gibt `columns` und `rows` zurück

Die Komponenten erhalten keine Dateipfade, sondern logische Quellen:

```astro
<TerminalText src="abouttext" />
<TerminalList src="links" />
<TerminalDictionary src="profile" />
<TerminalDictionary src="projects" entry="website" />
<TerminalTable src="skills" />
```

Dabei gilt:

- `TerminalText src="abouttext"` referenziert `src/content/text/abouttext.md`.
- `TerminalList src="links"` referenziert `src/content/data/links.yaml`.
- `TerminalDictionary src="profile"` referenziert `src/content/data/profile.yaml`.
- `TerminalDictionary src="projects" entry="website"` referenziert den Eintrag `website` in `src/content/data/projects.yaml`.
- `TerminalTable src="skills"` referenziert `src/content/data/skills.yaml`.

## Terminal-Komponenten

Die Terminal-Komponenten werden klar nach Ausgabeform getrennt.

### TerminalCommand

Zweck:

- rendert nur die Bash-artige Prompt-/Command-Zeile.

Props:

```ts
interface Props {
    path?: string;
    command: string;
}
```

Ausgabeformat:

```text
visitor@portfolio:~/about$ cat abouttext.md
```

Regeln:

- Der Prompt folgt dem Linux-/Bash-Stil:
  - `user@host:path$ command`
- Standardwerte:
  - `user`: `visitor`
  - `host`: `portfolio`
  - `path`: `~`
- Wenn `path="/about"` übergeben wird, soll die Ausgabe konsistent und bash-artig sein, z. B.:
  - `visitor@portfolio:~/about$ cat profile.yaml`
- `TerminalCommand` lädt keinen Content.

### TerminalText

Zweck:

- rendert Markdown-Text aus `src/content/text/*.md`.

Props:

```ts
interface Props {
    src: string;
}
```

Regeln:

- `src` ist der Dateiname ohne `.md`.
- `TerminalText` nimmt keinen `body`-Prop.
- Der Content kommt vollständig aus der referenzierten Markdown-Datei.
- Die Komponente macht keine eigene Textformatierungslogik.
- Umbrüche und Flussverhalten übernimmt der Browser/CSS.
- Markdown wird nur so weit gerendert, wie Astro es standardmäßig rendert.

### TerminalDictionary

Zweck:

- rendert Key-Value-/Label-Value-Daten aus `src/content/data/*.yaml`.

Props:

```ts
interface Props {
    src: string;
    entry?: string;
}
```

Regeln:

- `src` ist der Dateiname ohne `.yaml`.
- Erwartet YAML mit `rows` oder einen passenden Eintrag unter `entries`.
- Rendert semantisch als `dl`.
- Keine zusätzlichen Props für `rows` im ersten Refactor.
- Die Größe der Ausgabe ergibt sich aus dem geladenen Content.

### TerminalTable

Zweck:

- rendert Tabellen aus `src/content/data/*.yaml`.

Props:

```ts
interface Props {
    src: string;
}
```

Regeln:

- `src` ist der Dateiname ohne `.yaml`.
- Erwartet YAML mit `columns` und `rows`.
- Keine zusätzlichen Props für `columns` oder `rows` im ersten Refactor.
- Die Größe der Tabelle ergibt sich aus dem geladenen Content.

### TerminalList

Zweck:

- rendert einfache Listen aus `src/content/data/*.yaml`.

Props:

```ts
interface Props {
    src: string;
}
```

Regeln:

- `src` ist der Dateiname ohne `.yaml`.
- Erwartet YAML mit `items`.
- Bisher JSON-artige Inhalte wie Links werden hier als Liste ausgegeben.
- Keine zusätzliche JSON-Komponente.

## Seitenstruktur und Verwendung

Seiten komponieren Terminal-Ausgaben explizit:

```astro
<TerminalCommand path="/about" command="cat abouttext.md" />
<TerminalText src="abouttext" />

<TerminalCommand path="/about" command="cat profile.yaml" />
<TerminalDictionary src="profile" />

<TerminalCommand path="/about" command="cat skills.yaml" />
<TerminalTable src="skills" />

<TerminalCommand path="/links" command="cat links.yaml" />
<TerminalList src="links" />
```

Regeln:

- Seiten kennen die gewünschten Quellen und die Ausgabeform.
- Komponenten laden ihre eigenen Inhalte über `src`.
- Seiten übergeben im ersten Refactor keine `rows`, `columns`, `items` oder `body`.
- Bestehende generische Block-Renderer werden entfernt.
- Die alte Logik `blockToBody()` entfällt.
- Falls während der Migration eine Übergangsschicht nötig ist, wird sie temporär gehalten und nach Umstellung aller Seiten entfernt.

## Migration

Bestehende Inhalte werden wie folgt übertragen:

- `src/content/profile/main.md`
  - Markdown-Body -> `src/content/text/abouttext.md`
  - Profil-Rows -> `src/content/data/profile.yaml`
- `src/content/snippets/home-lede.md`
  - Body/Textwert -> `src/content/text/home-lede.md`
- `src/content/projects/*.md`
  - Projektlisten -> `src/content/data/projects.yaml`
- `src/content/references/*.md`
  - Referenzlisten -> `src/content/data/references.yaml`
- `src/content/terminal/*.md`
  - Ausbildungs- und Erfahrungsdaten -> `src/content/data/terminal.yaml`
- `src/content/snippets/skills.md`
  - Skill-Tabelle -> `src/content/data/skills.yaml`
- `src/content/snippets/languages.md`
  - Sprachenliste -> `src/content/data/languages.yaml`
- `src/content/snippets/hobbies.md`
  - Hobbyliste -> `src/content/data/hobbies.yaml`
- `src/content/snippets/links.md`
  - bisher JSON-artige Links -> `src/content/data/links.yaml` als Liste

Die sichtbare Website soll nach der Migration inhaltlich möglichst gleich bleiben. Die einzige bewusste Änderung ist, dass JSON-artige Darstellung durch Listen ersetzt wird.

## Styling

`src/styles/global.css` bleibt zentrale Styling-Datei.

Bestehende Klassen werden nach Möglichkeit weiterverwendet:

- `.prompt` für `TerminalCommand`
- `.output-body` oder eine passende Textklasse für `TerminalText`
- `.output-pairs`, `.output-label`, `.output-value` für `TerminalDictionary`
- `.terminal-table-*` für `TerminalTable`
- neue Listenklasse für `TerminalList`, z. B. `.terminal-output-list`

`TerminalText` selbst entscheidet nicht über Textformatierung. Falls Umbruchverhalten angepasst werden muss, passiert das ausschließlich über CSS.

## Dokumentation

Folgende Dokumente werden aktualisiert:

- `README.md`
  - Projektübersicht und Content-Bearbeitung.
- `docs/Content-System.md`
  - neue Ordner `src/content/text` und `src/content/data`.
  - Markdown-vs-YAML-Regeln.
  - `src`-basierte Content-Auswahl.
- `docs/Components.md`
  - `TerminalCommand`
  - `TerminalText`
  - `TerminalDictionary`
  - `TerminalTable`
  - `TerminalList`
- `docs/Pages.md`
  - welche Seite welche Terminal-Komponenten und Content-Quellen nutzt.
- `docs/Architecture.md`
  - neuer Datenfluss von Datei zu Komponente zu HTML.
- `docs/Workflows.md`
  - wie Texte, Listen, Dictionaries und Tabellen bearbeitet werden.

Dokumentation bleibt öffentlich lesbar und enthält keine privaten Arbeitsnotizen.

## Test Plan

Nach Umsetzung ausführen:

```sh
bun astro check
bun run build
```

Manuell prüfen:

- `/`
- `/about`
- `/projects`
- `/links`
- `/references`

Akzeptanzkriterien:

- Content liegt nur noch unter `src/content/text` und `src/content/data`.
- Markdown-Texte setzen keine inhaltlichen Frontmatter-Attribute voraus.
- YAML-Daten ersetzen strukturierte Frontmatter-Blöcke.
- Terminal-Komponenten laden Inhalte per `src`.
- `TerminalCommand` rendert bash-artige Prompt-Ausgaben.
- `TerminalText` rendert Text aus Markdown-Dateien ohne eigene Formatierungslogik.
- `TerminalDictionary`, `TerminalTable` und `TerminalList` bestimmen ihre Größe durch den geladenen Content.
- JSON-artige Inhalte sind zu Listen migriert.
- Alte generische Terminal-Block-Logik ist entfernt.
- Doku beschreibt den neuen Stand.

## Assumptions

- Astro kann Markdown-Dateien ohne verpflichtende Frontmatter-Felder in einer Collection laden. Falls die konkrete Konfiguration leeres Frontmatter benötigt, wird nur leeres Frontmatter verwendet.
- YAML wird für strukturierte redaktionelle Daten gewählt, weil es lesbarer für Listen und verschachtelte Inhalte ist als TOML.
- Reihenfolge innerhalb einer YAML-Liste ist die sichtbare Reihenfolge.
- Zusätzliche Props wie `rows`, `columns`, `items` oder manuelle Größensteuerung werden nicht Teil dieses Refactors.
- Erweiterungen für optionale Props können später ergänzt werden.
- Arbeit erfolgt bei späterer Umsetzung auf `agent-changes`, mit Dokumentationsupdate, Commit und Push gemäß Projektregeln.
