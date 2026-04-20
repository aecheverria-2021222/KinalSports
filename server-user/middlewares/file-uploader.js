import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

dotenv.config();

// Configuración de Cloudinary v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/avif',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Almacenamiento en memoria (sin disco, compatible con cloudinary v2)
const memoryStorage = multer.memoryStorage();

const createMemoryUploader = () =>
  multer({
    storage: memoryStorage,
    fileFilter: (req, file, cb) => {
      if (MIMETYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Solo se permiten imágenes: ${MIMETYPES.join(', ')}`));
      }
    },
    limits: { fileSize: MAX_FILE_SIZE },
  });

/**
 * Sube un buffer a Cloudinary v2 y devuelve el public_id resultante.
 */
export const uploadBufferToCloudinary = (buffer, folder, originalName) => {
  return new Promise((resolve, reject) => {
    const fileExt = extname(originalName);
    const baseName = originalName
      .replace(fileExt, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '');
    const shortUuid = uuidv4().substring(0, 8);
    const publicId = `${baseName}-${shortUuid}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'avif'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

// Uploader reutilizable para campos deportivos y equipos
export const uploadFieldImage = createMemoryUploader();
export const uploadTeamImage = createMemoryUploader();

export { cloudinary };
