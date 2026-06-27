import { fetchData, apiFetch } from '../api';
import { ProjectDocument, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const documentService = {
  async getDocuments(refType: string, refId: string): Promise<ProjectDocument[]> {
    return fetchData<ProjectDocument[]>(`${API_URL}/app/project-documents/ref/${refType}/${refId}`);
  },

  async uploadDocuments(
    refType: string,
    refId: string,
    files: File[],
    description?: string
  ): Promise<ProjectDocument[]> {
    const formData = new FormData();
    formData.append('refType', refType);
    formData.append('refId', refId);
    if (description) {
      formData.append('description', description);
    }
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiFetch(`${API_URL}/app/project-documents/upload`, {
      method: 'POST',
      body: formData,
    });

    const result: ApiResponse<ProjectDocument[]> = await response.json();
    if (result.status === 1) {
      return result.data || [];
    } else {
      throw new Error(result.message || 'Upload failed');
    }
  },

  async deleteDocument(id: string): Promise<void> {
    const response = await apiFetch(`${API_URL}/app/project-documents/${id}`, {
      method: 'DELETE',
    });
    
    if (response.status !== 200 && response.status !== 204) {
      const result: ApiResponse<any> = await response.json();
      throw new Error(result.message || 'Delete failed');
    }
  },

  async getDocumentContent(id: string): Promise<string> {
    const response = await apiFetch(`${API_URL}/app/project-documents/download/${id}`);
    if (!response.ok) {
      throw new Error('Không thể tải nội dung tài liệu');
    }
    return response.text();
  }
};
