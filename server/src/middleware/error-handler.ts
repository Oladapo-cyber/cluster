import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../types/api.js';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Unexpected server error';
  res.status(500).json({
    success: false,
    error: {
      message,
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};
