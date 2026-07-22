import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';
import { respond } from './mockClient';

/**
 * AI semantic search — POST /search { ingredients: string[] }
 * → [{ recipe_id, name }] (top 10, xếp theo độ liên quan, hiểu tiếng Việt).
 */

const mock = {
  async byIngredients() {
    return respond(
      [
        { recipe_id: 101, name: 'Grilled chicken breast salad (mock)' },
        { recipe_id: 102, name: 'Lemongrass chili chicken (mock)' },
      ],
      600,
    );
  },
};

const real = {
  async byIngredients(ingredients) {
    const data = await api.post('/search', { ingredients }, { timeout: 30000 });
    return data.results ?? [];
  },
};

export const AiSearchService = USE_MOCK ? mock : real;
export default AiSearchService;
