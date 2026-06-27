import { fetchData } from '../api';
import { ProjectRepository, AddRepoInput } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const repositoryService = {
  async getRepositoriesByProject(projectId: string): Promise<ProjectRepository[]> {
    return fetchData<ProjectRepository[]>(`${API_URL}/app/project-repositories/project/${projectId}`);
  },

  async addRepository(data: AddRepoInput): Promise<ProjectRepository> {
    return fetchData<ProjectRepository>(`${API_URL}/app/project-repositories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateRepository(id: string, data: AddRepoInput): Promise<ProjectRepository> {
    return fetchData<ProjectRepository>(`${API_URL}/app/project-repositories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async removeRepository(id: string): Promise<void> {
    await fetchData<void>(`${API_URL}/app/project-repositories/${id}`, {
      method: 'DELETE',
    });
  },

  async getExternalRepositories(workspace: string): Promise<any[]> {
    return fetchData<any[]>(`${API_URL}/app/bitbucket-repositories/external/workspace/${workspace}`);
  },
};

