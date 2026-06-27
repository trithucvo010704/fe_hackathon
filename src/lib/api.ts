import axios from 'axios';
import { getStoredToken, redirectToLogin } from './auth';
import { ApiResponse } from './types';

// Create a unified Axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Bearer token dynamically
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

// Client-side mocks datasets
const mockAgents = [
  {
    id: '1',
    name: 'Alpha Scout',
    model: 'Gemini 3 Pro',
    status: 'working',
    task: 'Analyzing codebase architecture',
    performance: 98,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alpha'
  },
  {
    id: '2',
    name: 'Beta Coder',
    model: 'Claude 3.5 Sonnet',
    status: 'working',
    task: 'Implementing auth service',
    performance: 95,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Beta'
  },
  {
    id: '3',
    name: 'Gamma Auditor',
    model: 'GPT-4o',
    status: 'idle',
    performance: 99,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gamma'
  },
  {
    id: '4',
    name: 'Delta Deployer',
    model: 'Llama 3 70B',
    status: 'error',
    task: 'Deploying to staging',
    performance: 88,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Delta'
  },
  {
    id: '5',
    name: 'Epsilon Writer',
    model: 'Mistral Large',
    status: 'paused',
    performance: 92,
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Epsilon'
  }
];

const mockStats = {
  activeAgents: 12,
  ongoingTasks: 45,
  successRate: 98.2,
  creditsUsed: 1240,
  lastUpdate: new Date().toISOString()
};

const mockTasks = [
  {
    id: 't1',
    title: 'Refactor Authentication Flow',
    project: 'Core API',
    priority: 'high',
    status: 'in-progress',
    assignedAgentId: '2',
    deadline: '2026-05-15'
  },
  {
    id: 't2',
    title: 'Database Schema Migration',
    project: 'Data Warehouse',
    priority: 'urgent',
    status: 'todo',
    deadline: '2026-05-13'
  },
  {
    id: 't3',
    title: 'Unit Test Coverage',
    project: 'Mobile App',
    priority: 'medium',
    status: 'review',
    assignedAgentId: '1',
    deadline: '2026-05-20'
  }
];

// Determine if we should intercept call with local mock data
function getMockResponse(url: string) {
  if (url.endsWith('/api/agents') || url.includes('/api/agents?')) {
    return mockAgents;
  }
  if (url.endsWith('/api/stats') || url.includes('/api/stats?')) {
    return mockStats;
  }
  if (url.endsWith('/api/tasks') || url.includes('/api/tasks?')) {
    return mockTasks;
  }
  return null;
}

/**
 * Standard fetch polyfill wrapper powered by Axios underneath
 */
export async function apiFetch(url: string, options: any = {}) {
  const cleanedUrl = url.replace(/\/app\/\/app\//g, '/app/');
  const mockData = getMockResponse(cleanedUrl);
  if (mockData !== null) {
    return {
      status: 200,
      json: async () => mockData,
    } as unknown as Response;
  }

  const token = getStoredToken();
  if (!token) {
    redirectToLogin();
    return new Promise<Response>(() => {});
  }

  try {
    const headers = { ...options.headers };
    const method = options.method || 'GET';
    const data = options.body ? JSON.parse(options.body) : undefined;

    const response = await api({
      url: cleanedUrl,
      method,
      headers,
      data,
    });

    return {
      status: response.status,
      json: async () => response.data,
    } as unknown as Response;
  } catch (error: any) {
    console.error('apiFetch failed:', error);
    if (error.response && error.response.status === 401) {
      redirectToLogin();
      return new Promise<Response>(() => {});
    }
    throw error;
  }
}

/**
 * High-level standard fetch wrapper for our services, powered by Axios
 */
export async function fetchData<T>(url: string, options: any = {}): Promise<T> {
  const cleanedUrl = url.replace(/\/app\/\/app\//g, '/app/');
  const mockData = getMockResponse(cleanedUrl);
  if (mockData !== null) {
    return mockData as T;
  }

  try {
    const headers = { ...options.headers };
    const method = options.method || 'GET';
    const data = options.body ? JSON.parse(options.body) : undefined;

    const response = await api({
      url: cleanedUrl,
      method,
      headers,
      data,
    });

    const result: ApiResponse<T> = response.data;

    if (result.status === 1) {
      return result.data as T;
    } else {
      throw new Error(result.message || 'API Error');
    }
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      redirectToLogin();
      return new Promise<T>(() => {});
    }
    console.error('fetchData failed:', error);
    throw error;
  }
}
