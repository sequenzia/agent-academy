---
title: Agent-specific prompting
description: Adapt your prompting style for OpenCode (interactive, terminal-based) and Codex (asynchronous, cloud-based) workflows.
sidebar:
  order: 4
  label: Agent-specific prompting
---

The fundamentals and techniques covered earlier in this module apply to any AI coding agent. But the two agents this course focuses on -- OpenCode and Codex -- have different execution models that affect how you structure your prompts. This page covers the practical differences and shows you how to adapt your prompting style for each.

## How execution model shapes prompting

The core difference between OpenCode and Codex is not about intelligence or capability -- it is about interaction model.

**OpenCode** is a terminal-based agent that runs interactively in your local environment. You type a prompt, watch the agent work in real time, and can intervene, redirect, or refine at any point during execution. It is a conversation with a capable colleague sitting next to you.

**Codex** is a cloud-based agent that runs asynchronously against a connected repository. You submit a task, and Codex executes it in a sandboxed environment. You receive results when it is done. It is more like delegating a task to a colleague in a different time zone -- you need to provide everything up front.

This distinction drives different prompting strategies:

| Aspect | OpenCode (interactive) | Codex (async) |
|--------|----------------------|---------------|
| Prompt style | Conversational, can start brief | Comprehensive, self-contained |
| Context delivery | Can provide incrementally | Must include everything up front |
| Error recovery | Redirect in real time | Must anticipate in the prompt |
| Task scope | Flexible, can expand mid-task | Fixed, should be well-scoped |
| Refinement | Natural back-and-forth | Requires a new task submission |

## OpenCode prompting

OpenCode runs in your terminal, reading and modifying files on your local machine. You see what it does as it works, and you can steer it in real time.

### Start concise, then refine

Because you can interact with OpenCode during execution, your initial prompt does not need to be exhaustive. Start with a clear intent and let the conversation develop.

**First prompt:**
```text
Add input validation to the registration endpoint in src/routes/auth.ts.
Validate email format, password strength (min 8 chars, at least one number),
and that the username is alphanumeric.
```

The agent starts working. You watch it read the file, plan its approach, and begin editing. If you notice it choosing a validation library you do not want:

**Follow-up refinement:**
```text
Use Zod for the validation schema instead of writing manual regex checks.
We already have Zod installed and there are schema examples in src/schemas/.
```

This conversational flow works because you are observing the agent's progress and can correct course cheaply. Each follow-up prompt builds on the shared context of the conversation.

### Use the conversation history

OpenCode maintains context across messages within a session. You can reference earlier work without repeating yourself.

```text
Prompt 1: "Create a UserProfile model in src/models/user-profile.ts with
           fields for bio, avatarUrl, and socialLinks."

Prompt 2: "Now add a ProfileService in src/services/ that handles CRUD
           for the model you just created."

Prompt 3: "Add REST endpoints for the profile service. Use the same
           middleware pattern as the auth routes."
```

Each prompt is short because the agent remembers the work it did in previous steps. This is the interactive advantage -- you do not need to re-explain context the agent already has.

### Leverage real-time observation

When working with OpenCode, watch what the agent does and intervene early if it goes in the wrong direction. It is cheaper to redirect after the first wrong step than to let the agent finish and then undo everything.

Common intervention points:
- The agent reads the wrong file -- redirect it to the correct one
- The agent starts installing a package you do not want -- tell it to stop and use what you have
- The agent's approach to the problem is fundamentally different from what you want -- describe your preferred approach before it writes more code

```text
"Stop -- don't create a new database table for this. Use the existing
user_metadata JSONB column in the users table instead. Check
src/models/user.ts for the column definition."
```

### OpenCode prompting patterns

**Exploratory tasks.** When you are not sure about the best approach, ask OpenCode to investigate first:
```text
Look at how error handling is done across src/routes/. Are there
inconsistencies? What pattern is used most often?
```
Then use the agent's analysis to write a more targeted follow-up prompt.

**Small, chained tasks.** Break work into small steps and verify between each one:
```text
Step 1: "Add the database migration for the new notifications table."
[Verify the migration looks correct]
Step 2: "Create the Notification model based on the migration you just wrote."
[Verify the model matches the schema]
Step 3: "Add the NotificationService with methods for create, markAsRead,
         and getUnreadByUser."
```

**Debugging sessions.** OpenCode excels at interactive debugging because you can iterate quickly:
```text
"The /api/orders endpoint returns a 500 error when the cart is empty.
The error log shows a TypeError in src/services/order.ts. Find the bug
and fix it."
```
If the agent's first fix does not work, you can provide the new error output immediately and continue debugging.

