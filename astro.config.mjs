// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import markdoc from "@astrojs/markdoc";
import mdx from "@astrojs/mdx";

// bejamas:astro-fonts:start
/** @type {NonNullable<import("astro/config").AstroUserConfig["fonts"]>} */
const BEJAMAS_ASTRO_FONTS = [
  {
    provider: fontProviders.google(),
    name: "Inter",
    cssVariable: "--font-sans",
    subsets: ["latin"],
  },
];
// bejamas:astro-fonts:end

// https://astro.build/config
export default defineConfig({
	fonts: BEJAMAS_ASTRO_FONTS,
    site: "https://www.example.com",

    integrations: [alpinejs(), markdoc(), mdx()],

    vite: {
        plugins: [tailwindcss()],
    },
});
