# Agent Academy: Curriculum Outline

## Overview

Agent Academy is a static documentation site that teaches developers how to work effectively with AI coding agents. The content follows a progressive structure, welcoming complete beginners while offering depth for experienced practitioners. This MVP focuses on 8 core modules covering the foundational knowledge and practical skills needed to work productally with terminal-based and cloud-based AI coding agents.

**Target Agents:** OpenCode, Codex (OpenAI)
**Audience:** Developers ranging from AI agent newcomers to casual users looking to level up
**Format:** Static docs site (Docusaurus, MkDocs, or similar)

---

## Module 1: Introduction to AI Coding Agents

*What they are, why they matter, and how they fit into the development workflow.*

### Topics

- What is an AI coding agent? How it differs from chat-based AI assistants and autocomplete tools
- The agent loop: Read, Think, Act, Observe
- When to reach for an agent vs. when to code by hand
- Landscape overview: terminal agents (OpenCode, Claude Code) vs. IDE-integrated agents (Cursor, Windsurf) vs. cloud agents (Codex)
- Mental model shift: from writing code to directing an agent that writes code

### Learning Outcomes

- Understand the core agent loop and how coding agents operate
- Identify scenarios where AI coding agents provide the most value
- Distinguish between different categories of coding agents

---

## Module 2: Setting Up Your Agent Environment

*Getting OpenCode and Codex installed, configured, and ready for your first task.*

### Topics

- **OpenCode Setup**
  - Installation and prerequisites
  - Provider configuration (API keys, model selection)
  - Configuring with proxy endpoints (e.g., LiteLLM, AI Gateway)
  - Workspace configuration and project-level settings
  - Verifying your setup with a test task

- **Codex Setup**
  - Account setup and access
  - Understanding the cloud execution model
  - Repository connection and permissions
  - Choosing task types and autonomy levels
  - Running your first Codex task

- **Environment Essentials**
  - Terminal setup and recommended tools
  - Git hygiene for agent workflows (branching strategies, frequent commits)
  - Setting up a sandbox or test project for safe experimentation

### Learning Outcomes

- Have a working OpenCode installation connected to a model provider
- Successfully run a Codex task against a connected repository
- Understand the differences in local vs. cloud execution models

---

## Module 3: Prompt Engineering for Coding Agents

*How to communicate effectively with AI coding agents to get the results you want.*

### Topics

- **Fundamentals**
  - Why prompting agents differs from prompting chat assistants
  - The anatomy of a good agent prompt: intent, scope, constraints, and acceptance criteria
  - Being explicit about what "done" looks like

- **Practical Techniques**
  - Task decomposition: breaking large tasks into agent-sized pieces
  - Providing context: pointing agents to relevant files, docs, and examples
  - Constraint setting: specifying what NOT to do (e.g., "do not modify the API layer")
  - Iterative refinement: reviewing agent output and providing follow-up instructions
  - Using examples and reference implementations in prompts

- **Common Pitfalls**
  - Vague prompts and the "just figure it out" trap
  - Over-constraining vs. under-constraining
  - Assuming the agent has context it does not have
  - Prompt length and token budget awareness

- **Agent-Specific Prompting**
  - OpenCode: leveraging interactive conversation and tool confirmations
  - Codex: writing standalone task descriptions for async execution

### Learning Outcomes

- Write clear, scoped prompts that produce predictable agent output
- Decompose complex development tasks into effective agent instructions
- Adapt prompting style to interactive (OpenCode) vs. async (Codex) workflows

---

## Module 4: Context Engineering

*Teaching your agent about your project, your standards, and your preferences before it writes a single line of code.*

### Topics

- **What is Context Engineering?**
  - Why agents need project context to produce good code
  - The difference between prompt context (per-task) and persistent context (project-level)
  - How context files reduce repetitive prompting

- **Context File Formats**
  - CLAUDE.md / AGENTS.md: purpose, structure, and best practices
  - Rules files (.cursorrules, .windsurfrules, and equivalents)
  - README.md as implicit context: what agents pick up automatically

- **Writing Effective Context Files**
  - Project architecture and directory structure descriptions
  - Coding conventions, naming patterns, and style guides
  - Technology stack and dependency information
  - Common patterns and anti-patterns in your codebase
  - Testing expectations and quality standards

- **Context Hierarchy and Layering**
  - Global vs. project vs. directory-level context
  - How agents resolve conflicting context
  - Keeping context files maintained as projects evolve

- **Practical Workshop**
  - Auditing a project and writing its first context file
  - Before/after comparison: agent output with and without context
  - Templates and starter examples for common project types

### Learning Outcomes

- Create effective context files that meaningfully improve agent output quality
- Understand the hierarchy and resolution order of context sources
- Maintain context files as living documents alongside project code

---

## Module 5: Agent Skills

*Extending what your agent can do by teaching it reusable capabilities.*

### Topics

- **What are Agent Skills?**
  - Skills as reusable, self-contained capability modules
  - How skills differ from prompts: structured, discoverable, and composable
  - The role of skills in reducing repetitive instruction

- **Skill Anatomy**
  - SKILL.md: the skill manifest and instruction file
  - Trigger descriptions: how agents know when to invoke a skill
  - Input/output contracts and expected behaviors
  - Supporting files: templates, scripts, and reference materials

- **Using Existing Skills**
  - Discovering and browsing available skills
  - Installing and configuring skills in your agent environment
  - Customizing skills for your project needs

- **Creating Your Own Skills**
  - Identifying repeatable tasks that are good skill candidates
  - Writing clear, unambiguous skill instructions
  - Testing and iterating on skill quality
  - Skill organization and naming conventions

