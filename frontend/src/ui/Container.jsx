import { cn } from '@/utils/cn';

/** Centers content and applies the app's consistent horizontal gutters. */
export default function Container({ as: Tag = 'div', size = 'default', className, children, ...props }) {
  const widths = {
    narrow: 'max-w-3xl',
    default: 'max-w-7xl',
    wide: 'max-w-[90rem]',
    full: 'max-w-none',
  };
  return (
    <Tag className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', widths[size], className)} {...props}>
      {children}
    </Tag>
  );
}
