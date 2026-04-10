---
title: "kubernetes"
description: "Register clusters and list Kubernetes workloads from the CLI."
icon: "square-terminal"
---

# `infraudit kubernetes`

Alias: `k8s`

## `k8s clusters`

```bash
infraudit k8s clusters
```

## `k8s register`

```bash
infraudit k8s register --name production --kubeconfig ~/.kube/config
```

## `k8s sync <id>`

```bash
infraudit k8s sync 1
```

## `k8s delete <id>`

```bash
infraudit k8s delete 1
```

## `k8s namespaces <cluster-id>`

```bash
infraudit k8s namespaces 1
```

## `k8s deployments <cluster-id>`

```bash
infraudit k8s deployments 1
```

## `k8s pods <cluster-id>`

```bash
infraudit k8s pods 1
```

## `k8s services <cluster-id>`

```bash
infraudit k8s services 1
```

## `k8s stats`

```bash
infraudit k8s stats
```
