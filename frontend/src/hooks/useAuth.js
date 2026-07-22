import { useAuthContext } from '@/contexts/AuthContext';

/** Public auth hook: { user, token, isAuthenticated, isLoading, login, logout } */
export function useAuth() {
  return useAuthContext();
}

export default useAuth;
