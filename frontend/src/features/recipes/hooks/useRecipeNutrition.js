import { useEffect, useState } from 'react';
import { NutritionService } from '@/services/NutritionService';
import { USE_MOCK } from '@/config/env';

/**
 * Fetches aggregated nutrition for one recipe from the real API.
 * Falls back gracefully if the endpoint returns null or errors.
 *
 * API response shape (from backend):
 * {
 *   total_calories: 450,
 *   per_serving_calories: 225,
 *   breakdown: [{ ingredient: "...", calories: ..., fdc_id: ... }]
 * }
 */
export function useRecipeNutrition(recipeId, fallbackCalories = null) {
  const [nutrition, setNutrition] = useState(null);
  const [isLoading, setIsLoading] = useState(!USE_MOCK);

  useEffect(() => {
    if (USE_MOCK || !recipeId) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    NutritionService.getRecipeNutrition(recipeId)
      .then((data) => {
        if (!cancelled && data) setNutrition(data);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [recipeId]);

  // Derive display values
  const calories = nutrition?.per_serving_calories
    ?? nutrition?.total_calories
    ?? fallbackCalories;

  const breakdown = nutrition?.breakdown ?? null;

  return { nutrition, calories, breakdown, isLoading };
}
