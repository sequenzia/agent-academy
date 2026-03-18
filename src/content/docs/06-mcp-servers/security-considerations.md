---
title: Security considerations
description: Understand what access MCP servers grant, apply least privilege principles, audit permissions, and handle untrusted or misbehaving servers.
sidebar:
  order: 5
  label: Security considerations
---

Every MCP server you add to your agent's configuration expands what the agent can do -- and what can go wrong. A documentation lookup server adds minimal risk. A database server with write access adds significant risk. A server that executes shell commands adds maximal risk. Understanding and managing this risk is essential for using MCP servers safely.

This section covers how to think about the access you grant, how to apply least-privilege principles, how to audit your current configuration, and what to do when you encounter servers you do not fully trust.

## Understanding what access you grant

When you configure an MCP server, you are granting your AI coding agent specific capabilities. The agent can use these capabilities whenever it decides they are relevant to the task at hand -- you do not approve each individual tool call in advance (though some agents offer approval modes for high-risk operations).

### Access categories

Map each of your configured servers to one or more access categories:

| Access category | What the server can do | Example servers |
|----------------|----------------------|-----------------|
| **Read external data** | Fetch information from external services | Documentation, web search, read-only API clients |
| **Write external data** | Create, update, or delete data in external services | GitHub (create issues), Jira (update tickets), cloud APIs |
| **Read local data** | Read files on your machine | Filesystem server with read access |
| **Write local data** | Create or modify files on your machine | Filesystem server with write access |
| **Database read** | Query your databases | PostgreSQL server with SELECT-only access |
| **Database write** | Modify your databases | PostgreSQL server with full privileges |
| **Network access** | Make outbound network requests | Any server that calls external APIs |
| **Shell execution** | Run arbitrary commands on your machine | Build tool servers, script runners |

A single server may span multiple categories. A GitHub server reads data (fetching issues) and writes data (creating issues). A database server might have both read and write access depending on the connection string you provide.

### The compound risk of multiple servers

Risk is not just additive -- it can be multiplicative. Consider this scenario:

1. A file system server can read files in your project directory
2. A GitHub server can create issues in your repositories
3. Combined: the agent can read your source code through the file server and post it as a GitHub issue (intentionally or through a misunderstanding)

```mermaid
flowchart TB
    A[File System Server]:::warning --> C{Agent combines\ncapabilities}:::danger
    B[GitHub Server]:::warning --> C
    C --> D["Reads local secrets\n+ posts them publicly"]:::danger

    classDef warning fill:#fef3c7,stroke:#d97706,color:#000
    classDef danger fill:#fee2e2,stroke:#dc2626,color:#000
```

*Diagram showing how combining two individually moderate-risk servers creates a high-risk scenario. The file system server provides read access and the GitHub server provides write access; together, the agent can read local files and post them externally.*

This does not mean you should avoid combining servers. It means you should understand the combined capabilities and configure each server with the minimum access it needs.

## Applying least privilege

The principle of least privilege means granting each server only the access it needs to fulfill its purpose -- nothing more.

### Restrict file system access

Instead of giving a filesystem server access to your entire home directory:

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user"]
  }
}
```

Restrict it to the specific directory the agent needs:

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects/current-project/docs"]
  }
}
```

### Use read-only database connections

If the agent only needs to understand your schema and inspect data, use a read-only database connection:

```bash
# Create a read-only database user
psql -c "CREATE USER agent_reader WITH PASSWORD 'readonly_pass';"
psql -c "GRANT CONNECT ON DATABASE myapp TO agent_reader;"
psql -c "GRANT USAGE ON SCHEMA public TO agent_reader;"
psql -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO agent_reader;"
```

Then use this restricted user in your MCP configuration:

```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://agent_reader:readonly_pass@localhost:5432/myapp"]
  }
}
```

### Scope API tokens

When creating API tokens for MCP servers, grant only the permissions the server needs:

**GitHub token scopes:**
- Documentation lookup: no scopes needed (public repo access is sufficient)
- Issue management: `repo` + `issues`
- Full repository access: `repo` (avoid unless necessary)

**Cloud provider credentials:**
- Use IAM roles or service accounts with specific permissions rather than admin-level API keys
- Restrict access to specific resources (a single S3 bucket, a specific database instance)

### Remove unused servers

MCP servers you configured months ago and no longer use still expand your agent's attack surface. Periodically review your configuration and remove servers you are not actively using:

```bash
# Review your current configuration
cat ~/.config/opencode/mcp.json
cat .opencode/mcp.json

# Remove any servers you no longer need
```

## Auditing your MCP permissions

Regular auditing ensures your MCP configuration matches your current needs and does not contain stale or overly broad access.

### Configuration audit checklist

