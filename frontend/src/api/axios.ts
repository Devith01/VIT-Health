import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vithealth_token') || localStorage.getItem('vhealth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Unauthorized handler
    if (error.response?.status === 401) {
      const token = localStorage.getItem('vithealth_token') || localStorage.getItem('vhealth_token');

      if (!token?.startsWith('mock-jwt-token-demo-')) {
        localStorage.removeItem('vithealth_token');
        localStorage.removeItem('vhealth_token');
        localStorage.removeItem('vithealth_user');
        localStorage.removeItem('vhealth_user');
      }
    }

    // 2. Offline / Network Error Resilience Handler
    if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.warn('[API Client] Network error encountered. Using offline fallback handler.');

      const url = error.config?.url || '';

      // Return mock response structure for login/auth requests if backend server is not running
      if (url.includes('/auth/login')) {
        const savedUser = localStorage.getItem('vithealth_user') || localStorage.getItem('vhealth_user');
        const userObj = savedUser ? JSON.parse(savedUser) : { id: 'user-std-1', email: 'student@demo.com', fullName: 'Aarav Patel', roleName: 'STUDENT' };
        return Promise.resolve({
          data: {
            status: 'success',
            data: {
              token: 'mock-jwt-token-offline-fallback',
              user: userObj,
            },
          },
        });
      }

      if (url.includes('/auth/me')) {
        const savedUser = localStorage.getItem('vithealth_user') || localStorage.getItem('vhealth_user');
        const userObj = savedUser ? JSON.parse(savedUser) : { id: 'user-std-1', email: 'student@demo.com', fullName: 'Aarav Patel', roleName: 'STUDENT' };
        return Promise.resolve({
          data: {
            status: 'success',
            data: { user: userObj },
          },
        });
      }
    }

    return Promise.reject(error);
  }
);
