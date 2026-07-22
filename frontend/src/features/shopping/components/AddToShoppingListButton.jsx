import { ShoppingCart, Check } from 'lucide-react';
import { Button, notify } from '@/ui';
import { useShoppingListContext } from '@/contexts/ShoppingListContext';

/**
 * Smart button for the recipe detail page.
 * Adds the recipe's ingredients to the shopping list (or removes if already there).
 */
export default function AddToShoppingListButton({ recipe, size = 'lg' }) {
  const { addRecipe, removeRecipe, hasRecipe } = useShoppingListContext();
  const added = hasRecipe(recipe?.id);

  const handleClick = () => {
    if (added) {
      removeRecipe(String(recipe.id));
      notify.info('Removed from shopping list');
    } else {
      addRecipe(recipe);
      notify.success('Added to shopping list!');
    }
  };

  return (
    <Button
      size={size}
      variant={added ? 'soft' : 'secondary'}
      leftIcon={added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
      onClick={handleClick}
    >
      {added ? 'In shopping list' : 'Add to list'}
    </Button>
  );
}
