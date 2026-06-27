# Things To Do

Diese Datei sammelt Auffaelligkeiten aus dem Codebase-Review vom 2026-06-27. Geprueft wurden `bun astro check`, `bun run build`, eine lokale Preview unter `http://127.0.0.1:4321/Website/`, die Projektdokumentation und gezielte externe Referenzen. Die Hinweise wurden anschliessend gegen den aktuellen Code abgeglichen und nach Risiko praezisiert; sie sind keine bereits beschlossenen Fixes.

## Nachpruefung vom 2026-06-27

- Ergebnis: Die sieben Hinweise wurden erneut gegen Code, Dokumentation, `bun astro check`, `bun run build` und eine lokale Browserpruefung unter `http://127.0.0.1:4321/Website/` gegengeprueft. Es wurden keine vorgeschlagenen Fixes umgesetzt.
- Ergebnis: `bun astro check` meldet 0 Fehler, 0 Warnungen und 0 Hinweise. `bun run build` baut 5 statische Seiten erfolgreich. Das bestaetigt, dass die Punkte derzeit vor allem Architektur-, Sicherheits-, UX- und Dokumentationsrisiken sind, keine aktuellen Build-Blocker.
- Ergebnis: Die lokale Browserpruefung bestaetigt, dass Header- und Content-Links mit `/Website/`-Base gerendert werden, `/links` die Daten aus `links.yaml` als Dictionary zeigt und `/application` ein Passwortfeld mit `name="password"` und `autocomplete="current-password"` rendert.
- Kritische Einordnung: Die Loesungsvorschlaege duerfen nicht als gleichwertig gelesen werden. Bei Punkt 1 ist nur eine serverseitige Authentifizierung eine echte Sicherheitsloesung; die statische GitHub-Pages-Variante ist nur eine akzeptierte Risikoreduktion. Bei Punkt 2 ist kein einzelner `autocomplete`-Wert garantiert korrekt, weil Browser und Passwortmanager Hints unterschiedlich behandeln. Bei Punkten 5 und 6 ist zuerst eine Inhaltsentscheidung noetig, damit nicht Dokumentation an zufaellige Implementierungsdetails angepasst wird.
- Kritische Einordnung: Die Punkte 5 und 6 zeigen reale Dokumentationsdrift. `docs/Content-System.md` nennt fuer `links.yaml` noch `TerminalList src="links"`, waehrend Home und Links aktuell `TerminalDictionary src="links"` nutzen. `docs/Pages.md` nennt `education-previous.yaml` als About-Datenquelle, obwohl `/about` diese Datei nicht rendert.
- Kritische Einordnung: Punkt 4 ist latent, aber nicht harmlos. Ein nicht gerenderter Footer erzeugt heute keinen kaputten Link auf der Website; trotzdem ist `navLists.footer` eine oeffentliche Konfiguration und kann spaeter ohne weitere Pruefung von `NavComponent` verwendet werden. Deshalb sollte die Entscheidung "Route anlegen" oder "Footer-Eintrag entfernen" vor einer Footer-Einfuehrung getroffen werden.
- Kritische Einordnung: Punkt 7 sollte vor allem als Content-Qualitaetsproblem behandelt werden. Leere Tabellenzellen koennen absichtlich wirken, obwohl sie durch Tippfehler entstehen. Wenn optionale Spalten fachlich benoetigt werden, sollte diese Optionalitaet explizit modelliert werden; sonst sollten fehlende und unbekannte Keys hart fehlschlagen.

## 1. Statisches Bewerbungsgate kann offline angegriffen werden

