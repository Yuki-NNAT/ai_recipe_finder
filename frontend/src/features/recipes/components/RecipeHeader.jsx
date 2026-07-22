import { Heart, Star, Clock, Flame, Users, ChefHat, Play, ShoppingCart, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Chip } from '@/ui';
import { cn } from '@/utils/cn';
import { formatDuration } from '@/utils/format';
import { useFavorite } from '@/hooks/useFavorite';
import { useAuth } from '@/hooks/useAuth';
import { useShoppingListContext } from '@/contexts/ShoppingListContext';
import { notify } from '@/ui';
import CopyLinkButton from './CopyLinkButton';
import { ROUTES } from '@/constants';

function Meta({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-white/70 px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-ink">{value}</p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}

export default function RecipeHeader({ recipe, onStartCooking }) {
  const { isFavorite, toggle } = useFavorite();
  const { isAuthenticated } = useAuth();
  const { addRecipe, removeRecipe, hasRecipe } = useShoppingListContext();
  const saved = isFavorite(recipe.id);
  const inCart = hasRecipe(recipe.id);

  const handleSave = () => {
    if (!isAuthenticated) { notify.error('Vui lòng đăng nhập để lưu công thức'); return; }
    toggle(recipe.id);
    notify.success(saved ? 'Đã bỏ khỏi yêu thích' : 'Đã lưu vào yêu thích');
  };

  const handleCart = () => {
    if (inCart) { removeRecipe(String(recipe.id)); notify.info('Đã xoá khỏi danh sách'); }
    else { addRecipe(recipe); notify.success('Đã thêm vào danh sách!'); }
  };

  const hasImage = recipe.image && !recipe.image.includes('unsplash.com');
  const tags = recipe.tags ?? [];

  return (
    <section className={cn(
      'rounded-3xl bg-hero-glow p-5 sm:p-7',
      hasImage ? 'grid gap-6 lg:grid-cols-2 lg:gap-8' : ''
    )}>
      {/* Image — only if real */}
      {hasImage && (
        <div className="relative overflow-hidden rounded-3xl">
          <img src={recipe.image} alt={recipe.title}
            className="h-full min-h-64 w-full object-cover"
            onError={(e) => { e.target.parentElement.style.display='none'; }} />
        </div>
      )}

      {/* Info */}
      <div className="flex flex-col">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 6).map(tag => (
              <Chip key={tag} className="pointer-events-none text-xs">{tag}</Chip>
            ))}
          </div>
        )}

        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="mt-3 text-sm leading-relaxed text-ink/70">{recipe.description}</p>
        )}

        {/* Meta grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {recipe.servings != null && <Meta icon={Users} label="Servings" value={recipe.servings} />}
          {recipe.calories != null && <Meta icon={Flame} label="Calories" value={`${recipe.calories} kcal`} />}
          {recipe.time != null && <Meta icon={Clock} label="Time" value={formatDuration(recipe.time)} />}
          {recipe.rating != null && (
            <div className="flex items-center gap-2.5 rounded-2xl bg-white/70 px-4 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10 text-warning">
                <Star className="h-4 w-4 fill-warning" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{recipe.rating.toFixed?.(1) ?? recipe.rating}</p>
                <p className="text-xs text-muted">Rating</p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" leftIcon={<Play className="h-5 w-5" />} onClick={onStartCooking}>
            Start cooking
          </Button>

          {isAuthenticated ? (
            <Button size="lg" variant="secondary" onClick={handleSave}
              leftIcon={<Heart className={cn('h-5 w-5', saved && 'fill-primary-500 text-primary-500')} />}>
              {saved ? 'Saved' : 'Save recipe'}
            </Button>
          ) : (
            <Button as={Link} to={ROUTES.LOGIN} size="lg" variant="secondary"
              leftIcon={<Heart className="h-5 w-5" />}>
              Save recipe
            </Button>
          )}

          <Button size="lg" variant={inCart ? 'soft' : 'secondary'} onClick={handleCart}
            leftIcon={inCart ? <Check className="h-5 w-5 text-success" /> : <ShoppingCart className="h-5 w-5" />}>
            {inCart ? 'In list' : 'Add to list'}
          </Button>

          <CopyLinkButton size="lg" />
        </div>
      </div>
    </section>
  );
}
