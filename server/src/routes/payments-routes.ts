import { Router } from 'express';
import {
	getPaystackPublicKey,
	postPaystackWebhook,
	postVerifyPaystackTransaction,
} from '../controllers/payments-controller.js';

export const paymentsRouter = Router();

paymentsRouter.get('/payments/paystack/public-key', getPaystackPublicKey);
paymentsRouter.post('/payments/paystack/verify', postVerifyPaystackTransaction);
paymentsRouter.post('/payments/paystack/webhook', postPaystackWebhook);
