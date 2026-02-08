# Deployment: DigitalOcean Kubernetes (DOKS)

## 1. Prerequisites
- `doctl` CLI installed & authenticated.
- `kubectl` configured for DOKS.
- `helm` installed.

## 2. Infrastructure Setup
1. **Cluster**: Create Standard/Basic cluster (2 nodes recommended).
2. **Dapr**: `dapr init -k` to install Sidecar control plane.
3. **Kafka**: Deploy Redpanda via Helm or use Redpanda Cloud (Serverless).

## 3. Deployment Steps
1. **Build Images**: Tag with registry URL (e.g., `registry.digitalocean.com/my-repo/...`).
2. **Push Images**: `docker push ...`
3. **Helm Upgrade**:
   ```bash
   helm upgrade --install todo-app ./helm/todo-app \
     --set kafka.enabled=true \
     --set dapr.enabled=true
   ```

## 4. Verification
- `kubectl get pods` (Ensure 2/2 ready for Dapr sidecars).
- Access via LoadBalancer IP.
