# Phase 5: Event-Driven Architecture Specification

## Overview
Transform the TaskFlow application into a production-ready, event-driven microservices architecture using Dapr and RedPanda Cloud Kafka. This phase focuses on containerization, pub/sub messaging, and cloud-native deployment patterns.

## Project Structure
```
todo-hackathon/
├── api/                     # FastAPI backend with Dapr integration
│   ├── main.py             # Main application with Dapr pub/sub
│   ├── services/           # Business logic + event publishing
│   ├── consumers/          # Kafka event consumers
│   └── Dockerfile          # Backend container image
├── web-app/                # Next.js frontend
│   └── Dockerfile          # Frontend container image
├── dapr/
│   └── components/         # Dapr configuration
│       ├── pubsub.yaml     # RedPanda Kafka connection
│       └── statestore.yaml # State management
├── docker-compose.yml      # Container orchestration
├── k8s/                    # Kubernetes manifests
├── helm/                   # Helm charts
└── specs/
    └── phase5/
        ├── spec.md         # This specification
        ├── plan.md         # Implementation plan
        └── tasks.md        # Task breakdown
```

## Technology Stack

### Event-Driven Architecture
- **Message Broker**: RedPanda Cloud Kafka
- **Sidecar Runtime**: Dapr 1.14+
- **Pub/Sub Pattern**: Dapr Pub/Sub building block
- **Topics**: task-events, notifications, user-events

### Containerization
- **Container Runtime**: Docker
- **Orchestration**: Docker Compose
- **Registry**: Docker Hub (ibuboy/todo-backend, ibuboy/todo-frontend)

### Cloud Services
- **Database**: Neon PostgreSQL (Serverless)
- **AI**: Google Gemini 2.0 Flash
- **Event Streaming**: RedPanda Cloud

## Architecture

### System Design
```
┌─────────────────────────────────────────────────────────────┐
│                    TaskFlow Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │   Next.js   │◄──►│   FastAPI   │◄──►│  Dapr Sidecar   │ │
│  │  Frontend   │    │   Backend   │    │   (Pub/Sub)     │ │
│  │  Port:3000  │    │  Port:8000  │    │   Port:3500     │ │
│  └─────────────┘    └─────────────┘    └────────┬────────┘ │
│                                                  │          │
│                                                  ▼          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐ │
│  │   Neon      │◄──►│   Google    │    │  RedPanda Cloud │ │
│  │ PostgreSQL  │    │  Gemini AI  │    │     Kafka       │ │
│  │  (Cloud DB) │    │  (Chatbot)  │    │  (Event Store)  │ │
│  └─────────────┘    └─────────────┘    └─────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Event Flow
1. **Task Created** → Publish to `task-events` topic
2. **Task Updated** → Publish to `task-events` topic
3. **Task Completed** → Publish to `notifications` topic
4. **User Action** → Log to `user-events` topic

## Features Specification

### Event-Driven Capabilities
1. **Pub/Sub Messaging**: Dapr publishes events to Kafka topics
2. **Async Processing**: Non-blocking event handling
3. **Event Sourcing**: Track all task state changes
4. **Notifications**: Real-time event notifications

### Docker Services
| Service | Port | Description |
|---------|------|-------------|
| todo-frontend | 3000 | Next.js UI |
| todo-backend | 8000 | FastAPI API |
| todo-backend-dapr | 3500 | Dapr sidecar |

### Dapr Components

#### pubsub.yaml (RedPanda Kafka)
```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: taskflow-pubsub
spec:
  type: pubsub.kafka
  version: v1
  metadata:
    - name: brokers
      value: "redpanda-cloud-broker:9092"
    - name: authType
      value: "password"
```

## API Endpoints

### Task Events
- `POST /api/tasks` → Publishes `task.created` event
- `PUT /api/tasks/{id}` → Publishes `task.updated` event
- `DELETE /api/tasks/{id}` → Publishes `task.deleted` event

### Dapr Integration
- `POST /dapr/subscribe` → Returns topic subscriptions
- `POST /events/task-events` → Receives task events
- `POST /events/notifications` → Receives notifications

## Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'
services:
  todo-frontend:
    image: ibuboy/todo-frontend:phase5
    ports:
      - "3000:3000"
    
  todo-backend:
    image: ibuboy/todo-backend:phase5
    ports:
      - "8000:8000"
    
  todo-backend-dapr:
    image: daprio/daprd:latest
    command: ["./daprd", "-app-id", "todo-backend", "-app-port", "8000"]
```

## Success Criteria
- ✅ Docker Compose runs all 3 services
- ✅ Dapr publishes events to RedPanda Kafka
- ✅ App accessible at http://localhost:3000
- ✅ AI chatbot creates tasks via natural language
- ✅ Docker images published to Docker Hub
