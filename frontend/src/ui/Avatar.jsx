import { getInitials } from '@/utils/format';
import { cn } from '@/utils/cn';

/** User avatar with graceful initials fallback and optional online dot. */
export default function Avatar({ src, name = '', size = 'md', ring = false, status, className }) {
  const sizes = {
    xs: 'h-8 w-8 text-xs',
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  };
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center overflow-hidden rounded-full font-semibold',
          'bg-primary-100 text-primary-700',
          ring && 'ring-2 ring-primary-200 ring-offset-2 ring-offset-surface',
          sizes[size],
        )}
      >
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <span aria-hidden="true">{getInitials(name) || '·'}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-surface',
            status === 'online' ? 'bg-success' : 'bg-muted',
          )}
        />
      )}
    </div>
  );
}
