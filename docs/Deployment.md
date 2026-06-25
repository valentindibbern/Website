# Deployment

## Build Model

Die Website wird statisch gebaut. Astro erzeugt fertige Dateien für `dist/`; zur Laufzeit ist kein Node-Server nötig.

Das Bewerbungsgate bleibt GitHub-Pages-kompatibel, weil es ohne Server auskommt. Der externe Dateilink liegt nur als verschlüsselter Payload im Build und wird im Browser per Web Crypto entschlüsselt.

## Commands

- `bun build`
  - Erzeugt den Production Build.
- `bun preview`
  - Prüft den gebauten Output lokal.
- `bun astro check`
  - Prüft Astro-, TypeScript- und Content-Fehler.

## GitHub Pages Settings

- `astro.config.mjs` setzt `site: "https://valentindibbern.github.io"`.
- `astro.config.mjs` setzt `base: "/Website"`.
- Die öffentliche Website liegt unter `https://valentindibbern.github.io/Website/`.
- Interne Links müssen deshalb die Base-URL berücksichtigen.
- Für manuelle Links im Code sollte `withBase()` aus `src/utils/url.ts` verwendet werden.

## Output

- Build-Ziel ist `dist/`.
- `dist/` ist generiert und wird nicht manuell bearbeitet.
- `.astro/` ist generiert und wird nicht manuell bearbeitet.

## Deployment Checklist

- `bun astro check`
- `bun build`
- Navigation und interne Links auf Base-URL-Kompatibilität prüfen.
- Prüfen, dass keine Klartext-Bewerbungslinks oder Passwörter in Repository oder `dist/` stehen.
- Keine Änderungen in `dist/`, `.astro/` oder `node_modules/` committen.
