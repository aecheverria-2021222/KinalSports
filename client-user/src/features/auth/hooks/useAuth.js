// c:\gitIN6AM\KinalSports\client-user\src\features\auth\hooks\useAuth.js
import { useState, useCallback } from 'react';
import { authClient } from '../../../shared/api/authClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, logout } = useAuthStore();

  const handleLogin = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // Ajustar keys según backend
      const response = await authClient.post('/login', credentials);
      const data = response.data?.data || response.data;
      
      const { accessToken, refreshToken, user } = data;
      await login(accessToken, user, refreshToken);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const handleRegister = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await authClient.post('/register', userData);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleLogin, handleRegister, logout, loading, error };
};
