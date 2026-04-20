import { cloudinary } from './file-uploader.js';

// Middleware normal: registra un listener para borrar el archivo si la respuesta termina con error (>=400)
export const cleanupUploadedFileOnFinish = (req, res, next) => {
  // Solo registra si hubo upload
  if (req.file) {
    res.on('finish', async () => {
      try {
        if (res.statusCode >= 400) {
          const publicId = req.file.public_id || req.file.filename;
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log(
              `Archivo Cloudinary eliminado por respuesta ${res.statusCode}: ${publicId}`
            );
          }
        }
      } catch (e) {
        console.error(
          `Error al eliminar archivo de Cloudinary tras error de respuesta: ${e.message}`
        );
      }
    });
  }

  next();
};

// Middleware de manejo de errores (fallback): si algún middleware llama next(err), intenta borrar
export const deleteFileOnError = async (err, req, res, next) => {
  try {
    if (req.file) {
      const publicId = req.file.public_id || req.file.filename;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        console.log(
          `Archivo Cloudinary eliminado por error en cadena: ${publicId}`
        );
      }
    }
  } catch (unlinkErr) {
    console.error(
      `Error al eliminar archivo de Cloudinary (error handler): ${unlinkErr.message}`
    );
    // no interrumpir el flujo de error original
  }
  return next(err);
};
