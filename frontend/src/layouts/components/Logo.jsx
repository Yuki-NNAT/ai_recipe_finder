import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/constants';

/** Brand mark. `compact` drops the wordmark for tight spaces. */
export default function Logo({ compact = false, className }) {
  return (
    <Link to={ROUTES.HOME} className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-primary shadow-soft-sm">
        <ChefHat className="h-5 w-5 text-white" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight text-ink">
          AI <span className="text-gradient">Recipe</span>
        </span>
      )}
    </Link>
  );
}
