# Hosting Research

Stand: 2026-06-27. Preise, Free-Tiers und Limits koennen sich kurzfristig aendern; vor einem Umzug immer die verlinkten Pricing- und Limits-Seiten erneut pruefen.

## Projektbedarf

Aktueller Zustand:

- Statische Astro-Site mit Bun als Package Manager und Build-Runtime.
- Kein eigener Server zur Laufzeit.
- Aktuelles Deployment-Ziel ist GitHub Pages.
- Eigene Domain soll nutzbar sein.

Geplante Erweiterungen:

- Blog.
- Chatroom.
- Authsystem.
- Datei-Zugriff fuer extern gehostete Dropbox-Dateien direkt ueber die Website.
- Weitere Features mit SQL-Datenbank.

## Harte Kriterien

- Kosten: maximal 1 CHF pro Monat. Gratis ist klar bevorzugt.
- Eigene Domain: muss ohne bezahlten Plan moeglich sein.
- Ease of use: Git-Integration, einfache Custom-Domain-Konfiguration, nachvollziehbare Builds.
- Stack-Fit: Astro muss sauber bauen; Bun-Support ist ein Vorteil, Node-Fallback ist akzeptabel.
- Zukunft: Blog sollte statisch funktionieren; Chat, Auth und SQL brauchen realistische Erweiterungspfade.
- Image und Risiko: Ausfaelle, Lock-in, Skandale, schlechte Online-Reputation und Support-Probleme zaehlen negativ.
- Preisstabilitaet: Anbieter mit aggressiver Monetarisierung, knappen Free-Tiers oder haeufigen Limit-Aenderungen werden abgewertet.

## Bewertungsskala

- 5: sehr gut fuer dieses Projekt.
- 4: gut, mit klaren Einschraenkungen.
- 3: brauchbar, aber nur fuer bestimmte Szenarien.
- 2: nur fast sinnvoll.
- 1: fuer dieses Projekt nicht empfehlenswert.

## Kurzfazit

Cloudflare Pages ist die beste Gesamtoption, wenn die Website unter 1 CHF pro Monat bleiben soll und spaeter trotzdem Richtung Auth, Chat und SQL wachsen soll. GitHub Pages bleibt die einfachste und stabilste Nullkosten-Loesung fuer die aktuelle statische Site, blockiert aber fast alle geplanten dynamischen Features ohne externe Dienste. Vercel und Netlify sind sehr komfortabel, aber fuer dauerhaft gratis betriebene Fullstack-Funktionen riskanter, weil die sinnvollen Erweiterungen schnell an Plattformlimits, Usage-Kosten oder Plan-Grenzen stossen.

## Preisszenarien

Die meisten Anbieter rechnen in USD ab. CHF-Werte sind deshalb als Budget-Einschaetzung zu lesen, nicht als fixe Rechnung. Fuer das Projekt zaehlt praktisch: 0 USD liegt sicher unter 1 CHF; alles ab 2 USD/Monat verfehlt die harte Budgetgrenze.

### Szenario A: aktueller Zustand

Annahme: statische Astro-Site, eigener Domainname, Git-Deployment, kein Server zur Laufzeit, keine Datenbank, kein Authsystem, kein Chat, keine grossen Datei-Downloads.

| Anbieter | Realistischer Monatsbetrag | Budget-Fit | Preisnotiz |
| --- | --- | --- | --- |
| Cloudflare Pages | 0 USD | Ja | Free-Plan reicht fuer Static Hosting; 500 Builds/Monat und 100 Custom Domains pro Projekt auf Free. |
| GitHub Pages | 0 USD | Ja | GitHub Pages ist fuer public repositories im GitHub-Free-Plan verfuegbar und unterstuetzt eigene Domains. |
| Vercel | 0 USD | Ja | Hobby ist "Free forever"; fuer statische Personal Sites meist ausreichend. |
| Netlify | 0 USD | Ja | Free-Plan reicht typischerweise fuer kleine statische Sites; Limits fuer Bandbreite/Builds beachten. |
| Deno Deploy | 0 USD | Ja | Free-Plan mit 1M Requests/Monat, 20 GB Egress und 50 Custom Domains pro Organisation. |
| Firebase Hosting | 0 USD | Ja | Spark/Free bietet Hosting mit 10 GB Storage, 360 MB/Tag Transfer und Custom Domain/SSL. |
| Render Static Sites | 0 USD | Ja | Static Sites kosten 0 USD und enthalten Custom Domains mit managed TLS. |
| Koyeb | 0 USD moeglich | Ja, aber wacklig | Free-Kapazitaet ist eher App/Service-orientiert; fuer reine Static-Site nicht der sauberste Fit. |
| Railway | 0 USD nur Trial, danach 1 USD/Monat | Grenzfall | Free startet mit 30-Tage-Trial und danach 1 USD/Monat; Custom Domains nach Trial eingeschraenkt. |
| Fly.io | nutzungsabhaengig, nicht sauber 0 USD planbar | Nein | Fuer Static Hosting ueberdimensioniert; kleine VMs/Volumes koennen sehr billig sein, aber nicht sauber unter 1 CHF garantiert. |
| Surge | 0 USD | Ja | Fuer einfache statische Sites gratis; keine sinnvolle Fullstack-Basis. |
| Static.app | 0 USD ohne Custom Domain | Nein fuer Custom Domain | Free hat nur Subdomain; Custom Domains beginnen beim Starter-Plan fuer 5 USD/Monat. |
| DigitalOcean App Platform | hoeher als 1 CHF, sobald sinnvoll genutzt | Nein | Eher bezahlte App-Plattform als Gratis-Static-Host. |

