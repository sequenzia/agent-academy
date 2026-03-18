# sdd-module PRD

**Version**: 1.0
**Author**: Stephen Sequenzia
**Date**: 2026-03-18
**Status**: Draft
**Spec Type**: New feature
**Spec Depth**: High-level overview
**Description**: A new Agent Academy curriculum module teaching the Spec-Driven Development (SDD) workflow and methodology as a generic, tool-agnostic framework.

---

## Executive Summary

This module introduces Spec-Driven Development (SDD) — a structured methodology for building software features with AI coding agents. Instead of ad-hoc prompting, SDD follows a disciplined pipeline: idea → specification → analysis → tasks → execution. A key differentiator of SDD is its execution model: atomic tasks are delegated to independent subagents that work in parallel, sharing context and learnings through markdown files so each successive agent builds on previous work. The module teaches generic SDD principles through a conceptual model that students can apply with any AI agent tooling.

## Problem Statement

### The problem

The Agent Academy curriculum teaches individual agent capabilities — prompting, context engineering, skills, MCP, subagents, and security — but lacks guidance on how to orchestrate these capabilities into a coherent, repeatable development workflow. Students who complete the existing modules know *how* to use agents for isolated tasks but not *how* to use agents for systematic feature development.

### Current state

Students finishing Modules 1-8 default to ad-hoc prompting: describing features in natural language and letting the agent generate code directly. This approach works for small tasks but breaks down for complex features — requirements get lost, edge cases are skipped, verification is inconsistent, and rework compounds.

### Impact

Without a structured methodology, students cannot reliably use AI agents for non-trivial development work. They either revert to manual development for complex features or produce inconsistent results. This undermines the value proposition of AI coding agents for real-world projects.

## Proposed Solution

### Overview

Add Module 9: Spec-Driven Development to the Agent Academy curriculum. The module teaches SDD as a generic 4-phase methodology — Specification, Quality Analysis (optional), Task Decomposition, and Execution — using a conceptual model with named phases and principles. Students learn *what* each phase does, *why* it matters, and *how* to apply it with any tooling. Three exercise types reinforce the learning: spec writing, full pipeline walkthroughs, and comparative exercises (ad-hoc vs SDD).

### Key features

| Feature | Description | Priority |
|---------|-------------|----------|
| SDD conceptual model | Named phases, principles, and mental model for the full spec → code pipeline | P0 |
| Phase 1: Specification | Teaching structured requirements capture with testable acceptance criteria | P0 |
| Phase 2: Quality analysis | Teaching spec review and quality gates (clearly marked as optional) | P1 |
| Phase 3: Task decomposition | Teaching how to break specs into dependency-ordered, implementable tasks | P0 |
| Phase 4: Execution | Teaching subagent-based execution where atomic tasks are delegated to independent agents that share context via markdown files, enabling parallel work with accumulated learnings | P0 |
| Comparative exercises | Side-by-side comparison of ad-hoc prompting vs SDD for the same feature | P0 |
| Spec writing exercises | Hands-on practice writing specs with acceptance criteria | P0 |
| Full pipeline exercises | End-to-end walkthrough of all 4 SDD phases | P1 |
| When to use SDD | Guidance on evaluating when SDD is appropriate vs overkill | P0 |

## Success Metrics

| Metric | Current | Target | How Measured |
|--------|---------|--------|--------------|
| SDD methodology coverage | None | Complete conceptual coverage of all 4 phases | Content review against SDD phase checklist |
| Exercise variety | N/A | 3 exercise types (spec writing, full pipeline, comparative) | Exercise audit |
| Tool-agnosticism | N/A | Zero references to specific tool setup or configuration | Content audit for tool-specific language |
| Learning outcome achievement | N/A | Students can write specs, run the pipeline, and evaluate when to use SDD | Exercise completion criteria |

## User Personas

### Primary user: Agent Academy student
- **Role**: Developer learning to use AI coding agents effectively
- **Goals**: Understand how to use agents for systematic, non-trivial feature development — not just one-off tasks
- **Pain Points**: Knows individual agent skills but lacks a methodology for orchestrating them into a repeatable workflow; ad-hoc prompting fails for complex features

### Secondary user: Experienced developer exploring SDD
- **Role**: Developer already familiar with AI agents who wants a structured development methodology
- **Goals**: Learn a formal framework for specification-driven development to improve consistency and quality
- **Pain Points**: Has tried AI-assisted development but found results inconsistent; wants a systematic approach

## Scope

### In scope

