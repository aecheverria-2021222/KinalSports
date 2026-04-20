import dotenv from 'dotenv';
import { initServer } from './configs/app.js';

// Configurar variables de entorno
dotenv.config();

// Manejar errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception in Admin Server:', err);
  process.exit(1);
});

// Manejar promesas rechazadas no manejadas
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', err);
  process.exit(1);
});
// Inicializar servidor admin
console.log('Starting KinalSports Admin Server...');
initServer();