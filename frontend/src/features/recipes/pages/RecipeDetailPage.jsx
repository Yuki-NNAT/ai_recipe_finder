import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Breadcrumb, ErrorState, Button, Skeleton } from '@/ui';
import { ROUTES } from '@/constants';
import { useRecipe } from '../hooks/useRecipe';
import CookingMode from '@/features/cooking/components/CookingMode';
import AddToShoppingListButton from '@/features/shopping/components/AddToShoppingListButton';
import {
  RecipeHeader,
  IngredientsList,
  InstructionsList,
  NutritionPanel,
  ReviewsList,
  SimilarRecipes,
} from '../components';
import RecipeRating from '../components/RecipeRating';
import RecipeComments from '../components/RecipeComments';
import PrivateNotes from '../components/PrivateNotes';

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-72 w-full rounded-3xl" />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

/** Full recipe detail view. */
export default function RecipeDetailPage() {
  const { id } = useParams();
  const { recipe, reviews, similar, isLoading, isError, refetch } = useRecipe(id);
  const [cookingMode, setCookingMode] = useState(false);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !recipe) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Recipe not found"
          description="This recipe may have been moved or removed."
          onRetry={refetch}
        />
        <div className="flex justify-center">
          <Button as={Link} to={ROUTES.RECIPES} variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cooking mode overlay */}
      {cookingMode && (
        <div className="fixed inset-0 z-50 bg-canvas">
          <CookingMode recipe={recipe} onClose={() => setCookingMode(false)} />
        </div>
      )}

      <div className="space-y-10">
        <Breadcrumb
          items={[
            { label: 'Home', to: ROUTES.HOME },
            { label: 'Recipes', to: ROUTES.RECIPES },
            { label: recipe.title },
          ]}
        />

        <RecipeHeader recipe={recipe} onStartCooking={() => setCookingMode(true)} />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <InstructionsList instructions={recipe.instructions} />
            <RecipeComments recipeId={String(recipe.id)} />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <IngredientsList ingredients={recipe.ingredients} servings={recipe.servings} />
            <RecipeRating recipe={recipe} />
            
            {/* Truyền toàn bộ object recipe vào NutritionPanel */}
            <NutritionPanel recipe={recipe} />
            
            <PrivateNotes recipeId={String(recipe.id)} />

            {/* Start cooking card */}
            <div className="rounded-3xl gradient-primary p-6 text-white">
              <Sparkles className="h-7 w-7" />
              <h3 className="mt-3 font-display text-lg font-semibold">Ready to cook?</h3>
              <p className="mt-1 text-sm text-white/85">
                Follow step-by-step instructions with your ingredient checklist.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-primary-600"
                  onClick={() => setCookingMode(true)}
                >
                  Start cooking
                </Button>
                <AddToShoppingListButton recipe={recipe} size="sm" />
              </div>
            </div>

            {/* AI helper card */}
            <div className="rounded-3xl bg-primary-50 p-6">
              <Sparkles className="h-7 w-7 text-primary-500" />
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">Cooking questions?</h3>
              <p className="mt-1 text-sm text-muted">
                Ask the AI to swap ingredients, scale servings or adjust for your diet.
              </p>
              <Button
                as={Link}
                to={ROUTES.CHAT}
                variant="soft"
                size="sm"
                className="mt-4"
              >
                Ask the assistant
              </Button>
            </div>
          </aside>
        </div>

        <SimilarRecipes recipes={similar} />
      </div>
    </>
  );
}