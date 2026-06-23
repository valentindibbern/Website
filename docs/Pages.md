# Pages

## Home

Datei: `src/pages/index.astro`

- Zeigt ASCII-Namen, Einführung und kompakte Vorschauen.
- Nutzt:
  - `text/home-lede.md`
  - `data/profile.yaml`
  - erster Eintrag aus `data/projects.yaml`
  - `data/links.yaml`
  - erster Eintrag aus `data/references.yaml`

## About

Datei: `src/pages/about.astro`

- Zeigt den About-Fließtext und strukturierte persönliche Daten.
- Nutzt:
  - `text/abouttext.md`
  - `data/profile.yaml`
  - `data/skills.yaml`
  - `data/terminal.yaml`
  - `data/languages.yaml`
  - `data/hobbies.yaml`

## Projects

Datei: `src/pages/projects.astro`

- Listet alle Projekte aus `data/projects.yaml`.
- Jeder Eintrag rendert ein eigenes `TerminalCommand` und ein Dictionary.

## References

Datei: `src/pages/references.astro`

- Zeigt Referenzen und Nachweise aus `data/references.yaml`.
- Jeder Eintrag rendert ein eigenes `TerminalCommand` und ein Dictionary.

## Links

Datei: `src/pages/links.astro`

- Zeigt Kontakt- und Profilrouten als Liste.
- Nutzt `data/links.yaml`.

## Page Conventions

- Jede Seite verwendet `BaseLayout`.
- Seiten setzen `TerminalCommand` explizit vor der passenden Output-Komponente.
- Output-Komponenten erhalten ihre Content-Quelle über `src`.
- Interne Links müssen Base-URL-kompatibel bleiben.
- Neue Seiten brauchen bei Bedarf einen Eintrag in `src/config/navigation.ts`.
