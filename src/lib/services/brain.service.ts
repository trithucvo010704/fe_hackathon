import { fetchData } from '../api';
import { AgentBrain } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const brainService = {
  getAgentBrains: async (): Promise<AgentBrain[]> => {
    return fetchData<AgentBrain[]>(`${API_URL}/app/agent-brains`);
  },
  createAgentBrain: async (data: Partial<AgentBrain>): Promise<AgentBrain> => {
    return fetchData<AgentBrain>(`${API_URL}/app/agent-brains`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateAgentBrain: async (id: string, data: Partial<AgentBrain>): Promise<AgentBrain> => {
    return fetchData<AgentBrain>(`${API_URL}/app/agent-brains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteAgentBrain: async (id: string): Promise<void> => {
    return fetchData<void>(`${API_URL}/app/agent-brains/${id}`, {
      method: 'DELETE',
    });
  }
};
