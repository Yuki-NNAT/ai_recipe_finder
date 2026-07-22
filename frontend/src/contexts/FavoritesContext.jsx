import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { USE_MOCK } from '@/config/env';
import { FavoriteService } from '@/services/FavoriteService';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/constants';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [localIds, setLocalIds] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);
  const [apiIds, setApiIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (USE_MOCK) { setLoaded(true); return; }
    FavoriteService.list().then(ids => {
      setApiIds(Array.isArray(ids) ? ids : []);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const ids = USE_MOCK ? localIds : apiIds;
  const isFavorite = useCallback((id) => ids.includes(String(id)), [ids]);

  const toggle = useCallback(async (id) => {
    const sid = String(id);
    if (USE_MOCK) {
      setLocalIds(prev => prev.includes(sid) ? prev.filter(x=>x!==sid) : [...prev, sid]);
      return;
    }
    if (ids.includes(sid)) {
      await FavoriteService.remove(sid).catch(()=>{});
      setApiIds(prev => prev.filter(x=>x!==sid));
    } else {
      await FavoriteService.add(sid).catch(()=>{});
      setApiIds(prev => [...prev, sid]);
    }
  }, [ids, setLocalIds]);

  const value = useMemo(() => ({ ids, count: ids.length, isFavorite, toggle, loaded }),
    [ids, isFavorite, toggle, loaded]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorite must be inside FavoritesProvider');
  return ctx;
}

export default FavoritesContext;
