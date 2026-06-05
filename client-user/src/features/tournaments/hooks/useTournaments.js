// c:/gitIN6AM/KinalSports/client-user/src/features/tournaments/hooks/useTournaments.js
import { useState, useCallback } from 'react';
import userClient from '../../../shared/api/userClient.js';

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/tournaments');
      setTournaments(response.data?.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener torneos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/tournaments/my-tournaments');
      setMyTournaments(response.data?.data || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener tus torneos');
    } finally {
      setLoading(false);
    }
  }, []);

  const registerTeam = async (tournamentId, teamId) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post(`/tournaments/register/${tournamentId}`, { teamId });
      await fetchTournaments();
      await fetchMyTournaments();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al inscribir equipo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { tournaments, myTournaments, loading, error, fetchTournaments, fetchMyTournaments, registerTeam };
};
