import { Router } from 'express';
import { postVerifyPaystackTransaction } from '../controllers/payments-controller.js';

export const paymentsRouter = Router();

paymentsRouter.post('/payments/paystack/verify', postVerifyPaystackTransaction);
