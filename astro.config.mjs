// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
    site: "https://valentindibbern.github.io",

    integrations: [alpinejs()],

    vite: {
        plugins: [tailwindcss()],
    },
});
