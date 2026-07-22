/**
 * ShoppingListService — backend API (sync across devices):
 * GET    /shopping-list?skip=0&limit=100
 *   → { items: [{ item_id, recipe_id, ingredient_text, is_checked, ... }], total }
 * DELETE /shopping-list                        → clear all
 * POST   /shopping-list/items                 → { recipe_id, ingredient_text }
 * PATCH  /shopping-list/items/{item_id}       → { is_checked } or { ingredient_text, is_checked }
 * DELETE /shopping-list/items/{item_id}       → 204
 * POST   /shopping-list/recipes/{recipe_id}   → add ALL ingredients from recipe
 * DELETE /shopping-list/recipes/{recipe_id}   → remove all items from recipe
 * DELETE /shopping-list/checked               → remove checked items
 */
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';

const mock = {
  async list() { return { items:[], total:0 }; },
  async clearAll() { return null; },
  async addItem(recipeId, ingredientText) { return { item_id: Date.now(), recipe_id: recipeId, ingredient_text: ingredientText, is_checked: false }; },
  async updateItem(itemId, patch) { return { item_id: itemId, ...patch }; },
  async removeItem() { return null; },
  async addRecipe(recipeId) { return { added: true, recipe_id: recipeId }; },
  async removeRecipe() { return null; },
  async clearChecked() { return null; },
};

const real = {
  async list(skip=0, limit=100) {
    try { return await api.get('/shopping-list', { params: { skip, limit } }); }
    catch { return { items:[], total:0 }; }
  },
  async clearAll() {
    try { await api.delete('/shopping-list'); return null; } catch { return null; }
  },
  async addItem(recipeId=null, ingredientText) {
    return api.post('/shopping-list/items', { recipe_id: recipeId, ingredient_text: ingredientText });
  },
  async updateItem(itemId, patch) {
    return api.patch(`/shopping-list/items/${itemId}`, patch);
  },
  async removeItem(itemId) {
    try { await api.delete(`/shopping-list/items/${itemId}`); return null; } catch { return null; }
  },
  async addRecipe(recipeId) {
    return api.post(`/shopping-list/recipes/${recipeId}`);
  },
  async removeRecipe(recipeId) {
    try { await api.delete(`/shopping-list/recipes/${recipeId}`); return null; } catch { return null; }
  },
  async clearChecked() {
    try { await api.delete('/shopping-list/checked'); return null; } catch { return null; }
  },
};

export const ShoppingListService = USE_MOCK ? mock : real;
export default ShoppingListService;
