# Feature: Advanced Organization (Search, Sort, Filter, Priority)

## User Stories
-   **Search**: "As a user, I want to search tasks by keyword."
-   **Filter**: "As a user, I want to see only 'High Priority' or 'Work' tasks."
-   **Sort**: "As a user, I want to sort by Due Date or Priority."

## Data Model
Update `Task` table:
-   `priority`: Enum (High, Medium, Low) - Default: Medium.
-   `tags`: List[String] (JSON column) or separate `Tags` table. (JSON preferred for simplicity in Phase 5).

## API Enhancements (`GET /api/tasks`)
New Query Parameters:
-   `q`: Search query (title/description).
-   `priority`: Filter by priority.
-   `tags`: Filter by tag.
-   `sort_by`: 'due_date', 'priority', 'created_at'.
-   `order`: 'asc', 'desc'.

## Backend Implementation
-   Use `SQLModel` / `SQLAlchemy` filters.
-   Search: `col(Task.title).contains(q)`.

## AI Integration
-   **Agent Capabilities**:
    -   "Show me my high priority work tasks."
    -   Maps to: `list_tasks(priority="high", tags=["work"])`.
