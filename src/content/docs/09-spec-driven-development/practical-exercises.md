---
title: Practical exercises
description: Reinforce your SDD learning through hands-on exercises — write a specification, walk through the full pipeline, and compare SDD results against ad-hoc prompting.
sidebar:
  order: 5
  label: Practical exercises
---

The previous pages covered the SDD methodology, specification writing, task decomposition, and execution with verification. These exercises give you hands-on practice applying those concepts to realistic scenarios. Each exercise focuses on a different aspect of the SDD workflow, and the final exercise puts SDD head-to-head against ad-hoc prompting so you can see the difference for yourself.

All three exercises are tool-agnostic. You can complete them with any AI coding agent that supports multi-file operations and subagent delegation, or you can work through the methodology manually to build familiarity before automating it.

---

## Exercise 1: Write a specification

### Exercise: Specify a user notification preferences feature

**Objective**: Write a complete SDD specification for a realistic feature, practicing requirements capture, acceptance criteria writing, and scope definition.

**Prerequisites**: Familiarity with the [specification structure and depth levels](/09-spec-driven-development/writing-specifications/) covered earlier in this module. A text editor for writing the spec (no coding agent needed for this exercise).

**Steps**:

1. **Read the feature scenario.** You are building a notification preferences system for a web application. Users need to control which types of notifications they receive (account alerts, marketing emails, product updates, security notices) and through which channels (email, in-app, SMS). The system should have sensible defaults for new users, allow bulk updates (e.g., "mute all marketing"), and respect a global "do not disturb" toggle that silences everything except security notices.

2. **Write the problem statement.** In 2-3 sentences, describe why this feature is needed. What is the current state? What problem does the absence of notification preferences create for users?

3. **Define the proposed solution.** Write an overview section describing your approach at a high level. Include a table of key features with priority levels (P0 for must-have, P1 for important, P2 for nice-to-have).

4. **Capture functional requirements.** List the specific behaviors the system must support. Aim for 8-12 requirements covering:
   - Default preferences for new users
   - Per-category and per-channel controls
   - The global "do not disturb" toggle and its exception for security notices
   - Bulk update operations
   - Persistence and retrieval of preferences

5. **Write testable acceptance criteria.** For each functional requirement, write at least one acceptance criterion using the category format from the [task decomposition](/09-spec-driven-development/task-decomposition/) page:
   - **Functional**: Core behaviors that must work
   - **Edge cases**: Boundary conditions (e.g., what happens when a user enables "do not disturb" but already has a pending marketing notification?)
   - **Error handling**: Invalid inputs, missing data, conflicting settings

6. **Define scope boundaries.** Write explicit "in scope" and "out of scope" sections. Consider: is the notification delivery mechanism in scope, or just the preferences storage? Is the UI for managing preferences in scope, or just the API?

7. **Review your spec.** Read through the complete specification and check it against these questions:
   - Could a developer who has never seen this feature build it from your spec alone?
   - Are the acceptance criteria specific enough to write automated tests against?
   - Is every requirement traceable to a business need stated in the problem statement?

**Verification**: Evaluate your specification against this rubric:

| Criterion | What to check |
|-----------|--------------|
| **Completeness** | Problem statement, solution overview, functional requirements, acceptance criteria, and scope boundaries are all present |
| **Testability** | Every acceptance criterion describes a specific, observable behavior — not a subjective quality like "user-friendly" or "fast" |
| **Scope clarity** | A reader can unambiguously determine what is included and excluded without asking clarifying questions |
| **Traceability** | Each acceptance criterion maps back to a functional requirement, and each requirement maps back to the problem statement |
| **Appropriate depth** | The spec provides enough detail for task decomposition without dictating implementation (data structures, algorithms, or specific libraries) |

**Stretch goal**: Swap specs with a colleague (or revisit your own spec after a day). Try to decompose it into tasks without asking the author any questions. Every question you need to ask reveals a gap in the spec.

---

## Exercise 2: Full pipeline walkthrough

### Exercise: Build a markdown link checker using all four SDD phases

**Objective**: Walk through the complete SDD pipeline — specification, quality analysis, task decomposition, and execution — for a small but non-trivial feature, experiencing each phase transition firsthand.

**Prerequisites**: An installed AI coding agent capable of reading and creating files. Familiarity with all four SDD phases from the earlier pages in this module ([methodology](/09-spec-driven-development/the-sdd-methodology/), [specifications](/09-spec-driven-development/writing-specifications/), [decomposition](/09-spec-driven-development/task-decomposition/), [execution](/09-spec-driven-development/execution-and-verification/)).

