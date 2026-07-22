import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

/**
 * Text field with label, helper/error text and optional icon slots.
 * forwardRef so it registers cleanly with React Hook Form.
 */
const Input = forwardRef(function Input(
  { label, error, hint, leftIcon, rightIcon, className, id, containerClassName, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'h-12 w-full rounded-2xl bg-white text-sm text-ink placeholder:text-muted/70',
            'border transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-4 focus:ring-primary/15',
            leftIcon ? 'pl-11' : 'pl-4',
            rightIcon ? 'pr-11' : 'pr-4',
            error
              ? 'border-danger focus:border-danger'
              : 'border-primary-100 focus:border-primary-400',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">{rightIcon}</span>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
});

export default Input;
