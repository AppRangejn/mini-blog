import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { ValidationError } from 'yup';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      message: 'Validation error',
      errors: err.errors,
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
  });
};
