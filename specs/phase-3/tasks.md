# Phase 3: AI Chatbot Implementation Tasks

## T1: Setup & Architecture

### T1.1: Dependency Management
- [x] Install `openai`, `google-generativeai` (for fallback), `sqlmodel`.
- [x] Configure OpenRouter API keys in `.env`.
- [x] Verify API connectivity with `verify_fix.py`.

### T1.2: Database Extensions
- [x] Create `Conversation` model (SQLModel).
- [x] Create `ChatMessage` model (SQLModel).
- [x] Create `ChatRepository` for managing history.
- [x] Run Alembic migrations for new tables.

## T2: Backend Development (MCP Server)

### T2.1: Tool Definitions
- [x] Define `add_task` tool schema.
- [x] Define `list_tasks` tool schema.
- [x] Define `complete_task` tool schema.
- [x] Define `delete_task` tool schema.
- [x] Define `search_tasks` tool schema.

### T2.2: Tool Execution Logic
- [x] Implement `execute_tool` function to map tool calls to Service Layer methods.
- [x] Handle tool errors gracefully.
- [x] Format tool outputs for AI consumption.

### T2.3: Chat Service
- [x] Implement `ChatService` to handle message persistence.
- [x] Implement retrieval of conversation history.
- [x] Implement clearing of history.

## T3: AI Integration

### T3.1: Chat Endpoint
- [x] Create `POST /api/chat` endpoint.
- [x] Implement system prompt with "multilingual" and "typo correction" capabilities.
- [x] Integrate OpenRouter client with fallback logic (later simplified to OpenRouter-only).
- [x] Handle tool calls loop (Agent -> Tool -> Agent -> Response).

### T3.2: Model Configuration
- [x] Configure `google/gemini-2.0-flash-exp:free` as primary model.
- [x] Add required HTTP headers (Referer/Title) for OpenRouter free tier.
- [x] Test model responsiveness and tool usage.

## T4: Frontend Integration

### T4.1: UI Components
- [x] Create Chat Interface (floating or dedicated page).
- [x] Display user vs. assistant messages.
- [x] Show "Thinking..." states.

### T4.2: API Integration
- [x] Connect frontend to `POST /api/chat`.
- [x] Connect frontend to `GET /api/conversations`.
- [x] Handle streaming response (simulated or actual).

## T5: Verification & Deployment

### T5.1: Testing
- [x] Verify natural language command (Add, Delete, List).
- [x] Verify history persistence.
- [x] Verify context retention.
- [x] Verify error handling (invalid keys, system errors).

### T5.2: Deployment
- [x] Deploy to Vercel.
- [x] Configure Vercel environment variables.
- [x] Verify production functionality.
