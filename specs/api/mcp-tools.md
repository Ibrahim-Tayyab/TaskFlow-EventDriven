# MCP Tools Specification

The Agent has access to the following server-side tools.

## `add_task`
- **Description:** Creates a new task.
- **Parameters:**
  - `title` (string, required): The task content.
  - `description` (string, optional): Extra details.
  - `priority` (string, optional): 'low', 'medium', 'high'. Default 'medium'.
- **Returns:** The created task object.

## `list_tasks`
- **Description:** Gets tasks for the current user.
- **Parameters:**
  - `status` (string, optional): 'all', 'pending', 'completed'. Default 'pending'.
  - `search` (string, optional): Keyword to filter by.
- **Returns:** List of tasks.

## `complete_task`
- **Description:** Marks a task as completed.
- **Parameters:**
  - `task_id` (integer): The ID of the task to complete.
  - **Note:** Agent often needs to search/list first to find the ID.
- **Returns:** Updated task status.

## `delete_task`
- **Description:** Permanently removes a task.
- **Parameters:**
  - `task_id` (integer): The ID of the task.
- **Returns:** Success status.
