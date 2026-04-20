import {
  fetchTournaments,
  fetchTournamentById,
  createTournamentRecord,
  updateTournamentRecord,
  updateTournamentStatus,
  deleteTournamentRecord,
} from './tournaments.service.js';

// Obtener todos los torneos con paginación y filtro
export const getTournaments = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, category } = req.query;

    const { tournaments, pagination } = await fetchTournaments({
      page,
      limit,
      isActive,
      category,
    });

    res.status(200).json({
      success: true,
      data: tournaments,
      pagination,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los torneos',
      error: error.message,
    });
  }
};

// Obtener torneo por ID
export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await fetchTournamentById(id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el torneo',
      error: error.message,
    });
  }
};

// Crear torneo
export const createTournament = async (req, res) => {
  try {
    const tournament = await createTournamentRecord(req.body);

    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al crear el torneo',
      error: error.message,
    });
  }
};

// Actualizar torneo
export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await updateTournamentRecord({
      id,
      updateData: req.body,
    });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error al actualizar el torneo',
      error: error.message,
    });
  }
};

// Cambiar estado del torneo (activar/desactivar)
export const changeTournamentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const isActive = req.url.includes('/activate');
    const action = isActive ? 'activado' : 'desactivado';

    const tournament = await updateTournamentStatus({ id, isActive });

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: `Torneo ${action} exitosamente`,
      data: tournament,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'error al cambiar el estado del torneo',
      error: error.message,
    });
  }
};

// eliminar torneo
export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const tournament = await deleteTournamentRecord(id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Torneo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Torneo eliminado exitosamente',
      data: tournament,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el torneo',
      error: error.message,
    });
  }
};
