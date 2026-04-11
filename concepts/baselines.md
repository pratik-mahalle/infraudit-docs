---
title: "Baselines"
description: "What baselines are, how they're created, and how to manage them across your resources."
icon: "bookmark"
---


A **baseline** is a captured snapshot of a resource's configuration at a specific point in time. It's the reference point that drift detection compares against. Without a baseline, there's nothing to compare — drift detection produces no findings.

## What a baseline contains

A baseline stores the complete JSON configuration of a resource as returned by the cloud provider API. For an EC2 instance, this includes instance type, AMI ID, security group associations, IAM instance profile, tags, network interfaces, and more.

Baselines are stored in the `baselines` table. Each row references a `resource_id` and has a `captured_at` timestamp.

## Baseline lifecycle

### Creation

A baseline is created in one of four ways:

1. **Initial sync:** When a provider is connected and InfraAudit runs its first resource sync, a baseline is automatically captured for every discovered resource.
2. **Post-resolve:** When a drift finding is resolved, InfraAudit can optionally capture a new baseline from the current live state.
3. **Manual capture:** A user explicitly captures a baseline via the UI, CLI, or API.
4. **Scheduled capture:** If configured, InfraAudit can capture new baselines on a schedule (useful for resources that intentionally change — you want to track drift from the "last known good state" rather than from initial setup).

### Multiple baselines per resource

A single resource can have many baselines over time. The **most recent baseline** is the default target for drift comparison. You can compare against an older baseline by specifying it explicitly:

```bash
infraudit drift detect --resource <resource-id> --baseline <baseline-id>
```

### Baseline promotion

After a planned configuration change, promote the current live state to a new baseline:

```bash
infraudit baseline create --resource <resource-id>
```

This:
1. Captures the current configuration as a new baseline.
2. Sets it as the active baseline for future comparisons.
3. Resolves any existing drift findings for the resource (since the "drift" is now the new expected state).

## Viewing baselines

```bash
# List baselines for a resource
infraudit baseline list --resource <resource-id>

# Get a specific baseline
infraudit baseline get <baseline-id>

# Compare two baselines
infraudit baseline diff <baseline-id-1> <baseline-id-2>
```

From the UI: open a resource detail, go to the **Baselines** tab.

## Deleting baselines

Deleting a baseline does not delete the resource or any drift findings. It removes the snapshot from the comparison history.

```bash
infraudit baseline delete <baseline-id>
```

You cannot delete the only baseline for a resource if drift detection is enabled for it.

## API

```http
GET    /api/v1/baselines?resource_id=<id>
POST   /api/v1/baselines          # create a new baseline
GET    /api/v1/baselines/:id
DELETE /api/v1/baselines/:id
```

See [API: Baselines](/api/reference/baselines) for the full endpoint reference.

## Storage and retention

Baselines are stored as JSONB in PostgreSQL. For resources with large configurations (e.g. complex Cloud SQL instances), a single baseline can be 10–50 KB. For 1,000 resources with weekly baseline captures over a year, expect about 2 GB of baseline data.

If storage is a concern, set a retention policy to delete baselines older than N days:

```env
BASELINE_RETENTION_DAYS=90
```

This setting does not delete the most recent baseline for any resource.
