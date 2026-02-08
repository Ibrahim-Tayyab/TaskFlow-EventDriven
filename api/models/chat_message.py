from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


# SQLModel table for chat messages
class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # Links to user.id
    conversation_id: Optional[int] = Field(default=None, index=True)  # Links to conversation
    role: str  # 'user' or 'assistant'
    content: str
    source: Optional[str] = None  # AI source used (e.g., "OpenRouter", "Google")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# Pydantic models for API
class ChatMessageCreate(BaseModel):
    role: str
    content: str
    source: Optional[str] = None
    conversation_id: Optional[int] = None


class ChatMessageRead(BaseModel):
    id: int
    role: str
    content: str
    source: Optional[str] = None
    timestamp: str
    conversation_id: Optional[int] = None
