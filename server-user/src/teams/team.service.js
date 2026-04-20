'use strict';

import Team from './team.model.js';

/**
 * Listar todos los equipos deportivos activos.
 */
export const fetchTeams = async () => {
  return await Team.find({ isActive: true });
};

/**
 * Crear un nuevo equipo.
 */
export const createTeam = async (data) => {
  const newTeam = new Team(data);
  await newTeam.save();
  return newTeam;
};

/**
 * Obtener detalle de un equipo por ID.
 */
export const fetchTeamById = async (id) => {
  return await Team.findById(id);
};

/**
 * Listar equipos donde el usuario es miembro.
 */
export const fetchMyTeams = async (userId) => {
  return await Team.find({ members: userId, isActive: true });
};

/**
 * Agregar un miembro a un equipo si no existe previamente.
 */
export const addTeamMember = async (teamId, userId) => {
  const team = await Team.findById(teamId);
  if (!team) return null;

  if (team.members.includes(userId)) {
    throw new Error('Ya eres miembro de este equipo');
  }

  team.members.push(userId);
  await team.save();
  return team;
};

/**
 * Remover a un usuario de un equipo, si es miembro y no es el manager.
 */
export const removeTeamMember = async (teamId, userId) => {
  const team = await Team.findById(teamId);
  if (!team) return null;

  if (!team.members.includes(userId)) {
    throw new Error('No perteneces a este equipo');
  }

  if (team.managerId.toString() === userId) {
    throw new Error(
      'Como manager del equipo, no puedes abandonarlo mediante esta vía.'
    );
  }

  team.members = team.members.filter((m) => m.toString() !== userId.toString());
  await team.save();
  return team;
};
