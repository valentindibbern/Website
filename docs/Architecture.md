# Architecture

## Overview

Dieses Projekt ist eine einzelne statische Astro-Site. Die Website ist content-driven und rendert eine terminalartige Oberfläche.

## Main Layers

- `src/pages/`
  - Definiert die Routen und die Reihenfolge der sichtbaren Terminal-Ausgaben.
- `src/drafts/`
  - Enthält Seitenentwürfe, die Astro nicht als öffentliche Routen erzeugt.
- `src/layouts/`
  - Enthält den globalen Seitenrahmen.
- `src/components/`
  - Enthält Terminal-Komponenten, Header und Navigation.
- `src/content/text/`
  - Markdown-Texte.
- `src/content/data/`
  - YAML-Daten für Listen, Tabellen und Dictionaries.
- `src/utils/`
  - Loader-Helfer für Astro Content Collections und Content-Validierung pro Ausgabeform.
- `src/styles/global.css`
  - Globales Styling und Terminal-Design-Tokens.

## Data Flow

1. Texte werden in `src/content/text/*.md` gepflegt.
2. Strukturierte Daten werden in `src/content/data/*.yaml` gepflegt.
3. `src/content.config.ts` definiert die Collections `text` und `data`.
4. `src/utils/content.ts` lädt Einträge über Astro Content Collections.
5. Seiten setzen `TerminalCommand` und die passende Output-Komponente.
6. Output-Komponenten laden per `src` ihre Quelle.
7. Astro erzeugt statische HTML-Dateien.

## Routing Model

- `src/pages/index.astro` ist die Home-Seite.
- `src/pages/about.astro` bündelt Profil, About-Text, Skills, Ausbildung, Erfahrung, Sprachen und Hobbys.
- `src/pages/projects.astro` zeigt alle Projekte.
- `src/pages/links.astro` zeigt Kontakt- und Profilrouten.
- `src/drafts/references.astro` hält die References-Seite als nicht veröffentlichte Vorlage.

## Navigation And Base Paths

- `src/config/navigation.ts` definiert die sichtbaren Navigationslinks.
- Nicht veröffentlichte Entwürfe werden nicht in der Navigation verlinkt.
- `src/utils/url.ts` erzeugt Links mit `import.meta.env.BASE_URL`.
- Das ist wichtig, weil `astro.config.mjs` aktuell `base: "/Website"` setzt.

## Design Principles

- Content-Dateien bleiben einfach editierbar.
- Markdown wird für Text genutzt, YAML für Struktur.
- Seiten bestimmen Reihenfolge und Kontext.
- Komponenten bestimmen die Ausgabeform und laden ihre Quelle über `src`.
- Statische Generierung ist die Standardannahme.
- GitHub-Pages-Kompatibilität ist Teil der Architekturannahme.
