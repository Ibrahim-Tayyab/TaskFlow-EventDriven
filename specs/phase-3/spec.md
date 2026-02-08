# Phase 3: AI-Powered Todo Chatbot Specification

## Overview
Develop an intelligent, conversational interface for the Todo application using the Model Context Protocol (MCP) and OpenAI Agents SDK (adapted for Google Gemini). The chatbot allows users to manage tasks via natural language, maintaining context across conversations while remaining stateless on the server.

## Project Structure
```
todo-hackathon/
├── web-app/                 # Next.js frontend (ChatKit UI)
├── backend/                 # FastAPI backend (MCP Server)
├── specs/                   # Project specifications
│   ├── phase-2/             # Phase 2 specs
│   └── phase-3/
│       └── spec.md          # This specification file
```

## Technology Stack

### AI & Agents
- **AI Model**: Google Gemini 2.0 Flash (via OpenRouter)
- **Framework**: OpenAI Agents SDK (Conceptually) / LangChain Integration
- **Protocol**: Model Context Protocol (MCP)
- **Tooling**: Official MCP SDK for Python

### Backend Extensions
- **API Endpoint**: `POST /api/chat` (Stateless)
- **Database**: Extended with `conversations` and `messages` tables
- **Auth**: Integrated with Better Auth (JWT)

## Architecture

### System Design
1.  **Stateless Chat Endpoint**:
    - Receives user message + conversation ID.
    - Loads history from DB.
    - Invokes AI Agent.
    - Saves new history to DB.
    - Returns response.
    - **Benefit**: Horizontal scalability, resilience to restarts.

2.  **MCP Server & Tools**:
    - The backend acts as an MCP Server exposing:
        - `add_task(title, description, priority)`
        - `list_tasks(status)`
        - `complete_task(task_id)`
        - `delete_task(task_id)`
        - `search_tasks(query)`
    - The AI Agent "uses" these tools to perform actions.

## Features Specification

### Conversational Capabilities
1.  **Add Task**: "Remind me to call John at 5 PM" -> Calls `add_task`.
2.  **List Tasks**: "What do I have to do today?" -> Calls `list_tasks`.
3.  **Complete Task**: "mark the meeting as done" -> Calls `complete_task`.
4.  **Context Awareness**: "Update *that* task to high priority" (Refers to previous task).
5.  **Multi-turn Logic**: Ask clarifying questions if info is missing.

### Database Schema

#### Conversation Table
```sql
CREATE TABLE conversation (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Message Table
```sql
CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversation(id),
    role TEXT NOT NULL, -- 'user' or 'assistant' or 'tool'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Specification

### Chat Endpoint
```
POST /api/chat
Headers: Authorization: Bearer <token>
Body:
{
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "conversation_id": 123 (Optional)
}
Response:
{
  "response": "Hi there! How can I help you?",
  "source": "OpenRouter (gemini-2.0-flash-exp)"
}
```

## Success Criteria
- [x] Natural language control of all Todo features.
- [x] Persistent conversation history.
- [x] Stateless server architecture.
- [x] Reliable AI (Gemini 2.0 Flash) integration.
