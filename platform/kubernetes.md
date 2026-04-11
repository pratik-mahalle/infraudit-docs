---
title: "Kubernetes"
description: "Register Kubernetes clusters, browse workloads, and detect configuration drift across pods and deployments."
icon: "dharmachakra"
---


InfraAudit treats Kubernetes clusters as a first-class provider type. Connect a cluster to browse deployments, pods, services, and namespaces — and run drift detection against your Kubernetes manifests.

## Connecting a cluster

1. In the sidebar, click **Cloud Providers**.
2. Click **Connect provider → Kubernetes**.
3. Upload a kubeconfig file or paste its contents.
4. Give the cluster a display name.
5. Click **Connect**.

InfraAudit reads the active context in the kubeconfig and connects to that cluster. If you have multiple clusters to register, connect each one separately.

**Minimum RBAC permissions:**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: infraudit-reader
rules:
  - apiGroups: ["", "apps", "batch"]
    resources:
      ["deployments", "pods", "services", "namespaces", "replicasets", "daemonsets", "statefulsets", "jobs", "cronjobs"]
    verbs: ["get", "list", "watch"]
```

Via CLI:

```bash
infraudit kubernetes register --kubeconfig ~/.kube/config --name production
```

## Workload overview

After connecting, the Kubernetes section shows:

| View | What's shown |
|---|---|
| **Clusters** | All registered clusters with health status and resource counts |
| **Namespaces** | Namespaces per cluster with pod counts |
| **Deployments** | Deployments across all clusters with replica status |
| **Pods** | Individual pods with status, namespace, and node |
| **Services** | ClusterIP, NodePort, and LoadBalancer services |

## Drift detection for Kubernetes

InfraAudit can detect drift between live cluster state and:

1. **Manifest uploads** — upload a Kubernetes YAML manifest via the IaC section. InfraAudit parses it and compares declared vs actual resource configuration.
2. **Baseline snapshots** — InfraAudit captures a baseline of your workloads on first sync. Subsequent scans detect configuration changes.

Common Kubernetes drift findings:
- Image tag changed (e.g. `nginx:1.24` → `nginx:latest`)
- Replica count changed outside of a deployment
- Resource limits removed or modified
- Environment variables added or changed

## Vulnerability scanning for Kubernetes

For Kubernetes workloads, Trivy scans container images referenced in your pods and deployments. Configure the scan via **Jobs → vulnerability_scan** or trigger it manually:

```bash
infraudit vuln scan --provider <kubernetes-cluster-id>
```

## Multi-cluster management

InfraAudit shows a unified view across all registered Kubernetes clusters. Filter the workload views by cluster using the **Cluster** dropdown at the top of the page.

## CLI

```bash
# List registered clusters
infraudit kubernetes clusters

# List namespaces for a cluster
infraudit kubernetes namespaces --cluster <cluster-id>

# List deployments
infraudit kubernetes deployments --cluster <cluster-id>

# List pods
infraudit kubernetes pods --cluster <cluster-id> --namespace production

# List services
infraudit kubernetes services --cluster <cluster-id>
```

## Next steps

- [Integrations: Kubernetes](/integrations/kubernetes) — detailed setup and RBAC guide
- [Drift detection](/platform/drift-detection)
- [Vulnerabilities](/platform/vulnerabilities)
- [CLI: kubernetes commands](/cli/commands/kubernetes)
