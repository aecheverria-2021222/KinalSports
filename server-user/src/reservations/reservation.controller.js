'use strict';

import {
  registerReservation,
  cancelUserReservation,
  fetchUserReservationHistory,
  fetchOccupiedSlots,
} from './reservation.service.js';

/**
 * Crear reservación.
 */
export const createReservation = async (req, res) => {
  try {
    const { fieldId, startTime, endTime } = req.body;
    const userId = req.user.id;

    const reservation = await registerReservation(
      { fieldId, startTime, endTime },
      userId
    );

    return res.status(201).json({
      success: true,
      message: 'Reserva creada correctamente',
      data: reservation,
    });
  } catch (error) {
    console.error('Error en createReservation controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la reservación',
      error: error.message,
    });
  }
};

/**
 * Cancelar reservación (Usuario).
 */
export const cancelReservation = async (req, res) => {
  try {
    const { id: reservationId } = req.params;
    const userId = req.user.id;

    const reservation = await cancelUserReservation(reservationId, userId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada o no pertenece al usuario autenticado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Reserva cancelada correctamente',
      data: reservation,
    });
  } catch (error) {
    const isClientError = error.message.includes('No se puede cancelar');
    return res.status(isClientError ? 400 : 500).json({
      success: false,
      message: error.message || 'Error interno al cancelar la reservación',
    });
  }
};

/**
 * Ver historial del usuario.
 */
export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await fetchUserReservationHistory(userId);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error en getUserHistory controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la obtención del historial de reservaciones',
      error: error.message,
    });
  }
};

/**
 * Verificar disponibilidad por fecha.
 */
export const checkAvailability = async (req, res) => {
  try {
    const { fieldId, date } = req.query;

    if (!fieldId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar fieldId y date (en formato YYYY-MM-DD)',
      });
    }

    const occupiedSlots = await fetchOccupiedSlots(fieldId, date);

    return res.status(200).json({
      success: true,
      data: occupiedSlots,
    });
  } catch (error) {
    console.error('Error en checkAvailability controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno al consultar disponibilidad del campo deportivo',
      error: error.message,
    });
  }
};
