import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const valueAttributeSchema = z.enum(["link"]);

function requireHrefForLink(
    value: { attributes?: Array<"link">; href?: string },
    context: z.RefinementCtx,
) {
    if (!value.attributes?.includes("link")) {
        return;
    }

    if (!value.href?.trim()) {
        context.addIssue({
            code: "custom",
            message: 'Values with attributes: ["link"] require href.',
            path: ["href"],
        });
        return;
    }

    if (!isAllowedHref(value.href)) {
        context.addIssue({
            code: "custom",
            message:
                'Values with attributes: ["link"] require a safe href scheme.',
            path: ["href"],
        });
    }
}

function requireSafeHref(value: { href?: string }, context: z.RefinementCtx) {
    if (!value.href?.trim()) {
        context.addIssue({
            code: "custom",
            message: "Project links require href.",
            path: ["href"],
        });
        return;
    }

    if (!isAllowedHref(value.href)) {
        context.addIssue({
            code: "custom",
            message: "Project links require a safe href scheme.",
            path: ["href"],
        });
    }
}

function isAllowedHref(href: string) {
    const trimmedHref = href.trim();

    if (trimmedHref.startsWith("/") || trimmedHref.startsWith("#")) {
        return true;
    }

    try {
        const url = new URL(trimmedHref);
        return ["https:", "mailto:", "tel:"].includes(url.protocol);
    } catch {
        return false;
    }
}

const dictionaryRowSchema = z
    .object({
        label: z.string(),
        value: z.string(),
        href: z.string().optional(),
        attributes: z.array(valueAttributeSchema).optional(),
    })
    .strict()
    .superRefine(requireHrefForLink);

const tableColumnSchema = z
    .object({
        key: z.string(),
        label: z.string(),
    })
    .strict();

const dictionaryEntrySchema = z.object({
    id: z.string().optional(),
    command: z.string().optional(),
    rows: z.array(dictionaryRowSchema),
}).strict();

const tableValueSchema = z.union([
    z.string(),
    z
        .object({
            value: z.string(),
            href: z.string().optional(),
            attributes: z.array(valueAttributeSchema).optional(),
        })
        .strict()
        .superRefine(requireHrefForLink),
]);

const tableRowSchema = z.record(z.string(), tableValueSchema);

const listItemSchema = z.union([
    z.string(),
    z
        .object({
            label: z.string(),
            value: z.string().optional(),
            href: z.string().optional(),
            attributes: z.array(valueAttributeSchema).optional(),
        })
        .strict()
        .superRefine(requireHrefForLink),
]);

const dictionarySchema = z
    .object({
        rows: z.array(dictionaryRowSchema),
    })
    .strict();

const entryListSchema = z
    .object({
        entries: z.array(dictionaryEntrySchema),
    })
    .strict();

const listSchema = z
    .object({
        items: z.array(listItemSchema),
    })
    .strict();

const projectLinkSchema = z
    .object({
        label: z.string().optional(),
        href: z.string(),
    })
    .strict()
    .superRefine(requireSafeHref);

const projectSchema = z
    .object({
        id: z.string(),
        repo: z.string().regex(/^[^/\s]+\/[^/\s]+$/, {
            message: 'Project repo must use "owner/name".',
        }),
        title: z.string(),
        command: z.string().optional(),
        type: z.string().optional(),
        stack: z.array(z.string()).optional(),
        summary: z.string(),
        source: projectLinkSchema,
        demo: projectLinkSchema.optional(),
        featured: z.boolean().optional(),
        order: z.number().optional(),
        hidden: z.boolean().optional(),
    })
    .strict();

const projectListSchema = z
    .object({
        projects: z.array(projectSchema),
    })
    .strict();

const tableSchema = z
    .object({
        columns: z.array(tableColumnSchema),
        rows: z.array(tableRowSchema),
    })
    .strict()
    .superRefine((table, context) => {
        const expectedKeys = table.columns.map((column) => column.key);
        const expectedKeySet = new Set(expectedKeys);

        table.rows.forEach((row, index) => {
            const rowKeys = Object.keys(row);
            const rowKeySet = new Set(rowKeys);
            const missingKeys = expectedKeys.filter((key) => !rowKeySet.has(key));
            const unknownKeys = rowKeys.filter((key) => !expectedKeySet.has(key));

            if (!missingKeys.length && !unknownKeys.length) {
                return;
            }

            const details = [
                missingKeys.length ? `missing keys: ${missingKeys.join(", ")}` : "",
                unknownKeys.length ? `unknown keys: ${unknownKeys.join(", ")}` : "",
            ]
                .filter(Boolean)
                .join("; ");

            context.addIssue({
                code: "custom",
                message: `Table row ${index + 1} must match columns exactly: ${details}.`,
                path: ["rows", index],
            });
        });
    });

const dataSchema = z.union([
    tableSchema,
    projectListSchema,
    entryListSchema,
    listSchema,
    dictionarySchema,
]);

const text = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/text" }),
    schema: z.object({}).strict(),
});

const data = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/content/data" }),
    schema: dataSchema,
});

export const collections = {
    data,
    text,
};
