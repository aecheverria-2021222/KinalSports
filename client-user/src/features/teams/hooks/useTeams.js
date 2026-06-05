// c:/gitIN6AM/KinalSports/client-user/src/features/teams/hooks/useTeams.js
import { useState, useCallback } from 'react';
import userClient from '../../../shared/api/userClient.js';
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
      setTeams(response.data?.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener equipos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTeams = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/teams/me/mis-equipos');
      setMyTeams(response.data?.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener tus equipos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const joinTeam = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post(`/teams/${id}/join`);
      await fetchTeams();
      await fetchMyTeams();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al unirse al equipo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const leaveTeam = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post(`/teams/${id}/leave`);
      await fetchTeams();
      await fetchMyTeams();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al salir del equipo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post('/teams', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchTeams();
      await fetchMyTeams();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear equipo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { teams, myTeams, loading, error, fetchTeams, fetchMyTeams, joinTeam, leaveTeam, createTeam };
};
