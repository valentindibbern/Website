import { getCollection, render, type CollectionEntry } from "astro:content";

export type ProfileEntry = CollectionEntry<"profile">;
export type ProjectEntry = CollectionEntry<"projects">;
export type ReferenceEntry = CollectionEntry<"references">;
export type TerminalEntry = CollectionEntry<"terminal">;
export type ContentRow = {
    label: string;
    value: string;
    kind?: string;
    meta?: string;
};

export async function getProfile() {
    const profiles = await getCollection("profile");

    if (profiles.length !== 1) {
        throw new Error(
            `Expected exactly one profile content entry, found ${profiles.length}.`,
        );
    }

    return profiles[0];
}

export async function getProfileContent() {
    const profile = await getProfile();
    const renderedProfile = await render(profile);

    return {
        profile,
        Content: renderedProfile.Content,
    };
}

export async function getProjects() {
    const projects = await getCollection("projects");

    return sortByOrder(projects);
}

export async function getReferences() {
    const references = await getCollection("references");

    return sortByOrder(references);
}

export async function getTerminalEntries(
    group: TerminalEntry["data"]["group"],
) {
    const entries = await getCollection(
        "terminal",
        (entry) => entry.data.group === group,
    );

    return sortByOrder(entries);
}

export async function getSnippets() {
    const snippets = await getCollection("snippets");

    return Object.fromEntries(
        snippets.map((entry) => [entry.data.key, entry.data.value]),
    );
}

export function formatProfileTerminalBody(
    profile: ProfileEntry["data"],
    includeEducation = false,
) {
    return [
        `name: ${profile.name}`,
        `role: ${profile.role}`,
        includeEducation ? `education: ${profile.education}` : undefined,
        `interests: ${profile.interests}`,
        `working style: ${profile.workingStyle}`,
    ]
        .filter(Boolean)
        .join("\n");
}

export function getProfileRows(
    profile: ProfileEntry["data"],
    includeEducation = false,
): ContentRow[] {
    return [
        { label: "name", value: profile.name },
        { label: "role", value: profile.role },
        includeEducation
            ? { label: "education", value: profile.education }
            : undefined,
        { label: "interests", value: profile.interests },
        { label: "working style", value: profile.workingStyle },
    ].filter(Boolean) as ContentRow[];
}

export function formatProjectTerminalBody(project: ProjectEntry["data"]) {
    return [
        `source: ${project.source}`,
        `type: ${project.type}`,
        `stack: ${project.stack}`,
        `summary: ${project.summary}`,
    ].join("\n");
}

export function getProjectRows(project: ProjectEntry["data"]): ContentRow[] {
    return [
        { label: "source", value: project.source },
        { label: "type", value: project.type },
        { label: "stack", value: project.stack },
        { label: "summary", value: project.summary },
    ];
}

export function getReferenceRows(
    reference: ReferenceEntry["data"],
): ContentRow[] {
    return [
        { label: "title", value: reference.title },
        { label: "command", value: reference.command },
        { label: "body", value: reference.body.replaceAll("\n", " ") },
    ];
}

export function getTerminalRows(entry: TerminalEntry["data"]): ContentRow[] {
    return [
        { label: "title", value: entry.title },
        { label: "command", value: entry.command },
        { label: "body", value: entry.body.replaceAll("\n", " ") },
    ];
}

export function formatLinksJson(rawLinks: string[] | string) {
    const links = toStringList(rawLinks).map((entry) => {
        const [label, ...valueParts] = entry.split("=");

        return {
            label,
            value: valueParts.join("="),
        };
    });

    return `{\n${links
        .map(
            (link, index) =>
                `  "${link.label}": "${link.value}"${index < links.length - 1 ? "," : ""}`,
        )
        .join("\n")}\n}`;
}

export function toStringList(value: string[] | string | undefined) {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
}

function sortByOrder<T extends { data: { order: number } }>(entries: T[]) {
    return entries.toSorted(
        (first, second) => first.data.order - second.data.order,
    );
}
