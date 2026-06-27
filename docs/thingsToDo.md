# Things To Do

Diese Datei sammelt Auffaelligkeiten aus dem Codebase-Review vom 2026-06-27. Geprueft wurden `bun astro check`, `bun run build`, eine lokale Preview unter `http://127.0.0.1:4321/Website/`, die Projektdokumentation und gezielte externe Referenzen.

## 1. Statisches Bewerbungsgate kann offline angegriffen werden

- Ort im Code: `src/pages/application.astro` Zeilen 67-182, `scripts/encrypt-application-link.mjs` Zeilen 6 und 25-70, `docs/Deployment.md` Zeilen 5-8 und 30-37.
- Zeitpunkt der Ausfuehrung: Beim Production-Build schreibt `bun run build:production` den verschluesselten Payload in `src/config/applicationAccess.ts`; im Browser wird der Payload beim Laden von `/application` eingebettet und nach Formular-Submit entschluesselt.
- Wann das Problem auftauchen koennte: Sobald ein echter Payload deployed ist und das Passwort schwach, wiederverwendet oder spaeter kompromittiert wird.
- Was das Problem waere: Der Ciphertext ist oeffentlich aus dem statischen HTML abrufbar. Angreifer koennen Passwortversuche offline gegen den Payload fahren; es gibt keine serverseitige Autorisierung, kein Rate-Limit und keine Sperre. Die aktuellen 600000 PBKDF2-HMAC-SHA-256-Iterationen entsprechen zwar der OWASP-Untergrenze, ersetzen aber keine Zugriffskontrolle fuer wirklich sensible Bewerbungsdateien.
- Erste Vorschlaege: Fuer sensible Dateien einen serverseitigen Download mit Authentifizierung und Rate-Limiting nutzen. Falls GitHub Pages beibehalten wird, Passwort mindestens zufaellig und lang erzeugen, nicht wiederverwenden, regelmaessig rotieren, Payload nach Bewerbungsphase entfernen und in der UI klarer machen, dass es ein statisches Gate ist.

## 2. Bewerbungsformular kann Passwortmanager unpassend ansprechen

- Ort im Code: `src/pages/application.astro` Zeilen 30-37.
- Zeitpunkt der Ausfuehrung: Beim Rendern und Interagieren mit `/application` im Browser.
- Wann das Problem auftauchen koennte: Wenn ein Passwortmanager `autocomplete="current-password"` als Login-Passwortfeld interpretiert oder automatisch ein Konto-Passwort anbietet.
- Was das Problem waere: Nutzer koennten versehentlich ein anderes gespeichertes Passwort in ein clientseitiges Entschluesselungsfeld einsetzen. Das Passwort wird zwar nicht an einen Server gesendet, bleibt aber unnoetig im Seitenkontext und kann die Bedienung verwechseln.
- Erste Vorschlaege: Fuer dieses Gate `autocomplete="off"` oder einen passenderen Wert pruefen, den Feldnamen weniger login-aehnlich waehlen und das Verhalten mit gaengigen Passwortmanagern testen.

## 3. Content-Links erlauben unsichere `http:`-Ziele

- Ort im Code: `src/content.config.ts` Zeilen 34-44 und `src/components/TerminalValue.astro` Zeilen 11-26.
- Zeitpunkt der Ausfuehrung: Beim Content-Check/Build validiert das Schema `href`; beim statischen Rendern normalisiert `TerminalValue` den Link.
- Wann das Problem auftauchen koennte: Wenn kuenftige YAML-Daten einen externen `http://`-Link mit `attributes: ["link"]` enthalten.
- Was das Problem waere: Auf der HTTPS-Website koennen sichtbare Links auf unverschluesselte Ziele fuehren. Das ist kein XSS, weil `javascript:` und `data:` abgewehrt werden, aber es ist ein Downgrade fuer Datenschutz und Integritaet des Zielaufrufs.
- Erste Vorschlaege: `http:` aus Schema und Renderer entfernen oder nur fuer explizit dokumentierte Ausnahmefaelle erlauben. Danach `docs/Content-System.md` anpassen und bestehende Content-Daten per `bun astro check` pruefen.

## 4. Footer-Navigation enthaelt eine nicht existierende Route

