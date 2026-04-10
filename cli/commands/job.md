---
title: "job"
description: "Manage scheduled jobs from the CLI."
icon: "square-terminal"
---

# `infraudit job`

Manage scheduled automation jobs.

## `job list`

```bash
infraudit job list
```

## `job create`

Create a scheduled job. Prompts interactively if flags are not provided.

```bash
infraudit job create --name "Daily Drift Scan" --type drift_detection --schedule "0 8 * * *"
```

| Flag | Description |
|---|---|
| `--name` | Job display name |
| `--type` | `drift_detection`, `resource_sync`, `vulnerability_scan`, `cost_sync`, `compliance_check` |
| `--schedule` | Cron expression |

## `job get <id>`

```bash
infraudit job get 1
```

## `job delete <id>`

```bash
infraudit job delete 1
```

## `job run <id>`

Trigger a job immediately.

```bash
infraudit job run 1
```

## `job executions <job-id>`

Show execution history for a job.

```bash
infraudit job executions 1
```

## `job types`

List available job types.

```bash
infraudit job types
```
