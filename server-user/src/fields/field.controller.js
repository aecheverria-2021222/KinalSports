'use strict';

import { fetchFields, fetchFieldById } from './field.service.js';

/**
 * Obtener todos los campos con paginación y filtros.
 */
export const getFields = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive = true } = req.query;

    const { fields, pagination } = await fetchFields({
      page,
      limit,
      isActive,
    });

    return res.status(200).json({
      success: true,
      data: fields,
      pagination,
    });
  } catch (error) {
    console.error('Error en getFields controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los campos deportivos',
      error: error.message,
    });
  }
};

/**
 * Obtener campo por ID.
 */
export const getFieldById = async (req, res) => {
  try {
    const { id } = req.params;
    const field = await fetchFieldById(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Campo deportivo no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      data: field,
    });
  } catch (error) {
    console.error('Error en getFieldById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el detalle del campo deportivo',
      error: error.message,
    });
  }
};
