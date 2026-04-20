'use strict';

import {
  findOrCreateProfile,
  updateProfile,
  updateAvatarUrl,
} from './user.service.js';

/**
 * Obtener perfil del usuario autenticado.
 */
export const getMyProfile = async (req, res) => {
  try {
    const authId = req.user.id;
    const profile = await findOrCreateProfile(authId);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error en getMyProfile controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener tu perfil de usuario',
      error: error.message,
    });
  }
};

/**
 * Actualizar perfil del propio usuario.
 */
export const updateMyProfile = async (req, res) => {
  try {
    const authId = req.user.id;
    const { displayName, phone, favoriteSports } = req.body;

    const updatedProfile = await updateProfile(authId, {
      displayName,
      phone,
      favoriteSports,
    });

    return res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error en updateMyProfile controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar tu perfil',
      error: error.message,
    });
  }
};

/**
 * Subir o actualizar foto de perfil.
 */
export const uploadAvatar = async (req, res) => {
  try {
    const authId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha proporcionado ninguna imagen',
      });
    }

    // req.file.path contendrá la URL de Cloudinary si el middleware está configurado
    const avatarUrl = req.file.path;
    const profile = await updateAvatarUrl(authId, avatarUrl);

    return res.status(200).json({
      success: true,
      message: 'Avatar actualizado exitosamente',
      data: profile,
    });
  } catch (error) {
    console.error('Error en uploadAvatar controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al subir el avatar del usuario',
      error: error.message,
    });
  }
};
