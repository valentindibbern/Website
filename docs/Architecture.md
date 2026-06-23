# Architecture

## Overview

Dieses Projekt ist eine einzelne Astro-Site ohne Monorepo-Struktur. Die Website ist statisch, content-driven und auf eine terminalartige Darstellung ausgerichtet.

## Main Layers

- `src/pages/`
  - Definiert die Routen der Website.
  - Jede `.astro`-Datei wird direkt zu einer Seite.
- `src/layouts/`
  - Enthält den globalen Rahmen mit Header, `<head>`-Metadaten und Basis-Markup.
- `src/components/`
  - Wiederverwendbare UI-Bausteine für Terminal-Ausgaben, Navigation und Header.
- `src/content/`
  - Markdown-basierte redaktionelle Inhalte für Profil, Projekte, Referenzen, Terminaltexte und Snippets.
- `src/utils/`
  - Hilfsfunktionen für Content-Laden, Sortierung, Formatierung und URL-Handling.
- `src/styles/global.css`
  - Globales Styling, Tailwind-Einstieg und Design-Tokens.
- `src/config/`
  - Zentrale Konfigurationen wie die Navigation.

## Data Flow

1. Content wird in `src/content/*` als Markdown gepflegt.
2. `src/content.config.ts` definiert Collections und validiert Frontmatter.
3. `src/utils/content.ts` lädt Collections, sortiert Einträge und formatiert Ausgabe.
4. Seiten wie `src/pages/index.astro` holen die Daten zur Build-Zeit.
5. Komponenten wie `TerminalOutput.astro` rendern die Ausgabe in einem konsistenten Terminal-Look.
6. Astro erzeugt statische HTML-Dateien für Deployment und Preview.

## Routing Model

- `src/pages/index.astro` ist die Home-Seite.
- `src/pages/about.astro` bündelt Profil, About-Text und Lebenslauf-artige Inhalte.
- `src/pages/projects.astro` zeigt alle Projekte.
- `src/pages/references.astro` zeigt Referenzen und Nachweise.
- `src/pages/links.astro` rendert Kontakt- und Profilrouten als Terminalausgabe.

## Navigation And Base Paths

- `src/config/navigation.ts` definiert die sichtbaren Navigationslinks.
- `src/utils/url.ts` erzeugt Links mit `import.meta.env.BASE_URL`.
- Das ist wichtig, weil `astro.config.mjs` aktuell `base: "/Website"` setzt.
- Interne Links sollten deshalb über `withBase()` oder die bestehende Navigation laufen.

## Design Principles

- Inhalt und Darstellung sind getrennt.
- Wiederverwendbare Inhalte leben in Content Collections statt in JSX/TS-Objekten.
- Die Terminal-Optik ist bewusst konsistent, damit neue Inhalte ohne Layout-Bruch ergänzt werden können.
- Statische Generierung ist die Standardannahme, nicht SSR.
- GitHub-Pages-Kompatibilität ist Teil der Architekturannahme.
