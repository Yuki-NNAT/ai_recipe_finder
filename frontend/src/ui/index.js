/**
 * UI Kit public API. Features import from '@/ui' only — never reach into
 * individual files — so the design system stays swappable and consistent.
 */

// Actions
export { default as Button } from './Button';
export { default as IconButton } from './IconButton';

// Form controls
export { default as Input } from './Input';
export { default as SearchInput } from './SearchInput';
export { default as Textarea } from './Textarea';
export { default as Select } from './Select';
export { default as Checkbox } from './Checkbox';
export { default as Radio } from './Radio';
export { default as Switch } from './Switch';

// Surfaces & data display
export { default as Card } from './Card';
export { default as RecipeCard } from './RecipeCard';
export { default as StatCard } from './StatCard';
export { default as Avatar } from './Avatar';
export { default as Badge } from './Badge';
export { default as Chip } from './Chip';
export { default as Progress } from './Progress';

// Navigation
export { default as Pagination } from './Pagination';
export { default as Tabs } from './Tabs';
export { default as Breadcrumb } from './Breadcrumb';

// Overlays
export { default as Modal } from './Modal';
export { default as Drawer } from './Drawer';

// Feedback
export { default as Loading, Spinner } from './Loading';
export { default as Skeleton, RecipeCardSkeleton } from './Skeleton';
export { default as EmptyState } from './EmptyState';
export { default as ErrorState } from './ErrorState';
export { default as ToastHost, notify } from './Toast';

// Layout & typography
export { default as Container } from './Container';
export { default as Section } from './Section';
export * as Typography from './Typography';
export {
  Display,
  Heading,
  Title,
  Text,
  Muted,
  Eyebrow,
  SectionHeading,
} from './Typography';
