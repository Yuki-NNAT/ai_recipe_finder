import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

/** Single radio option. Compose multiple under one `name`. */
const Radio = forwardRef(function Radio({ label, className, id, ...props }, ref) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <label htmlFor={fieldId} className={cn('inline-flex cursor-pointer items-center gap-2.5 select-none', className)}>
      <span className="relative inline-flex">
        <input ref={ref} id={fieldId} type="radio" className="peer sr-only" {...props} />
        <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-200 bg-white transition-all peer-checked:border-primary-500 peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20">
          <span className="h-2.5 w-2.5 scale-0 rounded-full gradient-primary transition-transform peer-checked:scale-100" />
        </span>
      </span>
      {label && <span className="text-sm text-ink/80">{label}</span>}
    </label>
  );
});

export default Radio;
