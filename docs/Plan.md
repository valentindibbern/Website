# Skills-Tabelle Auf About Mit Originalkategorien

## Summary

Die Skills-Liste auf `about.astro` wird als terminalartige Tabelle mit den drei ursprünglichen Kategorien aus dem Bewerbungs-Lebenslauf gerendert: `Sprachen`, `Tools` und `Konzepte`. Die Kategorien stehen als Tabellenkopf, die jeweiligen Einträge darunter in derselben Spalte. Die Website-Farben bleiben erhalten; die Tabellenlinien folgen weiterhin der Screenshot-Referenz.

## Key Changes

- `src/content/snippets/skills.md` speichert Skills als Gruppen mit `category` und `items`.
- Die Kategorien werden aus `C:\Users\valen\SchuleDokumente\Bewerbungen\Bewerbungs-IDAV2026\Code\lebenslauf.html` übernommen:
  - `Sprachen`: Python, PHP, C#, Java, JS/TS, HTML/CSS, SQL
  - `Tools`: Git, GitHub, Bitbucket, VS Code, IntelliJ IDEA, Neovim, Docker
  - `Konzepte`: Rest API, Socket API, Funktionaler Code, Objektorientierter Code, Asynchroner Code
- `about.astro` baut daraus eine Tabelle mit Kategorien als Spaltenköpfen.
- `TerminalTable` rendert weiterhin nur eine gestrichelte Linie unter dem Header, keine vertikalen Linien und keine Row-Trenner.
- Andere About-Blöcke und andere Seiten bleiben unverändert.

## Implementation Changes

- `src/content.config.ts` erlaubt bei `snippets.value` zusätzlich Arrays aus Skill-Gruppen:
  - `category: string`
  - `items: string[]`
- `src/utils/content.ts` stellt `toSkillGroups(value)` bereit und bietet einen Fallback für einfache String-Listen.
- `about.astro` normalisiert die Skill-Gruppen zu Tabellenzeilen:
  - Jede Gruppe wird zu einer Spalte.
  - Kürzere Gruppen bekommen leere Zellen, damit alle Spalten sauber ausgerichtet bleiben.
- `src/styles/global.css` behält das Terminal-Tabellenstyling:
  - Header-Linie gestrichelt
  - keine vertikalen Linien
  - keine Datenzeilen-Linien
  - horizontaler Scroll nur innerhalb des Tabellenwrappers auf kleinen Viewports
- Dokumentation beschreibt die Skill-Gruppenstruktur und die About-Ausgabe.

## Test Plan

- `bun astro check` ausführen.
- `bun run build` ausführen.
- Im Browser `/about` prüfen:
  - Tabellenköpfe sind `Sprachen`, `Tools`, `Konzepte`.
  - Die Einträge stehen unter der passenden Kategorie.
  - Es gibt genau eine gestrichelte Linie unter dem Header.
  - Es gibt keine vertikalen Linien und keine Linien zwischen Datenzeilen.
  - Andere Terminal-Blöcke auf About rendern wie vorher.
- Mobile prüfen:
  - Die Seite bleibt viewport-breit.
  - Die Tabelle scrollt bei Bedarf innerhalb ihres Wrappers horizontal.

## Assumptions

- Die drei Kategorien aus dem ursprünglichen Lebenslauf sind die gewünschte Quelle der Wahrheit.
- Die Schreibweisen aus der Quelle werden übernommen, inklusive `JS/TS`, `HTML/CSS` und `Rest API`.
- Die Tabellenoptik bleibt terminalartig und verwendet die bestehenden Website-Farben.
