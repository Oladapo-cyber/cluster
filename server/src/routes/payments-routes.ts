import { Router } from 'express';
import { getPaystackPublicKey, postVerifyPaystackTransaction } from '../controllers/payments-controller.js';

export const paymentsRouter = Router();

paymentsRouter.get('/payments/paystack/public-key', getPaystackPublicKey);
paymentsRouter.post('/payments/paystack/verify', postVerifyPaystackTransaction);
