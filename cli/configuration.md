# Configuration

The CLI reads its settings from a YAML config file, environment variables, and flags, in that order of precedence:

```
CLI flags > environment variables > config file > defaults
```

## Config file location

Default path: `~/.infraudit/config.yaml`

Override with `--config /path/to/config.yaml` on any command.

The file is created automatically by `config init` or `auth login` with mode `0600` (owner read/write only) to protect the stored token.

## File structure

```yaml
server_url: http://localhost:8080
output: table
auth:
  token: <jwt-token>
  refresh_token: <refresh-token>
  email: user@example.com
```

| Key | Type | Description |
|---|---|---|
| `server_url` | string | InfraAudit API base URL |
| `output` | enum | Default output format: `table`, `json`, or `yaml` |
| `auth.token` | string | Access token returned by the server at login |
| `auth.refresh_token` | string | Refresh token used to get new access tokens |
| `auth.email` | string | Email the session belongs to |

The CLI refreshes `auth.token` automatically when it expires, as long as `refresh_token` is still valid.

## Managing config interactively

```bash
# First-time setup (prompts for server URL and default format)
infraudit config init

# Set an individual value
infraudit config set server_url https://api.infraudit.dev
infraudit config set output json

# Read a value
infraudit config get server_url

# List all values
infraudit config list
```

## Environment variables

Two env vars override the config file without editing it:

| Variable | Default | What it overrides |
|---|---|---|
| `INFRAUDIT_SERVER_URL` | `http://localhost:8080` | `server_url` |
| `INFRAUDIT_OUTPUT` | `table` | `output` |

Example:

```bash
INFRAUDIT_SERVER_URL=https://staging.infraudit.dev infraudit status
```

## Managing multiple instances

If you work against more than one InfraAudit server (local dev, staging, production), keep a separate config file per environment and point `--config` at the right one:

```bash
# Create a staging config
infraudit --config ~/.infraudit/staging.yaml config init

# Run a command against staging
infraudit --config ~/.infraudit/staging.yaml drift list
```

A lightweight alternative: set `INFRAUDIT_SERVER_URL` per shell session.

## Security notes

- The config file is `0600` by default. Do not `chmod` it back to world-readable — the access token is a Bearer credential equivalent to a password.
- Do not check `~/.infraudit/config.yaml` into source control.
- For CI/CD, use `infraudit auth login --email "$CI_EMAIL" --password "$CI_PASSWORD"` from secrets rather than copying the config file into the build environment. See [CI/CD usage](ci-cd-usage.md).
