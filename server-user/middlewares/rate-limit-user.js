'use strict';

import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

/**
 * Limitador General por Usuario (100 peticiones / 15 min)
 * Se utiliza para operaciones comunes de lectura de equipos y torneos.
 */
export const generalUserLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por usuario en la ventana definida.
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req), // Si no está autenticado, fallback a la IP compatible con IPv6
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        'Demasiadas solicitudes en operaciones generales, intenta más tarde',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Limitador de Reservas por Usuario (10 peticiones / 1 h)
 * Aplicado específicamente a la creación y gestión de reservaciones (acción costosa).
 */
export const reservationLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Límite estricto de 10 peticiones de reserva por usuario por hora.
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req),
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        'Límite de reservaciones alcanzado por esta hora, intenta más tarde',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