Fazit fuer Szenario A: GitHub Pages, Cloudflare Pages, Vercel, Netlify und Render sind preislich alle bei 0 USD. Der Unterschied liegt nicht im heutigen Preis, sondern in der spaeteren Architektur.

### Szenario B: Maximum

Annahme: persoenliche Site plus Blog, echter Login, Zugriffsschutz fuer Dateien, Chatroom mit Rate-Limits/Moderation, SQL-Datenbank, kleine bis moderate Nutzung. Das ist bewusst kein "unbegrenztes" Maximum, sondern das groesste realistische Ziel innerhalb dieses Projekts.

| Anbieter / Architektur | Realistischer Monatsbetrag | Budget-Fit | Was den Preis treibt |
| --- | --- | --- | --- |
| Cloudflare Pages + Workers Free + D1 + R2 | 0 USD moeglich | Ja, solange Limits reichen | Workers Free: 100k Requests/Tag; D1 Free: 5M gelesene Zeilen/Tag, 100k geschriebene Zeilen/Tag, 5 GB Storage; R2 Free: 10 GB-Monat, 1M Class-A- und 10M Class-B-Operationen. |
| Cloudflare Pages + Workers Paid | 5 USD/Monat plus Usage | Nein | Sobald Workers Paid noetig wird: Standard-Plan mit 10M Requests/Monat inklusive, danach Usage; D1/R2 koennen zusaetzlich wachsen. |
| GitHub Pages + Supabase Free | 0 USD moeglich | Ja, aber zweigeteilt | GitHub hostet statisch, Supabase uebernimmt Auth/Postgres/Realtime/Storage; Free-Limits und Projekt-Pausen/Quotas sind das Risiko. |
| GitHub Pages + Supabase Pro | 25 USD/Monat | Nein | Sinnvoller Produktionspfad fuer Supabase, aber deutlich ausserhalb des 1-CHF-Ziels. |
| GitHub Pages + Neon Free + separate Auth/Realtime | 0 USD moeglich | Ja, aber fragmentiert | SQL kann gratis starten, Auth/Chat/Storage muessen separat geloest werden; Architektur wird schnell komplex. |
| GitHub Pages + Turso Free + separate Auth/Realtime | 0 USD moeglich | Ja, aber fragmentiert | Turso Free bietet 5 GB Storage, 500M Reads und 10M Writes/Monat; Auth/Dateien/Chat fehlen. |
| Vercel Hobby + Free Add-ons | 0 USD moeglich | Ja, aber riskant | Hobby enthaelt viel, aber Functions, Blob, Edge Config, Data Transfer und Add-ons haben enge Frei-Kontingente. |
| Vercel Pro | 20 USD/Monat plus Usage | Nein | Pro schaltet bessere Limits/Spend-Management frei, liegt aber weit ueber Budget. |
| Netlify Free + externe DB/Auth | 0 USD moeglich | Ja, aber begrenzt | Hosting/Functions koennen klein gratis bleiben; SQL/Auth/Realtime kommen meist von Supabase/Neon/Firebase. |
| Netlify Pro | typischerweise deutlich ueber 1 CHF | Nein | Sinnvollere Produktionslimits kosten; SQL bleibt trotzdem extern. |
| Firebase Spark | 0 USD moeglich | Ja, aber kein SQL | Gut fuer Auth/Realtime/Storage-Prototypen, aber SQL passt schlecht; Firestore/Realtime Database sind NoSQL. |
| Firebase Blaze + SQL Connect / Cloud SQL | mindestens ca. 9.37 USD/Monat nach Trial fuer Cloud SQL | Nein | Echter SQL-Pfad ueber Cloud SQL sprengt das Budget; Blaze ist nutzungsabhaengig. |
| Render Free Services + Postgres | 0 USD moeglich fuer Experiment | Grenzfall | Free Compute/Postgres ist zum Testen gedacht; Produktionsbetrieb und Limits sind kritisch. |
| Render bezahlte Services/Postgres | deutlich ueber 1 CHF | Nein | Web Service, persistente Storage- und DB-Kosten addieren sich. |
| Deno Deploy Free + Deno KV | 0 USD moeglich | Ja, aber nicht ideal fuer SQL | Free enthaelt 1M Requests, 20 GB Egress, 1 GiB Volume, 1 GiB KV; SQL/Auth/Dateien brauchen Zusatzarchitektur. |
| Deno Deploy Pro | 20 USD/Monat plus Usage | Nein | Bessere Limits, aber ausserhalb Budget. |
| Koyeb Free 5h / kleine Services | 0 USD fuer sehr kleine Nutzung | Nein fuer dauerhaftes Maximum | Free-Postgres/Compute ist stark eingeschraenkt; dauerhaft aktive Dienste kosten schnell deutlich mehr. |
| Railway | 1 USD/Monat nach Trial oder 5 USD Hobby | Nein | Schon das Free-Modell liegt nach Trial an der Budgetkante; Custom Domains und dauerhafte Services sprechen gegen das Ziel. |
| Fly.io | nutzungsabhaengig, realistisch ueber 1 CHF | Nein | Eigene Services, Volumes, Postgres und Egress sind flexibel, aber nicht budgetstabil. |

