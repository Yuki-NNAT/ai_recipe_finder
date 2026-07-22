import { createContext, useContext, useMemo } from 'react';
import { useShoppingList } from '@/features/shopping/hooks/useShoppingList';

const ShoppingListContext = createContext(null);

export function ShoppingListProvider({ children }) {
  const shopping = useShoppingList();
  const value = useMemo(() => shopping, [shopping]);
  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingListContext() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) throw new Error('useShoppingListContext must be inside ShoppingListProvider');
  return ctx;
}

export default ShoppingListContext;
