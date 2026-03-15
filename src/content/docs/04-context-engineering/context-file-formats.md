---
title: Context file formats
description: The context file formats AI coding agents read — CLAUDE.md, AGENTS.md, rules files, and README as implicit context.
---

Different AI coding agents look for context in different files and locations. Understanding which files your agent reads -- and how it prioritizes them -- is the foundation for effective context engineering. This section covers the primary formats used by OpenCode and Codex, plus implicit context sources that every agent picks up.

## CLAUDE.md

CLAUDE.md is the context file format used by agents built on the Claude model family, including OpenCode when configured with an Anthropic provider. The agent reads CLAUDE.md files automatically at the start of every session.

### How it works

When an agent starts, it searches for CLAUDE.md files at multiple levels:

1. **Global**: `~/.claude/CLAUDE.md` -- applies to all projects on your machine
2. **Project root**: `CLAUDE.md` in the repository root -- applies to everything in this project
3. **Subdirectory**: `CLAUDE.md` in any directory -- applies when working in that directory or its children

The agent reads all applicable files and merges them, with more specific files taking precedence over general ones. You will learn more about this layering in the [context hierarchy](/04-context-engineering/context-hierarchy/) section.

### File structure

CLAUDE.md is a plain Markdown file. There is no required structure or schema -- the agent reads it as free-form instructions. That said, well-organized files are more effective. A typical structure uses headings to group related information:

```markdown
# Project Context

## Stack
- Runtime: Node.js 22
- Framework: Fastify 5
- Database: PostgreSQL 16 with Drizzle ORM
- Testing: Vitest with MSW for API mocking

## Conventions
- Use path aliases: `@/` maps to `src/`
- Prefer named exports over default exports
- Database columns use snake_case, TypeScript uses camelCase
- All API responses follow the shape: `{ data, error, meta }`

## Architecture
- `src/routes/` - Fastify route handlers (one file per resource)
- `src/services/` - Business logic (one service per domain)
- `src/schemas/` - Zod schemas for validation and type generation
- `src/db/` - Drizzle schema definitions and migrations

## Testing
- Test files live next to the code they test: `user.service.ts` -> `user.service.test.ts`
- Use factories for test data: `tests/factories/`
- Integration tests use a test database, not mocks
- Run tests: `npm test`
- Run single file: `npx vitest run src/services/user.service.test.ts`
```

### What makes CLAUDE.md effective

The example above works well because it:

- **States facts, not instructions.** "Database columns use snake_case" is better than "You should always use snake_case for database columns." The agent treats context as background knowledge, not commands.
- **Is scannable.** Short bullet points with clear labels make it easy for both the agent and you to find specific information.
- **Focuses on decisions.** Each line represents a choice your project made that the agent would not know otherwise.
- **Includes commands.** Telling the agent how to run tests, lint, and build means it can verify its own work.

## AGENTS.md

AGENTS.md is the context file format used by Codex and some other cloud-based agents. It serves the same purpose as CLAUDE.md -- persistent project context -- but follows the conventions of the Codex platform.

### How it works

Codex reads AGENTS.md from the repository root when it processes a task. Unlike CLAUDE.md, which supports hierarchical placement in subdirectories, AGENTS.md is typically a single file at the project root. Some agents also support AGENTS.md in subdirectories, but the behavior varies.

### File structure

AGENTS.md follows the same principles as CLAUDE.md. It is a plain Markdown file with no required schema:

```markdown
# Agent Configuration

## Project Overview
This is a Django REST API for a SaaS invoicing platform.
Python 3.12, Django 5.1, PostgreSQL 16, Celery for async tasks.

## Code Style
- Format with Ruff (not Black)
- Type hints on all public functions
- Docstrings use Google style
- Imports sorted by Ruff with isort rules

## Architecture
- `apps/` - Django apps (one per domain: invoices, customers, payments)
- `apps/<name>/services.py` - Business logic lives here, not in views
- `apps/<name>/serializers.py` - DRF serializers for validation
- `libs/` - Shared utilities and base classes

## Testing
- Framework: pytest with pytest-django
- Factories: Factory Boy in `tests/factories/`
- Run all: `pytest`
- Run with coverage: `pytest --cov=apps`

## Important Rules
- Never import from one app into another directly; use the events system
- All database queries go through the ORM; no raw SQL
- Celery tasks must be idempotent
```

### CLAUDE.md vs. AGENTS.md

The two formats are functionally identical -- both are Markdown files containing project context. The key differences are:

