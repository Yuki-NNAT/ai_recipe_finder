import { cn } from '@/utils/cn';
import { clamp } from '@/utils/format';

/** Horizontal progress bar. Used for daily nutrition goals and macro fills. */
export default function Progress({ value = 0, max = 100, tone = 'primary', label, showValue = false, className }) {
  const pct = clamp((value / max) * 100, 0, 100);
  const tones = {
    primary: 'gradient-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
          {label && <span className="text-ink/70">{label}</span>}
          {showValue && <span className="text-muted">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-primary-50"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-700 ease-out', tones[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
