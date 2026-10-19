# InfraAudit Documentation

InfraAudit is a cloud infrastructure monitoring, cost optimization, and security platform for AWS, GCP, Azure, and Kubernetes. It detects configuration drift, scans for vulnerabilities, forecasts costs, enforces compliance frameworks, and generates AI-assisted remediation recommendations.

These docs cover the product end to end: the web platform, the CLI, the HTTP API, and the self-hosted OSS Community edition.

## Pick your path

**I want to use the web app.** Start with [What is InfraAudit?](getting-started/what-is-infraudit.md), then follow the [Platform guide](platform/README.md) to connect a cloud account and run your first scan.

**I want to automate from the terminal.** Read the [CLI overview](cli/README.md) and [install the `infraudit` binary](cli/installation.md). The CLI covers every feature the web app does.

**I want to call the API from my own code.** Go to the [API overview](api/README.md) for auth, base URL, versioning, and error handling. The full endpoint list lives under [Endpoint reference](api/reference/README.md), backed by the auto-generated OpenAPI spec.

**I want to run InfraAudit on my own infrastructure.** Read [Prerequisites](self-hosting/prerequisites.md) first — a Supabase project is required. Then follow [Docker Compose](self-hosting/docker-compose.md) or [Kubernetes](self-hosting/kubernetes.md).

**I want to contribute.** Start with [Repo structure](contributing/repo-structure.md) and [Local development](contributing/local-development.md).

## What InfraAudit does

| Area | What you get |
|---|---|
| Security | Drift detection against baselines, vulnerability scanning via Trivy and NVD, real-time alerts by severity |
| Cost | Multi-cloud billing ingest, trend analysis, forecasting, anomaly detection, savings recommendations |
| Compliance | CIS Benchmarks, SOC2, NIST 800-53, PCI-DSS assessments with control-level mapping and report export |
| Automation | Cron-scheduled scans, Slack and email alerts, outbound webhooks, approval-gated auto-remediation |
| AI | Gemini-powered recommendations for cost, security, and compliance findings |

## Supported clouds

- **AWS** — EC2, RDS, S3, Lambda, CloudFront, Cost Explorer, and more
- **Google Cloud Platform** — Compute, Cloud Storage, BigQuery billing export, GKE
- **Microsoft Azure** — VMs, Storage Accounts, Cost Management
- **Kubernetes** — Multi-cluster registration with deployment, pod, and service visibility

## Editions

| Edition | Deployment | License | Resources | Support |
|---|---|---|---|---|
| Community (OSS) | Self-hosted | MIT | Unlimited | Community (GitHub issues) |
| Starter | SaaS | Commercial | Up to 50 | Email |
| Professional | SaaS | Commercial | Up to 200 | Priority |
| Enterprise | SaaS or self-hosted | Commercial | Unlimited | Dedicated |

This documentation applies to both the SaaS editions and the Community OSS edition. Where behavior differs, the page is labeled.

## Source repositories

- Backend (Go): [pratik-mahalle/infraudit-go](https://github.com/pratik-mahalle/infraudit-go)
- Frontend (React): [pratik-mahalle/InfraAudit](https://github.com/pratik-mahalle/InfraAudit)
- Documentation (this repo): [pratik-mahalle/infraudit-docs](https://github.com/pratik-mahalle/infraudit-docs)

## Working on these docs

This repo holds only content. The site at [docs.infraudit.com](https://docs.infraudit.com) is built by [Tessa](https://github.com/pratik-mahalle/tessa), our private docs engine, with its "Editorial" look. Pushing to `main` fetches Tessa, builds, checks every page and link, and deploys (`.github/workflows/deploy.yml`).

### Preview locally

You need read access to `pratik-mahalle/tessa`. Clone it next to this repo, then:

```bash
cd ../tessa
npm ci
DOCS_DIR=../infraudit-docs npm run dev        # live preview; restart after editing docs.json navigation
DOCS_DIR=../infraudit-docs npm run build && DOCS_DIR=../infraudit-docs npm run test:site   # what CI runs
```

### Add a page

1. Write the page as a `.md` (or `.mdx`) file with `title` and `description` frontmatter. The description is shown as the page's opening paragraph.
2. Add its path, without the extension, to a group in `docs.json` → `navigation`. Only pages listed there are published.
3. Link to other pages by site path, for example `[Baselines](/concepts/baselines)`, not `baselines.md`. The check before every deploy fails on broken links.

A side note in the margin:

```md
:::margin
Drift is anything changed outside your IaC.
:::
```

While the old Mintlify site still builds from this repo, it shows `:::margin` lines as plain text.

### Change the theme

Colors, background, fonts and light/dark live in `theme.json`. The full reference is in Tessa's README. If a color makes text hard to read, the build stops and suggests one that works.

### Build access to Tessa

Tessa is private, so the deploy workflow fetches it with a read-only **deploy key**:

1. `ssh-keygen -t ed25519 -N '' -C infraudit-docs-ci -f tessa_deploy`
2. Public half on Tessa: `gh repo deploy-key add tessa_deploy.pub -R pratik-mahalle/tessa --title infraudit-docs-ci` (read-only).
3. Private half as this repo's secret: `gh secret set TESSA_DEPLOY_KEY -R pratik-mahalle/infraudit-docs < tessa_deploy`, then delete both files.

To rotate, repeat the steps and remove the old key under Tessa → Settings → Deploy keys.

### Hosting (docs.infraudit.com)

GitHub Pages serves the site; `public/CNAME` holds the domain. One-time setup:

1. Repo **Settings → Pages**: Source **GitHub Actions**, custom domain `docs.infraudit.com`.
2. DNS for `infraudit.com`: add a **CNAME** record, name `docs`, value `pratik-mahalle.github.io`.
3. Once the domain resolves, tick **Enforce HTTPS** in the same Pages settings.
