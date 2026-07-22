import { cn } from '@/utils/cn';

/**
 * Vertical rhythm wrapper. All page sections use this so spacing between
 * blocks is uniform instead of ad-hoc margins.
 */
export default function Section({ as: Tag = 'section', spacing = 'md', className, children, ...props }) {
  const spacings = {
    sm: 'py-6 sm:py-8',
    md: 'py-10 sm:py-14',
    lg: 'py-14 sm:py-20',
  };
  return (
    <Tag className={cn(spacings[spacing], className)} {...props}>
      {children}
    </Tag>
  );
}
