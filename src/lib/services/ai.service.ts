import { fetchData } from '../api';
import { AiModel, AiEnv } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const aiService = {
  // AI Models
  getAiModels: async (): Promise<AiModel[]> => {
    return fetchData<AiModel[]>(`${API_URL}/app/ai-models`);
  },
  createAiModel: async (data: Partial<AiModel>): Promise<AiModel> => {
    return fetchData<AiModel>(`${API_URL}/app/ai-models`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateAiModel: async (id: string, data: Partial<AiModel>): Promise<AiModel> => {
    return fetchData<AiModel>(`${API_URL}/app/ai-models/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteAiModel: async (id: string): Promise<void> => {
    return fetchData<void>(`${API_URL}/app/ai-models/${id}`, {
      method: 'DELETE',
    });
  },

  // AI Environments
  getAiEnvs: async (): Promise<AiEnv[]> => {
    return fetchData<AiEnv[]>(`${API_URL}/app/ai-envs`);
  },
  createAiEnv: async (data: Partial<AiEnv>): Promise<AiEnv> => {
    return fetchData<AiEnv>(`${API_URL}/app/ai-envs`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateAiEnv: async (id: string, data: Partial<AiEnv>): Promise<AiEnv> => {
    return fetchData<AiEnv>(`${API_URL}/app/ai-envs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteAiEnv: async (id: string): Promise<void> => {
    return fetchData<void>(`${API_URL}/app/ai-envs/${id}`, {
      method: 'DELETE',
    });
  },
};
