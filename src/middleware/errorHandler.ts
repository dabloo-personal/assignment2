import type { ErrorRequestHandler } from 'express';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
