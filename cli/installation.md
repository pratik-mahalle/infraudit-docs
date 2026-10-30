---
title: "Installation"
description: "Install the infraudit CLI binary on macOS, Linux, or Windows."
icon: "download"
---


The CLI is distributed as a single static Go binary with no runtime dependencies.

## macOS (Homebrew)

```bash
brew install pratik-mahalle/tap/infraudit
```

## Linux

```bash
curl -sSL https://infraudit.com/install.sh | bash
```

The script installs the binary to `/usr/local/bin/infraudit`.

## Windows

Download the latest `infraudit-windows-amd64.exe` from the release bundle provided by your account manager, rename it to `infraudit.exe`, and place it in a directory on your `PATH`.

## Verify the installation

```bash
infraudit --help
```

You should see the top-level command list. If you get `command not found`, your `PATH` does not include the install directory. On most shells you can fix it with:

```bash
# bash
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# zsh
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## First-time setup

Once the binary is on your `PATH`, run interactive setup:

```bash
infraudit config init
# > Enter server URL: http://localhost:8080   (or your SaaS URL)
# > Default output format: table

infraudit auth login
# > Email: you@example.com
# > Password: ********
# > Logged in as you@example.com
```

You're done. Try `infraudit status` to verify you can talk to the server.

## Shell completion

Tab completion works in bash, zsh, fish, and PowerShell. See [Shell completion](/cli/shell-completion) for setup.

## Uninstall

Delete the binary from your `PATH` and remove the config directory:

```bash
rm $(which infraudit)
rm -rf ~/.infraudit
```
