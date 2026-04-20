'use strict';

import { Router } from 'express';
import {
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
} from './user.controller.js';
//import { uploadProfileImage } from '../../middlewares/file-uploader.js';

const router = Router();

// Todas las rutas de perfil requieren autenticación previa vía app.js
router.get('/profile', getMyProfile);
router.put('/profile', updateMyProfile);
router.post(
  '/profile/avatar',
  //uploadProfileImage.single('avatar'),
  uploadAvatar
);

export default router;
