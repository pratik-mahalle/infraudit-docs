---
title: "Compliance"
description: "Run compliance assessments against CIS Benchmarks, SOC2, NIST, PCI-DSS, and HIPAA frameworks."
icon: "clipboard-check"
---


The Compliance section runs automated assessments of your infrastructure against security and regulatory frameworks. Each assessment maps specific controls to specific resources and tells you which pass, which fail, and what to fix.

## Supported frameworks

| Framework | ID | Scope |
|---|---|---|
| CIS AWS Foundations Benchmark | `cis-aws` | AWS accounts |
| CIS GCP Foundations Benchmark | `cis-gcp` | GCP projects |
| CIS Azure Foundations Benchmark | `cis-azure` | Azure subscriptions |
| SOC 2 Type II | `soc2` | All providers |
| NIST SP 800-53 Rev 5 | `nist-800-53` | All providers |
| PCI-DSS v3.2.1 | `pci-dss` | All providers |
| HIPAA Security Rule | `hipaa` | All providers |

## Enabling a framework

1. In the sidebar, click **Compliance**.
2. Click **Enable framework**.
3. Select the framework and (optionally) the providers to scope it to.
4. Click **Enable**.

InfraAudit runs the first assessment automatically after enabling. Subsequent assessments run on a daily schedule by default.

Via CLI:

```bash
infraudit compliance enable cis-aws
infraudit compliance enable soc2 --provider 1
```

## Running an assessment

Trigger an assessment on demand from the **Compliance** page by clicking **Run assessment**, or:

```bash
infraudit compliance assess
infraudit compliance assess --framework cis-aws
```

## Assessment results

An assessment produces:

- **Overall score** — percentage of controls that passed
- **Control list** — each control's pass/fail status with a description
- **Affected resources** — for failed controls, the specific resources that caused the failure
- **Suggested fixes** — remediation steps for each failed control

The results page shows a breakdown by control category (e.g. "Identity and Access Management", "Logging").

## Exporting results

Assessment results can be exported as PDF or CSV for auditor evidence:

1. Open the assessment.
2. Click **Export** and choose PDF or CSV.
3. The PDF includes the full control list with pass/fail and a summary table suitable for audit reports.

CLI export:

```bash
infraudit compliance export --assessment <assessment-id> --format pdf --output report.pdf
```

## Multi-account assessments

When multiple providers are in scope, InfraAudit runs the assessment across all of them and shows per-account scores alongside the aggregate. This is useful for organizations running multiple AWS accounts under a single compliance program.

## Control-to-resource mapping

For each failed control, InfraAudit links the control to the exact resources that caused the failure. For example, a CIS AWS control requiring S3 bucket server-side encryption will list every bucket where encryption is disabled.

## CLI

```bash
# List enabled frameworks
infraudit compliance list

# Run all enabled frameworks
infraudit compliance assess

# View latest assessment for a framework
infraudit compliance results --framework cis-aws

# Export as PDF
infraudit compliance export --assessment <id> --format pdf
```

## Next steps

- [Alerts](/platform/alerts) — route compliance failures to Slack or email
- [Remediation](/platform/remediation) — apply fixes for failed controls
- [Concepts: Compliance frameworks](/concepts/compliance-frameworks)
- [CLI: compliance commands](/cli/commands/compliance)
