// c:\gitIN6AM\KinalSports\client-user\src\shared\api\authClient.js
import axios from 'axios';
import { ENDPOINTS } from '../endpoints.js';

export const authClient = axios.create({
  baseURL: ENDPOINTS.AUTH,
  headers: {
    'Content-Type': 'application/json',
  },
});

// El authClient no requiere interceptores para inyectar tokens
// ya que maneja rutas públicas como login, register, etc.
