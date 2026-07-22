import { Heart } from 'lucide-react';
import { RecipeCard, EmptyState, Button } from '@/ui';
import { useFavorite } from '@/hooks/useFavorite';

/**
 * Grid of recipes with a graceful empty state. Shared by the Favorites and
 * History tabs (and the Favorites page) — one grid, many collections.
 */
export default function RecipeCollection({ recipes = [], emptyTitle, emptyText, emptyAction }) {
  const { isFavorite, toggle } = useFavorite();

  if (!recipes.length) {
    return (
      <EmptyState
        icon={<Heart className="h-9 w-9" />}
        title={emptyTitle}
        description={emptyText}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={isFavorite(recipe.id)}
          onToggleFavorite={toggle}
        />
      ))}
    </div>
  );
}
