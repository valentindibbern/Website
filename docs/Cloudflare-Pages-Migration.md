# Cloudflare Pages Migration

Stand: 2026-06-27. Diese Datei sammelt Recherche, Risiken und konkrete Hinweise fuer einen spaeteren Umzug von GitHub Pages zu Cloudflare Pages.

## Ziel

Aktuell laeuft die Website als statische Astro-Site auf GitHub Pages unter:

- `https://valentindibbern.github.io/Website/`

Ein Umzug zu Cloudflare Pages soll spaeter vor allem diese Ziele erfuellen:

- eigene Domain ohne GitHub-Pages-Projektpfad.
- weiterhin kostenloses Static Hosting.
- GitHub-Repository als Quelle behalten.
- Bun/Astro-Build weiterverwenden.
- spaeterer Ausbau Richtung Workers, D1, R2 und Auth-Gates offenhalten.

## Kurzfazit

Der Umzug ist technisch unkompliziert, aber nicht nur ein Hosting-Schalter. Dieses Projekt ist aktuell auf GitHub Pages mit `base: "/Website"` konfiguriert. Cloudflare Pages wird bei eigener Domain normalerweise vom Domain-Root aus ausgeliefert. Vor dem produktiven Wechsel muss deshalb `astro.config.mjs` angepasst und die ganze Navigation auf Root-Pfade getestet werden.

Fuer die aktuelle statische Site wird kein `@astrojs/cloudflare`-Adapter benoetigt. Der Adapter wird erst relevant, wenn Astro serverseitig auf Cloudflare Pages Functions laufen soll.

## Gute Quellen

