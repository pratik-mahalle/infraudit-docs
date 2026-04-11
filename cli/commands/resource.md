---
title: "resource"
description: "List and inspect discovered cloud resources."
icon: "square-terminal"
---


List and inspect cloud resources discovered by provider syncs.

## `resource list`

List resources with optional filters.

```bash
# List all
infraudit resource list

# Filter by provider
infraudit resource list --provider 1

# Filter by type and region
infraudit resource list --type ec2 --region us-east-1

# JSON output
infraudit resource list -o json
```

| Flag | Description |
|---|---|
| `--provider` | Filter by provider ID |
| `--type` | Filter by resource type (e.g. `ec2`, `s3`, `rds`) |
| `--region` | Filter by region |
| `--status` | Filter by status (`active`, `stopped`, `deleted`) |

## `resource get <id>`

Show detailed information about a specific resource.

```bash
infraudit resource get 42
```

## `resource delete <id>`

Delete a resource record from InfraAudit. Does not delete the actual cloud resource.

```bash
infraudit resource delete 42
```
