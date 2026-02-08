# Architecture: Event-Driven with Dapr & Kafka

## Overview
Phase 5 shifts from a monolithic API approach to an **Event-Driven Architecture (EDA)**. Services communicate asynchronously via events, ensuring scalability and decoupling.

## Components
1.  **FastAPI Backend (Producer)**: Publishes events when data changes.
2.  **Dapr Sidecar**: Handles the complexity of connecting to Kafka.
3.  **Redpanda (Kafka)**: The message broker.
4.  **Consumers**:
    -   `RecurringTaskConsumer`: Listens for task completions.
    -   `NotificationConsumer`: Listens for `SendNotification` events.

## Dapr Components Configuration

All components are located in `/dapr/components/`.

### 1. Kafka Pub/Sub (`pubsub.yaml`)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: todo-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
  - name: brokers
    value: "localhost:9092"  # Use "redpanda:9092" in Docker/K8s
  - name: consumerGroup
    value: "todo-group"
  - name: authRequired
    value: "false"
```

### 2. Cron Binding (`cron.yaml`)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: reminder-cron
spec:
  type: bindings.cron
  version: v1
  metadata:
  - name: schedule
    value: "@every 5m"
```

### 3. State Store (`statestore.yaml`)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.postgresql
  version: v1
  metadata:
  - name: connectionString
    secretKeyRef:
      name: db-secrets
      key: DATABASE_URL
```

### 4. Secret Store (`secretstore.yaml`)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: kubernetes-secrets
spec:
  type: secretstores.kubernetes
  version: v1
```

### 5. Subscriptions (`subscription.yaml`)
```yaml
apiVersion: dapr.io/v2alpha1
kind: Subscription
metadata:
  name: task-events-subscription
spec:
  topic: task-events
  routes:
    default: /dapr/task-events
  pubsubname: todo-pubsub
---
apiVersion: dapr.io/v2alpha1
kind: Subscription
metadata:
  name: notifications-subscription
spec:
  topic: notifications
  routes:
    default: /dapr/notifications
  pubsubname: todo-pubsub
```

## Event Schema

### `task-events` Topic
```json
{
  "event_type": "created|updated|deleted|completed",
  "task_id": 123,
  "user_id": "user_abc",
  "timestamp": "2026-02-02T12:00:00Z",
  "data": { ...task_details... }
}
```

### `notifications` Topic
```json
{
  "type": "reminder",
  "user_id": "user_abc",
  "title": "Task Due Soon",
  "body": "Your task 'Buy Milk' is due in 15 minutes."
}
```

## Backend Endpoints for Dapr Subscriptions

The FastAPI backend must expose these endpoints:

| Endpoint | Purpose |
|----------|---------|
| `POST /dapr/task-events` | Receives task events (for recurring task consumer) |
| `POST /dapr/notifications` | Receives notification events (for notification consumer) |

## Local Development Setup

1.  **Start Redpanda**: `docker-compose up -d redpanda`
2.  **Start Dapr**: `dapr run --app-id todo-backend --app-port 8000 --dapr-http-port 3500 --components-path ./dapr/components -- uvicorn api.index:app --host 0.0.0.0 --port 8000`

## Configuration Notes

- **Local**: `pubsub.yaml` uses `localhost:9092` for Redpanda
- **Docker/K8s**: Change to `redpanda:9092` (service name)
- **Secrets**: Use K8s secrets in production, env vars locally
