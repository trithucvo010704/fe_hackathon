import { fetchData } from '../api';
import { Sprint, CreateSprintInput } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sprintService = {
  async getSprintsByProject(projectId: string): Promise<Sprint[]> {
    return fetchData<Sprint[]>(`${API_URL}/app/project-sprints/project/${projectId}`);
  },

  async createSprint(data: CreateSprintInput): Promise<Sprint> {
    return fetchData<Sprint>(`${API_URL}/app/project-sprints`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async startSprint(id: string): Promise<Sprint> {
    return fetchData<Sprint>(`${API_URL}/app/project-sprints/${id}/start`, {
      method: 'PUT',
    });
  },

  async completeSprint(id: string): Promise<Sprint> {
    return fetchData<Sprint>(`${API_URL}/app/project-sprints/${id}/complete`, {
      method: 'PUT',
    });
  },

  async deleteSprint(id: string): Promise<void> {
    await fetchData<void>(`${API_URL}/app/project-sprints/${id}`, {
      method: 'DELETE',
    });
  },
};
