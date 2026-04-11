---
title: "Vulnerabilities"
description: "Scan for CVEs in your cloud resources using Trivy and the NVD database."
icon: "shield-exclamation"
---


The Vulnerabilities section shows CVEs matched against your cloud resources. InfraAudit uses [Trivy](https://trivy.dev) for scanning and enriches findings with metadata from the [NVD](https://nvd.nist.gov/) database.

## How scanning works

The vulnerability scanner runs as a scheduled job (default: daily):

1. For each active resource, InfraAudit identifies scannable artifacts — primarily container images for Kubernetes workloads and EC2 instances with known AMIs.
2. Trivy scans the artifacts for known CVEs across OS packages, language runtime dependencies (Go, Python, Node.js, etc.), and application libraries.
3. Findings are matched against the NVD feed to pull in CVSS scores, descriptions, and fix information.
4. New findings are stored with a status of `open` and, if alert rules exist, trigger notifications.

## Vulnerability list

In the sidebar, click **Vulnerabilities**. The table shows:

| Column | Description |
|---|---|
| **CVE ID** | The CVE identifier (e.g. `CVE-2024-12345`) |
| **Severity** | CVSS severity: `critical`, `high`, `medium`, `low` |
| **Affected resource** | The resource containing the vulnerable artifact |
| **Package** | The affected package and version |
| **Fix version** | The version that fixes the CVE, if one exists |
| **Status** | `open`, `fixed`, or `ignored` |
| **Detected** | Timestamp of first detection |

## Filtering

Filter by severity, resource type, provider, status, or CVE ID. The severity filter is the most useful for triage — start with `critical` and `high`.

## Vulnerability detail

Click a CVE row to open the detail panel:

- **CVE description** — pulled from NVD
- **CVSS score and vector** — the scoring breakdown
- **Affected packages** — all packages and versions where this CVE appears
- **Fix version** — the patched version, if available
- **References** — links to the NVD advisory, vendor bulletins, and patches

## Managing findings

### Mark as fixed

When you've patched the package and re-deployed, run a new vulnerability scan. InfraAudit re-scans and moves the finding to `fixed` if the package version is no longer present.

```bash
infraudit vuln scan
```

### Ignore a finding

Some CVEs are not exploitable in your environment. Mark them as ignored from the detail panel or via the CLI:

```bash
infraudit vulnerability update <vuln-id> --status ignored --reason "not reachable from public network"
```

Ignored findings are hidden from the default list view but remain in the database for audit purposes.

## Triggering a manual scan

From the UI, click **Run scan** on the Vulnerabilities page.

From the CLI:

```bash
# Scan all providers
infraudit vuln scan

# Scan a specific provider
infraudit vuln scan --provider 1

# Scan a specific resource
infraudit vuln scan --resource <resource-id>
```

## Alert configuration

Vulnerability findings can trigger alerts via Slack, email, or webhooks. Configure thresholds under **Settings → Notifications**. A common config: alert on `critical` and `high` findings only.

## Integration with recommendations

For each critical or high vulnerability with a known fix, InfraAudit generates an AI-assisted recommendation that includes:

- The affected resource and package
- The fix version and upgrade command
- Estimated effort and priority

See [Recommendations](/platform/recommendations).

## Next steps

- [Integrations: Trivy and NVD](/integrations/trivy-and-nvd) — scanner configuration
- [CLI: vulnerability commands](/cli/commands/vulnerability)
- [Concepts: Drift detection](/concepts/drift-detection)
