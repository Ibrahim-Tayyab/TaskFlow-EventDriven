from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlmodel import Session
import os
import json
from openai import OpenAI
import httpx
import time
from datetime import datetime

# Feature Flag: Google Gemini (via HTTPX fallback)
# We do not import google.generativeai to prevent Vercel crashes
HAS_GEMINI = True 

from database.session import get_session
from models.task import TaskCreate, TaskUpdate
from models.chat_message import ChatMessageCreate, ChatMessageRead
from services.task_service import TaskService
from services.chat_service import ChatService
from repositories.task_repository import TaskRepository
from repositories.chat_repository import ChatRepository
from core.security import get_current_user_id

router = APIRouter()

# --- Configuration ---
# ========================================
# DUAL-MODEL FALLBACK SYSTEM
# ========================================
PRIMARY_MODEL = "openai/gpt-4o-mini"     # Best for tool calling
GEMINI_MODEL = "gemini-2.5-flash"        # Stable Google model
FORCE_USE_BACKUP = os.getenv("FORCE_USE_BACKUP", "False").lower() == "true"

# --- Models ---
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str
    source: str 

# --- Tools Definition ---
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Add a new task. Infer title/priority/category.",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high"]},
                    "category": {"type": "string"},
                    "due_date": {"type": "string", "description": "ISO 8601 date string (e.g. 2026-02-08T17:00:00)"}
                },
                "required": ["title"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List existing tasks.",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {"type": "string", "enum": ["all", "pending", "completed"]}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Complete a task.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer"},
                    "task_name": {"type": "string"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer"},
                    "task_name": {"type": "string"}
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_tasks",
            "description": "Search tasks by keyword.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_task_analytics",
            "description": "Get task statistics.",
            "parameters": {"type": "object", "properties": {}}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "clear_completed",
            "description": "Delete all completed tasks.",
            "parameters": {"type": "object", "properties": {}}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update a task.",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer"},
                    "task_name": {"type": "string"},
                    "new_title": {"type": "string"},
                    "new_priority": {"type": "string", "enum": ["low", "medium", "high"]},
                    "new_category": {"type": "string"}
                }
            }
        }
    }
]

# --- Helper Functions ---
def get_task_service():
    return TaskService(TaskRepository())

def get_chat_service():
    return ChatService(ChatRepository())

def execute_tool(tool_name: str, args: Dict, session: Session, user_id: str, task_service: TaskService):
    try:
        print(f"Executing Tool: {tool_name} with args: {args}")
        if tool_name == "add_task":
            title = args.get("title")
            if not title: return "Error: 'title' is required for add_task"
            # Capitalize priority properly (High, Medium, Low)
            raw_priority = args.get("priority", "medium")
            priority = raw_priority.capitalize() if raw_priority else "Medium"
            task_data = TaskCreate(
                description=title, 
                priority=priority, 
                category=args.get("category", "General"),
                due_date=args.get("due_date")
            )
            new_task = task_service.create_task(session, task_data, user_id)
            return f"Task Added! (ID: {new_task.id}, Title: {new_task.description}, Priority: {new_task.priority}, Due: {new_task.due_date})"

        elif tool_name == "list_tasks":
            tasks = task_service.get_all_tasks(session, user_id)
            status = args.get("status", "all")
            filtered = [t for t in tasks if (status == "all") or (status == "pending" and not t.completed) or (status == "completed" and t.completed)]
            if not filtered: return "No tasks found."
            return "Your Tasks:\n" + "\n".join([f"{'Done' if t.completed else 'Pending'} {t.description} (ID: {t.id})" for t in filtered])

        elif tool_name == "complete_task":
            t_id = args.get("task_id")
            name = args.get("task_name")
            if not t_id and name:
                res = task_service.search_tasks(session, name, user_id)
                if res: t_id = res[0].id
            if t_id and task_service.complete_task(session, int(t_id), user_id, True):
                return f"Task {t_id} Completed!"
            return "Task not found."

        elif tool_name == "delete_task":
            t_id = args.get("task_id")
            name = args.get("task_name")
            if not t_id and name:
                res = task_service.search_tasks(session, name, user_id)
                if res: t_id = res[0].id
            if t_id and task_service.delete_task(session, int(t_id), user_id):
                return f"Task {t_id} Deleted."
            return "Task not found."

        elif tool_name == "search_tasks":
            results = task_service.search_tasks(session, args.get("query", ""), user_id)
            if not results: return "No matches found."
            return "Found:\n" + "\n".join([f"- {t.description} (ID: {t.id})" for t in results])
            
        elif tool_name == "get_task_analytics":
            stats = task_service.get_task_analytics(session, user_id)
            return f"Stats: {stats['total_tasks']} Total, {stats['completed_tasks']} Done, {stats['pending_tasks']} Pending."

        elif tool_name == "clear_completed":
            count = task_service.clear_completed_tasks(session, user_id)
            return f"Cleared {count} completed tasks."
            
        elif tool_name == "update_task":
             t_id = args.get("task_id")
             if not t_id: return "Task ID required."
             update_data = {}
             if args.get("new_title"): update_data["description"] = args["new_title"]
             if args.get("new_priority"): 
                 # Capitalize priority properly (High, Medium, Low)
                 update_data["priority"] = args["new_priority"].capitalize()
             if args.get("new_category"): update_data["category"] = args["new_category"]
             if task_service.update_task(session, int(t_id), user_id, TaskUpdate(**update_data)):
                 return f"Task {t_id} Updated."
             return "Update failed."

        return f"Unknown tool: {tool_name}"
    except Exception as e:
        print(f"Tool Execution Error: {e}")
        return f"Error executing {tool_name}: {str(e)}"

