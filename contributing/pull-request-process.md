---
title: "Pull Request Process"
description: "How to submit a pull request to InfraAudit: branching, commit conventions, and review."
icon: "git-pull-request"
---


## Branch naming

Use descriptive branch names with a type prefix:

| Type | Example |
|---|---|
| Feature | `feat/add-oracle-provider` |
| Bug fix | `fix/drift-scan-timeout` |
| Documentation | `docs/add-kubernetes-integration` |
| Refactor | `refactor/compliance-engine` |
| Chore | `chore/update-go-dependencies` |

## Commit messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

Examples:

```
feat(providers): add Oracle Cloud provider

Implements the Oracle Cloud provider with support for Compute instances
and Object Storage buckets.

Closes #123
```

```
fix(drift): fix false positive on EC2 metadata timestamps

Timestamps in EC2 instance metadata change on every sync and were
causing false drift findings. Added timestamp fields to the exclusion
list for ec2_instance resource types.
```

## Before opening a PR

- [ ] All tests pass: `make test`
- [ ] Linting passes: `make lint`
- [ ] Swagger spec is up to date (if endpoints changed): `make swagger`
- [ ] New code has test coverage
- [ ] Documentation updated if behavior changed

## Opening the PR

1. Push your branch to GitHub.
2. Open a pull request against `main`.
3. Fill in the PR template:
   - **What** — what the PR does
   - **Why** — why the change is needed
   - **How** — any non-obvious implementation choices
   - **Testing** — how you tested it
4. Link any related issues with `Closes #<issue>`.

## Review process

- At least one maintainer must approve before merging.
- The CI pipeline must be green (tests + lint).
- For provider or compliance framework additions, a second reviewer familiar with the cloud or framework is preferred.

## Merging

Once approved and CI passes, the maintainer will merge using **squash merge** to keep the main branch history clean. The commit message will be the PR title.

## After merging

Your change will be included in the next release. Check the [Changelog](/resources/changelog) after the next version is tagged.

## Reporting bugs

Open an issue at [github.com/pratik-mahalle/infraudit-go/issues](https://github.com/pratik-mahalle/infraudit-go/issues) with:

- InfraAudit version
- Steps to reproduce
- Expected vs actual behavior
- Logs if relevant
