# CLI overview

The `infraudit` CLI is a command-line client for the InfraAudit API. It covers every feature the web UI does: cloud account management, drift detection, vulnerability scans, cost analysis, compliance assessments, remediation, and more.

## What you can do with it

- Log in once; scripts use the stored token for subsequent runs
- Trigger scans and fetch results with JSON, YAML, or table output
- Wire cloud security checks into CI/CD pipelines (the JSON output works with `jq`)
- Manage multiple InfraAudit instances by pointing `--server` at each one

## Command groups

| Group | Purpose |
|---|---|
| [`auth`](commands/README.md) | Login, register, logout, whoami |
| [`config`](configuration.md) | Manage CLI configuration |
| `status` | Print a dashboard summary |
| [`provider`](commands/provider.md) | Connect, sync, disconnect cloud accounts |
| [`resource`](commands/resource.md) | List and inspect discovered resources |
| [`drift`](commands/drift.md) | Detect, list, and resolve configuration drift |
| [`alert`](commands/alert.md) | List, acknowledge, and resolve alerts |
| [`vulnerability`](commands/vulnerability.md) | Run vuln scans and review findings |
| [`cost`](commands/cost.md) | Cost overview, trends, forecasts, anomalies |
| [`compliance`](commands/compliance.md) | Enable frameworks and run assessments |
| [`kubernetes`](commands/kubernetes.md) | Register clusters, list workloads |
| [`iac`](commands/iac.md) | Upload Terraform/CloudFormation, detect IaC drift |
| [`job`](commands/job.md) | Manage scheduled jobs |
| [`remediation`](commands/remediation.md) | Suggest, approve, execute, rollback fixes |
| [`recommendation`](commands/recommendation.md) | AI-powered cost and security suggestions |
| [`notification`](commands/notification.md) | Configure notification channels |
| [`webhook`](commands/webhook.md) | Manage outbound webhooks |

## Global flags

These work on every command:

| Flag | Short | Default | Description |
|---|---|---|---|
| `--server` | | from config | Override the server URL for one request |
| `--output` | `-o` | `table` | Output format: `table`, `json`, `yaml` |
| `--config` | | `~/.infraudit/config.yaml` | Path to config file |
| `--no-color` | | `false` | Disable colored output |
| `--help` | `-h` | | Show help for any command |

## Output formats

### Table (default)
Human-readable aligned columns. Good for interactive use:

```
ID  NAME            TYPE     REGION      STATUS         PROVIDER
--  ----            ----     ------      ------         --------
1   web-server-01   ec2      us-east-1   [+] active     1
2   api-gateway     lambda   us-west-2   [+] active     1
3   data-bucket     s3       us-east-1   [+] active     1
```

### JSON
Machine-readable. Pipe to `jq` for filtering:

```bash
infraudit resource list -o json | jq '.[].name'
```

### YAML
Readable alternative to JSON:

```bash
infraudit drift get 1 -o yaml
```

## Next steps

- [Install the CLI](installation.md)
- [Configure the CLI](configuration.md)
- [Authentication](authentication.md)
- [Browse commands](commands/README.md)
- [CI/CD usage](ci-cd-usage.md)
- [Examples](examples.md)
