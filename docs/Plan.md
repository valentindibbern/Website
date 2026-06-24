# TerminalHeading-Komponente und einheitliche Überschriften

## Summary

Das Projekt bekommt eine neue Komponente `TerminalHeading.astro`, die ASCII-Überschriften mit `figlet.textSync()` rendert. Damit wird die aktuelle Home-Sonderlogik entfernt und die normalen `<h1 class="section-heading">...`-Überschriften auf Unterseiten werden durch dieselbe Terminal-Heading-Komponente ersetzt.

Aus der lokalen `figlet`-Doku relevant:

- `figlet.textSync(input, options)` erzeugt synchron ASCII-Art.
- `options.font` ist ein String mit dem FIGlet-Fontnamen.
- Die Fonts `Big` und `Small` sind lokal vorhanden.
- Bestehender Home-Code nutzt bereits `figlet.textSync("Valentin Dibbern", { font: "Big" })`.

## Implementation Changes

- Neue Komponente `src/components/TerminalHeading.astro`:
  - Props:
    - `text: string`
    - `size: "Big" | "Small"`
    - optional `id?: string`
    - optional `level?: 1 | 2 | 3`, Standard `1`
  - Intern:
    - importiert `figlet`
    - erzeugt `const asciiText = figlet.textSync(text, { font: size })`
    - rendert ein semantisches Heading-Element mit Screenreader-Text und sichtbarer ASCII-Ausgabe
  - Geplantes Markup:
    - Wrapper als dynamisches `h1`/`h2`/`h3`
    - sichtbarer ASCII-Text in `<span aria-hidden="true">`
    - normaler Text in einer `.sr-only`-Span für Accessibility
  - Grund: Das Heading bleibt semantisch und enthält nur phrasing content; der sichtbare ASCII-Span bewahrt die Figlet-Zeilen per CSS.

- CSS in `src/styles/global.css` vereinheitlichen:
  - `.ascii-logo` und `.section-heading` durch gemeinsame TerminalHeading-Klassen ersetzen oder auf diese mappen.
  - Neue Klassen:
    - `.terminal-heading`
    - `.terminal-heading-ascii`
    - `.terminal-heading.is-big`
    - `.terminal-heading.is-small`
    - `.sr-only`, falls noch nicht vorhanden
  - Big:
    - entspricht optisch ungefähr der bisherigen Home-ASCII-Darstellung.
    - horizontal scrollbar, damit lange ASCII-Zeilen nicht layouten.
  - Small:
    - für Unterseiten kompakter als Home.
    - ebenfalls horizontal scrollbar, keine viewport-skalierte Schriftlogik außerhalb bestehender `clamp()`-Muster.

- Seiten umstellen:
  - `src/pages/index.astro`
    - `figlet`-Import und `asciiName` entfernen.
    - Home-Hero ersetzt `<pre class="ascii-logo">` durch `<TerminalHeading text="Valentin Dibbern" size="Big" />`.
  - `src/pages/about.astro`
    - fehlende sichtbare Überschrift wieder einführen.
    - `<TerminalHeading id="about-title" text="about.md" size="Small" />`.
    - `aria-labelledby="about-title"` bleibt dadurch wieder gültig.
  - `src/pages/projects.astro`
    - fehlende sichtbare Überschrift wieder einführen.
    - `<TerminalHeading id="projects-title" text="projects/" size="Small" />`.
    - `aria-labelledby="projects-title"` bleibt dadurch wieder gültig.
  - `src/pages/links.astro`
    - `<h1 id="links-title" class="section-heading">links.yaml</h1>` ersetzen durch `<TerminalHeading id="links-title" text="links.yaml" size="Small" />`.
  - `src/pages/references.astro`
    - `<h1 id="references-title" class="section-heading">references.md</h1>` ersetzen durch `<TerminalHeading id="references-title" text="references.md" size="Small" />`.

## Documentation Changes

- `docs/Components.md` ergänzen:
  - Zweck von `TerminalHeading`.
  - Props `text`, `size`, `id`, `level`.
  - Hinweis, dass `size` direkt auf die Figlet-Fonts `Big` und `Small` begrenzt ist.
- `docs/Pages.md` aktualisieren:
  - Home nutzt `TerminalHeading` mit `Big`.
  - Unterseiten nutzen `TerminalHeading` mit `Small`.
- `docs/Architecture.md` oder `docs/Stack.md` bei Bedarf präzisieren:
  - `figlet` ist nicht mehr nur Home-spezifisch, sondern Teil des Terminal-Heading-Systems.
- `docs/Plan.md` nur ändern, wenn die Doku weiterhin als lebender Refactor-Plan gelten soll; ansonsten nicht anfassen.

## Test Plan

- `bun astro check`
  - prüft Astro-Komponenten, Props und TypeScript.
- `bun run build`
  - prüft statische Generierung aller fünf Seiten.
- Browser-/visuelle Prüfung:
  - `/`
    - zeigt `Valentin Dibbern` als Big-ASCII-Heading.
    - Home-Lede und Terminal-Ausgaben bleiben darunter sichtbar.
  - `/about`
    - zeigt `about.md` als Small-ASCII-Heading.
    - `aria-labelledby="about-title"` verweist auf existierendes Element.
  - `/projects`
    - zeigt `projects/` als Small-ASCII-Heading.
    - `aria-labelledby="projects-title"` verweist auf existierendes Element.
  - `/links`
    - zeigt `links.yaml` als Small-ASCII-Heading.
  - `/references`
    - zeigt `references.md` als Small-ASCII-Heading.
- Responsive Prüfung:
  - ASCII-Headings verursachen keinen horizontalen Page-Overflow.
  - Falls ASCII-Zeilen breiter als der Viewport sind, scrollt nur der Heading-Block horizontal.
- Regression:
  - Keine verbleibenden direkten `figlet`-Imports in Seiten.
  - Keine verbleibende Nutzung von `.ascii-logo` oder `.section-heading`, außer als bewusstes Backward-Compatible-Alias während einer kurzen Übergangsphase.

## Assumptions

- `size` soll bewusst nur `"Big"` und `"Small"` erlauben, nicht beliebige Figlet-Fonts.
- Home verwendet `"Big"`, alle Unterseiten verwenden `"Small"`.
- TerminalHeading ist für Seitenüberschriften gedacht, nicht für jedes Terminal-Command oder jeden Content-Block.
