import { body, param } from 'express-validator';
import { validateJWT } from './validate-JWT.js';
import { checkValidators } from './handle-errors.js';
import { validateEndTimeAfterStartTime } from '../helpers/validation-helpers.js';

// Validaciones para crear reservación (POST /)
export const validateCreateReservation = [
  validateJWT,
  body('fieldId')
    .isMongoId()
    .withMessage('fieldId debe ser un ObjectId válido de MongoDB'),
  body('startTime')
    .isISO8601()
    .withMessage('startTime debe ser una fecha ISO8601 válida'),
  body('endTime')
    .isISO8601()
    .withMessage('endTime debe ser una fecha ISO8601 válida'),
  body('endTime').custom(validateEndTimeAfterStartTime),
  checkValidators,
];

// Validaciones para cancelar reservación (PUT /:id/cancel)
export const validateCancelReservation = [
  validateJWT,
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];
