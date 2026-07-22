import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Heart, Bell, ChevronDown, User, LogOut, ShoppingCart } from 'lucide-react';
import { IconButton, Button } from '@/ui';
import Logo from './Logo';
import { useAuth } from '@/hooks/useAuth';
import { useFavorite } from '@/hooks/useFavorite';
import { useLang } from '@/i18n/LanguageContext';
import { useShoppingListContext } from '@/contexts/ShoppingListContext';
import LanguageSwitcher from './LanguageSwitcher';
import { PRIMARY_NAV } from '../navigation';
import { ROUTES } from '@/constants';

function CountDot({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  );
}

export default function Navbar({ onMenuClick }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLang();
  const { count: favCount } = useFavorite();
  const { stats: shoppingStats } = useShoppingListContext();
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setUserOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3" ref={dropRef}>
      <div className="glass-strong flex h-16 items-center gap-3 rounded-3xl px-3 shadow-glass sm:px-4">
        
        {/* Hamburger */}
        <IconButton label={t('home')} variant="ghost" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </IconButton>

        <Logo compact />

        {/* Primary nav pills */}
        <nav className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map(({ label, to, icon: Icon, end }) => (
            <NavLink 
              key={to} 
              to={to} 
              end={end} 
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive ? 'bg-primary-50 text-primary-600' : 'text-muted hover:bg-primary-50/60 hover:text-primary-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-4 w-4 ${isActive ? 'text-primary-500' : 'text-muted'}`} />
                  {t(label, label)}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />

          {/* Favorites */}
          <div className="relative">
            <Link 
              to={ROUTES.FAVORITES} 
              aria-label="Favorites"
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-all hover:bg-primary-50 hover:text-primary-600"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <CountDot count={favCount} />
          </div>

          {/* Shopping */}
          <div className="relative">
            <Link 
              to="/shopping" 
              aria-label="Shopping list"
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-all hover:bg-primary-50 hover:text-primary-600"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <CountDot count={shoppingStats.remaining} />
          </div>

          {/* Notifications */}
          <div className="relative">
            <IconButton label={t('notifications')} variant="ghost" onClick={() => { setNotifOpen(o => !o); setUserOpen(false); }}>
              <Bell className="h-5 w-5" />
            </IconButton>
            {notifOpen && (
              <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-surface border border-primary-100/70 shadow-soft-lg p-4">
                <p className="mb-2 text-sm font-semibold text-ink">{t('notifications')}</p>
                <p className="py-3 text-center text-xs text-muted">Không có thông báo nào.</p>
              </div>
            )}
          </div>

          {/* User menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => { setUserOpen(o => !o); setNotifOpen(false); }}
                className="flex items-center gap-2 rounded-2xl bg-primary-50 px-3 py-2 transition-all hover:bg-primary-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white">
                  {(user?.name ?? user?.username ?? 'U').charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[96px] truncate text-sm font-medium text-ink sm:block">
                  {user?.name ?? user?.username}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted transition-transform ${userOpen ? 'rotate-180' : ''}`} />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl bg-surface border border-primary-100/70 shadow-soft-lg">
                  {/* User info */}
                  <div className="border-b border-primary-100/70 px-4 py-3">
                    <p className="text-sm font-semibold text-ink">{user?.name ?? user?.username}</p>
                    <p className="truncate text-xs text-muted">{user?.email}</p>
                  </div>
                  {/* Menu items */}
                  <Link to={ROUTES.PROFILE} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-ink hover:bg-primary-50 transition-colors">
                    <User className="h-4 w-4" /> {t('profile')}
                  </Link>
                  <button 
                    onClick={() => { setUserOpen(false); logout(); }}
                    className="flex w-full items-center gap-3 border-t border-primary-100/70 px-4 py-3 text-sm text-danger hover:bg-danger/5 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button as={Link} to={ROUTES.LOGIN} size="sm" className="ml-1">
              {t('login')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}