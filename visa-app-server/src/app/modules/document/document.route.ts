import express, { Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

import { FOLDERS } from '../../constant';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { UploadService } from '../upload/upload.service';
import { upload } from '../../config/upload';

const router = express.Router();

/**
 * @route   POST /api/v1/document/upload
 * @desc    Upload a single file to Cloudinary
 * @access  Private (though no auth middleware yet, you may want to add it)
 */
router.post(
    '/upload',
    upload.single('file'),
    catchAsync(async (req: Request, res: Response) => {
        if (!req.file) {
            throw new AppError(httpStatus.BAD_REQUEST, 'No file uploaded');
        }

        // Upload to Cloudinary using the service
        const result = await UploadService.uploadSingleFile(req.file, {
            folder: FOLDERS.DOCUMENTS,
        });

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'File uploaded successfully to Cloudinary',
            data: {
                url: result.secure_url,
                publicId: result.public_id,
                fileName: result.original_filename,
                format: result.format,
                size: result.bytes,
            },
        });
    }),
);

export const DocumentRoutes = router;
