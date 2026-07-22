/**
 * RatingService — correct contract:
 * GET  /recipes/{id}/ratings     → { recipe_id, average_rating, rating_count }
 * GET  /recipes/{id}/ratings/me  → { rating, ... } | null
 * PUT  /recipes/{id}/ratings/me  → body: { "rating": 1-5 }  ← integer field name "rating"
 * DELETE /recipes/{id}/ratings/me → 204 No Content
 */
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';

const mock = {
  async getSummary() { return { average_rating: null, rating_count: 0 }; },
  async getMyRating() { return null; },
  async upsert(recipeId, value) { return { rating: parseInt(value,10) }; },
  async remove() { return null; },
};

const real = {
  async getSummary(recipeId) {
    try { return await api.get(`/recipes/${recipeId}/ratings`); }
    catch { return null; }
  },
  async getMyRating(recipeId) {
    try { return await api.get(`/recipes/${recipeId}/ratings/me`); }
    catch { return null; }
  },
  async upsert(recipeId, value) {
    // CRITICAL: field name is "rating" not "score" — 422 fix
    const rating = Math.max(1, Math.min(5, parseInt(value, 10)));
    return api.put(`/recipes/${recipeId}/ratings/me`, { rating });
  },
  async remove(recipeId) {
    // DELETE returns 204 No Content — axios interceptor returns res.data which is ""
    try { await api.delete(`/recipes/${recipeId}/ratings/me`); return null; }
    catch { return null; }
  },
};

export const RatingService = USE_MOCK ? mock : real;
export default RatingService;
