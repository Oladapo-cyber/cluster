import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { env } from '../config/env.js';
import { AppError } from '../types/api.js';
import { markOrderPaid } from '../services/order-service.js';
import { verifyPaystackTransaction } from '../services/paystack-service.js';

const verifyPaymentSchema = z.object({
  reference: z.string().min(1),
});

const paystackWebhookSchema = z.object({
  event: z.string(),
  data: z
    .object({
      reference: z.string().min(1).optional(),
      status: z.string().optional(),
    })
    .passthrough(),
});

export const postVerifyPaystackTransaction = async (req: Request, res: Response): Promise<void> => {
  const { reference } = verifyPaymentSchema.parse(req.body);
  const verification = await verifyPaystackTransaction(reference);

  if (verification.paid) {
    await markOrderPaid(verification.reference);
  }

  res.status(200).json({ success: true, data: verification });
};

export const postPaystackWebhook = async (req: Request, res: Response): Promise<void> => {
  const signature = req.header('x-paystack-signature')?.trim();
  const bodyRaw = (req as Request & { bodyRaw?: string }).bodyRaw;

  if (!signature || !bodyRaw) {
    throw new AppError('Invalid Paystack webhook signature', 401, 'PAYSTACK_WEBHOOK_UNAUTHORIZED');
  }

  const expectedSignature = crypto
    .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
    .update(bodyRaw)
    .digest('hex');

  if (signature !== expectedSignature) {
    throw new AppError('Invalid Paystack webhook signature', 401, 'PAYSTACK_WEBHOOK_UNAUTHORIZED');
  }

  const payload = paystackWebhookSchema.parse(req.body);
  const reference = payload.data.reference;

  if (payload.event === 'charge.success' && reference) {
    await markOrderPaid(reference);
  }

  res.status(200).json({ success: true, data: { received: true } });
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
