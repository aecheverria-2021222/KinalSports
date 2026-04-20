import { Router } from 'express';
import {
  getTeams,
  getTeamById,
  joinTeam,
  getMyTeams,
  leaveTeam,
  createTeam,
} from './team.controller.js';
import { uploadTeamImage } from '../../middlewares/file-uploader.js';

const router = Router();

// Listar equipos
router.get('/', getTeams);
// Crear un equipo con imagen
router.post('/', uploadTeamImage.single('logo'), createTeam);
// Ver detalles de un equipo
router.get('/:id', getTeamById);
// Solicitar unirse a un equipo
router.post('/:id/join', joinTeam);
// Ver mis equipos
router.get('/me/mis-equipos', getMyTeams);
// Salir de un equipo
router.post('/:id/leave', leaveTeam);

export default router;
