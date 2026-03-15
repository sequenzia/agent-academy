---
title: OpenCode setup
description: Install OpenCode, configure your model provider and proxy endpoint, set up workspace configuration, and verify your installation.
---

OpenCode is an open-source, terminal-based AI coding agent. It runs locally on your machine, reads your project files, and interacts with a large language model (LLM) to help you write, refactor, and debug code. Because it runs in your terminal, you get interactive, real-time feedback -- you can watch the agent work, approve tool calls, and steer it mid-task.

This section walks you through the full setup: installing OpenCode, connecting it to a model provider, configuring optional proxy endpoints, setting up workspace-level configuration, and verifying everything works.

## Installation

OpenCode is distributed as an npm package. Install it globally so you can run it from any directory.

```bash
npm install -g @anthropic/opencode
```

Verify the installation:

```bash
opencode --version
```

Expected output:

```text
opencode v0.1.x
```

If the command is not found, make sure your npm global bin directory is in your `PATH`. You can find the directory with:

```bash
npm config get prefix
```

The binary is located in the `bin/` subdirectory of that path. Add it to your shell profile if it is not already there.

:::tip[macOS and Linux]
On macOS, the default npm prefix is usually `/usr/local`. On Linux, it depends on how Node.js was installed -- if you used `nvm`, the prefix is inside your `~/.nvm` directory and is already on your `PATH`.
:::

### Troubleshooting installation

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `EACCES` permission error | Global npm directory requires root | Use `nvm` to manage Node.js, or configure npm to use a user-writable directory with `npm config set prefix ~/.npm-global` |
| `command not found` after install | npm global bin not in `PATH` | Add `export PATH="$(npm config get prefix)/bin:$PATH"` to your `~/.zshrc` or `~/.bashrc` |
| Version mismatch | Multiple Node.js installations | Run `which node` and `which npm` to confirm they point to the same installation |

---

## Provider configuration

OpenCode needs access to a large language model to function. It connects to a model provider through an API key. OpenCode supports several providers out of the box, including Anthropic (Claude), OpenAI (GPT), and others.

### Setting your API key

The simplest way to configure a provider is through environment variables. Set the API key for your provider in your shell profile so it persists across sessions.

For Anthropic (Claude):

```bash
# Add to your ~/.zshrc or ~/.bashrc
export ANTHROPIC_API_KEY="<your-anthropic-api-key>"
```

For OpenAI:

```bash
# Add to your ~/.zshrc or ~/.bashrc
export OPENAI_API_KEY="<your-openai-api-key>"
```

After adding the variable, reload your shell:

```bash
source ~/.zshrc  # or source ~/.bashrc
```

### Choosing a model

OpenCode selects a default model based on your configured provider. You can override this in your configuration file or at launch time. Common choices include:

```bash
# Launch OpenCode with a specific model
opencode --model claude-sonnet-4-20250514
```

:::caution
API keys grant access to paid services. Treat them like passwords -- do not commit them to version control, share them in chat, or include them in configuration files that get checked in. Environment variables are the safest approach for local development.
:::

### Verification: provider configuration

Confirm OpenCode can reach your provider:

```bash
opencode doctor
```

Expected output (details vary by provider):

```text
OpenCode Doctor
  Provider:     anthropic
  Model:        claude-sonnet-4-20250514
  API Key:      configured
  Connectivity: ok
```

If the connectivity check fails, verify your API key is set correctly and that you can reach the provider's API endpoint from your network (some corporate networks block outbound API calls).

---

## Proxy endpoint setup

Some organizations route model API traffic through a proxy or gateway for cost tracking, compliance, or access control. If your team uses a proxy endpoint, configure OpenCode to send requests through it instead of directly to the provider.

### When you need a proxy

You need a proxy endpoint if:

- Your organization provides model access through an internal gateway
- You use a service like LiteLLM, AWS Bedrock, or Azure OpenAI that exposes an OpenAI-compatible API at a custom URL
- Your network restricts direct access to model provider APIs

### Configuring the proxy

Set the base URL for your proxy using an environment variable:

```bash
# Add to your ~/.zshrc or ~/.bashrc
export OPENCODE_API_BASE_URL="https://your-gateway.example.com/v1"
```

If your proxy requires a separate API key (different from the provider key), set that as well:

```bash
export OPENCODE_API_KEY="<your-proxy-api-key>"
```

### Verification: proxy endpoint

After configuring the proxy, run the doctor command again:

```bash
opencode doctor
```

The output should show your custom endpoint:

```text
OpenCode Doctor
  Provider:     custom
  Endpoint:     https://your-gateway.example.com/v1
  API Key:      configured
  Connectivity: ok
```

If connectivity fails through the proxy, test the endpoint directly with `curl`:

```bash
# Test that the proxy endpoint is reachable
curl -s -o /dev/null -w "%{http_code}" \
  https://your-gateway.example.com/v1/models \
  -H "Authorization: Bearer <your-api-key>"
```

A `200` response means the endpoint is reachable and your credentials work. A `401` means the API key is wrong. A connection timeout means the endpoint URL is incorrect or your network blocks the request.

---

## Workspace configuration

OpenCode uses configuration files to customize its behavior for specific projects. This is separate from the context files you will learn about in Module 4 -- workspace configuration controls OpenCode's operational settings, not the context it uses to understand your codebase.

### Project-level configuration

Create a configuration file in your project root to set project-specific defaults:

```json
// .opencode/config.json
{
  "model": "claude-sonnet-4-20250514",
  "approvalMode": "suggest",
  "tools": {
    "allowedCommands": ["npm test", "npm run build", "npm run lint"]
  }
}
```

Key configuration options:

| Option | Description | Example values |
|--------|-------------|----------------|
| `model` | Default model for this project | `claude-sonnet-4-20250514`, `gpt-4.1` |
| `approvalMode` | How the agent handles tool calls | `suggest` (ask first), `auto` (run automatically) |
| `tools.allowedCommands` | Shell commands the agent can run without explicit approval | Build, test, lint commands |

### Approval modes

OpenCode can operate at different levels of autonomy:

- **`suggest`** (default): The agent shows you what it plans to do and waits for approval before executing any tool calls. This is the safest mode for getting started.
- **`auto`**: The agent executes tool calls automatically without asking. Use this only for trusted operations in sandboxed environments.

Start with `suggest` mode. You can switch to `auto` once you are comfortable with how the agent behaves in your project.

### Verification: workspace configuration

Verify OpenCode reads your project configuration by running it from your project directory:

```bash
cd <your-project>
opencode
```

Inside the OpenCode session, ask it to confirm the configuration:

```text
What model are you using and what is your current approval mode?
```

The agent should report the settings from your `.opencode/config.json` file.

---

## Putting it all together

At this point you should have:

1. OpenCode installed globally and available in your `PATH`
2. An API key configured for your model provider
3. (Optional) A proxy endpoint configured if your organization requires one
4. (Optional) A workspace configuration file for your project

### Final verification

Run through this quick checklist to confirm everything works:

```bash
# 1. Verify installation
opencode --version

# 2. Verify provider connectivity
opencode doctor

# 3. Start an interactive session
opencode
```

Inside the session, give OpenCode a simple task:

```text
Create a file called hello.txt with the text "Hello from OpenCode"
```

If the agent creates the file, your setup is complete. Clean up the test file when you are done:

```bash
rm hello.txt
```

:::note
If any step in this verification fails, review the troubleshooting tips in each section above. The most common issues are missing API keys and npm global bin paths not being in `PATH`.
:::
