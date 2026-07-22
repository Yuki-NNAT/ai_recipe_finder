/**
 * PersonalNotesService — REAL API (was localStorage before):
 * GET    /personal-notes/recipes/{recipe_id}  → { note_id, recipe_id, content, created_at, updated_at }
 * POST   /personal-notes/recipes/{recipe_id}  → body: { content }  (create)
 * PATCH  /personal-notes/recipes/{recipe_id}  → body: { content }  (update)
 * DELETE /personal-notes/recipes/{recipe_id}  → 204
 *
 * Rules:
 * - 1 user → 1 note per recipe
 * - POST 409 if already exists → use PATCH instead
 * - content: 1–5000 chars
 */
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';

// localStorage fallback for mock mode
const notesKey = (id) => `arf.notes.${id}`;

const mock = {
  async get(recipeId) {
    try {
      const raw = localStorage.getItem(notesKey(recipeId));
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  async create(recipeId, content) {
    const note = { note_id: `local-${Date.now()}`, recipe_id: recipeId, content, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    localStorage.setItem(notesKey(recipeId), JSON.stringify(note));
    return note;
  },
  async update(recipeId, content) {
    const existing = JSON.parse(localStorage.getItem(notesKey(recipeId)) || 'null');
    const note = { ...existing, content, updated_at: new Date().toISOString() };
    localStorage.setItem(notesKey(recipeId), JSON.stringify(note));
    return note;
  },
  async remove(recipeId) {
    localStorage.removeItem(notesKey(recipeId));
    return null;
  },
};

const real = {
  async get(recipeId) {
    try { return await api.get(`/personal-notes/recipes/${recipeId}`); }
    catch { return null; }
  },
  async create(recipeId, content) {
    return api.post(`/personal-notes/recipes/${recipeId}`, { content });
  },
  async update(recipeId, content) {
    return api.patch(`/personal-notes/recipes/${recipeId}`, { content });
  },
  async remove(recipeId) {
    try { await api.delete(`/personal-notes/recipes/${recipeId}`); return null; }
    catch { return null; }
  },
  /** Smart upsert: POST first, fallback to PATCH on 409 */
  async upsert(recipeId, content) {
    try {
      return await api.post(`/personal-notes/recipes/${recipeId}`, { content });
    } catch(err) {
      if (err?.status === 409) {
        return api.patch(`/personal-notes/recipes/${recipeId}`, { content });
      }
      throw err;
    }
  },
};

export const PersonalNotesService = USE_MOCK ? mock : real;
export default PersonalNotesService;
