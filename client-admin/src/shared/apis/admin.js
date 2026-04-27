import { axiosAdmin } from './api';

export const getFields = async () => {
  return await axiosAdmin.get('/fields');
};

export const createField = async (formData) => {
  // Al pasar un tercer parámetro, Axios reemplaza el application/json
  // solo para esta petición en específico.
  return await axiosAdmin.post('/fields', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateField = async (id, data) => {
  return await axiosAdmin.put(`/fields/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteField = async (id) => {
  return await axiosAdmin.put(`/fields/${id}/deactivate`);
};
