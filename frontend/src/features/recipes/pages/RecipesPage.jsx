import AiIngredientSearch from '@/features/recipes/components/AiIngredientSearch';
import { useSearchParams } from 'react-router-dom';
import { Pagination, Breadcrumb, Display, Muted } from '@/ui';
import { ROUTES } from '@/constants';
import { useLang } from '@/i18n/LanguageContext';
import { useRecipes } from '../hooks/useRecipes';
import RecipeFilters from '../components/RecipeFilters';
import RecipeGrid from '../components/RecipeGrid';

export default function RecipesPage() {
  const [searchParams] = useSearchParams();
  const { t, lang } = useLang();
  const {
    recipes, total, totalPages, isLoading, isError, isEmpty,
    query, setQuery, category, setCategory, sort, setSort, page, setPage, refetch,
  } = useRecipes({ category: searchParams.get('category') ?? 'all', sort: 'popular' });

  const clearFilters = () => { setQuery(''); setCategory('all'); setSort('default'); };

  const countLabel = () => {
    if (isLoading) return t('loading');
    const catName = category === 'all' ? '' : ` — ${category}`;
    if (query) return `${total} ${t('recipes_count')} "${query}"${catName}`;
    if (category !== 'all') return `${total} ${t('recipes_count')}${catName}`;
    return `${total} ${t('recipes_count')}`;
  };

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: t('home'), to: ROUTES.HOME }, { label: t('recipes') }]} />

      {/* Header gọn gàng */}
      <div className="flex flex-col gap-2">
        <Display className="text-3xl sm:text-4xl">
          {lang === 'vi' ? (
            <>Khám phá <span className="text-gradient">{t('recipes')}</span></>
          ) : (
            <>Explore <span className="text-gradient">{t('recipes')}</span></>
          )}
        </Display>
        <Muted>{countLabel()}</Muted>
      </div>

      {/* Bộ lọc Danh mục & Sắp xếp */}
      <RecipeFilters
        category={category}
        onCategoryChange={(cat) => { setCategory(cat); setPage(1); }}
        sort={sort}
        onSortChange={(s) => { setSort(s); setPage(1); }}
      />

      {/* AI Search hiển thị công khai cho TẤT CẢ người dùng */}
      <AiIngredientSearch />

      {/* Danh sách công thức */}
      <RecipeGrid
        recipes={recipes}
        isLoading={isLoading}
        isEmpty={isEmpty}
        isError={isError}
        onRetry={refetch}
        onClearFilters={clearFilters}
      />

      {/* Phân trang */}
      {!isLoading && !isEmpty && !isError && totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}