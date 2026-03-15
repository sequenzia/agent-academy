---
title: Practical workshop
description: Audit a real project, write a context file from scratch, compare before/after agent output, and use starter templates.
---

This section walks you through the process of creating a context file for a real project. You will audit your codebase to identify what the agent needs to know, write a context file based on the audit, and compare agent output before and after adding the file. The section also includes starter templates you can copy and adapt for common project types.

---

## Practical exercises

### Exercise: Audit a project and write a context file

**Objective**: Create a context file for one of your existing projects by systematically auditing its conventions and architecture.

**Prerequisites**: A project you are actively working on, with an AI coding agent installed and configured.

**Steps**:

1. **Identify your project's technology choices.** Open your project and answer these questions (write the answers down -- they become your context file):

   - What language and version?
   - What framework and version?
   - What database, ORM, or data layer?
   - What test framework and patterns?
   - What formatter and linter?
   - What package manager?

2. **Document your directory structure.** Look at your top-level directories and describe what goes where. Focus on the directories where new code gets added most often:

   ```bash
   # List top-level directories to start your audit
   ls -d */
   ```

   For each important directory, write a one-line description of its purpose and what kind of files it contains.

3. **Identify conventions that differ from defaults.** This is the most important step. Look for decisions your project has made that an agent would not guess:

   - File naming patterns (kebab-case? PascalCase? Flat or nested?)
   - Import style (relative? Path aliases? Barrel exports?)
   - Error handling approach (centralized? Per-handler? Custom error classes?)
   - Test file locations (co-located? Separate test directory?)
   - Naming conventions for variables, functions, database columns

   A quick way to spot conventions: look at your three most recent pull requests. What patterns do you see repeated across them?

4. **Gather your build and test commands.** List every command a developer runs regularly:

   ```bash
   # Check your package.json scripts (Node.js projects)
   cat package.json | grep -A 20 '"scripts"'

   # Or check your Makefile, pyproject.toml, Justfile, etc.
   ```

5. **Assemble the context file.** Create a `CLAUDE.md` (or `AGENTS.md`) at your project root with the information from steps 1-4:

   ```bash
   touch CLAUDE.md
   ```

   Use the structure from the [writing effective context files](/04-context-engineering/writing-effective-context/) section: stack first, then conventions, architecture, testing, and commands.

6. **Test the context file.** Pick a task you need to do in your project -- something substantial like adding a new endpoint, creating a utility function, or writing tests for an existing module. Ask your agent to do it twice:

   - First, rename or move your context file temporarily so the agent does not read it
   - Run the task and save the output
   - Restore the context file
   - Run the same task again and compare the output

**Verification**: Compare the two outputs. Look for differences in:
- Framework and library choices (did the agent use the right testing framework? The right ORM?)
- File placement (did the agent put files in the right directories?)
- Naming conventions (do variable names, file names, and database columns match your patterns?)
- Error handling (did the agent follow your error handling approach?)
- Code style (formatting, import ordering, export style)

**Stretch goal**: After comparing, identify any gaps in your context file -- conventions the agent still got wrong. Add them to the file and test again.

---

### Exercise: Improve agent output with targeted context

**Objective**: Identify a specific pattern the agent consistently gets wrong and fix it by adding targeted context.

**Prerequisites**: A context file from the previous exercise (or an existing one), and an example of agent output that did not match your expectations.

**Steps**:

1. **Find a recurring correction.** Think about the last few times you used your agent. What did you correct most often? Common examples:
   - Wrong test framework or test structure
   - Wrong import style
   - Wrong error handling pattern
   - Files created in the wrong directory
   - Wrong naming convention

2. **Write a specific context entry.** Add a line to your context file that addresses the exact issue. Be specific:

   ```markdown
   ## Testing
   - Use Vitest (NOT Jest) with `describe` / `it` blocks
   - Test files are co-located: `user.service.ts` -> `user.service.test.ts`
   - Use `vi.mock()` for module mocking, not `jest.mock()`
   ```

   Notice the explicit "NOT Jest" -- when the agent has a strong default, calling out what *not* to do can be as important as specifying what to do.

3. **Test the fix.** Ask the agent to perform a task that would trigger the old incorrect behavior. Verify it now follows the updated context.

**Verification**: The agent's output should match the convention you specified. If it does not, check whether your context entry is specific enough or whether it conflicts with other information in the file.

---

## Starter templates

These templates provide a starting point for common project types. Copy the one that matches your stack, fill in the specifics, and remove sections that do not apply.

### TypeScript API template

```markdown
# Project Context

## Stack
- TypeScript <version> (strict mode)
- Runtime: Node.js <version>
- Framework: <Express/Fastify/Hono> <version>
- Database: <PostgreSQL/MySQL/SQLite> with <Drizzle/Prisma/TypeORM>
- Validation: <Zod/Joi/Valibot>
- Testing: <Vitest/Jest> with <MSW/nock> for API mocking
- Formatting: <Biome/Prettier + ESLint>

## Conventions
- <Named exports / Default exports>
- Path aliases: `@/` maps to `src/`
- Import ordering: <external, internal, types>
- Error classes extend `<YourBaseError>` from `<path>`
- <Other project-specific conventions>

## Architecture
- `src/routes/` - HTTP handlers
- `src/services/` - Business logic
- `src/repositories/` - Data access
- `src/schemas/` - Validation schemas
- `src/types/` - Shared types
- `src/lib/` - Utilities and framework wrappers

## Testing
- Test files: <co-located / separate tests/ directory>
- Pattern: `describe` / `it` blocks
- Factories: <location>
- Mocking: <approach>
- Run: `npm test`

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `<lint command>`
- Format: `<format command>`
```

