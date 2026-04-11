---
title: "Remediation Workflow"
description: "How InfraAudit manages the full remediation lifecycle from suggestion to rollback."
icon: "wrench"
---


InfraAudit's remediation system takes a finding (drift, vulnerability, compliance failure) and provides a structured path to fix it — with optional approval gates and a rollback window.

## Lifecycle states

```
suggested
    │
    ├── [if approval required]
    │       ↓
    │   pending_approval ──[rejected]──→ (closed)
    │       │
    │   [approved]
    │       │
    ▼       ▼
executing
    │
    ├── completed ──[within rollback window]──→ rolled_back
    │
    └── failed
```

## Creating a remediation action

Remediation actions are created from:

1. **Recommendations:** Click **Apply fix** in the Recommendations section.
2. **Drift findings:** Click **Apply remediation** in the Drift detail panel.
3. **Compliance failures:** Click **Create remediation** from a failing control.
4. **CLI:**

```bash
infraudit remediation suggest --finding drift:<drift-id>
```

5. **API:**

```bash
curl -X POST http://localhost:8080/api/v1/remediation \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"finding_type": "drift", "finding_id": 42}'
```

## Review and approval

Every created remediation starts in `suggested` state. The action includes:

- What change will be made (e.g. "Enable S3 server-side encryption on bucket `my-data-bucket`")
- The affected resource and current configuration
- Pre-execution snapshot (the configuration that will be used for rollback)
- Estimated risk (low/medium/high based on the scope of the change)

If `REMEDIATION_REQUIRE_APPROVAL=true` (the default), the action moves to `pending_approval` and an approver must review it before execution.

Approval via CLI:

```bash
infraudit remediation approve <action-id>
```

## Execution

After approval (or immediately if approval is disabled), the action can be executed:

```bash
infraudit remediation execute <action-id>
```

InfraAudit calls the cloud provider API to apply the change. The action moves to `executing` and then to `completed` or `failed`.

**What executed changes look like:**

| Finding type | Cloud API call |
|---|---|
| S3 bucket encryption drift | `PutBucketEncryption` |
| Security group overpermission | `RevokeSecurityGroupIngress` |
| IAM key rotation | `CreateAccessKey` + `DeleteAccessKey` |
| RDS backup disabled | `ModifyDBInstance` |

## Rollback

Within the rollback window (default: 30 minutes), a completed action can be reversed:

```bash
infraudit remediation rollback <action-id>
```

InfraAudit uses the pre-execution snapshot to reconstruct and apply the original configuration. Not all actions support rollback — the detail panel shows whether rollback is available.

After the rollback window expires, manual reversal in the cloud console is required.

## Auto-execution

For teams that want fully automated remediation (no manual approve/execute steps), disable the approval requirement:

```env
REMEDIATION_REQUIRE_APPROVAL=false
```

Individual high-risk action types can still require approval even when global approval is off, by setting per-type overrides in the Settings UI.

## Audit trail

Every state transition (suggested → pending_approval → approved → executing → completed → rolled_back) is logged with the user who performed it, the timestamp, and any comments. The audit log is accessible from the remediation detail panel and exported in compliance reports.
