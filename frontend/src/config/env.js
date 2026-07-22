/**
 * Runtime configuration. VITE_API_URL drives mock vs real mode.
 * With API Gateway URL set → VITE_USE_MOCK defaults to false automatically.
 */
const API_URL = (import.meta.env.VITE_API_URL ?? '').trim();

export const USE_MOCK = !API_URL || import.meta.env.VITE_USE_MOCK === 'true';
export const API_BASE_URL = API_URL || 'https://lis0c4qiz0.execute-api.ap-southeast-1.amazonaws.com';

export const cognitoConfig = {
  region: import.meta.env.VITE_COGNITO_REGION ?? 'ap-southeast-1',
  userPoolId: import.meta.env.VITE_COGNITO_USERPOOL_ID ?? '',
  appClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID ?? '',
};
