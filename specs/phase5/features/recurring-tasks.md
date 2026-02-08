# Feature: Recurring Tasks & Due Dates

## 1. User Stories
- "Remind me to check emails every day at 9 AM"
- "Pay rent on the 1st of every month"
- "Meeting every Monday"

## 2. Database Changes (Tasks Table)
- `due_date`: DateTime (nullable)
- `is_recurring`: Boolean
- `recurrence_pattern`: String (e.g., "daily", "weekly", "monthly", "cron: 0 9 * * *")
- `next_occurrence`: DateTime

## 3. Functional Requirements
1. **AI Parsing**: Update system prompt to extract time and recurrence info.
2. **Task Creation**: `add_task` tool accepts `due_date` and `recurrence`.
3. **Scheduler**: Background job (or Dapr Cron Binding) checks for due tasks.
4. **Regeneration**: When a recurring task is completed, system auto-creates the next instance.

## 4. MCP Tool Updates
- `add_task(title, description, due_date, recurrence)`
- `update_task(task_id, due_date, recurrence)`
