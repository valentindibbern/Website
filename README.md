# Personal Website

Terminal-inspirierte Astro-Website mit Content Collections, Markdown-Inhalten und einem schlanken Komponenten-Setup.

## Public Repository

Dieses Repository ist öffentlich. Die README ist deshalb der öffentliche Einstieg für Besucher, Entwickler und Agents.

- Keine privaten Daten, Zugangsdaten oder internen Notizen in README oder `docs/` ablegen.
- Dokumentation soll den aktuellen Projektzustand erklären, nicht persönliche Arbeitsnotizen sammeln.
- Agent-spezifische Hinweise sind öffentlich sichtbare Projektkonventionen und stehen in [Agent Reference](./docs/Agent-Reference.md) und [AGENTS.md](./AGENTS.md).

## Live Site

- Production URL: `https://valentindibbern.github.io/Website/`
- Deployment-Ziel: GitHub Pages

## Quick Start

```sh
bun install
bun dev
```

Lokale Vorschau:

- Dev-Server: `http://localhost:4321`
- Production Build: `bun build`
- Preview des Builds: `bun preview`
- Astro-Checks: `bun astro check`

## Project Overview

```text
/
├── docs/
│   ├── Stack.md
│   ├── Architecture.md
│   ├── Content-System.md
│   ├── Components.md
│   ├── Pages.md
│   ├── Workflows.md
│   ├── Deployment.md
│   └── Agent-Reference.md
├── src/
│   ├── pages/
│   ├── layouts/
│   ├── components/
│   ├── config/
│   ├── content/
│   ├── utils/
│   └── styles/
└── package.json
```

### How it works

- `src/pages/*.astro` definiert die Routen der Website.
- `src/layouts/BaseLayout.astro` kapselt den globalen Rahmen, Meta-Tags und das Basis-Markup.
- `src/components/*` enthält wiederverwendbare UI-Bausteine wie den Terminal-Output.
- `src/content/*` speichert redaktionelle Inhalte als Markdown-Dateien.
- `src/content.config.ts` beschreibt die Content Collections und ihre Schemas.
- `src/utils/content.ts` bündelt Lade-, Sortier- und Formatierungslogik für Content.
- `src/styles/global.css` enthält das globale Styling und Tailwind v4.

## Documentation

- [Stack](./docs/Stack.md): verwendete Technologien, Tools und Libraries
- [Architecture](./docs/Architecture.md): Projektaufbau und Datenfluss
- [Content System](./docs/Content-System.md): Content Collections und Content-Ladung
- [Components](./docs/Components.md): wichtige UI-Bausteine
- [Pages](./docs/Pages.md): was jede Seite rendert und welche Daten sie nutzt
- [Workflows](./docs/Workflows.md): typische Änderungen und wo sie umgesetzt werden
- [Deployment](./docs/Deployment.md): Build, Preview und Base-URL-Verhalten
- [Agent Reference](./docs/Agent-Reference.md): öffentliche Arbeitskonventionen für Agents und KI-Systeme

## Source Of Truth

- `package.json`
- `astro.config.mjs`
- `tsconfig.json`
- `eslint.config.js`
- `.prettierrc.mjs`
- `bun.lock`

## Commands

Alle Befehle werden aus dem Repository-Root ausgeführt.

| Command | Purpose |
| --- | --- |
| `bun install` | Dependencies installieren |
| `bun dev` | Lokalen Dev-Server starten |
| `bun build` | Production Build erzeugen |
| `bun preview` | Production Build lokal prüfen |
| `bun astro check` | Astro- und TypeScript-Checks ausführen |
| `bun astro -- --help` | Astro-CLI-Hilfe anzeigen |

## Notes

- Keine Änderungen an `dist/`, `.astro/` oder `node_modules/`.
- Die Doku ist absichtlich verteilt: Überblick in `README.md`, technische Tiefe in `docs/`.
- Alle Dokumentationsdateien sind für ein öffentliches Repository geschrieben.
