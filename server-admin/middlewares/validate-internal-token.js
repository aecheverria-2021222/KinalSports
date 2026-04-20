'use strict';

import crypto from 'crypto';
import { validateJWT } from './validate-JWT.js';

/**
 * Función auxiliar para comparar tokens en tiempo constante y prevenir timing attacks.
 */
const compareTokens = (tokenA, tokenB) => {
  if (!tokenA || !tokenB) return false;

  const bufferA = Buffer.from(tokenA);
  const bufferB = Buffer.from(tokenB);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
};

/**
 * Middleware para validar que la petición provenga de un servicio interno confiable.
 * Verifica el header 'x-internal-token'.
 */
export const validateInternalToken = (req, res, next) => {
  const internalToken = req.header('x-internal-token');
  const secretToken = process.env.INTERNAL_SERVICE_TOKEN;

  if (!secretToken) {
    console.warn('INTERNAL_SERVICE_TOKEN no está configurado en server-admin');
  }

  if (compareTokens(internalToken, secretToken)) {
    // Si el token es válido, identificamos la petición como de sistema/interno
    req.user = {
      id: 'SYSTEM_USER',
      role: 'INTERNAL_SERVICE',
    };
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Acceso denegado: Token interno inválido o ausente',
  });
};

/**
 * Middleware híbrido: Permite el acceso si el request tiene cualquiera de los siguientes:
 * 1. Un x-internal-token válido (Prioridad alta para inter-servicios)
 * 2. Un JWT de usuario válido (Para el frontend/clientes finales)
 *
 * Si ambos fallan, el middleware responde con 401.
 */
export const authOrInternal = (req, res, next) => {
  const internalToken = req.header('x-internal-token');
  const secretToken = process.env.INTERNAL_SERVICE_TOKEN;

  // Intentar validar primero el token interno (inter-service) con protección contra timing attacks
  if (compareTokens(internalToken, secretToken)) {
    req.user = {
      id: 'SYSTEM_USER',
      role: 'INTERNAL_SERVICE',
    };
    return next();
  }

  // Si no hay token interno válido, delegar a la validación de JWT tradicional
  return validateJWT(req, res, next);
};
