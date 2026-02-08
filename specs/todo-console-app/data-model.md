# Data Model: Phase I - Todo In-Memory Python Console App

## Task Entity

### Attributes
- **id**: `int` - Unique identifier for the task (auto-incremented)
- **description**: `str` - Text content of the task
- **status**: `str` - Current status of the task ("pending" or "complete")

### Task Status Values
- "pending": Task has not been completed
- "complete": Task has been marked as completed

## In-Memory Storage Structure

### Task Repository
- **tasks**: `dict[int, Task]` - Dictionary mapping task IDs to Task objects
- **next_id**: `int` - Counter for generating unique task IDs

### Example Data Structure
```python
tasks = {
    1: Task(id=1, description="Buy groceries", status="pending"),
    2: Task(id=2, description="Finish report", status="complete"),
    3: Task(id=3, description="Call dentist", status="pending")
}
next_id = 4
```

## Relationships
- No relationships needed for this simple model
- Each Task is independent and self-contained