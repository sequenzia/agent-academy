---
title: Creating custom skills
description: Identify repeatable workflows worth encoding as skills, then write, test, and organize them for your project or team.
sidebar:
  order: 4
  label: Creating custom skills
---

The most valuable skills are the ones tailored to your project's specific workflows and conventions. Off-the-shelf skills get you started, but custom skills encode the tribal knowledge that makes your team effective -- the exact way you scaffold features, the specific steps in your release process, the precise testing patterns your codebase follows.

This section walks through the process of identifying good skill candidates, writing clear instructions, testing your skills, and organizing them for long-term maintenance.

## Identifying skill candidates

Not every workflow should be a skill. Look for tasks that meet these criteria:

### The three-times rule

If you have written essentially the same prompt three or more times, it is a skill candidate. This includes:

- Scaffolding a new feature, component, or module
- Running your release or deployment workflow
- Generating boilerplate that follows a specific pattern
- Setting up a new developer environment or test fixture
- Performing a standard code review checklist

### Signs a workflow is ready to be a skill

A workflow is a good skill candidate when:

1. **The steps are stable.** The workflow does not change significantly from one execution to the next. If you are still figuring out the best process, wait until it stabilizes.
2. **The instructions are writable.** You can describe every step in plain language without needing "use your judgment" on critical decisions. Steps that require discretion can be included, but the core workflow should be mechanical.
3. **The output is verifiable.** There is a concrete way to confirm the skill worked -- tests pass, files exist in the right locations, the build succeeds.
4. **Someone else could follow it.** If a new team member could not follow your written instructions to produce the correct result, the instructions need more detail.

### Common custom skill categories

Here are categories of skills that teams frequently build:

**Scaffolding skills:**

```text
skills/
  new-feature/           # Scaffold a feature with routes, models, tests
  new-component/         # Create a React/Vue/Svelte component with tests
  new-service/           # Set up a new microservice with standard config
  new-migration/         # Generate a database migration file
```

**Workflow skills:**

```text
skills/
  release-prep/          # Version bump, changelog, release notes
  pr-review/             # Structured code review checklist
  deploy-staging/        # Steps to deploy to staging environment
  onboard-developer/     # Set up a new dev's local environment
```

**Code maintenance skills:**

```text
skills/
  update-dependencies/   # Review and update package dependencies
  add-logging/           # Add structured logging to a module
  extract-interface/     # Refactor a concrete class to use an interface
  add-error-handling/    # Add standardized error handling to a module
```

## Writing skill instructions

The quality of a skill depends almost entirely on the quality of its instructions. Clear, specific instructions produce consistent results. Vague instructions produce unpredictable output.

### Start from a successful prompt

The fastest way to write a skill is to start from a prompt that already works. Take the prompt you have been copy-pasting, examine what makes it effective, and formalize it into a skill structure.

Here is a prompt that works well for generating a test file:

```text
Create a test file for src/services/order-service.ts. Follow the patterns in
src/services/__tests__/user-service.test.ts. Use vitest, mock external
dependencies with vi.mock(), group tests by method name using describe blocks,
and include tests for both success cases and error cases. Make sure to test
the edge case where the order total is zero.
```

Converting this to a skill means extracting the generalizable parts (test patterns, framework, structure) from the specific parts (the file path, the edge case):

```markdown
# Generate Service Tests

Create a comprehensive test file for a service module.

## Trigger

Invoke this skill when the user asks to:
- Write tests for a service
- Generate test coverage for a service module
- Create a test file for a service

## Inputs

- `service_path` (required): Path to the service file (e.g., "src/services/order-service.ts")
- `edge_cases` (optional): Specific edge cases to test beyond the standard ones

## Instructions

1. Read the service file at `{service_path}` to identify all exported functions and methods
2. Read an existing test file in the same `__tests__/` directory to match the project's
   test style and import patterns
3. Create a test file at `{service_dir}/__tests__/{service_name}.test.ts`
4. Use vitest as the test framework (import from "vitest")
5. Mock external dependencies using `vi.mock()`. Identify dependencies by reading
   the service file's imports
6. Organize tests using `describe` blocks grouped by function or method name
7. For each function, include:
   - At least one success case with a representative input
   - At least one error case (invalid input, missing data, or thrown exception)
   - Any edge cases specified in the `edge_cases` input
8. Run `npx vitest run --testPathPattern={service_name}` to verify all tests pass
9. If any test fails, read the error output and fix the test

## Output

- Test file at `{service_dir}/__tests__/{service_name}.test.ts`
- All tests passing

## Constraints

- Match the test style of existing tests in the project
- Do not modify the service file being tested
- Use `vi.mock()` for external dependencies, not manual mocks
- Each test must have a descriptive name that explains what it verifies
```

### Writing effective instructions

Follow these principles when writing skill instructions:

**Be specific about file paths and naming.** Instead of "create a test file," say "create a test file at `{service_dir}/__tests__/{service_name}.test.ts`." The agent should not have to guess where files go.

