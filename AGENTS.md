# AGENTS.md

- Single Astro site, not a monorepo. Main entrypoints are `src/pages/*`, `src/layouts/BaseLayout.astro`, `src/components/*`, `src/content/*`, `src/utils/*`, and `src/styles/global.css`.
- Use Bun from the repo root: `bun install`, `bun dev` (`localhost:4321`), `bun build`, `bun preview`, `bun astro check`.
- Astro config enables Alpine; Tailwind v4 is wired through `@tailwindcss/vite` in `astro.config.mjs`.
- Styling is centralized in `src/styles/global.css`; do not assume DaisyUI unless it is reintroduced in `package.json` and the CSS entrypoint.
- TypeScript path aliases resolve `~/*` and `@/*` to `src/*`; also use `@components/*`, `@layouts/*`, `@/pages/*`, and `@/styles/*`.
- Treat `package.json`, `astro.config.mjs`, `tsconfig.json`, `eslint.config.js`, `.prettierrc.mjs`, and `bun.lock` as the source of truth.
- Do not edit generated or ignored paths: `dist/`, `.astro/`, `node_modules/`.

## Documentation Rules

- Every project change must be reflected in documentation.
- Update the existing docs whenever behavior, structure, commands, conventions, or content sources change.
- New project parts must be described in the style of the existing documentation: short, practical, and role-based.
- Keep `README.md` as the human entry point and `docs/*` as the deeper reference layer.

## Git Rules

- Work on the separate branch `agent-changes`.
- If `agent-changes` does not exist, create it before making changes.
- Commit at sensible checkpoints, including during a larger task when the work is meaningfully split.
- Use descriptive commit messages that explain the actual change.
- Commit again at the end of a task before finishing work.
- Push the branch at the end of a task.
- Never merge branches.
