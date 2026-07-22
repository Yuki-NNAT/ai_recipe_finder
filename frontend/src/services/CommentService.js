/**
 * CommentService — correct contract:
 * GET   /recipes/{id}/comments?skip=0&limit=20
 *   → { items: [{ comment_id, recipe_id, username, content, created_at, updated_at, is_owner }], total, skip, limit }
 * POST  /recipes/{id}/comments   body: { content }  (1–2000 chars)
 * PATCH /comments/{comment_id}   body: { content }
 * DELETE /comments/{comment_id}  → 204
 *
 * FE shows edit/delete only when comment.is_owner === true
 */
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';
import mockReviews from '@/mock/reviews';

const mock = {
  async list(recipeId) {
    const all = mockReviews[String(recipeId)] ?? [];
    return { items: all.map(r=>({...r, comment_id: r.id, username: r.user, content: r.comment, is_owner: false })), total: all.length };
  },
  async create(recipeId, content) {
    return { comment_id:`local-${Date.now()}`, content, created_at: new Date().toISOString(), is_owner: true };
  },
  async update(commentId, content) { return { comment_id: commentId, content }; },
  async remove() { return null; },
};

const real = {
  async list(recipeId, skip=0, limit=20) {
    try {
      const data = await api.get(`/recipes/${recipeId}/comments`, { params: { skip, limit } });
      return data; // { items, total, skip, limit }
    } catch { return { items:[], total:0 }; }
  },
  async create(recipeId, content) {
    return api.post(`/recipes/${recipeId}/comments`, { content });
  },
  async update(commentId, content) {
    return api.patch(`/comments/${commentId}`, { content });
  },
  async remove(commentId) {
    try { await api.delete(`/comments/${commentId}`); return null; }
    catch { return null; }
  },
};

export const CommentService = USE_MOCK ? mock : real;
export default CommentService;
