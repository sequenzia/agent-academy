---
title: Limitations and tradeoffs
description: Understand the real costs of subagent delegation including token cost multiplication, context loss, complexity versus value, and debugging multi-agent failures.
sidebar:
  order: 4
  label: Limitations and tradeoffs
---

Subagent delegation can be powerful, but it is not free. Every delegation carries costs in tokens, context, complexity, and debuggability. Understanding these costs -- and being honest about when they outweigh the benefits -- is what separates effective delegation from expensive overhead.

## Token cost multiplication

Every subagent consumes tokens independently. Each one reads files, reasons about the task, generates output, and potentially runs tools -- all using its own token budget. The total token cost of a delegated task is not the sum of the subtask costs; it is the sum of the subtask costs *plus* the overhead each subagent spends on setup, context reading, and integration.

### How costs multiply

Consider a task that involves updating 5 service files. A single agent reads the project context once, learns the patterns, and applies them across all 5 files. Total context reading: once.

With fan-out delegation, 5 subagents each read the project context independently. Total context reading: 5 times. Each subagent also reads the reference files, the target file, and any shared utilities. The "overhead per subagent" -- the tokens spent on understanding the codebase rather than doing the actual work -- can be 30-60% of each subagent's total token usage.

| Approach | Subagents | Context reads | Overhead | Effective work |
|----------|-----------|---------------|----------|----------------|
| Single agent | 0 | 1 | Low | High ratio |
| Fan-out (5 tasks) | 5 | 5 | 5x overhead | Lower ratio per subagent |
| Supervisor + workers | 1 + 5 | 6 | 6x overhead + supervisor cost | Lowest ratio |

The supervisor pattern is the most expensive because the supervisor agent itself consumes tokens to coordinate, review, and potentially re-delegate work. A supervisor with 3 workers and 1 revision cycle can easily cost 8-10x the tokens of a single agent doing the same work.

### When the cost is justified

Token multiplication is worth it when:

- **Parallelism saves significant wall-clock time.** If 5 parallel subagents each take 2 minutes instead of a single agent taking 10 minutes, the 5x token cost may be worth the 5x speed improvement.
- **Context window limitations force splitting.** If the task genuinely exceeds what a single agent can handle in one context, delegation is not optional -- it is necessary.
- **Quality improves with fresh contexts.** If a single agent's quality degrades after processing the third or fourth file (losing track of conventions, making inconsistent decisions), fresh subagent contexts can produce better results.

### When the cost is not justified

Token multiplication is not worth it when:

- **The task is small.** Five files that each need a one-line change do not justify five subagent spawns. A single agent handles this faster and cheaper.
- **Speed does not matter.** If you are running the task overnight or while doing other work, the wall-clock time saving of parallelism has no value to you.
- **The coordination cost exceeds the work.** If specifying the delegation takes more effort than just doing the task, the delegation is overhead-negative.

:::caution
There is no built-in mechanism in most agents to track token usage across subagents in aggregate. You may not realize a delegation cost 10x more tokens than a single-agent approach until you check your API billing. Monitor your usage when experimenting with delegation, especially with the supervisor pattern.
:::

## Context loss between agents

The most fundamental limitation of subagent delegation is that subagents do not share context with each other or with the primary agent's full history. Each subagent starts fresh, knowing only what the primary agent explicitly passes to it.

### What gets lost

When the primary agent spawns a subagent, these elements from the primary conversation do not transfer automatically:

- **Decision history.** The reasoning behind earlier choices ("I used approach A instead of B because of constraint X") is not available to the subagent unless you include it in the delegation prompt.
- **Discovered context.** If the primary agent explored the codebase and found relevant patterns, those discoveries must be explicitly mentioned in the subagent's instructions. The subagent does not inherit "things the primary agent noticed."
- **Evolving requirements.** If the task requirements were refined through conversation ("actually, skip the admin endpoints"), the subagent receives the delegation prompt as written, not the full conversation that led to it.
- **Other subagents' output.** Subagent 3 does not know what subagents 1 and 2 produced, even if they worked on related parts of the same feature.

### Mitigating context loss

