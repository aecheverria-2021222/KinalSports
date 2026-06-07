// c:\gitIN6AM\KinalSports\client-user\src\features\fields\hooks\useFields.js
import { useState, useCallback, useEffect } from 'react';
import { userClient } from '../../../shared/api/userClient.js';

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
      
      const normalizedFields = data.map(item => ({
        ...item,
        id: item._id || item.id,
        name: item.fieldName,
        image: item.photo,
        location: `${item.fieldType} • ${item.capacity}`,
        isAvailable: Boolean(item.isActive)
      }));
      
      setFields(normalizedFields);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las canchas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return { fields, loading, error, refetch: fetchFields };
};
