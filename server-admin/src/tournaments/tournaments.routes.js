import { Router } from 'express';
import {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  changeTournamentStatus,
  deleteTournament,
} from './tournaments.controller.js';
import {
  validateCreateTournament,
  validateUpdateTournamentRequest,
  validateTournamentStatusChange,
  validateGetTournamentById,
  validateDeleteTournament,
} from '../../middlewares/tournament-validators.js';
import { requireRole } from '../../middlewares/validate-role.js';
import { authOrInternal } from '../../middlewares/validate-internal-token.js';

const router = Router();

// Rutas GET - Públicas o consumidas por server-user vía x-internal-token
router.get('/', authOrInternal, getTournaments);
router.get(
  '/:id',
  authOrInternal,
  validateGetTournamentById,
  getTournamentById
);

// Rutas de escritura - SOLO para administradores globales
router.post(
  '/',
  validateCreateTournament,
  requireRole('ADMIN_ROLE'),
  createTournament
);

router.put(
  '/:id',
  validateUpdateTournamentRequest,
  requireRole('ADMIN_ROLE'),
  updateTournament
);

router.put(
  '/:id/activate',
  validateTournamentStatusChange,
  requireRole('ADMIN_ROLE'),
  changeTournamentStatus
);

router.put(
  '/:id/deactivate',
  validateTournamentStatusChange,
  requireRole('ADMIN_ROLE'),
  changeTournamentStatus
);

router.delete(
  '/:id',
  validateDeleteTournament,
  requireRole('ADMIN_ROLE'),
  deleteTournament
);

export default router;
