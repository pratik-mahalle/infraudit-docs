---
title: "Trivy and NVD"
description: "How InfraAudit uses Trivy for vulnerability scanning and NVD for CVE enrichment."
icon: "shield-check"
---


InfraAudit uses [Trivy](https://trivy.dev) as its vulnerability scanner and enriches findings with data from the [National Vulnerability Database (NVD)](https://nvd.nist.gov/).

## Trivy

Trivy is an open-source vulnerability scanner by Aqua Security. InfraAudit runs it as an embedded component of the API container to scan:

- Container images referenced in Kubernetes deployments and pods
- OS packages (Alpine, Debian, Ubuntu, CentOS, etc.)
- Application dependencies (Go modules, Python pip/conda, Node.js npm/yarn, Ruby gems, Java Maven/Gradle, .NET NuGet)

InfraAudit bundles Trivy inside the Docker image, so no separate installation is needed. The Trivy database is updated on container restart.

### Updating the Trivy database

The Trivy vulnerability database is cached in `/tmp/trivy-cache/` inside the API container. To force a database update, restart the API container:

```bash
docker compose restart api
```

For self-hosted setups with no internet access, mirror the Trivy database and configure the `TRIVY_DB_REPOSITORY` environment variable to point to your internal registry.

## NVD

The NVD provides CVSS scores, severity ratings, and CVE descriptions for each finding Trivy reports. InfraAudit enriches Trivy output with NVD data to give each finding:

- CVSS v3 base score and vector string
- Severity (Critical, High, Medium, Low) based on CVSS score
- CVE description from the NVD advisory
- References (vendor bulletins, patches, advisories)
- Fix version, if published in NVD

### NVD API key (optional)

Without an NVD API key, the NVD endpoint applies rate limiting. For high-volume scanning, provide an API key:

1. Register at [nvd.nist.gov/developers/request-an-api-key](https://nvd.nist.gov/developers/request-an-api-key).
2. Add the key to `.env`:

```env
NVD_API_KEY=your-nvd-api-key
```

## Scan flow

1. For each scannable resource, InfraAudit identifies the artifact to scan (e.g. container image `nginx:1.24`).
2. Trivy scans the image, producing a list of CVE matches with package names and versions.
3. InfraAudit queries the NVD API for each unique CVE ID to fetch the CVSS score and description.
4. The enriched findings are stored in the database with severity, status, and fix information.
5. Findings above the configured threshold trigger alerts.

## Configuration

```env
# Severity threshold: only store findings at or above this level
VULN_SEVERITY_THRESHOLD=medium

# Trivy cache directory
TRIVY_CACHE_DIR=/tmp/trivy-cache

# NVD API key (optional)
NVD_API_KEY=

# Custom Trivy DB for air-gapped environments
TRIVY_DB_REPOSITORY=
```

## Air-gapped deployments

For deployments without internet access:

1. Mirror the Trivy DB to an internal OCI registry.
2. Set `TRIVY_DB_REPOSITORY=your-registry.internal/trivy-db:2`.
3. Host an NVD mirror or disable NVD enrichment by not setting `NVD_API_KEY` (Trivy's own severity ratings still apply).

## False positives

If a vulnerability doesn't apply to your environment (e.g. the vulnerable code path is not reachable), mark it as ignored in InfraAudit with a reason:

```bash
infraudit vulnerability update <vuln-id> --status ignored --reason "not exploitable in this deployment"
```

Ignored findings are excluded from reports and metrics by default.
