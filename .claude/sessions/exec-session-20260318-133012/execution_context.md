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
- Overview page pattern: frontmatter (title, description, sidebar order 0, label "Overview"), intro paragraphs, "What you will learn", "Prerequisites", hr, "Module structure" with numbered links, hr, "Key takeaways", "Next steps"
- Content page pattern for Module 9: frontmatter (title, description, sidebar order, sidebar label), intro paragraphs, h2 topic sections, key takeaways, next steps
- Sidebar slug-only items: Starlight derives labels from page frontmatter automatically
- `node --check astro.config.mjs` can verify JS syntax without needing full import resolution

## Key Decisions
- Style guide placed at `docs/content-style-guide.md` (project-internal documentation directory)
- Module template at `docs/module-content-template.md`
- Standard exercise format: Objective, Prerequisites, Steps, Verification, Stretch goal (optional)
- Mermaid color palette: 6 classDef classes (primary, secondary, success, neutral, warning, danger)
- GitLab Pages deploy job named `pages` with `needs` directive for build validation gate
- Cache key uses `${CI_COMMIT_REF_SLUG}` for per-branch caching
- Conceptual modules use prose + diagrams + tables; exercises are reflective
- Hands-on modules use step-by-step procedures with verification after each section
- SDD module (Module 9) is tool-agnostic per spec requirements; uses generic SDD terminology
- Quality Analysis phase explicitly marked as optional (P1 feature) via :::note callout
- Good/bad spec examples use comparison tables across multiple project types (API, UI, data pipeline)

## Known Issues
- Build produces a vite warning about unused imports in a dependency (harmless) and a sitemap warning about missing `site` config (optional)
- `gitignore` language tag causes build warning; use `text` instead

## File Map
- `astro.config.mjs` - Main Astro/Starlight configuration (title, description, sidebar with 9 modules, social)
- `package.json` - Project dependencies and npm scripts
- `tsconfig.json` - TypeScript configuration
- `src/content.config.ts` - Content collection schema definition
- `src/content/docs/` - Documentation content directory (Markdown/MDX files)
- `src/content/docs/index.mdx` - Homepage with module overview cards and hero section
- `src/content/docs/01-introduction/` - Module 1 (5 files)
- `src/content/docs/02-setup/` - Module 2 (4 files)
- `src/content/docs/03-prompt-engineering/` - Module 3 (5 files)
- `src/content/docs/04-context-engineering/` - Module 4 (6 files)
- `src/content/docs/05-agent-skills/` - Module 5 (6 files)
- `src/content/docs/06-mcp-servers/` - Module 6 (6 placeholder files)
- `src/content/docs/07-subagents/` - Module 7 (5 placeholder files)
- `src/content/docs/08-security/` - Module 8 (6 placeholder files)
- `src/content/docs/09-spec-driven-development/overview.md` - Module 9 overview
- `src/content/docs/09-spec-driven-development/the-sdd-methodology.md` - Module 9 Page 1: 4-phase pipeline, core principles, when to use SDD (2 Mermaid diagrams)
- `src/content/docs/09-spec-driven-development/writing-specifications.md` - Module 9 Page 2: spec anatomy, requirements, testable criteria, depth levels, quality analysis (2 Mermaid diagrams)
- `src/content/docs/09-spec-driven-development/task-decomposition.md` - Module 9 Page 3: decomposition patterns, DAG dependencies, granularity, acceptance criteria categories (2 Mermaid diagrams)
- `src/content/docs/09-spec-driven-development/execution-and-verification.md` - Module 9 Page 4: subagent model, context sharing, wave parallelism, agent workflow, verification, failure handling (5 Mermaid diagrams)
- `src/content/docs/09-spec-driven-development/practical-exercises.md` - Module 9 Page 5: Three exercises (spec writing, full pipeline, comparative), key takeaways, next steps
- `docs/content-style-guide.md` - Content style guide
- `docs/module-content-template.md` - Standardized module content template
- `.gitlab-ci.yml` - GitLab CI/CD pipeline configuration
- `internal/specs/agent-academy-SPEC.md` - Project specification

## Task History
### Prior Sessions Summary
Tasks 1-11 all PASS across prior sessions. Scaffolded Astro Starlight project, created style guide and module template, configured 8-module sidebar with 42 placeholder files, set up GitLab CI/CD pipeline. Wrote full content for Modules 1-5 (introduction, setup, prompt engineering, context engineering, agent skills). Key learnings: Mermaid diagrams render correctly, `gitignore` lang tag not supported (use `text`), callout syntax works, hybrid module pattern effective for conceptual+practical content.

### Task [23]: Create module directory and write overview page - PASS
- Files modified: `src/content/docs/09-spec-driven-development/overview.md` (created)
- Key learnings: Module 9 directory created, overview page follows established pattern, build succeeds (46 pages)
- Issues encountered: None

### Task [24]: Write the SDD methodology page - PASS
- Files modified: `src/content/docs/09-spec-driven-development/the-sdd-methodology.md` (created)
- Key learnings: Two Mermaid diagrams (LR pipeline flow, TB wave execution), Quality Analysis marked optional, 5 core principles covered, tool-agnostic throughout
- Issues encountered: None

### Task [25]: Write the writing specifications page - PASS
- Files modified: `src/content/docs/09-spec-driven-development/writing-specifications.md` (created)
- Key learnings: Two Mermaid diagrams (spec depth decision, quality analysis pipeline), good/bad examples across multiple project types, quality analysis presented as optional
- Issues encountered: None

### Task [26]: Write the task decomposition page - PASS
- Files modified: `src/content/docs/09-spec-driven-development/task-decomposition.md` (created)
- Key learnings: Two Mermaid diagrams (decomposition patterns, dependency DAG), generic notification feature examples, references spec depth levels conceptually
- Issues encountered: None

### Task [27]: Write the execution and verification page - PASS
- Files modified: `src/content/docs/09-spec-driven-development/execution-and-verification.md` (created)
- Key learnings: 5 Mermaid diagrams (orchestrator delegation, context sharing, wave execution, agent workflow, failure/retry), fully tool-agnostic, all 6 content sections covered
- Issues encountered: None

### Task [29]: Add Module 9 sidebar configuration - PASS
- Files modified: `astro.config.mjs` (added Module 9 sidebar group)
- Key learnings: Sidebar now has 9 module groups, slug-only items work (Starlight derives labels from frontmatter), `collapsed: true` matches existing pattern
- Issues encountered: None

### Task [28]: Write the practical exercises page - PASS
- Files modified: `src/content/docs/09-spec-driven-development/practical-exercises.md` (created)
- Key learnings: Exercise format follows style guide pattern (Objective, Prerequisites, Steps, Verification, Stretch goal). Three exercises: notification preferences (spec writing), markdown link checker (full pipeline), config file validator (comparative). Comparative includes 6-criteria rubric. Build succeeds with 51 pages.
- Issues encountered: None

### Task [30]: Add Module 9 to homepage and update cross-references - PASS
- Files modified: `src/content/docs/index.mdx` (Module 9 LinkCard, "eight" → "nine" in 3 places), `src/content/docs/08-security/operational-safety.md` (added Module 9 reference in next steps)
- Key learnings: Homepage had 3 "eight-module" references to update. Module 8 final page is `operational-safety.md`. LinkCard pattern: single-line JSX. Cross-references use absolute paths with trailing slash.
- Issues encountered: None
