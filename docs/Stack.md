# Stack

Technische Übersicht der im Projekt tatsächlich verwendeten Werkzeuge, Libraries und Frameworks.

## Core Stack

- Bun
  - Package Manager und Runtime für `dev`, `build`, `preview` und `astro`-Befehle.
- Astro
  - Framework für Seiten, Layouts, Content Collections und statisches Rendering.
- TypeScript
  - Typisierung für Komponenten, Utilities und Content-Schemas.

## Content And Rendering

- Astro Content Collections
  - Zentrale Schicht für Markdown-Inhalte in `src/content/*`.
- Markdown
  - Primäres Format für editierbare Inhalte und Dokumentation.

## UI And Styling

- Alpine.js
  - Kleine Interaktivität auf der Client-Seite, ohne ein schweres Frontend-Framework.
- Tailwind CSS v4
  - Utility-first Styling-Grundlage für Layout, Abstände, Typografie und responsives Verhalten.
- `@tailwindcss/vite`
  - Vite-Integration für Tailwind v4 im Astro-Build.
- CSS Custom Properties
  - Design-Tokens für Terminalfarben, Maximalbreiten und Grundflächen in `src/styles/global.css`.

## Developer Tooling

- ESLint
  - Linting für JavaScript, TypeScript, CSS, JSON und Markdown.
- Prettier
  - Einheitliches Formatieren der Code- und Dokumentationsdateien.
- `@astrojs/ts-plugin`
  - TypeScript-Integration und Astro-spezifische Typing-Unterstützung.
- `@eslint/js`, `@eslint/css`, `eslint-plugin-astro`, `@typescript-eslint/parser`, `globals`
  - Linting-Stack für die im Projekt genutzten Dateitypen.

## Libraries Used In The App

- `figlet`
  - ASCII-Schriftzug auf der Startseite.
- `@lucide/astro`
  - Icon-Set für UI-Bausteine.
- `clsx`
  - Bedingte Klassenkombinationen.
- `tailwind-merge`
  - Zusammenführen von Tailwind-Klassen ohne Konflikte.
- `tailwind-variants`
  - Variants für komponentennahe Style-Definitionen.

## Not Currently Used

- DaisyUI
  - In den Projektregeln erwähnt, aber aktuell nicht in `package.json` oder `src/styles/global.css` aktiv.
- HTMX
  - Kein aktueller Import oder Build-Bezug im Repository.
- Starlight
  - Nicht Teil der aktuellen Website.
- Effect
  - Nicht Teil der aktuellen Website.
- Bejamas
  - Kein technischer Bestandteil des Projekts.
