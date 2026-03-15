---
title: Environment essentials
description: Configure your terminal for agent workflows, establish git hygiene practices, and create a sandbox project for safe experimentation.
---

A working agent is only part of the equation. The environment around it -- your terminal setup, your git practices, and the project you point it at -- determines whether your experience with AI coding agents is productive or frustrating. This section covers the essentials that apply regardless of which agent you use.

## Terminal setup

AI coding agents that run in the terminal (like OpenCode) work best when your terminal is configured to handle their output well. Even if you primarily use Codex (cloud-based), you will use the terminal for reviewing changes, running tests, and managing your repository.

### Recommended terminal emulators

Your default system terminal works, but a modern terminal emulator provides better support for the kind of output agents produce -- long scrollback, split panes, and fast rendering.

**macOS**:
- **iTerm2** -- Free, widely used, excellent scrollback and split pane support
- **Terminal.app** -- Built-in, adequate for basic use
- **Kitty** or **WezTerm** -- GPU-accelerated, fast rendering for large output

**Linux**:
- **Alacritty** -- GPU-accelerated, minimal, fast
- **Kitty** -- Feature-rich with split panes and session management
- **GNOME Terminal** or **Konsole** -- Built-in options that work well for most workflows

### Terminal configuration tips

**Increase scrollback buffer**: Agents produce verbose output during long tasks. Set your scrollback buffer to at least 10,000 lines so you can scroll back to see what the agent did.

In iTerm2: Preferences > Profiles > Terminal > Scrollback Lines > set to 10000 or check "Unlimited scrollback."

**Use a monospace font with ligature support**: Agents output code frequently. A good coding font makes this output easier to read. Recommendations: JetBrains Mono, Fira Code, or Cascadia Code.

**Configure split panes**: Running an agent in one pane while monitoring files or test output in another is a common workflow. Learn your terminal's split pane shortcuts:

```bash
# iTerm2: Cmd+D (vertical split), Cmd+Shift+D (horizontal split)
# tmux: Ctrl+B then % (vertical), Ctrl+B then " (horizontal)
```

### Shell configuration

Make sure your shell profile loads environment variables and PATH entries correctly. Agents rely on the same environment your shell provides.

Check that your profile is loaded:

```bash
# For zsh (macOS default)
echo $SHELL  # Should show /bin/zsh
cat ~/.zshrc | head -5  # Should exist and contain your config

# For bash
echo $SHELL  # Should show /bin/bash
cat ~/.bashrc | head -5
```

If you use a tool like `nvm`, `pyenv`, or `rbenv`, make sure it initializes in your shell profile. Agents may invoke commands that depend on these version managers being available.

### Verification: terminal setup

Run this quick check to confirm your terminal is ready:

```bash
# Verify your shell is loading correctly
echo "Shell: $SHELL"
echo "Node: $(node --version 2>/dev/null || echo 'not installed')"
echo "Git: $(git --version)"
echo "NPM global prefix: $(npm config get prefix)"
```

All four lines should produce output. If any show errors, fix the underlying installation before proceeding.

---

## Git hygiene for agent workflows

AI coding agents create and modify files at a pace that makes clean git practices essential. Without good git hygiene, you end up with bloated commits, unclear history, and difficulty rolling back agent changes.

### Why git hygiene matters more with agents

When you code by hand, you naturally make small, logical commits because you work in focused chunks. An agent working on a task may touch dozens of files in a single session. If you do not manage this output carefully, you get:

- **Massive commits** that mix unrelated changes and are hard to review
- **Unclear commit messages** that say "agent changes" instead of describing what happened
- **No rollback granularity** -- if one part of the agent's output is wrong, you cannot revert just that part without also losing the good changes

### Practices for agent-assisted development

#### Commit before starting an agent task

Always commit (or stash) your current work before giving a task to an agent. This creates a clean rollback point.

```bash
# Before starting an agent task
git add -A
git commit -m "wip: save current state before agent task"
```

If the agent's changes are not what you wanted, you can reset to this commit:

