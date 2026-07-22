import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Breadcrumb, Display, Muted, Button, EmptyState, Loading, RecipeCard } from '@/ui';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useFavorite } from '@/hooks/useFavorite';
import { useLang } from '@/i18n/LanguageContext';
import { getRecipesByIds } from '@/services/RecipeService';

export default function FavoritesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { ids = [] } = useFavorite();
  const { lang, t } = useLang();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setRecipes([]);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getRecipesByIds(ids)
      .then((data) => {
        if (isMounted) setRecipes(data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch favorite recipes:', err);
        if (isMounted) setRecipes([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ids.join(',')]);

  if (authLoading) return <Loading label={t('loading') || 'Loading...'} />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;

  const count = recipes.length;
  const countLabel =
    count === 0
      ? lang === 'vi' ? '0 công thức đã lưu' : '0 recipes saved'
      : lang === 'vi'
      ? `${count} công thức đã lưu`
      : `${count} recipe${count > 1 ? 's' : ''} saved`;

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: lang === 'vi' ? 'Trang chủ' : 'Home', to: ROUTES.HOME },
          { label: lang === 'vi' ? 'Yêu thích' : 'Favorites' },
        ]}
      />

      <div>
        <Display className="text-3xl sm:text-4xl">
          {lang === 'vi' ? (
            <>
              Yêu thích <span className="text-gradient">của bạn</span>
            </>
          ) : (
            <>
              Your <span className="text-gradient">Favorites</span>
            </>
          )}
        </Display>
        <Muted className="mt-2">{countLabel}</Muted>
      </div>

      {/* Loading state */}
      {loading && <Loading label={lang === 'vi' ? 'Đang tải danh sách...' : 'Loading favorites...'} />}

      {/* Empty state: Không có ID nào trong danh sách yêu thích */}
      {!loading && ids.length === 0 && (
        <EmptyState
          icon={<Heart className="h-9 w-9 text-rose-500" />}
          title={lang === 'vi' ? 'Bạn chưa có món yêu thích nào' : 'No favorites yet'}
          description={
            lang === 'vi'
              ? 'Nhấn ❤️ trên bất kỳ công thức nào để lưu vào đây.'
              : 'Tap ❤️ on any recipe to save it here.'
          }
          action={
            <Button as={Link} to={ROUTES.RECIPES} size="sm">
              {lang === 'vi' ? 'Khám phá công thức' : 'Browse recipes'}
            </Button>
          }
        />
      )}

      {/* Recipe Grid: Đã tải xong và có danh sách công thức */}
      {!loading && recipes.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Trường hợp đặc biệt: Có IDs lưu trong localStorage/Database nhưng không fetch được công thức tương ứng */}
      {!loading && ids.length > 0 && recipes.length === 0 && (
        <div className="space-y-4 rounded-3xl bg-primary-50/40 p-8 text-center">
          <p className="text-sm text-muted">
            {lang === 'vi'
              ? 'Không thể hiển thị các công thức đã lưu (có thể công thức đã bị xóa hoặc lỗi kết nối).'
              : 'Unable to display saved recipes (they may have been removed or connection failed).'}
          </p>
          <Button as={Link} to={ROUTES.RECIPES} size="sm" variant="soft">
            {lang === 'vi' ? 'Khám phá công thức khác' : 'Browse other recipes'}
          </Button>
        </div>
      )}
    </div>
  );
}