Walk through each configured server and answer these questions:

1. **Is this server still needed?** If you have not used it in the past month, consider removing it.
2. **Are the permissions minimal?** Could the file path be narrower, the database user more restricted, or the API token scoped tighter?
3. **Are credentials current?** API tokens expire. Check that your tokens are still valid and rotate any that are older than your organization's rotation policy.
4. **Is the server up to date?** Check for new versions that may fix security vulnerabilities.
5. **Is the server from a trusted source?** Has the server's ownership or maintenance status changed since you installed it?

### Documenting your MCP configuration

For team environments, document what each server does, what access it has, and why it is configured:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"]
    }
  }
}
```

Accompany this with documentation in your project README or context file:

```markdown
## MCP servers

### PostgreSQL (`postgres`)
- **Purpose**: Lets the agent inspect database schema and query development data
- **Access level**: Read-only (uses `agent_reader` database user)
- **Credential**: `DATABASE_URL` environment variable, set to development database only
- **Do not use**: with production database connection strings
```

### Automated checks

If your team uses CI/CD, consider adding checks that verify MCP configuration:

- Ensure no hard-coded credentials exist in MCP configuration files
- Verify that configuration files do not reference production resources
- Check that committed MCP configurations only use known, approved servers

## Handling untrusted or misbehaving servers

Not every MCP server you encounter will be trustworthy, and even trusted servers can misbehave.

### Signs of an untrusted server

Treat a server as untrusted if:

- **Source code is not available.** You cannot verify what the server does with your data.
- **The server requests unnecessary permissions.** A documentation server should not need file system write access.
- **The publisher is unknown.** No track record, no organization backing, no community usage.
- **Dependencies are suspicious.** The server pulls in packages known for supply chain issues, or uses an unusually large number of dependencies for its stated purpose.
- **No version pinning.** The installation instructions use `@latest` without specifying a version, making it possible for a compromised update to be pulled automatically.

### What to do with untrusted servers

1. **Do not install them in your primary development environment.** If you want to evaluate the server, use a throwaway project or container.

2. **Read the source code.** Check what network requests the server makes, what files it accesses, and what it does with the data it receives.

3. **Run with monitoring.** If you decide to test the server, monitor its network activity:

   ```bash
   # Monitor network connections made by a process (macOS)
   sudo lsof -i -P | grep node

   # Monitor file system access (macOS)
   sudo fs_usage -f filesystem | grep node
   ```

4. **Pin the version.** If you decide to use the server, pin to a specific version so that updates are deliberate:

   ```json
   {
     "mcpServers": {
       "some-server": {
         "command": "npx",
         "args": ["-y", "some-mcp-server@1.2.3"]
       }
     }
   }
   ```

5. **Set an expiration reminder.** Review the server's status and your need for it after 30 days.

### When a trusted server misbehaves

Even well-maintained servers can have bugs or unexpected behavior:

**The server returns wrong data.** File an issue with reproduction steps. In the meantime, verify the server's output before the agent acts on it -- ask the agent to show you what the server returned before using it.

**The server is slow or times out.** Check if the backing service is having issues (GitHub status page, database server load). Consider adding a fallback workflow using built-in tools.

**The server crashes during a task.** Remove the server from configuration, restart the agent, and retry the task without it. The agent can usually accomplish the same goal using built-in tools (shell commands, file operations), just with more manual steps.

**The server leaks data.** If you suspect a server is sending data to unauthorized endpoints, remove it immediately. Review your logs and rotate any credentials the server had access to.

## Key takeaways

- Every MCP server you configure expands your agent's capabilities and its attack surface -- treat server installation as a security decision, not just a convenience decision
- Apply least privilege to every server: restrict file paths, use read-only database users, scope API tokens to minimum required permissions
- Audit your MCP configuration regularly: remove unused servers, rotate credentials, update to current versions
- Combining multiple servers creates compound capabilities that exceed what any single server provides -- understand the combined access before configuring multiple servers
- Never install servers from untrusted sources in your primary development environment
- When a server misbehaves, disable it and fall back to built-in tools until the issue is resolved
- Document what each server does, what access it has, and why it is configured -- especially in team environments

## Next steps

- **Next module**: [Subagents and task delegation](/07-subagents/overview/) -- Learn how agents orchestrate complex work by spawning subagents, and how the tools and capabilities you have configured (including MCP servers) are available to those subagents.
- **Related**: [Security, guardrails, and safe automation](/09-security/overview/) -- Module 9 covers security holistically across all agent capabilities, including a deeper treatment of credential management, permission models, and operational safety.
- **Related**: [Context engineering](/04-context-engineering/overview/) -- Document your MCP server conventions in context files so the agent knows which servers to prefer and when to use them.
