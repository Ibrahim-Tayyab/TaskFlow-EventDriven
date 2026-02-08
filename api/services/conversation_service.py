from typing import List, Optional
from sqlmodel import Session
from models.chat_message import ChatMessage, ChatMessageCreate, ChatMessageRead
from models.conversation import Conversation, ConversationRead
from repositories.chat_repository import ChatRepository


class ConversationService:
    """Service for conversation business logic."""
    
    def __init__(self, repository: ChatRepository):
        self.repository = repository
    
    def create_conversation(self, session: Session, user_id: str, title: str = "New Chat") -> ConversationRead:
        """Create a new conversation."""
        conversation = self.repository.create_conversation(session, user_id, title)
        return ConversationRead(
            id=conversation.id,
            title=conversation.title,
            created_at=conversation.created_at,
            updated_at=conversation.updated_at
        )
    
    def get_user_conversations(self, session: Session, user_id: str) -> List[ConversationRead]:
        """Get all conversations for a user."""
        conversations = self.repository.get_user_conversations(session, user_id)
        return [
            ConversationRead(
                id=conv.id,
                title=conv.title,
                created_at=conv.created_at,
                updated_at=conv.updated_at
            )
            for conv in conversations
        ]
    
    def rename_conversation(self, session: Session, conversation_id: int, user_id: str, title: str) -> Optional[ConversationRead]:
        """Rename a conversation."""
        conversation = self.repository.update_conversation_title(session, conversation_id, user_id, title)
        if conversation:
            return ConversationRead(
                id=conversation.id,
                title=conversation.title,
                created_at=conversation.created_at,
                updated_at=conversation.updated_at
            )
        return None
    
    def delete_conversation(self, session: Session, conversation_id: int, user_id: str) -> bool:
        """Delete a conversation and its messages."""
        return self.repository.delete_conversation(session, conversation_id, user_id)
    
    def auto_generate_title(self, first_message: str) -> str:
        """Generate a title from the first message (first 50 characters)."""
        # Remove common task-related prefixes
        message = first_message.lower()
        prefixes = ["add task", "create task", "new task", "add a task", "create a task"]
        
        for prefix in prefixes:
            if message.startswith(prefix):
                message = message[len(prefix):].strip()
                break
        
        # Capitalize first letter and limit to 50 chars
        title = first_message[:50].strip()
        if len(first_message) > 50:
            title += "..."
        
        return title if title else "New Chat"
