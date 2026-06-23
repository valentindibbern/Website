# Kompakter Abstand Für Content Rows

## Summary

Der Abstand zwischen Row-Titel und Content wird über die bestehende Grid-Struktur in `.output-pairs` verkleinert. Die Labels bleiben weiterhin spaltenweise ausgerichtet, aber die Label-Spalte wird nur noch so breit wie der längste Label-Text plus kleiner Abstand.

## Key Changes

- `.output-pairs` behält das zweispaltige Grid, damit alle Values auf derselben horizontalen Linie starten.
- Die erste Grid-Spalte wird von `minmax(11rem, 18rem)` auf eine content-nahe Breite umgestellt.
- Der Abstand zwischen Label- und Value-Spalte wird deutlich reduziert, z. B. von `1.25rem` auf `0.5rem`.
- Die Labels werden rechtsbündig ausgerichtet, damit kurze Labels an der längsten Labelkante enden und die Values sauber direkt danach beginnen.
- Mobile bleibt unverändert einspaltig, damit kleine Viewports nicht gedrängt wirken.

## Implementation Changes

- In `src/styles/global.css` `.output-pairs` ändern auf:
  - `grid-template-columns: max-content minmax(0, 1fr);`
  - `column-gap: 0.5rem;`
- In `.output-label` ergänzen:
  - `justify-self: end;`
- Die bestehende `::after`-Doppelpunktausgabe bleibt erhalten, damit der sichtbare Abstand nach dem längsten Titel minimal und konsistent bleibt.
- Keine Änderung an `TerminalOutput.astro` nötig, weil die aktuelle `dt`/`dd`-Struktur bereits passend ist.

## Test Plan

- `bun astro check` ausführen.
- `bun run build` ausführen.
- Im Browser prüfen:
  - bei `working style` beginnt der Content fast direkt nach dem Doppelpunkt
  - alle anderen Values beginnen auf derselben Höhe
  - Home, About, Projects und References behalten die Row-Struktur
  - mobile Ansicht bleibt einspaltig und lesbar

## Assumptions

- Der längste sichtbare Label-Text pro Row-Gruppe bestimmt die Startposition der Values.
- `max-content` ist hier passend, weil Labels kurze redaktionelle Feldnamen sind.
- Der gewünschte Abstand ist ein kleiner visueller Abstand, nicht komplett bündig ohne Zwischenraum.
