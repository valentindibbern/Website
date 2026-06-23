import { getCollection, render, type CollectionEntry } from "astro:content";

export type TextEntry = CollectionEntry<"text">;
export type DataEntry = CollectionEntry<"data">;

export type DictionaryRow = {
    label: string;
    value: string;
    kind?: string;
};

export type TableColumn = {
    key: string;
    label: string;
};

export type ListItem =
    | string
    | {
          label: string;
          value?: string;
      };

export type DictionaryEntry = {
    id?: string;
    command?: string;
    rows: DictionaryRow[];
};

export async function getTextContent(src: string) {
    const entry = await getContentEntry("text", src);
    const rendered = await render(entry);

    return {
        Content: rendered.Content,
    };
}

export async function getDataContent(src: string) {
    return getContentEntry("data", src);
}

export async function getDictionaryContent(
    src: string,
    entryId?: string,
): Promise<DictionaryRow[]> {
    const entry = await getDataContent(src);

    if (entryId) {
        const dictionaryEntry = entry.data.entries?.find(
            (candidate) => candidate.id === entryId,
        );

        if (!dictionaryEntry) {
            throw new Error(
                `Expected dictionary entry "${entryId}" in src/content/data/${src}.yaml.`,
            );
        }

        return dictionaryEntry.rows;
    }

    if (!entry.data.rows) {
        throw new Error(
            `Expected rows in src/content/data/${src}.yaml for TerminalDictionary.`,
        );
    }

    if (!entry.data.rows.every(isDictionaryRow)) {
        throw new Error(
            `Expected label/value rows in src/content/data/${src}.yaml for TerminalDictionary.`,
        );
    }

    return entry.data.rows;
}

export async function getDictionaryEntries(src: string) {
    const entry = await getDataContent(src);

    if (!entry.data.entries) {
        throw new Error(
            `Expected entries in src/content/data/${src}.yaml for repeated dictionaries.`,
        );
    }

    return entry.data.entries;
}

export async function getListContent(src: string): Promise<string[]> {
    const entry = await getDataContent(src);

    if (!entry.data.items) {
        throw new Error(
            `Expected items in src/content/data/${src}.yaml for TerminalList.`,
        );
    }

    return entry.data.items.map((item) =>
        typeof item === "string"
            ? item
            : item.value
              ? `${item.label}: ${item.value}`
              : item.label,
    );
}

export async function getTableContent(src: string) {
    const entry = await getDataContent(src);

    if (!entry.data.columns || !entry.data.rows) {
        throw new Error(
            `Expected columns and rows in src/content/data/${src}.yaml for TerminalTable.`,
        );
    }

    if (!entry.data.rows.every(isTableRow)) {
        throw new Error(
            `Expected table rows in src/content/data/${src}.yaml for TerminalTable.`,
        );
    }

    return {
        columns: entry.data.columns,
        rows: entry.data.rows,
    };
}

function isDictionaryRow(row: unknown): row is DictionaryRow {
    return (
        typeof row === "object" &&
        row !== null &&
        "label" in row &&
        "value" in row
    );
}

function isTableRow(row: unknown): row is Record<string, string> {
    return (
        typeof row === "object" &&
        row !== null &&
        Object.values(row).every((value) => typeof value === "string")
    );
}

async function getContentEntry<TCollection extends "data" | "text">(
    collection: TCollection,
    src: string,
): Promise<CollectionEntry<TCollection>> {
    const entries = await getCollection(collection);
    const entry = entries.find((candidate) => candidate.id === src);

    if (!entry) {
        throw new Error(
            `Could not find src/content/${collection}/${src}.${collection === "text" ? "md" : "yaml"}.`,
        );
    }

    return entry;
}
