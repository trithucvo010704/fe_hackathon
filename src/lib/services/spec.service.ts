import { fetchData } from '../api';
import { ApiSpec, DbTableSpec } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const specService = {
  getApiSpecsByProject: async (projectKey: string): Promise<ApiSpec[]> => {
    return fetchData<ApiSpec[]>(`${API_URL}/app/api-specs/project/${projectKey}`);
  },

  getDbTableSpecsByProject: async (projectKey: string): Promise<DbTableSpec[]> => {
    return fetchData<DbTableSpec[]>(`${API_URL}/app/db-table-specs/project/${projectKey}`);
  }
};

