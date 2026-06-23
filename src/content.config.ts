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
});

const tableRowSchema = z.record(z.string(), z.string());

const listItemSchema = z.union([
    z.string(),
    z.object({
        label: z.string(),
        value: z.string().optional(),
    }),
]);

const dataSchema = z.object({
    rows: z.array(z.union([dictionaryRowSchema, tableRowSchema])).optional(),
    entries: z.array(dictionaryEntrySchema).optional(),
    items: z.array(listItemSchema).optional(),
    columns: z.array(tableColumnSchema).optional(),
});

const text = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/text" }),
    schema: z.object({}),
});

const data = defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/content/data" }),
    schema: dataSchema,
});

export const collections = {
    data,
    text,
};
