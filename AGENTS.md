# AGENTS.md

- Single Astro site, not a monorepo. Main entrypoints are `src/pages/*`, `src/layouts/BaseLayout.astro`, `src/components/*`, `src/content/*`, `src/utils/*`, and `src/styles/global.css`.
- Bun is the standard package manager and runtime. Use it from the repo root: `bun install`, `bun dev` (`localhost:4321`), `bun run build`, `bun preview`, `bun astro check`.
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

- `agent-main` is the shared integration branch for agent work.
- Agents must not work directly on `main`.
- Agents may merge `agent-main` into `main` only by creating the merge commit from `agent-main` to `main`.
- When creating the `agent-main` to `main` merge commit, do not review the diff, open or review a PR, run extra checks, or perform any other work for that merge step.
- For each task, work on a dedicated branch whose name begins with `agent-`, for example `agent-project-refactor` or `agent-content-cleanup`.
- Do not use `agent-main` itself as a task branch.
- Create task branches from the latest `origin/agent-main`.
- Commit at sensible checkpoints, including during a larger task when the work is meaningfully split.
- Use descriptive commit messages that explain the actual change.
- Push the task branch at the end of the task.
- Open a pull request from the task branch into `agent-main`.
- Review the PR diff, changed files, relevant checks, documentation updates, and mergeability.
- Document the self-review in the PR description or a PR comment.
- Resolve conflicts or failed checks on the task branch, then squash-merge the PR into `agent-main` once everything is clean.
- Do not ask the user whether committing, pushing, opening the PR, or merging into `agent-main` is allowed; it is expected for agent work.