The primary defense against context loss is thorough delegation prompts. A good delegation prompt includes:

1. **The specific task** -- what the subagent should do
2. **Relevant context** -- project conventions, reference files to read, patterns to follow
3. **Constraints** -- what the subagent should *not* do
4. **Interface contracts** -- how this subagent's output relates to other subagents' work (shared types, naming conventions, file locations)

The more context you include in each delegation prompt, the better each subagent's output will be -- but the more tokens each subagent consumes, which feeds back into the cost multiplication problem. This is the fundamental tension of subagent delegation: context and cost are always in conflict.

### Context loss in practice

Here is a realistic example of context loss causing problems:

```text
Primary agent conversation:
- You discuss the feature requirements
- You decide to use the repository pattern for data access
- You choose Zod for validation because the project already uses it
- The primary agent delegates implementation to 3 subagents

Subagent 1 receives: "Implement the order service"
- Does not know about the repository pattern decision
- Creates direct database calls instead

Subagent 2 receives: "Add input validation to the order endpoint"
- Does not know Zod was chosen
- Uses Joi because it was in the agent's training data

Subagent 3 receives: "Write tests for the order module"
- Does not know about the implementation choices made by subagents 1 and 2
- Writes tests based on assumptions that may not match the actual implementation
```

The fix is straightforward but requires discipline: include the decisions in every delegation prompt.

```text
Better delegation prompt:

"Implement the order service.

Context:
- Use the repository pattern (see src/repositories/user.repository.ts)
- Use Zod for validation (see src/schemas/user.schema.ts)
- Follow error handling patterns in src/lib/errors.ts
- Do not make direct database calls; use the repository layer"
```

## Complexity versus value

Subagent delegation introduces coordination complexity. The question to ask is not "can I use subagents here?" but "does the delegation complexity produce enough value to justify itself?"

### Sources of complexity

**Task decomposition.** You must break the task into subtasks with clean boundaries. If the boundaries are not clean -- if subtasks share state, modify the same files, or depend on each other's output -- the decomposition itself becomes a source of bugs.

**Instruction duplication.** Each subagent needs its own complete instructions, including shared context. Maintaining consistency across N sets of instructions is an N-fold maintenance burden.

**Integration overhead.** After subagents complete their work, someone (you or the primary agent) must verify that the pieces fit together. Conflicting imports, inconsistent naming, incompatible interfaces -- these integration issues do not exist when a single agent does all the work.

**Debugging surface area.** When something goes wrong, you need to figure out which subagent produced the error, what context it had, and why it made the decision it did. This is harder than debugging a single agent's session.

### The complexity threshold

A helpful framework: subagent delegation is worth the complexity when the task meets all three of these conditions:

1. **The task takes more than 5-10 minutes for a single agent.** Below this threshold, the coordination overhead consumes more time than it saves.
2. **The subtasks are genuinely independent.** If you find yourself writing "after subagent 1 finishes, take its output and pass it to subagent 2, then take both outputs and pass them to subagent 3," you might be better off with a single agent working sequentially.
3. **The expected result is concrete and verifiable.** If you cannot write clear acceptance criteria for each subtask, the subagents will interpret their instructions differently and produce incompatible output.

### When subagents add more complexity than value

Be honest about these situations:

- **Small tasks split artificially.** Splitting a 3-file change into 3 subagent tasks creates coordination overhead for minimal benefit. A single agent handles this in one pass.
- **Tightly coupled changes.** If modifying file A requires knowing what changed in file B, the subtasks are not independent and should not be delegated separately.
- **Exploratory work.** When you do not know the solution shape yet -- "investigate why this is slow" or "figure out the right architecture for this feature" -- delegation is premature. Explore with a single agent first, then delegate the implementation once you know what to build.
- **One-off tasks.** If you will never do this task again, the investment in decomposition, instruction writing, and integration is wasted. Save delegation for workflows you will repeat.

:::note
A pattern that experienced developers recognize: the urge to over-engineer. Just as developers sometimes build elaborate abstractions for problems that needed a simple function, it is tempting to build elaborate delegation schemes for tasks that needed a single, well-written prompt. Resist this temptation. The simplest approach that works is the best approach.
:::

