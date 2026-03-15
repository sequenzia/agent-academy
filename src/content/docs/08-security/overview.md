---
title: Security, guardrails, and safe automation
description: Learn how to identify and mitigate the security risks of AI coding agents so you can use them without compromising your codebase or credentials.
sidebar:
  order: 0
  label: Overview
---

AI coding agents can read your files, run shell commands, make network requests, and modify your codebase -- all in seconds. That power is what makes them useful, and it is also what makes them risky. An agent that deletes the wrong directory, commits a hard-coded API key, or runs a destructive database command can cause real damage, and it can happen faster than you can intervene.

The good news is that these risks are manageable. The threat model for agent workflows is well understood, and the mitigations are practical. This module teaches you how to think about agent security systematically: what can go wrong, how to limit the blast radius when it does, and how to build workflows that are both productive and safe.

This is not about fear. It is about the same engineering discipline you apply to any powerful tool -- understanding its failure modes and building guardrails that let you work confidently.

## What you will learn

- Identify the main security threats in agent workflows: unintended modifications, credential exposure, destructive operations, prompt injection, and supply chain risks
- Configure agent permission models and sandboxing to limit what an agent can access and modify
- Manage credentials safely by keeping secrets out of context files and using environment variables or secret managers
- Treat agent output as code contributions by applying code review, automated checks, and git-based validation workflows
- Build operational safety practices including undo/rollback strategies, rate limiting, cost controls, and monitoring
- Recognize when an agent is stuck in a loop or producing hallucinated output

## Prerequisites

- Familiarity with a terminal and basic command-line operations
- Basic understanding of Git and version control workflows
- An understanding of how AI coding agents work (the agent loop from [Module 1](/01-introduction/agent-loop/))
- Experience using an AI coding agent for at least a few tasks (concepts from [Module 2](/02-setup/overview/) through [Module 4](/04-context-engineering/overview/) are helpful but not required)

:::note
Security practices apply to all AI coding agents, but specific permission models and sandboxing features differ between tools. This module covers both OpenCode and Codex where their security approaches diverge.
:::

---

## Module structure

This module is organized into five sections, each on its own page:

1. **[Threat model for agent workflows](/08-security/threat-model/)** -- The five main categories of risk: unintended modifications, credential exposure, destructive operations, prompt injection, and supply chain risks.
2. **[Permissions and sandboxing](/08-security/permissions-and-sandboxing/)** -- How to limit what an agent can access through permission models, file system boundaries, network controls, and containerization.
3. **[Credential and secret management](/08-security/credential-management/)** -- Keeping secrets out of context files, using environment variables and secret managers, auditing agent output, and key rotation practices.
4. **[Code review and validation](/08-security/code-review-practices/)** -- Treating agent output as code contributions with automated checks, git workflow integration, and effective diff review.
5. **[Operational safety](/08-security/operational-safety/)** -- Undo/rollback strategies, rate limiting, cost controls, monitoring agent behavior, and recognizing loops and hallucinations.

---

## Key takeaways

- Agent security starts with understanding the threat model: know what can go wrong before it happens
- Permission models and sandboxing limit the blast radius -- the agent should have access to what it needs and nothing more
- Secrets never belong in context files, prompts, or agent-visible configuration; use environment variables and secret managers instead
- Every piece of agent output should go through the same review process as a human code contribution
- Operational guardrails like undo strategies, cost controls, and monitoring let you catch problems before they escalate
- Security is not about restricting your agent to the point of uselessness -- it is about building workflows where you can be both productive and safe

## Next steps

- **Next section**: [Threat model for agent workflows](/08-security/threat-model/) -- Understand the five main categories of risk before diving into mitigations.
- **Related**: [MCP servers: security considerations](/06-mcp-servers/security-considerations/) -- MCP servers extend your agent's capabilities, which means they also extend the attack surface.
- **Related**: [Context engineering](/04-context-engineering/overview/) -- Well-crafted context files reduce risky agent behavior by giving the agent clear guardrails for how your project works.