- Ort im Code: `src/pages/application.astro` Zeilen 67-182, `scripts/encrypt-application-link.mjs` Zeilen 6 und 25-70, `docs/Deployment.md` Zeilen 5-8 und 30-37.
- Zeitpunkt der Ausfuehrung: Beim Production-Build schreibt `bun run build:production` den verschluesselten Payload in `src/config/applicationAccess.ts`; im Browser wird der Payload beim Laden von `/application` eingebettet und nach Formular-Submit entschluesselt.
- Wann das Problem auftauchen koennte: Sobald ein echter Payload deployed ist und das Passwort schwach, wiederverwendet oder spaeter kompromittiert wird.
- Bewertung: Korrekt. Der Code nutzt PBKDF2-HMAC-SHA-256 mit 600000 Iterationen und AES-GCM; das ist fuer Passwortableitung nicht der schwache Punkt. Das Grundrisiko bleibt das statische Modell.
- Was das Problem waere: Der Ciphertext ist oeffentlich aus dem statischen HTML abrufbar. Angreifer koennen Passwortversuche offline gegen den Payload fahren; es gibt keine serverseitige Autorisierung, kein Rate-Limit und keine Sperre. Die erzwungene Mindestkomplexitaet im Build-Skript reduziert das Risiko, ersetzt aber keine Zugriffskontrolle fuer wirklich sensible Bewerbungsdateien.
- Erste Vorschlaege: Fuer sensible Dateien einen serverseitigen Download mit Authentifizierung und Rate-Limiting nutzen. Falls GitHub Pages beibehalten wird, Passwort als zufaellige Passphrase mit hoher Entropie erzeugen, nicht wiederverwenden, regelmaessig rotieren, Payload nach Bewerbungsphase entfernen und in der UI klarer machen, dass es ein statisches Gate ist.
- Loesungsvorschlag: Wenn die Bewerbungsdateien wirklich vertraulich sind, GitHub Pages fuer diesen Download nicht als Sicherheitsgrenze verwenden. Stattdessen den Download hinter einen kleinen Server-/Serverless-Endpunkt legen, zum Beispiel Cloudflare Pages Functions, Netlify Functions oder eine andere Astro-Adapter-Umgebung mit On-Demand Rendering. Der Endpunkt prueft das Passwort oder einen einmaligen Token serverseitig, zaehlt Fehlversuche, begrenzt Requests und liefert erst danach einen kurzlebigen Redirect oder Stream zur Datei. Das Passwort und die Ziel-URL bleiben dann ausserhalb des statischen HTML.
- Loesungsvorschlag: Wenn GitHub Pages zwingend bleiben soll, den Hinweis als bewusstes Risiko dokumentieren und die statische Variante haerten: lange zufaellige Passphrase statt merkbarem Passwort, Passwort nur pro Bewerbungsphase verwenden, Payload nach Ablauf entfernen, keine dauerhaft gueltige Ziel-URL verwenden, und vor jedem Deployment sicherstellen, dass `src/config/applicationAccess.ts` nicht versehentlich einen alten produktiven Payload enthaelt. Das behebt die Offline-Angreifbarkeit nicht, reduziert aber die praktische Angriffsflaeche.
- Umsetzungshinweise: Bei einer serverseitigen Loesung muessten `docs/Deployment.md`, `docs/Architecture.md` und die Build-Commands angepasst werden, weil das Projekt dann nicht mehr rein statisch fuer diesen Pfad ist. Als Verifikation reichen nicht nur `bun astro check` und `bun run build`; zusaetzlich braucht es einen Test oder manuellen Check fuer falsches Passwort, korrektes Passwort, Rate-Limit und abgelaufene Tokens.

## 2. Bewerbungsformular kann Passwortmanager unpassend ansprechen

