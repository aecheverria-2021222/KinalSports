// c:\gitIN6AM\KinalSports\client-user\src\features\tournaments\hooks\useTournaments.js
import { useState, useCallback, useEffect } from 'react';
import { userClient } from '../../../shared/api/userClient.js';

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
      const data = response.data?.data || response.data || [];
      const normalizedData = data.map(t => ({ ...t, id: t._id || t.id }));
      setTournaments(normalizedData);
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
      const data = response.data?.data || response.data || [];
      const normalizedData = data.map(t => ({ ...t, id: t._id || t.id }));
      setMyTournaments(normalizedData);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener tus torneos');
    } finally {
      setLoading(false);
    }
  }, []);

  const registerInTournament = useCallback(async (tournamentId, teamId) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post(`/tournaments/register/${tournamentId}`, { teamId });
      await Promise.all([fetchTournaments(), fetchMyTournaments()]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar el equipo en el torneo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTournaments, fetchMyTournaments]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return { tournaments, myTournaments, loading, error, fetchTournaments, fetchMyTournaments, registerInTournament };
};
