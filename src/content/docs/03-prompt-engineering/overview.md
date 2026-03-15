---
title: Prompt engineering for coding agents
description: Learn how to communicate effectively with AI coding agents through structured prompts that produce predictable, high-quality results.
sidebar:
  order: 0
  label: Overview
---

Getting useful output from an AI coding agent depends on how you communicate with it. A vague request produces vague results. A well-structured prompt that provides context, sets constraints, and breaks work into clear steps produces code that matches your intentions. This module teaches you how to write prompts that consistently get the results you want from AI coding agents, whether you are working interactively in a terminal or delegating tasks asynchronously to a cloud-based agent.

Prompt engineering for coding agents differs from prompting a chat assistant. When you prompt ChatGPT or Claude in a browser, you are having a conversation. When you prompt an AI coding agent, you are delegating work. The agent will read your codebase, make decisions about implementation, edit files, run commands, and iterate on its own output. Your prompt needs to account for this autonomy -- it needs to be specific enough to guide the agent toward the right outcome, but flexible enough to let the agent use its judgment on implementation details.

## What you will learn

- Understand why prompting an AI coding agent differs from prompting a chat assistant
- Identify the components of an effective agent prompt: intent, context, constraints, and scope
- Apply practical techniques for task decomposition, context provision, constraint setting, and iterative refinement
- Recognize and avoid common pitfalls: vague prompts, over-constraining, context assumptions, and token budget issues
- Adapt your prompting style for OpenCode (interactive, terminal-based) versus Codex (asynchronous, cloud-based) workflows
- Transform weak prompts into effective ones using concrete before-and-after examples
- Write prompts for realistic coding tasks and evaluate the quality of agent output

## Prerequisites

- Experience writing code in at least one programming language
- Familiarity with a terminal and basic command-line operations
- Basic understanding of version control with Git
- An installed and configured AI coding agent (OpenCode or Codex) is helpful for the exercises but not required for reading the content

---

## Module structure

This module is organized into four sections, each on its own page:

1. **[Prompting fundamentals](/03-prompt-engineering/fundamentals/)** -- Why agent prompting differs from chat prompting, the anatomy of a good prompt, and the four components every effective prompt includes.
2. **[Practical techniques](/03-prompt-engineering/practical-techniques/)** -- Task decomposition, providing context within prompts, setting constraints, iterative refinement, and before-and-after prompt examples.
3. **[Common pitfalls](/03-prompt-engineering/common-pitfalls/)** -- The most frequent mistakes developers make when prompting agents, including vague instructions, over-constraining, context assumptions, and token budget issues.
4. **[Agent-specific prompting](/03-prompt-engineering/agent-specific-prompting/)** -- How to adapt your prompting style for OpenCode (interactive, terminal-based) versus Codex (asynchronous, cloud-based) workflows.

---

## Key takeaways

- Prompting an agent is delegating work, not having a conversation -- your prompt needs to account for the agent's autonomy
- Effective prompts have four components: clear intent, relevant context, explicit constraints, and well-defined scope
- Task decomposition is the single most impactful technique -- smaller, focused tasks produce better results than large, open-ended requests
- Common pitfalls like vague instructions and over-constraining are easy to avoid once you recognize them
- OpenCode and Codex have different execution models that require different prompting strategies: interactive and iterative versus upfront and comprehensive
- Prompt engineering is a skill that improves with practice -- the before-and-after examples in this module give you a starting point

## Next steps

- **Next section**: [Prompting fundamentals](/03-prompt-engineering/fundamentals/) -- Understand why agent prompting differs from chat prompting and learn the anatomy of a good prompt.
- **After this module**: [Context engineering](/04-context-engineering/overview/) -- Learn how to set up project-level context files so your agent produces code that matches your standards without repeated instructions.
- **Related**: [Setting up your agent environment](/02-setup/overview/) -- If you have not installed OpenCode or Codex yet, set up your environment before practicing the exercises.