- **Skill Design Patterns**
  - Single-purpose vs. multi-step skills
  - Skills that invoke other tools (file creation, linting, testing)
  - Progressive disclosure: keeping skills simple at the surface with depth available on demand

### Learning Outcomes

- Understand the skill abstraction and when to use it
- Use and configure existing skills in a coding agent workflow
- Create custom skills that encode team or project-specific workflows

---

## Module 6: MCP Servers

*Connecting your coding agent to external tools, services, and data sources.*

### Topics

- **What is MCP (Model Context Protocol)?**
  - The problem MCP solves: giving agents structured access to external systems
  - MCP architecture: clients, servers, tools, and resources
  - How MCP differs from function calling and plugin systems

- **Discovering and Evaluating MCP Servers**
  - Where to find MCP servers (registries, community repos, vendor offerings)
  - Evaluating server quality: documentation, maintenance, security posture
  - Understanding what tools and resources a server exposes

- **Configuring MCP Servers**
  - Configuration formats and file locations
  - Authentication and credential management
  - Environment variables and secrets handling
  - Per-project vs. global MCP configuration

- **Working with MCP in Practice**
  - Common MCP servers for development workflows (file systems, databases, APIs, git)
  - Chaining MCP tools within agent tasks
  - Debugging MCP connections and troubleshooting common issues

- **Security Considerations**
  - Understanding what access you are granting through MCP
  - Principle of least privilege in MCP configuration
  - Reviewing and auditing MCP server permissions

### Learning Outcomes

- Understand the MCP protocol and its role in agent tooling
- Configure and connect MCP servers to your coding agent
- Evaluate MCP servers for quality, security, and fitness for purpose

---

## Module 7: Subagents and Task Delegation

*How agents orchestrate complex work by delegating to specialized subagents.*

### Topics

- **What are Subagents?**
  - The concept of agent delegation and specialization
  - When a single agent is not enough: complexity, scope, and parallel work
  - Subagent vs. tool call vs. sequential prompting: understanding the distinctions

- **Subagent Patterns**
  - Fan-out / fan-in: distributing work across specialized subagents and collecting results
  - Pipeline: sequential handoff where each subagent handles one phase
  - Supervisor: a coordinating agent that delegates and reviews
  - Specialist: dedicated subagents for specific domains (testing, documentation, code review)

- **Practical Subagent Workflows**
  - Using subagents for code generation + test writing as parallel tasks
  - Documentation generation as a delegated subtask
  - Multi-file refactoring with coordinated subagents
  - Review and validation subagents that check primary agent output

- **Limitations and Tradeoffs**
  - Token cost multiplication with subagent patterns
  - Context loss between agent boundaries
  - When subagents add complexity without adding value
  - Debugging multi-agent failures

### Learning Outcomes

- Understand when and why to use subagent delegation
- Recognize common subagent patterns and their tradeoffs
- Apply subagent workflows to real development tasks

---

## Module 8: Security, Guardrails, and Safe Automation

*Keeping your codebase, credentials, and systems safe while working with AI coding agents.*

### Topics

- **Threat Model for Agent Workflows**
  - What can go wrong: unintended file modifications, credential exposure, destructive operations
  - Prompt injection risks in agent contexts
  - Supply chain considerations: third-party skills and MCP servers

- **Agent Permissions and Sandboxing**
  - Understanding agent permission models (auto-approve vs. confirm)
  - File system access boundaries and restricted paths
  - Network access controls and egress policies
  - Running agents in containers or sandboxed environments

- **Credential and Secret Management**
  - Never putting secrets in context files or prompts
  - Using environment variables and secret managers
  - Auditing agent output for accidentally leaked credentials
  - API key scoping and rotation practices

- **Code Review and Validation**
  - Treating agent output like any other code contribution: review before merge
  - Automated checks: linting, type checking, and test suites as guardrails
  - Git workflow practices: agent work on branches, never directly on main
  - Diff review habits for agent-generated code

- **Operational Safety**
  - Setting up undo/rollback mechanisms before running destructive tasks
  - Rate limiting and cost controls for API-backed agents
  - Monitoring and logging agent actions for auditability
  - When to stop the agent: recognizing loops, hallucinations, and drift

### Learning Outcomes

- Identify and mitigate the primary security risks of AI coding agent workflows
- Configure appropriate permission boundaries and sandboxing for agent environments
- Establish code review and validation practices for agent-generated code
- Implement credential management practices that prevent accidental exposure

---

## Future Expansion (Post-MVP Roadmap)

These topics are candidates for additional modules after the MVP launches:

- **Agentic Workflow Patterns:** ReAct, planning, reflection, and multi-agent orchestration patterns in depth
- **Cost Management and Token Optimization:** Strategies for managing API costs, caching, model selection, and efficient context usage
- **Building MCP Servers:** Moving from consumer to creator, building custom MCP servers for your team's tools and services
- **Agent-Driven Testing:** Using agents specifically for test generation, mutation testing, and coverage analysis
- **CI/CD Integration:** Embedding agents into continuous integration pipelines for automated code review, documentation updates, and migration tasks
- **Team Workflows:** Sharing context files, skills, and MCP configurations across a development team
- **Evaluating Agent Output Quality:** Metrics, benchmarks, and systematic approaches to measuring whether your agent is actually helping
- **Migrating Between Agents:** Porting workflows, context files, and skills between different agent platforms

---

## Site Structure Notes

### Suggested Technology Stack

- **Static site generator:** Astro Starlight
- **Content format:** Markdown with frontmatter for metadata
- **Navigation:** Sidebar following module order with expandable topic sections
- **Code examples:** Syntax-highlighted with copy buttons, language-tagged
- **Deployment:** GitLab Pages
