import { fetchData } from '../api';
import { Story, CreateStoryInput } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const storyService = {
  async getStoriesByProject(projectId: string, onlyMe?: boolean): Promise<Story[]> {
    const url = `${API_URL}/app/project-stories/project/${projectId}${onlyMe ? '?only_me=true' : ''}`;
    return fetchData<Story[]>(url);
  },

  async getStoriesByEpic(epicId: string): Promise<Story[]> {
    return fetchData<Story[]>(`${API_URL}/app/project-stories/epic/${epicId}`);
  },

  async createStory(data: CreateStoryInput): Promise<Story> {
    return fetchData<Story>(`${API_URL}/app/project-stories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateStory(id: string, data: Partial<CreateStoryInput>): Promise<Story> {
    return fetchData<Story>(`${API_URL}/app/project-stories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteStory(id: string): Promise<void> {
    await fetchData<void>(`${API_URL}/app/project-stories/${id}`, {
      method: 'DELETE',
    });
  },
};
