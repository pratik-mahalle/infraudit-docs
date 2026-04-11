---
title: "Quickstart: CLI"
description: "Install the infraudit CLI, connect a cloud account, and run a drift scan from the terminal."
icon: "terminal"
---


Install the `infraudit` binary, log in, connect an AWS account, and run a drift scan — all from the terminal. Expected time: under five minutes if you already have AWS credentials to hand.

## Install the CLI

### macOS (Homebrew)

```bash
brew install pratik-mahalle/tap/infraudit
```

### Linux

```bash
curl -sSL https://infraaudit.dev/install.sh | bash
```

The script installs the binary to `/usr/local/bin/infraudit`.

### Build from source

```bash
git clone https://github.com/pratik-mahalle/infraudit-go.git
cd infraudit-go
go build -o infraudit ./cmd/cli
sudo mv infraudit /usr/local/bin/
```

Verify the install:

```bash
infraudit version
```

## Point the CLI at your server

For the **SaaS** version:

```bash
infraudit config init
# Server URL: https://api.infraaudit.dev
```

For a **self-hosted** instance:

```bash
infraudit config init
# Server URL: http://localhost:8080
```

## Log in

```bash
infraudit auth login
# Email: user@example.com
# Password: ••••••••
```

The CLI stores the session token in `~/.infraudit/config.yaml`. Subsequent commands use it automatically.

Check who you're logged in as:

```bash
infraudit auth whoami
```

## Connect a cloud account

```bash
infraudit provider connect aws
# AWS Access Key ID: AKIA...
# AWS Secret Access Key: ••••••••
# Default region [us-east-1]: us-east-1
# Display name [AWS]: Production
```

Wait for the initial sync:

```bash
infraudit provider list
# ID  NAME        TYPE  STATUS  RESOURCES
# 1   Production  aws   synced  247
```

## Run a drift scan

```bash
infraudit drift detect
# Drift detection triggered. Job ID: 42
# Waiting for results...
# Found 3 drifts (1 high, 2 medium)
```

See the results:

```bash
infraudit drift list
```

Filter by severity:

```bash
infraudit drift list --severity high
```

Get details on a specific drift:

```bash
infraudit drift get 1
```

## What to do next

```bash
# Run a vulnerability scan
infraudit vuln scan

# Enable a compliance framework and run an assessment
infraudit compliance enable cis-aws
infraudit compliance assess

# Check your cost overview
infraudit cost overview

# Sync billing data immediately
infraudit cost sync

# Get AI-powered recommendations
infraudit recommendation list
```

For a full list of commands and flags, see the [CLI command reference](/cli/commands/overview) or run `infraudit --help`.
