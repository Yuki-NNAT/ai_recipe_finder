import { currentUser } from '@/mock/users';
import { respond, respondError } from './mockClient';

/**
 * Auth data access (mocked). Mirrors a JWT login/register API: returns a user
 * object and a fake token. Swap the bodies for real axios calls later — the
 * shape the app consumes stays identical.
 */
export const AuthService = {
  async login({ email, password }) {
    if (!email || (password?.length ?? 0) < 6) {
      return respondError('Invalid email or password', 500);
    }
    const role = email.toLowerCase().startsWith('admin') ? 'admin' : 'user';
    return respond({
      user: { ...currentUser, email, role },
      token: `mock.jwt.${btoa(email)}`,
    });
  },

  async register({ name, email, password }) {
    if (!name || !email || (password?.length ?? 0) < 6) {
      return respondError('Please complete all fields (password 6+ chars)', 500);
    }
    return respond({
      user: { ...currentUser, id: `u_${Date.now()}`, name, email, joinedAt: new Date().toISOString() },
      token: `mock.jwt.${btoa(email)}`,
    });
  },

  async updateProfile(patch) {
    return respond({ ...currentUser, ...patch });
  },
};

export default AuthService;