### Python API template

```markdown
# Project Context

## Stack
- Python <version>
- Framework: <Django/FastAPI/Flask> <version>
- Database: PostgreSQL <version> with <Django ORM/SQLAlchemy/Tortoise>
- Task queue: <Celery/Dramatiq/None>
- Testing: pytest with <Factory Boy/Faker>
- Formatting: Ruff
- Package manager: <uv/pip/Poetry>

## Conventions
- Type hints on all public functions
- Docstrings: <Google/NumPy/Sphinx> style
- Imports sorted by Ruff
- <Other conventions>

## Architecture
- `<app_dir>/` - Application code
- `<app_dir>/services/` - Business logic
- `<app_dir>/models/` - Database models
- `<app_dir>/serializers/` or `<app_dir>/schemas/` - Request/response validation
- `tests/` - Test files mirroring app structure

## Testing
- Framework: pytest
- Factories: Factory Boy in `tests/factories/`
- Fixtures: conftest.py at test root and per-directory
- Run: `pytest`
- Single file: `pytest <path>`
- Coverage: `pytest --cov=<package>`

## Commands
- Dev: `<dev command>`
- Lint: `ruff check .`
- Format: `ruff format .`
- Migrate: `<migration command>`
- Type check: `<mypy/pyright command>`
```

### React/frontend template

```markdown
# Project Context

## Stack
- TypeScript <version>
- React <version> with <Next.js/Remix/Vite>
- Styling: <Tailwind CSS/CSS Modules/Styled Components>
- State: <Zustand/Redux Toolkit/Jotai/React Query>
- Testing: <Vitest/Jest> with React Testing Library
- Formatting: <Biome/Prettier + ESLint>

## Conventions
- Functional components only (no class components)
- Custom hooks in `hooks/` with `use` prefix
- Component files use PascalCase: `UserProfile.tsx`
- Utility files use kebab-case: `format-date.ts`
- Prefer composition over prop drilling
- <Other conventions>

## Architecture
- `src/components/` - Reusable UI components
- `src/pages/` or `src/app/` - Page/route components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions
- `src/types/` - TypeScript types and interfaces
- `src/api/` - API client functions
- `src/stores/` - State management

## Testing
- Component tests: React Testing Library (test behavior, not implementation)
- Hook tests: `renderHook` from React Testing Library
- Co-located: `Button.tsx` -> `Button.test.tsx`
- Run: `npm test`

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `<lint command>`
- Type check: `npx tsc --noEmit`
```

### Monorepo template

```markdown
# Project Context

## Stack
- Monorepo managed by <Turborepo/Nx/pnpm workspaces>
- Shared TypeScript config at root
- Package manager: <pnpm/npm/yarn>

## Conventions
- Each package is self-contained with its own tsconfig.json
- Shared code goes in `packages/shared/`
- Inter-package imports use package names, not relative paths
- Each package has its own test setup

## Structure
- `packages/api/` - Backend API (<framework>)
- `packages/web/` - Frontend app (<framework>)
- `packages/shared/` - Shared types, utilities, constants
- `packages/<other>/` - <Description>

## Per-Package Context
- See `packages/api/CLAUDE.md` for API-specific conventions
- See `packages/web/CLAUDE.md` for frontend-specific conventions

## Commands
- Install: `<package manager> install`
- Dev (all): `<package manager> run dev`
- Dev (specific): `<package manager> run dev --filter=<package>`
- Build: `<package manager> run build`
- Test: `<package manager> run test`
```

### Minimal starter template

For small projects or when you want to start simple and add detail over time:

```markdown
# Project Context

## Stack
- <Language> <version>
- <Framework> <version>
- <Database/data layer> (if applicable)
- Testing: <framework>
- Formatting: <tool>

## Conventions
- <Your most important convention>
- <Your second most important convention>
- <Your third most important convention>

## Architecture
- <Main source directory and its purpose>
- <Test directory and its purpose>

## Commands
- Dev: `<command>`
- Test: `<command>`
- Lint: `<command>`
```

Start with the minimal template and expand it as you discover what the agent gets wrong. Every correction you make is a candidate for a new line in your context file.

---

## Key takeaways

- Auditing your project before writing a context file ensures you capture what actually matters, not what you think matters
- Before/after comparison is the most effective way to validate your context file -- run the same task with and without context
- Templates provide structure, but the specific content must come from your project's actual conventions
- Start minimal and grow your context file based on observed agent errors -- each correction you make is a missing context entry
- Context files should be version-controlled, reviewed during convention changes, and treated as living documents

## Next steps

- **Next module**: [Agent skills](/05-agent-skills/overview/) -- Learn how to use and create reusable skills that extend your agent's capabilities beyond what context files alone provide.
- **Related**: [Prompt engineering for coding agents](/03-prompt-engineering/overview/) -- Context files and prompts work together; good prompts combined with good context produce the best results.
