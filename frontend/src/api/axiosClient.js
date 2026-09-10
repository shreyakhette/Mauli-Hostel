import axios from 'axios';

// Normalize base URL: support VITE_API_BASE_URL (Render backend URL) or default to '/api' for local proxy
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const sanitizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const baseURL = sanitizedBaseUrl.endsWith('/api') || sanitizedBaseUrl === '/api'
  ? sanitizedBaseUrl
  : `${sanitizedBaseUrl}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sakhi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear auth state if unauthorized on protected resource
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          localStorage.removeItem('sakhi_token');
          localStorage.removeItem('sakhi_user');
          window.location.href = '/login';
        }
      }
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'An error occurred. Please try again.';
      return Promise.reject(new Error(message));
    }
    return Promise.reject(new Error('Network error. Please check your internet connection.'));
  }
);

export default api;
