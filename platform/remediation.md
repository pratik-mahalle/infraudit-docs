---
title: "Remediation"
description: "Apply automated fixes to drift and vulnerability findings with a rollback window."
icon: "wrench"
---


Remediation lets InfraAudit apply fixes to your cloud infrastructure on your behalf. Each remediation action goes through a defined lifecycle — suggested, approved, executed — with a rollback path if something goes wrong.

## How it works

1. **Suggestion.** A remediation action is created from a drift finding, vulnerability, or recommendation. The action describes the change to be made (e.g. "enable S3 bucket encryption").
2. **Review.** The action is visible in the Remediation queue. A teammate (or the same user) reviews the change and the affected resource.
3. **Approval.** If approval is required (default for actions touching production resources), an admin approves the action.
4. **Execution.** InfraAudit calls the cloud provider API to apply the fix.
5. **Rollback window.** After execution, a 30-minute rollback window opens. If the fix causes a regression, you can roll back within that window.

## Remediation queue

In the sidebar, click **Remediation**. The queue shows:

| Column | Description |
|---|---|
| **Action** | What the remediation will do |
| **Resource** | The affected resource |
| **Source** | The drift, vulnerability, or recommendation that created it |
| **Severity** | Severity of the underlying finding |
| **Status** | `suggested`, `pending_approval`, `approved`, `executing`, `completed`, `failed`, `rolled_back` |
| **Created** | Timestamp |

## Approving an action

Click the remediation action, review the details, then click **Approve**. You can also leave a comment for audit trail purposes.

Via CLI:

```bash
infraudit remediation approve <action-id>
```

## Executing a remediation

After approval, click **Execute** (or it executes automatically if auto-execution is enabled). The status changes to `executing` while InfraAudit calls the provider API. On success it moves to `completed`.

```bash
infraudit remediation execute <action-id>
```

## Rolling back

Within the rollback window (default 30 minutes), click **Rollback** on a completed action. InfraAudit reverses the change using the pre-execution configuration snapshot.

```bash
infraudit remediation rollback <action-id>
```

After the rollback window expires, the action is locked and cannot be rolled back through InfraAudit. Manual reversal in the cloud console is required at that point.

## Approval settings

Under **Settings → Remediation**:

- **Require approval** — enable or disable approval gates (enabled by default)
- **Auto-execute after approval** — skip the manual execute step
- **Rollback window** — set between 5 and 120 minutes

## Supported remediation types

| Type | Example actions |
|---|---|
| **S3** | Enable server-side encryption, block public access, enable versioning |
| **EC2** | Remove overly permissive security group rules, enable instance termination protection |
| **IAM** | Rotate access keys, remove unused access keys |
| **RDS** | Enable Multi-AZ, enable automated backups, enable encryption |
| **Kubernetes** | Set resource limits and requests, enable pod security policies |

## CLI

```bash
# List pending remediations
infraudit remediation list

# Approve
infraudit remediation approve <id>

# Execute
infraudit remediation execute <id>

# Rollback
infraudit remediation rollback <id>

# List with status filter
infraudit remediation list --status pending_approval
```

## Next steps

- [Concepts: Remediation workflow](/concepts/remediation-workflow)
- [CLI: remediation commands](/cli/commands/remediation)
- [Recommendations](/platform/recommendations)
