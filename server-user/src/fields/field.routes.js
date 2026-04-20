import { Router } from 'express';
import { getFields, getFieldById } from './field.controller.js';

const router = Router();

// Rutas GET - Públicas para usuarios
router.get('/', getFields);
router.get('/:id', getFieldById);

export default router;
