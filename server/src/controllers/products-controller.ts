import type { Request, Response } from 'express';
import { AppError } from '../types/api.js';
import { getProductById, listProducts } from '../services/product-service.js';

export const getProducts = async (_req: Request, res: Response): Promise<void> => {
  const products = await listProducts();
  res.status(200).json({ success: true, data: products });
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  const productParam = req.params.id;
  const productId = Array.isArray(productParam) ? productParam[0] : productParam;
  if (!productId) {
    throw new AppError('Product id is required', 400, 'PRODUCT_ID_REQUIRED');
  }

  const product = await getProductById(productId);
  res.status(200).json({ success: true, data: product });
};
