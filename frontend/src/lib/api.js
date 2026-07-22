/**
 * Axios instance for the FastAPI backend.
 * Attaches Cognito access token (real mode) or mock JWT (mock mode)
 * and normalizes errors to Error(message).
 */
import axios from 'axios';
import { API_BASE_URL } from '@/config/env';
import { getAuthToken } from './authToken';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const detail = error.response?.data?.detail;
    const status = error.response?.status;
    const message =
      (typeof detail === 'string' && detail) ||
      error.message ||
      'Request failed';

    // Attach status so callers can handle 401 specifically.
    const err = new Error(message);
    err.status = status;
    return Promise.reject(err);
  },
);

export default api;
