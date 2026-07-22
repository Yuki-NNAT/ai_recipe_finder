import { useLang } from '@/i18n/LanguageContext';
import { Search } from 'lucide-react';
import { RecipeCard, RecipeCardSkeleton, EmptyState, ErrorState, Button } from '@/ui';
import { useFavorite } from '@/hooks/useFavorite';

/**
 * Presentational recipe grid that owns its own loading / empty / error states,
 * so pages don't have to branch on status themselves.
 */
export default function RecipeGrid({ recipes, isLoading, isEmpty, isError, onRetry, onClearFilters }) {
  const { t } = useLang();
  const { isFavorite, toggle } = useFavorite();

  if (isError) return <ErrorState onRetry={onRetry} />;

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={<Search className="h-9 w-9" />}
        title={t("noRecipesFound")}
        description={t('tryDifferentSearch')}
        action={
          onClearFilters && (
            <Button variant="secondary" size="sm" onClick={onClearFilters}>
              {t('clearFilters')}
            </Button>
          )
        }
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