- Ort im Code: `src/config/navigation.ts` Zeilen 8-10; es gibt keine `src/pages/impressum.astro`.
- Zeitpunkt der Ausfuehrung: Sobald `navLists.footer` in einer Komponente gerendert wird oder ein Agent/Entwickler die Konfiguration als existierende Navigation interpretiert.
- Wann das Problem auftauchen koennte: Bei Einfuehrung eines Footers oder Wiederverwendung von `NavComponent` mit `navList="footer"`.
- Was das Problem waere: Der Link `/impressum` fuehrt in der lokalen Preview zu HTTP 404. Auf der Live-Site waere das ein kaputter Navigationslink.
- Erste Vorschlaege: Entweder eine echte Impressum-Seite anlegen, den Footer-Eintrag entfernen oder die Footer-Navigation erst einfuehren, wenn alle Ziele geroutet sind.

## 5. Links-Seite ist anders dokumentiert als implementiert

- Ort im Code: `docs/Pages.md` Zeilen 50-57, `src/pages/links.astro` Zeilen 1-24, `src/content/data/links.yaml` Zeilen 1-18.
- Zeitpunkt der Ausfuehrung: Beim Build von `/links` und bei kuenftigen Content-Aenderungen an `links.yaml`.
- Wann das Problem auftauchen koennte: Wenn jemand der Dokumentation folgt und `links.yaml` als `items`-Liste pflegt oder `TerminalList` erwartet.
- Was das Problem waere: Die Seite importiert und rendert `TerminalDictionary`, waehrend die Doku von einer Liste spricht. Eine Umstellung der YAML-Datei auf `items` wuerde `TerminalDictionary src="links"` beim Build fehlschlagen lassen.
- Erste Vorschlaege: Entscheiden, ob Links als Dictionary oder Liste gedacht sind. Dann entweder `src/pages/links.astro` auf `TerminalList` umstellen oder die Dokumentation und Beispiele konsequent auf Dictionary-Ausgabe korrigieren.

## 6. About-Dokumentation nennt nicht alle gerenderten Datenquellen korrekt

- Ort im Code: `docs/Pages.md` Zeilen 21-31 und `src/pages/about.astro` Zeilen 38-47.
- Zeitpunkt der Ausfuehrung: Beim Build von `/about`.
- Wann das Problem auftauchen koennte: Wenn Inhalte fuer Ausbildung oder Praktika anhand der Doku gepflegt werden.
- Was das Problem waere: `docs/Pages.md` listet `education-previous.yaml`, aber `src/pages/about.astro` rendert diese Datei aktuell nicht. Stattdessen werden `cobra-software.yaml` und `klixar-it.yaml` gemeinsam unter dem Command `cat schnupper-praktikas.yaml` ausgegeben. Dadurch koennen Content-Aenderungen an der dokumentierten Datei wirkungslos bleiben.
- Erste Vorschlaege: Entweder `education-previous.yaml` wieder rendern oder aus der Doku entfernen. Den sichtbaren Command an die tatsaechlichen Dateien angleichen oder eine zusammenfassende Content-Datei einfuehren.

## 7. Tabellenzeilen duerfen Spalten still auslassen

- Ort im Code: `src/content.config.ts` Zeilen 117-122 und `src/components/TerminalTable.astro` Zeilen 27-36.
- Zeitpunkt der Ausfuehrung: Beim Content-Check/Build und beim Rendern jeder `TerminalTable`.
- Wann das Problem auftauchen koennte: Wenn eine YAML-Tabelle eine in `columns` definierte Spalte in einzelnen `rows` vergisst oder einen falschen Key schreibt.
- Was das Problem waere: Der Build bleibt erfolgreich, aber `TerminalTable` rendert fuer fehlende Keys leere Zellen. Tippfehler in Content-Dateien werden dadurch nicht frueh erkannt.
- Erste Vorschlaege: Im Content-Schema oder in `getTableContent()` validieren, dass jede Zeile alle `columns[].key` enthaelt, und optional unbekannte Row-Keys melden.

## Recherche-Notizen

- Astro-Dokumentation zur `base`-Option: https://docs.astro.build/en/reference/configuration-reference/#base
- Astro-Dokumentation zu GitHub Pages: https://docs.astro.build/en/guides/deploy/github/
- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Ergebnis: Bei gesetztem `base` und GitHub-Pages-Deployment muessen interne Links den Base-Prefix beruecksichtigen. Fuer PBKDF2-HMAC-SHA-256 wird ein Work Factor von 600000 oder mehr genannt; die aktuelle Iterationszahl ist damit nicht der Hauptmangel, sondern das statische, offline testbare Gate-Modell.
