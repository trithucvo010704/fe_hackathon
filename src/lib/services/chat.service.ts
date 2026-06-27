import { fetchData } from '../api';
import { Conversation, Message, CreateConversationInput, CreateAgentConversationInput } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    return fetchData<Conversation[]>(`${API_URL}/app/chat/conversations`);
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const url = `${API_URL}/app/chat/conversations/${conversationId}/messages`;
    console.log('Fetching messages from:', url);
    return fetchData<Message[]>(url);
  },

  createConversation: async (input: CreateConversationInput): Promise<Conversation> => {
    return fetchData<Conversation>(`${API_URL}/app/chat/conversations`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  createAgentConversation: async (input: CreateAgentConversationInput): Promise<Conversation> => {
    return fetchData<Conversation>(`${API_URL}/app/chat/conversations/agent`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }
};
