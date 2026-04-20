import {
  fetchFields,
  fetchFieldById,
  createFieldRecord,
  updateFieldRecord,
  updateFieldStatus,
} from './field.service.js';

// Obtener todos los campos con paginación y filtros
export const getFields = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive = true } = req.query;
    const { fields, pagination } = await fetchFields({
      page,
      limit,
      isActive,
    });

    res.status(200).json({
      success: true,
      data: fields,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los campos',
      error: error.message,
    });
  }
};

// Obtener campo por ID
export const getFieldById = async (req, res) => {
  try {
    const { id } = req.params;
    const field = await fetchFieldById(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Campo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: field,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el campo',
      error: error.message,
    });
  }
};

// Crear nuevo campo
export const createField = async (req, res) => {
  try {
    const field = await createFieldRecord({
      fieldData: req.body,
      file: req.file,
    });

    res.status(201).json({
      success: true,
      message: 'Campo creado exitosamente',
      data: field,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear el campo',
      error: error.message,
    });
  }
};

// Actualizar campo
export const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const field = await updateFieldRecord({
      id,
      updateData: req.body,
      file: req.file,
    });

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Campo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campo actualizado exitosamente',
      data: field,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar el campo',
      error: error.message,
    });
  }
};

// Cambiar estado del campo (activar/desactivar)
export const changeFieldStatus = async (req, res) => {
  try {
    const { id } = req.params;
    // Detectar si es activate o deactivate desde la URL
    const isActive = req.url.includes('/activate');
    const action = isActive ? 'activado' : 'desactivado';
    const field = await updateFieldStatus({ id, isActive });

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Campo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: `Campo ${action} exitosamente`,
      data: field,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del campo',
      error: error.message,
    });
  }
};

// Eliminar campo permanentemente
