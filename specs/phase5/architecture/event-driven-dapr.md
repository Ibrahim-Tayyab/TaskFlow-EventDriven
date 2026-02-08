# Architecture: Event-Driven with Dapr & Kafka

## 1. Overview
Move from synchronous API calls to asynchronous event messaging for scalability.

## 2. Components
### 2.1 Dapr
- **Pub/Sub**: `pubsub.kafka` component.
- **Bindings**: `bindings.cron` for scheduling.

### 2.2 Kafka Topics (Redpanda)
- `task.events`:
  - `TaskCreated`
  - `TaskCompleted` (Triggers recurring logic)
  - `TaskDeleted`
- `notifications`:
  - `ReminderDue`

## 3. Data Flow
1. **User** -> Chatbot -> `add_task` tool.
2. **Backend**: Saves to DB -> Publishes `TaskCreated` event via Dapr.
3. **Worker Service**: Consumes `TaskCreated` -> Logs audit / checks analytics.
4. **Completion Flow**:
   - User completes recurring task.
   - Backend publishes `TaskCompleted`.
   - Scheduler Service consumes event -> Calculates next date -> Creates new task.
