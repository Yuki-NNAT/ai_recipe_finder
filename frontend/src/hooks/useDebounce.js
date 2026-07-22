import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of a value. Used to throttle search input before
 * hitting the (mock) API so we don't query on every keystroke.
 */
export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
