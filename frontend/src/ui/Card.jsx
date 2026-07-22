import { cn } from '@/utils/cn';

/**
 * Base surface for floating content. `hoverable` adds the lift micro-interaction
 * used across recipe grids and feature tiles.
 */
export default function Card({
  as: Tag = 'div',
  variant = 'solid',
  hoverable = false,
  padded = true,
  className,
  children,
  ...props
}) {
  const variants = {
    solid: 'bg-surface border border-primary-100/70 shadow-soft-sm',
    glass: 'glass shadow-glass',
    flat: 'bg-surface border border-primary-100/60',
    outline: 'bg-transparent border border-primary-200',
  };
  return (
    <Tag
      className={cn(
        'rounded-3xl',
        variants[variant],
        padded && 'p-5 sm:p-6',
        hoverable &&
          'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-lg hover:border-primary-200',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
