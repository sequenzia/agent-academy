---
title: Introduction to AI coding agents
description: Learn what AI coding agents are, how they work, and how they differ from other AI development tools like chat assistants and autocomplete.
sidebar:
  order: 0
  label: Overview
---

AI coding agents are tools that use large language models to autonomously read, understand, and modify code based on natural language instructions. Unlike chat assistants that answer questions or autocomplete tools that suggest the next line, an AI coding agent operates in a loop: it reads your codebase, reasons about what needs to change, takes action by editing files and running commands, and then observes the results to decide what to do next.

This module introduces the core concepts you need before working with an AI coding agent. You will learn what the agent loop is, how different categories of agents compare, when an agent is the right tool for a task, and how to shift your thinking from writing code yourself to directing an agent that writes code for you.

## What you will learn

- Understand the agent loop (Read, Think, Act, Observe) and how it differs from a simple request-response pattern
- Compare the three main categories of AI coding agents: terminal-based, IDE-integrated, and cloud-based
- Identify when to use an AI coding agent versus coding by hand using a practical decision framework
- Describe the mental model shift from writing code to directing an agent
- Recognize the key capabilities and tradeoffs of OpenCode and Codex as representative agents
- Connect each concept in this module to the deeper topics covered in later modules

## Prerequisites

- Experience writing code in at least one programming language
- Familiarity with a terminal and basic command-line operations
- Basic understanding of version control with Git

No prior experience with AI coding agents is required. This module is designed as a starting point for developers who are new to agent-assisted development.

---

## Module structure

This module is organized into four sections, each on its own page:

1. **[The agent loop](/01-introduction/agent-loop/)** -- The core Read-Think-Act-Observe cycle that every AI coding agent follows, and why understanding it makes you a better collaborator.
2. **[Agent categories](/01-introduction/agent-categories/)** -- The three main categories of AI coding agents (terminal-based, IDE-integrated, cloud-based), with a detailed comparison of OpenCode and Codex.
3. **[When to use agents](/01-introduction/when-to-use-agents/)** -- A practical decision framework for identifying tasks that benefit from agent assistance versus those better done by hand.
4. **[The mental model shift](/01-introduction/mental-model-shift/)** -- How to transition your thinking from writing code yourself to directing an agent, and the new skills this requires.

---

## Key takeaways

- AI coding agents operate in a loop (Read, Think, Act, Observe) that repeats until the task is complete -- understanding this loop is the foundation for everything else
- Agents come in three categories: terminal-based (like OpenCode), IDE-integrated, and cloud-based (like Codex), each with different tradeoffs
- Agents are not a replacement for coding skill -- they are a tool that works best for well-defined, context-rich tasks and less well for ambiguous, exploratory work
- Working with agents requires a mental model shift: you direct and review rather than write, and your value comes from intent, judgment, and quality assessment
- The concepts in this module connect directly to the practical skills taught in later modules: prompt engineering, context engineering, skills, and more

## Next steps

- **Next section**: [The agent loop](/01-introduction/agent-loop/) -- Understand the core cycle that every AI coding agent follows.
- **After this module**: [Setting up your agent environment](/02-setup/overview/) -- Install and configure OpenCode and Codex so you can start working with agents hands-on.
