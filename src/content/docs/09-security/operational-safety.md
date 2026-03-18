---
title: Operational safety
description: Undo and rollback strategies, rate limiting, cost controls, monitoring agent behavior, and recognizing loops and hallucinations.
sidebar:
  order: 5
  label: Operational safety
---

Permissions and code review catch problems before they happen. Operational safety catches them after they start. This section covers the practices and tools that help you recover from agent mistakes, control costs, monitor agent behavior, and recognize when something has gone wrong.

---

## Undo and rollback

The ability to undo agent actions is your safety net. Git provides the primary undo mechanism for code changes, but other actions (running commands, modifying system state) require additional strategies.

### Git-based rollback

Git makes reversing code changes straightforward, as long as you commit regularly and work on branches:

**Undo uncommitted changes:**

```bash
# Discard all uncommitted changes (careful -- this is irreversible)
git checkout .

# Discard changes to a specific file
git checkout -- src/auth/login.ts

# Stash changes if you might want them later
git stash
```

**Revert a specific commit:**

```bash
# Create a new commit that undoes the changes from a specific commit
git revert abc1234

# Revert the last commit
git revert HEAD
```

**Reset a branch to a previous state:**

```bash
# Move the branch pointer back, keeping changes as uncommitted
git reset --soft HEAD~3

# Move the branch pointer back and discard changes completely
git reset --hard HEAD~3
```

**Delete a branch and start over:**

```bash
# If the agent's branch is unsalvageable, delete it and start fresh
git checkout main
git branch -D feat/agent-attempt-1
git checkout -b feat/agent-attempt-2
```

:::tip
Ask the agent to commit after each meaningful step, not just at the end. Frequent commits give you more granular rollback points. If step 3 of 5 went wrong, you can revert to step 2 without losing steps 1 and 2.
:::

### Non-git rollback

Some agent actions are not tracked by git:

- **File system changes outside the repo.** If the agent creates files in `/tmp` or modifies dotfiles, git does not track them. Note these in your session log.
- **Installed packages.** The agent runs `npm install some-package` and it is added to `node_modules` and `package-lock.json`. You can undo this with `git checkout package.json package-lock.json && npm install`.
- **Running services.** The agent starts a database container or a dev server. These persist after the agent session ends. Check `docker ps` and your process list after agent sessions.
- **Database changes.** If the agent ran migrations or seed commands against a local database, you may need to reset the database to undo those changes.

### The snapshot approach

For tasks with high risk, take a snapshot before the agent starts:

```bash
# Create a known-good commit before the agent starts working
git add -A && git commit -m "checkpoint: before agent task"

# Or create a tag for easy reference
git tag pre-agent-task
```

After the agent finishes, you can always return to this point:

```bash
# Return to the checkpoint
git reset --hard pre-agent-task
```

---

## Rate limiting

Rate limiting controls how fast and how much the agent does. Without limits, an agent can generate hundreds of API calls, create dozens of files, or consume significant compute resources in minutes.

### Token and cost awareness

Every agent interaction consumes tokens (the units that language model providers charge for). Longer conversations, larger codebases, and more complex tasks consume more tokens. Be aware of:

- **Context window size.** The more files the agent reads, the more tokens it uses per interaction. A project with large context files and many source files can exhaust the context window quickly.
- **Conversation length.** Long sessions accumulate token usage. Starting a new session for a new task is often both cheaper and more effective than continuing a long conversation.
- **Multi-agent workflows.** When using subagents ([Module 7](/07-subagents/overview/)), each subagent consumes its own tokens. A task that spawns 5 subagents can cost 5 times what a single-agent approach costs.

### Setting usage limits

Most agent platforms provide usage controls:

**OpenCode:**

- Set a per-session token budget in your configuration if your provider supports it
- Monitor token usage through your API provider's dashboard
- Use a proxy or gateway that enforces rate limits on API calls

**Codex:**

- Configure spending limits in your account settings
- Set per-task or per-month limits to prevent runaway costs
- Review usage reports to understand your consumption patterns

### Practical cost controls

| Control | How to implement | What it prevents |
|---------|-----------------|-----------------|
| Per-session budget | Set max tokens in agent config or provider settings | A single task consuming your entire monthly budget |
| Per-month spending limit | Configure in provider dashboard | Unexpected charges from automated workflows |
| Task timeout | Set a time limit for agent sessions | Agent stuck in a loop burning tokens indefinitely |
| Batch size limits | Break large tasks into smaller units | A single oversized task consuming excessive resources |

---

## Cost controls

Beyond rate limiting, cost controls ensure you do not spend more than expected on agent-assisted workflows.

### Monitoring spend

Track your agent-related costs across these categories:

