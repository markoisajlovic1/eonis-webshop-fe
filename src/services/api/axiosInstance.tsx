import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { authService } from '../authService';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Required to send HTTP-only cookies (treba za refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Promise queue to prevent concurrent refresh attempts
let refreshTokenPromise: Promise<string> | null = null;

// Request interceptor, (add auth token to requests)
axiosInstance.interceptors.request.use((config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor,  (handle errors globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (unauthorized - token expired or invalid)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Skip refresh for auth endpoints to prevent infinite loops
      const url = originalRequest.url || '';
      const isAuthEndpoint = url.includes('/auth/refresh') || url.includes('/auth/logout');
      
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Use existing refresh promise if one is in progress (prevents concurrent refresh calls)
        if (!refreshTokenPromise) {
          refreshTokenPromise = authService.refreshToken();
        }

        const newToken = await refreshTokenPromise;
        refreshTokenPromise = null; // Clear promise after successful refresh

        // Update the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("refresh error: ", refreshError)
        // Refresh failed - clear promise and tokens
        refreshTokenPromise = null;
        
        // Clear tokens (logout will clear refresh token cookie via backend)
        authService.logout().catch(() => {
          // Ignore logout errors
        });

        // Dispatch event to trigger logout in UserContext
        window.dispatchEvent(new Event('auth:logout'));

        // Reject the original error
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;