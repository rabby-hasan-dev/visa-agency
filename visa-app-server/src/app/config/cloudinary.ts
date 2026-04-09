import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '.';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import { TFolder } from '../constant';
import { SettingsServices } from '../modules/settings/settings.service';

/**
 * Cloudinary configuration — Dynamic
 */
const getCloudinaryConfig = async () => {
  const dynamic = await SettingsServices.getDecryptedCloudinaryConfig();
  
  return {
    cloud_name: dynamic.cloudName || config.cloudinary_cloud_name || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: dynamic.apiKey || config.cloudinary_api_key || process.env.CLOUDINARY_API_KEY,
    api_secret: dynamic.apiSecret || config.cloudinary_api_secret || process.env.CLOUDINARY_API_SECRET,
    secure: true,
  };
};

/**
 * Ensures the singleton is updated with DB settings before use
 */
const ensureConfigured = async () => {
    const freshConfig = await getCloudinaryConfig();
    if (freshConfig.cloud_name && freshConfig.api_key && freshConfig.api_secret) {
        cloudinary.config(freshConfig);
    }
};

/**
 * Interface for upload options
 */
export interface ICloudinaryUploadOptions {
  folder?: TFolder | string;
  public_id?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  overwrite?: boolean;
  invalidate?: boolean;
  [key: string]: unknown;
}

/**
 * Upload a file to Cloudinary
 * Supports both file paths and Buffers
 */
export const uploadToCloudinary = async (
  file: string | Buffer,
  options: ICloudinaryUploadOptions = {}
): Promise<UploadApiResponse> => {
  await ensureConfigured();
  
  return new Promise((resolve, reject) => {
    const { folder = 'media', ...otherOptions } = options;

    const projectFolder = folder.startsWith('visa_app/')
      ? folder
      : `visa_app/${folder}`;

    const uploadOptions = {
      resource_type: 'auto' as const,
      ...otherOptions,
      folder: projectFolder,
    };

    if (typeof file === 'string') {
      cloudinary.uploader.upload(file, uploadOptions, (error, result) => {
        if (error) {
          return reject(new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Cloudinary upload failed'));
        }
        resolve(result as UploadApiResponse);
      });
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          return reject(new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Cloudinary upload failed'));
        }
        resolve(result as UploadApiResponse);
      });
      uploadStream.end(file);
    }
  });
};

/**
 * Remove a file from Cloudinary using its public ID
 */
export const removeFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<unknown> => {
  await ensureConfigured();
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Cloudinary file removal failed';
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, errorMessage);
  }
};

/**
 * Extracts Cloudinary Public ID from a full URL
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    const publicId = lastDotIndex === -1 ? publicIdWithExt : publicIdWithExt.substring(0, lastDotIndex);
    return publicId;
  } catch {
    return null;
  }
};

export default cloudinary;
