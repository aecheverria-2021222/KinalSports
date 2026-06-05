import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  login as loginRequest,
  register as registerRequest,
  forgotPassword as forgotPasswordRequest,
  resetPassword as resetPasswordRequest,
} from "../../../shared/api";
import { showError } from "../../../shared/utils/toast.js";

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
      checkAuth: () => {
        const token = get().token;
        const role = get().user?.role;
        const isAdmin = role === "ADMIN_ROLE";

        // Si hay token pero el rol no es admin, limpiamos la sesión.
        if (token && !isAdmin) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            expiresAt: null,
            isAuthenticated: false,
            isLoadingAuth: false,
            error: "No tienes permisos para acceder como administrador.",
          });
          return;
        }

        set({
          isLoadingAuth: false,
          isAuthenticated: Boolean(token) && isAdmin,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          expiresAt: null,
          isAuthenticated: false,
        });
      },
      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await loginRequest({ emailOrUsername, password });

          // Sólo administradores pueden iniciar sesión en el client-admin.
          const role = data?.userDetails?.role;
          if (role !== "ADMIN_ROLE") {
            const message =
              "No tienes permisos para acceder como administrador.";

            set({
              user: null,
              token: null,
              refreshToken: null,
              expiresAt: null,
              isAuthenticated: false,
              loading: false,
              error: message,
            });

            showError(message);
            return { success: false, error: message };
          }

          set({
            user: data.userDetails,
            token: data.accessToken || data.token,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresIn || data.expiresAt,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true };
        } catch (err) {
          console.error("Login error:", err);
          const message =
            err.response?.data?.message || "Error de autenticación";
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
            data,
          };
        } catch (err) {
          const message = err.response?.data?.message || "Error al registrarse";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      forgotPassword: async (email) => {
        try {
          set({ loading: true, error: null });
          const { data } = await forgotPasswordRequest(email);
          set({ loading: false });
          return { success: true, data };
        } catch (err) {
          const message =
            err.response?.data?.message || "Error al enviar el correo";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      resetPassword: async ({ token, newPassword }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await resetPasswordRequest(token, newPassword);
          set({ loading: false });
          return { success: true, data };
        } catch (err) {
          const message =
            err.response?.data?.message || "Error al restablecer contraseña";
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      // ...rest of store logic
    }),
    { name: "auth-store" },
  ),
);
