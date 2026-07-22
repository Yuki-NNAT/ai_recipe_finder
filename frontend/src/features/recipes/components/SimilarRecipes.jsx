import { RecipeCard, SectionHeading } from '@/ui';
import { useFavorite } from '@/hooks/useFavorite';

/** "You might also like" — related recipes reusing the shared RecipeCard. */
export default function SimilarRecipes({ recipes = [] }) {
  const { isFavorite, toggle } = useFavorite();
  if (!recipes.length) return null;

  return (
    <section className="space-y-5">
      <SectionHeading title="You might also like" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={isFavorite(recipe.id)}
            onToggleFavorite={toggle}
          />
        ))}
      </div>
    </section>
  );
}
