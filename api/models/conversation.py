from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


# SQLModel table for conversation threads
class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # Links to user.id
    title: str = "New Chat"  # Conversation title
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# Pydantic models for API
class ConversationCreate(BaseModel):
    title: str = "New Chat"


class ConversationRead(BaseModel):
    id: int
    title: str
    created_at: str
    updated_at: str
