import { cn } from '@/utils/cn';

/**
 * Controlled tab switcher (pill style). Parent owns `value`; keeps the
 * component simple and reusable across nutrition history, profile, admin.
 *
 * items: { value, label, icon? }[]
 */
export default function Tabs({ items = [], value, onChange, className }) {
  return (
    <div
      role="tablist"
      className={cn('inline-flex gap-1 rounded-pill bg-primary-50 p-1', className)}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'inline-flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition-all duration-200',
              active ? 'bg-white text-primary-600 shadow-soft-sm' : 'text-muted hover:text-ink',
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
