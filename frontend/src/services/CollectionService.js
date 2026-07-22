/**
 * CollectionService — correct contract:
 * GET /recipes/collections
 *   → [ { slug, title, description } ]
 * GET /recipes/collections/{slug}?cursor=&limit=20
 *   → { collection: { slug, title, description }, data: [...], has_more, next_cursor, limit }
 * GET /recipes/random
 * GET /recipes/random?collection=slug   ← singular "collection", NOT "collections"
 */
import { collections as mockCollections, getCollectionRecipes } from '@/mock/collections';
import { respond } from './mockClient';
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';
import { toRecipeCard } from './adapters';

const mock = {
  async listCollections() { return respond(mockCollections, 400); },
  async getCollectionRecipes(slug, cursor=null, limit=20) {
    return respond(getCollectionRecipes(slug, cursor, limit), 500);
  },
};

const real = {
  async listCollections() {
    try {
      const data = await api.get('/recipes/collections');
      // API returns array directly: [ { slug, title, description } ]
      const items = Array.isArray(data) ? data : (data?.collections ?? data?.data ?? []);
      return items.map(c => ({
        slug: c.slug,
        title: c.title ?? c.name,
        description: c.description ?? '',
        cover: null,
        recipe_count: null,
      }));
    } catch { return mockCollections; }
  },

  async getCollectionRecipes(slug, cursor=null, limit=20) {
    try {
      const params = { limit };
      if (cursor) params.cursor = cursor;
      const data = await api.get(`/recipes/collections/${slug}`, { params });
      // Response: { collection, data: [...], has_more, next_cursor, limit }
      const rawItems = data?.data ?? data?.items ?? [];
      return {
        slug,
        items: rawItems.map(toRecipeCard).filter(Boolean),
        next_cursor: data?.next_cursor ?? null,
        has_more: data?.has_more ?? false,
        total: data?.total ?? rawItems.length,
      };
    } catch { return { slug, items:[], next_cursor:null, has_more:false, total:0 }; }
  },

  async getRandom(collection=null) {
    try {
      const params = {};
      if (collection) params.collection = collection; // singular "collection"
      return await api.get('/recipes/random', { params });
    } catch { return null; }
  },
};

export const CollectionService = USE_MOCK ? mock : real;
export default CollectionService;
