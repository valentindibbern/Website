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
        if (!isEntryListData(entry.data)) {
            throw new Error(
                `Expected entries in src/content/data/${src}.yaml for TerminalDictionary entry "${entryId}".`,
            );
        }

        const dictionaryEntry = entry.data.entries.find(
            (candidate: DictionaryEntry) => candidate.id === entryId,
        );

        if (!dictionaryEntry) {
            throw new Error(
                `Expected dictionary entry "${entryId}" in src/content/data/${src}.yaml.`,
            );
        }

        return dictionaryEntry.rows;
    }

    if (!isDictionaryData(entry.data)) {
        throw new Error(
            `Expected rows in src/content/data/${src}.yaml for TerminalDictionary.`,
        );
    }

    return entry.data.rows;
}

export async function getDictionaryEntries(src: string) {
    const entry = await getDataContent(src);

    if (!isEntryListData(entry.data)) {
        throw new Error(
            `Expected entries in src/content/data/${src}.yaml for repeated dictionaries.`,
        );
    }

    return entry.data.entries;
}

export async function getListContent(src: string): Promise<string[]> {
    const entry = await getDataContent(src);

    if (!("items" in entry.data)) {
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

    if (!isTableData(entry.data)) {
        throw new Error(
            `Expected columns and rows in src/content/data/${src}.yaml for TerminalTable.`,
        );
    }

    return {
        columns: entry.data.columns,
        rows: entry.data.rows,
    };
}

function isDictionaryData(data: DataEntry["data"]): data is {
    rows: DictionaryRow[];
} {
    return (
        "rows" in data &&
        !("columns" in data) &&
        data.rows.every(
            (row) =>
                typeof row === "object" &&
                row !== null &&
                "label" in row &&
                "value" in row,
        )
    );
}

function isEntryListData(data: DataEntry["data"]): data is {
    entries: DictionaryEntry[];
} {
    return "entries" in data;
}

function isTableData(data: DataEntry["data"]): data is {
    columns: TableColumn[];
    rows: Record<string, string>[];
} {
    return (
        "columns" in data &&
        "rows" in data &&
        data.rows.every(
            (row) =>
                typeof row === "object" &&
                row !== null &&
                Object.values(row).every((value) => typeof value === "string"),
        )
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