**Steps**:

**Phase 1: Specification**

1. Write a specification for a command-line tool that scans markdown files in a directory, extracts all links (both inline `[text](url)` and reference-style `[text][ref]`), checks whether each link is valid (HTTP links return a 2xx status, relative file links point to an existing file), and reports the results.

2. Include these sections in your spec: problem statement, proposed solution with a feature table, functional requirements, acceptance criteria (functional, edge cases, error handling), and scope boundaries.

3. Aim for a high-level overview depth — enough detail to decompose into tasks, but not prescribing specific libraries or implementation patterns.

:::tip
Keep the spec focused. A link checker for markdown files is well-bounded enough for this exercise. Resist the urge to add features like link caching, parallel HTTP requests, or CI integration — those are out of scope for this exercise.
:::

**Checkpoint 1**: Before moving to Phase 2, verify your spec answers these questions:
- What types of links does the tool check? (HTTP, relative file, both?)
- What counts as a "valid" link for each type?
- What does the output look like? (Exit code, report format, error messages?)
- What is explicitly out of scope?

**Phase 2: Quality analysis (optional)**

4. Review your specification for gaps, ambiguities, and untestable requirements. Check each acceptance criterion: could you write an automated test for it? If a criterion says "handles errors gracefully," that is too vague — rewrite it to specify the exact behavior.

5. Look for missing edge cases. Consider: empty directories, files with no links, malformed markdown, links to localhost, redirect chains, timeout behavior.

**Checkpoint 2**: After quality analysis, your spec should have at least 3 edge case criteria and 2 error handling criteria that were not in the original draft.

**Phase 3: Task decomposition**

6. Decompose your specification into 5-8 atomic tasks. For each task, define:
   - A clear subject line describing what the task produces
   - A description with enough context for an independent agent to execute it
   - Acceptance criteria (functional at minimum, plus edge cases where relevant)
   - Dependencies on other tasks (which tasks must complete before this one can start?)

7. Arrange tasks into waves based on their dependencies. Wave 1 tasks have no dependencies. Wave 2 tasks depend on Wave 1 tasks, and so on.

**Checkpoint 3**: Verify your decomposition by checking:
- Can each task be completed by an agent that has no knowledge of other tasks beyond what is in the shared context?
- Does every acceptance criterion from the spec map to at least one task?
- Are there any circular dependencies?

**Phase 4: Execution**

8. Execute the tasks using your AI coding agent. Start with Wave 1 tasks. After each task completes, review the output against its acceptance criteria before moving to the next task.

9. Maintain a shared context file (a markdown file) that accumulates learnings as tasks complete. After each task, append:
   - What files were created or modified
   - What patterns or conventions were established
   - Any issues encountered and how they were resolved

10. After all tasks complete, run the finished tool against a directory containing markdown files with a mix of valid links, broken links, and edge cases. Verify the output matches your specification's acceptance criteria.

**Checkpoint 4**: Final verification — does the tool:
- Find all links in markdown files (inline and reference-style)?
- Correctly identify valid and broken HTTP links?
- Correctly identify valid and broken relative file links?
- Produce the output format specified in your spec?
- Handle the edge cases you defined?

**Verification**: You have successfully completed this exercise if you can trace a line from every feature in the finished tool back through a specific task, to a specific acceptance criterion, to a specific requirement in the specification. The pipeline should be fully traceable: spec to tasks to code.

**Stretch goal**: After completing the pipeline, identify one area where the spec was insufficient — a requirement you discovered during execution that was not captured in the original specification. Write a "lessons learned" entry describing what the gap was and how you would prevent it in future specs.

---

## Exercise 3: Ad-hoc versus SDD comparison

### Exercise: Build the same feature two ways and compare

**Objective**: Build the same feature using ad-hoc prompting and then using SDD, and compare the results on consistency, completeness, and verification coverage.

**Prerequisites**: An installed AI coding agent. Enough time to build the same feature twice (plan for 30-60 minutes per approach). Familiarity with the SDD pipeline from the earlier pages in this module.

**Steps**:

**Part A: Ad-hoc approach**

1. **Read the feature description.** Build a configuration file validator: a tool that reads a YAML or JSON configuration file, validates it against a set of rules (required fields present, correct types, values within allowed ranges, no unknown fields), and reports validation results with clear error messages pointing to the specific field and rule that failed.

2. **Build it with ad-hoc prompting.** Open a fresh session with your AI coding agent and describe the feature in your own words. Do not write a specification first. Prompt the agent naturally, as you would if you had never heard of SDD. Use follow-up prompts to refine and fix issues as they come up.