| Aspect | CLAUDE.md | AGENTS.md |
|--------|-----------|-----------|
| Used by | Claude-based agents (OpenCode) | Codex and other agents |
| Location | Global, project root, subdirectories | Typically project root |
| Hierarchy support | Multi-level (global > project > directory) | Usually single level |
| File name | `CLAUDE.md` | `AGENTS.md` |
| Content format | Free-form Markdown | Free-form Markdown |

If your team uses both OpenCode and Codex, you have two options:

1. **Maintain both files** with the same content. Simple but creates a duplication problem.
2. **Use one file and symlink the other.** Keep the canonical context in one file and create a symlink so both agents find it:

```bash
# If CLAUDE.md is your canonical file
ln -s CLAUDE.md AGENTS.md

# Or if AGENTS.md is canonical
ln -s AGENTS.md CLAUDE.md
```

The symlink approach keeps a single source of truth while making the context available to both agents.

## Rules files

Some agents support structured rules files in addition to (or instead of) free-form Markdown context. These files use specific formats and locations defined by the agent platform.

### Cursor rules

Cursor (an IDE-integrated agent) reads `.cursor/rules/` files that define project conventions:

```markdown
---
description: Python code style rules for this project
globs: "**/*.py"
---

- Use Ruff for formatting and linting (not Black or Flake8)
- All functions must have type hints
- Use Google-style docstrings
- Prefer pathlib over os.path
```

The `globs` field scopes the rules to specific file types, which is useful when a project spans multiple languages.

### Windsurf rules

Windsurf uses `.windsurfrules` at the project root for similar purposes:

```markdown
# Project Rules

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use Tailwind CSS for styling; no CSS modules
- Test with React Testing Library, not Enzyme
```

### When to use rules files vs. context files

Rules files and context files serve overlapping but distinct purposes:

- **Context files** (CLAUDE.md, AGENTS.md): Broad project context including architecture, stack, commands, and conventions. Read by agents as background knowledge.
- **Rules files** (.cursor/rules/, .windsurfrules): Scoped instructions for specific file types or domains. More prescriptive, often enforcing specific patterns.

If your agent supports both, use context files for project-wide information and rules files for file-type-specific conventions.

## README as implicit context

Your project's README.md is implicit context that many agents read as part of understanding the codebase. Unlike CLAUDE.md or AGENTS.md, the README is not specifically designed for agents, but agents use it as a source of project information.

### What agents extract from README

When an agent reads your README, it picks up:

- **Project description** -- What the project does and its purpose
- **Technology stack** -- Languages, frameworks, and tools mentioned
- **Setup instructions** -- How to install dependencies and configure the environment
- **Build and test commands** -- How to compile, test, and run the project
- **Directory structure** -- If documented, how files are organized

### The README gap

READMEs are written for humans, not agents. This creates gaps:

- READMEs describe what the project *does*. Agents need to know how the project *works internally*.
- READMEs list technologies. Agents need to know which *specific patterns* are used with those technologies.
- READMEs explain how to set up the project. Agents need to know the *conventions for adding new code*.

A good README helps agents get started, but it is not a substitute for a purpose-built context file. The ideal setup has both: a README for human onboarding and a CLAUDE.md/AGENTS.md for agent onboarding.

### Making your README more agent-friendly

If maintaining a separate context file is not practical, you can make your README more useful to agents by adding sections that agents benefit from:

```markdown
## Development conventions

- All new API endpoints go in `src/routes/` with a corresponding test file
- Use the `createService()` factory in `src/lib/service-factory.ts` for new services
- Database migrations are in `src/db/migrations/` -- run with `npm run migrate`
- Lint: `npm run lint` | Format: `npm run format` | Test: `npm test`
```

This information is useful to humans too, which makes a README-based approach viable for smaller projects where maintaining separate context and README files would be overhead.

## Choosing the right format

For most projects, the choice is straightforward:

- **Using OpenCode (Claude-based)?** Use CLAUDE.md.
- **Using Codex?** Use AGENTS.md.
- **Using both?** Maintain one file and symlink the other.
- **Using Cursor or Windsurf?** Add rules files alongside your context file for file-type-specific conventions.
- **Small project, not ready for a dedicated context file?** Enhance your README with a development conventions section.

The format matters less than the content. A well-written CLAUDE.md and a well-written AGENTS.md produce the same improvement in agent output. Focus on writing good context first, then put it in the file your agent reads.
