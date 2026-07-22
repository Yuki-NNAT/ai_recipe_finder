import { useMemo, useState } from 'react';

/**
 * Client-side pagination state + slicing helper. Given a total count and page
 * size, it exposes the current page, total pages and range helpers.
 */
export function usePagination({ total = 0, pageSize = 8, initialPage = 1 } = {}) {
  const [page, setPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  const range = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return { start, end: start + pageSize };
  }, [safePage, pageSize]);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const reset = () => setPage(1);

  /** Slice an array to the current page. */
  const paginate = (items) => items.slice(range.start, range.end);

  return { page: safePage, totalPages, goTo, reset, paginate, range };
}

export default usePagination;
