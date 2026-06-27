'use client';

import React from 'react';
import { Conversation } from '@/lib/types';
import { Plus, MessageSquare } from 'lucide-react';
import styles from '../chat.module.css';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export default function ConversationList({ 
  conversations, 
  selectedId, 
  onSelect, 
  onNewChat 
}: ConversationListProps) {

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className="text-xl font-bold">Chats</h2>
        <button 
          onClick={onNewChat}
          className={styles.newChatBtn}
          title="New Conversation"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className={styles.conversationList}>
        {conversations.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <MessageSquare size={48} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((chat, index) => (
            <div
              key={chat.conversation_id || chat.id || index}
              onClick={() => onSelect(chat.conversation_id || chat.id)}
              className={`${styles.conversationItem} ${selectedId === (chat.conversation_id || chat.id) ? styles.activeItem : ''}`}
            >
              <div className={styles.avatar}>
                {chat.title?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className={styles.chatInfo}>
                <h3 className={styles.chatTitle}>{chat.title}</h3>
                <p className={styles.lastMsg}>
                  {chat.lastMessage || 'No messages yet'}
                </p>
              </div>
              {chat.lastActive && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(chat.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
