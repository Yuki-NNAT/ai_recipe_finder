import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Empty screen = an invitation to act. Always pass an `action` when the user
 * can do something about the emptiness (e.g. "Browse recipes").
 */
export default function EmptyState({ icon, title = 'Nothing here yet', description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}>
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-400">
        {icon || <Inbox className="h-9 w-9" />}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