## Codex prompting

Codex runs in the cloud against a connected repository. You submit a task, and Codex works on it without real-time interaction. When it finishes, you review the results -- typically a pull request or a set of file changes.

### Front-load everything

Since you cannot interact with Codex during execution, your prompt must contain everything the agent needs to complete the task successfully. The principles from the fundamentals page -- intent, context, constraints, and scope -- are not optional with Codex; they are mandatory.

**Example: Complete Codex task prompt**
```text
Add pagination to the GET /api/products endpoint.

Context:
- The route handler is in src/routes/products.ts
- The ProductRepository is in src/repositories/product.ts
- The database is PostgreSQL, accessed via Knex (config in knexfile.ts)
- No existing pagination pattern exists in the project

Requirements:
- Accept query parameters: page (default 1) and limit (default 20, max 100)
- Return response format: { data: Product[], pagination: { page, limit, total, totalPages } }
- Use OFFSET/LIMIT in the SQL query, not cursor-based pagination
- Add input validation: page must be >= 1, limit must be between 1 and 100

Constraints:
- Modify only src/routes/products.ts and src/repositories/product.ts
- Add tests in __tests__/routes/products.test.ts
- Do not modify other endpoints or files
- Use the existing test patterns in __tests__/routes/auth.test.ts
```

Every detail is in the prompt because there is no opportunity to clarify later.

### Anticipate edge cases

With OpenCode, if the agent mishandles an edge case, you see it happen and fix it immediately. With Codex, you need to think through edge cases in advance and include them in your prompt.

```text
Handle these edge cases:
- If page exceeds the total number of pages, return an empty data array
  with the correct pagination metadata (do not return a 404)
- If limit is 0 or negative, default to 20
- If page is not a number, return a 400 error with message
  "Invalid page parameter"
```

### Write acceptance criteria

Because you review Codex output after the fact, include explicit criteria for what "done" looks like. This helps you evaluate the result and gives the agent a concrete target.

```text
Acceptance criteria:
- GET /api/products?page=1&limit=10 returns the first 10 products with
  correct pagination metadata
- GET /api/products (no params) defaults to page 1, limit 20
- GET /api/products?page=999 returns empty data array with
  totalPages reflecting the actual count
- All existing product endpoint tests still pass
- New pagination tests cover the three scenarios above
```

### Codex prompting patterns

**Self-contained feature tasks.** Codex works best with well-bounded feature requests that have clear inputs and outputs:
```text
Add a /api/health endpoint that returns { status: "ok", version: "<package.json version>",
uptime: <process uptime in seconds> }. Create the route in src/routes/health.ts
and register it in src/routes/index.ts. Add a test in __tests__/routes/health.test.ts.
```

**Batch operations.** Codex handles repetitive, well-defined tasks efficiently:
```text
Add JSDoc comments to all exported functions in the following files:
- src/services/auth.ts
- src/services/user.ts
- src/services/product.ts
- src/services/order.ts

For each function, document: purpose (one sentence), parameters (name, type,
description), return value (type, description), and any thrown errors.
Follow the JSDoc format already used in src/utils/validators.ts.
```

**Code review and cleanup tasks.** Because Codex works asynchronously, it is well-suited for tasks where you want a thorough result without waiting:
```text
Review all route handlers in src/routes/ for missing error handling.
For each handler that does not wrap its async logic in a try-catch or
use the asyncHandler utility, add the asyncHandler wrapper from
src/utils/async-handler.ts. Do not change any business logic.
```

## Choosing the right tool for the task

The execution model should inform which agent you reach for:

| Task type | Better fit | Why |
|-----------|-----------|-----|
| Exploratory debugging | OpenCode | You need real-time feedback and iteration |
| Well-defined feature | Codex | Clear scope, can be fully specified up front |
| Refactoring with unknowns | OpenCode | You need to discover the scope as you go |
| Repetitive changes across files | Codex | Well-defined, self-contained, no interaction needed |
| Learning a new codebase | OpenCode | Ask questions, explore files, build understanding interactively |
| Writing documentation | Codex | Clear task, no interaction needed, asynchronous is fine |

Neither tool is universally better. The right choice depends on whether the task benefits from real-time interaction or can be fully specified in advance.

---

## Practical exercises

### Exercise: Rewrite a vague prompt

**Objective**: Practice transforming a vague prompt into an effective one by adding intent, context, constraints, and scope.

