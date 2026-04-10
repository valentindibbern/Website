// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    site: "https://www.example.com",

    integrations: [alpinejs(), markdoc(), mdx()],

    vite: {
        plugins: [tailwindcss()],
    },
});
