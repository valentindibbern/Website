import { getCollection, render, type CollectionEntry } from "astro:content";

export type TextEntry = CollectionEntry<"text">;
export type DataEntry = CollectionEntry<"data">;

export type ValueAttribute = "link";

export type TerminalValue = {
    value: string;
    href?: string;
    attributes?: ValueAttribute[];
};

export type DictionaryRow = {
    label: string;
    value: string;
    href?: string;
    attributes?: ValueAttribute[];
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
          href?: string;
          attributes?: ValueAttribute[];
      };

export type DictionaryEntry = {
    id?: string;
    command?: string;
    rows: DictionaryRow[];
};

export type ProjectLink = {
    label?: string;
    href: string;
};

export type ProjectEntry = {
    id: string;
    repo: string;
    title: string;
    command?: string;
    type?: string;
    stack?: string[];
    summary: string;
    source: ProjectLink;
    demo?: ProjectLink;
    featured?: boolean;
    order?: number;
    hidden?: boolean;
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

export async function getProjects(): Promise<ProjectEntry[]> {
    const entry = await getDataContent("projects");

    if (!isProjectListData(entry.data)) {
        throw new Error(
            "Expected projects in src/content/data/projects.yaml for project output.",
        );
    }

    return entry.data.projects
        .map((project, index) => ({ project, index }))
        .filter(({ project }) => !project.hidden)
        .sort((left, right) => {
            const leftOrder = left.project.order ?? Number.POSITIVE_INFINITY;
            const rightOrder = right.project.order ?? Number.POSITIVE_INFINITY;

            if (leftOrder !== rightOrder) {
                return leftOrder - rightOrder;
            }

            return left.index - right.index;
        })
        .map(({ project }) => project);
}

export async function getFeaturedProject(): Promise<ProjectEntry | undefined> {
    const projects = await getProjects();

    return projects.find((project) => project.featured) ?? projects[0];
}

export function projectToDictionaryRows(project: ProjectEntry): DictionaryRow[] {
    const rows: DictionaryRow[] = [
        {
            label: "source",
            value: project.source.label ?? formatProjectLinkLabel(project.source.href),
            href: project.source.href,
            attributes: ["link"],
        },
    ];

    if (project.type) {
        rows.push({
            label: "type",
            value: project.type,
        });
    }

    if (project.stack?.length) {
        rows.push({
            label: "stack",
            value: project.stack.join(", "),
        });
    }

    rows.push({
        label: "summary",
        value: project.summary,
    });

    if (project.demo) {
        rows.push({
            label: "demo",
            value: project.demo.label ?? formatProjectLinkLabel(project.demo.href),
            href: project.demo.href,
            attributes: ["link"],
        });
    }

    return rows;
}

export async function getListContent(src: string): Promise<TerminalValue[]> {
    const entry = await getDataContent(src);

    if (!("items" in entry.data)) {
        throw new Error(
            `Expected items in src/content/data/${src}.yaml for TerminalList.`,
        );
    }

    return entry.data.items.map((item) => {
        if (typeof item === "string") {
            return { value: item };
        }

        return {
            value: item.value ? `${item.label}: ${item.value}` : item.label,
            href: item.href,
            attributes: item.attributes,
        };
    });
}

export async function getTableContent(src: string) {
    const entry = await getDataContent(src);

    if (!isTableData(entry.data)) {
        throw new Error(
            `Expected columns and rows in src/content/data/${src}.yaml for TerminalTable.`,
        );
    }

    validateTableRows(src, entry.data.columns, entry.data.rows);

    return {
        columns: entry.data.columns,
        rows: entry.data.rows.map((row) =>
            Object.fromEntries(
                Object.entries(row).map(([key, value]) => [
                    key,
                    normalizeTerminalValue(value),
                ]),
            ),
        ),
    };
}

function validateTableRows(
    src: string,
    columns: TableColumn[],
    rows: Record<string, string | TerminalValue>[],
) {
    const expectedKeys = columns.map((column) => column.key);
    const expectedKeySet = new Set(expectedKeys);

    rows.forEach((row, index) => {
        const rowKeys = Object.keys(row);
        const rowKeySet = new Set(rowKeys);
        const missingKeys = expectedKeys.filter((key) => !rowKeySet.has(key));
        const unknownKeys = rowKeys.filter((key) => !expectedKeySet.has(key));

        if (missingKeys.length || unknownKeys.length) {
            const details = [
                missingKeys.length ? `missing keys: ${missingKeys.join(", ")}` : "",
                unknownKeys.length ? `unknown keys: ${unknownKeys.join(", ")}` : "",
            ]
                .filter(Boolean)
                .join("; ");

            throw new Error(
                `Invalid table row ${index + 1} in src/content/data/${src}.yaml: ${details}.`,
            );
        }
    });
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

function isProjectListData(data: DataEntry["data"]): data is {
    projects: ProjectEntry[];
} {
    return "projects" in data;
}

function isTableData(data: DataEntry["data"]): data is {
    columns: TableColumn[];
    rows: Record<string, string | TerminalValue>[];
} {
    return (
        "columns" in data &&
        "rows" in data &&
        data.rows.every(
            (row) =>
                typeof row === "object" &&
                row !== null &&
                Object.values(row).every(
                    (value) =>
                        typeof value === "string" ||
                        (typeof value === "object" &&
                            value !== null &&
                            "value" in value &&
                            typeof value.value === "string"),
                ),
        )
    );
}

function normalizeTerminalValue(value: string | TerminalValue): TerminalValue {
    if (typeof value === "string") {
        return { value };
    }

    return value;
}

function formatProjectLinkLabel(href: string) {
    return href.replace(/^https:\/\//, "").replace(/\/$/, "");
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
