---
title: "recommendation"
description: "View AI-powered cost and security recommendations from the CLI."
icon: "square-terminal"
---


Alias: `rec`

AI-powered optimization recommendations.

## `rec list`

```bash
infraudit rec list
infraudit rec list --type cost --priority high
infraudit rec list --status pending
```

| Flag | Description |
|---|---|
| `--type` | `cost`, `performance`, `security` |
| `--priority` | `high`, `medium`, `low` |
| `--status` | `pending`, `applied`, `dismissed` |

## `rec get <id>`

```bash
infraudit rec get 10
```

## `rec generate`

Trigger AI recommendation generation.

```bash
infraudit rec generate
```

## `rec savings`

Show total potential savings across all recommendations.

```bash
infraudit rec savings
```

## `rec apply <id>`

```bash
infraudit rec apply 10
```

## `rec dismiss <id>`

```bash
infraudit rec dismiss 10
```
