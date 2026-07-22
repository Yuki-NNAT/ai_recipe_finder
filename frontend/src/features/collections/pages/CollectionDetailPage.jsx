import { useLang } from '@/i18n/LanguageContext';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
  Breadcrumb,
  Display,
  Muted,
  Loading,
  ErrorState,
  EmptyState,
  Button,
  RecipeCardSkeleton,
} from '@/ui';
import { ROUTES } from '@/constants';
import { useCollections } from '../hooks/useCollections';
import { useCollectionRecipes } from '../hooks/useCollectionRecipes';
import { CollectionRecipeCard } from '../components';

/**
 * /collections/:slug — paginated recipe grid for one collection.
 * Uses cursor-based "Load more" (next_cursor from the API).
 */
export default function CollectionDetailPage() {
  const { t } = useLang();
  const { slug } = useParams();
  const { collections } = useCollections();
  const collection = collections.find((c) => c.slug === slug);

  const {
    items,
    total,
    hasMore,
    isLoading,
    isLoadingMore,
    isError,
    isEmpty,
    loadMore,
    refetch,
  } = useCollectionRecipes(slug);

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: 'Home', to: ROUTES.HOME },
          { label: 'Collections', to: '/collections' },
          { label: collection?.title ?? slug },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Display className="text-3xl sm:text-4xl">
            {collection ? (
              <>
                {collection.title.split(' ')[0]}{' '}
                <span className="text-gradient">
                  {collection.title.split(' ').slice(1).join(' ')}
                </span>
              </>
            ) : (
              <span className="text-gradient capitalize">{slug?.replace(/-/g, ' ')}</span>
            )}
          </Display>
          {collection?.description && (
            <Muted className="mt-2 max-w-xl">{collection.description}</Muted>
          )}
          {!isLoading && total > 0 && (
            <Muted className="mt-1">{total} recipes</Muted>
          )}
        </div>
        <Button
          as={Link}
          to="/collections"
          variant="secondary"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          All collections
        </Button>
      </div>

      {/* States */}
      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <ErrorState onRetry={refetch} />}

      {isEmpty && (
        <EmptyState
          title="No recipes in this collection yet"
          description="Check back soon — we're adding new recipes regularly."
          action={
            <Button as={Link} to={ROUTES.RECIPES} size="sm">
              Browse all recipes
            </Button>
          }
        />
      )}

      {/* Recipe grid */}
      {!isLoading && !isError && items.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((recipe) => (
              <CollectionRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="secondary"
                size="lg"
                loading={isLoadingMore}
                onClick={loadMore}
                leftIcon={isLoadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              >
                {isLoadingMore ? 'Loading…' : 'Load more recipes'}
              </Button>
            </div>
          )}

          {!hasMore && items.length > 0 && (
            <p className="text-center text-sm text-muted">
              You've seen all {total} recipes in this collection.
            </p>
          )}
        </>
      )}
    </div>
  );
}