- Ort im Code: `src/pages/application.astro` Zeilen 30-37.
- Zeitpunkt der Ausfuehrung: Beim Rendern und Interagieren mit `/application` im Browser.
- Wann das Problem auftauchen koennte: Wenn ein Passwortmanager `autocomplete="current-password"` als Login-Passwortfeld interpretiert oder automatisch ein Konto-Passwort anbietet.
- Bewertung: Plausibel, aber niedriges Risiko. Das Feld ist technisch ein Passwortfeld und wird nicht abgeschickt; der Hinweis betrifft vor allem UX und Fehlbedienung durch Autofill.
- Was das Problem waere: Nutzer koennten versehentlich ein anderes gespeichertes Passwort in ein clientseitiges Entschluesselungsfeld einsetzen. Das Passwort wird zwar nicht an einen Server gesendet, bleibt aber unnoetig im Seitenkontext und kann die Bedienung verwechseln.
- Erste Vorschlaege: Fuer dieses Gate `autocomplete="off"` oder einen passenderen Wert pruefen, den Feldnamen weniger login-aehnlich waehlen und das Verhalten mit gaengigen Passwortmanagern testen. Vor einer Aenderung testen, weil Browser und Passwortmanager `autocomplete="off"` bei Passwortfeldern unterschiedlich behandeln koennen.
- Loesungsvorschlag: Das Formular klar als Entsperr-/Codefeld behandeln statt als Login. Naheliegende Variante: `autocomplete="off"` am Formular und am Feld setzen, `name="access-code"` oder `name="application-access"` statt `name="password"` verwenden und die sichtbare Beschriftung bei Bedarf von `passwort` auf einen weniger kontoartigen Begriff wie `zugangscode` aendern. Das kann Passwortmanager weniger stark triggern.
- Loesungsvorschlag: Falls Passwortmanager weiterhin stoeren, eine zweite Variante testen: `autocomplete="new-password"` kann bei manchen Managern verhindern, dass bestehende Login-Passwoerter vorgeschlagen werden, kann aber auch Generator-UI ausloesen. Deshalb nicht blind aendern, sondern in Chrome, Safari/Firefox und mindestens einem verbreiteten Passwortmanager pruefen.
- Umsetzungshinweise: Nach der Aenderung muss geprueft werden, dass die Entschluesselung unveraendert funktioniert, dass das Feld nach Erfolg weiter geleert wird und dass Accessibility nicht schlechter wird. `autocomplete="off"` ist nur ein Hint; moderne Browser oder Passwortmanager koennen ihn fuer Passwortfelder ignorieren.

## 3. Content-Links erlauben unsichere `http:`-Ziele

- Ort im Code: `src/content.config.ts` Zeilen 34-44 und `src/components/TerminalValue.astro` Zeilen 11-26.
- Zeitpunkt der Ausfuehrung: Beim Content-Check/Build validiert das Schema `href`; beim statischen Rendern normalisiert `TerminalValue` den Link.
- Wann das Problem auftauchen koennte: Wenn kuenftige YAML-Daten einen externen `http://`-Link mit `attributes: ["link"]` enthalten.
- Bewertung: Korrekt. Schema und Renderer erlauben `http:` ausdruecklich, waehrend gefaehrlichere Schemes wie `javascript:` und `data:` abgewiesen werden.
- Was das Problem waere: Auf der HTTPS-Website koennen sichtbare Links auf unverschluesselte Ziele fuehren. Das ist kein XSS, aber es ist ein Downgrade fuer Datenschutz und Integritaet des Zielaufrufs.
- Erste Vorschlaege: `http:` aus Schema und Renderer entfernen oder nur fuer explizit dokumentierte Ausnahmefaelle erlauben. Danach `docs/Content-System.md` anpassen und bestehende Content-Daten per `bun astro check` pruefen.
- Loesungsvorschlag: Die einfache, konsistente Loesung ist, `http:` in `isAllowedHref()` und `TerminalValue.normalizeHref()` zu entfernen. Erlaubt bleiben dann relative Pfade, Hashes, `https:`, `mailto:` und `tel:`. Dadurch schlagen unsichere externe Links schon im Content-Check fehl und werden nicht erst beim Rendern still verworfen.
- Loesungsvorschlag: Falls es echte Ausnahmefaelle fuer `http:` gibt, diese nicht implizit erlauben. Besser waere ein explizites Attribut wie `allow-insecure-http` oder eine kleine Allowlist fuer bekannte Hosts. Diese Ausnahme muss in `docs/Content-System.md` dokumentiert werden, damit spaetere Content-Aenderungen nicht versehentlich unsichere Links normalisieren.
- Umsetzungshinweise: Schema und Renderer muessen dieselbe Policy haben, sonst akzeptiert der Build Daten, die spaeter nicht als Link gerendert werden, oder umgekehrt. Nach der Aenderung `bun astro check` ausfuehren und alle YAML-Dateien pruefen, ob vorhandene externe Links auf HTTPS umgestellt werden koennen.

