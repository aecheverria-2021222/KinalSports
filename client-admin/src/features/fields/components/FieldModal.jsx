import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFieldsStore } from '../../users/store/adminStore';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { useSaveField } from '../../fields/hooks/useSaveField';
import { showSuccess, showError } from '../../../shared/utils/toast.js';

export const FieldModal = ({ isOpen, onClose, field }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const { saveField } = useSaveField();
  const loading = useFieldsStore((state) => state.loading);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (field) {
        reset({
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          capacity: field.capacity,
          pricePerHour: field.pricePerHour,
          description: field.description,
        });
        setPreview(field.photo);
      } else {
        reset({
          fieldName: '',
          fieldType: '',
          capacity: '',
          pricePerHour: '',
          description: '',
          photo: null,
        });
        setPreview(null);
      }
    }
  }, [isOpen, field, reset]);

  useEffect(() => {
    // Use subscription pattern to avoid memoization issues
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((value, { name }) => {
      if (name === 'photo' && value.photo && value.photo.length > 0) {
        setPreview(URL.createObjectURL(value.photo[0]));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    try {
      await saveField(data, field?._id);
      showSuccess(field ? 'Campo actualizado correctamente' : 'Campo creado correctamente');
      reset();
      setPreview(null);
      onClose();
    } catch {
      showError('Error al guardar el campo');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4'>
      {/* CONTENEDOR */}
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden'>
        {/* HEADER */}
        <div
          className='p-4 sm:p-5 text-white sticky top-0 z-10'
          style={{
            background: 'linear-gradient(90deg, var(--main-blue) 0%, #1956a3 100%)',
          }}
        >
          <h2 className='text-xl sm:text-2xl font-bold'>
            {field ? 'Editar Campo' : 'Nuevo Campo'}
          </h2>
          <p className='text-xs sm:text-sm opacity-80'>Completa la información de la cancha</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className='p-4 sm:p-6 space-y-5 overflow-y-auto'>
          {/* PREVIEW */}
          <div className='flex justify-center'>
            <div className='w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-gray-100 border flex items-center justify-center overflow-hidden shadow-inner'>
              {preview ? (
                <img src={preview} className='w-full h-full object-cover' />
              ) : (
                <span className='text-gray-400 text-xs sm:text-sm'>Sin imagen</span>
              )}
            </div>
          </div>

          {/* INPUTS */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Nombre */}
            <div className='flex flex-col md:col-span-2'>
              <label className='text-sm font-semibold text-gray-700 mb-1'>Nombre del campo</label>
              <input
                className='w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-gray-50 shadow-sm 
                                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition'
                placeholder='Ej. Cancha Central'
                {...register('fieldName', {
                  required: 'El nombre es obligatorio',
                  minLength: {
                    value: 3,
                    message: 'Debe tener al menos 3 caracteres',
                  },
                })}
              />
              {errors.fieldName && (
                <p className='text-red-600 text-xs mt-1'>{errors.fieldName.message}</p>
              )}
            </div>

            {/* Tipo */}
            <div className='flex flex-col'>
              <label className='text-sm font-semibold text-gray-700 mb-1'>Tipo de cancha</label>
              <select
                className='w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-gray-50 shadow-sm 
                                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition'
                {...register('fieldType', {
                  required: 'El tipo es obligatorio',
                })}
              >
                <option value=''>Seleccione un tipo</option>
                <option value='SINTETICA'>Sintética</option>
                <option value='CONCRETO'>Concreto</option>
                <option value='NATURAL'>Natural</option>
              </select>
              {errors.fieldType && (
                <p className='text-red-600 text-xs mt-1'>{errors.fieldType.message}</p>
              )}
            </div>

            {/* Capacidad */}
            <div className='flex flex-col'>
              <label className='text-sm font-semibold text-gray-700 mb-1'>Capacidad</label>
              <select
                className='w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-gray-50 shadow-sm 
                                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition'
                {...register('capacity', {
                  required: 'La capacidad es obligatoria',
                })}
              >
                <option value=''>Seleccione capacidad</option>
                <option value='FUTBOL_5'>Fútbol 5</option>
                <option value='FUTBOL_7'>Fútbol 7</option>
                <option value='FUTBOL_11'>Fútbol 11</option>
              </select>
              {errors.capacity && (
                <p className='text-red-600 text-xs mt-1'>{errors.capacity.message}</p>
              )}
            </div>

            {/* Precio */}
            <div className='flex flex-col'>
              <label className='text-sm font-semibold text-gray-700 mb-1'>Precio por hora</label>
              <input
                type='number'
                className='w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-gray-50 shadow-sm 
                                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition'
                placeholder='Q100'
                {...register('pricePerHour', {
                  required: 'El precio es obligatorio',
                  min: { value: 1, message: 'Debe ser mayor a 0' },
                })}
              />
              {errors.pricePerHour && (
                <p className='text-red-600 text-xs mt-1'>{errors.pricePerHour.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className='flex flex-col md:col-span-2'>
              <label className='text-sm font-semibold text-gray-700 mb-1'>Descripción</label>
              <textarea
                className='w-full px-3 py-2 rounded-lg border-2 border-gray-300 bg-gray-50 shadow-sm 
                                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition'
                placeholder='Detalles del campo...'
                {...register('description', {
                  required: 'La descripción es obligatoria',
                })}
              />
              {errors.description && (
                <p className='text-red-600 text-xs mt-1'>{errors.description.message}</p>
              )}
            </div>

            {/* Imagen */}
            <div className='flex flex-col md:col-span-2'>
              <label className='text-sm font-semibold text-gray-700 mb-1'>Imagen del campo</label>
              <input
                type='file'
                className='w-full px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 
                                hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition cursor-pointer'
                accept='image/*'
                {...register('photo')}
              />
            </div>
          </div>

          {/* BOTONES */}
          <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t'>
            <button
              type='button'
              onClick={() => {
                reset();
                setPreview(null);
                onClose();
              }}
              className='w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition'
            >
              Cancelar
            </button>

            <button
              type='submit'
              className='w-full sm:w-auto px-5 py-2 rounded-lg text-white font-medium transition shadow'
              style={{
                background: 'linear-gradient(90deg, var(--main-blue) 0%, #1956a3 100%)',
                border: 'none',
              }}
            >
              {loading ? <Spinner small /> : field ? 'Guardar cambios' : 'Crear campo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
