---
title: "Authentication"
description: "Log in to InfraAudit from the CLI and manage your session token."
icon: "key"
---

# Authentication

The CLI stores a JWT access token in `~/.infraudit/config.yaml` after login. All subsequent commands use it automatically.

## Commands

### `auth login`

Log in with email and password. Prompts interactively if flags are not provided.

```bash
# Interactive
infraudit auth login

# Non-interactive (for scripts)
infraudit auth login --email user@example.com --password mypassword
```

| Flag | Description |
|---|---|
| `--email` | Email address |
| `--password` | Password |

### `auth register`

Create a new account.

```bash
# Interactive
infraudit auth register

# Non-interactive
infraudit auth register --email user@example.com --name "Jane Smith" --password mypassword
```

| Flag | Description |
|---|---|
| `--email` | Email address |
| `--name` | Full name |
| `--password` | Password |

### `auth logout`

Clear stored credentials from the config file.

```bash
infraudit auth logout
```

### `auth whoami`

Show the current authenticated user.

```bash
infraudit auth whoami
```

## Non-interactive and CI usage

For automated environments, pass credentials via flags rather than interactive prompts:

```bash
infraudit auth login --email "$CI_EMAIL" --password "$CI_PASSWORD"
```

Never store the password in the config file or source control. See [CI/CD usage](/cli/ci-cd-usage) for a full pipeline example.

## Token refresh

The CLI refreshes the access token automatically using the stored `refresh_token`. If both tokens expire, run `auth login` again.

## Security notes

- Credentials are stored in `~/.infraudit/config.yaml` with `0600` permissions.
- Do not commit that file to source control.
- Each team member should maintain their own config with their own credentials.

