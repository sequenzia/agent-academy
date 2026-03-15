# Agent Academy

An Astro Starlight documentation site teaching developers how to use AI coding agents (OpenCode and Codex).

## Tech Stack

- **Framework**: Astro Starlight (Astro v6, Starlight v0.38.1)
- **Package manager**: npm
- **TypeScript**: Strict mode
- **Diagrams**: `astro-mermaid` + `mermaid` (client-side rendering with theme support)
- **Deployment**: GitLab Pages via `.gitlab-ci.yml`

## Commands

- `npm run dev` — Dev server on port 4321
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build

## Project Structure

- `src/content/docs/` — Documentation content (Markdown/MDX)
- `src/content/docs/index.mdx` — Homepage (splash template with LinkCards)
- `src/content/docs/01-introduction/` through `08-security/` — 8 module directories
- `astro.config.mjs` — Starlight config (sidebar, social, site metadata)
- `docs/content-style-guide.md` — Content style guide (tone, terminology, diagrams)
- `docs/module-content-template.md` — Standardized module template
- `internal/specs/agent-academy-SPEC.md` — Project specification

## Content Conventions

- Sentence case for all headings
- Kebab-case for file names
- Module directories use numbered prefix: `01-introduction/`, `02-setup/`, etc.
- Sidebar uses explicit `items` arrays with `slug` references (not `autogenerate`)
- Multi-page modules: overview (intro, learning outcomes, prerequisites) + content pages + final page (exercises, takeaways, next steps)
- Agent-specific content uses h3 subsections (OpenCode/Codex) under shared h2 parent
- Cross-module links use absolute paths: `/02-setup/overview/`
- Mermaid diagrams: fenced ```mermaid blocks, alt text as italic text below, standard classDef palette with `color:#000`
- Callouts: `:::note`, `:::tip`, `:::caution`
- Use `text` instead of `gitignore` as code block language tag (Expressive Code limitation)

## Terminology

Use "AI coding agent" (not "AI assistant" or "copilot"), "terminal-based agent" (not "local agent" or "CLI agent"), "cloud-based agent" (not "hosted agent" or "remote agent"). Full glossary in spec Section 13.1.

## Integration Notes

- `astro-mermaid` must be **first** in the `integrations` array (before Starlight) so its script injection runs before Starlight processes content
- `.npmrc` sets `legacy-peer-deps=true` — needed because `astro-mermaid` declares `astro: ^4 || ^5` peer dep but we use Astro 6 (temporary, until upstream adds Astro 6 support)

## Known Build Warnings

- Vite warning about unused imports in a dependency (harmless)
- Sitemap warning about missing `site` config (optional)
