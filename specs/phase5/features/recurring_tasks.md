# Feature: Recurring Tasks

## User Story
As a user, I want to create tasks that repeat automatically (e.g., "Weekly Sync") so that I don't have to manually recreate them every time.

## User Interface
-   **Add Task Modal**: New field "Repeat" (None, Daily, Weekly, Monthly, Custom).
-   **Task List**: Recurring tasks show a loop icon.
-   **Task Completion**: When a recurring task is completed:
    1.  The current instance is marked 'completed'.
    2.  The *next* instance is automatically created with the new Due Date.

## Technical Architecture (Event-Driven)
1.  **Trigger**: User completes a task (`PUT /api/tasks/{id}`).
2.  **Event**: Backend publishes `TaskCompleted` event to Kafka Topic `task-events` (via Dapr).
3.  **Consumer**: `RecurringTaskService` (Dapr Binding/PubSub) listens to `task-events`.
    -   Conditions: If `task.recurrence_rule` is present.
    -   Action: Calculate next due date -> Call `POST /api/tasks` to create new task.

## Data Model (SQLModel)
Update `Task` table:
-   `is_recurring`: boolean
-   `recurrence_interval`: string (e.g., "daily", "weekly")
-   `next_due_date`: datetime

## API Changes
-   **POST /api/tasks**: Accept `recurrence_interval`.
-   **PUT /api/tasks/{id}**: Accept `recurrence_interval`.

## AI Agent Behavior
-   User: "Remind me to pay rent every month."
-   Agent: Calls `add_task(title="Pay Rent", recurrence_interval="monthly")`.
