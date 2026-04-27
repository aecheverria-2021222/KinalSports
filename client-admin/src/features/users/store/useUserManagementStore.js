import { create } from 'zustand';
import { getAllUsers as getAllUsersRequest } from '../../../shared/apis';

export const useUserManagementStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  filters: {},

  setFilters: (filters) => set({ filters }),

  setUser: (users) => set({ users }),

  getAllUsers: async (apiFn = getAllUsersRequest, options = {}) => {
    try {
      const { force = false } = options;
      const state = get();

      if (state.loading) return;
      if (!force && state.users.length > 0) return;

      set({ loading: true, error: null });

      const fetcher = typeof apiFn === 'function' ? apiFn : getAllUsersRequest;
      const response = await fetcher();

      set({
        users: response.users || response,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al listar usuarios',
        loading: false,
      });
    }
  },
}));
