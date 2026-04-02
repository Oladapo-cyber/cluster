import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../types/api.js';

const extractToken = (req: Request): string | null => {
  const bearer = req.headers.authorization;
  if (bearer?.startsWith('Bearer ')) {
    return bearer.slice('Bearer '.length).trim();
  }

  const adminApiHeader = req.header('x-admin-api-key');
  if (adminApiHeader?.trim()) {
    return adminApiHeader.trim();
  }

  const headerToken = req.header('x-admin-key');
  return headerToken?.trim() || null;
};

export const adminAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);

  if (!token || token !== env.ADMIN_API_KEY) {
    next(new AppError('Unauthorized admin access', 401, 'ADMIN_UNAUTHORIZED'));
    return;
  }

  next();
};