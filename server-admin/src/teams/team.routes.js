import { Router } from 'express';
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  changeTeamStatus,
  changeTeamManager,
} from './team.controller.js';
import {
  validateCreateTeam,
  validateUpdateTeamRequest,
  validateTeamStatusChange,
  validateGetTeamById,
  authorizeUpdateTeam,
  validateChangeTeamManager,
} from '../../middlewares/team-validators.js';
import { uploadTeamImage } from '../../middlewares/file-uploader.js';
import { cleanupUploadedFileOnFinish } from '../../middlewares/delete-file-on-error.js';
import { requireRole } from '../../middlewares/validate-role.js';
import { authOrInternal } from '../../middlewares/validate-internal-token.js';

const router = Router();

// Rutas GET - Permiten autenticación mixta para ser consumidos por el microservicio de usuarios
router.get('/', authOrInternal, getTeams);
router.get('/:id', authOrInternal, validateGetTeamById, getTeamById);

// Rutas POST - Crear un equipo oficial (Solo ADMIN)
router.post(
  '/',
  uploadTeamImage.single('logo'),
  cleanupUploadedFileOnFinish,
  validateCreateTeam,
  requireRole('ADMIN_ROLE'), // Validar rol antes de subir logo
  createTeam
);

/**
 * Rutas PUT - Administradores o dueños del equipo según authorizeUpdateTeam
 * Note: authorizeUpdateTeam ya valida internamente el rol, por lo que va al inicio.
 */
router.put(
  '/:id',
  uploadTeamImage.single('logo'),
  cleanupUploadedFileOnFinish,
  validateUpdateTeamRequest,
  authorizeUpdateTeam,
  updateTeam
);

// Gestión de estado y manager (Restringido solo a ADMIN)
router.put(
  '/:id/activate',
  validateTeamStatusChange,
  requireRole('ADMIN_ROLE'),
  changeTeamStatus
);

router.put(
  '/:id/deactivate',
  validateTeamStatusChange,
  requireRole('ADMIN_ROLE'),
  changeTeamStatus
);

router.put(
  '/:id/manager',
  validateChangeTeamManager,
  requireRole('ADMIN_ROLE'),
  changeTeamManager
);

export default router;
