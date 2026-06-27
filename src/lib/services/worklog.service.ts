import { fetchData } from '../api';
import { WorkLog, CreateWorkLogInput } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const worklogService = {
  async getTaskWorkLogs(taskId: string): Promise<WorkLog[]> {
    return fetchData<WorkLog[]>(`${API_URL}/app/work-logs/task/${taskId}`);
  },

  async createWorkLog(data: CreateWorkLogInput): Promise<WorkLog> {
    return fetchData<WorkLog>(`${API_URL}/app/work-logs`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
