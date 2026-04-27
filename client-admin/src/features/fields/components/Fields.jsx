import { useEffect, useState } from 'react';
import { useFieldsStore } from '../../users/store/adminStore';
import { Spinner } from '../../auth/components/Spinner.jsx';
import { FieldModal } from './FieldModal.jsx';
import { useUIStore } from '../../auth/store/uiStore.js';
import { useEffect as useToastEffect } from 'react';
import { showError } from '../../../shared/utils/toast.js';

export const Fields = () => {
  const { fields, loading, error, getFields, deleteField } = useFieldsStore();
  const [openModal, setOpenModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const { openConfirm } = useUIStore();

  useEffect(() => {
    getFields();
  }, [getFields]);

  // Mostrar toast de error si existe
  useToastEffect(() => {
    if (error) showError(error);
  }, [error]);

  if (loading) return <Spinner />;

  return (
    <div className='p-4'>
      {/* HEADER */}
      <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-main-blue'>Gestión de Canchas</h1>
          <p className='text-gray-500 text-sm'>Administra las canchas registradas</p>
        </div>

        <button
          className='bg-main-blue px-4 py-2 rounded text-white hover:opacity-90 transition'
          onClick={() => {
            setSelectedField(null);
            setOpenModal(true);
          }}
        >
          + Agregar Campo
        </button>
      </div>

      {/* GRID RESPONSIVE */}
      <div className='grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        {fields.map((field) => (
          <div
            key={field._id}
            className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-[1.02]'
          >
            {/* IMAGEN */}
            <div className='w-full h-52 bg-gray-100 flex items-center justify-center'>
              <img
                src={field.photo}
                alt={field.fieldName}
                className='max-h-full max-w-full object-contain rounded-t-xl'
              />
            </div>

            {/* CONTENIDO */}
            <div className='p-5'>
              <h2 className='text-xl font-bold text-main-blue'>{field.fieldName}</h2>

              {/* BADGES */}
              <div className='flex gap-2 mt-2 flex-wrap'>
                <span className='px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium'>
                  {field.capacity.replace('_', ' ')}
                </span>

                <span className='px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium'>
                  Q{field.pricePerHour}/hora
                </span>
              </div>

              {/* INFO */}
              <p className='text-sm text-gray-400 mt-2 truncate'>ID: {field._id}</p>

              {/* BOTONES */}
              <div className='flex gap-3 mt-5'>
                <button
                  className='flex-1 py-2 rounded-lg bg-main-blue text-white font-medium hover:opacity-90 transition'
                  onClick={() => {
                    setSelectedField(field);
                    setOpenModal(true);
                  }}
                >
                  Editar
                </button>

                <button
                  className='flex-1 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition'
                  onClick={() =>
                    openConfirm({
                      title: 'Eliminar campo',
                      message: `¿Eliminar ${field.fieldName}?`,
                      onConfirm: () => deleteField(field._id),
                    })
                  }
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FieldModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedField(null);
        }}
        field={selectedField}
      />
    </div>
  );
};
