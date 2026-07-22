import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Loading } from '@/ui';
import { ROUTES } from '@/constants';

/**
 * OAuth callback. react-oidc-context handles the code→token exchange
 * automatically when this component mounts. We just redirect on success.
 */
export default function CallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading) {
      if (auth.isAuthenticated) {
        navigate(ROUTES.HOME, { replace: true });
      } else if (auth.error) {
        navigate(ROUTES.LOGIN, { replace: true });
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.error, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loading label="Completing sign-in…" />
    </div>
  );
}
