---
title: Credential and secret management
description: Keep secrets out of context files, use environment variables and secret managers, audit agent output, and practice key rotation.
sidebar:
  order: 3
  label: Credential management
---

AI coding agents have access to your development environment, which means they can read your secrets: API keys in `.env` files, tokens in configuration files, private keys on disk. The agent does not need your secrets maliciously -- but it can inadvertently include them in code it generates, context files it creates, or output it displays. Once a secret appears in a commit, a log file, or a prompt history, containing it becomes a remediation project.

This section covers practical approaches to keeping secrets safe when working with agents: where secrets should and should not live, how to provide agents with what they need without exposing credentials, how to audit agent output for accidental leaks, and when to rotate keys.

---

## How credentials flow in agent workflows

Before diving into specific practices, it helps to see the overall picture of how credentials should flow in an agent-assisted workflow:

```mermaid
flowchart LR
    A[Secret Manager\nor shell env]:::primary --> B[Environment\nvariable]:::secondary
    B --> C[MCP server\nconfiguration]:::neutral
    C --> D[Agent uses tool\nvia MCP]:::success
    E[Context file]:::warning -->|"Documents variable\nnames only"| C
    F[.env file]:::danger -->|"Never committed\nto git"| B

    classDef primary fill:#dbeafe,stroke:#2563eb,color:#000
    classDef secondary fill:#f3e8ff,stroke:#7c3aed,color:#000
    classDef success fill:#dcfce7,stroke:#16a34a,color:#000
    classDef warning fill:#fef3c7,stroke:#d97706,color:#000
    classDef danger fill:#fee2e2,stroke:#dc2626,color:#000
    classDef neutral fill:#f3f4f6,stroke:#6b7280,color:#000
```

*Diagram showing the safe credential flow: secrets originate in a secret manager or local .env file (never committed to git), are loaded as environment variables, referenced by MCP server configuration, and used by the agent through MCP tool calls. Context files document only variable names, never actual secret values.*

## The cardinal rule: no secrets in context files

Context files (`CLAUDE.md`, `AGENTS.md`, rules files) are read by the agent on every interaction. They are often committed to version control and shared across teams. A secret in a context file is a secret in git history -- and git history is permanent.

### What counts as a secret

Any of the following should never appear in a context file, prompt, or any file the agent reads as part of its context:

- API keys and tokens (e.g., `sk-proj-abc123...`)
- Database connection strings with embedded passwords
- OAuth client secrets
- Private keys and certificates
- Webhook signing secrets
- Encryption keys
- Personal access tokens for services like GitHub, GitLab, or npm

### What to put in context files instead

Your context file should describe *how* the project handles secrets without containing the secrets themselves:

```markdown
# Secrets and configuration

## Environment variables
The following environment variables must be set for the application to run:
- `DATABASE_URL` - PostgreSQL connection string
- `API_KEY` - Third-party service API key
- `JWT_SECRET` - Secret for signing authentication tokens

## Where secrets are stored
- Local development: `.env` file (not committed to git)
- CI/CD: GitLab CI/CD variables (masked and protected)
- Production: AWS Secrets Manager

## Rules for the agent
- Never hard-code secret values in source files
- Always reference secrets via environment variables (e.g., `process.env.DATABASE_URL`)
- Do not read or display the contents of `.env` files
- When generating configuration examples, use placeholder values like `<your-api-key>`
```

This gives the agent everything it needs to write correct code without ever seeing the actual secret values.

---

## Environment variables

Environment variables are the most common way to provide secrets to applications without embedding them in code. When working with agents, environment variables serve a dual purpose: they keep secrets out of source files, and they keep secrets out of the agent's context.

### How it works

Your application reads secrets from the environment at runtime:

```typescript
// Good: read from environment variable
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable is required');
}
```

```python
# Good: read from environment variable
import os

api_key = os.environ.get("API_KEY")
if not api_key:
    raise ValueError("API_KEY environment variable is required")
```

The agent sees this pattern and understands that the value comes from the environment. It does not need to know what the actual key is to write correct code.

### Keeping `.env` files safe

Most projects use `.env` files for local development secrets. These files must be excluded from version control and, ideally, from the agent's context:

```text
# .gitignore - always include these patterns
.env
.env.local
.env.*.local
*.pem
*.key
credentials.json
```

Add an explicit instruction in your context file:

```markdown
# Agent instructions for .env files
- `.env` files exist but are gitignored
- Do not read `.env` files to discover secret values
- When writing code that uses environment variables, reference the variable name only
- Use `.env.example` (committed to git) as the reference for which variables exist
```

### The `.env.example` pattern

Maintain a `.env.example` file that lists every required environment variable with placeholder values. This file is committed to git and visible to the agent:

```bash
# .env.example - committed to git, no real values
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
API_KEY=your-api-key-here
JWT_SECRET=your-jwt-secret-here
SMTP_HOST=smtp.example.com
SMTP_PASSWORD=your-smtp-password-here
```

The agent can read this file to understand your configuration without seeing real credentials.

---

## Secret managers

For projects with stricter security requirements, secret managers provide better protection than environment variables alone. A secret manager is a dedicated service for storing, accessing, and rotating secrets with audit trails and access controls.

