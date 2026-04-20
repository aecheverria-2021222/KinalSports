'use strict';

import Field from './field.model.js';

/**
 * Servicio para manejar la lógica de datos de campos deportivos.
 */
export const fetchFields = async ({
  page = 1,
  limit = 10,
  isActive = true,
}) => {
  const filter = { isActive };

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const fields = await Field.find(filter)
    .limit(limitNumber)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const total = await Field.countDocuments(filter);

  return {
    fields,
    pagination: {
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalRecords: total,
      limit: limitNumber,
    },
  };
};

export const fetchFieldById = async (id) => {
  return await Field.findById(id);
};
