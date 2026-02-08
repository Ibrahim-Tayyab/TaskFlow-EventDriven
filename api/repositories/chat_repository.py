from typing import List, Optional
from sqlmodel import Session, select, delete
from models.chat_message import ChatMessage, ChatMessageCreate
from models.conversation import Conversation
from datetime import datetime


class ChatRepository:
    """Repository for chat message database operations."""
    
    def save_message(
        self, 
        session: Session, 
        message: ChatMessageCreate, 
        user_id: str,
        conversation_id: Optional[int] = None
    ) -> ChatMessage:
        """Save a chat message to the database."""
        db_message = ChatMessage(
            user_id=user_id,
            conversation_id=conversation_id,
            role=message.role,
            content=message.content,
            source=message.source
        )
        session.add(db_message)
        session.commit()
        session.refresh(db_message)
        
        # Update conversation's updated_at timestamp
        if conversation_id:
            self.touch_conversation(session, conversation_id, user_id)
        
        return db_message
    
    def get_user_messages(self, session: Session, user_id: str, limit: Optional[int] = None) -> List[ChatMessage]:
        """Get all messages for a specific user, ordered by timestamp."""
        query = select(ChatMessage).where(ChatMessage.user_id == user_id).order_by(ChatMessage.timestamp)
        if limit:
            query = query.limit(limit)
        result = session.exec(query)
        return list(result.all())
    
    def get_recent_messages(
        self, 
        session: Session, 
        user_id: str, 
        limit: int = 10,
        conversation_id: Optional[int] = None
    ) -> List[ChatMessage]:
        """Get the most recent N messages for a user, optionally filtered by conversation."""
        query = select(ChatMessage).where(ChatMessage.user_id == user_id)
        
        if conversation_id is not None:
            query = query.where(ChatMessage.conversation_id == conversation_id)
        
        query = query.order_by(ChatMessage.timestamp.desc()).limit(limit)
        
        result = session.exec(query)
        messages = list(result.all())
        return list(reversed(messages))  # Return in chronological order
    
    def clear_user_messages(self, session: Session, user_id: str) -> int:
        """Delete all messages for a user. Returns count of deleted messages."""
        # First get the count
        count_query = select(ChatMessage).where(ChatMessage.user_id == user_id)
        count = len(list(session.exec(count_query).all()))
        
        # Delete all messages for this user
        delete_query = delete(ChatMessage).where(ChatMessage.user_id == user_id)
        session.exec(delete_query)
        session.commit()
        
        return count
    
    def delete_message(self, session: Session, message_id: int, user_id: str) -> bool:
        """Delete a specific message if it belongs to the user."""
        query = select(ChatMessage).where(
            ChatMessage.id == message_id,
            ChatMessage.user_id == user_id
        )
        message = session.exec(query).first()
        
        if message:
            session.delete(message)
            session.commit()
            return True
        return False
    
    # --- Conversation Methods ---
    
    def create_conversation(self, session: Session, user_id: str, title: str = "New Chat") -> Conversation:
        """Create a new conversation."""
        conversation = Conversation(
            user_id=user_id,
            title=title,
            created_at=datetime.utcnow().isoformat(),
            updated_at=datetime.utcnow().isoformat()
        )
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
        return conversation
    
    def get_user_conversations(self, session: Session, user_id: str) -> List[Conversation]:
        """Get all conversations for a user, ordered by most recent first."""
        query = (
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
        )
        result = session.exec(query)
        return list(result.all())
    
    def get_conversation(self, session: Session, conversation_id: int, user_id: str) -> Optional[Conversation]:
        """Get a specific conversation if it belongs to the user."""
        query = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        return session.exec(query).first()
    
    def update_conversation_title(self, session: Session, conversation_id: int, user_id: str, title: str) -> Optional[Conversation]:
        """Rename a conversation."""
        conversation = self.get_conversation(session, conversation_id, user_id)
        if conversation:
            conversation.title = title
            conversation.updated_at = datetime.utcnow().isoformat()
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
        return conversation
    
    def delete_conversation(self, session: Session, conversation_id: int, user_id: str) -> bool:
        """Delete a conversation and all its messages."""
        conversation = self.get_conversation(session, conversation_id, user_id)
        if not conversation:
            return False
        
        # Delete all messages in this conversation
        delete_messages_query = delete(ChatMessage).where(
            ChatMessage.conversation_id == conversation_id,
            ChatMessage.user_id == user_id
        )
        session.exec(delete_messages_query)
        
        # Delete the conversation
        session.delete(conversation)
        session.commit()
        return True
    
    def touch_conversation(self, session: Session, conversation_id: int, user_id: str):
        """Update conversation's updated_at timestamp."""
        conversation = self.get_conversation(session, conversation_id, user_id)
        if conversation:
            conversation.updated_at = datetime.utcnow().isoformat()
            session.add(conversation)
            session.commit()
