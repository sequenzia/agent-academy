---
title: Skill anatomy
description: The structure of an agent skill including SKILL.md, trigger descriptions, input/output contracts, and supporting files.
sidebar:
  order: 2
  label: Skill anatomy
---

Every skill follows a consistent structure that makes it readable by both humans and AI coding agents. Understanding this structure is essential whether you are using an existing skill or building your own. This section breaks down each component of a skill and explains what it does.

## The skill directory

A skill lives in its own directory, typically nested inside a skills folder in your project or agent configuration. Here is the structure of a typical skill:

```text
skills/
  generate-api-endpoint/
    SKILL.md            # The skill manifest and instructions
    templates/
      route.ts.hbs      # Template file for route handler
      schema.ts.hbs     # Template file for validation schema
      test.ts.hbs       # Template file for tests
    examples/
      sample-output.md  # Example of what the skill produces
```

The only required file is `SKILL.md`. Everything else -- templates, examples, reference materials -- is optional and depends on what the skill needs.

## SKILL.md: the skill manifest

`SKILL.md` is the core of every skill. It serves as both the human-readable documentation and the machine-readable instruction set. When an agent discovers a skill, it reads `SKILL.md` to understand what the skill does, when to use it, what inputs it needs, and how to execute it.

Here is a complete `SKILL.md` for a skill that generates database migration files:

```markdown
# Generate Database Migration

Create a new database migration file following project conventions.

## Trigger

Invoke this skill when the user asks to:
- Create a database migration
- Add, modify, or remove a database table or column
- Generate a schema change

## Inputs

- `name`: A descriptive name for the migration (e.g., "add-user-email-index")
- `description`: What the migration does (e.g., "Adds an index on the email column of the users table")

## Instructions

1. Generate a timestamp in the format `YYYYMMDDHHMMSS`
2. Create a new file at `migrations/{timestamp}_{name}.sql`
3. Add a header comment with the description and current date
4. Write the `-- up` section with the SQL statements for the change
5. Write the `-- down` section with the SQL statements to reverse the change
6. Verify the SQL syntax is valid for PostgreSQL

## Output

- A new migration file at `migrations/{timestamp}_{name}.sql`
- The file contains both up and down migration SQL

## Constraints

- Migration file names must use snake_case
- Always include a down migration that reverses the up migration
- Use PostgreSQL syntax (not MySQL or SQLite)
- Do not modify existing migration files
```

Each section of `SKILL.md` serves a specific purpose. Let's examine them in detail.

## Trigger descriptions

The trigger section tells the agent *when* this skill applies. Triggers are natural language descriptions of the user intents that should activate the skill.

```markdown
## Trigger

Invoke this skill when the user asks to:
- Create a database migration
- Add, modify, or remove a database table or column
- Generate a schema change
```

Good trigger descriptions are:

- **Specific enough** to match the right requests. "Create a database migration" is better than "do something with the database."
- **Broad enough** to catch natural variations. Including multiple phrasings ("create a migration," "add a column," "generate a schema change") covers different ways a user might express the same intent.
- **Distinct from other skills.** If two skills have overlapping triggers, the agent may invoke the wrong one. Make sure each skill's triggers clearly describe its unique purpose.

Triggers are not programming constructs -- they are hints for the agent. The agent uses them to decide which skill is relevant when you make a request, but the final decision involves the agent's judgment about whether the skill fits the current context.

## Input/output contracts

The inputs and outputs sections define what information the skill needs and what it produces. These form the skill's contract -- the agreement between the user, the agent, and the skill about what goes in and what comes out.

### Inputs

Inputs are the parameters the skill needs to execute. Each input should specify:

- **Name**: A clear, descriptive identifier
- **Description**: What the input represents
- **Whether it is required or optional**: Mark optional inputs explicitly

```markdown
## Inputs

- `name` (required): A descriptive name for the migration (e.g., "add-user-email-index")
- `description` (required): What the migration does
- `dialect` (optional): SQL dialect to use. Defaults to PostgreSQL.
```

When the user invokes a skill without providing all required inputs, the agent should ask for the missing values before proceeding. Including example values (as shown above with "add-user-email-index") helps both the agent and the user understand what is expected.

### Outputs

Outputs describe what the skill produces -- files created, commands run, or state changes made. Being explicit about outputs helps the user know what to expect and helps the agent verify its own work.

```markdown
## Output

- A new migration file at `migrations/{timestamp}_{name}.sql`
- The file contains both up and down migration SQL
- A confirmation message listing the file path and migration name
```

## Instructions

The instructions section is the core of the skill -- the step-by-step procedure the agent follows to complete the workflow. Instructions should be:

- **Sequential.** Numbered steps executed in order. The agent follows them from top to bottom.
- **Unambiguous.** Each step describes one specific action. Avoid steps that require the agent to make judgment calls unless you explicitly state the criteria.
- **Complete.** Include every step needed to produce the expected output. Do not assume the agent will infer intermediate steps.
- **Testable.** Each step should produce an observable result the agent can verify.

