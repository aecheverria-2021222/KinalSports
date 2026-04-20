'use strict';

import Reservation from '../src/reservations/reservation.model.js';

// Middleware para detectar conflictos de horario.
// Uso dual:
//  - Creación: requiere fieldId, startTime, endTime en req.body
//  - Confirmación: si viene :id, usa los datos ya guardados en la reserva
export const checkReservationConflict = async (req, res, next) => {
  try {
    let fieldId;
    let start;
    let end;
    let reservation;

    // Caso confirmación (existe param id)
    if (req.params.id) {
      reservation = await Reservation.findById(req.params.id);
      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'Reserva no encontrada',
        });
      }
      fieldId = reservation.fieldId;
      start = reservation.startTime;
      end = reservation.endTime;
      req.reservation = reservation; // adjuntar para controlador
    } else {
      // Caso creación
      const { fieldId: fieldIdBody, startTime, endTime } = req.body;
      if (!fieldIdBody || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: 'fieldId, startTime y endTime son requeridos',
        });
      }
      fieldId = fieldIdBody;
      start = new Date(startTime);
      end = new Date(endTime);
    }

    const conflicts = await Reservation.findConflictingReservations(
      fieldId,
      start,
      end,
      reservation?._id || null
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

    next();
  } catch (err) {
    next(err);
  }
};
