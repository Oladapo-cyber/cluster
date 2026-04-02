import type { Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../types/api.js';
import {
  archiveProduct,
  createProduct,
  getProductByIdAdmin,
  listProductsAdmin,
  updateProduct,
} from '../services/product-service.js';

const productIdSchema = z.string().uuid();

const createProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  full_description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  price_kobo: z.number().int().nonnegative(),
  category_id: z.string().uuid().nullable().optional(),
  is_active: z.boolean().optional(),
});

const updateProductSchema = createProductSchema.partial();

const omitUndefined = <T extends Record<string, unknown>>(input: T): Partial<T> => {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as Partial<T>;
};

export const getAdminProducts = async (_req: Request, res: Response): Promise<void> => {
  const products = await listProductsAdmin();
  res.status(200).json({ success: true, data: products });
};

export const getAdminProduct = async (req: Request, res: Response): Promise<void> => {
  const productId = productIdSchema.parse(req.params.id);
  const product = await getProductByIdAdmin(productId);
  res.status(200).json({ success: true, data: product });
};

export const postAdminProduct = async (req: Request, res: Response): Promise<void> => {
  const payload = createProductSchema.parse(req.body);
  const product = await createProduct(payload);
  res.status(201).json({ success: true, data: product });
};

export const putAdminProduct = async (req: Request, res: Response): Promise<void> => {
  const productId = productIdSchema.parse(req.params.id);
  const payload = omitUndefined(updateProductSchema.parse(req.body));

  if (Object.keys(payload).length === 0) {
    throw new AppError('At least one product field is required', 400, 'PRODUCT_UPDATE_EMPTY');
  }

  const product = await updateProduct(productId, payload);
  res.status(200).json({ success: true, data: product });
};

export const deleteAdminProduct = async (req: Request, res: Response): Promise<void> => {
  const productId = productIdSchema.parse(req.params.id);
  const product = await archiveProduct(productId);
  res.status(200).json({ success: true, data: product });
};