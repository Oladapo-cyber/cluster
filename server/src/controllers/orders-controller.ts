import type { Request, Response } from 'express';
import { z } from 'zod';
import { createOrder, createOrderForAuthenticatedUser } from '../services/order-service.js';
import type { AuthenticatedRequest } from '../middleware/user-auth.js';

const createOrderSchema = z.object({
  customer_email: z.string().email(),
  customer_name: z.string().min(2),
  customer_phone: z.string().min(8),
  delivery_address: z.string().min(5),
  delivery_location: z.enum(['Mainland', 'Island']),
  items: z
    .array(
      z.object({
        product_slug: z.string().min(1).optional(),
        product_id: z.string().uuid().optional(),
        quantity: z.number().int().positive(),
      }).refine((item) => Boolean(item.product_slug ?? item.product_id), {
        message: 'Either product_slug or product_id is required',
      }),
    )
    .min(1),
});

const createAuthenticatedOrderSchema = z.object({
  customer_name: z.string().min(2).optional(),
  customer_phone: z.string().min(8).optional(),
  delivery_address: z.string().min(5).optional(),
  delivery_location: z.enum(['Mainland', 'Island']).optional(),
  items: z
    .array(
      z.object({
        product_slug: z.string().min(1).optional(),
        product_id: z.string().uuid().optional(),
        quantity: z.number().int().positive(),
      }).refine((item) => Boolean(item.product_slug ?? item.product_id), {
        message: 'Either product_slug or product_id is required',
      }),
    )
    .min(1),
});

export const postOrder = async (req: Request, res: Response): Promise<void> => {
  const payload = createOrderSchema.parse(req.body);
  const order = await createOrder(payload);

  res.status(201).json({ success: true, data: order });
};

export const postAuthenticatedOrder = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  const payload = createAuthenticatedOrderSchema.parse(req.body);
  const order = await createOrderForAuthenticatedUser(authReq.user.id, authReq.user.email, payload);

  res.status(201).json({ success: true, data: order });
};
