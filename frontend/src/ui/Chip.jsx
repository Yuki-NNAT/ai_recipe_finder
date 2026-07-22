import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Selectable filter chip (categories, tags). Toggles via `active`. */
export default function Chip({ active = false, onRemove, icon, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-4 py-2 text-sm font-medium',
        'transition-all duration-200 ease-out',
        active
          ? 'gradient-primary text-white shadow-soft-sm'
          : 'bg-white text-ink/70 border border-primary-100 hover:border-primary-200 hover:text-primary-600',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-white/25"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}
