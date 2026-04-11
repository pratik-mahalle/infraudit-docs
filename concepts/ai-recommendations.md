---
title: "AI Recommendations"
description: "How InfraAudit uses Google Gemini to generate recommendations, and what the rule-based fallback covers."
icon: "sparkles"
---


InfraAudit generates recommendations for cost savings, security hardening, and performance improvements. When a Gemini API key is configured, it uses `gemini-2.5-pro`. Without it, a rule-based engine runs instead.

## Gemini integration

When `GEMINI_API_KEY` is set, InfraAudit sends a structured prompt to Gemini for each finding. The prompt includes:

- The finding type (drift, vulnerability, cost anomaly, compliance failure)
- The severity and a description of what was detected
- The affected resource type with its key attributes
- The cloud provider and region
- Any relevant compliance framework context

Gemini returns a structured recommendation with:

- A plain-language explanation of why the finding matters
- Step-by-step remediation instructions specific to the resource
- Estimated monthly savings (for cost recommendations)
- Estimated risk reduction (for security recommendations)

The model is configured with `temperature=0` to produce deterministic, factual output over creative generation.

## Rule-based fallback

When `GEMINI_API_KEY` is not set, InfraAudit's internal rule engine runs instead. It matches the finding against a library of pre-written recommendation templates.

The rule engine covers:

- Top 50 most common S3 misconfigurations
- EC2 security group overpermission patterns
- IAM key age and usage recommendations
- RDS backup and encryption gaps
- Cost optimization rules: right-sizing, idle resources, Reserved Instance recommendations
- CIS Benchmark remediation steps

The rule-based output is less context-specific than Gemini's but still actionable. It runs with no API dependencies and no rate limits, making it the right choice for air-gapped or high-volume deployments.

## Recommendation types

| Type | Source | Output |
|---|---|---|
| Cost | Billing data, usage metrics | Savings amount, resource to act on |
| Security | Drift, vulnerability, compliance finding | Risk description, remediation steps |
| Performance | Resource utilization data | Scaling or configuration adjustment |

## Generation triggers

Recommendations are generated:

1. **Automatically:** After a drift detection scan, vulnerability scan, or compliance assessment, InfraAudit queues recommendation generation for any new findings above the severity threshold.
2. **On demand:** From the resource detail panel or CLI:

```bash
infraudit recommendation generate --resource <resource-id>
```

3. **Bulk generation:** After a compliance assessment:

```bash
infraudit recommendation generate --assessment <assessment-id>
```

## Status lifecycle

```
pending → applied / dismissed
```

- **Pending:** Generated, not yet acted on.
- **Applied:** User applied the recommended fix (either manually or via automated remediation).
- **Dismissed:** User chose to ignore the recommendation (with optional reason).

## Rate limiting

Gemini API calls are rate-limited by Google. InfraAudit uses an internal queue to batch recommendation requests and respects the `429 Too Many Requests` response by backing off exponentially. Large assessments (100+ findings) may take a few minutes to generate all recommendations.

## Cost of Gemini usage

Each recommendation request uses roughly 1,000–3,000 tokens. At current Gemini pricing, this is approximately $0.001–$0.003 per recommendation. For typical usage (50 new findings/day), monthly Gemini costs are under $5.

## Privacy

Finding details (resource configuration attributes, CVE IDs, cost figures) are sent to the Gemini API. If your organization's security policy prohibits sending infrastructure details to external APIs, use the rule-based fallback by not setting `GEMINI_API_KEY`.
