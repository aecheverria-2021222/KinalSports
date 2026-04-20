import multer from 'multer';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

dotenv.config();

// Configuración de Cloudinary
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

const createCloudinaryUploader = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      // Obtener nombre base sin extensión y sanitizarlo
      const fileExt = extname(file.originalname);
      const baseName = file.originalname.replace(fileExt, '');
      const safeBase = baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '');

      // UUID corto para evitar colisiones
      const shortUuid = uuidv4().substring(0, 8);
      const publicId = `${safeBase}-${shortUuid}`;

      return {
        folder: folder,
        public_id: publicId, // no incluir extensión; Cloudinary la calcula
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'avif'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
        resource_type: 'image',
      };
    },
  });

  return multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (MIMETYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Solo se permiten imágenes: ${MIMETYPES.join(', ')}`));
      }
    },
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });
};

// Uploader para imágenes de campos deportivos
export const uploadFieldImage = createCloudinaryUploader(
  process.env.CLOUDINARY_FOLDER || 'kinal_sports_in6am/fields'
);

// Uploader para imágenes de Equipos deportivos
export const uploadTeamImage = createCloudinaryUploader(
  process.env.CLOUDINARY_TEAMS_FOLDER || 'kinal_sports_in6am/teams'
);

// Export cloudinary instance para usar en delete-file-on-error
export { cloudinary };
