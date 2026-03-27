import type { Request, Response } from 'express';
import { env } from '../config/env.js';

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {
      service: 'clusta-api',
      status: 'ok',
      env: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
};
