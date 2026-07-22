import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';
import { notify } from '@/ui';

/**
 * Admin-only guard. Guests go to login; signed-in non-admins are bounced home
 * with a notice. (Log in with an admin@… email to access.)
 */
export default function RequireAdmin() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} state={{ from: ROUTES.ADMIN }} replace />;
  if (user?.role !== 'admin') {
    notify.error('Admin access required');
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return <Outlet />;
}
