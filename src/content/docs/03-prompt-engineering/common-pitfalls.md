---
title: Common pitfalls
description: Avoid vague prompts, over-constraining, context assumptions, and token budget issues when working with AI coding agents.
sidebar:
  order: 3
  label: Common pitfalls
---

Even experienced developers fall into predictable patterns that produce poor results from AI coding agents. This page covers the most common pitfalls and shows you how to fix them, with concrete before-and-after prompt transformations.

## Vague prompts

The most frequent mistake is asking the agent to do something without specifying what "something" means in concrete terms.

### The problem

Vague prompts force the agent to guess your intent. The agent will fill in missing details with reasonable-sounding defaults that may not match what you actually want.

### Bad prompt to good prompt

**Scenario: You have a REST API with inconsistent error handling and you want to standardize it.**

Bad prompt:
```text
Fix the error handling in the API.
```

What goes wrong: The agent does not know which API files to modify, what "fix" means (are there bugs? inconsistencies? missing handlers?), or what the desired error format should be. It might change error messages, restructure middleware, add try-catch blocks everywhere, or do something else entirely.

Good prompt:
```text
Standardize error responses across all route handlers in src/routes/.

Currently, some routes return { message: "..." } and others return
{ error: "..." } with different status codes for similar errors. Unify
all error responses to use this format:

{ "error": "<human-readable message>", "code": "<UPPER_SNAKE_CASE code>" }

Use the error codes already defined in src/constants/error-codes.ts.
For validation errors, return 400. For not-found errors, return 404.
For auth errors, return 401. Wrap each route handler in the asyncHandler
utility from src/utils/async-handler.ts so that unhandled promise
rejections are caught.
```

Why it works: The prompt identifies the specific files, describes the current problem, defines the target format, references existing code to reuse, and specifies the expected HTTP status codes.

### How to recognize vague prompts

Your prompt is too vague if:
- It contains words like "fix," "improve," "clean up," or "optimize" without specifying the criteria for success
- It references a concept ("the error handling") without pointing to specific files or code
- A different developer reading the same prompt would interpret it differently than you intend
- You could not verify whether the agent's output is correct without additional unstated criteria

## Over-constraining

The opposite of vagueness is specifying so many constraints that you are essentially dictating the implementation line by line. If you are going to write every detail, you may as well write the code yourself.

### The problem

Over-constrained prompts leave the agent no room to apply its strengths -- pattern recognition, codebase navigation, and implementation fluency. They also tend to be brittle: if one constraint conflicts with the codebase state, the agent gets stuck trying to follow contradictory instructions.

### Bad prompt to good prompt

**Scenario: You want to add a caching layer to a database query.**

Over-constrained prompt:
```text
Open src/repositories/product.ts. On line 23, after the findAll method
declaration, add a private field called _cache of type Map<string, Product[]>.
In the constructor, initialize _cache as new Map(). In the findAll method,
before the database query on line 28, add an if-check: if _cache.has(cacheKey),
return _cache.get(cacheKey). After the database query, add
_cache.set(cacheKey, results). Add a clearCache method that calls _cache.clear().
Make sure to call clearCache in the create, update, and delete methods.
```

Better prompt:
```text
Add in-memory caching to the ProductRepository in src/repositories/product.ts.
Cache the results of findAll queries with a 5-minute TTL. Invalidate the cache
when products are created, updated, or deleted. Use a Map-based approach
consistent with the caching pattern in src/repositories/category.ts.
```

Why it works: The better prompt specifies the outcome (caching with TTL and invalidation) and points to an existing pattern to follow, but lets the agent decide the implementation details. The agent can adapt if line numbers have changed, if the class structure differs from what you assumed, or if the existing pattern suggests a better approach.

### How to recognize over-constraining

Your prompt is over-constrained if:
- You are specifying line numbers or exact positions for code insertion
- You are dictating variable names, method signatures, and implementation details that do not affect the external behavior
- The prompt reads more like a diff than a work description
- Removing half the constraints would not change the outcome

## Under-constraining

Under-constraining is subtler than vagueness. The prompt is clear about what to do, but missing key decisions that the agent will make differently than you expect.

### The problem

Under-constrained prompts produce valid code that does not fit your project. The agent chooses the most "common" or "popular" approach, which may not match your conventions, dependencies, or preferences.

### Bad prompt to good prompt

**Scenario: You need form validation on a React component.**

Under-constrained prompt:
```text
Add form validation to the checkout form in src/components/CheckoutForm.tsx.
Validate that email is a valid format, name is not empty, and zip code is
5 digits.
```

What goes wrong: The agent picks a validation library (maybe Zod, maybe Yup, maybe Joi), a form library (maybe React Hook Form, maybe Formik), and a UI pattern for showing errors (maybe inline, maybe toast, maybe a summary at the top). Each of these choices might conflict with what your project already uses.

