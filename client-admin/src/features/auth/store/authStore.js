import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginRequest, register as registerRequest } from '../../../shared/apis';
import { showError } from '../../../shared/utils/toast.js';
import { LoaderIcon } from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null,
      loading: false,
      error: null,
      isLoadingAuth: true,
      isAuthenticated: false,
      // Función para validar el token y el rol del usuario
      checkAuth: () => {
        const token = get().token;
        const role = get().user?.role;
        const isAdmin = role === 'ADMIN_ROLE';

        if (token && !isAdmin) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            isLoadingAuth: true,
            isAuthenticated: false,
            error: 'No tienes permiso para acceder a esta aplicación',
          });
          return;
        }

        set({
          isLoadingAuth: false,
          isAuthenticated: Boolean(token) && isAdmin,
        });
      },
      // Función para cerrar sesión
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },
      // Función para iniciar sesión
      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });

          const { data } = await loginRequest({ emailOrUsername, password });
          console.log(data);

          const role = data?.userDetails?.role;
          if (role !== 'ADMIN_ROLE') {
            const message = 'No tienes permiso para acceder a esta aplicación';

            set({
              user: null,
              token: null,
              refreshToken: null,
              expiresAt: null,
              isLoadingAuth: true,
              isAuthenticated: false,
              error: message,
            });

            showError(message);
            return { success: false, error: message };
          }

          set({
            user: data.userDetails,
            token: data.accessToken,
            //token: data.token,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresIn,
            //expiresAt: data.expiresAt,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Error al iniciar sesión';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      register: async (formData) => {
        try {
          set({ loading: true, error: null });
          const { data } = await registerRequest(formData);
          set({ loading: false });
          return {
            success: true,
            emailVerificationRequired: data?.emailVerificationRequired,
          };
        } catch (err) {
          const message = err.response?.data?.message || 'Error al Registar Usuario';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
    }),
    { name: 'auth-KS-IN6AM' }
  )
);