## Debugging multi-agent failures

When a delegated task produces incorrect results, debugging is harder than with a single agent because the failure could originate in any subagent, in the delegation itself, or in the integration.

### Common failure modes

**Instruction drift.** The subagent interpreted its instructions differently than you intended. This is the most common failure. The fix is usually more specific instructions, not more subagents.

**Context starvation.** The subagent did not have enough context to make good decisions. It made reasonable choices given what it knew, but those choices were wrong given the broader context. The fix is richer delegation prompts.

**Integration conflicts.** Individual subagent outputs are correct in isolation but incompatible when combined. Two subagents define the same type differently, import from different paths, or use different error handling approaches. The fix is shared interface contracts in the delegation prompts.

**Cascading errors in pipelines.** Subagent 1 makes a small mistake, subagent 2 builds on that mistake, and subagent 3 compounds both mistakes. Each stage looked reasonable given its input, but the final output is wrong. The fix is validation between pipeline stages.

### Debugging strategy

When a delegated task fails, follow this diagnostic process:

1. **Identify which output is wrong.** Look at the final integrated result and find the specific file, function, or behavior that is incorrect.
2. **Trace to the responsible subagent.** Determine which subagent produced the incorrect output. If you are using fan-out, this is straightforward -- each subagent owns specific files. If you are using a pipeline, check each stage's output.
3. **Review the subagent's instructions.** Did the instructions clearly specify what the subagent should do? Were they ambiguous? Missing key context?
4. **Check for context gaps.** Did the subagent have access to all the information it needed? If it made a wrong assumption, was the correct information available in its delegation prompt?
5. **Test the fix in isolation.** Before re-running the full delegation, fix the instructions and test the single subagent that failed. Only re-run the full delegation after confirming the isolated fix works.

### Reducing debugging costs

**Keep subagent count low.** Each additional subagent is another potential failure point. Use the minimum number of subagents that achieves your goal.

**Log delegation prompts.** Save the exact prompt each subagent received. When debugging, you need to see what the subagent was told, not what you think you told it.

**Add verification subagents.** As discussed in the practical workflows section, a dedicated validation subagent that reviews the integrated output catches integration issues before they propagate.

**Prefer fan-out over pipelines.** Fan-out failures are isolated -- subagent 3's mistake does not affect subagent 1's output. Pipeline failures cascade. When you have a choice, choose the pattern where failures are contained.

## Key takeaways

- Subagents are secondary agent instances spawned to handle delegated portions of a larger task, each operating in its own isolated context
- Use subagent delegation when tasks are naturally decomposable into independent pieces, exceed a single context window, or benefit from parallelism
- The four core patterns are fan-out/fan-in (parallel identical work), pipeline (sequential stages), supervisor (iterative quality control), and specialist (role-specific expertise)
- Consistent shared context across subagents -- reference files, naming conventions, interface contracts -- is the single most important factor in producing integrable results
- Token costs multiply with each subagent because each reads context independently; the supervisor pattern is the most expensive
- Context loss between agents is the fundamental limitation; mitigate it with thorough delegation prompts that include decisions, constraints, and conventions
- Start with the simplest approach (single agent) and add delegation only when you have evidence that simplicity is insufficient
- When debugging multi-agent failures, trace the issue to a specific subagent, review its instructions, check for context gaps, and test the fix in isolation

## Next steps

- **Next module**: [Security, guardrails, and safe automation](/08-security/overview/) -- Learn how to use AI coding agents safely, covering threat models, permissions, credential management, and operational safety practices.
- **Related**: [Prompt engineering](/03-prompt-engineering/overview/) -- The same principles that make individual prompts effective also make subagent delegation prompts reliable.
- **Related**: [Context engineering](/04-context-engineering/overview/) -- Effective subagent delegation depends on providing the right context to each subagent, which is context engineering applied at the delegation level.
- **Related**: [Agent skills](/05-agent-skills/overview/) -- Skills can be used to standardize delegation workflows, encoding your decomposition patterns as reusable capabilities.
