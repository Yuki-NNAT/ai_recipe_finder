import { cn } from '@/utils/cn';

/**
 * Shimmering placeholder. The shimmer sweep is defined once here so every
 * loading skeleton in the app moves at the same cadence.
 */
export default function Skeleton({ className, rounded = 'rounded-2xl' }) {
  return (
    <div className={cn('relative overflow-hidden bg-primary-50/80', rounded, className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

/** Recipe-card-shaped skeleton for grid loading states. */
export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-surface border border-primary-100/70 shadow-soft-sm">
      <Skeleton className="h-44 w-full" rounded="rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}
