# Pages

## Home

Datei: `src/pages/index.astro`

- Zeigt ASCII-Namen, Einführung und kompakte Vorschauen.
- Nutzt `TerminalHeading` mit `size="Big"` für den Seiteneinstieg.
- Nutzt:
  - `text/home-lede.md`
  - `data/profile.yaml`
  - erster Eintrag aus `data/projects.yaml`
  - `data/links.yaml`
  - erster Eintrag aus `data/references.yaml`

## About

Datei: `src/pages/about.astro`

- Zeigt den About-Fließtext und strukturierte persönliche Daten.
- Nutzt `TerminalHeading` mit `size="Small"` für `about.md`.
- Ausbildung und Erfahrung werden als einzelne statisch adressierte Dictionary-Dateien geladen; die sichtbaren Commands dieser Einträge bleiben leer und können später manuell ergänzt werden.
- Nutzt:
  - `text/abouttext.md`
  - `data/profile.yaml`
  - `data/skills.yaml`
  - `data/education-current.yaml`
  - `data/education-previous.yaml`
  - `data/cobra-software.yaml`
  - `data/klixar-it.yaml`
  - `data/languages.yaml`
  - `data/hobbies.yaml`

## Projects

Datei: `src/pages/projects.astro`

- Listet alle Projekte aus `data/projects.yaml`.
- Nutzt `TerminalHeading` mit `size="Small"` für `projects/`.
- Jeder Eintrag rendert ein eigenes `TerminalCommand` und ein Dictionary.

## References

Datei: `src/pages/references.astro`

- Zeigt Referenzen und Nachweise aus `data/references.yaml`.
- Nutzt `TerminalHeading` mit `size="Small"` für `references.md`.
- Jeder Eintrag rendert ein eigenes `TerminalCommand` und ein Dictionary.

## Links

Datei: `src/pages/links.astro`

- Zeigt Kontakt- und Profilrouten als Liste.
- Nutzt `TerminalHeading` mit `size="Small"` für `links.yaml`.
- Nutzt `data/links.yaml`.

## Page Conventions

- Jede Seite verwendet `BaseLayout`.
- Seiten setzen `TerminalCommand` explizit vor der passenden Output-Komponente.
- Output-Komponenten erhalten ihre Content-Quelle über `src`.
- Interne Links müssen Base-URL-kompatibel bleiben.
- Neue Seiten brauchen bei Bedarf einen Eintrag in `src/config/navigation.ts`.
