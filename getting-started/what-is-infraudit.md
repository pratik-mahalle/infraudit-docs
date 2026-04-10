# What is InfraAudit?

InfraAudit is a multi-cloud operations platform that combines three things most teams currently buy separately: a security posture scanner, a cost management tool, and a compliance assessor. It connects to your AWS, GCP, Azure, and Kubernetes accounts, pulls inventory and billing data, then runs scheduled scans to surface drift, vulnerabilities, overspend, and control failures in one place.

## The problem it solves

Cloud teams juggle several tools to answer basic questions:

- "Did someone change a production security group in the last 24 hours?"
- "Why did our AWS bill jump 40% this month?"
- "Which of our EC2 instances fail CIS Benchmark 1.4?"
- "Does this Terraform plan actually match what's running?"

Each question lives in a different dashboard. InfraAudit pulls the signals into one backend, correlates them per resource, and gives you one API, one CLI, and one UI to ask them from.

## How it works

1. **Connect a cloud account.** Supply AWS access keys, a GCP service account JSON, an Azure service principal, or a Kubernetes kubeconfig. Credentials are encrypted at rest with AES-GCM using the `ENCRYPTION_KEY` env var.
2. **Sync runs automatically.** A background worker pulls resource inventory and billing data on a schedule (default: every 6 hours for resources, daily for costs).
3. **Scans find issues.** Scheduled jobs run drift detection, vulnerability scans, and compliance assessments. Each finding lands in the database with a severity and a link to the affected resource.
4. **Alerts fire on the channels you pick.** Slack webhooks, email, or custom HTTP webhooks. Each channel is configurable per event type.
5. **Recommendations get generated.** Gemini analyzes findings and produces remediation steps with estimated cost savings and impact.
6. **You act on them.** Approve a remediation through the UI, CLI, or API. The remediation runs with a rollback window.

## Feature areas

### Security monitoring
- Continuous misconfiguration scanning against captured baselines
- Drift detection (configuration, security, compliance)
- Vulnerability scanning via Trivy and the NVD database
- Severity-classified alerts with Slack, email, and webhook delivery
- IaC drift: upload Terraform, CloudFormation, or Kubernetes manifests and compare them against live resources

### Cost optimization
- Multi-cloud billing ingest (AWS Cost Explorer, Azure Cost Management, GCP BigQuery export)
- Historical trends by provider, service, and time window
- Forecasting for the next 30, 60, or 90 days
- Anomaly detection on daily cost deltas
- Savings recommendations: Reserved Instances, Spot migration, right-sizing, idle resource cleanup

### Compliance
- Framework engine with pre-built CIS Benchmarks, SOC2, NIST 800-53, PCI-DSS, and HIPAA controls
- Control-to-infrastructure mapping so failed controls link to specific resources
- Automated assessment runs per framework
- PDF and CSV export of assessment results
- Multi-account assessment with per-account scores

### AI recommendations
- Google Gemini (`gemini-2.5-pro`) analyzes each finding with context about the affected resource
- Rule-based fallback runs when `GEMINI_API_KEY` is not set, so recommendations still generate in fully offline self-hosted deployments
- Cost recommendations include an estimated monthly savings figure
- Security recommendations include a risk reduction score and suggested fix

### Automation
- Cron-based job scheduler using `robfig/cron/v3`
- Job types: resource sync, drift detection, vulnerability scan, cost sync, compliance check
- Per-job execution history with success/failure status
- Manual job triggers via UI, CLI, or API
- Approval-gated auto-remediation with rollback

## Architecture at a glance

- **Backend:** Go 1.24+, Chi HTTP router, PostgreSQL or SQLite, optional Redis cache
- **Auth:** Supabase JWT (ES256 via JWKS or HS256 shared secret) with Google and GitHub OAuth flows
- **Frontend:** React 18 + TypeScript + Vite + Radix UI
- **AI:** Google Gemini API for recommendations (optional)
- **Scanners:** Trivy for container image scanning, NVD feed for CVE matching
- **Metrics:** Prometheus-compatible `/metrics` endpoint, optional Grafana dashboards
- **Deployment:** Docker, docker-compose, or Kubernetes manifests under `deployments/kubernetes/`

## Who it's for

- **Platform and DevOps teams** running workloads across more than one cloud provider
- **Security engineers** who need drift detection, vulnerability scanning, and compliance reporting in one view
- **FinOps practitioners** tracking cost allocation, forecasting, and savings recommendations
- **SREs and on-call engineers** who want actionable alerts routed to Slack or PagerDuty via webhooks

## Editions

The Community edition is MIT-licensed and self-hosted. It includes every feature documented here. The SaaS editions (Starter, Professional, Enterprise) add managed hosting, priority support, longer data retention, and enterprise SSO. The API, CLI, and feature set are identical across editions.

## Next steps

- New to the product? Read [Core concepts](core-concepts.md) to learn the vocabulary (resource, provider, drift, baseline, assessment, remediation).
- Want to try it? Jump to [Quickstart: SaaS](quickstart-saas.md) or [Quickstart: Self-host](quickstart-self-host.md).
- Building an integration? Start with the [API overview](../api/README.md).
