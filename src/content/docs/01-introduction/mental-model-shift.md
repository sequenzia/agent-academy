---
title: The mental model shift
description: Learn how to transition your thinking from writing code yourself to directing an agent that writes code, and build the mindset for effective agent-assisted development.
sidebar:
  order: 4
  label: The mental model shift
---

Working effectively with an AI coding agent requires more than learning new commands or tools. It requires a shift in how you think about your role in the development process. Instead of being the person who writes code, you become the person who directs, reviews, and guides an agent that writes code. This shift is the foundation of agent-assisted development.

## From author to director

When you write code by hand, you are the author. You make every decision: which file to edit, what pattern to use, how to name variables, when to run tests. The feedback loop runs through your brain -- you think, type, compile, debug, and repeat.

When you work with an AI coding agent, you shift to a director role. You describe what needs to happen, provide context for the agent to make good decisions, and review the output. The agent handles the mechanical work of reading files, writing code, running commands, and iterating on errors.

This does not mean you stop thinking about code. It means you think about it differently.

| As an author | As a director |
|---|---|
| "I need to write a validation function" | "I need to describe what the validation should do" |
| "I will use a regex for email validation" | "I will specify the validation rules and let the agent choose the implementation" |
| "I am debugging this function" | "I am reviewing whether the agent's implementation handles edge cases" |
| "I need to remember the test framework syntax" | "I need to describe the behavior I want tested" |
| "I will refactor this across 20 files" | "I will describe the target pattern and let the agent apply it" |

The director role is not passive. Directing an agent well requires clear communication, good judgment about task decomposition, and rigorous review of the output. These are skills, and the rest of this curriculum teaches them.

## Five key mindset changes

### 1. Invest in setup, not just execution

When you code by hand, you start typing as soon as you understand the problem. With an agent, time spent setting up context -- writing a clear prompt, maintaining a project context file, ensuring your codebase has good patterns for the agent to follow -- pays off across every task you delegate.

This is the core idea behind context engineering (covered in [Module 4](/04-context-engineering/overview/)). Spending 30 minutes writing a thorough `CLAUDE.md` file saves hours of correcting agent output over the following weeks.

### 2. Describe the "what," not the "how"

When you direct an agent, describe the desired outcome rather than the specific implementation steps. Instead of "create a file called `validators.ts`, import zod, define a schema with a string field for email that uses `.email()`...", try "add email validation to the signup form using the same validation library the project already uses."

The agent can read your codebase and figure out the implementation details. Your job is to communicate the intent clearly and set the right constraints. Prompt engineering (covered in [Module 3](/03-prompt-engineering/overview/)) teaches the techniques for doing this effectively.

There are exceptions: when the implementation approach matters for architectural reasons, performance, or consistency, be specific. The skill is knowing when to specify and when to let the agent decide.

### 3. Think in tasks, not keystrokes

Hand-coding trains you to think in terms of individual edits: "add this line here, change this function signature, update this import." Agent-directed development trains you to think in terms of tasks: "add input validation to the signup form," "refactor the data layer to use repository pattern," "write tests for the payment module."

Task-level thinking changes how you plan your work. Instead of a mental list of files to edit, you maintain a list of outcomes to achieve. The agent handles the translation from outcome to edits. This is especially valuable for multi-file changes where coordinating edits by hand is tedious and error-prone.

### 4. Review output, not process

When you write code by hand, you verify correctness as you go -- you know the code is right because you wrote it with intent. When an agent writes code, you verify correctness after the fact by reviewing the output.

This means your review skills become critical. You need to:
- Read diffs carefully, looking for subtle errors the agent may have introduced
- Run tests and verify they actually cover the intended behavior
- Check that the agent followed project conventions and patterns
- Watch for hallucinated APIs, incorrect assumptions about library behavior, or fabricated function signatures

Treating agent output like a code review from a junior developer is a useful mental model. The code is probably mostly right, but you need to verify it before merging.

