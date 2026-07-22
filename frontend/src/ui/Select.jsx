import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Native select styled to match the UI kit. Native keeps mobile UX and a11y
 * solid without reimplementing a listbox.
 */
const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, className, id, containerClassName, children, ...props },
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
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={!!error}
          className={cn(
            'h-12 w-full appearance-none rounded-2xl bg-white pl-4 pr-11 text-sm text-ink',
            'border transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-4 focus:ring-primary/15',
            error ? 'border-danger' : 'border-primary-100 focus:border-primary-400',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
});

export default Select;