## 4. Footer-Navigation enthaelt eine nicht existierende Route

- Ort im Code: `src/config/navigation.ts` Zeilen 8-10; es gibt keine `src/pages/impressum.astro`.
- Zeitpunkt der Ausfuehrung: Sobald `navLists.footer` in einer Komponente gerendert wird oder ein Agent/Entwickler die Konfiguration als existierende Navigation interpretiert.
- Wann das Problem auftauchen koennte: Bei Einfuehrung eines Footers oder Wiederverwendung von `NavComponent` mit `navList="footer"`.
- Bewertung: Korrekt, aber aktuell latent. `HeaderComponent` rendert nur `navList="header"`; der kaputte Link wird erst sichtbar, wenn die Footer-Liste verwendet wird. Durch `withBase()` wuerde daraus im GitHub-Pages-Build ein Base-kompatibler, aber weiterhin nicht existierender Pfad.
- Was das Problem waere: Der Link `/impressum` fuehrt lokal ohne Base zu `/impressum` und im GitHub-Pages-Build zu `/Website/impressum`; beide Ziele haben aktuell keine Astro-Route und waeren kaputte Navigationslinks.
- Erste Vorschlaege: Entweder eine echte Impressum-Seite anlegen, den Footer-Eintrag entfernen oder die Footer-Navigation erst einfuehren, wenn alle Ziele geroutet sind.
- Loesungsvorschlag: Wenn ein Impressum rechtlich oder inhaltlich geplant ist, `src/pages/impressum.astro` als echte Route anlegen und in `docs/Pages.md` dokumentieren. Das passt zur Astro-Dateirouting-Logik: eine Datei unter `src/pages/` erzeugt die passende statische Route. Der Footer-Eintrag waere dann valide.
- Loesungsvorschlag: Wenn kein Impressum veroeffentlicht werden soll, den Footer-Eintrag aus `src/config/navigation.ts` entfernen oder die gesamte `footer`-Liste erst einfuehren, wenn sie wirklich gerendert wird. Das ist sauberer als eine Konfiguration mit nicht existierenden Routen.
- Umsetzungshinweise: Fuer dauerhaft stabile Navigation lohnt sich ein kleiner Link-/Route-Check im Build- oder Review-Prozess: alle internen `navLists`-Ziele gegen `src/pages` und ggf. bekannte dynamische Routen abgleichen. Nach einer Routenentscheidung auch `docs/Components.md` und `docs/Pages.md` aktualisieren.

## 5. Links-Seite ist anders dokumentiert als implementiert

- Ort im Code: `docs/Pages.md` Zeilen 50-57, `src/pages/links.astro` Zeilen 1-24, `src/content/data/links.yaml` Zeilen 1-18.
- Zeitpunkt der Ausfuehrung: Beim Build von `/links` und bei kuenftigen Content-Aenderungen an `links.yaml`.
- Wann das Problem auftauchen koennte: Wenn jemand der Dokumentation folgt und `links.yaml` als `items`-Liste pflegt oder `TerminalList` erwartet.
- Bewertung: Korrekt. `links.yaml` ist ein Dictionary mit `rows`, und `/links` rendert `TerminalDictionary`; die Doku nennt dagegen eine Liste.
- Was das Problem waere: Eine Umstellung der YAML-Datei auf `items` wuerde `TerminalDictionary src="links"` beim Build fehlschlagen lassen. Umgekehrt wuerden Entwickler, die der aktuellen Implementierung folgen, eine Doku vorfinden, die die Datenform falsch beschreibt.
- Erste Vorschlaege: Entscheiden, ob Links als Dictionary oder Liste gedacht sind. Dann entweder `src/pages/links.astro` auf `TerminalList` umstellen oder die Dokumentation und Beispiele konsequent auf Dictionary-Ausgabe korrigieren.
- Loesungsvorschlag: Die wahrscheinlich kleinste und stabilste Loesung ist, die Dokumentation an die Implementierung anzupassen: `/links` zeigt ein Dictionary aus `data/links.yaml`, nicht eine Liste. `docs/Pages.md` und ggf. `docs/Content-System.md` sollten die erwartete `rows`-Struktur mit `label`, `value`, optional `href` und `attributes: ["link"]` nennen.
- Loesungsvorschlag: Nur wenn die Darstellung bewusst listenartig werden soll, `src/pages/links.astro` auf `TerminalList` umstellen und `src/content/data/links.yaml` von `rows` auf `items` migrieren. Das waere ein echter Code- und Content-Umbau und sollte nur passieren, wenn das UI-Ziel die Liste verlangt.
- Umsetzungshinweise: Vor der Entscheidung die Home-Seite pruefen, weil sie ebenfalls `data/links.yaml` nutzt. Wenn die Datenform geaendert wird, muessen alle Konsumenten der Datei gemeinsam angepasst werden; wenn nur die Doku korrigiert wird, reicht ein Doku-Update plus `bun astro check`.

