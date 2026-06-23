# Pages

## Home

Datei: `src/pages/index.astro`

- Zeigt den ASCII-Namen, die kurze Einführung und die wichtigsten Einstiege.
- Nutzt:
  - `profile`
  - `projects`
  - `references`
  - `snippets`
- Der About-Vorspann und die Profilzeilen kommen direkt aus `src/content/profile/main.md`.
- Zweck:
  - schneller Überblick über das Projekt und die wichtigsten Unterseiten

## About

Datei: `src/pages/about.astro`

- Zeigt den Fließtext aus der Profil-Content-Schicht.
- Nutzt denselben Intro-Text und dieselbe strukturierte Detail-Liste aus `src/content/profile/main.md`.
- Ergänzt Terminal-Ausgaben für Profil, Skills, Ausbildung, Erfahrung, Sprachen und Hobbys.
- Nutzt:
  - `profile`
  - `terminal`
  - `snippets`

## Projects

Datei: `src/pages/projects.astro`

- Listet alle Projekte in sortierter Reihenfolge.
- Jede Ausgabe wird über `TerminalOutput` gerendert.
- Nutzt:
  - `projects`
  - `snippets`

## References

Datei: `src/pages/references.astro`

- Zeigt alle Referenzen und Nachweise als Terminal-Archiv.
- Nutzt:
  - `references`
  - `snippets`

## Links

Datei: `src/pages/links.astro`

- Zeigt Kontakt- und Profilrouten als JSON-artige Terminalausgabe.
- Nutzt:
  - `snippets`

## Page Conventions

- Jede Seite setzt auf denselben globalen Layout-Rahmen.
- Inhalte werden zur Build-Zeit geladen, nicht im Browser zusammengesetzt.
- Die Terminal-Optik bleibt auf allen Seiten konsistent.
- Neue Seiten brauchen einen Eintrag in `src/config/navigation.ts`, wenn sie in der Navigation erscheinen sollen.
- Interne Links müssen Base-URL-kompatibel bleiben.

## Missing Route Notes

- `src/config/navigation.ts` enthält aktuell einen Footer-Link auf `/impressum`.
- Es gibt derzeit keine dokumentierte `src/pages/impressum.astro`.
- Wenn die Seite ergänzt wird, sollten `Pages.md`, Navigation und Content-Quellen gemeinsam aktualisiert werden.
