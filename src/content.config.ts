import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const terminalEntrySchema = z.object({
    title: z.string(),
    command: z.string(),
    order: z.number(),
    body: z.string(),
});

const snippets = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/snippets" }),
    schema: z.object({
        key: z.string(),
        value: z.union([z.string(), z.array(z.string())]),
    }),
});

const profile = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/profile" }),
    schema: z.object({
        name: z.string(),
        role: z.string(),
        education: z.string(),
        interests: z.string(),
        workingStyle: z.string(),
    }),
});

const projects = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
    schema: z.object({
        title: z.string(),
        command: z.string(),
        order: z.number(),
        source: z.string(),
        type: z.string(),
        stack: z.string(),
        summary: z.string(),
    }),
});

const references = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/references" }),
    schema: terminalEntrySchema,
});

const terminal = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/terminal" }),
    schema: terminalEntrySchema.extend({
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
