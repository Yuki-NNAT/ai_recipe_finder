import { cn } from '@/utils/cn';

/** Small status/label pill. Non-interactive. */
export default function Badge({ tone = 'primary', size = 'md', className, children, ...props }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-700',
    solid: 'gradient-primary text-white shadow-soft-sm',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/15 text-[#B4890B]',
    danger: 'bg-danger/10 text-danger',
    neutral: 'bg-black/5 text-muted',
  };
  const sizes = { sm: 'px-2 py-0.5 text-[11px]', md: 'px-2.5 py-1 text-xs' };
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-pill font-semibold', tones[tone], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
