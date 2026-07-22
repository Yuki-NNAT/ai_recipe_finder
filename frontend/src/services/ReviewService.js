/**
 * ReviewService — Ratings + Comments từ real API.
 * Endpoints (cần confirm với teammate):
 *   GET  /recipes/{id}/reviews
 *   POST /recipes/{id}/reviews   { rating, comment }
 *   PUT  /recipes/{id}/reviews/{review_id}
 *   DELETE /recipes/{id}/reviews/{review_id}
 */
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';
import mockReviewsData from '@/mock/reviews';

const mock = {
  async list(recipeId) { const all = mockReviewsData[String(recipeId)] ?? Object.values(mockReviewsData)[0] ?? []; return all.slice(0, 5); },
  async create(recipeId, { rating, comment }) {
    return { id: `local-${Date.now()}`, rating, comment, user: 'You', date: new Date().toISOString() };
  },
  async update(recipeId, reviewId, data) { return { id: reviewId, ...data }; },
  async remove(recipeId, reviewId) { return { success: true }; },
};

const real = {
  async list(recipeId) {
    try { return await api.get(`/recipes/${recipeId}/reviews`); } catch { return []; }
  },
  async create(recipeId, { rating, comment }) {
    return api.post(`/recipes/${recipeId}/reviews`, { rating, comment });
  },
  async update(recipeId, reviewId, data) {
    return api.put(`/recipes/${recipeId}/reviews/${reviewId}`, data);
  },
  async remove(recipeId, reviewId) {
    return api.delete(`/recipes/${recipeId}/reviews/${reviewId}`);
  },
};

export const ReviewService = USE_MOCK ? mock : real;
export default ReviewService;
