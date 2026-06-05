import { create } from "zustand";
import {
  getAllUsers as getAllUsersRequest,
  updateUserRole as updateUserRoleRequest,
} from "../../../shared/api/auth.js";

export const useUserManagementStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  filters: {},

  setFilters: (filters) => set({ filters }),

  setUsers: (users) => set({ users }),

  fetchUsers: async (apiFn = getAllUsersRequest, options = {}) => {
    try {
      const { force = false } = options;
      const state = get();

      if (state.loading) return;
      if (!force && state.users.length > 0) return;

      set({ loading: true, error: null });

      const fetcher = typeof apiFn === "function" ? apiFn : getAllUsersRequest;
      const response = await fetcher();

      set({
        users: response.users || response,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al cargar usuarios",
        loading: false,
      });
    }
  },

  updateUserRole: async (userId, newRole) => {
    try {
      set({ loading: true, error: null });

      if (typeof updateUserRoleRequest !== "function") {
        throw new Error("La función updateUserRole no está disponible");
      }

      const { data: updatedUser } = await updateUserRoleRequest(userId, newRole);

      set({
        users: get().users.map((user) =>
          user.id === updatedUser.id
            ? { ...user, role: updatedUser.role }
            : user,
        ),
        loading: false,
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error al cambiar rol",
        loading: false,
      });

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  },
}));