- **API token usage.** The primary cost for most agent workflows. Monitor through your provider's dashboard or billing API.
- **Compute costs.** Codex tasks run in cloud sandboxes that may incur compute charges. OpenCode runs locally, so compute cost is your own hardware.
- **MCP server costs.** Some MCP servers connect to paid APIs (databases, search engines, cloud services). Each MCP call can generate its own charges.
- **CI/CD costs.** More frequent agent-driven commits mean more CI pipeline runs. Factor this into your cost model.

### Budget strategies

**Start small.** When experimenting with a new agent workflow, set a low budget and increase it as you understand the cost profile.

**Separate agent budgets.** If your team uses agents, create a separate API key or billing group for agent usage so you can track and cap it independently from other AI usage.

**Review before scaling.** Before running an agent workflow across a large codebase (e.g., "update all 200 components to use the new API"), run it on 3-5 files first to estimate the total cost.

---

## Monitoring

Monitoring agent behavior helps you detect problems as they happen rather than discovering them in review.

### What to monitor

**Session output.** Most agents display their reasoning and actions as they work. Watch for:

- Unexpected file reads (the agent exploring files unrelated to the task)
- Commands you did not expect (especially anything involving `rm`, `drop`, `reset`, or `force`)
- Repeated attempts at the same action (a sign the agent is stuck)
- Error messages the agent is ignoring or working around

**File changes.** Track which files the agent modifies in real time:

```bash
# Watch for file changes in your project directory
# Run in a separate terminal during the agent session
fswatch -r src/ tests/
```

**Resource usage.** During long agent sessions, monitor system resources:

```bash
# Check if the agent is consuming excessive CPU or memory
top -l 1 | grep -i opencode
```

### Log retention

Keep a record of agent sessions for post-incident analysis:

- **Session transcripts.** Most agents can export or log their conversation history. Save these for tasks that modify production-adjacent code.
- **Git history.** With frequent commits, git history provides an action-by-action record of what the agent did.
- **CI/CD logs.** CI pipeline output for agent-generated branches shows exactly what passed and failed.

---

## Recognizing loops and hallucinations

Agents can get stuck in failure loops or produce output that looks correct but is fabricated. Recognizing these patterns early saves time and prevents the agent from making things worse.

### Failure loops

A failure loop occurs when the agent encounters an error, attempts a fix, creates a new error, and repeats the cycle. Common patterns:

**The fix-break cycle:**

1. Agent runs tests -- one test fails
2. Agent modifies the code to fix the test
3. A different test now fails
4. Agent modifies code to fix the second test
5. The first test fails again
6. Repeat indefinitely

**The dependency spiral:**

1. Agent tries to install a package -- version conflict
2. Agent upgrades the conflicting package
3. Another package now has a conflict
4. Agent downgrades, then upgrades, then tries a different version
5. `package-lock.json` grows chaotically

**The permission loop:**

1. Agent tries a command -- permission denied
2. Agent tries a workaround -- also denied
3. Agent tries `sudo` or changes file permissions
4. Original approach still does not work
5. Repeat with increasingly aggressive permission changes

### How to spot loops

Watch for these signals:

- **Repetitive actions.** The agent edits the same file more than 3 times in sequence.
- **Growing undo/redo chains.** The agent reverts a change and tries something similar.
- **Escalating scope.** The agent starts modifying files outside the task scope to "fix" issues.
- **Increasing token usage.** Long sessions with diminishing progress.
- **The agent says "let me try a different approach"** more than twice for the same problem.

When you spot a loop:

1. **Stop the agent.** Interrupt the session before it makes more changes.
2. **Assess the state.** Check `git diff` to see what the agent changed.
3. **Decide: continue or reset.** If the changes are partially useful, commit the good parts and start a new session for the remaining work. If the changes are a mess, reset to your last good commit.
4. **Reframe the task.** Loops often indicate the task is ambiguous or too broad. Break it into smaller, clearer subtasks.

### Hallucinations

Hallucinations in agent output include:

- **Inventing APIs that do not exist.** The agent calls `response.getSecureHeaders()` on a framework that has no such method. The code looks plausible but fails at runtime.
- **Fabricating package names.** The agent suggests `npm install express-secure-auth` when no such package exists.
- **Incorrect documentation references.** The agent says "according to the Express documentation, you should use `app.secureListen()`" -- a method that does not exist.
- **Phantom files.** The agent references a utility function in `src/utils/secure-hash.ts` that it believes exists but was never created.

### How to catch hallucinations

- **Run the code.** Hallucinated APIs fail at runtime. Do not assume code is correct just because the agent wrote it confidently.
- **Verify packages exist.** Before running `npm install <package>`, search for the package on the registry to confirm it is real.
- **Check documentation claims.** If the agent cites a specific API or feature, verify it in the official documentation.
- **Read error messages carefully.** "Method not found" and "Module not found" errors after agent changes are hallucination red flags.

---

## Practical exercises

