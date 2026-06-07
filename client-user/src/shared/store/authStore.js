// c:\gitIN6AM\KinalSports\client-user\src\shared\store\authStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'secure_refresh_token';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null, // accessToken
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (accessToken, user, refreshToken) => {
        try {
          if (refreshToken) {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
          }
          set({ token: accessToken, user, isAuthenticated: true });
        } catch (error) {
          console.error("Error al guardar refreshToken:", error);
        }
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        } catch (error) {
          console.error("Error al eliminar refreshToken:", error);
        }
        set({ token: null, user: null, isAuthenticated: false });
      },

      updateUser: (newUser) => {
        set((state) => ({ user: { ...state.user, ...newUser } }));
      },

      setAccessToken: (token) => {
        set({ token });
      },
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);
      },
    }
  )
);
