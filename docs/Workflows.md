# Workflows

## Goal

Diese Datei beschreibt typische Änderungen am Projekt und welche Stellen dafür relevant sind.

## Public Documentation Baseline

- Das Repository ist öffentlich.
- Dokumentation muss für externe Leser verständlich sein.
- Keine privaten Arbeitsnotizen, Zugangsdaten oder persönlichen Rohinformationen dokumentieren.
- README erklärt den öffentlichen Einstieg; Detailwissen gehört in passende Dateien unter `docs/`.

## Add Or Change Content

- Freie Texte in `src/content/text/*.md` bearbeiten.
- Strukturierte Daten in `src/content/data/*.yaml` bearbeiten.
- `rows` für Dictionary-Ausgaben, `items` für Listen und `columns` plus `rows` für Tabellen verwenden.
- Schema in `src/content.config.ts` nur ändern, wenn eine neue strukturelle Datenform nötig ist.
- Loader in `src/utils/content.ts` nur anpassen, wenn sich die Content-Auswahl oder Validierung ändert.
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
- Terminal-Output-Komponenten laden ihre Quelle per `src`.
- Wiederverwendbare Content-Prüfung bleibt in `src/utils/content.ts`.
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

## Update Application Gate

- Lokale Secrets in `.application-secrets.local.json` pflegen; diese Datei bleibt ignored.
- CI-Secrets als `APPLICATION_ACCESS_PASSWORD` und `APPLICATION_ACCESS_URL` im GitHub-Repository setzen.
- Nur HTTPS-Ziele und starke, nicht wiederverwendete Passwörter verwenden.
- `bun run encrypt:application-link` nutzt zuerst Env-Secrets und fällt lokal auf `.application-secrets.local.json` zurück.
- Vor Commits `src/config/applicationAccess.ts` wieder als Placeholder prüfen.
- Vor Deployment mit `gh secret list` prüfen, dass beide Secret-Namen vorhanden sind.

## Before Finishing

- `bun astro check` ausführen, wenn Astro-, TypeScript-, Content- oder Komponentenlogik geändert wurde.
- `bun run build` ausführen, wenn Seiten, Routing, Content-Schemas oder Deployment-Verhalten betroffen sind.
- `bun run build:production` nur ausführen, wenn die lokalen oder GitHub-Secrets verfügbar sind.
- Dokumentationsänderungen mit der eigentlichen Projektänderung committen.
- Prüfen, dass neue Doku öffentlich teilbar ist.
