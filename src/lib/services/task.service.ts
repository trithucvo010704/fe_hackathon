import { fetchData } from '../api';
import { ProjectTask, CreateTaskInput } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const taskService = {
  async getBacklogTasks(projectId: string): Promise<ProjectTask[]> {
    return fetchData<ProjectTask[]>(`${API_URL}/app/project-tasks/backlog/project/${projectId}`);
  },

  async getSprintTasks(sprintId: string): Promise<ProjectTask[]> {
    return fetchData<ProjectTask[]>(`${API_URL}/app/project-tasks/sprint/${sprintId}`);
  },

  async getTasksByStory(storyId: string): Promise<ProjectTask[]> {
    return fetchData<ProjectTask[]>(`${API_URL}/app/project-tasks/story/${storyId}`);
  },

  async createTask(data: CreateTaskInput): Promise<ProjectTask> {
    return fetchData<ProjectTask>(`${API_URL}/app/project-tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTask(id: string, data: Partial<CreateTaskInput>): Promise<ProjectTask> {
    return fetchData<ProjectTask>(`${API_URL}/app/project-tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateTaskStatus(id: string, status: string): Promise<ProjectTask> {
    return fetchData<ProjectTask>(`${API_URL}/app/project-tasks/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
  },

  async moveToSprint(id: string, sprintId: string): Promise<void> {
    await fetchData<void>(`${API_URL}/app/project-tasks/${id}/move-to-sprint/${sprintId}`, {
      method: 'PUT',
    });
  },

  async moveToBacklog(id: string): Promise<void> {
    await fetchData<void>(`${API_URL}/app/project-tasks/${id}/move-to-backlog`, {
      method: 'PUT',
    });
  },

  async deleteTask(id: string): Promise<void> {
    await fetchData<void>(`${API_URL}/app/project-tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
