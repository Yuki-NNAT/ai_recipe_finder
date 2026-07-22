import { useLang } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { Heart, Flame, Clock, Star, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatDuration } from '@/utils/format';
import { recipePath } from '@/constants';
import { useFavorite } from '@/hooks/useFavorite';

/**
 * Recipe card — shows real image if available, otherwise a clean text-only card.
 * No placeholder/mock images.
 */
export default function RecipeCard({ recipe, className }) {
  const { t } = useLang();
  const { isFavorite, toggle } = useFavorite();
  const { id, title, image, rating, calories, time, tag, tags } = recipe;

  const displayTag = tag ?? tags?.[0] ?? null;
  const saved = isFavorite(id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  // Check if image is a real URL (not a placeholder)
  const hasRealImage = image &&
    !image.includes('unsplash.com') &&
    !image.includes('placeholder');

  return (
    <Link
      to={recipePath(id)}
      className={cn(
        'group block overflow-hidden rounded-3xl bg-surface border border-primary-100/70 shadow-soft-sm',
        'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-lg hover:border-primary-200',
        className,
      )}
    >
      {hasRealImage ? (
        /* Real image */
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            onError={(e) => { e.target.parentElement.style.display = 'none'; }}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <button type="button" onClick={handleFavorite} aria-pressed={saved}
            aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass-strong text-primary-500 transition-transform active:scale-90">
            <Heart className={cn('h-5 w-5', saved && 'fill-primary-500')} />
          </button>
        </div>
      ) : (
        /* No image — minimal top bar with favorite button */
        <div className="relative flex h-14 items-center justify-between bg-primary-50/60 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 text-primary-500">
            <UtensilsCrossed className="h-4 w-4" />
          </div>
          <button type="button" onClick={handleFavorite} aria-pressed={saved}
            className="flex h-8 w-8 items-center justify-center rounded-full text-primary-400 hover:text-primary-600 transition-colors">
            <Heart className={cn('h-4 w-4', saved && 'fill-primary-500 text-primary-500')} />
          </button>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <h3 className="line-clamp-2 font-display text-base font-semibold text-ink leading-snug">{title}</h3>

        {displayTag && (
          <span className="mt-1.5 inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600">
            {displayTag}
          </span>
        )}

        <div className="mt-3 flex items-center gap-4 border-t border-primary-50 pt-3 text-xs text-muted">
          {rating != null && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="font-medium text-ink">{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
            </span>
          )}
          {calories != null && (
            <span className="inline-flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-primary-400" />
              {calories} kcal
            </span>
          )}
          {time != null && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDuration(time)}
            </span>
          )}
          {!rating && !calories && !time && (
            <span className="text-xs text-muted/60">Recipe</span>
          )}
        </div>
      </div>
    </Link>
  );
}
