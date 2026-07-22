import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary:
    'gradient-primary text-white shadow-soft hover:shadow-soft-lg hover:brightness-105 active:brightness-95',
  secondary:
    'bg-white text-ink border border-primary-100 shadow-soft-sm hover:border-primary-200 hover:bg-primary-50',
  ghost: 'bg-transparent text-ink hover:bg-primary-50',
  soft: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
  outline: 'bg-transparent text-primary-600 border border-primary-200 hover:bg-primary-50',
  danger: 'bg-danger text-white shadow-soft hover:brightness-105 active:brightness-95',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-14 px-8 text-base gap-2.5',
};

/**
 * Primary interactive control. Every clickable call-to-action in the app
 * routes through this so tone, radius and motion stay consistent.
 */
const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'md',
    className,
    children,
    leftIcon,
    rightIcon,
    loading = false,
    fullWidth = false,
    disabled,
    type,
    ...props
  },
  ref,
) {
  const isNative = Component === 'button';
  return (
    <Component
      ref={ref}
      type={isNative ? type || 'button' : undefined}
      disabled={isNative ? disabled || loading : undefined}
      aria-disabled={!isNative && (disabled || loading) ? true : undefined}
      className={cn(
        'inline-flex items-center justify-center rounded-pill font-semibold',
        'transition-all duration-200 ease-out',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </Component>
  );
});

export default Button;
