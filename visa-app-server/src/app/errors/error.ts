import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};



const handleDuplicateError = (err: unknown): TGenericErrorResponse => {
  const duplicateError = err as { keyValue?: Record<string, string | number> };
  const statusCode = 409; // 409 Conflict is more semantically correct for duplicate key errors
  // Get the duplicate key name and value
  const duplicateKey = Object.keys(duplicateError.keyValue || {})[0] || 'Unknown field';
  const duplicateValue = duplicateError.keyValue?.[duplicateKey] || 'Unknown value';


  const errorSources: TErrorSources = [
    {
      path: duplicateKey,
      message: `A record with this ${duplicateKey} (${duplicateValue}) already exists.Please use a different value.`,
    },
  ];

  return {
    statusCode,
    message: `Duplicate entry detected: ${duplicateKey} with the value (${duplicateValue}) already exists.`,
    errorSources,
  };
};

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

// const handleZodError = (err: ZodError): TGenericErrorResponse => {
//   const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
//     return {
//       path: issue?.path[issue.path.length - 1],
//       message: issue.message,
//     };
//   });

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Validation Error',
//     errorSources,
//   };
// };

 
//  without nested zod filed error 

// const handleZodError = (err: ZodError): TGenericErrorResponse => {
//   const errorSources: TErrorSources = err.issues.map((issue: ZodError['issues'][number]) => {
//     return {
//       path: typeof issue.path[issue.path.length - 1] === 'symbol'
//         ? String(issue.path[issue.path.length - 1]) // convert symbol safely
//         : (issue.path[issue.path.length - 1] as string | number),
//       message: issue.message,
//     };
//   });

//   const statusCode = 400;

//   return {
//     statusCode,
//     message: 'Zod Validation Error',
//     errorSources,
//   };
// };


//  nested zod filed error 

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodError['issues'][number]) => {
    return {
      path: issue.path.length > 0 ? issue.path.join('.') : 'root',
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Zod Validation Error',
    errorSources,
  };
};


export const error = {
  handleCastError,
  handleDuplicateError,
  handleValidationError,
  handleZodError,
};
