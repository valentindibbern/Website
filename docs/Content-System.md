# Content System

## Goal

Die Content-Schicht hält redaktionelle Inhalte aus den Seiten heraus. Dadurch lassen sich Texte, Listen und strukturierte Einträge ohne Codeänderung pflegen.

## Collections

- `profile`
  - Ein einzelner Profil-Eintrag mit Name, Rolle, Ausbildung, Interessen und Arbeitsweise.
- `projects`
  - Mehrere Projekt-Einträge mit Titel, Command, Reihenfolge, Quelle, Typ, Stack und Summary.
- `references`
  - Mehrere Referenz- und Nachweis-Einträge.
- `terminal`
  - Zusätzliche terminalartige Textblöcke, gruppiert nach Bereich.
- `snippets`
  - Kleine wiederverwendbare Textbausteine und Listen wie Hinweise, Skills, Sprachen oder Kontakttexte.

## Implementation Points

- `src/content.config.ts`
  - Definiert Loader und Schemas für alle Collections.
  - Erzwingt minimale Pflichtfelder, damit Seiten konsistent bleiben.
- `src/utils/content.ts`
  - Stellt Loader-Funktionen wie `getProfile`, `getProjects`, `getReferences`, `getTerminalEntries` und `getSnippets` bereit.
  - Enthält Formatierer wie `formatProfileTerminalBody`, `formatProjectTerminalBody` und `formatLinksJson`.
  - Sortiert Collections über das `order`-Feld.
- `src/content/*`
  - Enthält die eigentlichen Markdown-Dateien.
  - Ist die primäre Stelle für Inhaltsänderungen.

## Editing Rules

- Strukturelle Daten gehören in Frontmatter.
- Längere Fließtexte gehören in den Markdown-Body.
- Wiederverwendbare Texte werden als Snippets gepflegt, nicht doppelt in Seiten kopiert.
- Sortierung erfolgt explizit über `order`, nicht über Dateinamen.
- Neue Felder müssen zuerst im jeweiligen Schema in `src/content.config.ts` ergänzt werden.
- Seiten sollten Content über `src/utils/content.ts` beziehen, wenn die Logik wiederverwendbar ist.

## Field Patterns

- `command`
  - Terminal-Befehl, der im Prompt angezeigt wird.
- `order`
  - Numerische Sortierung innerhalb einer Collection.
- `body`
  - Textausgabe für terminalartige Einträge.
- `key` und `value`
  - Snippet-Struktur für kleine Texte oder Listen.

## Consumer Behavior

- `index.astro` nutzt ausgewählte erste Einträge für die Home-Ansicht.
- Unterseiten nutzen vollständige Collections.
- Terminal-Ausgaben bleiben einfache Textblöcke und werden nicht zur Laufzeit aus DOM-Strukturen rekonstruiert.

## Failure Modes

- Fehlt ein Pflichtfeld, scheitert der Astro-Check oder Build.
- Mehr als ein `profile`-Eintrag führt in `getProfile()` zu einem Fehler.
- Unsichtbare Sortierfehler entstehen meist durch fehlende oder doppelte `order`-Werte.
