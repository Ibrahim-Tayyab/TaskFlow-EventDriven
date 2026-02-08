---
description: "Task list for Phase I - Todo In-Memory Python Console App implementation"
---

# Tasks: Phase I - Todo In-Memory Python Console App

**Input**: Design documents from `/specs/todo-console-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan (src/, tests/, pyproject.toml)
- [ ] T002 Initialize Python project with UV dependencies and pyproject.toml
- [ ] T003 [P] Configure linting and formatting tools (if needed)

**Checkpoint**: Basic project setup complete - human review required before proceeding

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create Task model in src/models/task.py with id, description, and status attributes
- [ ] T005 Create in-memory TaskRepository in src/repositories/task_repository.py with basic CRUD operations
- [ ] T006 Create TaskService in src/services/task_service.py with business logic for task operations

**Checkpoint**: Core logic ready - human review required before proceeding

## Phase 3: User Story 1 - Add New Tasks (Priority: P1) 🎯 MVP

**Goal**: Allow users to add new tasks to their todo list

**Independent Test**: User can run the CLI app and add a task, which gets stored in memory with a unique ID and status "Pending"

### Implementation for User Story 1

- [ ] T007 Create CLI interface in src/cli/cli_handler.py with basic menu structure
- [ ] T008 Implement "Add Task" functionality in CLI handler and integrate with TaskService
- [ ] T009 Add validation for task descriptions in TaskService
- [ ] T010 Test "Add Task" functionality manually via CLI

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

## Phase 4: User Story 2 - View All Tasks (Priority: P1)

**Goal**: Allow users to view all tasks with their ID, description, and status

**Independent Test**: User can add tasks and then view all of them displayed with proper formatting

### Implementation for User Story 2

- [ ] T011 Implement "View All Tasks" functionality in CLI handler and integrate with TaskService
- [ ] T012 Create proper display formatting for tasks in CLI output
- [ ] T013 Test "View All Tasks" functionality manually via CLI

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

## Phase 5: User Story 3 - Mark Tasks as Complete (Priority: P2)

**Goal**: Allow users to mark tasks as complete/incomplete

**Independent Test**: User can mark existing tasks as complete and verify the status change

### Implementation for User Story 3

- [ ] T014 Implement "Mark as Complete" functionality in CLI handler and integrate with TaskService
- [ ] T015 Add validation to ensure task exists before updating status
- [ ] T016 Test "Mark as Complete" functionality manually via CLI

**Checkpoint**: At this point, User Stories 1, 2, and 3 should all work independently

## Phase 6: User Story 4 - Update Task Description (Priority: P2)

**Goal**: Allow users to update task descriptions

**Independent Test**: User can update existing task descriptions and verify the changes

### Implementation for User Story 4

- [ ] T017 Implement "Update Task" functionality in CLI handler and integrate with TaskService
- [ ] T018 Add validation to ensure task exists before updating description
- [ ] T019 Test "Update Task" functionality manually via CLI

## Phase 7: User Story 5 - Delete Tasks (Priority: P3)

**Goal**: Allow users to delete tasks by ID

**Independent Test**: User can delete tasks and verify they no longer appear in the list

### Implementation for User Story 5

- [ ] T020 Implement "Delete Task" functionality in CLI handler and integrate with TaskService
- [ ] T021 Add validation to ensure task exists before deletion
- [ ] T22 Test "Delete Task" functionality manually via CLI

**Checkpoint**: At this point, all user stories should be independently functional

## Phase 8: CLI Interface & User Interaction Loop

**Goal**: Complete the full CLI experience with main interaction loop

- [ ] T023 Create main application loop in src/main.py that handles user menu navigation
- [ ] T024 Implement proper error handling and user feedback in CLI interface
- [ ] T025 Add clear prompts and status indicators as specified in requirements
- [ ] T026 Test complete CLI workflow with all 5 features

**Checkpoint**: Complete CLI interface ready - human review required before finalizing

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T027 [P] Documentation updates in README.md
- [ ] T028 Code cleanup and refactoring
- [ ] T029 [P] Add unit tests for Task model, TaskRepository, and TaskService in tests/unit/
- [ ] T030 Run quickstart.md validation to ensure setup instructions work

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3)
- **CLI Interface (Phase 8)**: Depends on all user story implementations being complete
- **Polish (Phase 9)**: Depends on all user stories and CLI interface being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Models before services
- Services before CLI implementation
- Core implementation before CLI integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Once Foundational phase completes, user stories can be worked on in priority order
- Different user stories can be worked on sequentially by the same developer

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Add Task)
4. Complete Phase 4: User Story 2 (View All Tasks)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 & 2 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Add User Story 5 → Test independently → Deploy/Demo
6. Complete CLI Interface → Test all features → Deploy/Demo
7. Add tests and polish → Final deployment

### Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence