import { fetchData } from '../api';
import { Project, CreateProjectInput, UpdateProjectInput, ProjectMember } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const projectService = {
  async getProjects(): Promise<Project[]> {
    return fetchData<Project[]>(`${API_URL}/app/projects`);
  },

  async getProjectById(id: string): Promise<Project> {
    return fetchData<Project>(`${API_URL}/app/projects/${id}`);
  },

  async createProject(data: CreateProjectInput): Promise<Project> {
    return fetchData<Project>(`${API_URL}/app/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProject(id: string, data: UpdateProjectInput): Promise<Project> {
    return fetchData<Project>(`${API_URL}/app/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id: string): Promise<void> {
    await fetchData<void>(`${API_URL}/app/projects/${id}`, {
      method: 'DELETE',
    });
  },

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    return fetchData<ProjectMember[]>(`${API_URL}/app/projects/${projectId}/members`);
  },

  async addProjectMember(projectId: string, userId: string): Promise<ProjectMember> {
    return fetchData<ProjectMember>(`${API_URL}/app/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async removeProjectMember(projectId: string, userId: string): Promise<void> {
    await fetchData<void>(`${API_URL}/app/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
    });
  },
};


