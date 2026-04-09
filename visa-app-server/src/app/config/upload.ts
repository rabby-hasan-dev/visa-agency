import { Request } from 'express';
import multer from 'multer';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

import config from '../config';
import { uploadToCloudinary, removeFromCloudinary, ICloudinaryUploadOptions } from '../config/cloudinary';

/**
 * Multer Storage Strategy (Memory Storage for Direct Cloudinary Stream)
 */
const storage = multer.memoryStorage();

/**
 * Multer Upload Factory
 * Creates a customized Multer instance based on file types and size limits
 */
export const createMulterUpload = (
    allowedMimeTypes: readonly string[] = config.file_types.ANY,
    maxFileSize: number = config.upload_max_file_size
) => {
    return multer({
        storage: storage,
        limits: {
            fileSize: maxFileSize,
        },
        fileFilter: (req: Request, file, cb) => {
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new AppError(httpStatus.BAD_REQUEST, `Invalid file type: ${file.mimetype}. Allowed: ${allowedMimeTypes.join(', ')}`) as any, false);
            }
        },
    });
};

/**
 * Standard Upload Instances (Centralized Config)
 */
export const upload = createMulterUpload(config.file_types.ANY);
export const uploadImages = createMulterUpload(config.file_types.IMAGES, 5 * 1024 * 1024); // Specialized overrides if needed
export const uploadDocuments = createMulterUpload(config.file_types.DOCUMENTS, 20 * 1024 * 1024);

/**
 * Batch Upload to Cloudinary Helper
 * Handles both arrays (req.files as array) and objects (req.files with fields)
 */
export const uploadBatchToCloudinary = async (
    files: Request['files'],
    options: ICloudinaryUploadOptions = {}
) => {
    let fileArray: Express.Multer.File[] = [];

    if (Array.isArray(files)) {
        fileArray = files;
    } else if (files && typeof files === 'object') {
        fileArray = Object.values(files).flat() as Express.Multer.File[];
    }

    const uploadPromises = fileArray.map(file =>
        uploadToCloudinary(file.buffer, {
            ...options,
            // Prefixing timestamp to ensure uniqueness within folders
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        })
    );

    return Promise.all(uploadPromises);
};

// Unified Export
export { uploadToCloudinary, removeFromCloudinary };
export type { ICloudinaryUploadOptions };
