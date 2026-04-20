import { body, param, query } from 'express-validator';

// Validaciones para Teams
export const createTeamValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Team name must be between 2 and 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('category')
    .notEmpty()
    .withMessage('Team category is required')
    .isIn(['Juvenil', 'Adulto', 'Senior', 'Mixto'])
    .withMessage('Invalid team category'),

  body('sport')
    .notEmpty()
    .withMessage('Sport is required')
    .isIn(['Fútbol', 'Baloncesto', 'Voleibol'])
    .withMessage('Invalid sport'),

  body('members')
    .isArray({ min: 2 })
    .withMessage('Team must have at least 2 members'),

  body('members.*.type')
    .notEmpty()
    .withMessage('Member type is required')
    .isIn(['registered', 'guest'])
    .withMessage('Invalid member type'),

  body('members.*.userId')
    .if(body('members.*.type').equals('registered'))
    .notEmpty()
    .withMessage('User ID is required for registered members')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  body('members.*.guestData.name')
    .if(body('members.*.type').equals('guest'))
    .trim()
    .notEmpty()
    .withMessage('Guest name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Guest name must be between 2 and 100 characters'),

  body('members.*.guestData.cui')
    .if(body('members.*.type').equals('guest'))
    .trim()
    .notEmpty()
    .withMessage('CUI is required for guest members')
    .matches(/^\d{13}$/)
    .withMessage('CUI must be exactly 13 digits'),

  body('members.*.position')
    .notEmpty()
    .withMessage('Position is required')
    .isIn(['Portero', 'Defensa', 'Mediocampista', 'Delantero'])
    .withMessage('Invalid position'),

  body('members.*.jerseyNumber')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Jersey number must be between 1 and 99'),
];

export const updateTeamValidation = [
  param('id').isMongoId().withMessage('Invalid team ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Team name must be between 2 and 50 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('category')
    .optional()
    .isIn(['Juvenil', 'Adulto', 'Senior', 'Mixto'])
    .withMessage('Invalid team category'),

  body('sport')
    .optional()
    .isIn(['Fútbol', 'Baloncesto', 'Voleibol'])
    .withMessage('Invalid sport'),
];

export const addMemberValidation = [
  param('id').isMongoId().withMessage('Invalid team ID'),

  body('type')
    .notEmpty()
    .withMessage('Member type is required')
    .isIn(['registered', 'guest'])
    .withMessage('Invalid member type'),

  body('userId')
    .if(body('type').equals('registered'))
    .notEmpty()
    .withMessage('User ID is required for registered members')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  body('guestData.name')
    .if(body('type').equals('guest'))
    .trim()
    .notEmpty()
    .withMessage('Guest name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Guest name must be between 2 and 100 characters'),

  body('guestData.cui')
    .if(body('type').equals('guest'))
    .trim()
    .notEmpty()
    .withMessage('CUI is required for guest members')
    .matches(/^\d{13}$/)
    .withMessage('CUI must be exactly 13 digits'),

  body('position')
    .notEmpty()
    .withMessage('Position is required')
    .isIn(['Portero', 'Defensa', 'Mediocampista', 'Delantero'])
    .withMessage('Invalid position'),

  body('jerseyNumber')
    .optional()
    .isInt({ min: 1, max: 99 })
    .withMessage('Jersey number must be between 1 and 99'),
];

// Validaciones para Reservations
export const createReservationValidation = [
  body('fieldId')
    .notEmpty()
    .withMessage('Field is required')
    .isMongoId()
    .withMessage('Invalid field ID'),

  body('customerInfo.name')
    .notEmpty()
    .withMessage('Customer name is required')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),

  body('customerInfo.email')
    .notEmpty()
    .withMessage('Customer email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('customerInfo.phone')
    .notEmpty()
    .withMessage('Customer phone is required')
    .trim()
    .isLength({ min: 8, max: 15 })
    .withMessage('Phone must be between 8 and 15 characters'),

  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be in ISO format')
    .custom((value) => {
      const reservationDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (reservationDate < today) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),

  body('startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),

  body('endTime')
    .notEmpty()
    .withMessage('End time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format')
    .custom((endTime, { req }) => {
      if (req.body.startTime) {
        const startMinutes = timeToMinutes(req.body.startTime);
        const endMinutes = timeToMinutes(endTime);
        if (endMinutes <= startMinutes) {
          throw new Error('End time must be after start time');
        }
        const duration = endMinutes - startMinutes;
        if (duration < 30) {
          throw new Error('Minimum reservation duration is 30 minutes');
        }
        if (duration > 480) {
          throw new Error('Maximum reservation duration is 8 hours');
        }
      }
      return true;
    }),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

export const updateReservationValidation = [
  param('id').isMongoId().withMessage('Invalid reservation ID'),

  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO format')
    .custom((value) => {
      const reservationDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (reservationDate < today) {
        throw new Error('Reservation date cannot be in the past');
      }
      return true;
    }),

  body('startTime')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),

  body('endTime')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status'),
];

// Validaciones para Tournament Registration
export const createTournamentRegistrationValidation = [
  body('tournament')
    .notEmpty()
    .withMessage('Tournament is required')
    .isMongoId()
    .withMessage('Invalid tournament ID'),

  body('team')
    .notEmpty()
    .withMessage('Team is required')
    .isMongoId()
    .withMessage('Invalid team ID'),

  body('registrationFee')
    .notEmpty()
    .withMessage('Registration fee is required')
    .isFloat({ min: 0 })
    .withMessage('Registration fee cannot be negative'),

  body('teamRoster')
    .isArray({ min: 7, max: 25 })
    .withMessage('Team roster must have between 7 and 25 players'),

  body('teamRoster.*.type')
    .notEmpty()
    .withMessage('Player type is required')
    .isIn(['registered', 'guest'])
    .withMessage('Invalid player type'),

  body('teamRoster.*.position')
    .notEmpty()
    .withMessage('Position is required')
    .isIn(['Portero', 'Defensa', 'Mediocampista', 'Delantero'])
    .withMessage('Invalid position'),

  body('teamRoster.*.jerseyNumber')
    .notEmpty()
    .withMessage('Jersey number is required')
    .isInt({ min: 1, max: 99 })
    .withMessage('Jersey number must be between 1 and 99'),

  body('teamRoster.*.isCaptain')
    .optional()
    .isBoolean()
    .withMessage('isCaptain must be boolean')
    .custom((value, { req }) => {
      // Verificar que hay exactamente un capitán
      const captains = req.body.teamRoster.filter((player) => player.isCaptain);
      if (captains.length !== 1) {
        throw new Error('Team roster must have exactly one captain');
      }
      return true;
    }),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

export const uploadDocumentValidation = [
  param('id').isMongoId().withMessage('Invalid registration ID'),

  body('type')
    .notEmpty()
    .withMessage('Document type is required')
    .isIn(['medical_certificate', 'identification', 'photo', 'other'])
    .withMessage('Invalid document type'),

  body('fileName').trim().notEmpty().withMessage('File name is required'),

  body('fileUrl')
    .trim()
    .notEmpty()
    .withMessage('File URL is required')
    .isURL()
    .withMessage('Invalid file URL'),
];

// Validaciones de consulta
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const dateRangeValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in ISO format'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in ISO format'),
];

// Validaciones de parámetros comunes
export const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

export const mongoIdWithMemberValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  param('memberId').isMongoId().withMessage('Invalid member ID format'),
];

// Función auxiliar para convertir tiempo a minutos
function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}
