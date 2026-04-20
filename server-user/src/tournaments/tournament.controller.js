'use strict';

import {
  fetchTournaments,
  fetchTournamentById,
  fetchMyTournaments,
  registerTeam,
} from './tournament.service.js';

/**
 * Listar torneos activos.
 */
export const getTournaments = async (req, res) => {
  try {
    const torneos = await fetchTournaments();
    return res.status(200).json({
      success: true,
      data: torneos,
    });
  } catch (error) {
    console.error('Error en getTournaments controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los torneos deportivos',
      error: error.message,
    });
  }
};

/**
 * Detalle del torneo.
 */
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

    return res.status(200).json({
      success: true,
      data: tournament,
    });
  } catch (error) {
    console.error('Error en getTournamentById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el detalle del torneo',
      error: error.message,
    });
  }
};

/**
 * Inscripción de equipo.
 */
export const registerTeamToTournament = async (req, res) => {
  try {
    const { id: tournamentId } = req.params;
    const { teamId } = req.body;
    const userId = req.user.id;

    const { localTournament, teamName } = await registerTeam(
      tournamentId,
      teamId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: `Enhorabuena, el equipo ${teamName} ha sido inscrito exitosamente.`,
      data: localTournament,
    });
  } catch (error) {
    const isClientError =
      error.message.includes('No encontrado') ||
      error.message.includes('Solo el capitán') ||
      error.message.includes('no está disponible') ||
      error.message.includes('ya está inscrito');

    return res.status(isClientError ? 400 : 500).json({
      success: false,
      message: error.message || 'Error al intentar inscribir al equipo',
    });
  }
};

/**
 * Torneos de mis equipos.
 */
export const getMyTournaments = async (req, res) => {
  try {
    const userId = req.user.id;
    const tournaments = await fetchMyTournaments(userId);

    return res.status(200).json({
      success: true,
      data: tournaments,
    });
  } catch (error) {
    console.error('Error en getMyTournaments controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener tus torneos participados',
      error: error.message,
    });
  }
};
