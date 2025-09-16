<!--

-->

# Today's Connection Logic

## Workbenches

```mermaid
sequenceDiagram
    actor U as End User
    participant C as Connection
    box submission side
    participant K8s as Kubernetes
    participant webhook as Mutating Webhook
    end

    U->>C: Create Connection (OCI, S3, or URI)
    U->>K8s: Create Notebook
    K8s->>webhook: Convert annotation into proper K8s fields
    Note right of webhook: "API" <mount as env var>
    webhook->>K8s: Store in Kubernetes
```

## Models (KServe)

```mermaid
sequenceDiagram
    actor U as End User
    participant C as Connection
    box submission side
    participant K8s as Kubernetes
    participant webhook as Mutating Webhook
    end

    U->>C: Create Connection (OCI, S3, or URI)
    U->>K8s: Create Notebook
    K8s->>webhook: Convert annotation into proper K8s fields
    Note right of webhook: "API" <mount as env var>
    webhook->>K8s: Store in Kubernetes

    U->>C: Create "OCI" Connection
    U->>K8s: Create InferenceService
    Note left of K8s: "Dashboard" storageUri: oci://path/for:model
    K8s->>webhook: Convert annotation into proper K8s fields
    Note right of webhook: "API" imagePullSecret: <connection secret>
    webhook->>K8s: Store in Kubernetes

    U->>C: Create "URI" Connection
    U->>K8s: Create isvc with Connection annotation
    K8s->>webhook: Convert annotation into proper K8s fields
    Note right of webhook: "API" storageUri: <uri value here>
    webhook->>K8s: Store in Kubernetes

    U->>C: Create "S3" Connection
    U->>K8s: Create isvc with Connection annotation
    Note left of K8s: "Dashboard" storage.path: /path/in/bucket/to/model
    K8s->>webhook: Convert annotation into proper K8s fields
    Note right of webhook: "API" storage.key: <connection-secret-name>
    webhook->>K8s: Store in Kubernetes
```

<!--```mermaid
    actor A as Admin User
    participant CT as Connection Type
    participant C as Connection
    box submission side
    participant K8s as Kubernetes
    participant webhook as Mutating Webhook
    end


```-->

<!--
```mermaid
    actor EndUser as End User
    participant DashboardUI as Dashboard UI (Browser)
    box Dashboard Pod
    participant OAuth as OAuth Proxy Container
    participant Dashboard as Dashboard Container
    end

    EndUser->>DashboardUI: https://dashboard-route/*
    DashboardUI-xOAuth: (Not logged in)
    OAuth-\->>DashboardUI: Return log in screen
    EndUser->>DashboardUI: (log in)
    DashboardUI->>OAuth: (successful log in)
    OAuth->>Dashboard: Redirect to Dashboard
    Dashboard->>OAuth: Return HTML Page
    OAuth->>DashboardUI: (forwarded)<br/>Return HTML Page

```
-->
