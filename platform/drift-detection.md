---
title: "Drift Detection"
description: "Detect and investigate configuration drift across your cloud infrastructure."
icon: "radar"
---


Drift detection compares the current configuration of your cloud resources against a captured baseline. When InfraAudit finds a difference — a security group rule added, an S3 bucket made public, encryption disabled — it creates a drift finding with a severity and timestamps.

## How it works

1. **Baseline capture.** When a provider is first connected, InfraAudit captures a configuration snapshot of every discovered resource. This becomes the initial baseline.
2. **Scheduled scans.** The drift scanner runs on a cron schedule (default: every 4 hours). Each run pulls the current state from the cloud provider API and compares it to the active baseline.
3. **Findings.** Differences that exceed a configurable threshold become drift findings, stored with a severity and status.
4. **Alerts.** If alert rules are configured, severe drifts trigger notifications to your connected Slack channels, email addresses, or webhooks.

## Drift types

| Type | What it detects |
|---|---|
| **Configuration** | Any change to resource settings not classified as security or compliance |
| **Security** | Changes that weaken the security posture (e.g. port 22 opened to 0.0.0.0/0) |
| **Compliance** | Changes that violate a compliance control in an enabled framework |

## Severity

Each drift is assigned a severity based on the specific change detected:

| Severity | Examples |
|---|---|
| **Critical** | S3 bucket made public, unrestricted admin access granted |
| **High** | Security group opened to the internet, SSL/TLS disabled |
| **Medium** | Non-critical configuration change, unexpected tag removed |
| **Low** | Display name changed, description updated |

## Drift list

1. In the sidebar, click **Drift Detection**.
2. The drift list shows all active findings, newest first.

Filter options:
- Severity (critical, high, medium, low)
- Type (configuration, security, compliance)
- Provider
- Status (detected, investigating, resolved)
- Resource type

## Drift detail

Click a drift to see:

- **Summary** — what changed, on which resource, at what time
- **Diff** — side-by-side JSON comparison of the baseline and current configuration
- **Affected resource** — link to the resource detail panel
- **Timeline** — when detected, when last updated
- **Recommendations** — suggested remediation steps

## Resolving a drift

From the drift detail panel:

- **Mark as resolved** — closes the finding without making a change (use when the drift is intentional or already fixed)
- **Apply remediation** — executes an automated fix (requires a remediation action to be available)
- **Create ticket** — copies the drift detail to your clipboard in a format suitable for a Jira or GitHub issue

## IaC drift

InfraAudit also detects **IaC drift** — cases where the live resource configuration no longer matches the Terraform or CloudFormation template that originally created it.

Upload your IaC files under **IaC** in the sidebar. InfraAudit parses the files, identifies the resources they declare, and runs a comparison.

## Baselines

A baseline is the "known good" snapshot for a resource. InfraAudit automatically creates baselines during the initial sync and after a drift is resolved. You can also:

- Capture a manual baseline from the resource detail panel
- Promote the current live state to a new baseline (useful after a planned change)

See [Concepts: Drift detection](/concepts/drift-detection) for a deeper technical explanation.

## CLI

```bash
# Trigger a drift scan
infraudit drift detect

# List all open drifts
infraudit drift list

# Filter by severity
infraudit drift list --severity critical

# Get drift detail
infraudit drift get <drift-id>

# Resolve a drift
infraudit drift resolve <drift-id>
```
