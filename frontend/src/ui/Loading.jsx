import { cn } from '@/utils/cn';

/** Brand spinner + optional full-area centered state. */
export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-[3px]', lg: 'h-12 w-12 border-4' };
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-primary-100 border-t-primary-500',
        sizes[size],
        className,
      )}
    />
  );
}

export default function Loading({ label = 'Loading…', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16', className)}>
      <Spinner size="lg" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
