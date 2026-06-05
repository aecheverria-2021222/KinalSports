// c:/gitIN6AM/KinalSports/client-user/src/features/fields/hooks/useFields.js
import { useState, useCallback, useEffect } from 'react';
import userClient from '../../../shared/api/userClient.js';

export const useFields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFields = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/fields');
      const data = response.data?.data || response.data || [];
      const mappedFields = data.map(field => ({
        ...field,
        name: field.fieldName || field.name,
        image: field.photo || field.image,
        location: `${field.fieldType || ''} • ${field.capacity || ''}`,
        isAvailable: Boolean(field.isActive)
      }));
      setFields(mappedFields);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener las canchas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return { fields, loading, error, refetch: fetchFields };
};
