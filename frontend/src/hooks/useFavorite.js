import { useFavoritesContext } from '@/contexts/FavoritesContext';

/**
 * Public favorites hook.
 * @returns {{ ids: string[], count: number, isFavorite: (id:string)=>boolean, toggle: (id:string)=>void }}
 */
export function useFavorite() {
  return useFavoritesContext();
}

export default useFavorite;
