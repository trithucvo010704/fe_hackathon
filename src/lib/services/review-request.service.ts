import { fetchData } from '../api';
import { ReviewRequest } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const reviewRequestService = {
  async getReviewRequestsByEpic(epicKey: string): Promise<ReviewRequest[]> {
    return fetchData<ReviewRequest[]>(`${API_URL}/app/review-requests/epic/${epicKey}`);
  },
  async getReviewRequestsByStory(storyKey: string): Promise<ReviewRequest[]> {
    return fetchData<ReviewRequest[]>(`${API_URL}/app/review-requests/story/${storyKey}`);
  },
  async createReviewRequest(data: {
    refKey: string;
    refType: 'EPIC' | 'STORY';
    reviewer: string;
    comment?: string;
  }): Promise<ReviewRequest> {
    return fetchData<ReviewRequest>(`${API_URL}/app/review-requests`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  async deleteReviewRequest(id: string): Promise<string> {
    return fetchData<string>(`${API_URL}/app/review-requests/${id}`, {
      method: 'DELETE'
    });
  },
};
