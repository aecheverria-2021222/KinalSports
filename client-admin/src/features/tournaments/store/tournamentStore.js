import { create } from "zustand";
import {
  getTournaments as getTournamentsRequest,
  createTournament as createTournamentRequest,
  updateTournament as _updateTournamentRequest,
  deleteTournament as _deleteTournamentRequest,
} from "../../../shared/api";

export const useTournamentsStore = create((set, get) => ({
  tournaments: [],
  loading: false,
  error: null,

  getTournaments: async () => {
    try {
      set({ loading: true, error: null });

      const response = await getTournamentsRequest();

      set({
        tournaments: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al obtener torneos",
        loading: false,
      });
    }
  },

  createTournament: async (data) => {
    try {
      set({ loading: true, error: null });

      const response = await createTournamentRequest(data);

      set({
        tournaments: [response.data.data, ...get().tournaments],
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Error al crear torneo",
      });
    }
  },
  updateTournament: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const response = await _updateTournamentRequest(id, data);
      set({
        tournaments: get().tournaments.map((t) =>
          t._id === id ? response.data.data : t,
        ),
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Error al actualizar torneo",
      });
    }
  },

  deleteTournament: async (id) => {
    try {
      set({ loading: true, error: null });
      await _deleteTournamentRequest(id);
      set({
        tournaments: get().tournaments.filter((tournament) => tournament._id !== id),
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Error al desactivar torneo",
      });
      throw error;
    }
  },
}));
