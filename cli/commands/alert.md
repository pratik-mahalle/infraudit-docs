---
title: "alert"
description: "List, acknowledge, and resolve alerts from the CLI."
icon: "square-terminal"
---

# `infraudit alert`

Manage security and operational alerts.

## `alert list`

```bash
infraudit alert list
infraudit alert list --severity high --status open
infraudit alert list --type security
```

| Flag | Description |
|---|---|
| `--severity` | `critical`, `high`, `medium`, `low` |
| `--status` | `open`, `acknowledged`, `resolved` |
| `--type` | `security`, `compliance`, `performance` |

## `alert get <id>`

```bash
infraudit alert get 12
```

## `alert summary`

```bash
infraudit alert summary
```

## `alert acknowledge <id>`

```bash
infraudit alert acknowledge 12
```

## `alert resolve <id>`

```bash
infraudit alert resolve 12
```
