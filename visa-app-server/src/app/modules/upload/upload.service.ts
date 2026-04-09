import { ICloudinaryUploadOptions, removeFromCloudinary, uploadToCloudinary, extractPublicIdFromUrl } from "../../config/cloudinary";
import { uploadBatchToCloudinary } from "../../config/upload";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";


/**
 * Upload Service
 * Handles interaction with Cloudinary via the centralized utility
 */
const uploadSingleFile = async (file: Express.Multer.File, options: ICloudinaryUploadOptions = {}) => {
    return await uploadToCloudinary(file.buffer, {
        ...options,
        // Default naming strategy: folder/timestamp-filename
        public_id: options.public_id || `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
    });
};

const uploadMultipleFiles = async (files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined, options: ICloudinaryUploadOptions = {}) => {
    return await uploadBatchToCloudinary(files, options);
};

const removeSingleFile = async (publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') => {
  try {
    return await removeFromCloudinary(publicId, resourceType);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Cloudinary file removal failed';
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, errorMessage);
  }
};

export const UploadService = {
    uploadSingleFile,
    uploadMultipleFiles,
    removeSingleFile,
    extractPublicIdFromUrl,
};
