# Agent Reference

## Purpose

Diese Datei ist der öffentliche Einstieg für Agents und andere KI-Systeme, die an diesem Repository arbeiten.

## Public Context

- Das GitHub-Repository ist öffentlich.
- Keine privaten Daten, Zugangsdaten, internen Notizen oder nicht verifizierten Annahmen dokumentieren.
- Agent-Hinweise sind öffentliche Projektkonventionen und müssen entsprechend knapp und sachlich bleiben.

## First Reads

- `README.md`
- `AGENTS.md`
- `docs/public/Stack.md`
- `docs/public/Architecture.md`
- `docs/public/Content-System.md`
- `docs/public/Workflows.md`
- `docs/public/Deployment.md`
- `src/content.config.ts`
- `src/utils/content.ts`

## Repo Rules

- Ein einziges Astro-Projekt, kein Monorepo.
- Source of truth für Tools und Konventionen:
  - `package.json`
  - `astro.config.mjs`
  - `tsconfig.json`
  - `eslint.config.js`
  - `.prettierrc.mjs`
  - `bun.lock`
- Nicht anfassen:
  - `dist/`
  - `.astro/`
  - `node_modules/`

## Common Entry Points

- Seiten: `src/pages/*`
- Layout: `src/layouts/BaseLayout.astro`
- UI: `src/components/*`
- Inhalte: `src/content/*`
- Content-Loader: `src/content.config.ts`
- Content-Utilities: `src/utils/content.ts`
- Styling: `src/styles/global.css`
- Navigation: `src/config/navigation.ts`

## Typical Workflows

- Neue Inhalte hinzufügen:
  - passende Markdown-Datei in `src/content/*` anlegen
  - Frontmatter in `src/content.config.ts` Schema spiegeln
  - Seite oder Utility anpassen
- Bestehende Ausgabe ändern:
  - zuerst prüfen, ob die Änderung in `src/utils/content.ts` gehört
  - danach nur die konsumierende Seite anfassen
- Layout ändern:
  - `src/layouts/BaseLayout.astro`
  - dazugehörige Komponenten unter `src/components/*`
- Dokumentation aktualisieren:
  - `README.md` für Einstieg und Navigationshinweise
  - passende Datei unter `docs/public/*` für öffentliche Details

## Validation

- `bun astro check`
- `bun run build`

## Git Behavior

- `agent-main` ist der gemeinsame Integrationsbranch für Agent-Arbeit.
- Agents arbeiten nicht direkt auf `main` und mergen nicht nach `main`.
- Der User merged `agent-main` bei Bedarf manuell nach `main`.
- Für jede Aufgabe einen eigenen `agent-*` Branch vom aktuellen `origin/agent-main` erstellen.
- `agent-main` nicht als Task-Branch verwenden.
- Sinnvolle Zwischenschritte committen und beschreibende Commit-Messages nutzen.
- Am Ende der Aufgabe den Task-Branch pushen und einen Pull Request nach `agent-main` öffnen.
- PR-Diff, geänderte Dateien, relevante Checks, Doku-Änderungen und Mergebarkeit prüfen.
- Den Self-Review in der PR-Beschreibung oder als PR-Kommentar dokumentieren.
- Konflikte oder fehlgeschlagene Checks auf dem Task-Branch beheben und den sauberen PR per Squash-Merge nach `agent-main` mergen.

## Behavioral Notes

- Content soll bevorzugt in Markdown leben, nicht in großen TS-Datenobjekten.
- Terminal-Ausgaben sind bewusst textbasiert.
- Die Doku soll neue Entwickler schnell orientieren und Agents robuste Pfade geben.
- Jede Projektänderung braucht eine passende Doku-Änderung.
- README und `docs/public/*` werden als öffentliche Referenz behandelt.
- `docs/private/` ist ein privates Submodule für Arbeitsnotizen, konkrete Pläne, Research und Risikoanalysen.
