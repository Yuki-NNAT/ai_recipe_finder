/**
 * RecipeService — correct API contract:
 * GET /recipes?page=1&limit=20           → { page, limit, total, data: [...] }
 * GET /recipes/{id}                      → RecipeDetail
 * GET /recipes/random                    → RecipeDetail
 * GET /recipes/random?collection=slug   → RecipeDetail (singular "collection")
 * GET /recipes/collections               → [ { slug, title, description } ]
 * GET /recipes/collections/{slug}?cursor=&limit=20 → { collection, data, has_more, next_cursor }
 */
import { recipes as mockRecipes, getRecipeById } from '@/mock/recipes';
import { respond } from './mockClient';
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';
import { toRecipeCard, toRecipeDetail } from './adapters';

const PAGE_LIMIT = 20;

const SORT_FNS = {
  default:          null,
  popular:          (a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0),
  'highest-rated':  (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  rating:           (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  'fewest-calories':(a, b) => (a.calories ?? 9999) - (b.calories ?? 9999),
  'most-calories':  (a, b) => (b.calories ?? 0) - (a.calories ?? 0),
};

// ── Mock mode ─────────────────────────────────────────────────────────────────
const mock = {
  async list({ q='', category='all', sort='default', page=1, pageSize=PAGE_LIMIT }={}) {
    let items = [...mockRecipes];
    if (category && category !== 'all') {
      const cat = category.toLowerCase();
      items = items.filter(r =>
        (r.category??'').toLowerCase()===cat ||
        (r.tags??[]).some(t=>t.toLowerCase()===cat)
      );
    }
    if (q) {
      const lq = q.toLowerCase();
      items = items.filter(r =>
        (r.title??'').toLowerCase().includes(lq) ||
        (r.tags??[]).some(t=>t.toLowerCase().includes(lq))
      );
    }
    const sortFn = SORT_FNS[sort];
    if (sortFn) items = [...items].sort(sortFn);
    const total = items.length;
    const start = (page-1)*pageSize;
    return respond({ items: items.slice(start,start+pageSize), total, page, pageSize, totalPages: Math.ceil(total/pageSize)||1 }, 400);
  },
  async getById(id) { return respond(getRecipeById(id), 300); },
  async getReviews() { return []; },
  async getSimilar(id, limit=4) {
    const r = getRecipeById(id);
    return respond(mockRecipes.filter(x=>x.id!==r?.id).slice(0,limit), 300);
  },
};

// ── Page cache ────────────────────────────────────────────────────────────────
const _cache = new Map();
const CACHE_TTL = 3*60*1000;

async function fetchPage(q, page, limit) {
  const key = `${q}|${page}|${limit}`;
  const hit = _cache.get(key);
  if (hit && Date.now() < hit.expires) return hit;

  // API response: { page, limit, total, data: [{ recipe_id, name, tags, ... }] }
  const data = await api.get('/recipes', { params: { q: q||undefined, page, limit } });
  const rawItems = data?.data ?? data?.recipes ?? data?.items ?? [];
  const result = {
    items: rawItems.map(toRecipeCard).filter(r=>r&&r.id&&r.title),
    total: data?.total ?? 0,
    totalPages: Math.ceil((data?.total??0)/limit) || 1,
    expires: Date.now() + CACHE_TTL,
  };
  _cache.set(key, result);
  return result;
}

const real = {
  async list({ q='', category='all', sort='default', page=1, pageSize=PAGE_LIMIT }={}) {
    try {
      const fetched = await fetchPage(q, page, pageSize);
      let items = [...fetched.items];

      // Client-side category filter (API doesn't support)
      if (category && category !== 'all') {
        const cat = category.toLowerCase();
        items = items.filter(r =>
          (r.category??'').toLowerCase()===cat ||
          (r.tags??[]).some(t=>t.toLowerCase()===cat) ||
          (r.tag??'').toLowerCase()===cat
        );
      }

      // Client-side sort
      const sortFn = SORT_FNS[sort];
      if (sortFn) items = [...items].sort(sortFn);

      const total = category==='all' ? fetched.total : items.length;
      return {
        items,
        total,
        page,
        pageSize,
        totalPages: category==='all' ? fetched.totalPages : Math.ceil(items.length/pageSize)||1,
      };
    } catch(err) {
      console.error('[RecipeService.list]', err?.message);
      return { items:[], total:0, page:1, pageSize, totalPages:1 };
    }
  },

  async getById(id) {
    try {
      const data = await api.get(`/recipes/${id}`);
      return toRecipeDetail(data);
    } catch(err) {
      console.error('[RecipeService.getById]', id, err?.message);
      return null;
    }
  },

  async getReviews() { return []; },

  async getSimilar(id, limit=4) {
    try {
      const data = await api.get('/recipes', { params: { page:1, limit: limit+5 } });
      const items = (data?.data ?? data?.items ?? []).map(toRecipeCard).filter(Boolean);
      return items.filter(r=>r.id!==String(id)).slice(0,limit);
    } catch { return []; }
  },

  async getByIds(ids) {
    if (!ids?.length) return [];
    const results = await Promise.allSettled(
      ids.map(id => api.get(`/recipes/${id}`).then(toRecipeDetail).catch(()=>null))
    );
    return results.filter(r=>r.status==='fulfilled'&&r.value).map(r=>r.value);
  },
};

export const RecipeService = USE_MOCK ? mock : real;

export async function getRecipesByIds(ids) {
  if (!ids?.length) return [];
  if (USE_MOCK) return ids.map(id=>{ const r=getRecipeById(id); return r?toRecipeCard(r):null; }).filter(Boolean);
  return real.getByIds(ids);
}

export default RecipeService;
