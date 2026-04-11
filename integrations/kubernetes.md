---
title: "Kubernetes"
description: "Register Kubernetes clusters with InfraAudit using a kubeconfig and read-only RBAC."
icon: "dharmachakra"
---


InfraAudit connects to Kubernetes clusters via a kubeconfig file. Once connected, it syncs deployments, pods, services, and namespaces, and supports drift detection against uploaded manifests.

## Prerequisites

- A running Kubernetes cluster (EKS, GKE, AKS, or self-managed)
- A kubeconfig file or service account with read access
- `kubectl` installed locally (to generate the kubeconfig)

## RBAC setup

Create a read-only ClusterRole and bind it to a service account:

```yaml
# infraudit-rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: infraudit
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: infraudit-reader
rules:
  - apiGroups: ["", "apps", "batch", "networking.k8s.io"]
    resources:
      - pods
      - deployments
      - services
      - namespaces
      - replicasets
      - daemonsets
      - statefulsets
      - jobs
      - cronjobs
      - ingresses
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: infraudit-reader-binding
subjects:
  - kind: ServiceAccount
    name: infraudit
    namespace: kube-system
roleRef:
  kind: ClusterRole
  name: infraudit-reader
  apiGroup: rbac.authorization.k8s.io
```

Apply it:

```bash
kubectl apply -f infraudit-rbac.yaml
```

## Generating a kubeconfig for the service account

```bash
# Get the secret name
SECRET=$(kubectl -n kube-system get serviceaccount infraudit \
  -o jsonpath='{.secrets[0].name}')

# Extract the token and CA
TOKEN=$(kubectl -n kube-system get secret $SECRET \
  -o jsonpath='{.data.token}' | base64 -d)
CA=$(kubectl -n kube-system get secret $SECRET \
  -o jsonpath='{.data.ca\.crt}')

# Get the cluster server URL
SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')

# Write the kubeconfig
cat > infraudit-kubeconfig.yaml <<EOF
apiVersion: v1
kind: Config
clusters:
  - cluster:
      certificate-authority-data: $CA
      server: $SERVER
    name: infraudit-cluster
contexts:
  - context:
      cluster: infraudit-cluster
      user: infraudit
    name: infraudit-context
current-context: infraudit-context
users:
  - name: infraudit
    user:
      token: $TOKEN
EOF
```

## Connecting from the UI

1. Click **Cloud Providers → Connect Kubernetes**.
2. Upload or paste the contents of `infraudit-kubeconfig.yaml`.
3. Enter a display name for the cluster.
4. Click **Connect**.

## Connecting from the CLI

```bash
infraudit kubernetes register \
  --kubeconfig infraudit-kubeconfig.yaml \
  --name "Production EKS"
```

## Connecting via the API

```bash
KUBECONFIG_CONTENTS=$(cat infraudit-kubeconfig.yaml)

curl -X POST http://localhost:8080/api/v1/providers/kubernetes/connect \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Production EKS\",
    \"kubeconfig\": \"$KUBECONFIG_CONTENTS\"
  }"
```

## What gets synced

- Deployments, ReplicaSets, DaemonSets, StatefulSets
- Pods and their status
- Services (ClusterIP, NodePort, LoadBalancer)
- Namespaces
- Jobs and CronJobs
- Ingresses

The sync runs every 6 hours by default.

## Multi-cluster support

Connect each cluster as a separate provider. All clusters appear in the unified Kubernetes view, filterable by cluster name.

## Notes

- InfraAudit never creates, modifies, or deletes any Kubernetes resources. All operations are read-only.
- Tokens from service accounts in newer Kubernetes versions (1.24+) are not automatically created as secrets. If the token extraction above fails, use `kubectl create token infraudit -n kube-system` to generate a temporary token.
