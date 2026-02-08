from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from database.session import get_session
from core.security import get_current_user_id
from models.conversation import ConversationCreate, ConversationRead
from repositories.chat_repository import ChatRepository
from services.conversation_service import ConversationService

router = APIRouter()


def get_conversation_service():
    """Dependency to get ConversationService instance."""
    repository = ChatRepository()
    return ConversationService(repository)


@router.post("", response_model=ConversationRead)
@router.post("/", response_model=ConversationRead, include_in_schema=False)
def create_conversation(
    conversation_data: ConversationCreate,
    session: Session = Depends(get_session),
    conversation_service: ConversationService = Depends(get_conversation_service),
    user_id: str = Depends(get_current_user_id)
):
    """Create a new conversation."""
    return conversation_service.create_conversation(session, user_id, conversation_data.title)


@router.get("", response_model=List[ConversationRead])
@router.get("/", response_model=List[ConversationRead], include_in_schema=False)
def list_conversations(
    session: Session = Depends(get_session),
    conversation_service: ConversationService = Depends(get_conversation_service),
    user_id: str = Depends(get_current_user_id)
):
    """Get all conversations for the authenticated user."""
    return conversation_service.get_user_conversations(session, user_id)


@router.patch("/{conversation_id}", response_model=ConversationRead)
def rename_conversation(
    conversation_id: int,
    conversation_data: ConversationCreate,
    session: Session = Depends(get_session),
    conversation_service: ConversationService = Depends(get_conversation_service),
    user_id: str = Depends(get_current_user_id)
):
    """Rename a conversation."""
    result = conversation_service.rename_conversation(session, conversation_id, user_id, conversation_data.title)
    if not result:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return result


@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    session: Session = Depends(get_session),
    conversation_service: ConversationService = Depends(get_conversation_service),
    user_id: str = Depends(get_current_user_id)
):
    """Delete a conversation and all its messages."""
    success = conversation_service.delete_conversation(session, conversation_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": f"Conversation {conversation_id} deleted successfully"}