## 6. About-Dokumentation nennt nicht alle gerenderten Datenquellen korrekt

- Ort im Code: `docs/Pages.md` Zeilen 21-31 und `src/pages/about.astro` Zeilen 38-47.
- Zeitpunkt der Ausfuehrung: Beim Build von `/about`.
- Wann das Problem auftauchen koennte: Wenn Inhalte fuer Ausbildung oder Praktika anhand der Doku gepflegt werden.
- Bewertung: Teilweise korrekt und zu praezisieren. `docs/Pages.md` listet `education-previous.yaml`, aber `src/pages/about.astro` rendert diese Datei aktuell nicht. Die Doku-Aussage, sichtbare Commands blieben leer, ist ebenfalls veraltet: die Seite setzt konkrete `cat ...` Commands.
- Was das Problem waere: Content-Aenderungen an `education-previous.yaml` bleiben auf `/about` wirkungslos, obwohl die Doku die Datei als genutzt beschreibt. Zusaetzlich werden `cobra-software.yaml` und `klixar-it.yaml` gemeinsam unter dem sichtbaren Command `cat schnupper-praktikas.yaml` ausgegeben, was die tatsaechlichen Datenquellen verschleiert.
- Erste Vorschlaege: Entweder `education-previous.yaml` wieder rendern oder aus der Doku entfernen. Den sichtbaren Command an die tatsaechlichen Dateien angleichen, die beiden Praktika bewusst als Sammelabschnitt dokumentieren oder eine zusammenfassende Content-Datei einfuehren.
- Loesungsvorschlag: Zuerst fachlich entscheiden, ob `education-previous.yaml` wieder Teil der About-Seite sein soll. Wenn ja, einen eigenen `TerminalDictionary`-Block mit einem klaren Command wie `cat previous-education.yaml` rendern. Wenn nein, die Datei als ungenutzt dokumentieren, aus `docs/Pages.md` entfernen oder in einen Entwurfs-/Archivkontext verschieben.
- Loesungsvorschlag: Fuer die Praktika ist eine Sammeldatei wahrscheinlich klarer als zwei Dictionaries unter einem erfundenen Dateinamen. Eine Option waere `src/content/data/internships.yaml` als `entries`-Liste mit Eintraegen fuer Cobra Software und Klixar IT, gerendert ueber die bestehende repeated-dictionary-Logik. Alternativ die aktuelle Trennung behalten, aber den sichtbaren Command so formulieren, dass er nicht eine einzelne nicht existente Datei suggeriert.
- Umsetzungshinweise: Welche Variante gewaehlt wird, muss in `docs/Pages.md` und `docs/Content-System.md` nachvollziehbar sein. Nach der Aenderung `/about` visuell pruefen, weil die Reihenfolge und Gruppierung der Lebenslaufdaten inhaltlich relevant sind.

## 7. Tabellenzeilen duerfen Spalten still auslassen