# --- Mock Classes for Gemini Fallback ---
class MockToolCall:
    def __init__(self, name, args):
        self.id = "call_" + os.urandom(4).hex()
        self.function = type('obj', (object,), {'name': name, 'arguments': json.dumps(args)})
        self.type = 'function'

class MockMessage:
    def __init__(self, content, tool_calls=None):
        self.content = content
        self.tool_calls = tool_calls
        self.role = "assistant" # Default role

class MockChoice:
    def __init__(self, message):
        self.message = message

class MockCompletion:
    def __init__(self, message):
        self.choices = [MockChoice(message)]

# --- Google Gemini Direct HTTP Client ---
async def call_google_direct(messages, system_instruction):
    """
    Async Fallback using httpx to call Google Gemini API directly.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key: 
        print("GOOGLE_API_KEY not found.")
        raise Exception("GOOGLE_API_KEY missing")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"
    
    # Message formatting
    contents = []
    for m in messages:
        role = "user" if m['role'] == "user" else "model"
        if m['role'] in ["system", "tool"]: continue # Skip system/tool for simple fallback
        contents.append({"role": role, "parts": [{"text": str(m['content'])}]})
    
    if not contents: contents.append({"role": "user", "parts": [{"text": "Hello"}]})

    payload = {
        "contents": contents,
        "systemInstruction": {"parts": [{"text": system_instruction}]},
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 800}
    }

    try:
        print("Calling Google Gemini (HTTP)...")
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=30.0)
            
            if response.status_code != 200:
                print(f"Google API Error: {response.status_code} - {response.text}")
                raise Exception(f"Google API {response.status_code}")
                
            data = response.json()
            try:
                text = data["candidates"][0]["content"]["parts"][0]["text"]
            except:
                text = "Error parsing Gemini response."
            
            # Simple Tool Logic (Mock)
            tool_calls = None
            clean_text = text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text.replace("```json", "").replace("```", "").strip()
            
            if clean_text.startswith("{") and '"tool":' in clean_text:
                try:
                    js = json.loads(clean_text)
                    if "tool" in js and "args" in js:
                        tool_calls = [MockToolCall(js["tool"], js["args"])]
                        text = None # Suppress text if tool call
                except Exception as e:
                    print(f"Failed to parse JSON tool from Gemini: {e}")

            return MockCompletion(MockMessage(text, tool_calls)), "Google (Direct HTTP)"

    except Exception as e:
        print(f"Google Fallback Exception: {e}")
        raise e

# --- Main Endpoint ---

@router.post("/", response_model=ChatResponse)
@router.post("", response_model=ChatResponse, include_in_schema=False)
async def chat_with_ai(
    request: ChatRequest,
    session: Session = Depends(get_session),
    task_service: TaskService = Depends(get_task_service),
    user_id: str = Depends(get_current_user_id)
):
    today_iso = datetime.now().isoformat()
    system_prompt = f"""You are Todo AI for User {user_id}. Manage tasks in English/Urdu.
    Current Date/Time: {today_iso}
    
    If the user asks for a relative date (e.g. 'tomorrow', 'next week'), calculate the exact ISO 8601 date based on the Current Date/Time provided above.
    
    tools: add_task, list_tasks, complete_task, delete_task, search_tasks.
    
    IMPORTANT: If using a tool, output valid JSON if using Gemini:
    {{ "tool": "tool_name", "args": {{ ... }} }}
    """
    
    messages = [{"role": "system", "content": system_prompt}] + [{"role": m.role, "content": m.content} for m in request.messages]

    # FORCE BACKUP MODE
    if FORCE_USE_BACKUP:
        try:
            res, src = await call_google_direct(messages, system_prompt)
            msg = res.choices[0].message
            if msg.tool_calls:
                tc = msg.tool_calls[0]
                args = json.loads(tc.function.arguments)
                result = execute_tool(tc.function.name, args, session, user_id, task_service)
                # Confirm
                final_prompt = system_prompt + f"\n\nTool Result: {result}"
                res_final, _ = await call_google_direct(messages, final_prompt)
                return ChatResponse(response=res_final.choices[0].message.content or result, source=src)
            return ChatResponse(response=msg.content, source=src)
        except Exception as e:
            return ChatResponse(response=f"Gemini Error: {str(e)}", source="System Error")

    # PRIMARY (OpenRouter)
    try:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key: raise Exception("Missing OPENROUTER_API_KEY")
        
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
            default_headers={"HTTP-Referer": "https://vercel.app", "X-Title": "TodoApp"}
        )
        
        print(f"Calling OpenRouter ({PRIMARY_MODEL})...")
        completion = client.chat.completions.create(
            model=PRIMARY_MODEL,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto"
        )
        
        msg = completion.choices[0].message
        
        if msg.tool_calls:
            tc = msg.tool_calls[0]
            func = tc.function
            args = json.loads(func.arguments)
            result = execute_tool(func.name, args, session, user_id, task_service)
            
            # Follow up
            messages.append(msg)
            messages.append({"role": "tool", "tool_call_id": tc.id, "content": str(result)})
            
            final_res = client.chat.completions.create(
                model=PRIMARY_MODEL,
                messages=messages
            )
            return ChatResponse(response=final_res.choices[0].message.content, source=f"Primary ({PRIMARY_MODEL})")
            
        return ChatResponse(response=msg.content or "Done", source=f"Primary ({PRIMARY_MODEL})")

    except Exception as e:
        print(f"Primary Failed: {e}. Switching to Gemini Fallback...")
        try:
            res, src = await call_google_direct(messages, system_prompt)
            msg = res.choices[0].message
            if msg.tool_calls:
                tc = msg.tool_calls[0]
                args = json.loads(tc.function.arguments)
                # Ensure args is dict
                if isinstance(args, str): args = json.loads(args)
                result = execute_tool(tc.function.name, args, session, user_id, task_service)
                
                final_sys = system_prompt + f"\n\nTool Executed: {result}"
                final_res, _ = await call_google_direct(messages, final_sys)
                return ChatResponse(response=final_res.choices[0].message.content or result, source="Google (Fallback)")
                
            return ChatResponse(response=msg.content, source="Google (Fallback)")
            
        except Exception as fallback_error:
            print(f"CRITICAL: Both Providers Failed. Primary: {e}, Fallback: {fallback_error}")
            return ChatResponse(response=f"System Overload. Please try again. (Details: {fallback_error})", source="System Error")

# --- History Endpoints ---
@router.get("/history", response_model=List[ChatMessageRead])
def get_chat_history(session: Session = Depends(get_session), chat_service: ChatService = Depends(get_chat_service), user_id: str = Depends(get_current_user_id)):
    return chat_service.get_user_history(session, user_id, 20)

@router.delete("/history")
def clear_chat_history(session: Session = Depends(get_session), chat_service: ChatService = Depends(get_chat_service), user_id: str = Depends(get_current_user_id)):
    count = chat_service.clear_history(session, user_id)
    return {"message": "Cleared", "count": count}

@router.post("/save-message")
def save_chat_message(message: ChatMessageCreate, session: Session = Depends(get_session), chat_service: ChatService = Depends(get_chat_service), user_id: str = Depends(get_current_user_id)):
    return chat_service.save_message(session, message, user_id, message.conversation_id)