Fazit fuer Szenario B: Unter 1 CHF pro Monat ist nur ein kleines, streng limitiertes Fullstack-Projekt realistisch. Die besten Chancen haben Cloudflare Free-Tiers oder eine Kombination aus GitHub/Cloudflare Pages mit Supabase/Neon/Turso Free. Sobald es robust, dauerhaft, moderiert, sicher und speicherintensiv wird, ist das ehrliche Budget eher 5 bis 25 USD/Monat.

### Preiskritische Risiken

- Chat ist nicht nur Realtime-Technik, sondern auch Missbrauchsschutz. Spam, Bots und viele offene Verbindungen koennen Free-Tiers schnell treffen.
- Datei-Zugriff ist teuer, wenn Dateien gross sind oder oft heruntergeladen werden. Dropbox-Weiterleitungen sparen Hosting-Speicher, ersetzen aber keine echte Zugriffskontrolle.
- SQL-Kosten haengen stark von Schreiblast, Indexen, Query-Design und Datenaufbewahrung ab.
- Free-Tiers koennen blockieren statt abrechnen. Das schuetzt das Budget, kann aber Features fuer Nutzer hart ausfallen lassen.
- Pay-as-you-go schuetzt nicht automatisch vor Kosten. Ohne Budget-Limits, Rate-Limits und Monitoring ist "fast gratis" riskant.

## Top 10

| Rang | Anbieter | Urteil | Monatlich unter 1 CHF | Eigene Domain gratis | Astro/Bun-Fit | Zukunft mit Auth/SQL/Chat |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Cloudflare Pages | Beste Gesamtoption | Ja | Ja | Sehr gut | Gut mit Workers, D1, R2, Durable Objects, aber Lock-in |
| 2 | GitHub Pages | Beste Minimaloption | Ja | Ja | Gut fuer statische Builds | Schwach ohne externe Dienste |
| 3 | Vercel | Beste DX fuer Frontend | Ja, solange Hobby reicht | Ja | Sehr gut | Gut, aber Kosten- und Limit-Risiko |
| 4 | Netlify | Gute Allround-Option | Ja, solange Free reicht | Ja | Gut | Gut, aber Add-ons/Forms/Functions koennen begrenzen |
| 5 | Deno Deploy | Gute Edge-Option | Ja, wenn Free reicht | Ja | Mittel | Gut fuer JS/TS-Serverlogik, weniger Astro-Standard |
| 6 | Firebase Hosting | Stark fuer Auth, schwach fuer Kostenkontrolle | Hosting gratis moeglich | Ja | Mittel | Gut mit Firebase, aber NoSQL und Billing-Risiko |
| 7 | Render Static Sites | Einfach, aber weniger stark | Ja | Ja | Gut | Schwach ohne bezahlte Dienste |
| 8 | Koyeb | Interessant fuer Apps, nicht ideal fuer statische Site | Free moeglich | Ja | Mittel | Gut fuer kleine Server, Free-Tier-Risiko |
| 9 | Railway | Fast sinnvoll fuer spaetere Services | Eher nein fuer dauerhaft gratis | Ja | Gut fuer Apps | Gut, aber Kostenlimit passt schlecht |
| 10 | Fly.io | Technisch stark, fuer Budget zu riskant | Eher nein | Ja | Mittel | Gut fuer eigene Services, aber Overkill |

