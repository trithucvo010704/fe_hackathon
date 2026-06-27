import { fetchData } from '../api';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    return fetchData<Role[]>(`${API_URL}/app/admin/roles`);
  },
  createRole: async (data: Partial<Role>): Promise<Role> => {
    return fetchData<Role>(`${API_URL}/app/admin/roles`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateRole: async (id: string, data: Partial<Role>): Promise<Role> => {
    return fetchData<Role>(`${API_URL}/app/admin/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteRole: async (id: string): Promise<void> => {
    return fetchData<void>(`${API_URL}/app/admin/roles/${id}`, {
      method: 'DELETE',
    });
  },
};
