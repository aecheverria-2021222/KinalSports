import { useFieldsStore } from '../../users/store/adminStore.js';

export const useSaveField = () => {
  const createField = useFieldsStore((state) => state.createField);
  const updateField = useFieldsStore((state) => state.updateField);

  const saveField = async (data, fieldId = null) => {
    const formData = new FormData();

    formData.append('fieldName', data.fieldName);
    formData.append('description', data.description);
    formData.append('fieldType', data.fieldType);
    formData.append('pricePerHour', data.pricePerHour);
    formData.append('capacity', data.capacity);

    if (data.photo?.length > 0) {
      formData.append('image', data.photo[0]);
    }

    if (fieldId) {
      await updateField(fieldId, formData);
    } else {
      await createField(formData);
    }
  };

  return { saveField };
};
