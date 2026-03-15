---
title: Agent skills
description: Learn how to use and create reusable skills that extend your AI coding agent's capabilities and reduce repetitive instruction.
sidebar:
  order: 0
  label: Overview
---

AI coding agents are powerful out of the box, but their real potential emerges when you extend them with skills -- reusable capability modules that teach an agent how to perform specific workflows. Instead of writing the same detailed prompt every time you want to scaffold a component, run a migration, or generate a changelog, you encode those instructions once as a skill and invoke it whenever you need it.

A skill is not just a saved prompt. It is a structured, self-contained package with a manifest file, trigger descriptions, input/output contracts, and supporting materials. Skills are discoverable by the agent, composable with other skills, and shareable across projects and teams. This module teaches you how to find and use existing skills, create your own, and apply design patterns that make skills reliable and maintainable.

## What you will learn

- Understand the skill abstraction and how skills differ from prompts, context files, and MCP servers
- Identify the components of a skill: SKILL.md, trigger descriptions, input/output contracts, and supporting files
- Discover, install, configure, and customize existing skills for your agent
- Identify repeatable tasks that are good candidates for custom skills
- Write, test, and organize your own skills for project-specific or team-wide workflows
- Apply design patterns for single-purpose, multi-step, and tool-invoking skills
- Use progressive disclosure to keep skills simple at the surface while offering depth on demand

## Prerequisites

- Experience writing code in at least one programming language
- Familiarity with a terminal and basic command-line operations
- Basic understanding of how AI coding agents work (the agent loop from [Module 1](/01-introduction/agent-loop/))
- Familiarity with context files is helpful but not required ([Module 4](/04-context-engineering/overview/) covers this)
- An installed AI coding agent (OpenCode or Codex) is needed for the exercises

---

## Module structure

This module is organized into five sections, each on its own page:

1. **[What are agent skills?](/05-agent-skills/what-are-skills/)** -- The skill abstraction, how skills differ from prompts and context files, and why they matter for repeatable workflows.
2. **[Skill anatomy](/05-agent-skills/skill-anatomy/)** -- The components of a skill: SKILL.md, trigger descriptions, input/output contracts, supporting files, and directory structure.
3. **[Using existing skills](/05-agent-skills/using-existing-skills/)** -- How to discover, install, configure, and customize skills built by others.
4. **[Creating custom skills](/05-agent-skills/creating-custom-skills/)** -- Identifying good skill candidates, writing your first skill, testing it, and organizing skills for your project or team.
5. **[Skill design patterns](/05-agent-skills/design-patterns/)** -- Design patterns for building effective skills: single-purpose, multi-step, tool-invoking, and progressive disclosure.

---

## Key takeaways

- Skills are more than saved prompts -- they are structured, self-contained packages with manifests, input/output contracts, and supporting materials
- Skills differ from context files (which provide information) and MCP servers (which provide tools) by encoding reusable workflows
- Existing skills can save significant time -- learn to discover, evaluate, and customize them before building from scratch
- Good skill candidates are tasks you do repeatedly with a consistent pattern: scaffolding, migrations, changelogs, code reviews
- Design patterns like single-purpose, multi-step, and progressive disclosure help you write skills that are reliable, composable, and maintainable
- Skills are shareable across projects and teams, making them a powerful way to encode and distribute your best practices

## Next steps

- **Next section**: [What are agent skills?](/05-agent-skills/what-are-skills/) -- Understand the skill abstraction and how skills fit into the broader agent capability model.
- **After this module**: [MCP servers](/06-mcp-servers/overview/) -- Learn how to connect your agent to external tools and data sources via the Model Context Protocol.
- **Related**: [Context engineering](/04-context-engineering/overview/) -- Skills work best when the agent already understands your project's conventions through well-crafted context files.
