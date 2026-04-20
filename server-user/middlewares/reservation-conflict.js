'use strict';

import Reservation from '../src/reservations/reservation.model.js';

// Middleware para detectar conflictos de horario en creación de reservas
// Usa el mismo enfoque que server-admin
export const checkReservationConflict = async (req, res, next) => {
  try {
    const { fieldId, startTime, endTime } = req.body;
    if (!fieldId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'fieldId, startTime y endTime son requeridos',
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    const conflicts = await Reservation.findConflictingReservations(
      fieldId,
      start,
      end,
      null
    );

    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Conflicto de horario con otras reservas',
        conflicts: conflicts.map((c) => ({
          id: c._id,
          startTime: c.startTime,
          endTime: c.endTime,
          status: c.status,
        })),
      });
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
