import { useCallback, useEffect, useState } from 'react';
import { CollectionService } from '@/services/CollectionService';

const PAGE_LIMIT = 12;

/**
 * Cursor-based pagination for a single collection.
 * Appends items on each "Load more" — never resets the list mid-scroll.
 */
export function useCollectionRecipes(slug) {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('loading');
  const [initialLoaded, setInitialLoaded] = useState(false);

  const load = useCallback(async (cursor = null) => {
    if (!slug) return;
    setStatus(cursor ? 'loadingMore' : 'loading');
    try {
      const data = await CollectionService.getCollectionRecipes(slug, cursor, PAGE_LIMIT);
      setItems((prev) =>
        cursor ? [...prev, ...(data.items ?? [])] : (data.items ?? []),
      );
      setNextCursor(data.next_cursor ?? null);
      setTotal(data.total ?? 0);
      setStatus('success');
      setInitialLoaded(true);
    } catch {
      setStatus('error');
    }
  }, [slug]);

  useEffect(() => { load(null); }, [load]);

  return {
    items,
    total,
    hasMore: !!nextCursor,
    isLoading: status === 'loading',
    isLoadingMore: status === 'loadingMore',
    isError: status === 'error',
    isEmpty: initialLoaded && items.length === 0,
    loadMore: () => { if (nextCursor && status === 'success') load(nextCursor); },
    refetch: () => load(null),
  };
}
