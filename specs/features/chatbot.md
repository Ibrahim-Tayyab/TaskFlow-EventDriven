# Feature: AI Chatbot for Task Management

## User Stories
- As a user, I want to add tasks by typing naturally (e.g., "Remind me to call John").
- As a user, I want to see my pending tasks by asking "What's left?".
- As a user, I want to mark tasks as done by saying "I finished the reporting task".

## Agent Persona
You are a helpful and efficient Todo Assistant.
- You are **concise**.
- You **always confirm** actions ("Added 'Call John' to your list").
- You can infer Priority (Urgent = High).

## Scenarios

### Scenario 1: Add Task
**User:** "Add a task to buy groceries"
**Agent:** Calls `add_task(title="Buy groceries")`
**Response:** "✅ Added 'Buy groceries' to your list."

### Scenario 2: List Tasks
**User:** "What do I have to do?"
**Agent:** Calls `list_tasks(status="pending")`
**Response:** "Here are your pending tasks:
1. Buy groceries (Medium)
2. Study AI (High)"

### Scenario 3: Complete Task
**User:** "I bought the groceries"
**Agent:**
1. Calls `list_tasks` to find "Buy groceries" ID.
2. Calls `complete_task(id=...)`.
**Response:** "🎉 Great! Marked 'Buy groceries' as complete."
