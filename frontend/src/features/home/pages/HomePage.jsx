import { getPopularRecipes, getFeaturedRecipes } from '@/mock/recipes';
import { ROUTES } from '@/constants';
import Footer from '@/layouts/components/Footer';
import CollectionsPreview from '../components/CollectionsPreview';
import {
  HeroBanner,
  FeaturesGrid,
  RecipeSection,
  AIRecommendation,
  FaqSection,
} from '../components';

/**
 * Home. Assembles the full landing experience from reusable sections. All data
 * comes from mock sources — components stay presentational.
 */
export default function HomePage() {
  const popular = getPopularRecipes();
  const featured = getFeaturedRecipes();

  return (
    <div className="space-y-12 pb-4">
      <HeroBanner />
      <FeaturesGrid />
      <RecipeSection title="Popular Recipes" recipes={popular} viewAllTo={ROUTES.RECIPES} />
      <RecipeSection title="Featured Recipes" recipes={featured} viewAllTo={ROUTES.RECIPES} />
      <AIRecommendation />
      <CollectionsPreview />
      <FaqSection />
      <Footer />
    </div>
  );
}