"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import CreateChatModal from './components/CreateChatModal';
import { chatService } from '@/lib/services/chat.service';
import { Conversation, Message, ChatMessageDto } from '@/lib/types';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { toast } from '@/lib/toast';
import { getStoredUsername } from '@/lib/auth';
import styles from './chat.module.css';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const username = getStoredUsername() || 'user';
  const selectedRef = React.useRef<Conversation | undefined>(undefined);

  // Update ref and global variable when selected conversation changes
  useEffect(() => {
    selectedRef.current = selectedConversation;
    if (typeof window !== 'undefined') {
      (window as any).conversationSelected = selectedConversation;
    }
  }, [selectedConversation]);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
    
    const socket = getSocket();
    
    // Listen for response from backend
    socket.on('chat:response', (data: ChatMessageDto) => {
      console.log('Received chat response:', data);
      
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        conversation_id: data.conversation_id,
        senderId: data.sender,
        role: data.role,
        content: data.payload.content,
        payload: data.payload,
        createdAt: new Date().toISOString()
      };

      // If message is for current conversation, add it
      if (selectedRef.current && data.conversation_id === selectedRef.current.conversation_id) {
        setMessages(prev => [...prev, newMessage]);
      }
      
      // Update last message in conversation list
      setConversations(prev => prev.map(conv => 
        conv.conversation_id === data.conversation_id 
          ? { ...conv, lastMessage: data.payload.content, lastActive: newMessage.createdAt }
          : conv
      ));
    });

    return () => {
      socket.off('chat:response');
      disconnectSocket();
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await chatService.getConversations();
      // Ensure id is mapped from conversation_id for internal compatibility
      const mappedData = data.map(c => ({
        ...c,
        id: c.conversation_id || c.id
      }));
      setConversations(mappedData);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
    }
  };

  const handleSelectConversation = async (conversation_id: string) => {
    console.log('handleSelectConversation called with ID:', conversation_id);
    const conv = conversations.find(c => (c.conversation_id || c.id) === conversation_id);
    console.log('Found conversation:', conv);
    setSelectedConversation(conv);
    
    if (!conv) return;

    try {
      const msgs = await chatService.getMessages(conv.conversation_id);
      // API returns newest to oldest, but UI needs oldest to newest
      setMessages(msgs ? [...msgs].reverse() : []);
      
      // Join socket room
      const socket = getSocket();
      socket.emit('join_room', conv.conversation_id);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
      setMessages([]);
    }
  };

  const handleCreateChat = async (brainId: string, projectId: string) => {
    setIsCreating(true);
    try {
      const newConv = await chatService.createAgentConversation({ 
        brain_id: brainId, 
        project_id: projectId 
      });
      
      // Map for internal state
      const mappedConv = {
        ...newConv,
        id: newConv.conversation_id
      };

      setConversations(prev => [mappedConv, ...prev]);
      setSelectedConversation(mappedConv);
      setMessages([]);
      setIsModalOpen(false);
      toast.success('Conversation created');
      
      // Join room for new conversation
      const socket = getSocket();
      socket.emit('join_room', mappedConv.conversation_id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast.error('Failed to create conversation');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendMessage = (content: string) => {
    const currentConv = selectedConversation || (window as any).conversationSelected;
    if (!currentConv) {
      toast.error('No conversation selected');
      return;
    }

    const socket = getSocket();
    
    // Format according to ChatMessageDto
    const chatDto: ChatMessageDto = {
      sender: username,
      recipient: 'bot', 
      role: 'user',
      conversation_id: currentConv.conversation_id,
      payload: {
        type: 'TEXT',
        content: content
      }
    };

    // Create optimistic message for UI
    const optimisticMsg: Message = {
      id: Date.now().toString(),
      conversation_id: currentConv.conversation_id,
      senderId: username,
      role: 'user',
      content: content,
      payload: chatDto.payload,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);
    
    // Send via socket using chat:request event
    console.log('Sending chat:request:', chatDto);
    socket.emit('chat:request', chatDto);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="content-area" style={{ padding: 0, height: 'calc(100vh - 64px)' }}>
          <div className={styles.chatContainer}>
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversation?.conversation_id || selectedConversation?.id}
              onSelect={handleSelectConversation}
              onNewChat={() => setIsModalOpen(true)}
            />
            
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isSending}
              username={username}
            />

            <CreateChatModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCreateChat}
              isSubmitting={isCreating}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
