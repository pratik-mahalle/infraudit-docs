---
title: "Shell Completion"
description: "Enable tab completion for the infraudit CLI in bash, zsh, or fish."
icon: "sparkles"
---


The CLI generates tab-completion scripts for bash, zsh, fish, and PowerShell.

## Bash

```bash
# Current session only
source <(infraudit completion bash)

# Permanent
infraudit completion bash > /etc/bash_completion.d/infraudit
```

## Zsh

```bash
# Current session only
source <(infraudit completion zsh)

# Permanent (add to ~/.zshrc)
infraudit completion zsh > "${fpath[1]}/_infraudit"
```

## Fish

```bash
# Current session only
infraudit completion fish | source

# Permanent
infraudit completion fish > ~/.config/fish/completions/infraudit.fish
```

## PowerShell

```powershell
infraudit completion powershell | Out-String | Invoke-Expression
```

Restart your shell (or source the config file) for completion to take effect.
