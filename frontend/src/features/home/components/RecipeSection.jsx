import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading, RecipeCard, Skeleton, Button, ErrorState } from '@/ui';
import { ROUTES } from '@/constants';
import { useLang } from '@/i18n/LanguageContext';
import { USE_MOCK } from '@/config/env';
import { api } from '@/lib/api';
import { recipes as mockRecipes } from '@/mock/recipes';
import { toRecipeCard } from '@/services/adapters';

function usePopularRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (USE_MOCK) {
      setTimeout(() => { setRecipes(mockRecipes.slice(0, 4)); setStatus('ok'); }, 400);
      return;
    }
    api.get('/recipes', { params: { sort: 'popular', page_size: 8 } })
      .then(data => {
        const items = data?.recipes ?? data?.items ?? [];
        setRecipes(items.map(toRecipeCard).slice(0, 8));
        setStatus('ok');
      })
      .catch(() => { setRecipes([]); setStatus('error'); });
  }, []);

  return { recipes, status };
}

export default function RecipeSection() {
  const { t } = useLang();
  const { recipes, status } = usePopularRecipes();

  if (status === 'error' || (status === 'ok' && recipes.length === 0)) {
    return null; // Xóa section nếu không lấy được data
  }

  return (
    <section className="space-y-5">
      <SectionHeading
        title={t('popularRecipesTitle')}
        action={
          <Button as={Link} to={ROUTES.RECIPES} variant="soft" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
            {t('viewAllRecipes')}
          </Button>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {status === 'loading'
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-3xl" />)
          : recipes.slice(0, 4).map(r => <RecipeCard key={r.id} recipe={r} />)
        }
      </div>
    </section>
  );
}
