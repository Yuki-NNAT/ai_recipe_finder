import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const STORAGE_KEY = 'arf.shopping';

/**
 * Shopping list custom hook.
 * Stores items grouped by recipe:
 * [{ recipeId, recipeName, recipeImage, items: [{ id, text, checked }] }]
 */
export function useShoppingList() {
  const [groups = [], setGroups] = useLocalStorage(STORAGE_KEY, []);

  // Đảm bảo safeGroups luôn là mảng để tránh crash
  const safeGroups = Array.isArray(groups) ? groups : [];

  /** Thêm toàn bộ nguyên liệu của một công thức vào danh sách */
  const addRecipe = useCallback(
    (recipe) => {
      if (!recipe) return;

      const rawIngredients =
        recipe.ingredients_raw ??
        (recipe.ingredients ?? []).map((ing) =>
          typeof ing === 'string'
            ? ing
            : `${ing.amount ?? ''} ${ing.unit ?? ''} ${ing.name ?? ''}`.trim()
        );

      const newItems = rawIngredients.map((text, i) => ({
        id: `${recipe.id}-${i}-${Date.now()}`,
        text: String(text).trim(),
        checked: false,
      }));

      setGroups((prev = []) => {
        const currentGroups = Array.isArray(prev) ? prev : [];
        const exists = currentGroups.find((g) => g.recipeId === String(recipe.id));

        if (exists) {
          // Tránh trùng lặp các nguyên liệu đã có sẵn trong món đó
          const existingTexts = new Set(exists.items.map((it) => it.text.toLowerCase()));
          const fresh = newItems.filter((it) => !existingTexts.has(it.text.toLowerCase()));
          
          if (!fresh.length) return currentGroups;

          return currentGroups.map((g) =>
            g.recipeId === String(recipe.id)
              ? { ...g, items: [...g.items, ...fresh] }
              : g
          );
        }

        return [
          ...currentGroups,
          {
            recipeId: String(recipe.id),
            recipeName: recipe.title ?? recipe.name ?? 'Recipe',
            recipeImage: recipe.image ?? null,
            items: newItems,
          },
        ];
      });
    },
    [setGroups]
  );

  /** Thêm 1 nguyên liệu lẻ (ví dụ người dùng tự nhập tay) vào nhóm Custom */
  const addItem = useCallback(
    (text) => {
      if (!text || !text.trim()) return;

      const newItem = {
        id: `custom-${Date.now()}`,
        text: text.trim(),
        checked: false,
      };

      setGroups((prev = []) => {
        const currentGroups = Array.isArray(prev) ? prev : [];
        const customGroup = currentGroups.find((g) => g.recipeId === 'custom');

        if (customGroup) {
          return currentGroups.map((g) =>
            g.recipeId === 'custom'
              ? { ...g, items: [...g.items, newItem] }
              : g
          );
        }

        return [
          ...currentGroups,
          {
            recipeId: 'custom',
            recipeName: 'Món mua thêm',
            recipeImage: null,
            items: [newItem],
          },
        ];
      });
    },
    [setGroups]
  );

  /** Bật/tắt trạng thái đã mua (checked) của 1 nguyên liệu */
  const toggleItem = useCallback(
    (recipeId, itemId) => {
      setGroups((prev = []) =>
        (Array.isArray(prev) ? prev : []).map((g) =>
          g.recipeId === String(recipeId)
            ? {
                ...g,
                items: g.items.map((it) =>
                  it.id === itemId ? { ...it, checked: !it.checked } : it
                ),
              }
            : g
        )
      );
    },
    [setGroups]
  );

  /** Bật/tắt chọn tất cả nguyên liệu trong 1 nhóm món ăn */
  const toggleGroup = useCallback(
    (recipeId, forceState) => {
      setGroups((prev = []) =>
        (Array.isArray(prev) ? prev : []).map((g) => {
          if (g.recipeId !== String(recipeId)) return g;
          const targetChecked =
            forceState !== undefined
              ? forceState
              : !g.items.every((it) => it.checked);
          return {
            ...g,
            items: g.items.map((it) => ({ ...it, checked: targetChecked })),
          };
        })
      );
    },
    [setGroups]
  );

  /** Xóa 1 nguyên liệu khỏi nhóm */
  const removeItem = useCallback(
    (recipeId, itemId) => {
      setGroups((prev = []) =>
        (Array.isArray(prev) ? prev : [])
          .map((g) =>
            g.recipeId === String(recipeId)
              ? { ...g, items: g.items.filter((it) => it.id !== itemId) }
              : g
          )
          .filter((g) => g.items.length > 0)
      );
    },
    [setGroups]
  );

  /** Xóa toàn bộ nhóm công thức */
  const removeRecipe = useCallback(
    (recipeId) => {
      setGroups((prev = []) =>
        (Array.isArray(prev) ? prev : []).filter(
          (g) => g.recipeId !== String(recipeId)
        )
      );
    },
    [setGroups]
  );

  /** Xóa tất cả các nguyên liệu đã được tick chọn (đã mua) */
  const clearChecked = useCallback(() => {
    setGroups((prev = []) =>
      (Array.isArray(prev) ? prev : [])
        .map((g) => ({
          ...g,
          items: g.items.filter((it) => !it.checked),
        }))
        .filter((g) => g.items.length > 0)
    );
  }, [setGroups]);

  /** Xóa toàn bộ danh sách đi chợ */
  const clearAll = useCallback(() => {
    setGroups([]);
  }, [setGroups]);

  /** Kiểm tra xem công thức này đã có trong danh sách đi chợ chưa */
  const hasRecipe = useCallback(
    (recipeId) => safeGroups.some((g) => g.recipeId === String(recipeId)),
    [safeGroups]
  );

  /** Thống kê tổng số lượng nguyên liệu, số lượng đã mua & còn lại */
  const stats = useMemo(() => {
    const total = safeGroups.reduce((s, g) => s + g.items.length, 0);
    const checked = safeGroups.reduce(
      (s, g) => s + g.items.filter((it) => it.checked).length,
      0
    );
    return {
      total,
      checked,
      remaining: total - checked,
    };
  }, [safeGroups]);

  return {
    groups: safeGroups,
    stats,
    addRecipe,
    addItem,
    toggleItem,
    toggleGroup,
    removeItem,
    removeRecipe,
    clearChecked,
    clearAll,
    hasRecipe,
  };
}

export default useShoppingList;