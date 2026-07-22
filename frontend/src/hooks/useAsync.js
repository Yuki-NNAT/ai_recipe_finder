import { useCallback, useEffect, useState } from 'react';

/**
 * Generic async-data hook: runs an async function, tracks loading/error and
 * exposes a refetch. Keeps data-fetching pages free of repetitive boilerplate.
 */
export function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(asyncFn, deps);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setData(await run());
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [run]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading: status === 'loading', isError: status === 'error', refetch: load };
}

export default useAsync;
