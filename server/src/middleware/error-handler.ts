import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';
import { AppError } from '../types/api.js';
import { frontendOrigins } from '../config/env.js';

const allowedOrigins = new Set(frontendOrigins);
const normalizeOrigin = (origin: string): string => origin.trim().replace(/\/+$/, '');

const applyCorsHeadersForError = (req: Request, res: Response): void => {
  const requestOrigin = req.header('origin');
  if (!requestOrigin) {
    return;
  }

  const normalized = normalizeOrigin(requestOrigin);
  if (!allowedOrigins.has(normalized)) {
    return;
  }

  res.header('Access-Control-Allow-Origin', normalized);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Vary', 'Origin');
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  applyCorsHeadersForError(req, res);

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

  if (err instanceof MulterError) {
    const isTooLarge = err.code === 'LIMIT_FILE_SIZE';
    res.status(isTooLarge ? 413 : 400).json({
      success: false,
      error: {
        message: isTooLarge ? 'Image must be 5MB or smaller' : err.message,
        code: isTooLarge ? 'IMAGE_TOO_LARGE' : 'UPLOAD_INVALID',
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    const field = firstIssue?.path?.join('.') || 'payload';
    let message = 'Invalid request payload';

    if (field === 'delivery_address') {
      message = 'Delivery address must be at least 5 characters long.';
    } else if (firstIssue) {
      message = `Invalid ${field}: ${firstIssue.message}`;
    }

    res.status(400).json({
      success: false,
      error: {
        message,
        code: 'VALIDATION_ERROR',
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
