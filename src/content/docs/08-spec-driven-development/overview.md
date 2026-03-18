---
title: Spec-Driven Development (SDD)
description: Learn how to use a structured specification-to-code pipeline with AI coding agents to build features systematically instead of relying on ad-hoc prompting.
sidebar:
  order: 0
  label: Overview
---

Ad-hoc prompting works well for small, self-contained tasks: fix a bug, write a function, scaffold a component. But when you try to build a complete feature -- something with multiple files, edge cases, dependencies between parts, and specific acceptance criteria -- the ad-hoc approach breaks down. Requirements get lost between prompts, edge cases are forgotten, and the result is inconsistent code that takes as long to fix as it would have taken to write manually.

Spec-Driven Development (SDD) is a structured methodology for building software features with AI coding agents. Instead of describing what you want in natural language and hoping for the best, SDD follows a disciplined pipeline: you write a specification that captures your requirements, decompose it into atomic tasks with testable acceptance criteria, and then execute those tasks through independent subagents that share context and learnings through markdown files. Each phase builds on the previous one, and each task can be verified against concrete criteria rather than subjective assessment.

This module teaches SDD as a generic, tool-agnostic framework. You will learn the four phases of the pipeline, how to write specifications that agents can act on, how to decompose specs into dependency-ordered tasks, and how subagent-based execution turns those tasks into working code. The exercises give you hands-on practice writing specs, running the full pipeline, and comparing SDD results against ad-hoc prompting for the same feature.

## What you will learn

- Understand the SDD methodology and its four phases: specification, quality analysis, task decomposition, and execution
- Write structured specifications with clear requirements and testable acceptance criteria
- Evaluate spec quality and apply optional quality analysis as a review gate
- Decompose specifications into atomic, dependency-ordered tasks suitable for agent execution
- Understand the subagent execution model: independent agents working on atomic tasks, sharing context and learnings via markdown files
- Apply wave-based parallelism and verification-driven completion to manage complex feature development
- Evaluate when SDD is the right approach versus when simpler methods are sufficient

## Prerequisites

- Experience writing code in at least one programming language
- Familiarity with a terminal and basic command-line operations
- Understanding of how AI coding agents work (the agent loop from [Module 1](/01-introduction/agent-loop/))
- Familiarity with context engineering principles ([Module 4](/04-context-engineering/overview/)) -- SDD specifications serve as a form of structured context
- Understanding of subagent delegation patterns ([Module 7](/07-subagents/overview/)) -- SDD execution relies on delegating tasks to independent subagents

:::note
SDD is a methodology, not a specific tool. This module teaches the principles and workflow in a tool-agnostic way. You can apply SDD with any AI coding agent that supports subagent delegation and context file sharing.
:::

---

## Module structure

This module is organized into five sections, each on its own page:

1. **[The SDD methodology](/08-spec-driven-development/the-sdd-methodology/)** -- The problem with ad-hoc agent development, the four-phase SDD pipeline, core principles, and guidance on when to use SDD versus simpler approaches.
2. **[Writing specifications](/08-spec-driven-development/writing-specifications/)** -- Anatomy of a good specification, requirements capture, writing testable acceptance criteria, spec depth levels, and quality analysis as an optional review gate.
3. **[Task decomposition](/08-spec-driven-development/task-decomposition/)** -- Decomposition patterns for turning specs into tasks, dependency inference and ordering, task granularity, and acceptance criteria categorization.
4. **[Execution and verification](/08-spec-driven-development/execution-and-verification/)** -- The subagent execution model, shared context through markdown files, wave-based parallelism, the agent workflow (understand, implement, verify, complete), and handling failures and retries.
5. **[Practical exercises](/08-spec-driven-development/practical-exercises/)** -- Spec writing practice, a full pipeline walkthrough, and a comparative exercise contrasting ad-hoc prompting with SDD for the same feature.

---

## Key takeaways

- SDD replaces ad-hoc prompting with a repeatable pipeline: specification, quality analysis (optional), task decomposition, and execution
- Specifications are the single source of truth -- every task, acceptance criterion, and verification step traces back to the spec
- Testable acceptance criteria are what make SDD work; without them, you cannot verify that tasks were completed correctly
- Task decomposition turns a large feature into atomic, dependency-ordered units that independent agents can execute in parallel
- Subagent-based execution with shared markdown context enables each agent to build on the learnings of previous agents
- SDD is most valuable for features with multiple files, cross-cutting concerns, and well-defined requirements -- not every task needs it
- The methodology is tool-agnostic: the principles apply regardless of which AI coding agent you use

## Next steps

- **Next section**: [The SDD methodology](/08-spec-driven-development/the-sdd-methodology/) -- Understand the four-phase pipeline and the principles that make SDD effective.
- **Related**: [Context engineering](/04-context-engineering/overview/) -- Specifications are a specialized form of context engineering; the principles of writing good context files apply directly to writing good specs.
- **Related**: [Subagents and task delegation](/07-subagents/overview/) -- SDD execution builds on the delegation patterns and tradeoffs covered in Module 7.
