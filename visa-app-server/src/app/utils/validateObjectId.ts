import { z } from 'zod';
import mongoose from 'mongoose';
import { AppError } from '../errors/error';
import httpStatus from '../config/httpStatus';


export const validateObjectId = (id: string |mongoose.Types.ObjectId, name: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid ${name} ID format.`);
  }
};

export const zodObjectIdField = (fieldName: string) =>
  z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: `${fieldName} must be a valid MongoDB ObjectId`,
  });
