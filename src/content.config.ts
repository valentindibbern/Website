import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const contentRowSchema = z.object({
    label: z.string(),
    value: z.string(),
    kind: z.string().optional(),
    meta: z.string().optional(),
});

const tableColumnSchema = z.object({
    key: z.string(),
    label: z.string(),
});

const jsonEntrySchema = z.object({
    key: z.string(),
    value: z.string(),
});

const blockBaseSchema = z.object({
    command: z.string(),
    order: z.number().default(0),
    path: z.string().optional(),
});

const contentBlockSchema = z.discriminatedUnion("type", [
    blockBaseSchema.extend({
        type: z.literal("rows"),
        rows: z.array(contentRowSchema).default([]),
    }),
    blockBaseSchema.extend({
        type: z.literal("table"),
        columns: z.array(tableColumnSchema),
        rows: z.array(z.record(z.string(), z.string())).default([]),
    }),
    blockBaseSchema.extend({
        type: z.literal("list"),
        items: z.array(z.string()).default([]),
    }),
    blockBaseSchema.extend({
        type: z.literal("json"),
        entries: z.array(jsonEntrySchema).default([]),
    }),
    blockBaseSchema.extend({
        type: z.literal("text"),
        body: z.string(),
    }),
]);

const skillGroupSchema = z.object({
    category: z.string(),
    items: z.array(z.string()),
});

const orderedEntrySchema = z.object({
    title: z.string(),
    command: z.string(),
    order: z.number(),
    blocks: z.array(contentBlockSchema).default([]),
});

const snippets = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/snippets" }),
    schema: z.object({
        key: z.string(),
        value: z.union([
            z.string(),
            z.array(z.string()),
            z.array(skillGroupSchema),
            z.array(jsonEntrySchema),
        ]),
    }),
});

const profile = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/profile" }),
    schema: z.object({
        name: z.string(),
        role: z.string(),
        blocks: z.array(contentBlockSchema).default([]),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
    schema: orderedEntrySchema,
});

const references = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/references" }),
    schema: orderedEntrySchema,
});

const terminal = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/terminal" }),
    schema: orderedEntrySchema.extend({
        group: z.enum(["education", "experience"]),
    }),
});

export const collections = {
    profile,
    projects,
    references,
    snippets,
    terminal,
};