```bash
git diff HEAD  # Review what the agent changed
git checkout .  # Discard all changes if needed
```

#### Use branches for agent work

Create a dedicated branch for agent tasks, especially for larger changes. This keeps the agent's work isolated from your main branch until you have reviewed it.

```bash
# Create a branch for the agent task
git checkout -b agent/add-input-validation

# ... run the agent task ...

# Review changes, then merge when satisfied
git checkout main
git merge agent/add-input-validation
```

#### Review diffs before committing

Never blindly commit agent output. Always review the diff first:

```bash
git diff              # See unstaged changes
git diff --stat       # See which files changed and by how much
```

Look for:

- **Unintended file modifications** -- did the agent touch files outside the task scope?
- **Removed code** -- did the agent delete something it should not have?
- **Added dependencies** -- did the agent add packages you did not ask for?
- **Sensitive data** -- did the agent accidentally include API keys or credentials in the output?

#### Write descriptive commit messages

When committing agent-generated changes, write a commit message that describes the intent, not just "agent changes":

```bash
# Bad
git commit -m "agent changes"

# Good
git commit -m "feat(auth): add input validation to registration endpoint

Generated by OpenCode. Adds email format validation, password strength
check, and duplicate email detection to the user registration handler."
```

Including a note that the changes were agent-generated helps future reviewers (including your future self) understand the provenance of the code.

### The .gitignore for agent workflows

Make sure your `.gitignore` excludes agent-specific files that should not be committed:

```text
# Agent configuration (may contain local paths or preferences)
.opencode/

# Agent session logs
.agent-sessions/

# Environment variables (API keys)
.env
.env.local
```

### Verification: git hygiene

Confirm your git setup supports clean agent workflows:

```bash
# Verify git identity is configured
git config user.name
git config user.email

# Verify .gitignore exists and is not empty
test -f .gitignore && echo ".gitignore exists" || echo "WARNING: no .gitignore"

# Verify you are on a clean working tree (or know what is uncommitted)
git status
```

---

## Sandbox project setup

Before using an agent on a real project, create a sandbox -- a disposable project where you can experiment freely without consequences. This is where you will practice prompting, test configurations, and get comfortable with how your agent behaves.

### Creating the sandbox

```bash
# Create a new directory for your sandbox project
mkdir ~/agent-sandbox
cd ~/agent-sandbox

# Initialize a git repository
git init

# Create a basic project structure
mkdir src tests

# Create a minimal package.json (for Node.js projects)
cat > package.json << 'EOF'
{
  "name": "agent-sandbox",
  "version": "1.0.0",
  "description": "Sandbox project for practicing with AI coding agents",
  "scripts": {
    "test": "echo 'No tests configured yet'"
  }
}
EOF

# Create a starter file for the agent to work with
cat > src/index.js << 'EOF'
// Agent sandbox - a playground for experimenting with AI coding agents
function greet(name) {
  return `Hello, ${name}! Welcome to the agent sandbox.`;
}

module.exports = { greet };
EOF

# Create an initial commit
git add -A
git commit -m "init: create agent sandbox project"
```

### Why a sandbox matters

- **Safe experimentation**: If the agent makes a mess, you delete the directory and start over. No real code was harmed.
- **Prompt iteration**: You can try different prompts for the same task and compare results without polluting a real project's git history.
- **Configuration testing**: Test workspace configs, approval modes, and autonomy levels in a low-stakes environment.
- **Skill building**: The exercises in later modules use a sandbox project. Having one ready means you can start practicing immediately.

### Making the sandbox useful

A sandbox is more useful when it resembles a real project. Add elements that give the agent context to work with:

````bash
# Add a README for context
cat > README.md << 'EOF'
# Agent Sandbox

A practice project for experimenting with AI coding agents.

## Setup
```bash
npm install
```

## Test
```bash
npm test
```
EOF

# Add a .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.opencode/
EOF

# Commit the additions
git add -A
git commit -m "chore: add README and .gitignore"
````

### Connecting the sandbox to your agent

