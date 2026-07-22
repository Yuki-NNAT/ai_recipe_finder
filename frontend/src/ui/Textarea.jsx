import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

/** Multi-line field matching Input styling. forwardRef for RHF. */
const Textarea = forwardRef(function Textarea(
  { label, error, hint, rows = 4, className, id, containerClassName, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={!!error}
        className={cn(
          'w-full resize-y rounded-2xl bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70',
          'border transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-4 focus:ring-primary/15',
          error ? 'border-danger' : 'border-primary-100 focus:border-primary-400',
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
});

export default Textarea;
