import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const adminClient = axios.create({
  baseURL: process.env.ADMIN_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de servicio interno
adminClient.interceptors.request.use(
  (config) => {
    const internalToken = process.env.INTERNAL_SERVICE_TOKEN;
    if (internalToken) {
      config.headers['x-internal-token'] = internalToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminClient;
