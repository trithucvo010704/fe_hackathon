'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Message, Conversation } from '@/lib/types';
import { Send, User, Bot, Loader2, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../chat.module.css';

interface ChatWindowProps {
  conversation?: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  username?: string;
}

const MessageRow = React.memo(({ msg, username }: { msg: Message, username: string }) => {
  const isUser = msg.role?.toLowerCase() === 'user' || msg.senderId === 'user' || msg.sender === username;
  const content = msg.content || msg.payload?.content || msg.payload?.text || '';
  
  return (
    <div className={`${styles.messageRow} ${isUser ? styles.userRow : ''}`}>
      <div className={`${styles.msgAvatar} ${isUser ? styles.userAvatar : styles.botAvatar}`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        <div className="prose-container" style={{ fontSize: '0.95rem' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        <div style={{ 
          marginTop: '4px', 
          fontSize: '0.7rem', 
          opacity: 0.6, 
          textAlign: isUser ? 'right' : 'left' 
        }}>
          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </div>
      </div>
    </div>
  );
});
MessageRow.displayName = 'MessageRow';

export default function ChatWindow({ 
  conversation, 
  messages, 
  onSendMessage,
  isLoading = false,
  username = 'user'
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!conversation) {
    return (
      <div className={styles.chatMain} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <MessageSquare size={64} style={{ margin: '0 auto 16px', opacity: 0.1 }} />
          <p style={{ fontSize: '1.1rem' }}>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatMain}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.avatar} style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
          {conversation.title?.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{conversation.title}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesArea}>
        {messages.map((msg) => (
          <MessageRow key={msg.id} msg={msg} username={username} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        <form onSubmit={handleSend} className={styles.inputForm} style={{ alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message (Shift+Enter for new line)..."
            className={styles.textInput}
            disabled={isLoading}
            rows={Math.min(5, Math.max(1, input.split('\n').length))}
            style={{ 
              resize: 'none', 
              minHeight: '44px',
              paddingTop: '12px',
              paddingBottom: '12px',
              fontFamily: 'inherit',
              lineHeight: '1.4'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={styles.sendBtn}
            style={{ marginBottom: '4px' }}
          >
            {isLoading ? <Loader2 size={20} style={{ animation: 'rotation 1s linear infinite' }} /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}
