---
title: "Recommendations"
description: "AI-generated and rule-based suggestions for cost savings, security hardening, and performance improvements."
icon: "sparkles"
---


Recommendations are suggestions for improving your infrastructure. InfraAudit generates them from Gemini AI when configured, or from a built-in rule engine otherwise. Both sources cover cost, security, and performance.

## Types of recommendations

| Type | Examples |
|---|---|
| **Cost** | Right-size an overprovisioned EC2 instance, purchase Reserved Instances, remove idle resources |
| **Security** | Enable S3 bucket encryption, restrict security group ingress, rotate access keys |
| **Performance** | Scale up an instance hitting CPU limits, migrate a high-I/O workload to provisioned IOPS |

## How they're generated

When `GEMINI_API_KEY` is set, InfraAudit sends each finding (drift, vulnerability, cost anomaly) to the Gemini API along with context about the affected resource — type, configuration, cloud provider, and severity. Gemini returns a structured recommendation with:

- A plain-language explanation of the problem
- Specific remediation steps
- Estimated cost savings (for cost recommendations) or risk reduction score (for security)

When `GEMINI_API_KEY` is not set, InfraAudit falls back to a rule-based engine that applies pre-written templates. The output is less context-specific but still actionable.

See [Concepts: AI recommendations](/concepts/ai-recommendations) for more on how this works.

## Recommendation list

In the sidebar, click **Recommendations**. The list shows:

| Column | Description |
|---|---|
| **Title** | Short description of the recommendation |
| **Type** | Cost, security, or performance |
| **Severity** | The severity of the underlying finding |
| **Estimated impact** | Monthly savings (cost) or risk score reduction (security) |
| **Resource** | The affected resource |
| **Status** | `pending`, `applied`, or `dismissed` |

Filter by type, status, or provider.

## Recommendation detail

Click a recommendation to see:

- The full explanation
- Step-by-step remediation instructions
- A **Apply** button (if automated remediation is available for this type)
- A **Dismiss** button (to hide it from the active list)
- A **Copy** button (to copy the steps to clipboard)

## Applying a recommendation

Some recommendations have a corresponding automated remediation action. When one is available, an **Apply fix** button appears. Clicking it either executes the fix immediately (if approval is not required) or creates a pending remediation action for approval. See [Remediation](/platform/remediation).

## Generating recommendations on demand

Recommendations for a specific resource can be generated from the resource detail panel. Click the resource, open the **Recommendations** tab, and click **Generate recommendation**.

Via CLI:

```bash
# Generate a recommendation for a specific resource
infraudit recommendation generate --resource <resource-id>

# List all pending recommendations
infraudit recommendation list

# Apply a recommendation
infraudit recommendation apply <recommendation-id>

# Dismiss a recommendation
infraudit recommendation dismiss <recommendation-id>
```

## Next steps

- [Remediation](/platform/remediation) — apply fixes with rollback
- [Concepts: AI recommendations](/concepts/ai-recommendations)
- [CLI: recommendation commands](/cli/commands/recommendation)
