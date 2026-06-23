import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const dictionaryRowSchema = z.object({
    label: z.string(),
    value: z.string(),
    kind: z.string().optional(),
});

const tableColumnSchema = z.object({
    key: z.string(),
    label: z.string(),
});

const dictionaryEntrySchema = z.object({
    id: z.string().optional(),
    command: z.string().optional(),
    rows: z.array(dictionaryRowSchema),
}).strict();

const tableRowSchema = z.record(z.string(), z.string());

const listItemSchema = z.union([
    z.string(),
    z.object({
        label: z.string(),
        value: z.string().optional(),
    }),
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

const tableSchema = z
    .object({
        columns: z.array(tableColumnSchema),
        rows: z.array(tableRowSchema),
    })
    .strict();

const dataSchema = z.union([
    tableSchema,
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
