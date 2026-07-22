import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const VARIANTS = {
  soft: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
  ghost: 'bg-transparent text-muted hover:bg-primary-50 hover:text-primary-600',
  glass: 'glass text-ink hover:text-primary-600',
  solid: 'gradient-primary text-white shadow-soft-sm hover:shadow-soft',
};

const SIZES = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-12 w-12',
};

/** Square, icon-only action. `label` is required for screen readers. */
const IconButton = forwardRef(function IconButton(
  { variant = 'ghost', size = 'md', className, label, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        'transition-all duration-200 ease-out active:scale-95',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default IconButton;
