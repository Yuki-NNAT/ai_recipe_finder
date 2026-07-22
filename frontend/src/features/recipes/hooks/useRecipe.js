import { useCallback, useEffect, useState } from 'react';
import { RecipeService } from '@/services/RecipeService';

/**
 * Loads a single recipe plus its reviews and similar recipes. Consolidates the
 * three related requests behind one loading/error surface for the detail page.
 */
export function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    if (!id) return;
    setStatus('loading');
    try {
      const [r, rv, sim] = await Promise.all([
        RecipeService.getById(id),
        RecipeService.getReviews(id),
        RecipeService.getSimilar(id),
      ]);
      setRecipe(r);
      setReviews(rv);
      setSimilar(sim);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    recipe,
    reviews,
    similar,
    isLoading: status === 'loading',
    isError: status === 'error',
    refetch: load,
  };
}

export default useRecipe;
