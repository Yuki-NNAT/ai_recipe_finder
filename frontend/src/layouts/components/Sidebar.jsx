import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6';
import { UtensilsCrossed, ShieldCheck } from 'lucide-react';
import { SIDEBAR_GROUPS, ADMIN_NAV } from '../navigation';
import { APP_NAME } from '@/constants';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { useLang } from '@/i18n/LanguageContext';
import Logo from './Logo';
import NavItem from './NavItem';

const SOCIALS = [
  { label: 'Facebook', icon: FaFacebookF },
  { label: 'Instagram', icon: FaInstagram },
  { label: 'Twitter', icon: FaTwitter },
];

/**
 * Sidebar inner content, shared by the desktop rail and the mobile Drawer.
 * An admin-only group is appended when the signed-in user is an admin.
 */
export function SidebarContent({ onNavigate, groups }) {
  const { t } = useLang();
  const { user } = useAuth();
  const baseGroups = groups ?? SIDEBAR_GROUPS;
  const navGroups =
    user?.role === 'admin' && !groups
      ? [...baseGroups, { title: 'Admin', items: ADMIN_NAV.map((i) => ({ ...i, icon: i.icon })) }]
      : baseGroups;

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6">
        <Logo />
      </div>

      <nav className="mt-6 flex-1 space-y-6 overflow-y-auto px-4 scrollbar-slim">
        {navGroups.map((group, i) => (
          <div key={group.title ?? `group-${i}`} className="space-y-1">
            {group.title && (
              <p className="flex items-center gap-1.5 px-4 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/70">
                {group.title === 'Admin' && <ShieldCheck className="h-3.5 w-3.5" />}
                {t(group.title, group.title)}
              </p>
            )}
            {group.items.map((item) => (
              <NavItem key={item.label} {...item} onClick={onNavigate} />
            ))}
          </div>
        ))}
      </nav>

      <div className="px-6 pb-6 pt-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/70">
          Follow us
        </p>
        <div className="flex gap-2.5">
          {SOCIALS.map(({ label, icon: Icon }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-white shadow-soft-sm transition-transform hover:-translate-y-0.5"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-primary-300">
          <UtensilsCrossed className="h-4 w-4" />
          <span className="h-px flex-1 bg-primary-100" />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          © {new Date().getFullYear()} {APP_NAME}
          <br />
          All rights reserved.
        </p>
      </div>
    </div>
  );
}

/** Desktop floating sidebar rail. Hidden by default — toggled via hamburger. */
export default function Sidebar({ className, groups }) {
  return null; // Sidebar is now drawer-only on all screen sizes
}
