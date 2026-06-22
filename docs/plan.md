# Plan: Website-Inhalte dateibasiert über Astro Content Collections laden

## Summary

- Ziel: Texte und strukturierte Inhalte aus `src/config/portfolio.ts` in bearbeitbare Markdown-Dateien auslagern, ohne das Terminal-/ASCII-Design zu verändern.
- Technischer Ansatz: Astro Content Collections mit `defineCollection()`, `glob()` aus `astro/loaders`, `getCollection()`, `getEntry()` und bei Bedarf `render()`.
- Ergebnis: Astro liest die Markdown-Dateien beim Build, validiert Metadaten, rendert Inhalte statisch und GitHub Pages bekommt weiterhin nur fertige HTML/CSS/JS-Dateien.
- Gewählte Defaults: Markdown als Content-Quelle, gemischtes Rendering, leicht validierte Schemas.

## Key Changes

- Neue zentrale Content-Schicht unter `src/content/`:
    - `src/content/profile/` für Profil, About-Fliesstext und Kurzangaben.
    - `src/content/projects/` für einzelne Projekte.
    - `src/content/references/` für Referenzen und Nachweise.
    - `src/content/terminal/` oder `src/content/snippets/` für kleine wiederverwendbare Textblöcke wie Hinweise, Intro-Texte, Skills, Sprachen und Hobbys.
- Neue Astro-Konfiguration `src/content.config.ts`:
    - `defineCollection()` definiert die Collections.
    - `glob()` lädt Markdown-Dateien aus den Content-Ordnern.
    - Schemas prüfen nur die wichtigen Pflichtfelder, z. B. Titel, Reihenfolge, Command, Summary/Text.
- Bestehende UI-Schicht bleibt bestehen:
    - `BaseLayout.astro`, `HeaderComponent.astro`, `TerminalOutput.astro` und `global.css` bleiben die Designquelle.
    - Seiten ändern nur ihre Datenquelle, nicht das visuelle System.
- `src/config/portfolio.ts` wird entweder entfernt oder stark reduziert:
    - Langfristiges Ziel: keine redaktionellen Texte mehr in TypeScript.
    - Falls kleine rein technische Ableitungen nötig sind, kommen sie in eine neue Helper-Datei, nicht zurück in große Content-Objekte.

## Datenfluss

- Bearbeitung:
    - Inhalte werden in Markdown-Dateien bearbeitet.
    - Frontmatter enthält strukturierte Felder wie `title`, `command`, `order`, `source`, `stack` oder `summary`.
    - Der eigentliche Fliesstext steht im Markdown-Body.
- Build:
    - Astro lädt die Dateien über `glob()`.
    - Astro validiert sie über das Collection-Schema.
    - Seiten holen Inhalte mit `getCollection()` oder `getEntry()`.
    - Fliesstext wird mit `render()` zu HTML, Terminal-Ausgaben werden als Plain Text an `TerminalOutput` übergeben.
- Ausgabe:
    - `index.astro` lädt einzelne ausgewählte Inhalte, z. B. erstes Projekt und erste Referenz.
    - `projects.astro` lädt dieselbe Projekt-Collection vollständig.
    - `about.astro` lädt Profil, About-Text, Skills, Ausbildung, Erfahrung, Sprachen und Hobbys aus denselben Quellen.
    - `references.astro` lädt dieselbe Referenz-Collection vollständig.
    - GitHub Pages hostet weiterhin die statisch erzeugte Website.

## Rendering-Regeln

- Fliesstextbereiche wie About-Copy dürfen als Markdown geschrieben und als HTML gerendert werden.
- Terminal-Blöcke bleiben optisch und technisch Terminal-Blöcke:
    - `command` kommt aus Frontmatter.
    - `body` kommt entweder aus einem Feld oder aus aus Markdown abgeleitetem Plain Text.
    - `TerminalOutput` zeigt weiterhin vorformatierten Text.
- Inhalte, die mehrfach erscheinen, werden nur einmal als Content-Datei gepflegt:
    - Das erste Projekt auf Home ist derselbe erste sortierte Eintrag wie in der Projektliste.
    - Die erste Referenz auf Home ist derselbe erste sortierte Eintrag wie auf der Referenzseite.
- Sortierung erfolgt über ein explizites `order`-Feld, nicht über Dateinamen allein.

## Public Interfaces / Types

- Neue interne Content-Interfaces entstehen durch Astro Collections:
    - `profile`: Einzel- oder kleine Collection für Name, Rolle, Ausbildung, Interessen, Arbeitsweise und About-Text.
    - `projects`: mehrere Markdown-Einträge mit `title`, `command`, `order`, optional `source`, `type`, `stack`, `summary`.
    - `references`: mehrere Markdown-Einträge mit `title`, `command`, `order`, optional `visibilityNote`.
    - `snippets`: kleine wiederverwendbare Texte und Listen.
- Bestehende Komponenten-Schnittstelle von `TerminalOutput` bleibt erhalten:
    - `path`
    - `command`
    - `body`
- Bestehende Routen bleiben erhalten:
    - `/`
    - `/about`
    - `/projects`
    - `/links`
    - `/references`

## Umsetzungsschritte

- Content-Struktur anlegen und aktuelle Werte aus `src/config/portfolio.ts` in Markdown-Dateien übertragen.
- `src/content.config.ts` mit Collections und leichten Schemas erstellen.
- Kleine Content-Helper-Funktionen ergänzen:
    - sortierte Collections holen.
    - ersten Eintrag einer Collection holen.
    - Terminal-Body aus strukturierten Feldern erzeugen.
    - Links weiterhin als JSON-ähnlichen Terminaltext formatieren.
- Seiten schrittweise migrieren:
    - zuerst `projects.astro`, weil dort die Struktur klar und wiederverwendbar ist.
    - danach `references.astro`.
    - danach `about.astro`, weil dort gemischtes Rendering nötig ist.
    - zuletzt `index.astro`, weil sie Inhalte aus mehreren Collections kombiniert.
- `src/config/portfolio.ts` nach erfolgreicher Migration entfernen oder nur temporär als Vergleichsquelle behalten, bis alle Imports ersetzt sind.

## Test Plan

- `bun astro check` ausführen, um Astro- und TypeScript-Fehler zu finden.
- `bun build` ausführen, um statische GitHub-Pages-Kompatibilität zu prüfen.
- Manuell prüfen:
    - Home zeigt weiterhin das erste Projekt und die erste Referenz.
    - Projects zeigt alle Projekte in korrekter Reihenfolge.
    - About rendert Fliesstext lesbar und Terminal-Blöcke unverändert im Stil.
    - References zeigt alle Referenzen in korrekter Reihenfolge.
    - Header, Navigation, Farben, Terminal-Prompts und ASCII-Stil bleiben unverändert.
- Regression prüfen:
    - Keine Imports mehr aus alter `portfolio.ts`, außer bewusst temporär.
    - Keine Content-Dateien in `public/` als primäre Datenquelle.
    - Kein Browser-`fs`, kein Runtime-Server, keine SSR-Abhängigkeit.

## Assumptions

- Markdown ist die primäre Bearbeitungsquelle.
- Gemischtes Rendering ist gewünscht: Fliesstext als HTML, Terminal-Ausgaben als Text.
- Leichte Validierung reicht: Pflichtfelder und Sortierung werden geprüft, aber Content bleibt einfach editierbar.
- Die Website bleibt eine statische Astro-Site für GitHub Pages.
- Designänderungen sind nicht Teil dieser Umsetzung; Layout und CSS sollen nur angepasst werden, wenn die Datenmigration sonst technisch nicht funktioniert.
