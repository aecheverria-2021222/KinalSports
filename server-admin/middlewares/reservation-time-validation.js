'use strict';

// Middleware para validar startTime y endTime en el body (ISO 8601)
export const validateReservationTimes = (req, res, next) => {
  const { startTime, endTime } = req.body;

  if (!startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'startTime y endTime son requeridos',
    });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Formato de fecha inválido, usar ISO 8601',
    });
  }

  if (end <= start) {
    return res.status(400).json({
      success: false,
      message: 'endTime debe ser posterior a startTime',
    });
  }

  // Adjuntamos objetos Date normalizados para evitar múltiples parseos
  req.startDateObj = start;
  req.endDateObj = end;
  next();
};
