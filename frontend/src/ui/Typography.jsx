import { cn } from '@/utils/cn';

/**
 * Type scale. Centralizing headings/body here means every screen shares one
 * hierarchy — no stray `text-2xl font-bold` scattered across features.
 */

export function Display({ as: Tag = 'h1', className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'font-display font-extrabold tracking-tight text-ink',
        'text-4xl leading-[1.05] sm:text-5xl lg:text-6xl',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Heading({ as: Tag = 'h2', className, children, ...props }) {
  return (
    <Tag className={cn('font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl', className)} {...props}>
      {children}
    </Tag>
  );
}

export function Title({ as: Tag = 'h3', className, children, ...props }) {
  return (
    <Tag className={cn('font-display text-lg font-semibold text-ink', className)} {...props}>
      {children}
    </Tag>
  );
}

export function Text({ as: Tag = 'p', className, children, ...props }) {
  return (
    <Tag className={cn('text-sm leading-relaxed text-ink/80 sm:text-base', className)} {...props}>
      {children}
    </Tag>
  );
}

export function Muted({ as: Tag = 'p', className, children, ...props }) {
  return (
    <Tag className={cn('text-sm text-muted', className)} {...props}>
      {children}
    </Tag>
  );
}

export function Eyebrow({ className, children, ...props }) {
  return (
    <span
      className={cn('text-xs font-semibold uppercase tracking-[0.14em] text-primary-500', className)}
      {...props}
    >
      {children}
    </span>
  );
}

/** Section header with the signature pink accent bar from the reference. */
export function SectionHeading({ title, action, className, ...props }) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)} {...props}>
      <div className="flex items-center gap-3">
        <span className="h-6 w-1.5 rounded-full gradient-primary" aria-hidden="true" />
        <Heading className="text-xl sm:text-2xl">{title}</Heading>
      </div>
      {action}
    </div>
  );
}

export default {
  Display,
  Heading,
  Title,
  Text,
  Muted,
  Eyebrow,
  SectionHeading,
};
