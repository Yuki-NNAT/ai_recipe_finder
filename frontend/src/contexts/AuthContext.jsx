import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth as useOidcAuth } from 'react-oidc-context';
import { API_BASE_URL } from '@/config/env';

const AuthContext = createContext(null);

/**
 * Thin wrapper around react-oidc-context.
 * After login, calls GET /auth/me to get the server-side user profile
 * (which triggers JIT user creation in the DB on first call).
 */
export function AuthProvider({ children }) {
  const oidc = useOidcAuth();
  const [serverUser, setServerUser] = useState(null);
  const [meLoading, setMeLoading] = useState(false);

  // Call /auth/me whenever we have a fresh access token
  useEffect(() => {
    if (!oidc.isAuthenticated || !oidc.user?.access_token) {
      setServerUser(null);
      return;
    }
    let cancelled = false;
    setMeLoading(true);
    fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${oidc.user.access_token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setServerUser(data);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setMeLoading(false); });
    return () => { cancelled = true; };
  }, [oidc.isAuthenticated, oidc.user?.access_token]);

  const login = useCallback(() => oidc.signinRedirect(), [oidc]);

  const logout = useCallback(() => {
    // Simple local logout: clear OIDC session + redirect to login
    // (No Cognito hosted UI needed — avoids domain DNS issues)
    oidc.removeUser();
    setServerUser(null);
    window.location.replace('/login');
  }, [oidc]);

  const user = useMemo(() => {
    if (!oidc.isAuthenticated) return null;
    // Prefer server user from /auth/me, fallback to OIDC profile
    if (serverUser) {
      return {
        id: serverUser.user_id,
        username: serverUser.username,
        name: serverUser.username ?? oidc.user?.profile?.email?.split('@')[0] ?? 'User',
        email: serverUser.email ?? oidc.user?.profile?.email ?? '',
        avatar: oidc.user?.profile?.picture ?? '',
        sub: oidc.user?.profile?.sub ?? '',
        createdAt: serverUser.created_at,
      };
    }
    // Fallback while /auth/me is loading
    return {
      id: null,
      name: oidc.user?.profile?.email?.split('@')[0] ?? 'User',
      email: oidc.user?.profile?.email ?? '',
      avatar: oidc.user?.profile?.picture ?? '',
      sub: oidc.user?.profile?.sub ?? '',
    };
  }, [oidc.isAuthenticated, oidc.user, serverUser]);

  const setUser = useCallback((updater) => {
    setServerUser(prev => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater });
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: oidc.isAuthenticated,
    isLoading: oidc.isLoading || meLoading,
    token: oidc.user?.access_token ?? null,
    login,
    logout,
    register: login,
    updateUser: (patch) => setServerUser((u) => u ? { ...u, ...patch } : u),
  }), [user, oidc.isAuthenticated, oidc.isLoading, meLoading, oidc.user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