**For OpenCode**: Navigate to the sandbox directory and start a session:

```bash
cd ~/agent-sandbox
opencode
```

Try a simple task:

```text
Add a function called "add" that takes two numbers and returns their sum. Add it to src/index.js and export it.
```

**For Codex**: If you have the sandbox in a Git remote (GitHub, GitLab), connect it:

```bash
# Push to a remote first
git remote add origin <your-remote-url>
git push -u origin main

# Then connect via Codex
codex repo connect <owner>/agent-sandbox
```

Submit a task:

```bash
codex task create \
  --repo <owner>/agent-sandbox \
  --autonomy suggest \
  --prompt "Add a function called 'add' that takes two numbers and returns their sum. Add it to src/index.js and export it."
```

### Verification: sandbox project

Confirm your sandbox is ready:

```bash
cd ~/agent-sandbox

# Verify git is initialized and clean
git status

# Verify the project structure exists
ls -la src/ tests/ package.json

# Verify you can start your agent in this directory
opencode --version  # or codex --version
```

Expected output: git shows a clean working tree, the directories and files exist, and your agent command returns a version number.

---

## Practical exercises

### Exercise: Complete environment setup

**Objective**: Set up a fully working agent environment from scratch and verify every component.

**Prerequisites**: Node.js 18+, npm, git, and an API key for at least one model provider (Anthropic or OpenAI).

**Steps**:

1. Install your chosen agent (OpenCode or Codex) following the instructions in this module.
2. Configure your API key as an environment variable in your shell profile.
3. Run the agent's verification command (`opencode doctor` or `codex whoami`) to confirm connectivity.
4. Create a sandbox project following the instructions in the sandbox setup section above.
5. Start an agent session in the sandbox and ask the agent to add a `subtract` function to `src/index.js`.
6. Review the agent's changes with `git diff`.
7. Commit the changes with a descriptive message.

**Verification**: Run `git log --oneline` in your sandbox. You should see at least three commits: the initial commit, the README/gitignore commit, and the commit with the agent's changes.

**Stretch goal**: Set up the second agent (the one you did not choose in step 1) and repeat steps 5-7 to compare the experience.

### Exercise: Git workflow with agent changes

**Objective**: Practice the branch-based workflow for managing agent-generated changes.

**Prerequisites**: A working agent and sandbox project from the previous exercise.

**Steps**:

1. Create a new branch: `git checkout -b agent/add-multiply-function`
2. Start an agent session and ask it to add a `multiply` function to `src/index.js`.
3. Review the diff with `git diff` and `git diff --stat`.
4. Stage and commit the changes with a descriptive message.
5. Switch back to main: `git checkout main`
6. Merge the branch: `git merge agent/add-multiply-function`
7. Delete the feature branch: `git branch -d agent/add-multiply-function`

**Verification**: Run `git log --oneline --graph` on the main branch. You should see the merge commit (or a fast-forward if git chose that strategy) and the commit from the agent branch.

---

## Key takeaways

- A well-configured terminal with sufficient scrollback and split pane support makes agent workflows smoother
- Always commit or stash your work before starting an agent task -- this gives you a clean rollback point
- Use dedicated branches for agent tasks to keep changes isolated until reviewed
- Review every diff an agent produces before committing -- check for unintended modifications, removed code, and sensitive data
- Write descriptive commit messages for agent-generated code, noting that an agent produced it
- A sandbox project gives you a risk-free environment to experiment with agents, test configurations, and practice prompting
- Git hygiene is not optional when working with agents -- the pace of change demands disciplined version control

## Next steps

- **Next module**: [Prompt engineering for coding agents](/03-prompt-engineering/overview/) -- Learn how to write effective prompts that produce predictable results from your agent.
- **Related**: [Context engineering](/04-context-engineering/overview/) -- Once you are comfortable with your agent, learn how to provide project-level context for better output.
- **Official docs**: [OpenCode documentation](https://github.com/anthropics/opencode) | [Codex documentation](https://openai.com/codex)
