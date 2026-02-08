with open(r'e:\Hackathon_AI\todo-hackathon\api\api\v1\endpoints\chat.py', 'a', encoding='utf-8') as f:
    f.write('''

# --- Chat History Endpoints ---

@router.get("/history", response_model=List[ChatMessageRead])
def get_chat_history(
    session: Session = Depends(get_session),
    chat_service: ChatService = Depends(get_chat_service),
    user_id: str = Depends(get_current_user_id),
    limit: Optional[int] = None
):
    """Get chat history for the authenticated user."""
    return chat_service.get_user_history(session, user_id, limit)


@router.delete("/history")
def clear_chat_history(
    session: Session = Depends(get_session),
    chat_service: ChatService = Depends(get_chat_service),
    user_id: str = Depends(get_current_user_id)
):
    """Clear all chat history for the authenticated user."""
    count = chat_service.clear_history(session, user_id)
    return {"message": f"Cleared {count} messages", "count": count}


@router.post("/save-message")
def save_chat_message(
    message: ChatMessageCreate,
    session: Session = Depends(get_session),
    chat_service: ChatService = Depends(get_chat_service),
    user_id: str = Depends(get_current_user_id)
):
    """Save a chat message for the authenticated user."""
    saved_message = chat_service.save_message(session, message, user_id)
    return ChatMessageRead(
        id=saved_message.id,
        role=saved_message.role,
        content=saved_message.content,
        source=saved_message.source,
        timestamp=saved_message.timestamp
    )
''')
print('Chat history endpoints added successfully!')
