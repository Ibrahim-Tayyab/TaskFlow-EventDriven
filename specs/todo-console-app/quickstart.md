# Quickstart: Phase I - Todo In-Memory Python Console App

## Setup

1. Ensure Python 3.13+ is installed
2. Install UV package manager: `pip install uv`
3. Clone the repository
4. Navigate to project directory
5. Install dependencies: `uv sync`
6. Run the application: `uv run python src/main.py`

## Usage

### Running the Application
```bash
uv run python src/main.py
```

### Available Commands
- Add Task: Add a new task to your list
- View All Tasks: Display all tasks with their status
- Update Task: Modify an existing task's description
- Delete Task: Remove a task from your list
- Mark as Complete: Update a task's status to complete
- Exit: Quit the application

### Example Workflow
1. Run the application
2. Select "Add Task" and enter your task description
3. Select "View All Tasks" to see your tasks
4. Use other commands as needed
5. Select "Exit" to quit

## Development

### Running Tests
```bash
uv run pytest
```

### Adding Dependencies
```bash
uv add [package-name]
```

### Project Structure
- `src/models/task.py`: Task data model
- `src/repositories/task_repository.py`: In-memory storage logic
- `src/services/task_service.py`: Business logic
- `src/cli/cli_handler.py`: CLI interface
- `src/main.py`: Application entry point