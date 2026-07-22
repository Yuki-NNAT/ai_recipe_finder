import { useCallback, useEffect, useState } from 'react';

/**
 * Persistent state backed by localStorage. Same API as useState, plus it
 * syncs across tabs. All persisted app state routes through here.
 */
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [stored, setStored] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* storage full or unavailable — keep in-memory value */
        }
        return next;
      });
    },
    [key],
  );

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key) setStored(readValue());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, readValue]);

  return [stored, setValue];
}

export default useLocalStorage;
