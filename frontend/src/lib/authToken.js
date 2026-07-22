/**
 * Token seam — returns the bearer token for API requests.
 * Reads from the react-oidc-context user store (sessionStorage).
 */
export async function getAuthToken() {
  try {
    // react-oidc-context stores user in sessionStorage keyed by authority+clientId
    const key = Object.keys(sessionStorage).find((k) => k.startsWith('oidc.user:'));
    if (!key) return null;
    const data = JSON.parse(sessionStorage.getItem(key));
    return data?.access_token ?? null;
  } catch {
    return null;
  }
}

export default getAuthToken;
