---
title: "MCP server"
description: "Connect Claude, Cursor and other AI tools to your InfrAudit data."
icon: "plug"
---


InfrAudit runs a hosted [Model Context Protocol](https://modelcontextprotocol.io) server. Point an AI tool at it and ask about your findings, drift, vulnerabilities, cost, compliance and resources in plain language.

## Step 1: Create an API key

1. Go to **Settings → API access**.
2. Name the key, choose **Read-only** or **Read and write**, and click **Generate**.
3. Copy the key. It is shown once.

A key acts as the person who created it, inside their organization. It can never do more than that person can do in the app, and it stops working if they leave the organization. Keys expire after 30 days.

Use a read-only key unless you want the AI tool to make changes.

## Step 2: Add the server to your tool

The server URL is `https://api.infraudit.com/mcp`. It uses streamable HTTP and a bearer token.

**Claude Code**

```bash
claude mcp add --transport http infraudit https://api.infraudit.com/mcp \
  --header "Authorization: Bearer ia_your_key"
```

**Cursor, VS Code and other clients** (`mcp.json`)

```json
{
  "mcpServers": {
    "infraudit": {
      "url": "https://api.infraudit.com/mcp",
      "headers": { "Authorization": "Bearer ia_your_key" }
    }
  }
}
```

For self-hosted deployments, replace the host with your API host.

## What the tool can read

| Area | Tools |
|---|---|
| Findings | `list_findings`, `get_findings_summary`, `get_finding`, `get_finding_change_events`, `list_finding_dispositions` |
| Alerts | `list_alerts`, `get_alerts_summary`, `get_alert` |
| Drift | `list_drifts`, `get_drift_summary`, `get_drift_coverage`, `get_drift`, `get_drift_explanation`, `list_drift_scans` |
| Vulnerabilities | `list_vulnerabilities`, `get_vulnerability_summary`, `get_top_vulnerabilities`, `get_vulnerability`, `list_vulnerability_scans` |
| Cost | `get_cost_overview`, `get_cost_trends`, `get_cost_forecast`, `get_cost_savings`, `list_cost_anomalies`, `list_cost_optimizations`, `list_cost_monitors` |
| Compliance | `get_compliance_overview`, `list_compliance_frameworks`, `list_framework_controls`, `list_failing_controls`, `list_compliance_assessments`, `get_compliance_assessment` |
| Inventory | `list_resources`, `get_resource`, `list_providers` |
| Policies | `list_policies`, `list_policy_violations` |

## What the tool can change

These tools only appear for **Read and write** keys, and each still needs the matching role in the app.

| Tool | What it does |
|---|---|
| `update_finding_status` | Resolve or reopen a finding, with a reason. Ignoring, accepting or marking a false positive is only possible in the app |
| `create_jira_issue` | Create a Jira issue for an alert |
| `start_drift_scan` | Queue a drift scan |
| `start_vulnerability_scan` | Queue a vulnerability scan |
| `create_cost_monitor` | Create a budget or spend monitor |
| `create_policy_draft` | Create a policy (Rego v1) as an inactive draft; a person activates it in the app |

Nothing can be deleted through MCP, and no tool changes anything in your cloud accounts.

## Limits

- 10 requests per second per key.
- Results larger than 128 KB are cut off. Narrow the request with filters or a smaller page size.
