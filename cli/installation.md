---
title: "Installation"
description: "Install the infraudit CLI binary on macOS, Linux, or Windows."
icon: "download"
---


The CLI is distributed as a single static Go binary with no runtime dependencies. Install it from source or via `go install`.

## From source

Requires Go 1.24 or newer.

```bash
# Clone the backend repo (the CLI lives under cmd/cli)
git clone https://github.com/pratik-mahalle/infraudit-go.git
cd infraudit-go

# Build the CLI binary
make build-cli

# Binary lands at ./bin/infraudit
./bin/infraudit --help
```

Move the binary into your `PATH` if you want to call it from anywhere:

```bash
sudo mv ./bin/infraudit /usr/local/bin/
infraudit --help
```

## Go install

If you have a Go toolchain already, `go install` pulls and builds the latest CLI in one step:

```bash
go install github.com/pratik-mahalle/infraudit/cmd/cli@latest
```

The binary lands in `$GOPATH/bin/` (or `$HOME/go/bin/` by default). Make sure that directory is in your `PATH`.

## Verify the installation

```bash
infraudit --help
```

You should see the top-level command list. If you get `command not found`, your `PATH` does not include the install directory. On most shells you can fix it with:

```bash
# bash
echo 'export PATH="$HOME/go/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# zsh
echo 'export PATH="$HOME/go/bin:$PATH"' >> ~/.zshrc
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

Tab completion works in bash, zsh, fish, and PowerShell. See [Shell completion](shell-completion.md) for setup.

## Uninstall

Delete the binary from your `PATH` and remove the config directory:

```bash
rm $(which infraudit)
rm -rf ~/.infraudit
```
