# Deployment

## Build Model

Die Website wird statisch gebaut. Astro erzeugt fertige Dateien für `dist/`; zur Laufzeit ist kein Node-Server nötig.

GitHub Actions nutzt Bun explizit als Package Manager. Der Deploy-Workflow setzt `package-manager: bun` für `withastro/action`, damit die Installation nicht von Lockfile-Autodetection abhängt.

Das Bewerbungsgate bleibt GitHub-Pages-kompatibel, weil es ohne Server auskommt. Der externe Dateilink liegt als verschlüsselter Payload im Build und wird im Browser per Web Crypto entschlüsselt. Der Zugangscode muss deshalb lang, zufällig und nicht wiederverwendet sein. Konkrete Risikoanalysen zu diesem Modell gehören in die privaten Docs.

Öffentlich dokumentiert ist der aktuelle Deployment-Zustand. Konkrete Hosting-Recherche, Migrationspläne und Risikoabwägungen gehören in das private Submodule unter `docs/private/`.

## Commands

- `bun run build`
  - Erzeugt den Production Build.
- `bun run encrypt:application-link`
  - Liest `APPLICATION_ACCESS_PASSWORD` und `APPLICATION_ACCESS_URL` aus der Umgebung oder lokal `.application-secrets.local.json`, verlangt ein starkes Passwort und eine HTTPS-URL und schreibt den verschlüsselten Payload nach `src/config/applicationAccess.ts`.
- `bun run build:production`
  - Erzeugt zuerst den verschlüsselten Bewerbungsgate-Payload und baut danach die Website.
- `bun preview`
  - Prüft den gebauten Output lokal.
- `bun astro check`
  - Prüft Astro-, TypeScript- und Content-Fehler.

## GitHub Pages Settings

- `astro.config.mjs` setzt `site: "https://valentindibbern.github.io"`.
- Die öffentliche Website liegt unter `https://valentindibbern.github.io/`.
- Das Repository ist als GitHub-Pages-User-Site unter `valentindibbern.github.io` gedacht; deshalb wird keine Astro-`base` gesetzt.
- Interne Links sollten weiterhin Root-Pfade oder `withBase()` aus `src/utils/url.ts` verwenden, damit ein späterer Hosting-Wechsel kontrolliert bleibt.

## Application Gate Secrets

- `src/config/applicationAccess.ts` bleibt im Repository als leerer Placeholder.
- GitHub Pages nutzt die Repository-Secrets `APPLICATION_ACCESS_PASSWORD` und `APPLICATION_ACCESS_URL` direkt als Build-Umgebung.
- Der Workflow bricht vor dem Astro-Build mit einer klaren Fehlermeldung ab, wenn eines dieser Secrets fehlt.
- `.application-secrets.local.json` enthält lokal `password` und `url`, ist ignored und wird nur als Fallback verwendet, wenn keine Env-Secrets gesetzt sind.
- `APPLICATION_ACCESS_URL` muss eine HTTPS-URL sein.
- Das Passwort muss mindestens 16 Zeichen haben und Großbuchstaben, Kleinbuchstaben, Zahl und Sonderzeichen enthalten.
- Für echte Deployments sollte das Passwort eine lange zufällige Passphrase sein, nur für eine Bewerbungsphase gelten und danach rotiert oder entfernt werden.
- Das Formular nutzt den Begriff Zugangscode und sendet den eingegebenen Wert nicht an einen Server; die Entschlüsselung passiert vollständig im Browser.

## Output

- Build-Ziel ist `dist/`.
- `dist/` ist generiert und wird nicht manuell bearbeitet.
- `.astro/` ist generiert und wird nicht manuell bearbeitet.

## Deployment Checklist

- `bun astro check`
- `bun run build`
- `bun run build:production`, wenn Deployment-Secrets verfügbar sind.
- `gh secret list` muss `APPLICATION_ACCESS_PASSWORD` und `APPLICATION_ACCESS_URL` zeigen, bevor GitHub Pages deployen kann.
- Navigation und interne Links auf Base-URL-Kompatibilität prüfen.
- Prüfen, dass keine Klartext-Bewerbungslinks oder Passwörter in Repository oder `dist/` stehen.
- Vor Commits prüfen, dass `src/config/applicationAccess.ts` wieder den leeren Placeholder enthält.
- Nach einer Bewerbungsphase den produktiven Payload entfernen oder mit neuer Passphrase neu erzeugen.
- Keine Änderungen in `dist/`, `.astro/` oder `node_modules/` committen.
