---
title: "CI/CD Usage"
description: "Integrate InfraAudit CLI into GitHub Actions, GitLab CI, and other pipelines."
icon: "arrows-rotate"
---

# CI/CD usage

The CLI works well as a security gate in CI. Use `--output json` with `jq` to parse results and fail the build on critical findings.

## GitHub Actions example

```yaml
name: InfraAudit security check

on:
  push:
    branches: [main]
  schedule:
    - cron: "0 6 * * *"

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Install infraudit CLI
        run: go install github.com/pratik-mahalle/infraudit/cmd/cli@latest

      - name: Login
        run: infraudit auth login --email "${{ secrets.INFRAUDIT_EMAIL }}" --password "${{ secrets.INFRAUDIT_PASSWORD }}"
        env:
          INFRAUDIT_SERVER_URL: ${{ secrets.INFRAUDIT_SERVER_URL }}

      - name: Run drift scan
        run: infraudit drift detect

      - name: Fail on critical drifts
        run: |
          CRITICAL=$(infraudit drift list --severity critical -o json | jq 'length')
          if [ "$CRITICAL" -gt 0 ]; then
            echo "FAIL: $CRITICAL critical drift(s) detected"
            infraudit drift list --severity critical
            exit 1
          fi
          echo "PASS: No critical drifts"
```

## Shell script pattern

```bash
#!/bin/bash
export INFRAUDIT_SERVER_URL=https://api.infraaudit.dev

infraudit auth login --email "$CI_EMAIL" --password "$CI_PASSWORD"

infraudit drift detect
infraudit vuln scan

CRITICAL=$(infraudit drift list --severity critical -o json | jq 'length')
CRITICAL_VULNS=$(infraudit vuln list --severity critical -o json | jq 'length')

if [ "$CRITICAL" -gt 0 ] || [ "$CRITICAL_VULNS" -gt 0 ]; then
  echo "FAIL: $CRITICAL critical drifts, $CRITICAL_VULNS critical vulnerabilities"
  exit 1
fi

echo "PASS: No critical findings"
```

## Tips

- Store `INFRAUDIT_SERVER_URL` as a CI secret, not hardcoded.
- The CLI exits with code `1` on errors, so failures propagate naturally to the build.
- Use `-o json` on every command you need to parse programmatically.
