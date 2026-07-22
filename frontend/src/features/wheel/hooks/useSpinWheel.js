import { useCallback, useEffect, useState } from 'react';
import { CollectionService } from '@/services/CollectionService';
import { api } from '@/lib/api';
import { USE_MOCK } from '@/config/env';
import { toRecipeCard } from '@/services/adapters';
import { recipes as mockRecipes } from '@/mock/recipes';

const SPIN_DURATION = 3000; // ms

export function useSpinWheel() {
  const [collections, setCollections] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null); // null = Tất cả món
  const [recipes, setRecipes] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loadingRecipes | ready | spinning | done | error

  // 1. Tải danh sách Collections khi mount
  useEffect(() => {
    CollectionService.listCollections()
      .then((data) => setCollections(data || []))
      .catch(() => {});
  }, []);

  // 2. Hàm load danh sách công thức
  const fetchRecipes = useCallback(async (slug) => {
    setStatus('loadingRecipes');
    setWinner(null);

    try {
      if (slug) {
        // Tải công thức theo Collection
        const res = await CollectionService.getCollectionRecipes(slug, null, 50);
        const rawItems = res?.items ?? res?.recipes ?? res ?? [];
        const items = rawItems.map(toRecipeCard).filter(Boolean);
        setRecipes(items);
      } else {
        // Tải ngẫu nhiên (Tất cả)
        if (USE_MOCK) {
          setRecipes(mockRecipes.slice(0, 12));
        } else {
          const randomPage = Math.floor(Math.random() * 30) + 1;
          const data = await api.get('/recipes', { params: { page: randomPage, page_size: 20 } });
          const rawItems = data?.recipes ?? data?.items ?? data?.data ?? [];
          const items = rawItems.map(toRecipeCard).filter(Boolean);
          
          setRecipes(items.length > 0 ? items : mockRecipes.slice(0, 12));
        }
      }
      setStatus('ready');
    } catch (error) {
      console.error('SpinWheel error:', error);
      setRecipes(mockRecipes.slice(0, 12));
      setStatus('error');
    }
  }, []);

  // Tự động load lại khi đổi collection
  useEffect(() => {
    fetchRecipes(selectedSlug);
  }, [selectedSlug, fetchRecipes]);

  // 3. Hàm kích hoạt quay
  const spin = useCallback(() => {
    if (spinning || recipes.length === 0) return;
    setSpinning(true);
    setWinner(null);
    setStatus('spinning');

    // Chọn trước món trúng thưởng
    const picked = recipes[Math.floor(Math.random() * recipes.length)];

    setTimeout(() => {
      setWinner(picked);
      setSpinning(false);
      setStatus('done');
    }, SPIN_DURATION);
  }, [spinning, recipes]);

  const reset = () => {
    setWinner(null);
    setStatus(recipes.length > 0 ? 'ready' : 'idle');
  };

  const reload = () => {
    fetchRecipes(selectedSlug);
  };

  return {
    collections,
    selectedSlug,
    setSelectedSlug,
    recipes,
    spinning,
    winner,
    status,
    spin,
    reset,
    reload,
    SPIN_DURATION,
  };
}