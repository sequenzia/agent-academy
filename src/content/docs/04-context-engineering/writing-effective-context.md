---
title: Writing effective context files
description: What to include in your context file — architecture, conventions, stack, patterns, testing expectations — and what to leave out.
---

Knowing the file format is the easy part. Writing content that actually improves agent output is where context engineering becomes a skill. This section covers what to include, how to structure it, and the common mistakes that make context files less effective.

## The information hierarchy

Not all context information has equal impact on agent output. Some categories of information produce immediate, measurable improvements. Others are nice-to-have but rarely change the agent's behavior. Prioritize the high-impact categories when writing your context file.

### High impact: include first

These categories directly affect the code an agent generates:

**Technology stack and versions**

The agent needs to know your exact stack to generate compatible code. Package names and versions prevent the agent from using deprecated APIs or incompatible libraries.

```markdown
## Stack
- Language: TypeScript 5.4 (strict mode)
- Runtime: Node.js 22
- Framework: Fastify 5 with @fastify/swagger
- ORM: Drizzle ORM with PostgreSQL driver
- Validation: Zod 3.x
- Testing: Vitest 2.x with MSW 2.x for API mocking
- Formatting: Biome (not Prettier or ESLint)
```

**Coding conventions**

Every project has conventions that differ from the language or framework defaults. These are the decisions the agent gets wrong most often without context.

```markdown
## Conventions
- Named exports only; no default exports
- Path aliases: `@/` maps to `src/`, configured in tsconfig.json
- Barrel exports (`index.ts`) at the module level only, not in subdirectories
- Prefer `type` keyword for type-only imports: `import type { User } from '@/types'`
- Error classes extend `AppError` from `@/lib/errors.ts`
- All async handlers use the `asyncHandler` wrapper from `@/lib/async-handler.ts`
```

**Architecture and directory structure**

Telling the agent where things live and what goes where prevents it from creating files in the wrong location or putting business logic in route handlers.

```markdown
## Architecture
- `src/routes/` - Route handlers grouped by resource (users.ts, invoices.ts)
- `src/services/` - Business logic, one service per domain entity
- `src/repositories/` - Database access, one repository per table
- `src/schemas/` - Zod schemas used for validation and type inference
- `src/types/` - Shared TypeScript types and interfaces
- `src/lib/` - Utility functions and framework wrappers
- `src/db/schema/` - Drizzle table definitions
- `src/db/migrations/` - Database migration files (auto-generated)
```

**Testing patterns**

Agents write tests frequently, and testing conventions vary widely between projects. Without context, the agent defaults to whatever pattern it has seen most often.

```markdown
## Testing
- Framework: Vitest with `describe` / `it` blocks
- Test files live next to source: `user.service.ts` -> `user.service.test.ts`
- Use Factory Boy-style factories in `tests/factories/` for test data
- Integration tests use a test database; reset between tests with `beforeEach`
- Mock external APIs with MSW handlers in `tests/mocks/`
- Run all tests: `npm test`
- Run a single file: `npx vitest run <path>`
- Run with coverage: `npx vitest --coverage`
```

### Medium impact: include when relevant

**Build and development commands**

These help the agent verify its own work and are useful when the agent needs to run checks.

```markdown
## Commands
- Dev server: `npm run dev` (port 3000)
- Build: `npm run build`
- Lint: `npx biome check .`
- Format: `npx biome format --write .`
- Database migrate: `npm run db:migrate`
- Database seed: `npm run db:seed`
```

**Error handling approach**

If your project has a centralized error handling pattern, the agent needs to know about it. Otherwise, it writes try/catch blocks in every handler.

```markdown
## Error handling
- All errors extend `AppError` (src/lib/errors.ts), which includes code, message, and statusCode
- Route handlers pass errors to `next()` for the global error middleware to handle
- Never return raw error objects to clients; the error middleware formats them as `{ error: { code, message } }`
- Validation errors from Zod are caught by the validation middleware, not individual handlers
```

**Naming conventions**

When your naming conventions differ from defaults or when multiple conventions coexist (common in full-stack projects).

```markdown
## Naming
- Files: kebab-case (user-service.ts, not userService.ts)
- Database tables: snake_case plural (user_accounts)
- Database columns: snake_case (created_at)
- TypeScript interfaces: PascalCase (UserAccount)
- TypeScript variables/functions: camelCase (getUserAccount)
- Environment variables: SCREAMING_SNAKE_CASE (DATABASE_URL)
```

### Low impact: include selectively

**Git workflow details** -- The agent rarely creates commits or branches, so git conventions are low priority unless your project has specific commit message formats the agent should follow.

**Deployment information** -- Unless the agent is writing CI/CD configuration or deployment scripts, deployment details are noise.

**Team or organizational information** -- The agent does not need to know who maintains what or which team owns which service.

## Structuring your context file

A well-structured context file is easier for both you and the agent to work with. Follow these principles:

### Lead with the most important information

Agents read context files from top to bottom and may give more weight to information that appears early. Put your stack and conventions at the top, not buried after a project description.

**Good ordering**:
1. Stack/tools
2. Conventions
3. Architecture/directory structure
4. Testing
5. Commands
6. Error handling
7. Other project-specific patterns

### Use consistent formatting

