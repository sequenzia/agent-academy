---
title: Subagents and task delegation
description: Learn how AI coding agents orchestrate complex work by spawning subagents, and when delegation helps versus when it adds unnecessary complexity.
sidebar:
  order: 0
  label: Overview
---

Most AI coding agent tasks fit neatly into a single conversation: you describe what you need, the agent works through it, and you get a result. But some tasks are too large, too varied, or too parallelizable for a single agent context to handle well. When that happens, agents can delegate portions of the work to subagents -- secondary agent instances that each handle a focused piece of the overall task.

Subagent delegation is one of the most powerful capabilities available in modern AI coding agents, and also one of the easiest to misuse. A well-structured delegation can turn a 30-minute serial task into a 5-minute parallel one. A poorly structured delegation can burn through tokens, lose critical context, and produce inconsistent results that take longer to fix than doing the work manually.

This module teaches you how subagent delegation works, when to use it, which patterns produce reliable results, and -- just as importantly -- when to keep things simple with a single agent.

## What you will learn

- Understand what subagents are and how they relate to the primary agent's workflow
- Identify when a task benefits from delegation versus when a single agent is sufficient
- Recognize the four core delegation patterns: fan-out/fan-in, pipeline, supervisor, and specialist
- Apply subagent delegation to practical workflows like parallel code generation, documentation, multi-file refactoring, and validation
- Evaluate the tradeoffs of subagent delegation: token costs, context loss, debugging complexity, and diminishing returns
- Understand how OpenCode and Codex approach subagent delegation differently

## Prerequisites

- Experience writing code in at least one programming language
- Familiarity with a terminal and basic command-line operations
- Understanding of how AI coding agents work (the agent loop from [Module 1](/01-introduction/agent-loop/))
- Familiarity with prompt engineering for agents is helpful ([Module 3](/03-prompt-engineering/overview/))
- An installed AI coding agent (OpenCode or Codex) is helpful for the exercises but not required

---

## Module structure

This module is organized into four sections, each on its own page:

1. **[What are subagents?](/07-subagents/what-are-subagents/)** -- How delegation works, specialization versus delegation, and when a single agent is enough versus when subagents help.
2. **[Subagent patterns](/07-subagents/subagent-patterns/)** -- The four core delegation patterns: fan-out/fan-in, pipeline, supervisor, and specialist, with guidance on choosing the right one.
3. **[Practical workflows](/07-subagents/practical-workflows/)** -- Applying delegation to real tasks: parallel code generation, documentation, multi-file refactoring, and validation subagents.
4. **[Limitations and tradeoffs](/07-subagents/limitations-and-tradeoffs/)** -- Token cost multiplication, context loss, complexity versus value, and debugging multi-agent failures.

---

## Key takeaways

- Subagents are secondary agent instances that each handle a focused piece of a larger task, operating in isolated contexts
- Most coding tasks do not need delegation -- use subagents only when the task is naturally decomposable, exceeds a single context window, or benefits from parallelism
- The four core patterns (fan-out/fan-in, pipeline, supervisor, specialist) cover the vast majority of delegation scenarios
- Consistent shared context across subagents -- reference files, naming conventions, interface contracts -- is the most important factor for producing integrable results
- Token costs multiply with each subagent; the supervisor pattern is the most expensive
- Start with the simplest approach (single agent) and add delegation only when you have evidence that simplicity is insufficient

## Next steps

- **Next section**: [What are subagents?](/07-subagents/what-are-subagents/) -- Understand how delegation works and when it is worth the added complexity.
- **After this module**: [Spec-Driven Development (SDD)](/08-spec-driven-development/overview/) -- Learn a structured specification-to-code pipeline that combines the skills from all previous modules into a systematic workflow for building features with agents.
- **Related**: [Prompt engineering](/03-prompt-engineering/overview/) -- Effective delegation prompts follow the same principles as effective individual prompts.
- **Related**: [Agent skills](/05-agent-skills/overview/) -- Skills can encode your delegation patterns as reusable workflows.
