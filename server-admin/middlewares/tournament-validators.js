'use strict';

import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './check-validators.js';

const TOURNAMENT_CATEGORIES = ['FUTBOL_7', 'FUTBOL_11'];
const TOURNAMENT_STATUSES = [
  'PENDIENTE',
  'EN PROGRESO',
  'TERMINADO',
  'CANCELADO',
];

export const validateCreateTournament = [
  validateJWT,
  body('tournamentsName')
    .trim()
    .notEmpty()
    .withMessage('El nombre del torneo es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('category')
    .notEmpty()
    .withMessage('La categoria del torneo es requerida')
    .isIn(TOURNAMENT_CATEGORIES)
    .withMessage('Categoria no valida'),
  body('startDate')
    .notEmpty()
    .withMessage('La fecha de inicio es requerida')
    .isISO8601()
    .withMessage('La fecha de inicio debe ser valida (ISO 8601)'),
  body('endDate')
    .notEmpty()
    .withMessage('La fecha de finalizacion es requerida')
    .isISO8601()
    .withMessage('La fecha de finalizacion debe ser valida (ISO 8601)'),
  body('teams').optional().isArray().withMessage('Teams debe ser un arreglo'),
  body('teams.*')
    .optional()
    .isMongoId()
    .withMessage('Cada team debe ser un ObjectId valido'),
  body('status')
    .optional()
    .isIn(TOURNAMENT_STATUSES)
    .withMessage('Estado no valido'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripcion no puede exceder 500 caracteres'),
  checkValidators,
];

export const validateUpdateTournamentRequest = [
  validateJWT,
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId valido de MongoDB'),
  body('tournamentsName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('category')
    .optional()
    .isIn(TOURNAMENT_CATEGORIES)
    .withMessage('Categoria no valida'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe ser valida (ISO 8601)'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de finalizacion debe ser valida (ISO 8601)'),
  body('teams').optional().isArray().withMessage('Teams debe ser un arreglo'),
  body('teams.*')
    .optional()
    .isMongoId()
    .withMessage('Cada team debe ser un ObjectId valido'),
  body('status')
    .optional()
    .isIn(TOURNAMENT_STATUSES)
    .withMessage('Estado no valido'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripcion no puede exceder 500 caracteres'),
  checkValidators,
];

export const validateTournamentStatusChange = [
  validateJWT,
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId valido de MongoDB'),
  checkValidators,
];

export const validateGetTournamentById = [
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId valido de MongoDB'),
  checkValidators,
];

export const validateDeleteTournament = [
  validateJWT,
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId valido de MongoDB'),
  checkValidators,
];
