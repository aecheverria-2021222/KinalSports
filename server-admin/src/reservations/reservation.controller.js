import {
  fetchReservations,
  fetchReservationById,
  confirmReservationById,
  cancelReservationById,
} from './reservation.service.js';

// Obtener todas las reservas con paginación y filtros
export const getReservations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, fieldId, date, userId } = req.query;

    const { reservations, pagination } = await fetchReservations({
      page,
      limit,
      status,
      fieldId,
      date,
      userId,
    });

    res.status(200).json({
      success: true,
      data: reservations,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las reservas',
      error: error.message,
    });
  }
};

// Obtener reserva por ID
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const reservation = await fetchReservationById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada',
      });
    }

    // Solo admin o el dueño de la reserva pueden verla
    if (userRole !== 'ADMIN_ROLE' && reservation.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta reserva',
        error: 'FORBIDDEN',
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la reserva',
      error: error.message,
    });
  }
};

// Confirmar reserva
export const confirmReservation = async (req, res) => {
  try {
    const adminId = req.user?.id || 'admin';
    const reservation = req.reservation;

    if (!reservation) {
      return res.status(500).json({
        success: false,
        message: 'Reserva no fue cargada por middleware',
      });
    }

    if (reservation.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: `No se puede confirmar una reserva con estado: ${reservation.status}`,
      });
    }

    const confirmedReservation = await confirmReservationById({
      reservation,
      adminId,
    });

    res.status(200).json({
      success: true,
      message: 'Reserva confirmada exitosamente',
      data: confirmedReservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al confirmar la reserva',
      error: error.message,
    });
  }
};

// Cancelar reserva
export const cancelReservation = async (req, res) => {
  try {
    const adminId = req.user?.id || 'admin';
    const { id } = req.params;

    const reservation = await cancelReservationById({ id, adminId });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reserva no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reserva cancelada exitosamente',
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la reserva',
      error: error.message,
    });
  }
};
