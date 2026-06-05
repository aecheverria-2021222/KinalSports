// c:/gitIN6AM/KinalSports/client-user/src/shared/store/authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const secureStorage = {
  getItem: async (name) => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name, value) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      
      login: async (accessToken, user, refreshToken) => {
        if (refreshToken) {
          await secureStorage.setItem('refreshToken', refreshToken);
        }
        set({ token: accessToken, user, isAuthenticated: true });
      },
      
      logout: async () => {
        await secureStorage.removeItem('refreshToken');
        set({ token: null, user: null, isAuthenticated: false });
      },
      
      setAccessToken: (token) => {
        set({ token });
      },
      
      updateUser: (user) => {
        set({ user });
      },
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
