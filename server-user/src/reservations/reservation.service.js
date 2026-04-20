'use strict';

import Reservation from './reservation.model.js';

/**
 * Guardar nueva reservación.
 */
export const registerReservation = async (reservationData, userId) => {
  const reservation = new Reservation({
    ...reservationData,
    userId,
    status: 'PENDING',
    lastModifiedBy: userId,
  });

  await reservation.save();
  return reservation;
};

/**
 * Cancelar una reservación si pertenece al usuario y su estado lo permite.
 */
export const cancelUserReservation = async (reservationId, userId) => {
  const reservation = await Reservation.findOne({
    _id: reservationId,
    userId,
  });

  if (!reservation) return null;

  if (['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(reservation.status)) {
    throw new Error(
      `No se puede cancelar una reserva con estado ${reservation.status}`
    );
  }

  reservation.status = 'CANCELLED';
  reservation.lastModifiedBy = userId;
  await reservation.save();

  return reservation;
};

/**
 * Obtener historial de reservaciones del usuario.
 */
export const fetchUserReservationHistory = async (userId) => {
  return await Reservation.find({ userId })
    .populate(
      'fieldId',
      'fieldName photo pricePerHour fieldType capacity isActive'
    )
    .sort({ startTime: -1 });
};

/**
 * Consultar lapsos de tiempo ocupados para un campo en una fecha.
 */
export const fetchOccupiedSlots = async (fieldId, date) => {
  const searchDate = new Date(date);
  const nextDay = new Date(date);
  nextDay.setDate(searchDate.getDate() + 1);

  return await Reservation.find({
    fieldId,
    status: { $nin: ['CANCELLED', 'NO_SHOW'] },
    startTime: {
      $gte: searchDate,
      $lt: nextDay,
    },
  }).select('startTime endTime -_id');
};
