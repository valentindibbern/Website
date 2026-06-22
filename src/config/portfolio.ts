export const profile = {
    name: "Valentin Dibbern",
    role: "IMS-Schüler mit Fokus Softwareentwicklung",
    education: "Informatikmittelschule (IMS), Wirtschaftsinformatik mit Berufsmaturität",
    interests: "Frontend, Backend, Automatisierung, Datenbanken und Tooling",
    workingStyle: "selbstständig, neugierig, pragmatisch und teamorientiert",
    aboutDraft: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae nibh non urna luctus tincidunt. Sed at libero sed massa consequat fermentum. Praesent vel sem vel arcu tincidunt cursus. Curabitur non nibh vitae lectus commodo posuere. Donec vitae mauris in mi viverra facilisis.",
};

export const inputNotes = {
    aboutText: "! Bitte ersetze diesen Lorem-Ipsum-Text durch einen öffentlichen Fliesstext über dich. !",
    contact: "! Bitte entscheide, welche Kontaktmöglichkeit öffentlich sichtbar sein soll. !",
    projectDetails: "! Bitte ergänze pro Projekt später kurze echte Beschreibungen, Screenshots oder Learnings. !",
    referencesPublic: "! Bitte entscheide, welche Zertifikate, Zeugnisse oder Referenzen öffentlich genannt werden dürfen. !",
};

export const skills = [
    "Python",
    "PHP",
    "C#",
    "Java",
    "JavaScript / TypeScript",
    "HTML / CSS",
    "SQL",
    "Git / GitHub / Bitbucket",
    "Docker",
    "REST APIs, Socket APIs, OOP, funktionaler und asynchroner Code",
];

export const projects = [
    {
        command: "open project buecherantiquariat",
        body: `source: github.com/valentindibbern/buecherantiquariat
            type: Schul-/Lernprojekt
            stack: Plain PHP, mysqli, HTML/CSS
            summary: kleine Antiquariat-Anwendung mit MVC-ähnlicher Struktur, Routing, Models, Views, Komponenten und Projektdokumentation`,
    },
    {
        command: "open project JahrJava3Aufgaben",
        body: `source: github.com/valentindibbern/JahrJava3Aufgaben
            type: Java-Aufgabensammlung
            stack: Java
            summary: Aufgaben aus dem dritten Schuljahr, unter anderem ggT/kgV-Konsolenprogramm und Parkhaus-Simulation mit OOP- und SOLID-Fokus`,
    },
    {
        command: "open project neovimconfig",
        body: `source: github.com/valentindibbern/neovimconfig
            type: persönliche Entwicklungsumgebung
            stack: Lua, Neovim
            summary: eigene Neovim-Konfiguration mit LSP, Treesitter, Telescope, Lualine, Noice, Mini und weiteren Plugins`,
    },
    {
        command: "open project cmdRechner",
        body: `source: github.com/valentindibbern/cmdRechner
            type: Konsolenprojekt
            stack: Python
            summary: kleines Python-Projekt aus dem GitHub-Profil; Repository enthält Source- und Dokumentationsordner`,
    },
    {
        command: "open project Website",
        body: `source: github.com/valentindibbern/Website
            type: persönliche Website
            stack: Astro, TypeScript, Tailwind
            summary: statische Portfolio-Website im Terminal-/ASCII-Stil`,
    },
];

export const links = [
      { label: "github", value: "github.com/valentindibbern" },
      { label: "portfolio", value: "valentindibbern.github.io" },
      { label: "contact", value: "contact route not public yet" },
];

export const education = [
    {
        command: "cat education-current.txt",
        body: `2023 - heute
            Informatikmittelschule (IMS)
            Wirtschaftsinformatik mit Berufsmaturität
            Fokus: Softwareentwicklung, Datenbanken und Betriebsinformatik`,
      },
      {
            command: "cat education-previous.txt",
            body: `2011 - 2023
                Rudolf Steiner Schule
                12 Jahre Schulzeit mit ganzheitlichem Bildungsschwerpunkt`,
      },
];

export const experience = [
    {
        command: "cat cobra-software.txt",
        body: `Schnupperlehre: Cobra Software AG
            Einblick in Softwareentwicklung und Projektabwicklung in einem professionellen Umfeld`,
    },
    {
        command: "cat klixar-it.txt",
        body: `Schnupperlehre: Klixar IT GmbH
            Praktische Erfahrungen in der IT-Branche und Kennenlernen verschiedener Technologien und Arbeitsabläufe`,
    },
];

export const references = [
    {
        command: "cat delf-b1.txt",
        body: `DELF B1
            Französisch-Zertifikat, bestanden 2025
            Hinweis: Dokument ist vorhanden, aber aktuell nicht als Download verlinkt`,
    },
    {
        command: "cat school-records.txt",
        body: `Schulische Nachweise
            Modulnotenübersicht und Zeugnisse sind im Bewerbungsdossier vorhanden.
            Aktuell werden keine Dateien zum Download angeboten.`,
    },
    {
        command: "cat references.txt",
        body: `Referenzen
            Referenzpersonen sind im privaten Bewerbungsdossier vorhanden.
            Namen und Kontaktdaten werden auf der öffentlichen Website nicht angezeigt.`,
    },
];

export const languages = [
    "Deutsch: Muttersprache",
    "Englisch: flüssig in Wort und Schrift",
    "Französisch: DELF B1",
];

export const hobbies = ["Bouldern", "Lesen", "Programmieren", "Gaming"];

export const linksJson = `{
${links
    .map((link, index) => `  "${link.label}": "${link.value}"${index < links.length - 1 ? "," : ""}`)
    .join("\n")}
}`;
