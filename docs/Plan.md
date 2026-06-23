# Skills-Tabelle Auf About

## Summary

Die Skills-Liste auf `about.astro` wird von einfachem Zeilentext zu einer terminalartigen Tabelle mit den Spalten `Name` und `Kategorie` umgebaut. Das visuelle Vorbild ist der Screenshot: Header oben, eine gestrichelte horizontale Linie unter dem Header, keine vertikalen Linien und keine Linien zwischen den Datenzeilen. Die Website-Farben bleiben unverändert über die bestehenden CSS-Variablen.

## Key Changes

- Skills werden in `src/content/snippets/skills.md` von String-Einträgen zu strukturierten Einträgen mit `name` und `category` migriert.
- Das Snippet-Schema erlaubt zusätzlich Arrays aus Skill-Objekten, ohne bestehende String-Snippets für Languages, Hobbies oder Links zu brechen.
- Auf `about.astro` wird nur der Skills-Block als Tabelle gerendert; Profile, Education, Experience, Languages und Hobbies bleiben wie bisher.
- Eine kleine wiederverwendbare `TerminalTable`-Komponente rendert Prompt, Tabellenkopf und Tabellenzeilen im Terminal-Stil.
- CSS übernimmt die Linienlogik aus dem Screenshot:
  - gestrichelte Linie nur unter dem Header
  - keine vertikalen Linien
  - keine Row-Trenner
  - kompakte monospace Spalten

## Implementation Changes

- `src/content.config.ts` erweitert `snippets.value` um Skill-Objekte:
  - `name: string`
  - `category: string`
- `src/utils/content.ts` bekommt einen Helper wie `toSkillList(value)`, der nur gültige Skill-Objekte zurückgibt und optional alte String-Skills als `{ name, category: "Skill" }` fallbackt.
- `src/content/snippets/skills.md` wird auf diese Struktur migriert:
  - Programmiersprachen: Python, PHP, C#, Java, JavaScript / TypeScript
  - Web: HTML / CSS
  - Datenbanken: SQL
  - Tooling: Git / GitHub / Bitbucket, Docker
  - Konzepte: REST APIs, Socket APIs, OOP, funktionaler und asynchroner Code
- `about.astro` ersetzt den aktuellen `TerminalOutput` für `cat skills.txt` durch `TerminalTable` mit zwei Spalten: `Name`, `Kategorie`.
- `src/styles/global.css` ergänzt Klassen für die Tabelle:
  - `.terminal-table`
  - `.terminal-table-row`
  - `.terminal-table-head`
  - `.terminal-table-cell`
  - Header-Bottom-Line als `border-bottom: 1px dashed var(--terminal-muted)`
  - Textfarben aus `--terminal-text`, `--terminal-muted` und optional `--terminal-green`
- Mobile Darstellung:
  - Tabelle bleibt zweispaltig, aber liegt in einem horizontal scrollbaren Wrapper, falls lange Skill-Namen nicht sauber passen.
  - Keine Spaltenumbrüche, die die Terminal-Tabellenoptik zerstören.

## Test Plan

- `bun astro check` ausführen.
- `bun run build` ausführen.
- Im Browser `/about` prüfen:
  - Skills erscheinen als Tabelle mit `Name` und `Kategorie`.
  - Es gibt genau eine gestrichelte Linie unter dem Header.
  - Es gibt keine vertikalen Linien und keine Linien zwischen Datenzeilen.
  - Farben entsprechen weiterhin der Website, nicht dem Screenshot.
  - Lange Skill-Namen bleiben lesbar und brechen das Layout nicht.
- Mobile Browser-Prüfung:
  - About-Seite bleibt bedienbar.
  - Skills-Tabelle ist horizontal scrollbar oder passt sauber in den Viewport.
  - Alle anderen Terminal-Blöcke rendern wie vorher.

## Assumptions

- Die gewünschte Tabellenstruktur ist `Name + Kategorie`.
- Die Kategorien dürfen aus den aktuellen Skills fachlich abgeleitet werden.
- Der Screenshot dient nur als Linien- und Tabellenreferenz; Farben, Schrift und Terminal-Stimmung bleiben aus der Website.
- Die Änderung betrifft nur die Skills-Liste auf About, nicht Languages oder Hobbies.
