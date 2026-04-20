import { Router } from 'express';
import {
  getTournaments,
  getTournamentById,
  registerTeamToTournament,
  getMyTournaments,
} from './tournament.controller.js';

const router = Router();

// Listar torneos
router.get('/', getTournaments);
// Ver detalles de un torneo
router.get('/:id', getTournamentById);
// Inscribir equipo en torneo
router.post('/:id/register', registerTeamToTournament);
// Ver mis torneos
router.get('/me/mis-torneos', getMyTournaments);

export default router;
