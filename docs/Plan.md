# Content-Pipeline Mit Flexiblen Blöcken

## Summary

Das aktuelle Problem entsteht, weil Content-Schemas und Render-Helper noch an feste Frontmatter-Felder gebunden sind, z. B. `workingStyle` in `profile`. Astro Content Collections validieren Frontmatter per Zod-Schema und brechen korrekt ab, wenn ein Pflichtfeld fehlt; genau das passiert aktuell mit `src/content/profile/main.md`. Siehe Astro-Doku zu [Content Collections](https://docs.astro.build/en/guides/content-collections/).

Der Umbau sollte deinen Slot-/Block-Ansatz übernehmen: Seiten definieren nur noch, welche Content-Blöcke sie in welcher Reihenfolge laden. Die Inhalte innerhalb eines Blocks, also Listenzeilen, Tabellenzeilen oder Key-Value-Rows, werden vollständig aus Markdown-Frontmatter gelesen und können ohne Codeänderung ergänzt, entfernt oder umsortiert werden.

## Key Changes

- Feste Felder wie `workingStyle`, `interests`, `source`, `stack`, `summary` werden nicht mehr direkt von Seiten oder Helpern erwartet.
- Content-Dateien bekommen flexible `blocks` oder blockartige Felder mit `type`, `command`, `order` und typabhängigen Daten.
- Renderer wählen anhand von `type`, wie ein Block dargestellt wird:
  - `rows`: Label-/Value-Liste
  - `table`: Tabelle mit dynamischen Spalten und Zeilen
  - `list`: einfache Zeilenliste
  - `json`: JSON-artige Terminalausgabe
  - `text`: freier Textblock
- Home lädt pro Bereich nur den ersten passenden Block oder ersten Collection-Eintrag.
- Unterseiten laden alle passenden Blöcke in definierter Reihenfolge.
- Schemas validieren nur die Blockstruktur, nicht mehr konkrete redaktionelle Feldnamen wie `workingStyle`.

## Implementation Plan

- Content-Schema umbauen:
  - `src/content.config.ts` bekommt gemeinsame Block-Schemas.
  - `profile` benötigt nur noch stabile Seitendaten wie `name`, `role` und optional `blocks`.
  - `projects`, `references`, `terminal` und `snippets` werden so angepasst, dass wiederholbare Inhalte als flexible Blöcke oder blockfähige Einträge beschrieben werden.
  - Pflichtfelder bleiben nur dort Pflicht, wo Code sie wirklich braucht, z. B. `title`, `command`, `order`, `type`.

- Content-Modelle vereinheitlichen:
  - `rows` enthält beliebig viele `{ label, value, kind? }`.
  - `table` enthält `columns: [{ key, label }]` und `rows: Record<string, string>[]`.
  - `list` enthält `items: string[]`.
  - `text` enthält `body` oder nutzt den Markdown-Body.
  - `json` enthält `entries: [{ key, value }]`.
  - Skills werden als `table` oder tabellarischer Block modelliert, sodass Kategorien und Einträge frei im Content geändert werden können.

- Helper in `src/utils/content.ts` ersetzen:
  - Alte Feld-Mapper wie `getProfileRows(profile.data)` und `getProjectRows(project.data)` werden entfernt oder nur noch als Kompatibilitätsfallback behalten.
  - Neue Helper laden Blöcke generisch:
    - `getBlocksForPage(pageKey)`
    - `getFirstBlockForSection(sectionKey)`
    - `normalizeBlock(entry)`
    - `sortByOrder(entries)`
  - Helper dürfen nicht mehr konkrete Content-Feldnamen wie `workingStyle`, `summary` oder `stack` kennen.

- Komponenten vereinheitlichen:
  - `TerminalOutput` rendert weiterhin `text` und `rows`.
  - `TerminalTable` rendert beliebige Tabellen aus Content-Spalten und Content-Zeilen.
  - Optional wird eine kleine `TerminalBlock.astro`-Komponente eingeführt, die anhand von `block.type` zu `TerminalOutput`, `TerminalTable` oder JSON/List-Rendering delegiert.
  - Seiten rendern dann nur noch Blocklisten, statt selbst Tabellenzeilen oder Row-Arrays zusammenzubauen.

- Seiten umbauen:
  - `about.astro` lädt die für About vorgesehenen Blöcke in Reihenfolge.
  - `index.astro` lädt pro Bereich nur den ersten Block bzw. ersten sortierten Eintrag.
  - `projects.astro` und `references.astro` rendern vollständige Collections generisch.
  - `links.astro` bleibt JSON-artig, aber bekommt eine strukturierte Content-Quelle statt `key=value`-String-Splitting.

- Content-Migration:
  - `profile/main.md` bekommt z. B. einen `rows`-Block für Profilangaben.
  - Wenn `working style` entfernt wird, verschwindet die Zeile automatisch.
  - Wenn `interests` umbenannt oder umsortiert wird, wird genau diese Änderung gerendert.
  - Projekte speichern ihre sichtbaren Details als `rows`, nicht mehr als hartkodierte Felder.
  - Skills speichern ihre Kategorien und Einträge als Tabelle, komplett contentgetrieben.

- Dokumentation aktualisieren:
  - `docs/Content-System.md` beschreibt die neue Blockstruktur.
  - `docs/Pages.md` erklärt, welche Seiten welche Blockgruppen laden.
  - `docs/Components.md` beschreibt `TerminalBlock`, `TerminalOutput` und `TerminalTable`.
  - `README.md` nur ändern, wenn sich die redaktionelle Arbeitsweise für Nutzer sichtbar ändert.

## Critical Notes

- Dein Slot-/Block-Ansatz ist passend, weil er die richtige Grenze zieht: Code kontrolliert Layout und Reihenfolge von Bereichen, Content kontrolliert Einträge innerhalb dieser Bereiche.
- Der Ansatz sollte nicht so weit gehen, dass Markdown beliebige Komponenten auswählt. Die erlaubten `type`-Werte müssen begrenzt bleiben, damit das öffentliche Repo robust und typprüfbar bleibt.
- Zod-Schemas sollten weiterhin genutzt werden, aber auf Blockformen statt auf konkrete Inhalte. Das erhält Astro-Checks und verhindert kaputte Daten, ohne redaktionelle Änderungen unnötig zu blockieren.
- `z.record()` oder flexible Arrays sind sinnvoller als viele einzelne Pflichtfelder, solange die Renderer mit fehlenden/zusätzlichen Einträgen umgehen können.
- Bestehende Collections müssen nicht zwingend zu einer einzigen Collection verschmolzen werden. Besser ist ein gemeinsamer Block-Vertrag über mehrere Collections hinweg, damit `projects`, `references`, `terminal` und `profile` ihre fachliche Trennung behalten.

## Test Plan

- `bun astro check` muss nach Entfernen von `workingStyle` fehlerfrei laufen.
- `bun run build` muss alle 5 Seiten bauen.
- Manuelle Content-Tests:
  - Profilzeile in `profile/main.md` entfernen.
  - Profilzeile hinzufügen.
  - Profilzeilen umsortieren.
  - Skill-Tabellenspalte erweitern oder Eintrag entfernen.
  - Projekt-Row hinzufügen und ohne Codeänderung auf `projects` sehen.
  - Reference-Body mit Zeilenumbrüchen prüfen.
- Browser-Prüfung:
  - Home zeigt nur den ersten Block je Bereich.
  - About zeigt alle zugeordneten Blöcke.
  - Projects und References behalten vollständige Listen.
  - Tabellen bleiben mobil scrollbar.
  - Keine roten Content-Hinweise oder entfernten Home-Elemente kehren zurück.

## Assumptions

- Seitenstruktur und Navigation bleiben gleich.
- Reihenfolge wird weiterhin über `order` gesteuert.
- Layout-Typen sind bewusst begrenzt auf `text`, `rows`, `table`, `list` und `json`.
- Content-Dateien dürfen Einträge innerhalb dieser Typen frei ergänzen, entfernen und umsortieren.
- Änderungen an Content sollen weiterhin durch Astro validiert werden, aber nur gegen generische Blockformen.
