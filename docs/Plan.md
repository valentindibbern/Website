# Content-Row-Refactor mit Rückwärtskompatibilität

## Summary

Ziel ist eine echte Trennung von Inhalt und Darstellung für die Bereiche, die aktuell zeilenweise im Terminal gerendert werden. Der Plan wird so geschnitten, dass bestehende Seiten während der Migration weiter funktionieren und nicht alle Inhalte auf einmal umgebaut werden müssen.

Nicht jede Ausgabe soll zwangsläufig in das neue Zeilenmodell wechseln: JSON-artige oder bewusst textbasierte Ansichten wie `links` bleiben nur dann unverändert, wenn sie keinen klaren Gewinn durch `label`/`value`-Trennung haben.

## Key Changes

- Ein gemeinsames `ContentRow`-Modell wird als technische Basisschicht eingeführt, nicht als neue redaktionelle Pflicht für alle Collections.
- Die Content-Schemas bekommen nur dort strukturierte Zeilenfelder, wo sie tatsächlich gebraucht werden; bestehende Flat-Felder bleiben während der Migration erhalten.
- `src/utils/content.ts` wird so erweitert, dass Seiten sowohl alte String-Ausgaben als auch neue Zeilenlisten aus denselben Content-Quellen beziehen können.
- `TerminalOutput` wird zu einem dualen Renderer:
  - Fallback für bisherige `body`-Strings
  - strukturierte Ausgabe über separate Label-/Value-Elemente, wenn Rows vorhanden sind
- Die Migration folgt einer klaren Reihenfolge:
  - `profile` zuerst
  - danach `projects` und `references`
  - anschließend `terminal`
  - `links` nur dann, wenn sich daraus ein realer struktureller Vorteil ergibt
- Die Seitenlogik wird reduziert:
  - `index.astro` nutzt die neuen Daten nur für die kompakten Vorschauen
  - `about.astro` nutzt die strukturierte Ausgabe für Profil und Terminal-Listen
  - `projects.astro` und `references.astro` übernehmen dieselbe Render-Logik für ihre Einträge
  - `links.astro` bleibt bewusst außerhalb der Umstellung, solange die JSON-Darstellung gewollt ist

## Implementation Changes

- In der Content-Schicht wird ein wiederverwendbares Row-Schema definiert, mit minimalen Pflichtfeldern:
  - `label`
  - `value`
  - optional `kind` oder `meta` nur, wenn ein konkreter Stil-/Layout-Unterschied gebraucht wird
- Die Content-Schemas werden so erweitert, dass jede relevante Collection optional strukturierte Zeilen liefern kann:
  - entweder direkt als `rows`
  - oder, wo sinnvoll, zusätzlich zu bestehenden Feldern
- In `src/utils/content.ts` entstehen Helper, die:
  - aus Content-Einträgen strukturierte Rows erzeugen
  - bestehende String-Ausgaben weiter unterstützen
  - stabile Sortierung und deterministische Reihenfolge sicherstellen
- `TerminalOutput` erhält eine klare semantische Struktur:
  - Wrapper pro Ausgabe
  - Titel/Prompt wie bisher
  - bei Rows ein semantisches Paar-Layout, vorzugsweise `dl` mit getrennten Klassen für Label und Value
- Das Styling in `src/styles/global.css` wird ergänzt:
  - getrennte Klassen für Label und Value
  - Layout für ein- und mehrspaltige Zeilen
  - mobile Umbrüche ohne Verlust der Lesbarkeit
- Dokumentation wird konsistent nachgezogen:
  - `docs/Content-System.md` erklärt das neue Row-Modell und die Migrationsstrategie
  - `docs/Pages.md` beschreibt, welche Seiten welche Form der Ausgabe verwenden
  - `README.md` wird nur ergänzt, wenn sich die öffentliche Arbeitsweise oder die Inhaltsstruktur für Leser wirklich ändert

## Test Plan

- `bun astro check` muss fehlerfrei laufen.
- `bun build` muss nach der Migration weiterhin erfolgreich sein.
- Visuell prüfen:
  - Home zeigt die Vorschauen unverändert oder gezielt verbessert
  - About rendert Profilfelder und Terminal-Listen separat lesbar
  - Projects und References behalten ihre aktuelle Informationsdichte
  - Mobile Layout bricht Rows sauber um
- Inhaltsänderungen testen:
  - eine neue Row nur in Markdown ergänzen
  - einen Labelnamen ändern
  - die Reihenfolge in der Content-Datei ändern
  - prüfen, dass die Ausgabe ohne Seitencodeänderung mitzieht
- Rückwärtskompatibilität prüfen:
  - bestehende Einträge ohne neue Row-Felder dürfen nicht brechen
  - einfache String-Outputs müssen weiter renderbar bleiben, bis sie bewusst migriert werden

## Assumptions

- Die neue Struktur ist ein technisches Hilfsmittel für strukturierte Ausgaben, keine Pflicht für jede Collection.
- `links` bleibt zunächst textbasiert, weil dort das JSON-Layout derzeit funktional und bewusst anders ist.
- Bestehende Flat-Felder bleiben temporär erlaubt, damit die Migration schrittweise erfolgen kann.
- Die semantische HTML-Optimierung darf visuell konservativ bleiben, solange die Terminal-Optik erhalten bleibt.
- Die Dokumentation muss den Endzustand und die Migrationslogik beschreiben, nicht nur die Zielvision.
