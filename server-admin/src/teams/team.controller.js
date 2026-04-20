import {
  fetchTeams,
  fetchTeamById,
  createTeamRecord,
  updateTeamRecord,
  updateTeamManager,
  updateTeamStatus,
} from './team.service.js';

// Obtener todos los equipos con paginación y filtros
export const getTeams = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, category } = req.query;

    const { teams, pagination } = await fetchTeams({
      page,
      limit,
      isActive,
      category,
    });

    res.status(200).json({
      success: true,
      data: teams,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los equipos',
      error: error.message,
    });
  }
};

// Obtener equipo por ID
export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await fetchTeamById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el Equipo',
      error: error.message,
    });
  }
};

// Crear nuevo equipo
export const createTeam = async (req, res) => {
  try {
    const team = await createTeamRecord({
      teamData: req.body,
      file: req.file,
    });

    return res.status(201).json({
      success: true,
      message: 'Equipo creado correctamente',
      data: team,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error al crear el equipo',
      error: error.message,
    });
  }
};

// Actualizar equipo
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await updateTeamRecord({
      id,
      updateData: req.body,
      file: req.file,
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Equipo actualizado exitosamente',
      data: team,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el equipo',
      error: error.message,
    });
  }
};

// Cambiar manager del equipo (solo admin via ruta dedicada)
export const changeTeamManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { managerId } = req.body;

    const team = await updateTeamManager({ id, managerId });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Manager del equipo actualizado exitosamente',
      data: team,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error al actualizar el manager del equipo',
      error: error.message,
    });
  }
};

// Cambiar estado del equipo (activar/desactivar)
export const changeTeamStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Detectar si es activate o deactivate desde la URL
    const isActive = req.url.includes('/activate');
    const action = isActive ? 'activado' : 'desactivado';

    const team = await updateTeamStatus({ id, isActive });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: `Equipo ${action} exitosamente`,
      data: team,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del equipo',
      error: error.message,
    });
  }
};
