# Phase 3: AI Chatbot Implementation Plan

## Goal
To transform the Phase 2 Web App into an AI-powered Todo application where users can manage tasks through natural language conversations. The system must use an MCP-based architecture, integrate with Google Gemini 2.0 Flash via OpenRouter, and persist conversation history.

## Execution Strategy

### Step 1: Backend Preparation (MCP Server)
- **Objective**: Turn the FastAPI backend into an MCP Server that exposes Task operations.
- **Actions**:
    1.  Install `openai` and `google-generativeai` libraries.
    2.  Create `Tool` definitions for `add_task`, `list_tasks`, `complete_task`, etc.
    3.  Implement a `execute_tool` function that maps AI tool calls to `TaskService`.

### Step 2: Database Extensions
- **Objective**: Store persistent chat history.
- **Actions**:
    1.  Create `Conversation` and `Message` SQLModels.
    2.  Create `ChatRepository` to save/retrieve messages.
    3.  Generate and apply Alembic migrations.

### Step 3: AI Integration (The "Brain")
- **Objective**: Connect the backend to an LLM.
- **Actions**:
    1.  Create `POST /api/chat` endpoint.
    2.  Implement the loop: `User Msg -> AI -> Tool Call? -> Execute -> AI -> Final Response`.
    3.  Configure OpenRouter with `google/gemini-2.0-flash-exp:free`.
    4.  Add robust error handling and fallback logic (later refined to strict OpenRouter).

### Step 4: Frontend Development
- **Objective**: Visual Chat Interface.
- **Actions**:
    1.  Build a Chat UI component (messages list, input box).
    2.  Integrate with `POST /api/chat`.
    3.  Display "Thinking..." states and tool execution logs (optional but helpful).

### Step 5: Testing & Deployment
- **Objective**: Ensure reliability on Vercel.
- **Actions**:
    1.  Test locally with `uvicorn` and `npm run dev`.
    2.  Deploy to Vercel.
    3.  Add environment variables (`OPENROUTER_API_KEY`, etc.) to Vercel.
    4.  Verify functionality in production.

## Risk Management

| Risk | Mitigation |
|------|------------|
| **AI Hallucinations** | Strict system prompts and typed tool definitions. |
| **Model Availability** | Use reliable OpenRouter models (Gemini 2.0 Flash) with fallbacks. |
| **Latency** | Use fast "Flash" models and stateless architecture. |
| **Data Loss** | Persist every message to Postgres immediately. |

## Verification Plan
1.  **Manual Test**: User saves a task via chat ("Buy milk").
2.  **Verification**: Check if "Buy milk" appears in the Task List dashboard.
3.  **Persistence Test**: Refresh page, chat history should reload.