- [Cloudflare Pages: Astro framework guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Astro Docs: Deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Cloudflare Pages: Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages: GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/)
- [Cloudflare Pages: Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages: Build image](https://developers.cloudflare.com/pages/configuration/build-image/)
- [Cloudflare Pages: Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Pages: Limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Astro Configuration: `site` and `base`](https://docs.astro.build/en/reference/configuration-reference/)

## Aktuelle Repo-Situation

Relevante Dateien:

- `astro.config.mjs`
  - aktuell `site: "https://valentindibbern.github.io"`.
  - aktuell `base: "/Website"`.
- `.github/workflows/deploy.yml`
  - deployed aktuell nach GitHub Pages.
  - nutzt `withastro/action@v6`.
  - baut mit `bun run build:production`.
  - erwartet `APPLICATION_ACCESS_PASSWORD` und `APPLICATION_ACCESS_URL` als GitHub-Secrets.
- `package.json`
  - `build` fuehrt `astro build` aus.
  - `build:production` erzeugt zuerst den verschluesselten Bewerbungsgate-Payload und baut danach.
- `src/utils/url.ts`
  - erzeugt interne URLs ueber `import.meta.env.BASE_URL`.

## Empfohlene Zielkonfiguration

### Astro

Bei einer eigenen Domain sollte die Konfiguration ungefaehr so aussehen:

```js
export default defineConfig({
    site: "https://example.com",
    base: "/",
});
```

Wenn keine `base` gesetzt wird, nutzt Astro standardmaessig Root-Verhalten. Fuer dieses Projekt ist eine explizite Entscheidung besser als stillschweigende Annahmen:

- GitHub Pages Projekt-URL: `base: "/Website"` noetig.
- Cloudflare Pages mit eigener Root-Domain: `base: "/"` oder `base` entfernen.
- Cloudflare Pages nur unter `*.pages.dev`: ebenfalls Root-Pfad, also kein `/Website`.

Wichtig: Nach dem Umstellen muessen alle Links, Assets und Form-Ziele getestet werden. Besonders relevant sind manuelle Links und alles, was `withBase()` nutzt.

### Cloudflare Pages Build

Cloudflare empfiehlt fuer Astro im Dashboard:

- Production branch: `main`.
- Build command: `npm run build`.
- Build directory: `dist`.

Fuer dieses Projekt sollte die spaetere Cloudflare-Konfiguration stattdessen sein:

- Production branch: `main`.
- Build command: `bun run build:production`.
- Build output directory: `dist`.
- Root directory: leer lassen oder Repository-Root, weil es kein Monorepo ist.

Cloudflare Pages Build Image v3 enthaelt Bun und Node. Laut Cloudflare sind aktuell Node.js 22.16.0 und Bun 1.2.15 vorinstalliert; Versionen koennen ueber `NODE_VERSION` und `BUN_VERSION` fixiert werden.

Empfohlene Environment Variables in Cloudflare Pages:

- `NODE_VERSION=22.12.0` oder neuer, passend zu `package.json`.
- `BUN_VERSION` explizit setzen, wenn Builds reproduzierbar bleiben sollen.
- `APPLICATION_ACCESS_PASSWORD`, falls `build:production` weiter verwendet wird.
- `APPLICATION_ACCESS_URL`, falls `build:production` weiter verwendet wird.

## GitHub Integration

Cloudflare Pages kann direkt mit GitHub verbunden werden:

1. Cloudflare Dashboard oeffnen.
2. Workers & Pages.
3. Create application.
4. Pages.
5. Import an existing Git repository.
6. Repository `Website` auswaehlen.
7. Production branch auf `main` setzen.
8. Build command und output directory setzen.
9. Secrets/Environment Variables setzen.
10. Deploy ausloesen.

Cloudflare erstellt danach automatisch Deployments bei Pushes. Pull Requests erhalten Preview Deployments, ausser bei PRs aus Forks. Die GitHub-App sollte auf "Only select repositories" beschraenkt werden, damit Cloudflare nur dieses Repository lesen darf.

## GitHub Actions nach dem Umzug

Die bestehende GitHub-Pages-Action sollte nicht parallel produktiv weiterdeployen, sobald Cloudflare produktiv ist. Optionen:

- Workflow entfernen.
- Workflow in einen manuellen Fallback umwandeln.
- Workflow-Datei behalten, aber Trigger von `push` entfernen.

Empfehlung: Nach erfolgreichem Cloudflare-Produktivbetrieb den GitHub-Pages-Workflow auf `workflow_dispatch` reduzieren oder loeschen. Sonst entstehen zwei aktive Deployment-Ziele, was spaeter Debugging erschwert.

Die Secrets muessen entweder:

- in GitHub bleiben, wenn GitHub Actions weiter baut; oder
- nach Cloudflare Pages Environment Variables migriert werden, wenn Cloudflare baut.

Nicht beide Quellen blind parallel pflegen, weil sonst alte Bewerbungsgate-Payloads oder unterschiedliche Produktionswerte entstehen koennen.

## Custom Domain und DNS

Cloudflare Pages unterstuetzt Custom Domains direkt im Pages-Projekt.

Wichtige Unterscheidung:

- Apex-Domain, zum Beispiel `example.com`: Domain muss als Cloudflare-Zone angelegt sein und Cloudflare-Nameserver nutzen.
- Subdomain, zum Beispiel `www.example.com`: kann als Custom Domain im Pages-Projekt verbunden werden.

Empfohlene Reihenfolge:

1. Cloudflare Pages zuerst auf `*.pages.dev` deployen.
2. Build und Navigation dort testen.
3. Custom Domain in Pages hinzufuegen.
4. DNS umstellen.
5. SSL/TLS-Ausstellung abwarten.
6. `www` und Apex bewusst festlegen.
7. Optional: Weiterleitung von `www` zu Apex oder umgekehrt konfigurieren.
8. GitHub Pages Custom Domain erst entfernen, wenn Cloudflare funktioniert.

Fuer dieses Projekt ist wahrscheinlich eine Root-Domain mit optionaler `www`-Weiterleitung sinnvoll. Die finale Entscheidung haengt von der gekauften Domain ab.

## Wichtigste Risiken

### `base: "/Website"`

Das ist der groesste technische Fallstrick. Wenn `base` nicht geaendert wird, koennen Links und Assets auf Cloudflare unter `/Website/...` statt `/...` zeigen.

Vor dem Umzug testen:

- Home.
- Navigation.
- Links-Seite.
- Application-Gate.
- alle internen Links, die `withBase()` nutzen.
- direkte URL-Aufrufe wie `/about`, `/projects`, `/links`, `/application`.

### Secrets und Bewerbungsgate

Das aktuelle Bewerbungsgate ist buildzeitabhaengig. Wenn Cloudflare den Build uebernimmt, muessen die Secrets in Cloudflare Pages gesetzt werden. Fehlen sie, muss der Build genauso klar scheitern wie heute in GitHub Actions.

Problem: Cloudflare Dashboard-Secrets sind nicht automatisch identisch mit GitHub-Secrets. Beim Umzug muss dokumentiert werden, welche Plattform gerade die Produktionsquelle ist.

### Bun-Version

Cloudflare Build Image v3 bringt Bun mit, aber automatische Tool-Updates koennen Builds spaeter veraendern. Fuer stabile Builds ist `BUN_VERSION` sinnvoll.

### GitHub Pages bleibt erreichbar

Auch nach dem Umzug kann die alte GitHub-Pages-URL noch erreichbar sein, solange Pages aktiv bleibt. Das kann zu doppelten URLs, altem Content und SEO-Verwirrung fuehren.

Nach erfolgreicher Migration:

- GitHub Pages Deployment deaktivieren oder Workflow stoppen.
- README Production URL aktualisieren.
- Deployment-Doku aktualisieren.
- Alte URL nur als Fallback behalten, wenn bewusst gewollt.

### Preview Deployments

Cloudflare Preview Deployments sind praktisch, koennen aber Secrets/Environment je nach Einstellung anders behandeln. Preview-Deployments sollten keine produktiven Datei-URLs oder produktiven Bewerbungsgate-Secrets verwenden, wenn das nicht bewusst gewollt ist.

### Adapter-Verwirrung

Fuer statische Astro-Ausgabe ist kein Cloudflare-Adapter noetig. `@astrojs/cloudflare` ist fuer SSR, API-Routen und Cloudflare Runtime Bindings relevant. Zu frueh einen Adapter einzufuehren wuerde die Migration unnoetig vergroessern.

## Empfohlener Migrationsplan

### Phase 1: Vorbereitung

- Domain-Entscheidung treffen: Apex, `www` oder Subdomain.
- Gewuenschte finale URL festlegen.
- `astro.config.mjs` fuer Cloudflare vorbereiten:
  - `site` auf finale Domain.
  - `base` auf Root-Verhalten.
- Cloudflare Pages Environment Variables festlegen:
  - `NODE_VERSION`.
  - `BUN_VERSION`.
  - `APPLICATION_ACCESS_PASSWORD`.
  - `APPLICATION_ACCESS_URL`.
- Entscheiden, ob GitHub Actions nach Migration geloescht oder manuell behalten wird.

### Phase 2: Testdeployment

- Cloudflare Pages-Projekt aus GitHub-Repository erstellen.
- Production branch auf `main`.
- Build command: `bun run build:production`.
- Output directory: `dist`.
- Environment Variables setzen.
- Erstes Deployment auf `*.pages.dev` bauen.
- Alle Seiten und direkten Routen testen.
- Browser-Konsole auf 404 fuer Assets pruefen.

### Phase 3: Domainumschaltung

- Custom Domain in Cloudflare Pages hinzufuegen.
- DNS/Nameserver konfigurieren.
- SSL/TLS-Status abwarten.
- Apex/`www`-Weiterleitung setzen.
- Finale Domain testen:
  - `https://domain/`
  - `https://domain/about`
  - `https://domain/projects`
  - `https://domain/links`
  - `https://domain/application`

### Phase 4: Aufraeumen

- README Production URL aktualisieren.
- `docs/Deployment.md` auf Cloudflare Pages umstellen.
- GitHub-Pages-Workflow entfernen oder auf manuell setzen.
- GitHub Pages in Repository Settings deaktivieren, falls kein Fallback gewuenscht ist.
- Hosting Research mit der finalen Entscheidung aktualisieren.

## Minimaler spaeterer Code-Change

Voraussichtlich kleinster notwendiger Code-Change fuer statisches Cloudflare Pages:

```js
export default defineConfig({
    site: "https://example.com",
    base: "/",
    integrations: [alpinejs()],
    vite: {
        plugins: [tailwindcss()],
    },
});
```

Wenn das Projekt spaeter Cloudflare Runtime-Funktionen nutzt, kommt erst dann hinzu:

- `@astrojs/cloudflare`.
- `adapter: cloudflare(...)`.
- Cloudflare Bindings fuer D1, R2, KV oder Durable Objects.
- lokale Wrangler-Konfiguration und TypeScript-Runtime-Typen.

## Entscheidung fuer den spaeteren Umstieg

Der Umzug sollte erst gemacht werden, wenn mindestens eine dieser Bedingungen erfuellt ist:

- eigene Domain soll produktiv live gehen.
- GitHub-Pages-Projektpfad `/Website` soll verschwinden.
- Cloudflare als Basis fuer spaetere Workers/D1/R2-Funktionen soll vorbereitet werden.
- Preview Deployments ueber Cloudflare Pages sollen genutzt werden.

Wenn nur die aktuelle statische Website ohne eigene Domain weiterlaufen soll, gibt es keinen dringenden technischen Grund fuer sofortigen Umzug.
