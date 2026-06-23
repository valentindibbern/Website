# Content System

## Goal

Die Content-Schicht hält redaktionelle Inhalte aus den Seiten heraus. Dadurch lassen sich Texte, Listen und strukturierte Einträge ohne Codeänderung pflegen.

## Collections

- `profile`
  - Ein einzelner Profil-Eintrag mit Name, Rolle, Ausbildung, Interessen, Arbeitsweise, Intro-Text und einer strukturierten Detail-Liste.
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
  - Sortiert `projects`, `references` und `terminal` über das `order`-Feld; `profile` und `snippets` folgen eigener Logik.
- `src/content/*`
  - Enthält die eigentlichen Markdown-Dateien.
  - Ist die primäre Stelle für Inhaltsänderungen.

## Data Path To The Website

1. Markdown-Dateien liegen unter `src/content/*`.
2. Jede Datei gehört über ihren Ordner zu einer Collection, z. B. `src/content/projects/*` zu `projects`.
3. `src/content.config.ts` lädt die Dateien mit `glob()` aus dem passenden Ordner.
4. Das jeweilige Schema validiert die Frontmatter-Felder beim Astro-Check oder Build.
5. Seiten und Utilities greifen über `getCollection()` und `render()` aus `astro:content` auf die Einträge zu.
6. `src/utils/content.ts` kapselt wiederverwendbare Zugriffe, Sortierung und Ausgabeformatierung.
7. Seiten unter `src/pages/*` laden die vorbereiteten Daten zur Build-Zeit.
8. Komponenten wie `TerminalOutput.astro` rendern die Daten in HTML.
9. `bun build` erzeugt daraus statische Dateien in `dist/`.
10. GitHub Pages liefert die statische Website unter der konfigurierten Base-URL aus.

## Current Content Inventory

- `src/content/profile/main.md`
  - Enthält den zentralen Profil-Datensatz.
  - Frontmatter: `name`, `role`, `education`, `interests`, `workingStyle`, `intro`, `details`.
  - `details` ist eine Liste aus `label`/`value`-Objekten und steuert die zeilenweise Ausgabe.
  - Markdown-Body: öffentlicher About-Fließtext.
  - Genutzt von `index.astro` und `about.astro`.
- `src/content/projects/*.md`
  - Enthält Projekt-Einträge.
  - Dateien: `website.md`, `neovimconfig.md`, `jahr-java-3-aufgaben.md`, `cmd-rechner.md`, `buecherantiquariat.md`.
  - Frontmatter: `title`, `command`, `order`, `source`, `type`, `stack`, `summary`.
  - Genutzt von `index.astro` für den ersten sortierten Eintrag und von `projects.astro` für die vollständige Liste.
- `src/content/references/*.md`
  - Enthält Referenzen und Nachweise.
  - Dateien: `references.md`, `school-records.md`, `delf-b1.md`.
  - Frontmatter: `title`, `command`, `order`, `body`.
  - Genutzt von `index.astro` für den ersten sortierten Eintrag und von `references.astro` für die vollständige Liste.
- `src/content/terminal/*.md`
  - Enthält terminalartige Detailblöcke für Ausbildung und Erfahrung.
  - Dateien: `education-current.md`, `education-previous.md`, `cobra-software.md`, `klixar-it.md`.
  - Frontmatter: `title`, `command`, `order`, `body`, `group`.
  - `group` ist entweder `education` oder `experience`.
  - Genutzt von `about.astro`.
- `src/content/snippets/*.md`
  - Enthält kurze wiederverwendbare Texte und Listen.
  - Dateien: `home-lede.md`, `skills.md`, `languages.md`, `hobbies.md`, `links.md`, `input-about-text.md`, `input-contact.md`, `input-project-details.md`, `input-references-public.md`.
  - Frontmatter: `key`, `value`.
  - `value` ist entweder ein einzelner String oder eine Liste von Strings.
  - Genutzt von `index.astro`, `about.astro`, `projects.astro`, `links.astro` und `references.astro`.

## Editing Rules

- Strukturelle Daten gehören in Frontmatter.
- Längere Fließtexte gehören in den Markdown-Body.
- Wenn ein Block zeilenweise und getrennt per CSS gestylt werden soll, gehört er als strukturierte Liste ins Frontmatter.
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
- `intro`
  - Kurzer Einleitungstext für Profilbereiche.
- `details`
  - Liste aus Objekten mit `label` und `value`, wenn die Ausgabe in separat stilisierbare Zeilen aufgeteilt werden soll.
- `key` und `value`
  - Snippet-Struktur für kleine Texte oder Listen; `value` darf auch ein Array von Strings sein.

## Consumer Behavior

- `index.astro` nutzt ausgewählte erste Einträge für die Home-Ansicht.
- Unterseiten nutzen vollständige Collections.
- Terminal-Ausgaben bleiben einfache Textblöcke und werden nicht zur Laufzeit aus DOM-Strukturen rekonstruiert.

## Failure Modes

- Fehlt ein Pflichtfeld, scheitert der Astro-Check oder Build.
- Kein oder mehr als ein `profile`-Eintrag führt in `getProfile()` zu einem Fehler.
- Unsichtbare Sortierfehler entstehen meist durch fehlende oder doppelte `order`-Werte.
