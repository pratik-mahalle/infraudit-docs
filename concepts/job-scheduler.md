---
title: "Job Scheduler"
description: "How InfraAudit's cron-based job scheduler works, and what each job type does."
icon: "clock"
---


InfraAudit's background jobs — resource sync, drift detection, vulnerability scan, cost sync, and compliance checks — run on a cron schedule powered by `robfig/cron/v3`. The scheduler starts embedded in the API process.

## How it works

At API startup, the scheduler registers five job definitions, each mapped to a cron expression from environment variables. The scheduler runs in a dedicated goroutine and fires jobs on their schedule.

When a job fires:

1. A `job_execution` record is created with `status=running` and `started_at=now`.
2. The job function runs synchronously in the scheduler goroutine (with a timeout).
3. On completion, the record is updated with `status=succeeded` or `status=failed`, the end time, and a log snippet.

## Job types

### resource_sync

**Purpose:** Pull the latest resource inventory from all connected providers.

**What it does:**
- Calls the cloud provider API for each connected provider.
- Creates new resource records for newly discovered resources.
- Updates configuration snapshots for existing resources.
- Marks resources as `deleted` if they no longer appear in the API response.
- Captures a new baseline for any resource whose configuration changed.

**Default schedule:** `0 */6 * * *` (every 6 hours)

### drift_detection

**Purpose:** Compare current resource state against baselines and create drift findings.

**What it does:**
- For each active resource with a baseline, fetches the current configuration snapshot.
- Runs the JSON diff algorithm.
- Creates new `drift` records for detected differences.
- Resolves existing drift records where the configuration has returned to the baseline state.
- Triggers recommendation generation for new critical/high drifts.

**Default schedule:** `0 */4 * * *` (every 4 hours)

### vulnerability_scan

**Purpose:** Scan container images and resource artifacts for CVEs.

**What it does:**
- Identifies scannable artifacts (container images from Kubernetes pods, EC2 AMIs).
- Runs Trivy against each artifact.
- Enriches findings with NVD metadata (CVSS scores, descriptions).
- Creates or updates `vulnerability` records.
- Closes findings for artifacts that no longer have the vulnerability.

**Default schedule:** `0 2 * * *` (02:00 UTC daily)

### cost_sync

**Purpose:** Fetch and store billing data from cloud providers.

**What it does:**
- Calls AWS Cost Explorer, GCP BigQuery, or Azure Cost Management.
- Inserts daily cost records into the `cost_records` table.
- Runs the anomaly detection check on the latest data point.
- Generates cost forecasts and caches them.

**Default schedule:** `0 3 * * *` (03:00 UTC daily)

### compliance_check

**Purpose:** Run all enabled compliance frameworks against current resource snapshots.

**What it does:**
- For each enabled framework and each assessment run in scope, evaluates all controls.
- Creates `assessment` and `control_result` records.
- Triggers alerts for any control that newly fails.
- Triggers recommendation generation for failed controls.

**Default schedule:** `0 4 * * *` (04:00 UTC daily)

## Leader election

When running multiple API instances, only one instance should run the scheduled jobs (to avoid duplicate scans). InfraAudit implements leader election via a database lock (`scheduled_jobs_leader` row in the `jobs` table). Each instance tries to acquire the lock at startup; only the leader runs the scheduler. If the leader goes down, another instance acquires the lock within 60 seconds.

## Job execution history

Each `job_execution` record stores:

- `job_type` — which job ran
- `status` — `running`, `succeeded`, or `failed`
- `started_at` / `ended_at`
- `duration_ms`
- `log` — last 1,000 lines of the job's output
- `error` — error message if `status=failed`

Query via CLI:

```bash
infraudit job list
infraudit job executions --job-type drift_detection --limit 10
```

## Manual job triggers

Trigger any job on demand without waiting for its next scheduled run:

```bash
infraudit job trigger <job-id>
infraudit job trigger <job-id> --wait  # block until complete
```

Via the API:

```bash
curl -X POST http://localhost:8080/api/v1/jobs/<job-id>/trigger \
  -H "Authorization: Bearer $TOKEN"
```
