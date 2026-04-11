---
title: "Compliance Frameworks"
description: "How InfraAudit's compliance engine works, and what CIS, SOC2, NIST, PCI-DSS, and HIPAA controls look like."
icon: "shield-check"
---


InfraAudit's compliance engine evaluates your infrastructure against a library of controls from well-known frameworks. Each control is a rule that checks a specific attribute of a specific resource type.

## Supported frameworks

| Framework | ID | Version |
|---|---|---|
| CIS AWS Foundations Benchmark | `cis-aws` | v2.0 |
| CIS GCP Foundations Benchmark | `cis-gcp` | v2.0 |
| CIS Azure Foundations Benchmark | `cis-azure` | v2.0 |
| SOC 2 Type II | `soc2` | — |
| NIST SP 800-53 | `nist-800-53` | Rev 5 |
| PCI-DSS | `pci-dss` | v3.2.1 |
| HIPAA Security Rule | `hipaa` | — |

## Control structure

Each control has:

```json
{
  "id": "cis-aws-2.1.1",
  "framework": "cis-aws",
  "category": "Storage",
  "title": "Ensure all S3 buckets employ encryption-at-rest",
  "description": "S3 Managed Encryption (SSE-S3) or AWS KMS encryption must be enabled for all S3 buckets.",
  "severity": "high",
  "resource_types": ["s3_bucket"],
  "check": "s3_bucket.encryption.enabled == true"
}
```

The `check` field is an expression evaluated against the resource's configuration snapshot. If the expression returns `false`, the control fails for that resource.

## Assessment runs

When an assessment runs (scheduled or manual), the engine:

1. Fetches all active resources of the types required by each control.
2. Evaluates the control expression against each resource's latest configuration snapshot.
3. Stores the result (pass/fail) with a link to the resource.
4. Calculates an overall score: `passed_controls / total_controls`.

No cloud API calls are made during an assessment — it runs against already-cached configuration data.

## Control-to-resource mapping

Failed controls map directly to the resources that caused the failure. For a large account, a single control failure might affect dozens of resources. The assessment detail view shows:

- Control title and description
- Pass/fail status
- For failures: the list of resources that failed, with a link to each

## Remediation guidance

Each control includes a remediation field with instructions. This text is displayed in the assessment UI alongside the failure. For controls with automated remediation support, InfraAudit can create a remediation action directly from the compliance finding.

## Multi-account scoring

When multiple providers are in scope, InfraAudit shows:

- **Per-provider score** — percentage passed for each account
- **Aggregate score** — weighted average across all providers
- **By-category breakdown** — IAM, logging, storage, networking, etc.

## Adding custom controls

Custom controls are not yet supported in the UI. To add a custom control, add a JSON file to `internal/compliance/controls/custom/` following the control schema and restart the API.

See [Contributing: Adding a compliance framework](/contributing/adding-a-compliance-framework) for the full schema and engine documentation.

## Exporting for auditors

Assessment results export as:

- **PDF** — full report with control list, pass/fail, resource mapping, and score summary — suitable for audit evidence
- **CSV** — raw control results for import into Excel or audit management tools

```bash
infraudit compliance export --assessment <id> --format pdf --output report.pdf
infraudit compliance export --assessment <id> --format csv --output results.csv
```
