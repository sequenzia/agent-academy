# Execution Context

## Project Patterns
- Package manager: npm (as specified by spec)
- Framework: Astro Starlight (Astro v6, Starlight v0.38.1)
- Content directory: `src/content/docs/`
- Config file: `astro.config.mjs`
- TypeScript: Strict mode via `tsconfig.json`
- Build command: `npm run build`
- Dev command: `npm run dev` (port 4321)
- Pagefind search is built-in and runs automatically during build
- Sentence case for headings across all modules
- Kebab-case for all content file names
- Module content directories use numbered prefix pattern: `01-introduction/`, `02-setup/`, etc.
- Sidebar configuration uses explicit `items` arrays with `slug` references (not `autogenerate`) for precise control
- Each module sidebar group uses `collapsed: true` for expandable behavior
- Module sidebar labels follow pattern: "Module N: Short Name"
- Starlight frontmatter supports: `title`, `description`, `sidebar.order`, `sidebar.label`, `template`, `hero`, `draft`, `pagefind`, `prev`, `next`, etc.
- Module ordering via `sidebar.order` (numeric) and `sidebar.label` for display
- Agent-specific content uses h3 subsections (OpenCode/Codex) under shared h2 parent
- CI uses `npm ci` for reproducible installs; Astro builds to `dist/`, then `mv dist public` for GitLab Pages
- Mermaid diagrams render with fenced ```mermaid blocks; alt text as italic text below
- Cross-module links use absolute paths like `/02-setup/overview/`
- Multi-page modules: learning outcomes/prerequisites in overview page, exercises/takeaways/next-steps in final page
- Starlight callout syntax: `:::note`, `:::tip`, `:::caution`
- Use `text` instead of `gitignore` as language tag (Expressive Code limitation)

## Key Decisions
- Style guide placed at `docs/content-style-guide.md` (project-internal documentation directory)
- Module template at `docs/module-content-template.md`
- Standard exercise format: Objective, Prerequisites, Steps, Verification, Stretch goal (optional)
- Mermaid color palette: 6 classDef classes (primary, secondary, success, neutral, warning, danger)
- GitLab Pages deploy job named `pages` with `needs` directive for build validation gate
- Cache key uses `${CI_COMMIT_REF_SLUG}` for per-branch caching
- Conceptual modules use prose + diagrams + tables; exercises are reflective
- Hands-on modules use step-by-step procedures with verification after each section

## Known Issues
- Build produces a vite warning about unused imports in a dependency (harmless) and a sitemap warning about missing `site` config (optional)
- `gitignore` language tag causes build warning; use `text` instead

## File Map
- `astro.config.mjs` - Main Astro/Starlight configuration (title, description, sidebar with 8 modules, social)
- `package.json` - Project dependencies and npm scripts
- `tsconfig.json` - TypeScript configuration
- `src/content.config.ts` - Content collection schema definition
- `src/content/docs/` - Documentation content directory (Markdown/MDX files)
- `src/content/docs/index.mdx` - Homepage with module overview cards and hero section
- `src/content/docs/01-introduction/` - Module 1 (5 files: overview, agent-loop, agent-categories, when-to-use-agents, mental-model-shift)
- `src/content/docs/02-setup/` - Module 2 (4 files: overview, opencode-setup, codex-setup, environment-essentials)
- `src/content/docs/03-prompt-engineering/` - Module 3 (5 files: overview, fundamentals, practical-techniques, common-pitfalls, agent-specific-prompting)
- `src/content/docs/04-context-engineering/` - Module 4 (6 files: overview, what-is-context-engineering, context-file-formats, writing-effective-context, context-hierarchy, practical-workshop)
- `src/content/docs/05-agent-skills/` - Module 5 (6 files: overview, what-are-skills, skill-anatomy, using-existing-skills, creating-custom-skills, design-patterns)
- `src/content/docs/06-mcp-servers/` - Module 6 (6 placeholder files)
- `src/content/docs/07-subagents/` - Module 7 (5 placeholder files)
- `src/content/docs/08-security/` - Module 8 (6 placeholder files)
- `docs/content-style-guide.md` - Content style guide
- `docs/module-content-template.md` - Standardized module content template
- `.gitlab-ci.yml` - GitLab CI/CD pipeline configuration (build + deploy to GitLab Pages)
- `internal/specs/agent-academy-SPEC.md` - Project specification

## Task History
### Prior Waves Summary (Waves 1-2)
Tasks 1, 3, 4, 2, 7 all PASS. Scaffolded Astro Starlight project, created style guide and module template, configured 8-module sidebar with 42 placeholder files, set up GitLab CI/CD pipeline.

### Task [6]: Write Module 1: Introduction to AI Coding Agents - PASS
- Files modified: 5 files in `src/content/docs/01-introduction/`
- Key learnings: Mermaid diagrams render correctly, alt text as italic below, cross-module links use absolute paths
- Issues encountered: None

### Task [8]: Write Module 2: Setting Up Your Agent Environment - PASS
- Files modified: 4 files in `src/content/docs/02-setup/`
- Key learnings: `gitignore` lang tag not supported (use `text`), callout syntax works (:::note, :::tip, :::caution)
- Issues encountered: gitignore language tag build warning (resolved)

### Task [9]: Write Module 3: Prompt Engineering for Coding Agents - PASS
- Files modified: 5 files in `src/content/docs/03-prompt-engineering/`
- Key learnings: Hybrid module pattern (conceptual + practical), exercises in final page
- Issues encountered: None

### Task [10]: Write Module 4: Context Engineering - PASS
- Files modified: 6 files in `src/content/docs/04-context-engineering/`
- Key learnings: 5 starter templates included in practical workshop, context hierarchy visualization with Mermaid
- Issues encountered: None

### Task [11]: Write Module 5: Agent Skills - PASS
- Files modified: 6 files in `src/content/docs/05-agent-skills/`
- Key learnings: Real-world examples more effective than abstract descriptions, skills vs MCP distinction addressed
- Issues encountered: None
