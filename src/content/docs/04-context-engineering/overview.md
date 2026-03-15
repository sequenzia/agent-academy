---
title: Context engineering
description: Learn how to provide project-level context to AI coding agents so they produce code that matches your standards without repeated instructions.
sidebar:
  order: 0
  label: Overview
---

Every time you start a conversation with an AI coding agent, it begins with a blank slate. It does not know your project uses TypeScript with strict mode, that your team prefers `snake_case` for database columns, or that you have a custom testing pattern for API endpoints. Without this information, the agent produces generic code that you then spend time correcting -- effectively trading one kind of manual work for another.

Context engineering is the practice of providing persistent, project-level information to your agent so it produces code that matches your conventions from the first attempt. Instead of repeating "use Ruff for formatting" or "we use pytest with fixtures" in every prompt, you write it once in a context file and the agent reads it automatically on every interaction.

This module covers everything you need to build an effective context engineering practice: what context files are, the formats different agents support, how to write content that actually improves agent output, how context layers interact when you have multiple files, and a hands-on workshop where you audit a project and write a context file from scratch.

## What you will learn

- Understand what context engineering is and why it matters for consistent agent output
- Identify the context file formats used by different agents: CLAUDE.md, AGENTS.md, rules files, and README as implicit context
- Write effective context files covering architecture, conventions, stack, patterns, and testing expectations
- Apply context hierarchy principles: global, project, and directory-level context with conflict resolution
- Audit an existing project and create a context file that improves agent output quality
- Use starter templates to bootstrap context files for new projects

## Prerequisites

- Familiarity with a terminal and basic command-line operations
- A project you are actively working on (any language, any size)
- Experience writing code in at least one programming language
- An AI coding agent installed and configured (see [Module 2: Environment setup](/02-setup/overview/) if you need to set one up)

:::note
Context engineering applies to any AI coding agent, but the specific file formats differ between tools. This module covers the formats used by OpenCode and Codex. If you use a different agent, the principles still apply -- only the file names and locations change.
:::

---

## Module structure

This module is organized into five sections, each on its own page:

1. **[What is context engineering?](/04-context-engineering/what-is-context-engineering/)** -- Why agents need project context, how context files work, and the impact on output quality.
2. **[Context file formats](/04-context-engineering/context-file-formats/)** -- The specific formats agents read: CLAUDE.md, AGENTS.md, rules files, and README as implicit context.
3. **[Writing effective context files](/04-context-engineering/writing-effective-context/)** -- What to include: architecture, conventions, stack, patterns, testing expectations, and what to leave out.
4. **[Context hierarchy and layering](/04-context-engineering/context-hierarchy/)** -- Global vs. project vs. directory-level context, how layers combine, and how to resolve conflicts.
5. **[Practical workshop](/04-context-engineering/practical-workshop/)** -- Audit a real project, write a context file, compare before/after agent output, plus starter templates.

---

## Key takeaways

- Context engineering eliminates repetitive instructions by giving your agent persistent project knowledge
- Different agents use different context file formats, but the principles behind good context are universal
- Effective context files focus on what the agent cannot infer: your conventions, architecture decisions, and quality expectations
- Context hierarchy lets you layer global preferences, project rules, and directory-specific overrides without duplication
- A well-written context file pays for itself immediately through higher-quality agent output and fewer correction cycles
- Starting from scratch is straightforward: audit your project, document what matters, and iterate based on results

## Next steps

- **Next section**: [What is context engineering?](/04-context-engineering/what-is-context-engineering/) -- Understand why agents need project context and how context files improve output quality.
- **After this module**: [Agent skills](/05-agent-skills/overview/) -- Learn how to use and create reusable skills that extend your agent's capabilities.
