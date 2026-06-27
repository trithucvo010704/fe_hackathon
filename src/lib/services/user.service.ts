import { fetchData } from '../api';
import { User } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
  // General user picker for projects/tasks
  async getUsers(excludeProjectId?: string): Promise<User[]> {
    const url = excludeProjectId 
      ? `${API_URL}/app/users?exclude_project_id=${excludeProjectId}`
      : `${API_URL}/app/users`;
    return fetchData<User[]>(url);
  },

  // Admin user management
  async getAdminUsers(): Promise<User[]> {
    return fetchData<User[]>(`${API_URL}/app/admin/users`);
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return fetchData<User>(`${API_URL}/app/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async activateUser(id: string): Promise<User> {
    return fetchData<User>(`${API_URL}/app/admin/users/${id}/approve`, {
      method: 'PUT',
    });
  },
};

