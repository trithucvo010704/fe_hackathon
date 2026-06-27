import { fetchData } from '../api';
import { ReviewComment } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const reviewCommentService = {
  async getReviewCommentsByEpic(epicKey: string): Promise<ReviewComment[]> {
    return fetchData<ReviewComment[]>(`${API_URL}/app/review-comments/epic/${epicKey}`);
  },
  async getReviewCommentsByStory(storyKey: string): Promise<ReviewComment[]> {
    return fetchData<ReviewComment[]>(`${API_URL}/app/review-comments/story/${storyKey}`);
  }
};
