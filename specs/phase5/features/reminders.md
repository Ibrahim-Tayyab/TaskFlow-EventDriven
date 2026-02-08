# Feature: Smart Reminders

## User Story
As a user, I want to receive notifications when a task is due so that I don't miss important deadlines.

## Architecture (Event-Driven)
1.  **Schedule**: User sets a Due Date.
2.  **Dapr Cron Binding**: Triggered every 5 minutes (or 1 minute for detailed testing).
3.  **Job**: `ReminderService` checks DB for tasks where:
    -   `status` = 'pending'
    -   `due_date` <= NOW() + 15 mins
    -   `notification_sent` = False
4.  **Action**:
    -   Publish `SendNotification` event to Kafka `notifications` topic.
    -   Update task `notification_sent` = True.
5.  **Consumer**: `NotificationService` listens to `notifications` topic.
    -   Action: Send Browser Notification / Email.

## API Changes
-   **POST/PUT Tasks**: Add `due_date`.
-   **Endpoint**: `POST /cron/check-reminders` (Called by Dapr Binding).

## UI Changes
-   **Request Permissions**: Browser Notification API access.
-   **Task Card**: Show Due Date (Red if overdue, Orange if nearing).
