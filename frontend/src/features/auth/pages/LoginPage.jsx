import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Button, Loading } from '@/ui';
import { useLang } from '@/i18n/LanguageContext';
import { ROUTES } from '@/constants';
import { Sparkles, LogOut } from 'lucide-react';

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();
  const from = location.state?.from ?? ROUTES.HOME;

  if (auth.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loading label={t('loading')} />
      </div>
    );
  }

  // Already logged in — show profile card instead of redirect
  if (auth.isAuthenticated) {
    const name = auth.user?.profile?.name
      ?? auth.user?.profile?.email?.split('@')[0]
      ?? 'User';
    return (
      <div className="animate-fade-up text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl gradient-primary text-3xl font-bold text-white shadow-soft">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{t('welcomeBack')}, {name}!</h1>
          <p className="mt-1 text-sm text-muted">{auth.user?.profile?.email}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Button fullWidth size="lg" onClick={() => navigate(from, { replace: true })}>
            Tiếp tục
          </Button>
          <Button fullWidth size="lg" variant="secondary"
            leftIcon={<LogOut className="h-4 w-4" />}
            onClick={() => { auth.removeUser(); window.location.reload(); }}
          >
            {t('logout')} và đăng nhập tài khoản khác
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        {t('welcomeBack')}
      </h1>
      <p className="mt-2 text-sm text-muted">{t('signInToContinue')}</p>

      {auth.error && (
        <div className="mt-4 rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {auth.error.message}
        </div>
      )}

      <div className="mt-8 space-y-4">
        <Button
          fullWidth
          size="lg"
          leftIcon={<Sparkles className="h-5 w-5" />}
          onClick={() => auth.signinRedirect()}
        >
          {t('login')} với Cognito
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {t('noAccount')}{' '}
        <button
          onClick={() => auth.signinRedirect({ extraQueryParams: { screen_hint: 'signup' } })}
          className="font-semibold text-primary-600 hover:underline"
        >
          {t('createAccount')}
        </button>
      </p>

      <p className="mt-4 rounded-2xl bg-primary-50/60 px-4 py-3 text-center text-xs text-muted">
        Bạn sẽ được chuyển đến trang đăng nhập Cognito an toàn.
      </p>
    </div>
  );
}
