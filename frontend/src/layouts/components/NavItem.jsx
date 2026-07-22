import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useLang } from '@/i18n/LanguageContext';

export default function NavItem({ to, end, icon: Icon, label, onClick }) {
  const { t } = useLang();
  const displayLabel = t(label, label);

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-primary-50 text-primary-600 shadow-soft-sm'
            : 'text-ink/70 hover:bg-primary-50/60 hover:text-primary-600',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-5 w-5 shrink-0 transition-colors',
              isActive ? 'text-primary-500' : 'text-muted group-hover:text-primary-500',
            )}
          />
          <span className="truncate">{displayLabel}</span>
        </>
      )}
    </NavLink>
  );
}
