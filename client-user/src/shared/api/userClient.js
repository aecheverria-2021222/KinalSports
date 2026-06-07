// c:\gitIN6AM\KinalSports\client-user\src\shared\api\userClient.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENDPOINTS } from '../endpoints.js';
import { authClient } from './authClient.js';
import { useAuthStore } from '../store/authStore.js';

export const userClient = axios.create({
  baseURL: ENDPOINTS.USER,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cola de peticiones concurrentes para cuando se está refrescando el token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor: Inyectar access token
userClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Manejar 401 y refrescar token
userClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return userClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('secure_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Llamar al endpoint de refresh.
        // Asumimos que recibe un objeto { refreshToken } o por headers,
        // ajustarlo si el backend de KinalSports lo espera distinto.
        const response = await authClient.post('/refresh', { refreshToken });
        
        // Asumiendo que el backend devuelve un { data: { accessToken } } o similar
        // Ajustar según la respuesta real del backend
        const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;
        
        if (!newAccessToken) {
           throw new Error('No new access token returned');
        }

        useAuthStore.getState().setAccessToken(newAccessToken);
        userClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        return userClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
