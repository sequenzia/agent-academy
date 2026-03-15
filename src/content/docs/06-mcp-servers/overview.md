---
title: MCP servers
description: Learn how to connect your AI coding agent to external tools, services, and data sources via the Model Context Protocol.
sidebar:
  order: 0
  label: Overview
---

AI coding agents can read files, write code, and run shell commands out of the box. But real development workflows reach beyond the local file system -- you need to query databases, search issue trackers, look up documentation, interact with APIs, and pull data from services that live outside your project directory. The Model Context Protocol (MCP) is how your agent connects to all of these external capabilities.

MCP is an open protocol that defines a standard way for AI coding agents to discover and use tools provided by external servers. Instead of each agent implementing custom integrations for every service, MCP provides a universal interface: any agent that speaks MCP can use any MCP server, and any MCP server can be used by any MCP-compatible agent. This is the same kind of standardization that HTTP brought to web communication or LSP brought to editor tooling.

This module teaches you how MCP works, how to find and evaluate servers, how to configure them for your agent, how to use them effectively in development workflows, and how to manage the security implications of giving your agent access to external services.

## What you will learn

- Understand the MCP architecture: clients, servers, tools, and resources
- Discover MCP servers through registries and evaluate their quality and security posture
- Configure MCP servers for OpenCode and Codex with proper authentication and credential management
- Apply per-project and global configuration strategies for different workflows
- Use common development workflow servers and chain multiple tools together
- Debug MCP connection issues when servers misbehave or fail to connect
- Apply least-privilege principles and audit what access your MCP servers have

## Prerequisites

- Experience writing code in at least one programming language
- Familiarity with a terminal and basic command-line operations
- An installed AI coding agent (OpenCode or Codex) -- see [Module 2: Environment setup](/02-setup/overview/) if you need to set one up
- Basic understanding of how agents use tools (the agent loop from [Module 1](/01-introduction/agent-loop/))
- Familiarity with JSON configuration files

:::note
MCP is agent-agnostic -- the protocol works the same regardless of which agent you use. However, the configuration format and file locations differ between OpenCode and Codex. This module covers both.
:::

---

## Module structure

This module is organized into five sections, each on its own page:

1. **[What is MCP?](/06-mcp-servers/what-is-mcp/)** -- The protocol architecture, how clients and servers communicate, and the difference between tools and resources.
2. **[Discovering and evaluating servers](/06-mcp-servers/discovering-servers/)** -- Where to find MCP servers, how to assess their quality, and what to look for in their security posture.
3. **[Configuring MCP servers](/06-mcp-servers/configuration/)** -- Configuration formats, file locations, authentication setup, credential management, and per-project vs. global configuration.
4. **[Working with MCP in practice](/06-mcp-servers/practical-usage/)** -- Common development workflow servers, chaining tools across servers, debugging connections, and hands-on exercises.
5. **[Security considerations](/06-mcp-servers/security-considerations/)** -- Understanding what access you grant, applying least privilege, auditing permissions, and handling untrusted servers.

---

## Key takeaways

- MCP is a standard protocol that lets any compatible agent use any compatible server -- learn it once, apply it everywhere
- MCP servers provide two types of capabilities: tools (actions the agent can invoke) and resources (data the agent can read)
- Not all MCP servers are equal -- evaluate them for code quality, maintenance activity, security practices, and permission scope before installing
- Configuration lives in JSON files that differ by agent but follow the same conceptual pattern of declaring servers, their transport, and their credentials
- Per-project configuration keeps servers scoped to the projects that need them; global configuration is for servers you use everywhere
- Effective MCP usage comes from combining multiple servers: documentation lookup, database access, and issue tracking working together in a single workflow
- Every MCP server you add expands your agent's attack surface -- apply least privilege, audit permissions regularly, and remove servers you no longer use

## Next steps

- **Next section**: [What is MCP?](/06-mcp-servers/what-is-mcp/) -- Understand the protocol architecture and how clients, servers, tools, and resources fit together.
- **After this module**: [Subagents and task delegation](/07-subagents/overview/) -- Learn how agents orchestrate complex work by spawning subagents, and how MCP tools can be used within delegated tasks.
- **Related**: [Agent skills](/05-agent-skills/overview/) -- Skills and MCP servers are complementary: skills provide workflow instructions, while MCP servers provide the tools those workflows use.