## 1. Cloudflare Pages

Quellen: [Cloudflare Pages](https://pages.cloudflare.com/), [Cloudflare Workers Pricing](https://www.cloudflare.com/developer-platform/pricing/), [Cloudflare D1](https://www.cloudflare.com/developer-platform/products/d1/), [Cloudflare R2](https://www.cloudflare.com/developer-platform/products/r2/), [Cloudflare 18 November 2025 outage](https://blog.cloudflare.com/18-november-2025-outage/).

Warum empfohlen:

- Passt sehr gut zur aktuellen statischen Astro-Site.
- Eigene Domains und CDN sind Kernstaerken von Cloudflare.
- Der spaetere Ausbau kann innerhalb derselben Plattform passieren: Workers fuer API-Routen, D1 fuer SQLite-kompatible SQL-Daten, R2 fuer Objekte, Durable Objects fuer koordinierte Echtzeit-Logik.
- Die Plattform ist fuer sehr kleine Projekte realistisch gratis betreibbar, solange Limits eingehalten werden.

Vorteile:

- Sehr guter Static-Hosting-Fit.
- Gute Edge-Performance.
- Custom Domains sind natuerlich integriert.
- Viele spaetere Bausteine vorhanden, ohne direkt auf einen klassischen Server umzusteigen.
- Fuer ein oeffentliches Portfolio wirkt Cloudflare professionell und bekannt.

Nachteile:

- Starkes Plattform-Lock-in, besonders bei Workers, D1, Durable Objects und R2.
- Lokale Entwicklung und Debugging werden komplexer, sobald Workers und Datenbanklogik dazukommen.
- D1 ist SQL, aber kein vollstaendiger PostgreSQL-Ersatz.
- Chatroom-Features brauchen sorgfaeltiges Design; WebSockets und Durable Objects sind moeglich, aber nicht so simpel wie statisches Hosting.

Potenzielle Probleme:

- Cloudflare hatte grosse sichtbare Ausfaelle, unter anderem am 2025-11-18. Das ist kein Ausschlusskriterium, aber ein reales Plattformrisiko.
- Die Free-Tiers sind attraktiv, aber bei dynamischen Features koennen Request-, Storage- oder Datenbanklimits relevant werden.
- Cloudflare ist wegen CDN-Macht, Missbrauchsfaellen und Content-Moderation regelmaessig Teil oeffentlicher Debatten. Fuer eine persoenliche Website ist das normalerweise akzeptabel, aber das Image ist nicht komplett neutral.

Bewertung: 4.5/5. Beste Wahl, wenn dieses Projekt gratis bleiben und trotzdem wachsen soll.

## 2. GitHub Pages

Quellen: [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages), [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).

Warum empfohlen:

- Bereits im Projekt genutzt.
- Sehr einfach fuer statische Astro-Sites.
- Eigene Domain ist moeglich.
- Keine monatlichen Kosten.

Vorteile:

- Minimaler Betriebsaufwand.
- Sehr stabil fuer statische Sites.
- Passt gut zu GitHub Actions und dem vorhandenen Repository.
- Kein Vendor-Lock-in auf proprietaere Runtime-Funktionen, solange die Site statisch bleibt.

Nachteile:

- Keine native Serverlogik.
- Kein eingebautes Authsystem.
- Keine Datenbank.
- Kein Chatroom ohne externe Dienste.
- Das aktuelle Bewerbungsgate ist nur clientseitige Entschluesselung und keine echte Autorisierung.

Potenzielle Probleme:

- Spaetere Features wuerden eine zweite Plattform erzwingen, zum Beispiel Supabase, Neon, Firebase, Cloudflare Workers oder einen eigenen Backend-Host.
- GitHub Pages ist fuer Portfolio und Blog gut, aber nicht fuer eine private Dateioberflaeche mit sauberem Zugriffsschutz.
- Bei Custom Domains muss die Base-URL-Konfiguration in Astro angepasst werden; aktuell ist `base: "/Website"` auf die GitHub-Pages-Projekt-URL ausgerichtet.

Bewertung: 4/5 fuer den aktuellen Zustand, 2/5 fuer die geplante Fullstack-Zukunft.

## 3. Vercel

Quellen: [Vercel Pricing](https://vercel.com/pricing), [Vercel Astro docs](https://vercel.com/docs/frameworks/astro), [Vercel custom domains](https://vercel.com/docs/domains).

Warum fast empfohlen:

- Sehr gute Developer Experience fuer Astro.
- Git-Deployments, Previews und Custom Domains sind sehr komfortabel.
- Fuer eine statische persoenliche Site reicht der Hobby-Plan oft aus.

Vorteile:

- Sehr einfacher Umstieg von Astro.
- Gute Preview-Deployments.
- Sehr gutes Image in der Frontend-Community.
- Spaeter moeglich: Serverless Functions, Edge Functions, KV/Postgres/Blob-Integrationen.

Nachteile:

- Der Hobby-Plan ist gratis, aber nicht automatisch fuer alle geplanten Features robust.
- Dynamische Features koennen durch Bandbreite, Function-Limits, Edge-Limits oder Add-on-Preise unattraktiv werden.
- Vercel ist stark auf das eigene Plattformmodell ausgerichtet.

Potenzielle Probleme:

- Vercel hat online wiederkehrende Kritik wegen unerwarteter Usage-Kosten, Plan-Grenzen und kommerzieller Ausrichtung.
- Fuer Chat und Datei-Features braucht es sehr genaue Limits und Abuse-Schutz, sonst wird das Budgetziel schnell verletzt.
- Wenn spaeter Datenbank und Auth dazukommen, ist Vercel oft nur das Frontend-Hosting; Supabase, Neon, Clerk, Auth.js oder aehnliche Dienste kommen zusaetzlich ins Spiel.

Bewertung: 3.8/5. Sehr angenehm, aber fuer "maximal 1 CHF dauerhaft" weniger konservativ als Cloudflare oder GitHub Pages.

## 4. Netlify

Quellen: [Netlify Pricing](https://www.netlify.com/pricing/), [Netlify Astro docs](https://docs.netlify.com/frameworks/astro/), [Netlify custom domains](https://docs.netlify.com/domains-https/custom-domains/).

Warum fast empfohlen:

- Gute Static-Site-Plattform mit einfacher Bedienung.
- Astro passt gut.
- Custom Domains sind sauber integriert.

Vorteile:

- Einfache Git-Deployments.
- Preview-Deployments.
- Functions und Edge Functions als spaeterer Ausbaupfad.
- Gute Dokumentation fuer statische Websites.

Nachteile:

- Fuer Fullstack-Features braucht es schnell Zusatzdienste oder bezahlte Kapazitaeten.
- Netlify Identity wurde historisch veraendert beziehungsweise in Richtung externer Auth-Anbieter verschoben; Auth sollte man nicht blind als dauerhaftes Kernfeature einplanen.
- SQL ist nicht nativ der Hauptpfad.

Potenzielle Probleme:

- Free-Tier-Limits fuer Bandbreite, Build-Minuten und Functions muessen beobachtet werden.
- Online-Reputation ist grundsaetzlich gut, aber Preis- und Produktveraenderungen bei Free-Features sind ein Risiko.
- Fuer Chat ist Netlify nicht die erste Wahl.

Bewertung: 3.7/5. Solide fuer statisch und kleine Funktionen, aber nicht die beste Langfrist-Option fuer SQL und Echtzeit.

## 5. Deno Deploy

Quellen: [Deno Deploy](https://deno.com/deploy), [Deno Deploy Pricing](https://deno.com/deploy/pricing).

Warum fast empfohlen:

- Technisch interessant fuer moderne TypeScript-Edge-Apps.
- Custom Domains und Git-Deployments sind moeglich.
- Kann spaeter Serverlogik besser abbilden als reine Static-Hosts.

Vorteile:

- Gute TypeScript-Runtime.
- Edge-nahe Serverlogik.
- Saubere Plattform fuer kleine APIs.

Nachteile:

- Astro plus Bun ist nicht der natuerlichste Hauptpfad.
- Weniger verbreitet fuer klassische Astro-Portfolio-Sites als Cloudflare, Vercel, Netlify oder GitHub Pages.
- SQL/Auth/Storage muessen meist ueber externe Dienste kommen.

Potenzielle Probleme:

- Weniger breite Community-Erfahrung fuer genau diesen Stack.
- Free-Tier und Produktstrategie muessen beobachtet werden.
- Bei Chatroom und Auth entsteht schnell eine selbst zusammengesetzte Architektur.

Bewertung: 3.2/5. Technisch gut, aber fuer dieses Projekt nicht der einfachste Weg.

## 6. Firebase Hosting

Quellen: [Firebase Pricing](https://firebase.google.com/pricing), [Firebase Hosting](https://firebase.google.com/docs/hosting), [Firebase Authentication](https://firebase.google.com/docs/auth).

Warum fast empfohlen:

- Firebase loest Auth, Hosting und Realtime-Funktionen aus einer Hand.
- Fuer Chatroom-Prototypen ist Firebase praktisch.

Vorteile:

- Gute Auth-Unterstuetzung.
- Realtime Database oder Firestore sind fuer Chat naheliegend.
- Hosting ist einfach und stabil.
- Google-Infrastruktur ist vertraut und verbreitet.

Nachteile:

- SQL passt schlecht, weil Firebase primaer NoSQL-orientiert ist.
- Fuer SQL waere Cloud SQL noetig, was das Budget sprengt.
- Das Blaze-Modell kann Kostenrisiken erzeugen, wenn dynamische Nutzung oder Missbrauch nicht begrenzt wird.

Potenzielle Probleme:

- Firebase ist bekannt fuer unerwartete Rechnungen bei schlecht begrenzter Nutzung.
- Vendor-Lock-in ist hoch.
- Fuer dieses Projekt waere Firebase eher ein Backend-Ersatz als nur ein Hosting-Anbieter.

Bewertung: 3/5. Gut fuer Auth und Chat, aber nicht gut fuer das SQL- und Kostenkriterium.

## 7. Render Static Sites

Quellen: [Render Pricing](https://render.com/pricing), [Render static sites](https://docs.render.com/static-sites), [Render custom domains](https://docs.render.com/custom-domains).

Warum fast empfohlen:

- Render kann statische Sites einfach deployen.
- Custom Domains sind moeglich.

Vorteile:

- Einfache Bedienung.
- Gute Plattform fuer kleine Web Services, falls spaeter ein Backend gebraucht wird.
- Klare Produktstruktur.

Nachteile:

- Fuer die aktuelle statische Site bietet Render wenig Vorteil gegenueber GitHub Pages, Cloudflare Pages, Vercel oder Netlify.
- Datenbanken und Services liegen schnell ausserhalb des 1-CHF-Ziels.
- Free-Angebote fuer dynamische Dienste sind traditionell enger als bei Cloudflare.

Potenzielle Probleme:

- Preis- und Free-Tier-Aenderungen koennen Render fuer Hobby-Projekte weniger attraktiv machen.
- Chat/Auth/SQL wuerden wahrscheinlich Zusatzkosten oder externe Dienste brauchen.

Bewertung: 2.8/5. Nutzbar, aber nicht optimal.

## 8. Koyeb

Quellen: [Koyeb Pricing](https://www.koyeb.com/pricing), [Koyeb custom domains](https://www.koyeb.com/docs/build-and-deploy/custom-domains).

Warum fast sinnvoll:

- Interessant, wenn spaeter ein eigener kleiner Server oder Container laufen soll.
- Custom Domains sind moeglich.

Vorteile:

- Besser fuer persistente Apps als reine Static-Hosts.
- Kann kleine Backend-Services hosten.
- Fuer experimentelle Fullstack-Features attraktiv.

Nachteile:

- Fuer eine statische Astro-Site komplizierter als noetig.
- Free-Tier-Verfuegbarkeit und Limits sind zentral; ohne Gratis-Kapazitaet passt es nicht zum Budget.
- Datenbank und Auth sind nicht automatisch geloest.

Potenzielle Probleme:

- Plattform ist weniger Standard fuer Astro-Static-Deployments.
- Wenn die App dauerhaft laufen muss, wird das Budget schnell eng.

Bewertung: 2.6/5. Technisch interessant, aber fuer dieses Projekt nur zweite Reihe.

## 9. Railway

Quellen: [Railway Pricing](https://railway.com/pricing), [Railway docs](https://docs.railway.com/).

Warum nur fast sinnvoll:

- Railway ist bequem fuer Fullstack-Apps, Services und Datenbanken.
- Fuer Chat, Auth und SQL waere es technisch passender als ein reiner Static-Host.

Vorteile:

- Gute DX fuer kleine Services.
- Datenbanken und Apps lassen sich schnell verbinden.
- Gut fuer Prototyping.

Nachteile:

- Das Budget von maximal 1 CHF pro Monat passt schlecht zu einer dauerhaft betriebenen Railway-App.
- Fuer die aktuelle statische Website ist Railway zu schwer.
- Kostenkontrolle ist kritischer als bei reinem Static Hosting.

Potenzielle Probleme:

- Free- oder Trial-Modelle koennen sich aendern und sind nicht ideal als dauerhaftes Fundament.
- Ein Chatroom oder Authsystem kann bei Missbrauch laufende Kosten erzeugen.

Bewertung: 2.4/5. Gut zum Entwickeln, schlecht als Budget-Hosting fuer dieses Projekt.

## 10. Fly.io

Quellen: [Fly.io Pricing](https://fly.io/docs/about/pricing/), [Fly.io custom domains](https://fly.io/docs/networking/custom-domain/).

Warum nur fast sinnvoll:

- Fly.io ist stark fuer eigene kleine Server, globale Apps und persistente Backends.
- Fuer eine statische Astro-Seite ist es ueberdimensioniert.

Vorteile:

- Hohe technische Flexibilitaet.
- Gute Option fuer einen eigenen Chat- oder API-Server.
- PostgreSQL oder externe Datenbank-Anbindung moeglich.

Nachteile:

- Kein idealer Static-Hosting-Default.
- Betrieb, Deployments und Kostenkontrolle sind anspruchsvoller.
- Das 1-CHF-Limit ist fuer reale Fullstack-Nutzung unrealistisch.

Potenzielle Probleme:

- Kleine Fehlkonfigurationen koennen zu laufenden Kosten fuehren.
- Fuer eine persoenliche Website ist der Betriebsaufwand unverhaeltnismaessig.

Bewertung: 2.2/5. Gute Plattform, falscher Fit fuer das Budget und den aktuellen Projektstand.

## Weitere sinnvolle und fast sinnvolle Optionen

### Supabase plus Static Host

Quellen: [Supabase Pricing](https://supabase.com/pricing), [Supabase Auth](https://supabase.com/docs/guides/auth), [Supabase Realtime](https://supabase.com/docs/guides/realtime).

Supabase ist kein primaerer Static-Host fuer Astro, aber als Backend-Ergaenzung sehr relevant. Es bietet PostgreSQL, Auth, Storage und Realtime. Kombiniert mit Cloudflare Pages, GitHub Pages, Vercel oder Netlify waere es die direkteste SQL/Auth/Chat-Loesung. Das Problem ist Preis- und Limit-Stabilitaet: Gratis kann fuer Prototypen reichen, aber ein dauerhaftes oeffentliches Chat- und Datei-System braucht Quotas, Abuse-Schutz und klare Datenloeschung.

### Neon plus Static Host

Quellen: [Neon Pricing](https://neon.com/pricing), [Neon docs](https://neon.com/docs).

Neon ist eine gute serverless PostgreSQL-Option, aber kein vollstaendiger Hosting-Ersatz. Fuer SQL-lastige Features kann Neon besser passen als Cloudflare D1, wenn PostgreSQL gebraucht wird. Auth, Storage und Chat muessen separat geloest werden.

### Turso plus Static Host

Quellen: [Turso Pricing](https://turso.tech/pricing), [Turso docs](https://docs.turso.tech/).

Turso ist interessant, wenn SQLite/libSQL reicht. Es passt gut zu kleinen Projekten und Edge-Architekturen. Es ersetzt aber weder Auth noch Datei-Storage und ist ein zusaetzlicher Anbieter.

### Surge

Quelle: [Surge](https://surge.sh/).

Surge ist extrem einfach fuer statische Sites und eigene Domains, aber fuer dieses Projekt zu begrenzt. Es hat keinen guten nativen Pfad fuer Auth, SQL oder Chat. Nur sinnvoll, wenn es ausschliesslich um eine statische Portfolio-Seite geht.

### Static.app

Quelle: [Static.app Pricing](https://static.app/pricing).

Static.app kann statische Websites einfach hosten, wirkt aber fuer dieses Projekt weniger etabliert als GitHub Pages, Cloudflare Pages, Netlify oder Vercel. Fuer dynamische Zukunftsfeatures ist es keine starke Basis.

### DigitalOcean App Platform

Quelle: [DigitalOcean App Platform Pricing](https://www.digitalocean.com/pricing/app-platform).

Technisch brauchbar, aber fuer das Budget fast sicher nicht sinnvoll, sobald mehr als sehr einfache statische Nutzung benoetigt wird. DigitalOcean ist eher eine Option, wenn man spaeter bewusst bezahlt und mehr Kontrolle will.

## Kritische Zukunftsbetrachtung

### Blog

Ein Blog passt perfekt zum aktuellen Astro-Modell. Markdown oder Content Collections reichen. Dafuer braucht es keinen neuen Host.

Beste Optionen:

- GitHub Pages.
- Cloudflare Pages.
- Vercel.
- Netlify.

### Chatroom

Ein Chatroom ist der erste grosse Bruch mit rein statischem Hosting. Er braucht Echtzeit-Kommunikation, Auth oder Moderation, Spam-Schutz, Rate-Limits und Datenhaltung.

Realistische Wege:

- Cloudflare Pages plus Workers, Durable Objects und D1 oder R2.
- Supabase Realtime plus ein Static Host.
- Firebase mit Firestore oder Realtime Database.
- Eigener kleiner Server auf Fly.io, Koyeb, Render oder Railway, aber nicht budgetfreundlich.

Hauptproblem: Oeffentliche Chatrooms ziehen Missbrauch an. Ohne Moderation, Rate-Limits und klare Datenregeln wird das schnell unsicher oder teuer.

### Authsystem und Dropbox-Dateien

Das aktuelle statische Bewerbungsgate ist keine echte serverseitige Autorisierung. Wenn Dateien nur fuer berechtigte Nutzer erreichbar sein sollen, braucht es serverseitige Zugriffskontrolle oder signierte URLs.

Realistische Wege:

- Cloudflare Worker als Gatekeeper, der nach Auth signierte Weiterleitungen oder kurzlebige Links ausgibt.
- Supabase Auth plus Storage oder eigene Serverlogik.
- Firebase Auth plus Storage.
- Dropbox direkt oeffentlich verlinken ist nur fuer nicht sensible Dateien akzeptabel.

Hauptproblem: Wenn die Datei-URL im Browser dauerhaft sichtbar ist, ist sie weiterteilbar. Echte Zugriffskontrolle darf nicht nur im Frontend passieren.

### SQL-Datenbank

SQL ist der staerkste Grund gegen GitHub Pages als einzige Plattform.

Optionen:

- Cloudflare D1, wenn SQLite-kompatible SQL-Funktionalitaet reicht.
- Supabase oder Neon, wenn PostgreSQL gewuenscht ist.
- Turso, wenn SQLite/libSQL und Edge-Naehe passen.
- Railway/Fly/Render mit eigener DB nur, wenn Budget spaeter erhoeht wird.

Hauptproblem: SQL plus Auth plus Chat erzeugt eine Backend-Architektur. Unter 1 CHF pro Monat bleibt das nur realistisch, wenn Free-Tiers reichen und Nutzung klein bleibt.

## Empfehlung

### Empfohlener Zielpfad

1. Kurzfristig bei GitHub Pages bleiben, wenn nur Portfolio und Blog geplant sind.
2. Bei eigener Domain und besserem Wachstumspfad zu Cloudflare Pages wechseln.
3. Fuer echte Auth-, SQL- und Chat-Funktionen Cloudflare als erste integrierte Plattform pruefen.
4. Wenn PostgreSQL wichtiger als Plattform-Einfachheit wird, Cloudflare Pages mit Supabase oder Neon vergleichen.

### Konkrete Empfehlung

Cloudflare Pages ist der beste neue Hostingprovider fuer dieses Projekt. Es erfuellt das Budget, erlaubt Custom Domains, passt gut zu Astro, hat einen glaubwuerdigen Pfad fuer spaetere dynamische Features und vermeidet den sofortigen Zwang zu mehreren Anbietern.

GitHub Pages ist die beste Option, wenn keine dynamischen Features in naher Zukunft umgesetzt werden. Es ist nicht schlechter fuer die aktuelle Website, aber deutlich schwaecher fuer die geplante Zukunft.

Vercel und Netlify sind gute Alternativen, falls Ease of use hoeher gewichtet wird als langfristige Kostenkontrolle. Beide sollten aber erst nach genauer Limit-Pruefung fuer Auth, Chat, Storage und SQL gewaehlt werden.

## Vor einer Migration pruefen

- Aktuelle Free-Tier-Limits und Pricing-Seiten erneut lesen.
- Klaeren, ob die eigene Domain auf Apex, `www` oder Subdomain laufen soll.
- In `astro.config.mjs` `site` und `base` fuer die neue Domain anpassen.
- GitHub Actions oder Anbieter-Build so konfigurieren, dass Bun verwendet wird.
- Preview-Deployment bauen und interne Links testen.
- Fuer Auth und Dateien keine rein clientseitige Schutzlogik verwenden.
- Budget-Alerts oder harte Usage-Limits setzen, falls der Anbieter das erlaubt.
- Dokumentieren, welcher Anbieter welche Rolle uebernimmt: Hosting, Auth, DB, Storage, Realtime.
