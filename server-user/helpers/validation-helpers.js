'use strict';

export const validateEndTimeAfterStartTime = (endTimeValue, { req }) => {
  const start = new Date(req.body.startTime);
  const end = new Date(endTimeValue);

  if (end <= start) {
    throw new Error('endTime debe ser posterior a startTime');
  }

  return true;
};

export const validateFutureDate = (dateValue) => {
  const inputDate = new Date(dateValue);
  const now = new Date();

  if (inputDate < now) {
    throw new Error('La fecha no puede estar en el pasado');
  }

  return true;
};

export const validateMinDuration = (minMinutes) => {
  return (endTimeValue, { req }) => {
    const start = new Date(req.body.startTime);
    const end = new Date(endTimeValue);
    const durationMs = end - start;
    const durationMinutes = durationMs / (1000 * 60);

    if (durationMinutes < minMinutes) {
      throw new Error(`La duración mínima debe ser de ${minMinutes} minutos`);
    }

    return true;
  };
};

export const validateMaxDuration = (maxMinutes) => {
  return (endTimeValue, { req }) => {
    const start = new Date(req.body.startTime);
    const end = new Date(endTimeValue);
    const durationMs = end - start;
    const durationMinutes = durationMs / (1000 * 60);

    if (durationMinutes > maxMinutes) {
      throw new Error(`La duración máxima debe ser de ${maxMinutes} minutos`);
    }

    return true;
  };
};
