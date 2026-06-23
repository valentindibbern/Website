import { getCollection, render, type CollectionEntry } from "astro:content";

export type ProfileEntry = CollectionEntry<"profile">;
export type ProjectEntry = CollectionEntry<"projects">;
export type ReferenceEntry = CollectionEntry<"references">;
export type TerminalEntry = CollectionEntry<"terminal">;

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
    const details = includeEducation
        ? profile.details
        : profile.details.filter((entry) => entry.label !== "education");

    return details
        .map((entry) => `${entry.label}: ${entry.value}`)
        .join("\n");
}

export function formatProfileDetails(profile: ProfileEntry["data"]) {
    return profile.details;
}

export function formatProjectTerminalBody(project: ProjectEntry["data"]) {
    return [
        `source: ${project.source}`,
        `type: ${project.type}`,
        `stack: ${project.stack}`,
        `summary: ${project.summary}`,
    ].join("\n");
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
