/**
 * Cognito configuration — Authorization Code + PKCE, no client secret.
 * Public values only; safe to commit.
 * Callback/logout URLs must be registered in Cognito App Client settings.
 */

const LOCAL = 'http://localhost:5173';
const AMPLIFY = import.meta.env.VITE_AMPLIFY_URL ?? 'https://main.d2ykhh6couuz7m.amplifyapp.com';

/** The origin this build is running on. */
const ORIGIN = AMPLIFY || LOCAL;

export const cognitoConfig = {
  region: 'ap-southeast-1',
  userPoolId: 'ap-southeast-1_HysBi2PMk',
  userPoolClientId: '3pe2vooa7h0i503iqm6kfv13o8',
  domain: 'ap-southeast-1-hysbi2pmk.auth.ap-southeast-1.amazoncognito.com',
  scopes: ['openid', 'email'],
  redirectSignIn: `${ORIGIN}/callback`,
  redirectSignOut: `${ORIGIN}/login`,
};

export default cognitoConfig;
