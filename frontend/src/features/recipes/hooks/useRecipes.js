import { useCallback, useEffect, useState } from 'react';
import { RecipeService } from '@/services/RecipeService';
import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 8;

/**
 * Drives the recipe list page: search (debounced), category + sort filters and
 * pagination, all backed by RecipeService. Owns the async lifecycle so the page
 * stays declarative.
 */
export function useRecipes(initial = {}) {
  const [query, setQuery] = useState(initial.q ?? '');
  const [category, setCategory] = useState(initial.category ?? 'all');
  const [sort, setSort] = useState(initial.sort ?? 'popular');
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ items: [], total: 0, totalPages: 1 });
  const [status, setStatus] = useState('loading'); // loading | success | error

  const debouncedQuery = useDebounce(query, 350);

  const fetchRecipes = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await RecipeService.list({
        q: debouncedQuery,
        category,
        sort,
        page,
        pageSize: PAGE_SIZE,
      });
      setData(res);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [debouncedQuery, category, sort, page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Any filter change returns to page 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category, sort]);

  return {
    // data
    recipes: data.items,
    total: data.total,
    totalPages: data.totalPages,
    // status
    isLoading: status === 'loading',
    isError: status === 'error',
    isEmpty: status === 'success' && data.items.length === 0,
    // filters
    query,
    setQuery,
    category,
    setCategory,
    sort,
    setSort,
    page,
    setPage,
    refetch: fetchRecipes,
  };
}

export default useRecipes;
