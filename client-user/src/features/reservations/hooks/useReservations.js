// c:\gitIN6AM\KinalSports\client-user\src\features\reservations\hooks\useReservations.js
import { useState, useCallback, useEffect } from 'react';
import { userClient } from '../../../shared/api/userClient.js';

export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/reservations/me/history');
      const data = response.data?.data || response.data || [];
      
      const normalizedData = data.map(res => ({
        ...res,
        id: res._id || res.id,
        status: res.status?.toUpperCase() || 'UNKNOWN'
      }));
      setReservations(normalizedData);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener historial de reservas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (reservationData) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.post('/reservations', reservationData);
      await fetchHistory();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la reserva');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  const cancelReservation = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.put(`/reservations/${id}/cancel`);
      await fetchHistory();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cancelar la reserva');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { reservations, loading, error, fetchHistory, createReservation, cancelReservation };
};
