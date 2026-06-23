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
export type TerminalTableColumn = {
    key: string;
    label: string;
};
export type JsonEntry = {
    key: string;
    value: string;
};
export type SkillGroup = {
    category: string;
    items: string[];
};
export type ContentBlock =
    | {
          type: "rows";
          command: string;
          order: number;
          path?: string;
          rows: ContentRow[];
      }
    | {
          type: "table";
          command: string;
          order: number;
          path?: string;
          columns: TerminalTableColumn[];
          rows: Record<string, string>[];
      }
    | {
          type: "list";
          command: string;
          order: number;
          path?: string;
          items: string[];
      }
    | {
          type: "json";
          command: string;
          order: number;
          path?: string;
          entries: JsonEntry[];
      }
    | {
          type: "text";
          command: string;
          order: number;
          path?: string;
          body: string;
      };

type SnippetValue =
    | string
    | string[]
    | SkillGroup[]
    | JsonEntry[]
    | undefined;
type BlockSource = {
    blocks?: ContentBlock[];
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

    return sortEntriesByOrder(projects);
}

export async function getReferences() {
    const references = await getCollection("references");

    return sortEntriesByOrder(references);
}

export async function getTerminalEntries(
    group: TerminalEntry["data"]["group"],
) {
    const entries = await getCollection(
        "terminal",
        (entry) => entry.data.group === group,
    );

    return sortEntriesByOrder(entries);
}

export async function getSnippets() {
    const snippets = await getCollection("snippets");

    return Object.fromEntries(
        snippets.map((entry) => [entry.data.key, entry.data.value]),
    );
}

export function getBlocks(data: BlockSource): ContentBlock[] {
    return sortBlocks(data.blocks ?? []);
}

export function getFirstBlock(data: BlockSource): ContentBlock | undefined {
    return getBlocks(data)[0];
}

export function createSkillTableBlock(
    rawSkills: SnippetValue,
    command = "cat skills.txt",
): ContentBlock {
    const skillGroups = toSkillGroups(rawSkills);
    const columns = skillGroups.map((group) => ({
        key: group.category,
        label: group.category,
    }));
    const rowCount = Math.max(
        0,
        ...skillGroups.map((group) => group.items.length),
    );
    const rows = Array.from({ length: rowCount }, (_, index) =>
        Object.fromEntries(
            skillGroups.map((group) => [
                group.category,
                group.items[index] ?? "",
            ]),
        ),
    );

    return {
        type: "table",
        command,
        order: 0,
        columns,
        rows,
    };
}

export function createListBlock(
    rawList: SnippetValue,
    command: string,
): ContentBlock {
    return {
        type: "list",
        command,
        order: 0,
        items: toStringList(rawList),
    };
}

export function createLinksBlock(rawLinks: SnippetValue): ContentBlock {
    return {
        type: "json",
        command: "cat links.json",
        order: 0,
        entries: toJsonEntries(rawLinks),
    };
}

export function blockToBody(block: ContentBlock): string {
    if (block.type === "text") {
        return block.body;
    }

    if (block.type === "list") {
        return block.items.join("\n");
    }

    if (block.type === "json") {
        return formatJsonEntries(block.entries);
    }

    return "";
}

export function formatLinksJson(rawLinks: SnippetValue) {
    return formatJsonEntries(toJsonEntries(rawLinks));
}

export function formatJsonEntries(entries: JsonEntry[]) {
    return `{\n${entries
        .map(
            (entry, index) =>
                `  "${entry.key}": "${entry.value}"${index < entries.length - 1 ? "," : ""}`,
        )
        .join("\n")}\n}`;
}

export function toStringList(value: SnippetValue) {
    if (!value) {
        return [];
    }

    if (typeof value === "string") {
        return [value];
    }

    return value.filter((entry): entry is string => typeof entry === "string");
}

export function toSkillGroups(value: SnippetValue): SkillGroup[] {
    if (!value) {
        return [];
    }

    if (typeof value === "string") {
        return [{ category: "Skills", items: [value] }];
    }

    if (value.every((entry) => typeof entry === "string")) {
        return [{ category: "Skills", items: value }];
    }

    return value.filter(isSkillGroup);
}

function toJsonEntries(value: SnippetValue): JsonEntry[] {
    if (!value) {
        return [];
    }

    if (typeof value === "string") {
        return [stringToJsonEntry(value)];
    }

    return value
        .map((entry) => {
            if (typeof entry === "string") {
                return stringToJsonEntry(entry);
            }

            if (isJsonEntry(entry)) {
                return entry;
            }

            return undefined;
        })
        .filter((entry): entry is JsonEntry => Boolean(entry));
}

function stringToJsonEntry(entry: string): JsonEntry {
    const [key, ...valueParts] = entry.split("=");

    return {
        key,
        value: valueParts.join("="),
    };
}

function isJsonEntry(entry: string | SkillGroup | JsonEntry): entry is JsonEntry {
    return (
        typeof entry === "object" &&
        entry !== null &&
        "key" in entry &&
        "value" in entry
    );
}

function isSkillGroup(
    entry: string | SkillGroup | JsonEntry,
): entry is SkillGroup {
    return (
        typeof entry === "object" &&
        entry !== null &&
        "category" in entry &&
        "items" in entry
    );
}

function sortBlocks(blocks: ContentBlock[]) {
    return blocks.toSorted((first, second) => first.order - second.order);
}

function sortEntriesByOrder<T extends { data: { order: number } }>(entries: T[]) {
    return entries.toSorted(
        (first, second) => first.data.order - second.data.order,
    );
}
