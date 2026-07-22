import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from './Button';

/**
 * Something went wrong. States what failed and offers a retry — never a bare
 * apology, per the app's voice.
 */
export default function ErrorState({
  title = 'We couldn’t load this',
  description = 'Something went wrong on our side. Try again in a moment.',
  onRetry,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}>
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10 text-danger">
        <AlertTriangle className="h-9 w-9" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-6" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
