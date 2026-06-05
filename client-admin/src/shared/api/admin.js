import { axiosAdmin } from "./api";

// ================= TOURNAMENTS =================
export const getTournaments = async () => {
  return await axiosAdmin.get("/tournaments");
};

export const createTournament = async (data) => {
  return await axiosAdmin.post("/tournaments", data);
};

export const updateTournament = async (id, data) => {
  return await axiosAdmin.put(`/tournaments/${id}`, data);
};

export const deleteTournament = async (id) => {
  return await axiosAdmin.put(`/tournaments/${id}/deactivate`);
};

// ================= TEAMS =================
export const getTeams = async () => {
  return await axiosAdmin.get("/teams");
};

export const createTeam = async (data) => {
  return await axiosAdmin.post("/teams", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateTeam = async (id, data) => {
  return await axiosAdmin.put(`/teams/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteTeam = async (id) => {
  return await axiosAdmin.put(`/teams/${id}/deactivate`);
};

// ================= FIELDS =================
export const getFields = async () => {
  return await axiosAdmin.get("/fields");
};

export const createField = async (data) => {
  return await axiosAdmin.post("/fields", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateField = async (id, data) => {
  return await axiosAdmin.put(`/fields/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteField = async (id) => {
  return await axiosAdmin.put(`/fields/${id}/deactivate`);
};

// ================= RESERVATIONS =================
export const getAllReservations = async () => {
  return await axiosAdmin.get("/reservations");
};

export const confirmReservation = async (id) => {
  return await axiosAdmin.put(`/reservations/${id}/confirm`);
};

export const cancelReservation = async (id) => {
  return await axiosAdmin.put(`/reservations/${id}/cancel`);
};
