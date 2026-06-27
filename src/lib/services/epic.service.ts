import { fetchData } from '../api';
import { Epic, CreateEpicInput } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const epicService = {
  async getEpicsByProject(projectId: string, onlyMe?: boolean): Promise<Epic[]> {
    const url = `${API_URL}/app/project-epics/project/${projectId}${onlyMe ? '?only_me=true' : ''}`;
    return fetchData<Epic[]>(url);
  },

  async createEpic(data: CreateEpicInput): Promise<Epic> {
    return fetchData<Epic>(`${API_URL}/app/project-epics`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEpic(id: string, data: Partial<CreateEpicInput>): Promise<Epic> {
    return fetchData<Epic>(`${API_URL}/app/project-epics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteEpic(id: string): Promise<void> {
    await fetchData<void>(`${API_URL}/app/project-epics/${id}`, {
      method: 'DELETE',
    });
  },
};