Here is an example of well-written instructions:

```markdown
## Instructions

1. Read the existing components in `src/components/` to identify the naming pattern
2. Create a new directory at `src/components/{ComponentName}/`
3. Create `index.tsx` with the component skeleton using the React functional
   component pattern from the existing components
4. Create `{ComponentName}.test.tsx` with a basic render test using the testing
   patterns from `src/test/setup.ts`
5. Create `{ComponentName}.module.css` with an empty root class
6. Export the component from `src/components/index.ts`
7. Run `npm test -- --testPathPattern={ComponentName}` to verify the test passes
```

Notice how step 1 reads the existing codebase to discover patterns rather than hard-coding them. This makes the skill more resilient to project changes -- if the naming pattern evolves, the skill adapts because it reads the current state rather than assuming a fixed convention.

## Constraints

The constraints section defines boundaries -- things the skill must not do, limits on its behavior, and invariants that must hold. Constraints are the guardrails that prevent the skill from producing unexpected results.

```markdown
## Constraints

- Do not modify existing migration files
- Do not create migrations that depend on data (only schema changes)
- File names must use snake_case with no spaces or special characters
- Always use parameterized queries, never string interpolation for SQL values
```

Constraints are especially important for skills that modify existing files or run commands. Without explicit constraints, the agent might take a reasonable-seeming shortcut that violates your project's conventions or safety requirements.

## Supporting files

Skills can include additional files that the agent references during execution. Common types of supporting files include:

### Templates

Templates provide starting points for files the skill creates. They can be simple Markdown examples or more structured template formats:

```text
skills/
  generate-component/
    SKILL.md
    templates/
      component.tsx      # Template for the component file
      test.tsx           # Template for the test file
      styles.module.css  # Template for the styles file
```

The skill's instructions reference these templates:

```markdown
3. Create `index.tsx` using the template at `skills/generate-component/templates/component.tsx`
   as a starting point. Replace `{ComponentName}` with the actual component name.
```

### Examples

Example files show what the skill's output should look like. They help the agent understand the expected quality and format:

```text
skills/
  generate-migration/
    SKILL.md
    examples/
      20240115120000_add_users_table.sql    # Example output
      20240116090000_add_email_index.sql    # Another example
```

### Reference materials

Some skills include reference files -- style guides, API documentation, or specification excerpts -- that the agent should consult during execution:

```text
skills/
  generate-api-docs/
    SKILL.md
    references/
      api-style-guide.md    # Documentation conventions
      openapi-patterns.md   # OpenAPI specification patterns
```

## A complete skill example

Putting all the components together, here is a complete skill for scaffolding a new Express.js route with full test coverage:

```text
skills/
  scaffold-express-route/
    SKILL.md
    templates/
      route.ts
      route.test.ts
      schema.ts
```

And the `SKILL.md`:

```markdown
# Scaffold Express Route

Generate a new Express.js route with validation, error handling, and tests.

## Trigger

Invoke this skill when the user asks to:
- Create a new API route or endpoint
- Add a new route to the Express application
- Scaffold a REST endpoint

## Inputs

- `resource` (required): The resource name in singular form (e.g., "order")
- `method` (required): HTTP method (GET, POST, PUT, DELETE)
- `path` (required): The route path (e.g., "/api/orders/:id")
- `authenticated` (optional): Whether the route requires authentication. Defaults to true.

## Instructions

1. Read `src/routes/` to confirm the existing file naming pattern
2. Create `src/routes/{resource}.routes.ts` using the template at
   `skills/scaffold-express-route/templates/route.ts`
3. Create `src/routes/{resource}.schema.ts` using the template at
   `skills/scaffold-express-route/templates/schema.ts`
4. If `authenticated` is true, import and apply `authMiddleware` from
   `src/middleware/auth.ts`
5. Register the new route in `src/routes/index.ts`
6. Create `src/routes/__tests__/{resource}.routes.test.ts` using the template at
   `skills/scaffold-express-route/templates/route.test.ts`
7. Run `npm test -- --testPathPattern={resource}` to verify tests pass

## Output

- Route handler at `src/routes/{resource}.routes.ts`
- Validation schema at `src/routes/{resource}.schema.ts`
- Test file at `src/routes/__tests__/{resource}.routes.test.ts`
- Updated route registry at `src/routes/index.ts`

## Constraints

- Follow the existing route patterns in `src/routes/`
- Use Zod for request validation (project standard)
- Use the `AppError` class for error responses
- Test file must include at least: success case, validation error case,
  and authentication error case (if authenticated)
- Do not modify existing route files
```

This skill is complete, self-contained, and testable. An agent reading this `SKILL.md` has everything it needs to scaffold a new route that is consistent with the rest of the codebase.
