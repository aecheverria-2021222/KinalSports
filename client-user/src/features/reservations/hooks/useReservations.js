// c:/gitIN6AM/KinalSports/client-user/src/features/reservations/hooks/useReservations.js
import { useState, useCallback } from 'react';
import userClient from '../../../shared/api/userClient.js';

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
      const mapped = data.map(res => ({
        ...res,
        field: res.field ? { id: res.field._id, name: res.field.fieldName || res.field.name, image: res.field.photo || res.field.image } : null,
        normalizedStatus: res.status ? res.status.toUpperCase() : 'UNKNOWN'
      }));
      setReservations(mapped);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener historial');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = async (reservationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.post('/reservations', reservationData);
      return response.data?.data || response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await userClient.put(`/reservations/${id}/cancel`);
      await fetchHistory();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cancelar reserva');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { reservations, loading, error, fetchHistory, createReservation, cancelReservation };
};
