import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const valueAttributeSchema = z.enum(["link"]);

const dictionaryRowSchema = z
    .object({
        label: z.string(),
        value: z.string(),
        attributes: z.array(valueAttributeSchema).optional(),
    })
    .strict();

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
            attributes: z.array(valueAttributeSchema).optional(),
        })
        .strict(),
]);

const tableRowSchema = z.record(z.string(), tableValueSchema);

const listItemSchema = z.union([
    z.string(),
    z
        .object({
            label: z.string(),
            value: z.string().optional(),
            attributes: z.array(valueAttributeSchema).optional(),
        })
        .strict(),
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
