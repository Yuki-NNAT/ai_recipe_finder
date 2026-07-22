/**
 * FavoriteService — correct contract:
 * GET    /favorites?page=1&limit=20
 *   → { page, limit, total, data: [{ recipe_id, created_at, recipe: { recipe_id, name } }] }
 * POST   /favorites/{recipe_id}   → 201 Created
 * DELETE /favorites/{recipe_id}   → 204 No Content (no JSON!)
 */
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';

const mock = {
  async list() { return []; },
  async add(recipeId) { return { recipe_id: recipeId }; },
  async remove() { return null; },
};

const real = {
  async list(page=1, limit=20) {
    try {
      const data = await api.get('/favorites', { params: { page, limit } });
      // Response: { page, limit, total, data: [{ recipe_id, recipe: { recipe_id, name } }] }
      const items = data?.data ?? data?.items ?? [];
      return items.map(item => String(item.recipe_id ?? item.recipe?.recipe_id ?? item.id ?? ''))
                  .filter(Boolean);
    } catch { return []; }
  },
  async add(recipeId) {
    // POST returns 201 — no body needed
    return api.post(`/favorites/${recipeId}`);
  },
  async remove(recipeId) {
    // DELETE returns 204 No Content — DO NOT parse JSON
    try { await api.delete(`/favorites/${recipeId}`); return null; }
    catch { return null; }
  },
};

export const FavoriteService = USE_MOCK ? mock : real;
export default FavoriteService;
