# Deployment

## Build Model

Die Website wird statisch gebaut. Astro erzeugt fertige Dateien für `dist/`; zur Laufzeit ist kein Node-Server nötig.

Das Bewerbungsgate bleibt GitHub-Pages-kompatibel, weil es ohne Server auskommt. Der externe Dateilink liegt nur als verschlüsselter Payload im Build und wird im Browser per Web Crypto entschlüsselt. Dieser Payload ist öffentlich abrufbar; der Schutz hängt an einem starken, nicht wiederverwendeten Passwort und ersetzt keine serverseitige Autorisierung für sensible Dateien.

## Commands

- `bun build`
  - Erzeugt den Production Build.
- `bun run encrypt:application-link`
  - Liest `.application-secrets.local.json`, verlangt ein starkes Passwort und eine HTTPS-URL und schreibt den verschlüsselten Payload nach `src/config/applicationAccess.ts`.
- `bun run build:production`
  - Erzeugt zuerst den verschlüsselten Bewerbungsgate-Payload und baut danach die Website.
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

## Application Gate Secrets

- `src/config/applicationAccess.ts` bleibt im Repository als leerer Placeholder.
- `.application-secrets.local.json` enthält lokal `password` und `url`, ist ignored und wird nicht committed.
- GitHub Pages nutzt die Repository-Secrets `APPLICATION_ACCESS_PASSWORD` und `APPLICATION_ACCESS_URL`.
- `APPLICATION_ACCESS_URL` muss eine HTTPS-URL sein.
- Das Passwort muss mindestens 16 Zeichen haben und Großbuchstaben, Kleinbuchstaben, Zahl und Sonderzeichen enthalten.

## Output

- Build-Ziel ist `dist/`.
- `dist/` ist generiert und wird nicht manuell bearbeitet.
- `.astro/` ist generiert und wird nicht manuell bearbeitet.

## Deployment Checklist

- `bun astro check`
- `bun run build`
- `bun run build:production`, wenn Deployment-Secrets verfügbar sind.
- Navigation und interne Links auf Base-URL-Kompatibilität prüfen.
- Prüfen, dass keine Klartext-Bewerbungslinks oder Passwörter in Repository oder `dist/` stehen.
- Vor Commits prüfen, dass `src/config/applicationAccess.ts` wieder den leeren Placeholder enthält.
- Keine Änderungen in `dist/`, `.astro/` oder `node_modules/` committen.
