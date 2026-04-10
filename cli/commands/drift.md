---
title: "drift"
description: "Detect, list, and resolve configuration drift from the CLI."
icon: "square-terminal"
---

# `infraudit drift`

Detect and manage infrastructure configuration drift.

## `drift list`

List detected drifts with optional filters.

```bash
infraudit drift list
infraudit drift list --severity critical
infraudit drift list --status detected --type security
```

| Flag | Description |
|---|---|
| `--severity` | `critical`, `high`, `medium`, `low` |
| `--status` | `detected`, `investigating`, `resolved` |
| `--type` | `configuration`, `security`, `compliance` |

## `drift get <id>`

Show drift details.

```bash
infraudit drift get 5
```

## `drift detect`

Trigger a drift detection scan across all resources.

```bash
infraudit drift detect
```

## `drift summary`

Show an aggregate summary of drift status by severity.

```bash
infraudit drift summary
```

## `drift resolve <id>`

Mark a drift as resolved.

```bash
infraudit drift resolve 5
```
