---
title: "Automation and Jobs"
description: "Manage the scheduled jobs that power InfraAudit's continuous scans and syncs."
icon: "clock"
---


InfraAudit runs background jobs on a cron schedule to keep your infrastructure data current. The **Jobs** section lets you view job history, trigger manual runs, and adjust schedules.

## Job types

| Job type | What it does | Default schedule |
|---|---|---|
| `resource_sync` | Pulls the latest resource inventory from all providers | Every 6 hours |
| `drift_detection` | Compares current state to baselines for all resources | Every 4 hours |
| `vulnerability_scan` | Runs Trivy against scannable artifacts | Daily at 02:00 UTC |
| `cost_sync` | Fetches billing data from provider APIs | Daily at 03:00 UTC |
| `compliance_check` | Runs all enabled compliance frameworks | Daily at 04:00 UTC |

## Job list

In the sidebar, click **Jobs**. The list shows all defined jobs with their next scheduled run time and the status of the last execution.

Click a job to expand its execution history — a timeline of runs with start time, duration, status (`running`, `succeeded`, `failed`), and a log excerpt.

## Triggering a manual run

Click **Run now** on any job to trigger an immediate execution, or use the CLI:

```bash
# List all jobs
infraudit job list

# Trigger a manual run
infraudit job trigger <job-id>

# Wait for the job to complete
infraudit job trigger <job-id> --wait
```

## Job execution detail

Click a past execution to see:

- Start and end timestamps
- Duration
- Status
- Log snippet (last 500 lines of the job's output)
- Resources or findings affected

## Modifying schedules

Schedules are set via environment variables on the backend. Change them in `.env` and restart the API:

```env
JOB_RESOURCE_SYNC_SCHEDULE=0 */6 * * *
JOB_DRIFT_DETECTION_SCHEDULE=0 */4 * * *
JOB_VULNERABILITY_SCAN_SCHEDULE=0 2 * * *
JOB_COST_SYNC_SCHEDULE=0 3 * * *
JOB_COMPLIANCE_CHECK_SCHEDULE=0 4 * * *
```

These use standard cron syntax. The scheduler uses `robfig/cron/v3`, which supports seconds if you prefix the expression with a seconds field.

For SaaS, schedules are not user-configurable. Contact support if you need a custom schedule.

## Disabling a job

There's no disable toggle in the UI. To stop a job from running, remove or comment out its `SCHEDULE` env var and restart the API. Alternatively, use the CLI:

```bash
infraudit job disable <job-id>
```

## Notifications on failure

Job failures generate an alert in the Alerts section. To also send a Slack notification when a job fails, configure a routing rule for the `job.failed` event type under **Settings → Notifications → Routing**.

## Next steps

- [Concepts: Job scheduler](/concepts/job-scheduler)
- [CLI: job commands](/cli/commands/job)
- [Drift detection](/platform/drift-detection)
