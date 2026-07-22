import { useEffect, useState } from 'react';
import { CollectionService } from '@/services/CollectionService';

/** Loads all collections for the listing page. */
export function useCollections() {
  const [collections, setCollections] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await CollectionService.listCollections();
        if (active) { setCollections(data); setStatus('success'); }
      } catch {
        if (active) setStatus('error');
      }
    })();
    return () => { active = false; };
  }, []);

  return {
    collections,
    isLoading: status === 'loading',
    isError: status === 'error',
  };
}
