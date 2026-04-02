import type { Request, Response } from 'express';
import { listCategories } from '../services/category-service.js';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await listCategories();
  res.status(200).json({ success: true, data: categories });
};