'use strict';

import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { requireRole } from './validate-role.js';
import { checkValidators } from './check-validators.js';
import Team from '../src/teams/team.model.js';

// Validaciones para crear equipos
export const validateCreateTeam = [
  validateJWT,
  body('teamName')
    .trim()
    .notEmpty()
    .withMessage('El nombre del equipo es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('managerId')
    .notEmpty()
    .withMessage('El ID del manager es requerido')
    .isString()
    .withMessage('El ID del manager debe ser texto')
    .matches(/^[A-Za-z0-9_-]{6,64}$/)
    .withMessage('ID de manager inválido'),
  body('category')
    .notEmpty()
    .withMessage('La categoría es requerida')
    .isIn(['FUTBOL_7', 'FUTBOL_11'])
    .withMessage('Categoría no válida'),
  checkValidators,
];

export const validateUpdateTeamRequest = [
  validateJWT,
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  body('teamName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('category')
    .optional()
    .isIn(['FUTBOL_7', 'FUTBOL_11'])
    .withMessage('Categoría no válida'),
  checkValidators,
];

// Autorización de actualización:
// - ADMIN_ROLE: puede actualizar cualquier equipo
// - USER_ROLE: solo puede actualizar si el team.managerId coincide con req.user.id
export const authorizeUpdateTeam = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        error: 'UNAUTHORIZED',
      });
    }

    const { role, id: userId } = req.user;

    if (role === 'ADMIN_ROLE') {
      return next();
    }

    if (role !== 'USER_ROLE') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar equipos',
        error: 'FORBIDDEN',
      });
    }

    const { id } = req.params;
    const team = await Team.findById(id).select('managerId');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Equipo no encontrado',
      });
    }

    if (team.managerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Solo puedes actualizar tu propio equipo',
        error: 'FORBIDDEN',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al validar permisos de actualización',
      error: error.message,
    });
  }
};

export const validateTeamStatusChange = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];

export const validateGetTeamById = [
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];

// Validación para cambio de manager (solo admin)
export const validateChangeTeamManager = [
  validateJWT,
  requireRole('ADMIN_ROLE'),
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  body('managerId')
    .notEmpty()
    .withMessage('El ID del manager es requerido')
    .isString()
    .withMessage('El ID del manager debe ser texto')
    .matches(/^[A-Za-z0-9_-]{6,64}$/)
    .withMessage('ID de manager inválido'),
  checkValidators,
];
