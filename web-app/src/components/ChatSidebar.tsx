'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Conversation {
    id: number
    title: string
    created_at: string
    updated_at: string
}

interface ChatSidebarProps {
    conversations: Conversation[]
    activeConversationId: number | null
    onSelectConversation: (id: number) => void
    onNewChat: () => void
    onDeleteConversation: (id: number) => void
    onRenameConversation: (id: number, newTitle: string) => void
    isOpen: boolean
}

export default function ChatSidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewChat,
    onDeleteConversation,
    onRenameConversation,
    isOpen
}: ChatSidebarProps) {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editTitle, setEditTitle] = useState('')

    const startEditing = (conv: Conversation) => {
        setEditingId(conv.id)
        setEditTitle(conv.title)
    }

    const saveEdit = (id: number) => {
        if (editTitle.trim()) {
            onRenameConversation(id, editTitle.trim())
        }
        setEditingId(null)
    }

    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation()
        if (confirm('Delete this conversation?')) {
            onDeleteConversation(id)
        }
    }

    if (!isOpen) return null

    return (
        <div className="w-full h-full bg-white/5 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-2 border-b border-white/10">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white text-xs transition-all"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="font-medium">New Chat</span>
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                    {conversations.map((conv) => (
                        <motion.div
                            key={conv.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className={`group relative px-2 py-1.5 mx-1 my-0.5 rounded-lg cursor-pointer transition-all text-xs ${activeConversationId === conv.id
                                ? 'bg-white/15 border border-purple-500/50'
                                : 'hover:bg-white/5 border border-transparent'
                                }`}
                            onClick={() => onSelectConversation(conv.id)}
                        >
                            {editingId === conv.id ? (
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={() => saveEdit(conv.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEdit(conv.id)
                                        if (e.key === 'Escape') setEditingId(null)
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-200 truncate flex-1">
                                            {conv.title}
                                        </p>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    startEditing(conv)
                                                }}
                                                className="p-1 hover:bg-white/10 rounded"
                                                title="Rename"
                                            >
                                                <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, conv.id)}
                                                className="p-1 hover:bg-red-500/20 rounded"
                                                title="Delete"
                                            >
                                                <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/30 truncate mt-0.5">
                                        {new Date(conv.updated_at).toLocaleDateString()}
                                    </p>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {conversations.length === 0 && (
                    <div className="p-2 text-center text-white/40 text-xs">
                        No conversations yet.
                        <br />
                        Click "New Chat" to start!
                    </div>
                )}
            </div>
        </div>
    )
}