3. **Record your process.** As you work, note:
   - How many prompts you sent
   - How many times you had to correct or redirect the agent
   - How long the process took
   - What the agent got right on the first attempt and what required iteration

4. **Save the result.** Keep the completed code in a directory named `adhoc-validator/` (or similar).

**Part B: SDD approach**

5. **Write a specification.** For the same configuration validator feature, write a structured specification following the format from [writing specifications](/09-spec-driven-development/writing-specifications/). Include problem statement, functional requirements, acceptance criteria (functional, edge cases, error handling), and scope boundaries.

6. **Decompose into tasks.** Break the specification into dependency-ordered tasks with acceptance criteria, following the patterns from [task decomposition](/09-spec-driven-development/task-decomposition/).

7. **Execute the tasks.** Work through the tasks in dependency order, maintaining a shared context file. Verify each task against its acceptance criteria before proceeding to the next.

8. **Save the result.** Keep the completed code in a directory named `sdd-validator/` (or similar).

**Part C: Comparison**

9. **Run both implementations against the same test inputs.** Create a set of test configuration files that cover:
   - A valid configuration with all required fields
   - A configuration missing a required field
   - A configuration with a wrong type (e.g., string where number expected)
   - A configuration with a value outside allowed range
   - A configuration with an unknown field
   - An empty configuration file
   - A malformed file (invalid YAML/JSON syntax)

10. **Score both implementations** using this rubric:

| Criterion | What to evaluate | Ad-hoc score (1-5) | SDD score (1-5) |
|-----------|-----------------|---------------------|------------------|
| **Consistency** | Do all code files follow the same patterns (naming, error handling, structure)? | | |
| **Completeness** | How many of the 7 test scenarios above produce correct results? | | |
| **Error messages** | Are validation errors specific (field name + rule + expected value) or generic ("invalid config")? | | |
| **Edge case handling** | Does the implementation handle empty files, malformed input, and boundary values? | | |
| **Verification coverage** | Could you write automated tests for the implementation based on documented criteria? | | |
| **Traceability** | Can you trace each behavior in the code back to a documented requirement? | | |

11. **Reflect on the process.** Compare the two approaches across these dimensions:
    - **Time**: How did total time compare? Include the time spent writing the spec and decomposing tasks for the SDD approach.
    - **Rework**: How many corrections did each approach require?
    - **Confidence**: Which result are you more confident in? Why?
    - **Predictability**: If you gave the same feature to a different developer with the same agent, which approach would produce more similar results?

**Verification**: You have successfully completed this exercise if you have two working implementations, a filled-out comparison rubric, and written reflections on the process differences. The goal is not to prove SDD is always better — it is to understand concretely where each approach has advantages and where SDD's upfront investment pays off.

**Stretch goal**: Run the comparison a second time with a different feature (e.g., a file rename tool, a test scaffold generator, or a simple REST API). See if the relative scores change with a different type of feature. SDD's advantage tends to grow as feature complexity increases — does your experience match this?

---

## Key takeaways

- Writing a good specification is a skill that improves with practice — the evaluation rubric (completeness, testability, scope clarity, traceability) gives you concrete criteria to assess your own specs
- The full SDD pipeline creates a traceable chain from requirements to code, where every behavior in the implementation maps back to a documented criterion
- Phase transitions are natural checkpoints: verify your spec before decomposing, verify your tasks before executing, verify your output before declaring done
- The comparative exercise reveals SDD's strengths empirically rather than theoretically — consistency, completeness, and verification coverage tend to be measurably higher with SDD
- SDD's upfront investment in specification and decomposition pays off most for features with multiple files, edge cases, and specific acceptance criteria
- Ad-hoc prompting remains effective for small, well-understood tasks — the goal is knowing when to reach for each approach, not replacing one with the other

## Next steps

- **Review the full module**: [Module overview](/09-spec-driven-development/overview/) — Revisit the module structure and key takeaways for a consolidated view of everything covered.
- **Related**: [Prompt engineering](/03-prompt-engineering/overview/) — The prompting skills from Module 3 directly apply to writing effective specifications and task descriptions in SDD.
- **Related**: [Context engineering](/04-context-engineering/overview/) — Specifications are a specialized form of context engineering; the principles of writing good context files strengthen your spec-writing ability.
- **Related**: [Subagents and task delegation](/07-subagents/overview/) — The execution phase of SDD builds directly on the delegation patterns covered in Module 7.