**Prerequisites**: Understanding of the four prompt components from the fundamentals page.

**Steps**:

1. Start with this vague prompt: `"Add logging to the application."`
2. Choose a realistic project scenario. You can use your own project or imagine a Node.js Express application with route handlers in `src/routes/`, services in `src/services/`, and a logger utility in `src/utils/logger.ts`.
3. Write a revised prompt that includes:
   - A specific intent (what kind of logging? where? why?)
   - Context (relevant file paths, existing logging infrastructure)
   - Constraints (logging library, log levels, format)
   - Scope (which files to modify, which to leave alone)
4. Review your revised prompt using the vagueness checklist from the common pitfalls page: would a different developer interpret it the same way?

**Verification**: Your revised prompt should be specific enough that two different developers (or agents) would produce substantially similar implementations. Compare your prompt against this checklist:
- Does it specify which files to modify?
- Does it reference an existing pattern or library?
- Does it define the scope of changes?
- Could you verify the result without additional unstated criteria?

**Stretch goal**: Write a second prompt for the same logging task, but this time decompose it into 3 sequential prompts that each build on the previous result.

### Exercise: Prompt for OpenCode versus Codex

**Objective**: Practice adapting the same task for interactive (OpenCode) and asynchronous (Codex) workflows.

**Prerequisites**: Understanding of the execution model differences described above.

**Steps**:

1. Consider this task: "Add rate limiting to the login endpoint to prevent brute force attacks."
2. Write a prompt for **OpenCode**: Keep it concise and conversational. Plan what your first follow-up prompt might be after seeing the agent's initial approach.
3. Write a prompt for **Codex**: Make it self-contained and comprehensive. Include all context, constraints, edge cases, and acceptance criteria the agent would need to complete the task without interaction.
4. Compare the two prompts. The Codex prompt should be significantly longer and more detailed than the OpenCode prompt.

**Verification**: Review both prompts against these criteria:
- The OpenCode prompt is clear but leaves room for real-time refinement (50-100 words)
- The Codex prompt is self-contained with no ambiguous decisions left to the agent (200-400 words)
- Both prompts would produce functionally equivalent results despite their different levels of detail

### Exercise: Decompose a complex task

**Objective**: Practice breaking a large task into a sequence of focused agent prompts.

**Prerequisites**: Understanding of task decomposition from the practical techniques page.

**Steps**:

1. Start with this complex task: "Build a notification system that sends email and in-app notifications when users receive comments on their posts."
2. Identify the layers involved: data model, service logic, API endpoints, notification delivery, tests.
3. Write 4-5 sequential prompts, each building on the previous result. For each prompt:
   - Keep it focused on one layer or concern
   - Reference the output of the previous prompt where relevant
   - Include enough constraints to ensure consistency across prompts
4. Review the sequence: does each prompt produce a result that can be verified independently?

**Verification**: Each prompt should:
- Touch no more than 3-4 files
- Be completable without knowing the details of later prompts
- Produce a testable or verifiable result on its own

**Stretch goal**: Annotate each prompt with what you would check after the agent completes it, before moving to the next prompt.

---

## Key takeaways

- Agent prompts are work orders, not questions -- they launch autonomous work that builds on itself, making clarity essential
- Effective prompts combine four components: intent (what to accomplish), context (relevant information), constraints (boundaries on approach), and scope (what to change and what to leave alone)
- Task decomposition is the single most impactful technique -- break large tasks into focused prompts that each touch a small number of files
- Avoid the middle ground between too vague and too detailed -- provide enough constraints to eliminate ambiguous decisions without dictating every implementation detail
- OpenCode's interactive model rewards concise initial prompts with real-time refinement; Codex's async model requires comprehensive, self-contained prompts
- Token budgets are a design constraint, not just a technical limitation -- focused prompts produce better results and are easier to verify
- Iterative refinement is a normal part of the workflow, but if you need more than 2-3 refinements, the original task was likely too large or too ambiguous

## Next steps

- **Next module**: [Context engineering](/04-context-engineering/overview/) -- Learn how to set up project-level context files so your agent produces code that matches your project's standards without repeated instructions.
- **Related**: [Setting up your agent environment](/02-setup/overview/) -- If you have not installed OpenCode or Codex yet, set up your environment before practicing the exercises.
- **Official docs**: [OpenCode documentation](https://github.com/anthropics/opencode) -- Reference for OpenCode-specific commands and configuration.
- **Official docs**: [Codex documentation](https://openai.com/codex) -- Reference for Codex task submission and configuration.
