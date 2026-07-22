import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCompact } from '@/utils/format';
import Card from './Card';

/**
 * Metric tile for dashboards and the home statistics strip.
 *
 * props: { icon, label, value, trend? (number, % change), tone? }
 */
export default function StatCard({ icon, label, value, trend, tone = 'primary', compact = false, className }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-500',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/15 text-[#B4890B]',
    secondary: 'bg-accent text-primary-500',
  };
  const up = typeof trend === 'number' && trend >= 0;

  return (
    <Card hoverable className={cn('flex items-center gap-4', className)}>
      <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl', tones[tone])}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-display text-2xl font-bold leading-none text-ink">
          {compact ? formatCompact(value) : value}
        </p>
        <p className="mt-1 truncate text-sm text-muted">{label}</p>
      </div>
      {typeof trend === 'number' && (
        <span
          className={cn(
            'ml-auto inline-flex items-center gap-0.5 rounded-pill px-2 py-1 text-xs font-semibold',
            up ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger',
          )}
        >
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(trend)}%
        </span>
      )}
    </Card>
  );
}
