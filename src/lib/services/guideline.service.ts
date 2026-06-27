import { fetchData } from '../api';
import { GuidelineDoc, CreateGuidelineInput } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const guidelineService = {
  getGuidelines: async (): Promise<GuidelineDoc[]> => {
    return fetchData<GuidelineDoc[]>(`${BASE_URL}/app/guideline-docs`);
  },

  createGuideline: async (input: CreateGuidelineInput): Promise<GuidelineDoc> => {
    return fetchData<GuidelineDoc>(`${BASE_URL}/app/guideline-docs`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  updateGuideline: async (id: string, input: CreateGuidelineInput): Promise<GuidelineDoc> => {
    return fetchData<GuidelineDoc>(`${BASE_URL}/app/guideline-docs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  deleteGuideline: async (id: string): Promise<void> => {
    return fetchData<void>(`${BASE_URL}/app/guideline-docs/${id}`, {
      method: 'DELETE',
    });
  },

  uploadGuidelines: async (level: string, files: File[]): Promise<GuidelineDoc[]> => {
    const formData = new FormData();
    formData.append('level', level);
    files.forEach(file => {
      formData.append('files', file);
    });

    return fetchData<GuidelineDoc[]>(`${BASE_URL}/app/guideline-docs/upload`, {
      method: 'POST',
      body: formData,
    });
  },
};
