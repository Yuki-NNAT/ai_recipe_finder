/**
 * Cognito Auth helpers wrapping aws-amplify/auth.
 * All flows use Authorization Code + PKCE (no client secret).
 *
 * Export shape matches what AuthContext expects so the context
 * only needs to swap the import, not rewrite logic.
 */
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  fetchAuthSession,
  getCurrentUser,
  resendSignUpCode,
} from 'aws-amplify/auth';

/** Register with email + password. Cognito sends a verification code. */
export async function cognitoRegister({ name, email, password }) {
  return signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        name,
      },
    },
  });
}

/** Confirm email with the 6-digit code Cognito sent. */
export async function cognitoConfirmSignUp(email, code) {
  return confirmSignUp({ username: email, confirmationCode: code });
}

/** Resend verification code. */
export async function cognitoResendCode(email) {
  return resendSignUpCode({ username: email });
}

/** Sign in — returns nextStep so caller can handle CONFIRM_SIGN_UP etc. */
export async function cognitoLogin({ email, password }) {
  return signIn({ username: email, password });
}

/** Sign out (clears Amplify session + local storage). */
export async function cognitoLogout() {
  return signOut();
}

/**
 * Get the Cognito ACCESS token (not id token).
 * Returns null when no active session.
 */
export async function getCognitoAccessToken() {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() ?? null;
  } catch {
    return null;
  }
}

/**
 * Get the currently signed-in Cognito user attributes.
 * Returns null when no session.
 */
export async function getCognitoUser() {
  try {
    const { username, userId } = await getCurrentUser();
    const session = await fetchAuthSession();
    const claims = session.tokens?.idToken?.payload ?? {};
    return {
      cognitoSub: userId,
      email: claims.email ?? username,
      name: claims.name ?? claims['cognito:username'] ?? username,
    };
  } catch {
    return null;
  }
}