### 5. Iterate, do not over-specify

It is tempting to write a massive, detailed prompt that tries to specify every aspect of the implementation up front. In practice, iterative prompting works better. Start with a clear, concise description of the task. Review the result. If the agent missed something, give it targeted feedback rather than rewriting the entire prompt.

This iterative approach mirrors the agent loop itself: you observe the agent's output, think about what to adjust, and act by providing refined instructions. Over time, you develop a feel for how much detail your agent needs for different types of tasks.

---

## Practical exercises

### Exercise: Identify agent-ready tasks

**Objective**: Practice applying the decision framework to real tasks from your development work.

**Prerequisites**: No tools needed. This is a reflection exercise.

**Steps**:

1. Think of five tasks you completed in the past week (or look at your recent git history for inspiration).
2. For each task, evaluate it against the decision framework from the previous section:
   - Was it well-defined?
   - Was it repetitive or boilerplate-heavy?
   - Did it span multiple files?
   - Could the result be verified easily?
3. Categorize each task as "strong agent fit," "hand-code," or "mixed."
4. For the tasks you categorized as "strong agent fit," write a one-sentence description of how you would delegate them to an agent.

**Verification**: Review your categorizations. If you marked everything as "hand-code" or everything as "strong agent fit," revisit the framework -- most developers have a mix. Compare your one-sentence delegations: are they specific enough that someone else (or an agent) could act on them?

**Stretch goal**: For one of the "mixed" tasks, outline how you would split it between hand-coding and agent delegation. Which part would you do yourself, and which part would you delegate?

### Exercise: Reframe a task as a delegation

**Objective**: Practice the mental model shift by converting an implementation plan into an agent prompt.

**Prerequisites**: No tools needed.

**Steps**:

1. Pick a feature or change you are planning to implement (or use this example: "add pagination to a list API endpoint").
2. Write down the implementation plan as you would approach it by hand -- specific files to edit, functions to write, tests to add.
3. Rewrite the plan as a task delegation for an agent. Focus on describing the outcome (what the code should do) rather than the process (which files to edit).
4. Compare the two versions. Notice what information is present in both (the "what") and what only appeared in the hand-coding plan (the "how").

**Verification**: Your agent-directed version should describe the desired behavior and constraints without specifying exact file edits. If it reads more like a set of instructions ("edit `api/routes.ts`, add a function called..."), revise it to focus on the outcome.

---

## Key takeaways

- AI coding agents follow the agent loop: Read context, Think about the task, Act using tools, Observe results, and repeat. This loop runs autonomously, unlike the request-response pattern of chat assistants.
- Agents fall into three categories -- terminal-based, IDE-integrated, and cloud-based -- each with different tradeoffs for control, speed, and workflow integration. OpenCode (terminal-based) and Codex (cloud-based) are the two agents this curriculum focuses on.
- Agents are strongest for well-defined, repetitive, multi-file tasks with clear verification criteria. They are weakest for exploratory work, security-critical code, and tasks requiring deep domain knowledge.
- The core mental model shift is from author to director: you describe outcomes, provide context, and review results instead of writing every line yourself.
- Investing in context and prompt quality (the agent's inputs) has a higher return than trying to control the agent's exact implementation approach (the agent's process).
- Iterative prompting outperforms over-specification. Start with a clear task description, review the result, and refine.

## Next steps

- **Next module**: [Setting up your agent environment](/02-setup/overview/) -- Install and configure OpenCode and Codex so you can start working with agents hands-on.
- **Prompt engineering**: [Module 3](/03-prompt-engineering/overview/) -- Learn techniques for writing effective prompts that produce predictable results.
- **Context engineering**: [Module 4](/04-context-engineering/overview/) -- Set up project-level context files so your agent produces code that matches your standards.
- **OpenCode documentation**: [OpenCode GitHub repository](https://github.com/anthropics/opencode)
- **Codex documentation**: [OpenAI Codex](https://openai.com/codex)