Better prompt:
```text
Add form validation to the checkout form in src/components/CheckoutForm.tsx.
Validate that email is a valid format, name is not empty, and zip code is
exactly 5 digits.

Use the existing Zod schemas in src/schemas/ for validation logic and the
useForm hook from react-hook-form (already installed). Display errors inline
below each field using the ErrorMessage component from
src/components/ui/ErrorMessage.tsx. Follow the validation pattern in
src/components/LoginForm.tsx.
```

Why it works: The prompt specifies the validation library, form library, error display pattern, and a reference implementation to follow. The agent makes implementation decisions within these boundaries.

### How to recognize under-constraining

Your prompt is under-constrained if:
- The task involves choosing a library, pattern, or approach, and you have not specified which one
- Your project already has conventions for this type of work, but the prompt does not reference them
- You would be surprised or frustrated by a reasonable alternative implementation

## Context assumptions

This pitfall occurs when you assume the agent knows something that it does not have access to, or when you reference information that exists only in your head.

### The problem

Developers carry context about their projects that is not written down anywhere: why a certain architecture was chosen, what a previous team member tried that did not work, what the unwritten convention for naming test files is. When you prompt based on this unwritten context, the agent produces code that is technically correct but misses the point.

### Bad prompt to good prompt

**Scenario: You need to add a notification feature, and your project has a specific event-driven architecture.**

Bad prompt:
```text
Add email notifications when a user's subscription expires. Send the email
24 hours before expiration.
```

What goes wrong: The agent does not know your project uses an event bus for cross-cutting concerns. It might add the notification logic directly to the subscription service, create a cron job, or poll the database. All are valid approaches, but they do not fit your architecture.

Good prompt:
```text
Add email notifications for subscription expiration. Emit a
"subscription.expiring" event from the SubscriptionService in
src/services/subscription.ts when a subscription is within 24 hours
of its expiresAt date.

Create an event handler in src/handlers/subscription-expiring.ts that
listens for "subscription.expiring" and sends an email using the
EmailService from src/services/email.ts. Register the handler in
src/events/registry.ts following the pattern used by the existing
"payment.failed" handler.

The expiration check should run in the existing scheduled-tasks runner
in src/jobs/scheduler.ts, not as a new cron job.
```

Why it works: The prompt explains the architectural pattern (event bus), specifies where each piece goes, and references existing implementations the agent can follow.

### How to recognize context assumptions

Your prompt assumes hidden context if:
- It uses project-specific terminology that is not in any context file or code comment
- It references decisions made in meetings, Slack conversations, or previous sessions
- It expects the agent to follow a convention that exists only in your team's heads
- Another developer on your team would need to ask clarifying questions to complete the same task

The fix is straightforward: if the context is not in the codebase or context files, put it in the prompt. Over time, move recurring context into your project's context file (covered in Module 4: Context Engineering).

## Token awareness

Every AI coding agent has a context window -- a limit on how much text (measured in tokens) it can process at once. Your prompt, the files the agent reads, and the agent's own reasoning all consume tokens from this budget. Ignoring token limits leads to degraded output or mid-task failures.

### The problem

Token limits manifest in two ways:

**Prompt is too large.** If your prompt is excessively long (thousands of words of context, constraints, and requirements), it may crowd out space the agent needs to read your codebase and reason about the implementation. This is rare with individual prompts but common when context files grow unchecked.

**Task exceeds the window.** When an agent reads many large files and generates extensive output, it can exhaust its context window. The agent may start producing lower-quality output, forget earlier parts of the prompt, or stop mid-implementation.

### Practical guidelines

**Keep prompts focused.** A good prompt is typically 50-300 words. If your prompt is approaching 500+ words, consider whether some of that context belongs in a context file instead, or whether the task should be decomposed.

**Reference files instead of pasting content.** Instead of copying file contents into your prompt, point the agent at the file path. The agent can read the file itself.

```text
Instead of: "Here is the current content of auth.ts: [300 lines of code]...
Now modify it to..."

Say: "Modify src/services/auth.ts to add session expiration checks."
```

**Decompose tasks that touch many files.** If a task requires the agent to read and modify 15 files, break it into smaller tasks that each touch 3-5 files. This keeps the agent within its effective working memory.

**Watch for quality degradation.** If the agent's output quality drops noticeably toward the end of a long task (missing details, inconsistent naming, incomplete implementations), the task likely exceeded the agent's effective context window. Break the remaining work into a fresh prompt.

**Understand the asymmetry.** Reading a file costs tokens but generates no output. Writing a large file costs output tokens. The agent's reasoning (which you do not see) also costs tokens. The budget is shared across all three activities, so a task that requires reading many files has less budget available for generating output.

### Token budget as a design constraint

Think of the token budget as a design constraint, not a technical limitation to work around. Just as you would not design a function to do 20 unrelated things, do not design a prompt to handle 20 unrelated concerns. Focused prompts produce better results and are easier to verify.
