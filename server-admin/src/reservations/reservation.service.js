import Reservation from './reservation.model.js';

export const fetchReservations = async ({
  page = 1,
  limit = 10,
  status,
  fieldId,
  date,
  userId,
}) => {
  const filter = {};

  if (status) filter.status = status;
  if (fieldId) filter.fieldId = fieldId;
  if (userId) filter.userId = userId;

  // Filtro por fecha (día completo)
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    filter.startTime = {
      $gte: startDate,
      $lt: endDate,
    };
  }

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const reservations = await Reservation.find(filter)
    .limit(limitNumber * 1)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ startTime: -1 })
    .populate('fieldId', 'fieldName fieldType location pricePerHour');

  const total = await Reservation.countDocuments(filter);

  return {
    reservations,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

export const fetchReservationById = async (id) => {
  return Reservation.findById(id).populate(
    'fieldId',
    'fieldName fieldType location pricePerHour capacity'
  );
};

export const confirmReservationById = async ({ reservation, adminId }) => {
  reservation.status = 'CONFIRMED';
  reservation.confirmation = {
    confirmedAt: new Date(),
    confirmedBy: adminId,
  };
  reservation.lastModifiedBy = adminId;

  await reservation.save();
  await reservation.populate('fieldId');
  await reservation.populate('userId');
  return reservation;
};

export const cancelReservationById = async ({ id, adminId }) => {
  const reservation = await Reservation.findById(id);

  if (!reservation) {
    return null;
  }

  if (!['PENDING', 'CONFIRMED'].includes(reservation.status)) {
    throw new Error(
      `No se puede cancelar una reserva con estado: ${reservation.status}`
    );
  }

  reservation.status = 'CANCELLED';
  reservation.lastModifiedBy = adminId;

  await reservation.save();
  return reservation;
};
