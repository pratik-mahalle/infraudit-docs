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

The site at [docs.infraudit.com](https://docs.infraudit.com) is built from this repo with [Astro Starlight](https://starlight.astro.build) and an "Editorial" look of our own. Pushing to `main` builds, checks, and deploys it (`.github/workflows/deploy.yml`).

### Run locally

```bash
npm ci
npm run dev        # open the URL it prints; edits to pages and theme.json show up live
npm test           # unit tests
npm run build && npm run test:site   # build, then check every page, link, and the theme
```

Needs Node 22.22 or newer.

### Add a page

1. Write the page as a `.md` (or `.mdx`) file with `title` and `description` frontmatter. The description is shown as the page's opening paragraph.
2. Add its path, without the extension, to a group in `docs.json` → `navigation`. Only pages listed there are published.
3. Link to other pages by site path, for example `[Baselines](/concepts/baselines)`, not `baselines.md`. The build fails on broken links.

A side note in the margin:

```md
:::margin
Drift is anything changed outside your IaC.
:::
```

### Change the theme

Everything lives in `theme.json`. Leave a key out to keep the Editorial default.

| Key | What it does | Example |
|---|---|---|
| `background` | Page background | `{ "type": "paper", "color": "#f3ede1" }` — paper texture on a color |
| | | `{ "type": "color", "color": "#f7f7f5" }` — flat color |
| | | `{ "type": "gradient", "value": "linear-gradient(135deg, #fde3d1, #e5defc)" }` |
| | | `{ "type": "image", "src": "/backgrounds/hero.jpg" }` — put the file in `public/backgrounds/` |
| `accent` | Links, active tab, numbers, drop cap, button | `"#2b3a8c"` |
| `accent2` | Breadcrumb color | `"#9b3d26"` |
| `fonts` | Google Fonts by name | `{ "heading": "Newsreader", "body": "Newsreader", "ui": "Inter", "code": "JetBrains Mono" }` |
| `mode` | `"toggle"` (light first, readers can switch), `"light"`, or `"dark"` | `"toggle"` |

`background`, `accent` and `accent2` take one value (dark mode is worked out for you) or separate values: `{ "light": …, "dark": … }`.

With a gradient or image, text sits on a paper-colored panel so it stays readable.

If a color makes text too hard to read (below WCAG AA, 4.5:1), the preview and the build stop with a message like:

```
theme.json (light mode): accent #6366f1 on background #f3ede1 is 3.83:1, needs 4.5:1. Try accent #5054ef.
```

Use the suggested color, or pick another one that passes.
