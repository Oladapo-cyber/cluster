import type { Request, Response } from 'express';
import { z } from 'zod';
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
