import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { Card, Title, Avatar, Button, Textarea, notify } from '@/ui';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';
import { currentUser } from '@/mock/users';

function Stars({ value, size = 'h-4 w-4' }) {
  return (
    <span className="inline-flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn(size, i < value ? 'fill-warning text-warning' : 'text-primary-100')} />
      ))}
    </span>
  );
}

/** Interactive star picker for the review form. */
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star className={cn('h-6 w-6', (hover || value) >= n ? 'fill-warning text-warning' : 'text-primary-200')} />
        </button>
      ))}
    </div>
  );
}

/**
 * Reviews block: average summary, an add-review form (React Hook Form) and the
 * list itself. New reviews are prepended optimistically for a responsive feel.
 */
export default function ReviewsList({ reviews: initial = [] }) {
  const [reviews, setReviews] = useState(initial);
  const [rating, setRating] = useState(5);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const average =
    reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  const onSubmit = ({ comment }) => {
    const review = {
      id: `local-${Date.now()}`,
      user: currentUser.name,
      avatar: currentUser.avatar,
      rating,
      date: new Date().toISOString(),
      comment,
    };
    setReviews((prev) => [review, ...prev]);
    reset();
    setRating(5);
    notify.success('Thanks for your review!');
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <Title>Reviews</Title>
        <div className="flex items-center gap-2">
          <Stars value={Math.round(average)} />
          <span className="text-sm font-semibold text-ink">{average}</span>
          <span className="text-sm text-muted">({reviews.length})</span>
        </div>
      </div>

      {/* Add review */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-2xl bg-primary-50/50 p-4">
        <StarPicker value={rating} onChange={setRating} />
        <Textarea
          rows={3}
          placeholder="Share your experience with this recipe…"
          error={errors.comment?.message}
          {...register('comment', {
            required: 'Please write a few words',
            minLength: { value: 4, message: 'A little more detail, please' },
          })}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" loading={isSubmitting}>
            Post review
          </Button>
        </div>
      </form>

      {/* List */}
      <ul className="space-y-5">
        {reviews.map((r) => (
          <li key={r.id} className="flex gap-3 border-t border-primary-100/70 pt-5 first:border-0 first:pt-0">
            <Avatar src={r.avatar} name={r.user} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink">{r.user}</p>
                <span className="text-xs text-muted">{formatDate(r.date)}</span>
              </div>
              <Stars value={r.rating} size="h-3.5 w-3.5" />
              <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{r.comment}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
