import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

/** items: { label, to? }[] — last item renders as the current page. */
export default function Breadcrumb({ items = [], className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-sm', className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {item.to && !last ? (
              <Link to={item.to} className="text-muted transition-colors hover:text-primary-600">
                {item.label}
              </Link>
            ) : (
              <span className={cn(last ? 'font-medium text-ink' : 'text-muted')} aria-current={last ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!last && <ChevronRight className="h-4 w-4 text-muted/60" />}
          </span>
        );
      })}
    </nav>
  );
}
