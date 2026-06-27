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
- Keep `README.md` as the human entry point and `docs/public/*` as the public deeper reference layer.
- `docs/private/` is a private Git submodule for sensitive notes, concrete plans, research, and risk analysis.
- This repository is public; never add secrets, private data, or internal-only notes to README or `docs/public/*`.
- Do not move private documentation into `docs/public/`; public docs must stay safe for the public repository.
- Agent-facing documentation must be safe to read publicly and framed as project conventions, not private process notes.

## Git Rules

- Work on a dedicated agent branch whose name begins with `agent`, for example `agent-main`, `agent-project-refactor`, or `agent-content-cleanup`.
- Agent branches are independent working branches for agents; they do not need to mirror project branches or the rest of the project branch structure.
- If the chosen agent branch does not exist, create it before making changes.
- Commit at sensible checkpoints, including during a larger task when the work is meaningfully split.
- Use descriptive commit messages that explain the actual change.
- Commit again at the end of a task before finishing work.
- Do not ask the user whether committing to the current agent branch is allowed; it is expected for project work.
- Push the current agent branch at the end of a task.
- Do not ask the user whether pushing the current agent branch is allowed; it is expected at task completion.
- Never merge branches.
