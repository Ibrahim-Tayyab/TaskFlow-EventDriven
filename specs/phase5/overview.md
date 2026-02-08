# Phase 5: Advanced Cloud Deployment & Event-Driven Architecture

## Goal
Transform the Todo application into a distributed, cloud-native system using Event-Driven Architecture (EDA).
This phase introduces advanced features (Recurring Tasks, Reminders) powered by Kafka and Dapr, and prepares for deployment on production Kubernetes (DigitalOcean/GKE/AKS).

## Scope

### Part A: Advanced Features
1.  **Recurring Tasks**: Automate task creation based on schedules (daily, weekly, etc.).
2.  **Smart Reminders**: Push notifications/emails for due tasks.
3.  **Advanced Organization**:
    -   Priority Levels (High, Medium, Low)
    -   Tags/Categories (Work, Personal, etc.)
    -   Search & Filtering
    -   Sorting

### Part B: Architecture Upgrade
1.  **Dapr Integration**:
    -   **Pub/Sub**: Abstract Kafka via Dapr sidecar.
    -   **State Management**: Store conversation/session state.
    -   **Bindings**: Cron bindings for scheduled checks.
    -   **Secrets**: Secure credential management.
2.  **Kafka Implementation**:
    -   Backbone for event streaming (TaskCreated, TaskDue, etc.).
    -   Redpanda (Local/Cloud) as the Kafka provider.

### Part C: Cloud Deployment
1.  **Containerization**: Optimize Dockerfiles for production.
2.  **Helm Charts**: Production-grade charts with auto-scaling.
3.  **CI/CD**: GitHub Actions pipeline.
4.  **Cluster Deployment**: DigitalOcean Kubernetes (DOKS).

## Technical Stack
-   **Orchestration**: Kubernetes (Minikube / DOKS)
-   **Runtime**: Dapr (Distributed Application Runtime)
-   **Messaging**: Apache Kafka (Redpanda)
-   **Backend**: FastAPI + Python 3.12
-   **Frontend**: Next.js 15
-   **Database**: Neon Serverless PostgreSQL
-   **AI**: OpenAI Agents SDK + MCP

## Implementation Roadmap
spec-driven development will be strictly followed.

1.  **Specs Definition**: Define features and architecture. (`specs/phase5/*`)
2.  **Infrastructure Setup**: Local Dapr & Redpanda setup.
3.  **Backend Refactoring**: Integrate Dapr Python SDK.
4.  **Feature Implementation**:
    -   Recurring Tasks Engine (Consumer)
    -   Notification Service (Consumer)
    -   Search/Filter API
5.  **Deployment**: Kubernetes manifests & Helm charts.
