import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Compact numbered pagination with ellipsis. Controlled via page/onChange. */
function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

export default function Pagination({ page = 1, totalPages = 1, onChange, className }) {
  if (totalPages <= 1) return null;
  const pages = buildPages(page, totalPages);
  const btn =
    'inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all';

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1.5', className)}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={cn(btn, 'text-muted hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent')}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(btn, p === page ? 'gradient-primary text-white shadow-soft-sm' : 'text-ink/70 hover:bg-primary-50 hover:text-primary-600')}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={cn(btn, 'text-muted hover:bg-primary-50 hover:text-primary-600 disabled:opacity-40 disabled:hover:bg-transparent')}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