- Generic SDD methodology and principles (tool-agnostic)
- Conceptual model of all 4 phases with named stages and principles
- The subagent execution model as a core SDD concept: atomic tasks delegated to independent agents that share context and learnings via markdown files
- Advanced concepts taught conceptually (dependency inference, wave-based parallelism, context accumulation, verification patterns)
- The role and structure of specifications as the single source of truth
- Acceptance criteria writing and spec quality evaluation
- Task decomposition patterns and dependency ordering
- Verification-driven execution with context sharing across agent boundaries
- Guidance on when SDD is appropriate and how to adapt it
- Three exercise types: spec writing, full pipeline, comparative
- Mermaid diagrams for workflow visualization

### Out of scope

- Tool-specific setup or configuration instructions (no Claude Code, sdd-tools, OpenCode, or Codex setup)
- Tool-specific UI or CLI commands
- Implementation details of specific SDD tool internals (hooks, session management, file formats)

## Suggested Module Structure

The module follows the established Agent Academy pattern: overview page + content pages.

### Overview page (`overview.md`)
- What SDD is and why it matters
- Learning outcomes, prerequisites, module structure
- Key takeaways, next steps

### Page 1: The SDD methodology (`the-sdd-methodology.md`)
- The problem with ad-hoc agent development
- SDD conceptual model: the 4-phase pipeline
- Core principles (spec as source of truth, testable requirements, dependency-driven execution, subagent-based parallelism with shared markdown context, verification-based completion)
- When to use SDD vs simpler approaches

### Page 2: Writing specifications (`writing-specifications.md`)
- Anatomy of a good specification
- Requirements capture: problem, goals, functional requirements
- Writing testable acceptance criteria
- Spec depth levels (high-level, detailed, full technical)
- Quality analysis as an optional review gate

### Page 3: Task decomposition (`task-decomposition.md`)
- From spec to tasks: decomposition patterns
- Dependency inference and ordering
- Task granularity by spec depth
- Acceptance criteria categorization (functional, edge cases, error handling, performance)

### Page 4: Execution and verification (`execution-and-verification.md`)
- The subagent execution model: delegating atomic tasks to independent agents
- Shared context through markdown files: how each agent's learnings flow to subsequent agents
- Wave-based parallelism: grouping tasks by dependency order and executing independent tasks concurrently
- The agent workflow: understand → implement → verify → complete
- Verification against acceptance criteria
- Handling failures, retries, and context accumulation across waves

### Page 5: Practical exercises (`practical-exercises.md`)
- Exercise 1: Spec writing — write a spec for a given feature
- Exercise 2: Full pipeline — walk through all 4 SDD phases
- Exercise 3: Comparative — solve the same feature ad-hoc vs SDD, compare results
- Key takeaways, next steps

## Implementation Phases

### Phase 1: Content creation
**Goal**: Write all module content following Agent Academy conventions
- Create `src/content/docs/09-spec-driven-development/` directory
- Write overview.md and all 5 content pages
- Create Mermaid diagrams for SDD workflows
- Follow content style guide (sentence case, terminology, exercise format)

### Phase 2: Integration
**Goal**: Integrate the module into the existing site
- Add Module 9 sidebar entry to `astro.config.mjs`
- Add Module 9 LinkCard to homepage (`index.mdx`)
- Update cross-references from Module 8 to point to Module 9 as next steps
- Verify build succeeds with `npm run build`

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Content becomes too tool-specific | High | Medium | Review all content against tool-agnosticism criteria; use generic terminology throughout |
| Module assumes too much AI agent knowledge | Medium | Low | Minimal prerequisites specified; provide brief context for advanced concepts |
| SDD concepts feel abstract without tool examples | Medium | Medium | Use the conceptual model framework and concrete (but generic) examples; comparative exercises ground the theory |
| Module doesn't connect to rest of curriculum | Low | Low | Cross-reference earlier modules where SDD builds on their concepts (e.g., context engineering for specs, skills for automation) |

## Dependencies

- **Existing curriculum (Modules 1-8)**: Must be stable — no structural changes needed, but Module 8's "next steps" section should reference Module 9
- **Content style guide**: Module must follow `docs/content-style-guide.md` conventions
- **Module template**: Module must follow `docs/module-content-template.md` structure
- **Astro/Starlight**: No framework changes needed — standard content pages

## Checkpoint Gates

- [ ] **Content review**: All pages reviewed for tool-agnosticism before integration
- [ ] **Style compliance**: Content verified against style guide
- [ ] **Build verification**: `npm run build` succeeds with new module
- [ ] **Exercise quality**: All three exercise types are actionable and have clear verification steps

## Stakeholder Sign-off

| Role | Name | Status |
|------|------|--------|
| Author | Stephen Sequenzia | Pending |

---

*Document generated by SDD Tools*
