# AGENTS.md

- Single Astro site, not a monorepo. Main entrypoints are `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, `src/components/*`, and `src/styles/global.css`.
- Use Bun from the repo root: `bun install`, `bun dev` (`localhost:4321`), `bun build`, `bun preview`, `bun astro check`.
- Astro config enables Alpine, Markdoc, and MDX; Tailwind v4 is wired through `@tailwindcss/vite` in `astro.config.mjs`.
- DaisyUI is enabled in `src/styles/global.css` via `@plugin "daisyui"`.
- TypeScript path aliases resolve `~/*` and `@/*` to `src/*`; also use `@components/*`, `@layouts/*`, `@/pages/*`, and `@/styles/*`.
- Treat `package.json`, `astro.config.mjs`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.mjs`, and `bun.lock` as the source of truth.
- Do not edit generated or ignored paths: `dist/`, `.astro/`, `node_modules/`.
