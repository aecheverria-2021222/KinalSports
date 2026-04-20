'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  generalUserLimit,
  reservationLimit,
} from '../middlewares/rate-limit-user.js';

import fieldRoutes from '../src/fields/field.routes.js';

import reservationRoutes from '../src/reservations/reservation.routes.js';
import teamRoutes from '../src/teams/team.routes.js';
import tournamentRoutes from '../src/tournaments/tournament.routes.js';
import userRoutes from '../src/users/user.routes.js';

const BASE_PATH = '/kinalSportsUser/v1';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(requestLimit);
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  // Rutas públicas
  app.use(`${BASE_PATH}/fields`, fieldRoutes);

  // Aplicar middleware de autenticación JWT para el resto de módulos
  app.use(authMiddleware);

  // Rutas protegidas (Requieren token)
  app.use(`${BASE_PATH}/users`, userRoutes);
  app.use(`${BASE_PATH}/reservations`, reservationLimit, reservationRoutes);
  app.use(`${BASE_PATH}/teams`, generalUserLimit, teamRoutes);
  app.use(`${BASE_PATH}/tournaments`, generalUserLimit, tournamentRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'KinalSports User Server',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint no encontrado en User API',
    });
  });
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT;
  app.set('trust proxy', 1);

  try {
    await dbConnection();
    middlewares(app);
    routes(app);

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`KinalSports User Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}${BASE_PATH}/health`);
    });
  } catch (err) {
    console.error(`Error starting User Server: ${err.message}`);
    process.exit(1);
  }
};
