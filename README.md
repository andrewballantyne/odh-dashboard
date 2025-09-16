# Today's Connection Logic

## Workbenches

```mermaid
sequenceDiagram
    actor U as End User
    participant C as Connection
    participant K8s as Kubernetes
    participant webhook as Mutating Webhook

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
    participant K8s as Kubernetes
    participant webhook as Mutating Webhook

    U->>C: Create "OCI" Connection
    U->>K8s: Create InferenceService
    Note left of K8s: "Dashboard" storageUri: oci://path/for:model
    K8s->>webhook: Convert annotation into proper K8s fields
    Note right of webhook: "API" imagePullSecret: <connection-secret-name>
    webhook->>K8s: Store in Kubernetes

    U->>C: Create "URI" Connection
    U->>K8s: Create isvc with Connection annotation
    K8s->>webhook: Convert annotation into proper K8s fields
    Note right of webhook: "API" storageUri: <uri-value-here>
    webhook->>K8s: Store in Kubernetes

    U->>C: Create "S3" Connection
    U->>K8s: Create isvc with Connection annotation
    Note left of K8s: "Dashboard" storage.path: /path/in/bucket/to/model
    K8s->>webhook: Convert annotation into proper K8s fields
    Note right of webhook: "API" storage.key: <connection-secret-name>
    webhook->>K8s: Store in Kubernetes
```

### Technical Details - 3.0

Notebook side

* `opendatahub.io/connections: "<connection-secret-name>"`
  * Mount as env var
* `opendatahub.io/connection-type-method: "<value>"`
  * Ignored

Model Side
* `opendatahub.io/connections: "<connection-secret-name>"`
  * Hookup for the mutating webhook to kick in
* `opendatahub.io/connection-type-method: "<value>"`
  * OCI -- Connects via OCI logic (`imagePullSecret`)
  * URI -- Connects via URI logic (`storageUri`)
  * S3
    * `Kind: InferenceService` -- connects via `storage.key` & `storage.path`
    * `Kind: LLMInferenceService` -- connects via `model.uri` with `s3://` protocol
      * This needs SA support
  * _something else_
    * Reject?
  * _missing_
    * ??? Support URI?

### Technical Details - 3.1+

* Support for good separation
  * `opendatahub.io/connection-path: "<model-path>"`
    * S3 -- path inside bucket
      * OLD way -- put into `storage.path`
      * NEW way -- put into `s3://bucket/{path}`
    * OCI -- full qualified OCI (aka URI) path `oci://path/for:model`
* Dashboard "plays no more role" in connections being "connected"
  * This gets away from the two source problem