**Reference the codebase for patterns.** Include steps that read existing code to discover patterns: "Read an existing test file in the same directory to match the project's test style." This makes the skill adaptive -- it works even as conventions evolve.

**Include verification steps.** End with a step that confirms the skill's output is correct: "Run the test suite to verify all tests pass." Verification catches issues before the user sees them.

**Specify tools and libraries explicitly.** Do not write "use the testing framework." Write "use vitest (import from 'vitest')." Ambiguity in tool choice leads to inconsistent output.

**State what not to do.** Constraints are as important as instructions. "Do not modify the service file being tested" prevents the agent from taking a shortcut that would surprise the user.

## Testing skills

A skill is not done when you finish writing `SKILL.md`. It is done when you have tested it and confirmed it produces correct, consistent output.

### Test on a real project

Test your skill against your actual codebase, not a synthetic example. Create a temporary branch so you can discard the output after testing:

```bash
git checkout -b test/skill-name
```

Invoke the skill with representative inputs and review every file it creates or modifies. Check for:

- **Correctness.** Does the output compile, pass tests, and work as expected?
- **Consistency.** Does the output match the style and patterns of existing code?
- **Completeness.** Did the skill produce all expected outputs? Did it miss any steps?
- **Constraints.** Did the skill respect all its stated constraints?

### Test with different inputs

Run the skill multiple times with different inputs to check for robustness:

```bash
# Test with a simple case
/generate-service-tests service_path=src/services/user-service.ts

# Test with a nested path
/generate-service-tests service_path=src/modules/billing/services/invoice-service.ts

# Test with edge cases specified
/generate-service-tests service_path=src/services/auth-service.ts edge_cases="expired token, missing permissions, rate-limited user"
```

Look for problems that surface only with certain inputs: incorrect path resolution, missing directory creation, or assumptions about the project structure that do not always hold.

### Iterate on failures

When a skill produces incorrect output, diagnose which step went wrong:

1. **Instruction problem.** The step is ambiguous or incomplete. Fix by making the instruction more specific.
2. **Missing context.** The skill does not read enough of the codebase to make good decisions. Add a step that reads relevant files first.
3. **Constraint violation.** The agent ignored a constraint. Make the constraint more prominent or add a verification step that checks it.
4. **Edge case.** The skill works for common inputs but fails for unusual ones. Add handling for the edge case or document it as a limitation.

After each fix, re-test to confirm the improvement and check that you did not introduce new problems.

## Organizing skills

As your skill collection grows, organization becomes important. A well-organized skill library is easy to discover, maintain, and share.

### Directory structure

Group skills by category within your skills directory:

```text
skills/
  scaffolding/
    new-feature/
      SKILL.md
    new-component/
      SKILL.md
      templates/
    new-migration/
      SKILL.md
  workflows/
    release-prep/
      SKILL.md
    pr-review/
      SKILL.md
  maintenance/
    update-dependencies/
      SKILL.md
    add-error-handling/
      SKILL.md
```

### Naming conventions

Use clear, action-oriented names for skill directories:

- **Good:** `generate-migration`, `scaffold-component`, `release-prep`
- **Bad:** `migration`, `component`, `release` (too vague -- what about the migration?)
- **Bad:** `create-a-new-database-migration-file` (too verbose)

The name should tell you what the skill *does*, not just what it relates to.

### Versioning and change tracking

Store skills in version control alongside your project code. This gives you:

- **Change history.** You can see when and why a skill was modified.
- **Code review.** Skill changes go through the same review process as code changes.
- **Rollback.** If a skill change introduces problems, you can revert it.
- **Sharing.** Team members get skill updates when they pull the repository.

When making significant changes to a skill, update its instructions and constraints, then re-test before committing:

```bash
# Make changes to the skill
# Then test it
git checkout -b improve/scaffold-component-skill
# ... invoke skill, verify output ...
git add skills/scaffolding/new-component/
git commit -m "feat(skills): add CSS modules support to component scaffold"
```

## Practical exercises

### Exercise: Create your first custom skill

**Objective**: Convert a workflow you perform regularly into a reusable skill.

**Prerequisites**: An installed AI coding agent (OpenCode or Codex) and a project with a repeatable workflow you want to automate.

**Steps**:

1. Identify a workflow you have performed at least three times. Examples: creating a new component, adding a database model, writing a changelog entry.
2. Write down the exact steps you follow, including file paths, naming conventions, and tools used.
3. Create a `skills/` directory in your project if one does not exist.
4. Create a subdirectory with a descriptive name (e.g., `skills/scaffold-model/`).
5. Write `SKILL.md` with these sections: title, trigger, inputs, instructions, output, and constraints.
6. Test the skill by invoking it with your agent on a real task.
7. Review the output against your project's existing code for consistency.
8. Iterate: fix any instructions that produced incorrect output and re-test.

**Verification**: The skill produces output that matches the quality and conventions of your existing codebase. Run your project's test suite to confirm nothing is broken.

**Stretch goal**: Share the skill with a teammate and have them invoke it without any additional explanation. If they need to ask questions the `SKILL.md` does not answer, those gaps are instructions you need to add.
