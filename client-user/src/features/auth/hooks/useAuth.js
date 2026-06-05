// c:/gitIN6AM/KinalSports/client-user/src/features/auth/hooks/useAuth.js
import { useState } from 'react';
import authClient from '../../../shared/api/authClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login: storeLogin, logout: storeLogout } = useAuthStore();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authClient.post('/login', credentials);
      const { accessToken, refreshToken, userDetails, token, user } = response.data;
      
      const finalToken = accessToken || token;
      const finalUser = userDetails || user;

      if (finalToken) {
        await storeLogin(finalToken, finalUser, refreshToken);
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await authClient.post('/register', userData);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await storeLogout();
  };

  return {
    handleLogin,
    handleRegister,
    logout,
    loading,
    error
  };
};
