import type { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { AppError } from '../types/api.js';
import { markOrderPaid } from '../services/order-service.js';
import { verifyPaystackTransaction } from '../services/paystack-service.js';

const verifyPaymentSchema = z.object({
  reference: z.string().min(1),
});

export const postVerifyPaystackTransaction = async (req: Request, res: Response): Promise<void> => {
  const { reference } = verifyPaymentSchema.parse(req.body);
  const verification = await verifyPaystackTransaction(reference);

  if (verification.paid) {
    await markOrderPaid(verification.reference);
  }

  res.status(200).json({ success: true, data: verification });
};

export const getPaystackPublicKey = (_req: Request, res: Response): void => {
  if (!env.PAYSTACK_PUBLIC_KEY) {
    throw new AppError('Paystack public key is not configured', 500, 'PAYSTACK_PUBLIC_KEY_MISSING');
  }

  res.status(200).json({
    success: true,
    data: {
      public_key: env.PAYSTACK_PUBLIC_KEY,
    },
  });
};
