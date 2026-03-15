# Agent Academy

A free, eight-module curriculum that teaches developers how to work effectively with AI coding agents — from fundamentals through advanced workflows.

Built with [Astro Starlight](https://starlight.astro.build/).

## Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | **Introduction** | What AI coding agents are, how they work, and how they differ from chat assistants and autocomplete tools |
| 2 | **Environment setup** | Get OpenCode and Codex installed, configured, and verified |
| 3 | **Prompt engineering** | Structured prompts that produce predictable, high-quality results |
| 4 | **Context engineering** | Project-level context so your agent matches your standards without repeated instructions |
| 5 | **Agent skills** | Use and create reusable skill modules that extend agent capabilities |
| 6 | **MCP servers** | Connect agents to external tools, services, and data via the Model Context Protocol |
| 7 | **Subagents** | Delegate complex work to subagents and learn when delegation helps |
| 8 | **Security** | Identify and mitigate security risks to protect your codebase and credentials |

## Getting started

**Prerequisites:** Node.js 18+, npm

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The site will be available at `http://localhost:4321`.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 4321 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Project structure

```
src/content/docs/
├── index.mdx                  # Homepage
├── 01-introduction/           # Module 1 (5 pages)
├── 02-setup/                  # Module 2 (4 pages)
├── 03-prompt-engineering/     # Module 3 (5 pages)
├── 04-context-engineering/    # Module 4 (6 pages)
├── 05-agent-skills/           # Module 5 (6 pages)
├── 06-mcp-servers/            # Module 6 (6 pages)
├── 07-subagents/              # Module 7 (5 pages)
└── 08-security/               # Module 8 (6 pages)
```

Supporting files:

- `astro.config.mjs` — Starlight configuration (sidebar, metadata)
- `docs/content-style-guide.md` — Content style guide
- `docs/module-content-template.md` — Standardized module template
- `.gitlab-ci.yml` — CI/CD pipeline for GitLab Pages deployment

## Deployment

The site deploys automatically to GitLab Pages via the CI/CD pipeline on push to `main`. The pipeline runs `npm ci` and `npm run build`, then publishes the `dist/` output.

## Contributing

Each module follows a consistent multi-page structure:

- **Overview page** — Introduction, learning outcomes, prerequisites
- **Content pages** — Topic coverage with diagrams, code examples, and agent-specific guidance
- **Final page** — Exercises, key takeaways, next steps

See `docs/content-style-guide.md` for tone, terminology, and formatting conventions.
