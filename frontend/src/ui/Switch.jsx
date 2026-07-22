import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

/** On/off toggle. Used in settings and filter panels. */
const Switch = forwardRef(function Switch({ label, className, id, ...props }, ref) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <label htmlFor={fieldId} className={cn('inline-flex cursor-pointer items-center gap-3 select-none', className)}>
      <span className="relative inline-flex">
        <input ref={ref} id={fieldId} type="checkbox" role="switch" className="peer sr-only" {...props} />
        <span className="h-6 w-11 rounded-full bg-primary-100 transition-colors peer-checked:gradient-primary peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
      {label && <span className="text-sm text-ink/80">{label}</span>}
    </label>
  );
});

export default Switch;
