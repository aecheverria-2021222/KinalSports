// c:\gitIN6AM\KinalSports\client-user\src\features\teams\hooks\useTeams.js
import { useState, useCallback, useEffect } from 'react';
import { userClient } from '../../../shared/api/userClient.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const user = useAuthStore(state => state.user);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/teams');
      const data = response.data?.data || response.data || [];
      const normalizedData = data.map(t => ({ ...t, id: t._id || t.id }));
      setTeams(normalizedData);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener equipos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTeams = useCallback(async () => {
    if (!user?.id && !user?._id) return;
    const userId = user.id || user._id;

    setLoading(true);
    setError(null);
    try {
      // El prompt dice "GET /teams/me/mis-equipos (enviando el ID del usuario autenticado)"
      // Lo mandamos como query param, ajustar si es en el path o body (aunque GET no lleva body).
      const response = await userClient.get('/teams/me/mis-equipos', { params: { userId } });
      const data = response.data?.data || response.data || [];
      const normalizedData = data.map(t => ({ ...t, id: t._id || t.id }));
      setMyTeams(normalizedData);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener tus equipos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const joinTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post(`/teams/${teamId}/join`);
      await Promise.all([fetchTeams(), fetchMyTeams()]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al unirse al equipo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTeams, fetchMyTeams]);

  const leaveTeam = useCallback(async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post(`/teams/${teamId}/leave`);
      await Promise.all([fetchTeams(), fetchMyTeams()]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al abandonar el equipo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTeams, fetchMyTeams]);

  const createTeam = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // formData debe ser una instancia de FormData
      await userClient.post('/teams', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await Promise.all([fetchTeams(), fetchMyTeams()]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el equipo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTeams, fetchMyTeams]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return { teams, myTeams, loading, error, fetchTeams, fetchMyTeams, joinTeam, leaveTeam, createTeam };
};
