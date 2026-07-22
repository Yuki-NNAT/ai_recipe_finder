import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';

/**
 * NutritionService
 *
 * getByFdcId(fdc_id)  → GET /nutrition/{fdc_id}
 *   Returns USDA nutrition info for one ingredient.
 *
 * getRecipeNutrition(recipe_id) → GET /recipes/{id}/nutrition
 *   Returns aggregated nutrition for a full recipe (calories + breakdown).
 */

const mock = {
  async getByFdcId(fdc_id) {
    // Return a plausible stub so UI renders while backend is wiring up.
    return {
      fdc_id,
      food_name: `Ingredient #${fdc_id}`,
      calories: null,
      data_type: 'mock',
    };
  },
  async getRecipeNutrition(recipe_id) {
    return null; // mock recipes already have nutrition baked in
  },
};

const real = {
  async getByFdcId(fdc_id) {
    try {
      return await api.get(`/nutrition/${fdc_id}`);
    } catch {
      return null;
    }
  },
  async getRecipeNutrition(recipe_id) {
    try {
      return await api.get(`/recipes/${recipe_id}/nutrition`);
    } catch {
      return null;
    }
  },
};

export const NutritionService = USE_MOCK ? mock : real;
export default NutritionService;