Bullet lists with clear labels are the most effective format. Avoid long paragraphs -- the agent parses structured information more reliably than prose.

```markdown
## Conventions
- Use named exports (not default exports)
- Use path aliases (`@/` for `src/`)
- Database columns use snake_case
```

is more effective than:

```markdown
## Conventions
In this project, we prefer to use named exports rather than default exports
because it makes refactoring easier and provides better IDE support. We also
use path aliases, specifically the `@/` prefix which maps to the `src/`
directory. For database column naming, we follow the snake_case convention.
```

Both convey the same information, but the bulleted version is faster to scan and harder for the agent to misinterpret.

### Be specific and unambiguous

Vague instructions produce vague results. Compare these:

| Vague | Specific |
|-------|----------|
| "Write clean code" | "Max function length: 30 lines; extract helpers for complex logic" |
| "Follow best practices for testing" | "Use vitest with describe/it blocks; one assertion per test; mock external dependencies with MSW" |
| "Use our standard error handling" | "Extend AppError from @/lib/errors.ts; pass errors to next() in route handlers" |
| "Keep things organized" | "New API resources get a file in src/routes/, a service in src/services/, and a schema in src/schemas/" |

The specific versions give the agent enough detail to produce code that matches your expectations.

## Common mistakes

### Too much information

A context file that tries to document everything becomes noise. If your context file exceeds 200-300 lines, the agent may lose focus on the critical information. Keep it to what matters for code generation.

**Signs your context file is too long**:
- It includes detailed API documentation for each endpoint
- It describes business rules for specific features
- It contains historical context about why decisions were made (interesting for humans, irrelevant for agents)
- It duplicates information already in configuration files (tsconfig.json, .eslintrc, etc.)

### Too little information

A context file with just "TypeScript project, use React" is barely better than no context file. The agent already knows general TypeScript and React patterns. Your context file needs to tell it what is *specific to your project*.

### Stale information

A context file that references a testing framework you migrated away from six months ago is worse than no context file -- it actively misleads the agent. Review your context file when you make significant changes to your stack or conventions.

### Instructions that conflict with code

If your context file says "use Prettier" but your package.json has Biome configured, the agent receives conflicting signals. Ensure your context file matches the actual state of the project.

### Telling the agent obvious things

Do not waste context space on things the agent can infer from the code itself:

- "This is a TypeScript project" (the agent can see .ts files)
- "Use import instead of require" (the agent knows this from tsconfig.json)
- "Indent with 2 spaces" (the agent reads your formatter config)

Focus on what the agent *cannot* infer.

## A complete example

Here is a complete context file for a mid-size TypeScript API project, demonstrating the principles covered in this section:

```markdown
# Project Context

## Stack
- TypeScript 5.4 (strict mode enabled)
- Node.js 22 LTS
- Fastify 5 with @fastify/swagger for API docs
- Drizzle ORM with PostgreSQL 16
- Zod for request/response validation
- Vitest with MSW for testing
- Biome for formatting and linting

## Conventions
- Named exports only; no default exports
- Path aliases: `@/` maps to `src/`
- Barrel exports at module level only (src/services/index.ts), not in subdirectories
- Prefer `import type` for type-only imports
- Max function length: 30 lines; extract helpers for complex logic
- All async route handlers wrapped with `asyncHandler()` from `@/lib/async-handler`

## Architecture
- `src/routes/` - Fastify route handlers, one file per resource
- `src/services/` - Business logic, one service per domain entity
- `src/repositories/` - Database queries, one repository per table
- `src/schemas/` - Zod schemas for request validation and response types
- `src/types/` - Shared TypeScript types and interfaces
- `src/lib/` - Framework utilities, error classes, middleware
- `src/db/schema/` - Drizzle table definitions
- `src/db/migrations/` - Auto-generated migration files (do not edit by hand)

## Testing
- Test files next to source: `user.service.ts` -> `user.service.test.ts`
- Use `describe` / `it` blocks; one assertion per `it` block
- Factories in `tests/factories/` for test data generation
- Integration tests use test database; reset with `beforeEach` hook
- External API calls mocked with MSW handlers in `tests/mocks/`
- Run: `npm test` | Single file: `npx vitest run <path>` | Coverage: `npx vitest --coverage`

## Error Handling
- Custom errors extend `AppError` from `@/lib/errors.ts`
- Route handlers pass errors to `next()` for global error middleware
- Client responses shaped as `{ data, error: { code, message }, meta }`
- Validation errors handled automatically by Zod middleware

## Naming
- Files: kebab-case (user-service.ts)
- DB tables: snake_case plural (user_accounts)
- DB columns: snake_case (created_at)
- TS interfaces: PascalCase (UserAccount)
- TS variables/functions: camelCase (getUserAccount)
- Env vars: SCREAMING_SNAKE_CASE (DATABASE_URL)

## Commands
- Dev: `npm run dev` (port 3000, hot reload)
- Build: `npm run build`
- Lint: `npx biome check .`
- Format: `npx biome format --write .`
- Migrate: `npm run db:migrate`
- Seed: `npm run db:seed`
```

This file is approximately 50 lines, covers all high-impact categories, and gives the agent enough information to produce code that fits the project. It avoids long prose, stays specific, and documents only what the agent cannot infer from the codebase.