### When to use a secret manager

- When multiple services or environments share the same secrets
- When you need an audit trail of who accessed which secret and when
- When secrets need to rotate automatically without redeploying
- When compliance requirements mandate centralized secret management

### Common secret managers

| Secret manager | Provider | Best for |
|---------------|----------|----------|
| AWS Secrets Manager | AWS | Projects deployed on AWS |
| Google Secret Manager | GCP | Projects deployed on GCP |
| HashiCorp Vault | Self-hosted or cloud | Multi-cloud or on-premises |
| 1Password CLI | 1Password | Developer workflows and small teams |
| Doppler | Doppler | Cross-platform secret sync |

### Integrating with agent workflows

When your project uses a secret manager, your context file should document how secrets are accessed so the agent generates correct code:

````markdown
# Secret access pattern

We use AWS Secrets Manager for all credentials.

## How to access secrets in code
```typescript
import { getSecret } from './lib/secrets';

// Always use the getSecret helper, never hard-code values
const dbPassword = await getSecret('myapp/database/password');
```

## Rules
- Import secrets using the `getSecret` helper in `src/lib/secrets.ts`
- Never store secret values in variables that are logged or serialized
- Never pass secret values as command-line arguments (visible in process lists)
````

The agent learns to use your secret access pattern rather than inventing its own approach.

---

## Output auditing

Even with good practices in place, secrets can leak into agent output. Output auditing catches these leaks before they reach version control.

### What to audit

Review agent-generated output for:

- **Hard-coded values that look like secrets.** Strings that match patterns like `sk-`, `ghp_`, `AKIA`, or long random-looking strings in configuration files.
- **Connection strings with embedded credentials.** Look for URLs with `user:password@` patterns in source files, docker-compose files, and CI/CD configuration.
- **Configuration files with real values.** The agent may generate a config file that works but includes real values instead of environment variable references.
- **Log or debug statements that print secrets.** The agent adds `console.log(apiKey)` or `print(f"Token: {token}")` for debugging and forgets to remove it.

### Pre-commit hooks for secret detection

Automated secret scanning catches what manual review misses. Install a pre-commit hook that scans for secrets before every commit:

```bash
# Install gitleaks for secret scanning
brew install gitleaks

# Create a pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
gitleaks protect --staged --verbose
EOF
chmod +x .git/hooks/pre-commit
```

With this hook in place, any commit that contains a detected secret pattern is blocked before it reaches git history.

Other tools for secret detection:

| Tool | Approach | Notes |
|------|----------|-------|
| gitleaks | Regex patterns + entropy analysis | Good default choice, fast |
| truffleHog | High-entropy string detection + verified secrets | Can verify if detected secrets are actually live |
| detect-secrets | Yelp's baseline approach | Tracks known secrets to avoid false positives |
| git-secrets | AWS-focused patterns | Best for AWS credential detection |

### Manual review checklist

Before committing agent-generated code, scan for:

1. Any string longer than 20 characters that looks random
2. Any URL with credentials embedded (`://user:pass@`)
3. Any file the agent created that was not part of your request (especially config files)
4. Any `console.log`, `print`, or logging statement that references variables with names like `key`, `secret`, `token`, or `password`

---

## Key rotation

Key rotation is the practice of periodically replacing credentials with new ones. When working with agents, rotation becomes more important because the surface area for accidental exposure is larger.

### When to rotate immediately

Rotate credentials immediately if:

- You discover a secret was committed to version control, even on a branch
- A secret appeared in agent output that was shared or logged
- You suspect the agent sent a secret to an external service
- A team member's machine with agent access is compromised

### Rotation procedure

1. **Generate a new credential** in the service that issued the original one
2. **Update the credential** in your secret manager or environment variables
3. **Verify the application works** with the new credential
4. **Revoke the old credential** in the service that issued it
5. **Audit access logs** for the old credential to check for unauthorized use between exposure and rotation

### Regular rotation schedule

Even without a known exposure, rotate credentials on a schedule:

| Credential type | Rotation frequency | Notes |
|----------------|-------------------|-------|
| API keys for external services | Every 90 days | More frequent if agent has access to the environment |
| Database passwords | Every 90 days | Use connection pooling to minimize rotation disruption |
| JWT signing secrets | Every 30-90 days | Requires careful token invalidation strategy |
| Personal access tokens | Every 90 days | Revoke unused tokens immediately |
| SSH keys | Annually | Use agent forwarding to avoid copying keys to containers |

:::tip
Automate rotation where possible. Most secret managers support automatic rotation policies. The less manual the process, the more likely it actually happens on schedule.
:::

---

## Credential management checklist

Use this checklist when setting up a new project or onboarding agents to an existing one:

- [ ] `.env` files are in `.gitignore`
- [ ] A `.env.example` file exists with placeholder values
- [ ] The context file documents environment variables without containing real values
- [ ] The context file instructs the agent not to read `.env` files
- [ ] Pre-commit hooks scan for secrets (gitleaks or equivalent)
- [ ] Code reads secrets from environment variables or a secret manager, never from hard-coded values
- [ ] A rotation schedule exists for all credentials the agent's environment can access
- [ ] The team knows the procedure for emergency credential rotation
