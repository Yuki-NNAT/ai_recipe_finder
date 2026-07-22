import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { Loading } from '@/ui';

/**
 * Route guard for login-required pages.
 * IMPORTANT: waits for isLoading=false before deciding to redirect.
 * Without this, OIDC session restore looks like "not authenticated"
 * and causes a blank screen / redirect loop.
 */
export default function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Wait for OIDC to finish restoring session before checking auth state.
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loading label="Đang xác thực…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
