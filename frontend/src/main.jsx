import ErrorBoundary from './app/ErrorBoundary';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import App from './app/App';
import './theme/index.css';

const cognitoAuthConfig = {
  authority: 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_HysBi2PMk',
  client_id: '3pe2vooa7h0i503iqm6kfv13o8',
  redirect_uri: `${window.location.origin}/callback`,
  post_logout_redirect_uri: `${window.location.origin}/login`,
  response_type: 'code',
  scope: 'email openid profile',
  automaticSilentRenew: true,
  loadUserInfo: true,
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
