import { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Custom checkbox with a real input underneath for a11y + RHF. */
const Checkbox = forwardRef(function Checkbox({ label, className, id, ...props }, ref) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <label htmlFor={fieldId} className={cn('inline-flex cursor-pointer items-center gap-2.5 select-none', className)}>
      <span className="relative inline-flex">
        <input ref={ref} id={fieldId} type="checkbox" className="peer sr-only" {...props} />
        <span
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-md border-2 border-primary-200 bg-white transition-all',
            'peer-checked:border-transparent peer-checked:gradient-primary',
            'peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20',
          )}
        >
          <Check className="h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
        </span>
      </span>
      {label && <span className="text-sm text-ink/80">{label}</span>}
    </label>
  );
});

export default Checkbox;