- Ort im Code: `src/content.config.ts` Zeilen 117-122 und `src/components/TerminalTable.astro` Zeilen 27-36.
- Zeitpunkt der Ausfuehrung: Beim Content-Check/Build und beim Rendern jeder `TerminalTable`.
- Wann das Problem auftauchen koennte: Wenn eine YAML-Tabelle eine in `columns` definierte Spalte in einzelnen `rows` vergisst oder einen falschen Key schreibt.
- Bewertung: Korrekt. `z.record(...)` erlaubt beliebige Row-Keys, `getTableContent()` normalisiert nur vorhandene Werte, und `TerminalTable` rendert bei fehlenden Keys leere Strings.
- Was das Problem waere: Der Build bleibt erfolgreich, aber `TerminalTable` rendert fuer fehlende Keys leere Zellen. Tippfehler in Content-Dateien werden dadurch nicht frueh erkannt; unbekannte Row-Keys werden ebenfalls nicht sichtbar, solange keine passende Spalte existiert.
- Erste Vorschlaege: In `getTableContent()` oder einer schema-nahen Validierung pruefen, dass jede Zeile alle `columns[].key` enthaelt, und optional unbekannte Row-Keys melden. Eine reine Zod-Definition ist hier schwieriger, weil die erlaubten Keys von den danebenstehenden `columns` abhaengen.
- Loesungsvorschlag: Die pragmatischste Loesung ist eine Validierung in `getTableContent()`, direkt nachdem `isTableData(entry.data)` erfolgreich war. Dort sind `columns` und `rows` gemeinsam verfuegbar. Fuer jede Zeile die erwarteten Keys aus `columns.map(column => column.key)` mit `Object.keys(row)` vergleichen und bei fehlenden oder unbekannten Keys einen Fehler mit Datei, Zeilenindex und Key-Namen werfen.
- Loesungsvorschlag: Wenn die Validierung lieber im Content-Schema liegen soll, kann `tableSchema.superRefine(...)` genutzt werden, weil Zod dort Zugriff auf das gesamte Tabellenobjekt hat. Das haelt Fehler naeher am Content-Check, ist aber etwas komplexer zu typisieren und muss sauber mit der Union aus Dictionary/List/Table zusammenspielen.
- Umsetzungshinweise: Fehlende Keys sollten wahrscheinlich hart fehlschlagen. Unbekannte Keys ebenfalls, weil sie meist Tippfehler sind. Falls optionale Tabellenspalten irgendwann gewuenscht sind, sollte das explizit im Spaltenschema stehen, zum Beispiel `optional: true`, statt ueber leere Zellen implizit erlaubt zu werden.

## Recherche-Notizen

- Astro-Dokumentation zur `base`-Option: https://docs.astro.build/en/reference/configuration-reference/#base
- Astro-Dokumentation zu GitHub Pages: https://docs.astro.build/en/guides/deploy/github/
- Astro-Dokumentation zu file-based routing: https://docs.astro.build/en/guides/routing/
- Astro-Dokumentation zu On-Demand Rendering und Adaptern: https://docs.astro.build/en/guides/on-demand-rendering/
- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Credential Stuffing Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html
- MDN `autocomplete` attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
- MDN turning off form autocompletion: https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Turning_off_form_autocompletion
- Ergebnis: Bei gesetztem `base` und GitHub-Pages-Deployment muessen interne Links den Base-Prefix beruecksichtigen. Fuer PBKDF2-HMAC-SHA-256 wird ein Work Factor von 600000 oder mehr genannt; die aktuelle Iterationszahl ist damit nicht der Hauptmangel, sondern das statische, offline testbare Gate-Modell. OWASP empfiehlt fuer interaktive Passwortpruefungen serverseitige Gegenmassnahmen wie Rate-Limiting/Throttling; diese sind bei einem rein statischen, clientseitig entschluesselnden Gate prinzipbedingt nicht moeglich. MDN beschreibt `autocomplete` als Browser-Hinweis und weist darauf hin, dass `off` je nach Browser und Login-Kontext nicht absolut durchgesetzt wird.