### Exercise: Set up a security-hardened agent workflow

**Objective**: Configure a complete security workflow for a project, covering permissions, secret scanning, and code review practices.

**Prerequisites**: A project with git initialized, an AI coding agent installed (OpenCode or Codex), and Node.js or Python available for tooling.

**Steps**:

1. **Create a `.env.example` file** in your project root listing all required environment variables with placeholder values. Verify that `.env` is in your `.gitignore`.

2. **Add secret management rules to your context file.** Add a section to your `CLAUDE.md` (or `AGENTS.md`) that tells the agent how to handle secrets:

   ```markdown
   # Security rules
   - Never hard-code secret values in source files
   - Reference secrets via environment variables only
   - Do not read or display contents of `.env` files
   - Use placeholder values like `<your-api-key>` in examples
   ```

3. **Install a pre-commit secret scanner.** Set up gitleaks (or your preferred scanner) as a pre-commit hook:

   ```bash
   brew install gitleaks
   echo '#!/bin/sh\ngitleaks protect --staged --verbose' > .git/hooks/pre-commit
   chmod +x .git/hooks/pre-commit
   ```

4. **Test the secret scanner.** Create a temporary file with a fake secret pattern and try to commit it. Verify the scanner blocks the commit:

   ```bash
   echo 'API_KEY=AKIA1234567890EXAMPLE' > test-secret.txt
   git add test-secret.txt
   git commit -m "test: should be blocked by secret scanner"
   ```

5. **Add file boundary rules to your context file.** Document which directories the agent should and should not modify:

   ```markdown
   # File boundaries
   - Allowed: `src/`, `tests/`, `docs/`
   - Off-limits: `.env*`, `infrastructure/`, `scripts/deploy/`
   ```

6. **Test the workflow end-to-end.** Ask your agent to make a small code change. Verify:
   - The agent respects the file boundaries
   - The change can be reviewed with `git diff`
   - The pre-commit hook runs when you commit
   - The change can be reverted cleanly with `git revert`

**Verification**: The pre-commit hook blocks the test secret commit in step 4. The agent-generated change in step 6 passes the secret scanner, stays within the file boundaries, and can be reviewed and reverted through git.

**Stretch goal**: Add a CI/CD pipeline step that runs the same secret scanner and security checks on every push, so the checks run automatically even if someone bypasses the local pre-commit hook.

### Exercise: Practice recognizing agent failure patterns

**Objective**: Develop your instincts for recognizing when an agent is stuck in a loop or producing hallucinated output.

**Prerequisites**: An AI coding agent installed and configured.

**Steps**:

1. **Trigger a failure loop.** Give your agent a deliberately ambiguous task: "Fix the authentication system" in a project with no clear authentication issues. Observe how the agent behaves:
   - Does it ask for clarification or start making changes?
   - Does it modify the right files or start exploring broadly?
   - Does it get stuck fixing one issue only to create another?

2. **Identify the loop signals.** Watch for the patterns described above: repeated edits to the same file, escalating scope, and growing undo/redo chains.

3. **Practice interrupting and recovering.** Stop the agent, check `git diff`, and decide whether to keep any changes or reset completely.

4. **Trigger a hallucination.** Ask the agent to use a library feature that does not exist (e.g., "use the Express `secureListen` method to start the server on a TLS port"). Observe whether the agent invents an implementation or tells you the feature does not exist.

5. **Verify the output.** Try to run the hallucinated code and observe the error. Note how the agent's confident writing style made the fabricated API look legitimate.

**Verification**: You can identify at least three signals that the agent was stuck in a loop in step 2, and you can spot the hallucinated API in step 4 before running the code.

---

## Key takeaways

- Git is your primary undo mechanism -- commit frequently, work on branches, and take snapshots before risky tasks
- Set token budgets and spending limits to prevent a single task from consuming excessive resources
- Monitor agent sessions actively rather than trusting the agent to stay on track unsupervised
- Failure loops manifest as repeated edits, escalating scope, and growing undo/redo chains -- stop the agent and reframe the task when you see these patterns
- Hallucinations look confident but fail at runtime -- always run the code and verify any API or package the agent references
- Security is not about restricting agents to the point of uselessness -- it is about building workflows where mistakes are caught early and reversible

## Next steps

- **Review the full module**: Return to the [module overview](/09-security/overview/) for links to all sections in this module.
- **Related**: [Prompt engineering](/03-prompt-engineering/overview/) -- Clearer prompts lead to fewer agent mistakes, which means fewer security incidents to recover from.
- **Related**: [Context engineering](/04-context-engineering/overview/) -- Well-structured context files give the agent explicit security boundaries to follow.
- **Related**: [Subagents and task delegation](/07-subagents/overview/) -- Multi-agent workflows multiply both productivity and risk; apply the practices from this module at every delegation layer.
