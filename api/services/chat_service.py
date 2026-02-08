from typing import List, Optional
from sqlmodel import Session
from models.chat_message import ChatMessage, ChatMessageCreate, ChatMessageRead
from repositories.chat_repository import ChatRepository


class ChatService:
    """Service for chat message business logic."""
    
    def __init__(self, repository: ChatRepository):
        self.repository = repository
    
    def save_message(
        self, 
        session: Session, 
        message: ChatMessageCreate, 
        user_id: str,
        conversation_id: Optional[int] = None
    ) -> ChatMessage:
        """Save a chat message."""
        return self.repository.save_message(session, message, user_id, conversation_id)
    
    def get_user_history(
        self, 
        session: Session, 
        user_id: str, 
        limit: Optional[int] = 20,
        conversation_id: Optional[int] = None
    ) -> List[ChatMessageRead]:
        """Get chat history for a user, optionally filtered by conversation."""
        # Use optimized get_recent_messages for small limits (faster query)
        if limit and limit <= 50:
            messages = self.repository.get_recent_messages(session, user_id, limit, conversation_id)
        else:
            # For larger limits or no limit, use standard method
            messages = self.repository.get_user_messages(session, user_id, limit)
        
        return [
            ChatMessageRead(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                source=msg.source,
                timestamp=msg.timestamp,
                conversation_id=msg.conversation_id
            )
            for msg in messages
        ]
    
    def clear_history(self, session: Session, user_id: str) -> int:
        """Clear all chat history for a user."""
        return self.repository.clear_user_messages(session, user_id)
    
    def delete_message(self, session: Session, message_id: int, user_id: str) -> bool:
        """Delete a specific message."""
        return self.repository.delete_message(session, message_id, user_id)
