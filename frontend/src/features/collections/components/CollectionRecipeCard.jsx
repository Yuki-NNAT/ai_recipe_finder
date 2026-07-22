import { Link } from 'react-router-dom';
import { Flame, Heart } from 'lucide-react';
import { cn } from '@/utils/cn';
import { recipePath } from '@/constants';
import { useFavorite } from '@/hooks/useFavorite';
import { Badge } from '@/ui';

export default function CollectionRecipeCard({ recipe }) {
  const { id, title, tags = [], calories, ingredient_count } = recipe;
  const { isFavorite, toggle } = useFavorite();
  const saved = isFavorite(String(id));

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(String(id));
  };

  return (
    <Link
      to={recipePath(id)}
      className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-surface p-5 border border-primary-100/70 shadow-soft-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
    >
      <div className="space-y-3">
        {/* Header card: Tag & Heart button */}
        <div className="flex items-center justify-between gap-2">
          {tags[0] ? (
            <Badge tone="solid">{tags[0]}</Badge>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={handleFavorite}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-transform active:scale-90 hover:bg-primary-100"
          >
            <Heart className={cn('h-4 w-4', saved && 'fill-primary-500')} />
          </button>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 font-display text-base font-semibold text-ink group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
      </div>

      {/* Info footer */}
      <div className="mt-4 flex items-center gap-4 border-t border-primary-100/70 pt-3 text-xs text-muted">
        {calories != null && (
          <span className="inline-flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-primary-400" />
            {calories} kcal
          </span>
        )}
        {ingredient_count != null && (
          <span className="inline-flex items-center gap-1.5">
            🥄 {ingredient_count} ingredients
          </span>
        )}
      </div>
    </Link>
  );
}