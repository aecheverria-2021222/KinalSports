'use strict';

import Tournament from './tournament.model.js';
import Team from '../teams/team.model.js';
import adminClient from '../../utils/adminClient.js';

/**
 * Listar todos los torneos activos.
 */
export const fetchTournaments = async () => {
  return await Tournament.find({ isActive: true });
};

/**
 * Detalle de un torneo por ID.
 */
export const fetchTournamentById = async (id) => {
  return await Tournament.findById(id);
};

/**
 * Torneos en los que participa el usuario mediante sus equipos.
 */
export const fetchMyTournaments = async (userId) => {
  const myTeams = await Team.find({ members: userId }).select('_id');
  const myTeamIds = myTeams.map((team) => team._id);

  return await Tournament.find({
    teams: { $in: myTeamIds },
    isActive: true,
  });
};

/**
 * Inscribir equipo en torneo.
 * Valida permisos del capitán y estado del torneo contra admin-service.
 */
export const registerTeam = async (tournamentId, teamId, userId) => {
  const team = await Team.findById(teamId);
  if (!team) throw new Error('Equipo no encontrado');

  if (team.managerId.toString() !== userId.toString()) {
    throw new Error('Solo el capitán del equipo puede inscribirlo.');
  }

  // 1. Validar torneo con el servicio administrativo
  const adminResponse = await adminClient.get(`/tournaments/${tournamentId}`);
  if (
    !adminResponse.data.success ||
    adminResponse.data.data.status !== 'PENDIENTE'
  ) {
    throw new Error('El torneo no está disponible para inscripción.');
  }

  const externalData = adminResponse.data.data;

  // 2. Sincronizar (Caché local) si no existe
  let localTournament = await Tournament.findById(tournamentId);

  if (!localTournament) {
    localTournament = new Tournament({
      _id: tournamentId,
      tournamentsName: externalData.tournamentsName,
      category: externalData.category,
      startDate: externalData.startDate,
      endDate: externalData.endDate,
      status: externalData.status,
      isActive: externalData.isActive,
    });
    await localTournament.save();
  }

  // 3. Validar duplicados e inscribir
  if (localTournament.teams.some((t) => t.toString() === teamId.toString())) {
    throw new Error('El equipo ya está inscrito en este torneo.');
  }

  localTournament.teams.push(teamId);

  await localTournament.save();

  return { localTournament, teamName: team.teamName };
};
