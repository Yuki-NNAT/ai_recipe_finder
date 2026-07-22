import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Card, Title, Loading, notify } from '@/ui';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { RatingService } from '@/services/RatingService';

function StarRow({ value = 0, onChange, size = 'h-6 w-6', interactive = false }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!interactive}
          onClick={() => interactive && onChange?.(n)}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          className={cn('transition-transform', interactive && 'hover:scale-110 cursor-pointer', !interactive && 'cursor-default')}
        >
          <Star className={cn(size, display >= n ? 'fill-warning text-warning' : 'text-primary-100')} />
        </button>
      ))}
    </div>
  );
}

export default function RecipeRating({ recipe }) {
  const { isAuthenticated } = useAuth();

  // Ensure we have a valid integer recipe ID before calling API
  const recipeId = recipe?.id ? String(parseInt(recipe.id, 10)) : null;
  const validId = recipeId && recipeId !== 'NaN' && recipeId !== '0';

  const [summary, setSummary] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!validId) return;
    setLoading(true);

    const loadData = async () => {
      try {
        // Load summary — silent fail (don't show toast on 422)
        const sum = await RatingService.getSummary(recipeId);
        if (sum) setSummary(sum);
      } catch { /* silent */ }

      if (isAuthenticated) {
        try {
          const mine = await RatingService.getMyRating(recipeId);
          if (mine) setMyRating(mine?.score ?? mine?.rating ?? 0);
        } catch { /* silent — user may not have rated yet */ }
      }

      setLoading(false);
    };

    loadData();
  }, [recipeId, isAuthenticated, validId]);

  const handleRate = async (n) => {
    if (!validId || !isAuthenticated || submitting) return;
    setSubmitting(true);
    try {
      await RatingService.upsert(recipeId, n);
      setMyRating(n);
      notify.success(`Đã đánh giá ${n} sao!`);
      // Refresh summary silently
      try {
        const sum = await RatingService.getSummary(recipeId);
        if (sum) setSummary(sum);
      } catch { /* silent */ }
    } catch (err) {
      // Show user-friendly message, not raw API error
      const msg = err?.status === 422
        ? 'Không thể đánh giá món này. Vui lòng thử lại.'
        : (err?.message ?? 'Đánh giá thất bại');
      notify.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!validId || submitting) return;
    setSubmitting(true);
    try {
      await RatingService.remove(recipeId);
      setMyRating(0);
      notify.info('Đã xoá đánh giá');
      try {
        const sum = await RatingService.getSummary(recipeId);
        if (sum) setSummary(sum);
      } catch { /* silent */ }
    } catch { notify.error('Không thể xoá đánh giá'); }
    finally { setSubmitting(false); }
  };

  const avg = summary?.average_rating ?? recipe?.rating ?? 0;
  const count = summary?.rating_count ?? summary?.count ?? recipe?.reviewsCount ?? 0;

  // Don't render if no valid ID
  if (!validId) return null;

  return (
    <Card className="space-y-5">
      <Title>Đánh giá</Title>

      {loading ? <Loading /> : (
        <>
          {/* Aggregate summary */}
          <div className="flex items-center gap-4 rounded-2xl bg-primary-50/60 px-5 py-4">
            <span className="font-display text-4xl font-bold text-ink">
              {avg > 0 ? avg.toFixed(1) : '—'}
            </span>
            <div>
              <StarRow value={Math.round(avg)} size="h-5 w-5" />
              <p className="mt-1 text-xs text-muted">
                {count > 0 ? `${count} đánh giá` : 'Chưa có đánh giá'}
              </p>
            </div>
          </div>

          {/* User rating */}
          {isAuthenticated ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-ink">
                {myRating > 0 ? 'Đánh giá của bạn' : 'Đánh giá công thức này'}
              </p>
              <StarRow
                value={myRating}
                onChange={handleRate}
                size="h-7 w-7"
                interactive={!submitting}
              />
              {myRating > 0 && (
                <button type="button" onClick={handleDelete}
                  disabled={submitting}
                  className="text-xs text-danger hover:underline disabled:opacity-50">
                  Xoá đánh giá
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">
              <a href="/login" className="font-medium text-primary-600 hover:underline">
                Đăng nhập
              </a>{' '}để đánh giá.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
