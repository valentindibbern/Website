# Workflows

## Goal

Diese Datei beschreibt typische Änderungen am Projekt und welche Stellen dafür relevant sind.

## Public Documentation Baseline

- Das Repository ist öffentlich.
- Dokumentation muss für externe Leser verständlich sein.
- Keine privaten Arbeitsnotizen, Zugangsdaten oder persönlichen Rohinformationen dokumentieren.
- README erklärt den öffentlichen Einstieg; Detailwissen gehört in passende Dateien unter `docs/`.

## Add Or Change Content

- Inhalt in `src/content/*` bearbeiten.
- Schema in `src/content.config.ts` prüfen, wenn Frontmatter-Felder geändert werden.
- Formatierung in `src/utils/content.ts` anpassen, wenn sich die Ausgabeform ändert.
- Betroffene Seite in `src/pages/*` prüfen.
- Dokumentation in `docs/Content-System.md` aktualisieren.

## Add A Page

- Neue Route in `src/pages/` anlegen.
- `BaseLayout` verwenden, damit Header, Meta-Tags und globales Styling konsistent bleiben.
- Navigation in `src/config/navigation.ts` ergänzen, wenn die Seite erreichbar sein soll.
- Interne Links mit `withBase()` oder bestehender Navigation base-kompatibel halten.
- `docs/Pages.md` und bei Bedarf `README.md` aktualisieren.

## Add A Component

- Komponente in `src/components/` anlegen.
- Content-Logik nicht in die Komponente ziehen, wenn sie in `src/utils/content.ts` wiederverwendbar ist.
- Props klein und explizit halten.
- `docs/Components.md` um Zweck, Eingaben und typische Nutzung erweitern.

## Change Styling

- Globale Design-Tokens in `src/styles/global.css` pflegen.
- Bestehenden Terminal-Stil respektieren.
- Neue Klassen nur einführen, wenn sie eine klare wiederverwendbare Rolle haben.
- `docs/Architecture.md` oder `docs/Components.md` aktualisieren, wenn sich Layout- oder Komponentenverhalten ändert.

## Change Tooling

- `package.json`, `astro.config.mjs`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.mjs` und `bun.lock` als Source of Truth behandeln.
- `docs/Stack.md` aktualisieren, wenn Dependencies, Integrationen oder Build-Tools geändert werden.
- `README.md` aktualisieren, wenn sich Befehle oder Setup-Schritte ändern.

## Before Finishing

- `bun astro check` ausführen, wenn Astro-, TypeScript-, Content- oder Komponentenlogik geändert wurde.
- `bun build` ausführen, wenn Seiten, Routing, Content-Schemas oder Deployment-Verhalten betroffen sind.
- Dokumentationsänderungen mit der eigentlichen Projektänderung committen.
- Prüfen, dass neue Doku öffentlich teilbar ist.
