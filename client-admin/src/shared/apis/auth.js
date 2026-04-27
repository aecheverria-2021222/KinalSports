import { axiosAuth } from './api.js';

export const login = async (data) => {
  return await axiosAuth.post('/auth/login', data);
};

export const getAllUsers = async () => {
  const { data } = await axiosAuth.get('/auth/users');
  return { users: data };
};

export const register = async (data) => {
  return await axiosAuth.post('/auth/register', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
